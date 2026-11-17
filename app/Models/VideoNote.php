<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VideoNote extends Model
{
    protected $fillable = ['student_id', 'course_id', 'course_material_id', 'timestamp_seconds', 'body'];

    protected function casts(): array
    {
        return ['timestamp_seconds' => 'integer'];
    }

    public function video(): BelongsTo
    {
        return $this->belongsTo(CourseMaterial::class, 'course_material_id');
    }
}
