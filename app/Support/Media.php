<?php

namespace App\Support;

use Illuminate\Contracts\Filesystem\Filesystem;
use Illuminate\Filesystem\AwsS3V3Adapter;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

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
     *
     * @param  array<string, string>  $headers  Cabeçalhos da resposta do S3, ex.: ResponseContentDisposition
     */
    public static function url(?string $path, array $headers = []): ?string
    {
        if (! $path) {
            return null;
        }

        $disk = static::disk();

        if (config('playup.media.visibility') === 'private' && $disk->providesTemporaryUrls()) {
            return $disk->temporaryUrl($path, now()->addMinutes(config('playup.media.url_ttl_minutes')), $headers);
        }

        return $disk->url($path);
    }

    /**
     * URL que abre o arquivo no navegador quando ele sabe exibir (PDF) e baixa os demais
     * com o nome original.
     */
    public static function viewUrl(?string $path, ?string $fileName = null, ?string $mimeType = null): ?string
    {
        if (! $path) {
            return null;
        }

        $name = $fileName ?: basename($path);
        $isPdf = $mimeType === 'application/pdf' || str_ends_with(strtolower($name), '.pdf') || str_ends_with(strtolower($path), '.pdf');
        $encoded = rawurlencode($name);
        $ascii = str_replace(['"', '\\'], '', \Illuminate\Support\Str::ascii($name));

        return static::url($path, $isPdf
            ? ['ResponseContentType' => 'application/pdf', 'ResponseContentDisposition' => "inline; filename=\"{$ascii}\"; filename*=UTF-8''{$encoded}"]
            : ['ResponseContentDisposition' => "attachment; filename=\"{$ascii}\"; filename*=UTF-8''{$encoded}"]);
    }

    /*
    |--------------------------------------------------------------------------
    | Envio direto do navegador para o bucket (URL pré-assinada)
    |--------------------------------------------------------------------------
    | Arquivos grandes (vídeos) não passam pelo PHP: o navegador envia direto ao S3
    | numa área temporária ("uploads/") e o formulário manda só a chave. Ao salvar,
    | o servidor confere a chave e move o arquivo para a pasta definitiva.
    */

    public static function supportsDirectUploads(): bool
    {
        $disk = static::disk();

        // O adaptador S3 do Laravel gera URLs de envio, mas providesTemporaryUploadUrls()
        // devolve false para ele (só olha o adaptador interno do Flysystem).
        return $disk instanceof AwsS3V3Adapter || $disk->providesTemporaryUploadUrls();
    }

    /**
     * Gera a URL pré-assinada e registra o envio pendente para o usuário.
     *
     * @return array{key: string, url: string, headers: array<string, mixed>}
     */
    public static function prepareDirectUpload(int $userId, string $kind, string $filename, string $contentType, int $size): array
    {
        $safeName = Str::limit(Str::slug(pathinfo($filename, PATHINFO_FILENAME)) ?: 'arquivo', 80, '')
            .'.'.strtolower(pathinfo($filename, PATHINFO_EXTENSION) ?: 'bin');
        $key = static::prefixed('uploads/'.Str::uuid().'/'.$safeName);

        $upload = static::disk()->temporaryUploadUrl(
            $key,
            now()->addMinutes(config('playup.uploads.direct_url_ttl_minutes')),
            ['ContentType' => $contentType]
        );

        Cache::put(static::pendingCacheKey($key), [
            'user_id' => $userId,
            'kind' => $kind,
            'file_name' => $filename,
            'content_type' => $contentType,
            'size' => $size,
        ], now()->addHours(6));

        return ['key' => $key, 'url' => $upload['url'], 'headers' => $upload['headers'] ?? []];
    }

    /** Envio pendente válido para este usuário (ou null se expirou / não pertence a ele). */
    public static function pendingUpload(?string $key, int $userId): ?array
    {
        if (! $key) {
            return null;
        }
        $pending = Cache::get(static::pendingCacheKey($key));

        return $pending && $pending['user_id'] === $userId ? $pending : null;
    }

    /**
     * Confirma um envio direto: confere se o arquivo chegou ao bucket, move para a pasta
     * definitiva e devolve os metadados para salvar no banco.
     *
     * @return array{file_path: string, file_name: string, mime_type: string, file_size: int}
     */
    public static function claimDirectUpload(string $key, int $userId, string $directory): array
    {
        $pending = static::pendingUpload($key, $userId);
        $disk = static::disk();

        if (! $pending || ! $disk->exists($key)) {
            throw new \RuntimeException('O envio do arquivo expirou ou não foi concluído. Envie o arquivo novamente.');
        }

        $final = static::prefixed($directory).'/'.basename(dirname($key)).'-'.basename($key);
        $disk->move($key, $final);
        if (config('playup.media.visibility') === 'public') {
            $disk->setVisibility($final, 'public');
        }
        Cache::forget(static::pendingCacheKey($key));

        return [
            'file_path' => $final,
            'file_name' => $pending['file_name'],
            'mime_type' => $pending['content_type'],
            'file_size' => $disk->size($final),
        ];
    }

    private static function pendingCacheKey(string $key): string
    {
        return 'playup:pending-upload:'.sha1($key);
    }

    private static function prefixed(string $directory): string
    {
        $prefix = trim((string) config('playup.media.prefix'), '/');

        return $prefix === '' ? $directory : $prefix.'/'.$directory;
    }
}
