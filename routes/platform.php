<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Platform\CourseController;
use App\Http\Controllers\Platform\DashboardController;
use App\Http\Controllers\Platform\LicenseeController;
use App\Http\Controllers\Platform\ModuleController;
use App\Http\Controllers\Platform\PlatformUserController;
use App\Http\Controllers\Platform\UploadController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Painel do Administrador da Plataforma (/administrador)
|--------------------------------------------------------------------------
*/

Route::prefix('administrador')->name('platform.')->group(function () {
    Route::middleware('guest')->group(function () {
        Route::get('login', [AuthenticatedSessionController::class, 'createPlatform'])->name('login');
        Route::post('login', [AuthenticatedSessionController::class, 'storePlatform'])->name('login.store');
    });

    Route::middleware(['auth', 'role:super_admin'])->group(function () {
        Route::get('/', fn () => redirect()->route('platform.dashboard'));
        Route::get('dashboard', DashboardController::class)->name('dashboard');

        // Licenciados: aprovação, reprovação, bloqueio e desbloqueio
        Route::get('licenciados', [LicenseeController::class, 'index'])->name('licensees.index');
        Route::post('licenciados/{licensee}/aprovar', [LicenseeController::class, 'approve'])->name('licensees.approve');
        Route::post('licenciados/{licensee}/reprovar', [LicenseeController::class, 'reject'])->name('licensees.reject');
        Route::post('licenciados/{licensee}/bloquear', [LicenseeController::class, 'block'])->name('licensees.block');
        Route::post('licenciados/{licensee}/desbloquear', [LicenseeController::class, 'unblock'])->name('licensees.unblock');

        // Usuários do painel administrativo
        Route::get('usuarios', [PlatformUserController::class, 'index'])->name('users.index');
        Route::post('usuarios', [PlatformUserController::class, 'store'])->name('users.store');
        Route::put('usuarios/{user}', [PlatformUserController::class, 'update'])->name('users.update');
        Route::post('usuarios/{user}/bloquear', [PlatformUserController::class, 'block'])->name('users.block');
        Route::post('usuarios/{user}/desbloquear', [PlatformUserController::class, 'unblock'])->name('users.unblock');
        Route::delete('usuarios/{user}', [PlatformUserController::class, 'destroy'])->name('users.destroy');

        // URL pré-assinada para envio direto de arquivos ao bucket S3
        Route::post('uploads', [UploadController::class, 'store'])->name('uploads.store');

        // Biblioteca de módulos e cursos (uploads usam POST + _method=PUT)
        Route::resource('modulos', ModuleController::class)
            ->parameters(['modulos' => 'module'])
            ->names('modules')
            ->except('show');
        Route::resource('cursos', CourseController::class)
            ->parameters(['cursos' => 'course'])
            ->names('courses')
            ->except('show');
    });
});
