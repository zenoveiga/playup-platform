<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    $user = auth()->user();
    if ($user->role === 'admin') {
        return redirect()->route('admin.dashboard');
    } elseif ($user->role === 'school_admin') {
        return redirect()->route('school-admin.dashboard');
    } else {
        return redirect()->route('student.dashboard');
    }
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Admin/Dashboard');
    })->name('dashboard');

    Route::get('/alunos', function () {
        $students = \App\Models\User::where('role', 'student')->get();
        return Inertia::render('Admin/Students', [
            'students' => $students
        ]);
    })->name('students.index');

    Route::post('/alunos', function (\Illuminate\Http\Request $request) {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'phone' => 'nullable|string|max:20',
            'status' => 'required|string|in:active,inactive',
        ]);

        \App\Models\User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'status' => $validated['status'],
            'password' => bcrypt('password'), // default password
            'role' => 'student',
        ]);

        return redirect()->back();
    })->name('students.store');

    Route::get('/courses', function () {
        return Inertia::render('Admin/CoursesAndPackages');
    })->name('courses.index');
});

Route::middleware(['auth', 'role:school_admin'])->prefix('school-admin')->name('school-admin.')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('SchoolAdmin/Dashboard');
    })->name('dashboard');

    Route::get('/alunos', function () {
        $students = \App\Models\User::where('role', 'student')->get();
        return Inertia::render('Admin/Students', [
            'students' => $students
        ]);
    })->name('students.index');

    Route::post('/alunos', function (\Illuminate\Http\Request $request) {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'phone' => 'nullable|string|max:20',
            'status' => 'required|string|in:active,inactive',
        ]);

        \App\Models\User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'status' => $validated['status'],
            'password' => bcrypt('password'), // default password
            'role' => 'student',
        ]);

        return redirect()->back();
    })->name('students.store');
});

Route::middleware(['auth', 'role:student'])->prefix('student')->name('student.')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Student/Dashboard');
    })->name('dashboard');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
