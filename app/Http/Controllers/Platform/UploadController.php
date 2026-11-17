<?php

namespace App\Http\Controllers\Platform;

use App\Http\Controllers\Controller;
use App\Support\Media;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

/**
 * Entrega URLs pré-assinadas para o navegador enviar arquivos direto ao bucket S3,
 * sem passar pelos limites de upload do PHP.
 */
class UploadController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        if (! Media::supportsDirectUploads()) {
            return response()->json(['direct' => false], 409);
        }

        $data = $request->validate([
            'kind' => 'required|in:video,document,file,image',
            'filename' => 'required|string|max:255',
            'content_type' => 'required|string|max:150',
            'size' => 'required|integer|min:1',
        ]);

        $limits = [
            'video' => config('playup.uploads.max_video_kb'),
            'image' => config('playup.uploads.max_cover_kb'),
            'document' => config('playup.uploads.max_file_kb'),
            'file' => config('playup.uploads.max_file_kb'),
        ];

        if ($data['size'] > $limits[$data['kind']] * 1024) {
            throw ValidationException::withMessages([
                'size' => 'O arquivo "'.$data['filename'].'" excede o tamanho máximo permitido ('.round($limits[$data['kind']] / 1024).' MB).',
            ]);
        }

        if ($data['kind'] === 'video' && ! str_starts_with($data['content_type'], 'video/')) {
            throw ValidationException::withMessages(['content_type' => 'O arquivo "'.$data['filename'].'" não é um vídeo.']);
        }
        if ($data['kind'] === 'image' && ! str_starts_with($data['content_type'], 'image/')) {
            throw ValidationException::withMessages(['content_type' => 'A capa precisa ser uma imagem.']);
        }

        return response()->json([
            'direct' => true,
            ...Media::prepareDirectUpload(
                $request->user()->id,
                $data['kind'],
                $data['filename'],
                $data['content_type'],
                $data['size'],
            ),
        ]);
    }
}
