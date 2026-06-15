<?php
use App\Models\User;

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

// Find or create admin user
$admin = User::where('role', 'admin')->first();
if (!$admin) {
    $admin = User::create([
        'name' => 'Admin Test',
        'email' => 'admin-test@playup.com',
        'password' => bcrypt('password'),
        'role' => 'admin',
    ]);
}

// Prepare request
$request = Illuminate\Http\Request::create('/admin/alunos', 'POST', [
    'name' => 'John Doe',
    'email' => 'john.doe.' . uniqid() . '@example.com',
    'phone' => '123456789',
    'status' => 'active',
]);

// Authenticate as admin
$app->make('auth')->guard()->setUser($admin);

// Handle request
$response = $kernel->handle($request);

echo "Response status: " . $response->getStatusCode() . "\n";
if ($response->isRedirection()) {
    echo "Redirect target: " . $response->headers->get('Location') . "\n";
} else {
    echo "Response content: " . substr($response->getContent(), 0, 500) . "\n";
}

// Print session errors if any
$errors = session()->get('errors');
if ($errors) {
    echo "Session errors: " . json_encode($errors->getMessages()) . "\n";
} else {
    echo "No session errors.\n";
}
