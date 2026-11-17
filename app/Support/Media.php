<?php

namespace App\Support;

use Illuminate\Contracts\Filesystem\Filesystem;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

/**
 * Ponto único de acesso aos arquivos de mídia da plataforma
 * (vídeos, capas, apostilas e demais materiais), armazenados no bucket S3.
 */
class Media
{
    public static function disk(): Filesystem
    {
        return Storage::disk(config('playup.media.disk'));
    }

    /** Envia o arquivo ao bucket e devolve o caminho (key) salvo. */
    public static function store(UploadedFile $file, string $directory): string
    {
        $path = static::disk()->putFile(
            static::prefixed($directory),
            $file,
            ['visibility' => config('playup.media.visibility')]
        );

        if ($path === false) {
            throw new \RuntimeException('Não foi possível enviar o arquivo para o armazenamento.');
        }

        return $path;
    }

    public static function delete(?string $path): void
    {
        if ($path) {
            static::disk()->delete($path);
        }
    }

    /**
     * URL para exibir/baixar o arquivo. Em bucket privado, gera uma URL assinada temporária.
     */
    public static function url(?string $path): ?string
    {
        if (! $path) {
            return null;
        }

        $disk = static::disk();

        if (config('playup.media.visibility') === 'private' && $disk->providesTemporaryUrls()) {
            return $disk->temporaryUrl($path, now()->addMinutes(config('playup.media.url_ttl_minutes')));
        }

        return $disk->url($path);
    }

    private static function prefixed(string $directory): string
    {
        $prefix = trim((string) config('playup.media.prefix'), '/');

        return $prefix === '' ? $directory : $prefix.'/'.$directory;
    }
}
