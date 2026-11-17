<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('playup:media-check', function () {
    $disk = config('playup.media.disk');
    $this->info("Testando o disco de mídia \"{$disk}\" (bucket: ".config("filesystems.disks.{$disk}.bucket", '-').')...');

    if ($disk === 's3' && blank(config('filesystems.disks.s3.key'))) {
        $this->error('AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY não estão definidos no .env.');

        return 1;
    }

    $path = 'healthchecks/'.Illuminate\Support\Str::uuid().'.txt';

    try {
        $media = App\Support\Media::disk();
        if (! $media->put($path, 'playup ok', ['visibility' => config('playup.media.visibility')])) {
            throw new RuntimeException('o envio foi recusado (verifique credenciais, região e permissões s3:PutObject).');
        }
        $ok = $media->get($path) === 'playup ok';
        $url = App\Support\Media::url($path);
        $media->delete($path);
    } catch (Throwable $e) {
        $this->error('Falhou: '.$e->getMessage());

        return 1;
    }

    if (! $ok) {
        $this->error('O arquivo foi enviado, mas a leitura não confere.');

        return 1;
    }

    $this->info('Escrita, leitura, URL ('.parse_url($url, PHP_URL_HOST).') e exclusão OK.');

    return 0;
})->purpose('Verifica se o armazenamento de mídia (S3) está acessível');
