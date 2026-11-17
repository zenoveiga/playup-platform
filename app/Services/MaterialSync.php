<?php

namespace App\Services;

use App\Models\CourseMaterial;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\UploadedFile;
use App\Support\Media;

/**
 * Sincroniza a lista de materiais (vídeos, apostilas, links, arquivos) de um módulo
 * ou de um curso livre: cria, atualiza, substitui arquivos e remove os itens ausentes.
 *
 * Cada item: id?, slot?, category?, type, title, description?, source (upload|url), url?,
 * file? (upload pelo PHP) ou upload_key? (envio direto ao bucket), duration_minutes?
 */
class MaterialSync
{
    /**
     * @param  Model  $owner  Modelo com relação morphMany materials()
     * @param  array<int, array<string, mixed>>  $items
     */
    public function sync(Model $owner, array $items, string $directory, ?int $userId = null): void
    {
        $keep = [];

        foreach (array_values($items) as $position => $item) {
            /** @var CourseMaterial|null $material */
            $material = ! empty($item['id'])
                ? $owner->materials()->whereKey($item['id'])->first()
                : null;
            $material ??= $owner->materials()->make();

            $type = $item['type'] ?? 'file';
            $source = $type === 'link' ? 'url' : ($item['source'] ?? 'upload');

            $material->fill([
                'slot' => $item['slot'] ?? null,
                'category' => $item['category'] ?? null,
                'type' => $type,
                'title' => $item['title'] ?? '',
                'description' => $item['description'] ?? null,
                'duration_minutes' => $item['duration_minutes'] ?? null,
                'position' => $position,
            ]);

            $file = $item['file'] ?? null;
            $uploadKey = $item['upload_key'] ?? null;

            if ($source === 'url') {
                $this->forgetFile($material);
                $material->url = $item['url'] ?? null;
            } elseif ($uploadKey && $userId) {
                $this->forgetFile($material);
                $material->fill(Media::claimDirectUpload($uploadKey, $userId, $directory));
                $material->url = null;
            } elseif ($file instanceof UploadedFile) {
                $this->forgetFile($material);
                $material->file_path = Media::store($file, $directory);
                $material->file_name = $file->getClientOriginalName();
                $material->mime_type = $file->getClientMimeType();
                $material->file_size = $file->getSize();
                $material->url = null;
            }

            $material->save();
            $keep[] = $material->id;
        }

        $owner->materials()->whereNotIn('id', $keep)->get()->each->delete();
    }

    private function forgetFile(CourseMaterial $material): void
    {
        Media::delete($material->file_path);

        $material->file_path = null;
        $material->file_name = null;
        $material->mime_type = null;
        $material->file_size = null;
    }
}
