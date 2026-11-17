<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Support\Facades\Storage;

class CourseMaterial extends Model
{
    public const TYPES = ['video', 'document', 'link', 'file'];

    protected $fillable = [
        'slot',
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
            if ($material->file_path) {
                Storage::disk('public')->delete($material->file_path);
            }
        });
    }

    public function materialable(): MorphTo
    {
        return $this->morphTo();
    }

    public function getFileUrlAttribute(): ?string
    {
        return $this->file_path ? Storage::disk('public')->url($this->file_path) : null;
    }
}
