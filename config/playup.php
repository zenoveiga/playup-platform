<?php

return [
    /*
    | Limites de upload (em KB) para o construtor de cursos.
    | Lembre-se de ajustar também upload_max_filesize / post_max_size no PHP
    | e client_max_body_size no proxy (nginx) para aceitar vídeos grandes.
    */
    'uploads' => [
        'max_video_kb' => (int) env('PLAYUP_MAX_VIDEO_KB', 1024 * 1024), // 1 GB
        'max_file_kb' => (int) env('PLAYUP_MAX_FILE_KB', 100 * 1024),    // 100 MB
        'max_cover_kb' => (int) env('PLAYUP_MAX_COVER_KB', 5 * 1024),     // 5 MB
    ],
];
