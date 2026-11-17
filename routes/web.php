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
    if ($user->isPlatformAdmin()) {
        return redirect()->route('platform.dashboard');
    } elseif ($user->role === 'admin') {
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
        $students = \App\Models\User::where('role', 'student')
            ->where('licensee_id', auth()->id())
            ->latest()
            ->get();
        return Inertia::render('Admin/Students', [
            'students' => $students
        ]);
    })->name('students.index');

    Route::get('/alunos/matricular', function () {
        return Inertia::render('Admin/StudentCreate');
    })->name('students.create');

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
            'phone' => $validated['phone'] ?? null,
            'status' => $validated['status'],
            'password' => bcrypt('password'), // default password
            'role' => 'student',
            'licensee_id' => auth()->id(),
        ]);

        return redirect()->route('admin.students.index');
    })->name('students.store');

    Route::get('/alunos/{student}', function (\App\Models\User $student) {
        abort_unless($student->role === 'student' && $student->licensee_id === auth()->id(), 404);

        return Inertia::render('Admin/ProfileDeAluno', [
            'student' => $student
        ]);
    })->name('students.show');

    Route::put('/alunos/{student}', function (\App\Models\User $student, \Illuminate\Http\Request $request) {
        abort_unless($student->role === 'student' && $student->licensee_id === auth()->id(), 404);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $student->id,
            'phone' => 'nullable|string|max:20',
            'status' => 'required|string|in:active,inactive',
        ]);

        $student->update($validated);

        return redirect()->back()->with('success', 'Cadastro do aluno atualizado com sucesso!');
    })->name('students.update');

    require __DIR__.'/licensee.php';

    Route::get('/courses/cadastrar', function () {
        return Inertia::render('Admin/CourseCreate');
    })->name('courses.create');

    Route::post('/courses', function (\Illuminate\Http\Request $request) {
        return redirect()->route('admin.courses.index');
    })->name('courses.store');

    Route::get('/turmas', function () {
        return Inertia::render('Admin/Classes');
    })->name('classes.index');

    Route::get('/turmas/cadastrar', function () {
        return Inertia::render('Admin/ClassCreate');
    })->name('classes.create');

    Route::post('/turmas', function (\Illuminate\Http\Request $request) {
        return redirect()->route('admin.classes.index');
    })->name('classes.store');

    Route::get('/polos', function () {
        $polos = \App\Models\Polo::orderBy('id', 'desc')->get();
        return Inertia::render('Admin/Polos', [
            'polos' => $polos
        ]);
    })->name('polos.index');

    Route::get('/polos/cadastrar', function () {
        return Inertia::render('Admin/PoloCreate');
    })->name('polos.create');

    Route::post('/polos', function (\Illuminate\Http\Request $request) {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'responsible' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|string|email|max:255',
            'address' => 'nullable|string|max:255',
            'status' => 'required|string|in:active,inactive',
        ]);

        $nextId = \App\Models\Polo::max('id') + 1;
        $code = 'PL-' . str_pad($nextId, 3, '0', STR_PAD_LEFT);
        
        $active_students = rand(100, 480);
        $capacity_pct = min(round(($active_students / 500) * 100), 100);

        \App\Models\Polo::create([
            'code' => $code,
            'name' => $validated['name'],
            'responsible' => $validated['responsible'],
            'phone' => $validated['phone'] ?? null,
            'email' => $validated['email'],
            'address' => $validated['address'],
            'status' => $validated['status'],
            'active_students' => $active_students,
            'capacity_pct' => $capacity_pct,
        ]);

        return redirect()->route('admin.polos.index');
    })->name('polos.store');

    Route::delete('/polos/{polo}', function (\App\Models\Polo $polo) {
        $polo->delete();
        return redirect()->route('admin.polos.index');
    })->name('polos.destroy');

    Route::put('/polos/{polo}', function (\App\Models\Polo $polo, \Illuminate\Http\Request $request) {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'responsible' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|string|email|max:255',
            'address' => 'nullable|string|max:255',
            'status' => 'required|string|in:active,inactive',
        ]);

        $polo->update($validated);

        return redirect()->route('admin.polos.index');
    })->name('polos.update');

    Route::get('/pedagogico', function () {
        return Inertia::render('Admin/Pedagogical');
    })->name('pedagogical.index');

    Route::get('/financeiro', function () {
        return Inertia::render('Admin/Financial');
    })->name('financial.index');


    Route::get('/alunos/interessado/cadastrar', function () {
        return Inertia::render('Admin/StudentInterestedCreate');
    })->name('students.interested.create');

    Route::post('/alunos/interessado', function (\Illuminate\Http\Request $request) {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'phone' => 'nullable|string|max:20',
            'status' => 'required|string|in:active,inactive,interested,blocked',
        ]);

        \App\Models\User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'status' => $validated['status'] === 'interested' ? 'inactive' : $validated['status'],
            'password' => bcrypt('password'),
            'role' => 'student',
            'licensee_id' => auth()->id(),
        ]);

        return redirect()->route('admin.sales.index')->with('success', 'Interessado cadastrado com sucesso!');
    })->name('students.interested.store');

    Route::get('/funcionarios', function () {
        return Inertia::render('Admin/Employees');
    })->name('employees.index');
});

