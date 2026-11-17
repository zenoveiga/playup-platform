<?php

namespace Tests\Feature\Platform;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PlatformAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_sent_to_the_platform_login(): void
    {
        $this->get('/administrador/dashboard')->assertRedirect('/administrador/login');
        $this->get('/administrador/login')->assertOk();
    }

    public function test_platform_admin_can_log_in_through_the_admin_login(): void
    {
        $admin = User::factory()->create(['role' => 'super_admin']);

        $this->post('/administrador/login', ['email' => $admin->email, 'password' => 'password'])
            ->assertRedirect('/administrador/dashboard');

        $this->assertAuthenticatedAs($admin);
        $this->get('/administrador/dashboard')->assertOk();
        $this->get('/dashboard')->assertRedirect('/administrador/dashboard');
    }

    public function test_licensees_cannot_use_the_admin_login_or_panel(): void
    {
        $licensee = User::factory()->create(['role' => 'school_admin']);

        $this->post('/administrador/login', ['email' => $licensee->email, 'password' => 'password'])
            ->assertSessionHasErrors('email');
        $this->assertGuest();

        $this->actingAs($licensee)->get('/administrador/dashboard')->assertForbidden();
    }

    public function test_licensee_signup_is_pending_until_approved(): void
    {
        $this->post('/register', [
            'name' => 'Escola Nova',
            'email' => 'escola@nova.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'account_type' => 'licensee',
        ])->assertRedirect('/login');

        $this->assertGuest();
        $licensee = User::where('email', 'escola@nova.com')->first();
        $this->assertSame('school_admin', $licensee->role);
        $this->assertSame('pending', $licensee->status);

        $this->post('/login', ['email' => 'escola@nova.com', 'password' => 'password'])
            ->assertSessionHasErrors('email');
        $this->assertGuest();

        $admin = User::factory()->create(['role' => 'super_admin']);
        $this->actingAs($admin)->post("/administrador/licenciados/{$licensee->id}/aprovar")->assertRedirect();
        $this->assertSame('active', $licensee->fresh()->status);
        $this->assertSame($admin->id, $licensee->fresh()->approved_by);

        auth()->logout();
        $this->post('/login', ['email' => 'escola@nova.com', 'password' => 'password'])
            ->assertRedirect('/dashboard');
    }

    public function test_blocking_a_licensee_can_extend_to_students_and_be_reverted(): void
    {
        $admin = User::factory()->create(['role' => 'super_admin']);
        $licensee = User::factory()->create(['role' => 'school_admin']);
        $active = User::factory()->create(['role' => 'student', 'licensee_id' => $licensee->id, 'status' => 'active']);
        $inactive = User::factory()->create(['role' => 'student', 'licensee_id' => $licensee->id, 'status' => 'inactive']);
        $otherSchool = User::factory()->create(['role' => 'student', 'status' => 'active']);

        $this->actingAs($admin)->post("/administrador/licenciados/{$licensee->id}/bloquear", [
            'reason' => 'Inadimplência',
            'extend_to_students' => true,
        ])->assertRedirect();

        $this->assertSame('blocked', $licensee->fresh()->status);
        $this->assertSame('blocked', $active->fresh()->status);
        $this->assertSame('blocked', $inactive->fresh()->status);
        $this->assertSame('active', $otherSchool->fresh()->status);

        $this->post("/administrador/licenciados/{$licensee->id}/desbloquear")->assertRedirect();

        $this->assertSame('active', $licensee->fresh()->status);
        $this->assertSame('active', $active->fresh()->status);
        $this->assertSame('inactive', $inactive->fresh()->status);
    }

    public function test_blocking_only_the_licensee_keeps_students_active(): void
    {
        $admin = User::factory()->create(['role' => 'super_admin']);
        $licensee = User::factory()->create(['role' => 'school_admin']);
        $student = User::factory()->create(['role' => 'student', 'licensee_id' => $licensee->id]);

        $this->actingAs($admin)->post("/administrador/licenciados/{$licensee->id}/bloquear", [
            'extend_to_students' => false,
        ]);

        $this->assertSame('blocked', $licensee->fresh()->status);
        $this->assertSame('active', $student->fresh()->status);
    }

    public function test_blocked_users_are_logged_out_on_next_request(): void
    {
        $student = User::factory()->create(['role' => 'student', 'status' => 'blocked']);

        $this->actingAs($student)->get('/student/dashboard')->assertRedirect('/login');
        $this->assertGuest();
    }

    public function test_admin_can_manage_platform_users_but_not_block_self(): void
    {
        $admin = User::factory()->create(['role' => 'super_admin']);

        $this->actingAs($admin)->post('/administrador/usuarios', [
            'name' => 'Outro Admin',
            'email' => 'outro@playup.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ])->assertSessionHasNoErrors();

        $other = User::where('email', 'outro@playup.com')->first();
        $this->assertTrue($other->isPlatformAdmin());

        $this->post("/administrador/usuarios/{$other->id}/bloquear")->assertRedirect();
        $this->assertSame('blocked', $other->fresh()->status);

        $this->post("/administrador/usuarios/{$admin->id}/bloquear")->assertSessionHas('error');
        $this->assertSame('active', $admin->fresh()->status);
    }
}
