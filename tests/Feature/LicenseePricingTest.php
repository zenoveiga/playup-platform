<?php

namespace Tests\Feature;

use App\Models\Campaign;
use App\Models\Course;
use App\Models\PriceTable;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LicenseePricingTest extends TestCase
{
    use RefreshDatabase;

    private User $licensee;
    private Course $published;
    private Course $draft;

    protected function setUp(): void
    {
        parent::setUp();
        $this->licensee = User::factory()->create(['role' => 'school_admin']);
        $this->published = Course::create(['title' => 'Excel', 'slug' => 'excel', 'status' => 'published', 'structure' => 'modular']);
        $this->draft = Course::create(['title' => 'Rascunho', 'slug' => 'rascunho', 'status' => 'draft', 'structure' => 'modular']);
    }

    public function test_admin_sets_suggested_prices(): void
    {
        $admin = User::factory()->create(['role' => 'super_admin']);

        $this->actingAs($admin)->get('/administrador/precos-sugeridos')->assertOk();
        $this->put('/administrador/precos-sugeridos', [
            'max_installments' => 10,
            'prices' => [$this->published->id => '497.00', $this->draft->id => ''],
        ])->assertSessionHasNoErrors();

        $table = PriceTable::suggested();
        $this->assertSame(10, $table->max_installments);
        $this->assertSame(['497.00'], array_values($table->priceMap()));

        // Licenciado não acessa a tabela sugerida do admin.
        $this->actingAs($this->licensee)->get('/administrador/precos-sugeridos')->assertForbidden();
    }

    public function test_licensee_sees_only_published_courses_with_suggested_or_own_price(): void
    {
        PriceTable::suggested()->syncPrices([$this->published->id => 500]);

        $this->actingAs($this->licensee)->get('/school-admin/courses')->assertInertia(fn ($page) => $page
            ->component('Licensee/Courses')
            ->has('courses', 1)
            ->where('courses.0.title', 'Excel')
            ->where('courses.0.suggested_price', '500.00')
            ->where('courses.0.my_price', null)
        );

        $this->post('/school-admin/tabelas-de-precos', [
            'name' => 'Minha tabela', 'max_installments' => 12,
            'prices' => [$this->published->id => '450', $this->draft->id => '1'],
        ])->assertSessionHasNoErrors();

        $table = $this->licensee->priceTables()->first();
        $this->assertTrue($table->is_default, 'A primeira tabela vira a padrão.');
        $this->assertSame([$this->published->id], array_keys($table->priceMap()), 'Curso não publicado é ignorado.');

        $this->get('/school-admin/courses')->assertInertia(fn ($page) => $page->where('courses.0.my_price', '450.00'));
    }

    public function test_only_one_default_table_per_licensee(): void
    {
        $this->actingAs($this->licensee);
        $this->post('/school-admin/tabelas-de-precos', ['name' => 'A', 'max_installments' => 1]);
        $this->post('/school-admin/tabelas-de-precos', ['name' => 'B', 'max_installments' => 12, 'is_default' => true]);

        $this->assertSame(['B'], $this->licensee->priceTables()->where('is_default', true)->pluck('name')->all());
    }

    public function test_campaign_offers_its_tables_as_payment_options_while_active(): void
    {
        $avista = $this->licensee->priceTables()->create(['name' => 'À vista', 'max_installments' => 1]);
        $avista->syncPrices([$this->published->id => 399]);
        $parcelado = $this->licensee->priceTables()->create(['name' => '12x', 'max_installments' => 12]);
        $parcelado->syncPrices([$this->published->id => 449]);

        $this->actingAs($this->licensee)->post('/school-admin/campanhas', [
            'name' => 'Volta às aulas',
            'starts_on' => today()->subDay()->toDateString(),
            'ends_on' => today()->addWeek()->toDateString(),
            'price_table_ids' => [$avista->id, $parcelado->id],
        ])->assertSessionHasNoErrors();

        $campaign = Campaign::first();
        $this->assertSame('active', $campaign->status);
        $this->assertSame(['À vista', '12x'], $campaign->priceTables->pluck('name')->all());

        $this->get('/school-admin/courses')->assertInertia(fn ($page) => $page
            ->has('courses.0.campaign_options', 2)
            ->where('courses.0.campaign_options.0.table', 'À vista')
            ->where('courses.0.campaign_options.1.max_installments', 12)
        );

        // Fora do período, as opções da campanha não aparecem.
        $campaign->update(['starts_on' => today()->addDays(5), 'ends_on' => today()->addDays(9)]);
        $this->assertSame('scheduled', $campaign->fresh()->status);
        $this->get('/school-admin/courses')->assertInertia(fn ($page) => $page->has('courses.0.campaign_options', 0));
    }

    public function test_campaign_validates_dates_and_table_ownership(): void
    {
        $other = User::factory()->create(['role' => 'school_admin']);
        $foreign = $other->priceTables()->create(['name' => 'Do outro', 'max_installments' => 1]);

        $this->actingAs($this->licensee)->post('/school-admin/campanhas', [
            'name' => 'X',
            'starts_on' => '2026-12-10',
            'ends_on' => '2026-12-01',
            'price_table_ids' => [$foreign->id],
        ])->assertSessionHasErrors(['ends_on', 'price_table_ids.0']);

        $this->post('/school-admin/campanhas', ['name' => 'X', 'starts_on' => '2026-12-01', 'ends_on' => '2026-12-10'])
            ->assertSessionHasErrors('price_table_ids');
    }

    public function test_licensees_cannot_touch_each_others_tables_campaigns_or_students(): void
    {
        $other = User::factory()->create(['role' => 'admin']);
        $table = $other->priceTables()->create(['name' => 'Privada', 'max_installments' => 1]);
        $campaign = $other->campaigns()->create(['name' => 'C', 'starts_on' => today(), 'ends_on' => today()]);
        $student = User::factory()->create(['role' => 'student', 'licensee_id' => $other->id]);
        $mine = User::factory()->create(['role' => 'student', 'licensee_id' => $this->licensee->id]);

        $this->actingAs($this->licensee);
        $this->get("/school-admin/tabelas-de-precos/{$table->id}/editar")->assertNotFound();
        $this->delete("/school-admin/campanhas/{$campaign->id}")->assertNotFound();
        $this->get("/school-admin/alunos/{$student->id}")->assertNotFound();

        $this->get('/school-admin/alunos')->assertInertia(fn ($page) => $page
            ->has('students', 1)
            ->where('students.0.id', $mine->id)
        );
    }

    public function test_licensee_can_add_a_student_linked_to_them(): void
    {
        $this->actingAs($this->licensee)->post('/school-admin/alunos', [
            'name' => 'Novo Aluno', 'email' => 'novo@aluno.com', 'status' => 'active',
        ])->assertRedirect('/school-admin/alunos');

        $this->assertSame($this->licensee->id, User::where('email', 'novo@aluno.com')->value('licensee_id'));
    }
}