Route::middleware(['auth', 'role:school_admin'])->prefix('school-admin')->name('school-admin.')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('SchoolAdmin/Dashboard');
    })->name('dashboard');

    Route::get('/alunos', function () {
        $students = \App\Models\User::where('role', 'student')
            ->where('licensee_id', auth()->id())
            ->latest()
            ->get();
        return Inertia::render('Admin/Students', [
            'students' => $students
        ]);
    })->name('students.index');

    Route::get('/alunos/matricular', function () {
        return Inertia::render('Admin/StudentCreate');
    })->name('students.create');

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
            'phone' => $validated['phone'] ?? null,
            'status' => $validated['status'],
            'password' => bcrypt('password'), // default password
            'role' => 'student',
            'licensee_id' => auth()->id(),
        ]);

        return redirect()->route('school-admin.students.index');
    })->name('students.store');

    Route::get('/alunos/{student}', function (\App\Models\User $student) {
        abort_unless($student->role === 'student' && $student->licensee_id === auth()->id(), 404);

        return Inertia::render('Admin/ProfileDeAluno', [
            'student' => $student
        ]);
    })->name('students.show');

    Route::put('/alunos/{student}', function (\App\Models\User $student, \Illuminate\Http\Request $request) {
        abort_unless($student->role === 'student' && $student->licensee_id === auth()->id(), 404);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $student->id,
            'phone' => 'nullable|string|max:20',
            'status' => 'required|string|in:active,inactive',
        ]);

        $student->update($validated);

        return redirect()->back()->with('success', 'Cadastro do aluno atualizado com sucesso!');
    })->name('students.update');

    Route::get('/polos', function () {
        $polos = \App\Models\Polo::orderBy('id', 'desc')->get();
        return Inertia::render('Admin/Polos', [
            'polos' => $polos
        ]);
    })->name('polos.index');

    Route::get('/polos/cadastrar', function () {
        return Inertia::render('Admin/PoloCreate');
    })->name('polos.create');

    Route::post('/polos', function (\Illuminate\Http\Request $request) {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'responsible' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|string|email|max:255',
            'address' => 'nullable|string|max:255',
            'status' => 'required|string|in:active,inactive',
        ]);

        $nextId = \App\Models\Polo::max('id') + 1;
        $code = 'PL-' . str_pad($nextId, 3, '0', STR_PAD_LEFT);
        
        $active_students = rand(100, 480);
        $capacity_pct = min(round(($active_students / 500) * 100), 100);

        \App\Models\Polo::create([
            'code' => $code,
            'name' => $validated['name'],
            'responsible' => $validated['responsible'],
            'phone' => $validated['phone'] ?? null,
            'email' => $validated['email'],
            'address' => $validated['address'],
            'status' => $validated['status'],
            'active_students' => $active_students,
            'capacity_pct' => $capacity_pct,
        ]);

        return redirect()->route('school-admin.polos.index');
    })->name('polos.store');

    Route::delete('/polos/{polo}', function (\App\Models\Polo $polo) {
        $polo->delete();
        return redirect()->route('school-admin.polos.index');
    })->name('polos.destroy');

    Route::put('/polos/{polo}', function (\App\Models\Polo $polo, \Illuminate\Http\Request $request) {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'responsible' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|string|email|max:255',
            'address' => 'nullable|string|max:255',
            'status' => 'required|string|in:active,inactive',
        ]);

        $polo->update($validated);

        return redirect()->route('school-admin.polos.index');
    })->name('polos.update');

    require __DIR__.'/licensee.php';

    Route::get('/courses/cadastrar', function () {
        return Inertia::render('Admin/CourseCreate');
    })->name('courses.create');

    Route::post('/courses', function (\Illuminate\Http\Request $request) {
        return redirect()->route('school-admin.courses.index');
    })->name('courses.store');

    Route::get('/turmas', function () {
        return Inertia::render('Admin/Classes');
    })->name('classes.index');

    Route::get('/turmas/cadastrar', function () {
        return Inertia::render('Admin/ClassCreate');
    })->name('classes.create');

    Route::post('/turmas', function (\Illuminate\Http\Request $request) {
        return redirect()->route('school-admin.classes.index');
    })->name('classes.store');

    Route::get('/pedagogico', function () {
        return Inertia::render('Admin/Pedagogical');
    })->name('pedagogical.index');

    Route::get('/financeiro', function () {
        return Inertia::render('Admin/Financial');
    })->name('financial.index');


    Route::get('/alunos/interessado/cadastrar', function () {
        return Inertia::render('Admin/StudentInterestedCreate');
    })->name('students.interested.create');

    Route::post('/alunos/interessado', function (\Illuminate\Http\Request $request) {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'phone' => 'nullable|string|max:20',
            'status' => 'required|string|in:active,inactive,interested,blocked',
        ]);

        \App\Models\User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'status' => $validated['status'] === 'interested' ? 'inactive' : $validated['status'],
            'password' => bcrypt('password'),
            'role' => 'student',
            'licensee_id' => auth()->id(),
        ]);

        return redirect()->route('school-admin.sales.index')->with('success', 'Interessado cadastrado com sucesso!');
    })->name('students.interested.store');

    Route::get('/funcionarios', function () {
        return Inertia::render('Admin/Employees');
    })->name('employees.index');
});

