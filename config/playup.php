<?php

return [
    /*
    | Armazenamento de mídia (vídeos, capas, apostilas e demais materiais).
    | Por padrão tudo vai para o bucket S3 configurado em AWS_BUCKET (disco "s3").
    | Com visibilidade "private" o bucket pode manter o bloqueio de acesso público:
    | os arquivos são servidos por URLs assinadas que expiram.
    */
    'media' => [
        'disk' => env('PLAYUP_MEDIA_DISK', 's3'),
        'visibility' => env('PLAYUP_MEDIA_VISIBILITY', 'private'), // private | public
        'url_ttl_minutes' => (int) env('PLAYUP_MEDIA_URL_TTL', 240),
        'prefix' => env('PLAYUP_MEDIA_PREFIX', ''),
    ],

    /*
    | Limites de upload (em KB) para o construtor de cursos.
    | Lembre-se de ajustar também upload_max_filesize / post_max_size no PHP
    | e client_max_body_size no proxy (nginx) para aceitar vídeos grandes.
    */
    /*
    | Categorias sugeridas para os vídeos de um módulo. O admin também pode digitar
    | uma categoria nova; as já usadas passam a ser sugeridas automaticamente.
    */
    'video_categories' => ['Conceito', 'Exemplo', 'Erros comuns', 'Revisão', 'Estudo de caso', 'Dica rápida'],

    'uploads' => [
        'max_video_kb' => (int) env('PLAYUP_MAX_VIDEO_KB', 1024 * 1024), // 1 GB
        'max_file_kb' => (int) env('PLAYUP_MAX_FILE_KB', 100 * 1024),    // 100 MB
        'max_cover_kb' => (int) env('PLAYUP_MAX_COVER_KB', 5 * 1024),     // 5 MB
    ],
];
