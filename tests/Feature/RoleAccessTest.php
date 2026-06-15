<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RoleAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_unauthenticated_users_are_redirected_to_login(): void
    {
        $response = $this->get('/admin/dashboard');
        $response->assertRedirect('/login');

        $response = $this->get('/school-admin/dashboard');
        $response->assertRedirect('/login');

        $response = $this->get('/student/dashboard');
        $response->assertRedirect('/login');
    }

    public function test_admin_user_can_access_admin_dashboard_and_is_redirected_correctly(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin)->get('/dashboard');
        $response->assertRedirect('/admin/dashboard');

        $response = $this->actingAs($admin)->get('/admin/dashboard');
        $response->assertStatus(200);
    }

    public function test_school_admin_user_can_access_school_admin_dashboard_and_is_redirected_correctly(): void
    {
        $schoolAdmin = User::factory()->create(['role' => 'school_admin']);

        $response = $this->actingAs($schoolAdmin)->get('/dashboard');
        $response->assertRedirect('/school-admin/dashboard');

        $response = $this->actingAs($schoolAdmin)->get('/school-admin/dashboard');
        $response->assertStatus(200);
    }

    public function test_student_user_can_access_student_dashboard_and_is_redirected_correctly(): void
    {
        $student = User::factory()->create(['role' => 'student']);

        $response = $this->actingAs($student)->get('/dashboard');
        $response->assertRedirect('/student/dashboard');

        $response = $this->actingAs($student)->get('/student/dashboard');
        $response->assertStatus(200);
    }

    public function test_students_cannot_access_admin_dashboard(): void
    {
        $student = User::factory()->create(['role' => 'student']);

        $response = $this->actingAs($student)->get('/admin/dashboard');
        $response->assertStatus(403);
    }

    public function test_school_admins_cannot_access_admin_dashboard(): void
    {
        $schoolAdmin = User::factory()->create(['role' => 'school_admin']);

        $response = $this->actingAs($schoolAdmin)->get('/admin/dashboard');
        $response->assertStatus(403);
    }
}