Route::middleware(['auth', 'role:student'])->prefix('student')->name('student.')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Student/Dashboard');
    })->name('dashboard');

    Route::get('/atividades', function () {
        return Inertia::render('Student/Activities');
    })->name('activities');

    Route::get('/agenda', function () {
        return Inertia::render('Student/Agenda');
    })->name('agenda');

    Route::get('/biblioteca', function () {
        return Inertia::render('Student/Library');
    })->name('library');

    Route::get('/boletim', function () {
        return Inertia::render('Student/ReportCard');
    })->name('report-card');

    Route::get('/frequencia', function () {
        return Inertia::render('Student/Attendance');
    })->name('attendance');

    Route::get('/progresso', function () {
        return Inertia::render('Student/Progress');
    })->name('progress');

    Route::get('/cursos', [\App\Http\Controllers\Student\CourseController::class, 'index'])->name('courses');
    Route::get('/cursos/disponiveis', [\App\Http\Controllers\Student\CourseController::class, 'available'])->name('courses.available');

    Route::get('/cursos/marketing-digital', function () {
        return Inertia::render('Student/CoursePlay');
    })->name('courses.play');

    Route::get('/cursos/{course:slug}', [\App\Http\Controllers\Student\CourseController::class, 'show'])->name('courses.show');
    Route::post('/cursos/{course:slug}/exercicios/{exercise}/responder', [\App\Http\Controllers\Student\LearningController::class, 'answer'])->name('exercises.answer');
    Route::post('/cursos/{course:slug}/notas', [\App\Http\Controllers\Student\LearningController::class, 'storeNote'])->name('notes.store');
    Route::put('/notas/{note}', [\App\Http\Controllers\Student\LearningController::class, 'updateNote'])->name('notes.update');
    Route::delete('/notas/{note}', [\App\Http\Controllers\Student\LearningController::class, 'destroyNote'])->name('notes.destroy');

    Route::get('/mensagens', function () {
        return Inertia::render('Student/Messages');
    })->name('messages');

    Route::get('/documentos', function () {
        return Inertia::render('Student/Documents');
    })->name('documents');

    Route::get('/documentos/certificados', function () {
        return Inertia::render('Student/Certificates');
    })->name('documents.certificates');

    Route::get('/documentos/declaracoes', function () {
        return Inertia::render('Student/Declarations');
    })->name('documents.declarations');

    Route::get('/documentos/contratos', function () {
        return Inertia::render('Student/Contracts');
    })->name('documents.contracts');

    Route::get('/documentos/comprovantes', function () {
        return Inertia::render('Student/Receipts');
    })->name('documents.receipts');

    Route::get('/financeiro', function () {
        return Inertia::render('Student/Financial');
    })->name('financial');

    Route::get('/financeiro/mensalidades', function () {
        return Inertia::render('Student/Installments');
    })->name('financial.installments');

    Route::get('/financeiro/pagamentos', function () {
        return Inertia::render('Student/Payments');
    })->name('financial.payments');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
require __DIR__.'/platform.php';
