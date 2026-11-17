<?php

namespace Tests\Feature;

use App\Models\Campaign;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\PriceTable;
use App\Models\Sale;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SalesTest extends TestCase
{
    use RefreshDatabase;

    private User $licensee;
    private User $student;
    private Course $excel;
    private Course $powerbi;

    protected function setUp(): void
    {
        parent::setUp();
        $this->licensee = User::factory()->create(['role' => 'school_admin']);
        $this->student = User::factory()->create(['role' => 'student', 'licensee_id' => $this->licensee->id]);
        $this->excel = Course::create(['title' => 'Excel', 'slug' => 'excel', 'status' => 'published', 'structure' => 'free']);
        $this->powerbi = Course::create(['title' => 'Power BI', 'slug' => 'power-bi', 'status' => 'published', 'structure' => 'free']);
        PriceTable::suggested()->syncPrices([$this->excel->id => 500, $this->powerbi->id => 800]);
    }

    private function sell(array $overrides = [], array $items = null)
    {
        return $this->actingAs($this->licensee)->post('/school-admin/vendas', array_merge([
            'student_id' => $this->student->id,
            'payment_method' => 'pix',
            'installments' => 1,
            'status' => 'paid',
            'access_starts_on' => today()->toDateString(),
            'items' => $items ?? [['course_id' => $this->excel->id, 'price_option' => 'suggested', 'discount' => 50, 'access_days' => 30]],
        ], $overrides));
    }

    public function test_paid_sale_records_prices_and_grants_time_limited_access(): void
    {
        $this->sell()->assertSessionHasNoErrors();

        $sale = Sale::first();
        $this->assertSame('paid', $sale->status);
        $this->assertSame('VND-000001', $sale->code);
        $this->assertSame('450.00', $sale->total);

        $item = $sale->items->first();
        $this->assertSame(['suggested', '500.00', '50.00', 30], [$item->price_source, $item->list_price, $item->discount, $item->access_days]);

        $enrollment = Enrollment::first();
        $this->assertSame($this->student->id, $enrollment->student_id);
        $this->assertSame(today()->addDays(30)->subSecond()->toDateTimeString(), $enrollment->expires_at->toDateTimeString());
        $this->assertTrue($this->student->hasAccessTo($this->excel));
        $this->assertFalse($this->student->hasAccessTo($this->powerbi));
    }

    public function test_price_comes_from_server_options_not_from_the_browser(): void
    {
        $table = $this->licensee->priceTables()->create(['name' => 'Minha', 'max_installments' => 10, 'is_default' => true]);
        $table->syncPrices([$this->excel->id => 420]);
        $campaign = $this->licensee->campaigns()->create(['name' => 'Black', 'starts_on' => today(), 'ends_on' => today()->addDays(3)]);
        $promo = $this->licensee->priceTables()->create(['name' => 'Promo', 'max_installments' => 1]);
        $promo->syncPrices([$this->powerbi->id => 600]);
        $campaign->priceTables()->attach($promo->id);

        $this->sell([], [
            ['course_id' => $this->excel->id, 'price_option' => "table:{$table->id}", 'manual_price' => 1, 'access_days' => null],
            ['course_id' => $this->powerbi->id, 'price_option' => "campaign:{$campaign->id}:{$promo->id}", 'access_days' => 365],
        ])->assertSessionHasNoErrors();

        $sale = Sale::first();
        $this->assertSame('1020.00', $sale->total);
        $this->get("/school-admin/vendas/{$sale->id}")->assertOk();
        $this->assertSame($campaign->id, $sale->campaign_id);
        $this->assertNull($sale->items[0]->access_days, 'Vitalício');
        $this->assertNull(Enrollment::where('course_id', $this->excel->id)->value('expires_at'));

        // Opção de outro licenciado / inexistente é recusada.
        $this->sell([], [['course_id' => $this->excel->id, 'price_option' => 'table:999']])
            ->assertSessionHasErrors('items.0.price_option');
    }

    public function test_manual_price_and_discount_validation(): void
    {
        $this->sell([], [['course_id' => $this->excel->id, 'price_option' => 'manual', 'manual_price' => '300', 'access_days' => 90]])
            ->assertSessionHasNoErrors();
        $this->assertSame('300.00', Sale::first()->total);

        $this->sell([], [['course_id' => $this->excel->id, 'price_option' => 'suggested', 'discount' => 600]])
            ->assertSessionHasErrors('items.0.discount');
    }

    public function test_pending_sale_grants_access_only_after_payment_and_cancel_revokes_it(): void
    {
        $this->sell(['status' => 'pending'])->assertSessionHasNoErrors();
        $sale = Sale::first();
        $this->assertFalse($this->student->hasAccessTo($this->excel));

        $this->post("/school-admin/vendas/{$sale->id}/pagar")->assertRedirect();
        $this->assertTrue($this->student->fresh()->hasAccessTo($this->excel));

        $this->post("/school-admin/vendas/{$sale->id}/cancelar", ['reason' => 'Desistência'])->assertRedirect();
        $this->assertSame('canceled', $sale->fresh()->status);
        $this->assertFalse($this->student->fresh()->hasAccessTo($this->excel));
    }

    public function test_licensee_can_only_sell_to_own_students_and_see_own_sales(): void
    {
        $otherStudent = User::factory()->create(['role' => 'student']);
        $this->sell(['student_id' => $otherStudent->id])->assertSessionHasErrors('student_id');

        $this->sell();
        $other = User::factory()->create(['role' => 'admin']);
        $this->actingAs($other)->get('/admin/vendas/'.Sale::first()->id)->assertNotFound();
    }

    public function test_draft_courses_cannot_be_sold(): void
    {
        $draft = Course::create(['title' => 'Rascunho', 'slug' => 'rascunho', 'status' => 'draft', 'structure' => 'free']);
        $this->sell([], [['course_id' => $draft->id, 'price_option' => 'manual', 'manual_price' => 10]])
            ->assertSessionHasErrors('items.0.course_id');
    }

    public function test_student_sees_all_courses_but_only_purchased_ones_in_my_courses(): void
    {
        $this->sell();

        $this->actingAs($this->student)->get('/student/cursos')->assertInertia(fn ($page) => $page
            ->component('Student/Courses')
            ->has('myCourses', 1)
            ->where('myCourses.0.title', 'Excel')
            ->where('myCourses.0.access_status', 'active')
            ->has('availableCourses', 2)
        );

        $this->get('/student/cursos/excel')->assertOk()->assertInertia(fn ($page) => $page->component('Student/CourseView'));
        $this->get('/student/cursos/power-bi')->assertForbidden();
    }

    public function test_expired_access_blocks_the_course_but_keeps_it_listed(): void
    {
        $this->sell();
        Enrollment::query()->update(['starts_at' => now()->subDays(40), 'expires_at' => now()->subDays(10)]);

        $this->actingAs($this->student)->get('/student/cursos')
            ->assertInertia(fn ($page) => $page->where('myCourses.0.access_status', 'expired'));
        $this->get('/student/cursos/excel')->assertForbidden();
    }

    public function test_student_course_view_hides_answers(): void
    {
        $this->excel->exercises()->create([
            'position' => 0, 'type' => 'multiple_choice', 'statement' => 'Qual?', 'points' => 1,
            'options' => [['text' => 'A', 'correct' => true], ['text' => 'B', 'correct' => false]],
            'explanation' => 'Porque sim',
        ]);
        $this->sell();

        $props = $this->actingAs($this->student)->get('/student/cursos/excel')->viewData('page')['props'];
        $exercise = $props['course']['exercises'][0];
        $this->assertSame(['A', 'B'], collect($exercise['options'])->all());
        $this->assertArrayNotHasKey('explanation', $exercise);
        $this->assertArrayNotHasKey('expected_answer', $exercise);
    }
}
