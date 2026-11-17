<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\DB;

/**
 * Regras de aprovação, bloqueio e desbloqueio de licenciados (com cascata opcional para alunos).
 */
class LicenseeAccess
{
    public function approve(User $licensee, User $admin): void
    {
        $licensee->forceFill([
            'status' => User::STATUS_ACTIVE,
            'approved_at' => now(),
            'approved_by' => $admin->id,
            'blocked_reason' => null,
        ])->save();
    }

    public function reject(User $licensee, ?string $reason): void
    {
        $licensee->forceFill([
            'status' => 'rejected',
            'blocked_reason' => $reason,
        ])->save();
    }

    public function block(User $licensee, ?string $reason, bool $extendToStudents): void
    {
        DB::transaction(function () use ($licensee, $reason, $extendToStudents) {
            $licensee->forceFill([
                'status_before_block' => $licensee->isBlocked()
                    ? $licensee->status_before_block
                    : $licensee->status,
                'status' => User::STATUS_BLOCKED,
                'blocked_at' => $licensee->blocked_at ?? now(),
                'blocked_reason' => $reason,
                'block_extends_to_students' => $extendToStudents,
            ])->save();

            if ($extendToStudents) {
                $this->blockStudents($licensee);
            } else {
                $this->restoreStudents($licensee);
            }
        });
    }

    public function unblock(User $licensee): void
    {
        DB::transaction(function () use ($licensee) {
            $licensee->forceFill([
                'status' => $licensee->status_before_block ?: User::STATUS_ACTIVE,
                'status_before_block' => null,
                'blocked_at' => null,
                'blocked_reason' => null,
                'block_extends_to_students' => false,
            ])->save();

            $this->restoreStudents($licensee);
        });
    }

    private function blockStudents(User $licensee): void
    {
        $licensee->students()
            ->where('status', '!=', User::STATUS_BLOCKED)
            ->get()
            ->each(function (User $student) {
                $student->forceFill([
                    'status_before_block' => $student->status,
                    'status' => User::STATUS_BLOCKED,
                    'blocked_at' => now(),
                    'blocked_via_licensee' => true,
                ])->save();
            });
    }

    private function restoreStudents(User $licensee): void
    {
        $licensee->students()
            ->where('blocked_via_licensee', true)
            ->get()
            ->each(function (User $student) {
                $student->forceFill([
                    'status' => $student->status_before_block ?: User::STATUS_ACTIVE,
                    'status_before_block' => null,
                    'blocked_at' => null,
                    'blocked_via_licensee' => false,
                ])->save();
            });
    }
}
