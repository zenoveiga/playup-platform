<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

#[Fillable([
    'name', 'email', 'password', 'role', 'phone', 'status', 'avatar',
    'licensee_id', 'approved_at', 'approved_by', 'blocked_at', 'blocked_reason',
    'block_extends_to_students', 'blocked_via_licensee', 'status_before_block',
])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /** Administrador da plataforma (nível mais alto). */
    public const ROLE_PLATFORM_ADMIN = 'super_admin';

    /** Papéis que representam um licenciado (painéis de gestão escolar existentes). */
    public const LICENSEE_ROLES = ['admin', 'school_admin'];

    /** Papel atribuído a quem se cadastra como licenciado. */
    public const ROLE_LICENSEE_SIGNUP = 'school_admin';

    public const STATUS_ACTIVE = 'active';
    public const STATUS_INACTIVE = 'inactive';
    public const STATUS_PENDING = 'pending';
    public const STATUS_BLOCKED = 'blocked';

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'approved_at' => 'datetime',
            'blocked_at' => 'datetime',
            'block_extends_to_students' => 'boolean',
            'blocked_via_licensee' => 'boolean',
            'password' => 'hashed',
        ];
    }

    public function isPlatformAdmin(): bool
    {
        return $this->role === self::ROLE_PLATFORM_ADMIN;
    }

    public function isLicensee(): bool
    {
        return in_array($this->role, self::LICENSEE_ROLES, true);
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isSchoolAdmin(): bool
    {
        return $this->role === 'school_admin';
    }

    public function isStudent(): bool
    {
        return $this->role === 'student';
    }

    public function isPending(): bool
    {
        return $this->status === self::STATUS_PENDING;
    }

    public function isBlocked(): bool
    {
        return $this->status === self::STATUS_BLOCKED;
    }

    public function scopeLicensees(Builder $query): Builder
    {
        return $query->whereIn('role', self::LICENSEE_ROLES);
    }

    public function scopePlatformAdmins(Builder $query): Builder
    {
        return $query->where('role', self::ROLE_PLATFORM_ADMIN);
    }

    /** Licenciado ao qual o aluno pertence. */
    public function licensee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'licensee_id');
    }

    /** Alunos vinculados ao licenciado. */
    public function students(): HasMany
    {
        return $this->hasMany(User::class, 'licensee_id')->where('role', 'student');
    }

    /** Cursos que o aluno adquiriu (acessos). */
    public function enrollments(): HasMany
    {
        return $this->hasMany(Enrollment::class, 'student_id');
    }

    /** Vendas feitas pelo licenciado. */
    public function sales(): HasMany
    {
        return $this->hasMany(Sale::class, 'licensee_id');
    }

    /** O aluno tem acesso válido ao curso agora? */
    public function hasAccessTo(Course $course): bool
    {
        return $this->enrollments()->active()->where('course_id', $course->id)->exists();
    }

    /** Tabelas de preços do licenciado. */
    public function priceTables(): HasMany
    {
        return $this->hasMany(PriceTable::class, 'owner_id');
    }

    /** Campanhas do licenciado. */
    public function campaigns(): HasMany
    {
        return $this->hasMany(Campaign::class, 'licensee_id');
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}
