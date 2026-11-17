<?php

namespace App\Services;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Sale;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

/**
 * Registra vendas do licenciado e controla o acesso do aluno aos cursos vendidos.
 * Os preços são sempre recalculados no servidor a partir da opção escolhida.
 */
class SaleService
{
    public function __construct(private LicenseePricing $pricing) {}

    /**
     * @param  array{student_id:int, payment_method:string, installments:int, status:string, access_starts_on:string, notes?:string, items: array<int, array{course_id:int, price_option:string, manual_price?:mixed, discount?:mixed, access_days?:int|null}>}  $data
     */
    public function create(User $licensee, array $data, User $author): Sale
    {
        $options = $this->pricing->priceOptions($licensee);
        $courses = Course::where('status', 'published')
            ->whereIn('id', collect($data['items'])->pluck('course_id'))
            ->get()
            ->keyBy('id');

        $items = [];
        $campaignId = null;

        foreach ($data['items'] as $i => $item) {
            $course = $courses->get($item['course_id']);
            if (! $course) {
                throw ValidationException::withMessages(["items.$i.course_id" => 'Curso indisponível para venda.']);
            }

            if ($item['price_option'] === 'manual') {
                $option = ['source' => 'manual', 'label' => 'Valor negociado', 'price' => $item['manual_price'], 'price_table_id' => null, 'campaign_id' => null];
            } else {
                $option = collect($options[$course->id] ?? [])->firstWhere('key', $item['price_option']);
                if (! $option) {
                    throw ValidationException::withMessages(["items.$i.price_option" => 'Esta opção de preço não está mais disponível para o curso.']);
                }
            }

            $listPrice = round((float) $option['price'], 2);
            $discount = round((float) ($item['discount'] ?? 0), 2);
            if ($discount > $listPrice) {
                throw ValidationException::withMessages(["items.$i.discount" => 'O desconto não pode ser maior que o valor do curso.']);
            }

            $campaignId ??= $option['campaign_id'];
            $items[] = [
                'course_id' => $course->id,
                'course_title' => $course->title,
                'price_table_id' => $option['price_table_id'],
                'price_source' => $option['source'],
                'price_label' => $option['label'],
                'list_price' => $listPrice,
                'discount' => $discount,
                'total' => round($listPrice - $discount, 2),
                'access_days' => $item['access_days'] ?? null,
            ];
        }

        return DB::transaction(function () use ($licensee, $data, $author, $items, $campaignId) {
            $subtotal = collect($items)->sum('list_price');
            $discount = collect($items)->sum('discount');

            $sale = Sale::create([
                'code' => Sale::nextCode(),
                'licensee_id' => $licensee->id,
                'student_id' => $data['student_id'],
                'campaign_id' => $campaignId,
                'payment_method' => $data['payment_method'],
                'installments' => $data['installments'],
                'subtotal' => $subtotal,
                'discount' => $discount,
                'total' => round($subtotal - $discount, 2),
                'status' => 'pending',
                'access_starts_on' => $data['access_starts_on'],
                'notes' => $data['notes'] ?? null,
                'created_by' => $author->id,
            ]);
            $sale->items()->createMany($items);

            if ($data['status'] === 'paid') {
                $this->markPaid($sale);
            }

            return $sale;
        });
    }

    /** Confirma o pagamento e libera o acesso aos cursos. */
    public function markPaid(Sale $sale): void
    {
        if ($sale->status === 'paid') {
            return;
        }

        DB::transaction(function () use ($sale) {
            $sale->update(['status' => 'paid', 'paid_at' => now()]);

            $starts = $sale->access_starts_on->copy()->startOfDay();

            foreach ($sale->items()->whereNotNull('course_id')->get() as $item) {
                Enrollment::create([
                    'student_id' => $sale->student_id,
                    'course_id' => $item->course_id,
                    'licensee_id' => $sale->licensee_id,
                    'sale_item_id' => $item->id,
                    'status' => 'active',
                    'starts_at' => $starts,
                    // Acesso até o fim do último dia do período.
                    'expires_at' => $item->access_days ? $starts->copy()->addDays($item->access_days)->subSecond() : null,
                ]);
            }
        });
    }

    /** Cancela a venda e revoga o acesso liberado por ela. */
    public function cancel(Sale $sale, ?string $reason): void
    {
        DB::transaction(function () use ($sale, $reason) {
            $sale->update(['status' => 'canceled', 'canceled_at' => now(), 'cancel_reason' => $reason]);
            Enrollment::whereIn('sale_item_id', $sale->items()->pluck('id'))->update(['status' => 'canceled']);
        });
    }
}
