<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use App\Support\Media;

class CourseMaterial extends Model
{
    public const TYPES = ['video', 'document', 'link', 'file'];

    protected $fillable = [
        'slot',
        'category',
        'type',
        'title',
        'description',
        'file_path',
        'file_name',
        'mime_type',
        'file_size',
        'url',
        'duration_minutes',
        'position',
    ];

    protected $appends = ['file_url'];

    protected static function booted(): void
    {
        static::deleting(function (CourseMaterial $material) {
            Media::delete($material->file_path);
        });
    }

    public function materialable(): MorphTo
    {
        return $this->morphTo();
    }

    public function getFileUrlAttribute(): ?string
    {
        // Vídeos tocam no player; PDFs abrem no navegador; os demais arquivos baixam com o nome original.
        return $this->type === 'video'
            ? Media::url($this->file_path)
            : Media::viewUrl($this->file_path, $this->file_name, $this->mime_type);
    }
}
