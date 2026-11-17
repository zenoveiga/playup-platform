import { Card, DangerButton, DialogShell, Field, GhostButton, inputClass, PageHeader, PrimaryAction, SecondaryAction } from '@/Components/Platform/UI';
import { ACCESS_STATUS, brl, formatDate, SALE_STATUS, useLicensee } from '@/lib/licensee';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

const accessText = (days) => (days ? `${days} dia(s)` : 'Vitalício');

export default function SaleShow({ sale, paymentMethods }) {
    const { Layout, r } = useLicensee();
    const [canceling, setCanceling] = useState(false);
    const cancelForm = useForm({ reason: '' });
    const status = SALE_STATUS[sale.status];

    return (
        <Layout>
            <Head title={`Venda ${sale.code}`} />

            <div className="max-w-6xl mx-auto p-8 space-y-6 animate-in fade-in duration-700">
                <PageHeader
                    breadcrumb={[{ label: 'Vendas', href: r('sales.index') }, { label: sale.code }]}
                    title={`Venda ${sale.code}`}
                    subtitle={`Registrada em ${new Date(sale.created_at).toLocaleString('pt-BR')}`}
                    actions={
                        <>
                            <span className={`px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider ${status.className}`}>{status.label}</span>
                            {sale.status === 'pending' && (
                                <PrimaryAction icon="check_circle" onClick={() => router.post(r('sales.pay', sale.id), {}, { preserveScroll: true })}>
                                    Confirmar pagamento
                                </PrimaryAction>
                            )}
                            {sale.status !== 'canceled' && (
                                <SecondaryAction icon="block" onClick={() => setCanceling(true)}>
                                    Cancelar venda
                                </SecondaryAction>
                            )}
                        </>
                    }
                />

                {sale.status === 'canceled' && (
                    <div className="bg-slate-100 dark:bg-slate-900 rounded-2xl px-5 py-4 text-sm text-slate-600 dark:text-slate-300">
                        Cancelada em {new Date(sale.canceled_at).toLocaleString('pt-BR')}
                        {sale.cancel_reason ? ` — ${sale.cancel_reason}` : ''}. O acesso do aluno aos cursos foi revogado.
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    <Card icon="auto_stories" title="Cursos vendidos" className="col-span-12 lg:col-span-8">
                        <div className="space-y-3">
                            {sale.items.map((item) => {
                                const e = item.enrollment;
                                const acc = e ? ACCESS_STATUS[e.access_status] : null;
                                return (
                                    <div key={item.id} className="rounded-2xl bg-surface/60 dark:bg-slate-950/60 px-5 py-4 flex flex-wrap items-center gap-4">
                                        <div className="flex-1 min-w-[200px]">
                                            <p className="font-bold text-[#003346] dark:text-white">{item.course_title}</p>
                                            <p className="text-[11px] text-[#507c94]">
                                                {item.price_label} · acesso: {accessText(item.access_days)}
                                            </p>
                                            {e ? (
                                                <p className={`text-[11px] font-bold mt-1 ${acc.className}`}>
                                                    {acc.label} · {formatDate(e.starts_at)} {e.expires_at ? `até ${formatDate(e.expires_at)}` : '(vitalício)'}
                                                </p>
                                            ) : (
                                                <p className="text-[11px] font-bold mt-1 text-amber-600">Acesso liberado após a confirmação do pagamento</p>
                                            )}
                                        </div>
                                        <div className="text-right tabular-nums">
                                            {Number(item.discount) > 0 && <p className="text-[11px] text-[#507c94] line-through">{brl(item.list_price)}</p>}
                                            <p className="font-black text-[#003346] dark:text-white">{brl(item.total)}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="mt-5 pt-4 border-t border-outline-variant/10 dark:border-slate-800 space-y-2 text-sm">
                            <div className="flex justify-between text-[#507c94]"><span>Subtotal</span><span className="tabular-nums">{brl(sale.subtotal)}</span></div>
                            <div className="flex justify-between text-[#507c94]"><span>Descontos</span><span className="tabular-nums">− {brl(sale.discount)}</span></div>
                            <div className="flex justify-between items-end">
                                <span className="font-bold text-[#003346] dark:text-white">Total</span>
                                <span className="text-2xl font-black text-primary dark:text-[#00D1FF] font-headline tabular-nums">{brl(sale.total)}</span>
                            </div>
                        </div>
                    </Card>

                    <div className="col-span-12 lg:col-span-4 space-y-6">
                        <Card icon="person" title="Aluno">
                            <p className="font-bold text-[#003346] dark:text-white">{sale.student.name}</p>
                            <p className="text-sm text-[#507c94]">{sale.student.email}</p>
                            {sale.student.phone && <p className="text-sm text-[#507c94]">{sale.student.phone}</p>}
                        </Card>
                        <Card icon="payments" iconTone="tertiary" title="Pagamento">
                            <dl className="space-y-2 text-sm">
                                <div className="flex justify-between"><dt className="text-[#507c94]">Forma</dt><dd className="font-bold text-[#003346] dark:text-white">{paymentMethods[sale.payment_method]}</dd></div>
                                <div className="flex justify-between">
                                    <dt className="text-[#507c94]">Parcelas</dt>
                                    <dd className="font-bold text-[#003346] dark:text-white">
                                        {sale.installments > 1 ? `${sale.installments}x de ${brl(sale.total / sale.installments)}` : 'À vista'}
                                    </dd>
                                </div>
                                <div className="flex justify-between"><dt className="text-[#507c94]">Início do acesso</dt><dd className="font-bold text-[#003346] dark:text-white">{formatDate(sale.access_starts_on)}</dd></div>
                                {sale.paid_at && (
                                    <div className="flex justify-between"><dt className="text-[#507c94]">Pago em</dt><dd className="font-bold text-[#003346] dark:text-white">{new Date(sale.paid_at).toLocaleDateString('pt-BR')}</dd></div>
                                )}
                                {sale.campaign && (
                                    <div className="flex justify-between"><dt className="text-[#507c94]">Campanha</dt><dd className="font-bold text-[#003346] dark:text-white">{sale.campaign.name}</dd></div>
                                )}
                            </dl>
                            {sale.notes && <p className="mt-4 text-xs text-[#507c94] whitespace-pre-line">{sale.notes}</p>}
                        </Card>
                    </div>
                </div>
            </div>

            <DialogShell
                show={canceling}
                onClose={() => setCanceling(false)}
                icon="block"
                iconTone="error"
                title={`Cancelar a venda ${sale.code}?`}
                description="O aluno perde o acesso aos cursos desta venda."
            >
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        cancelForm.post(r('sales.cancel', sale.id), { preserveScroll: true, onSuccess: () => setCanceling(false) });
                    }}
                    className="space-y-5"
                >
                    <Field label="Motivo (opcional)">
                        <textarea rows="3" value={cancelForm.data.reason} onChange={(e) => cancelForm.setData('reason', e.target.value)} className={`${inputClass} resize-none`} />
                    </Field>
                    <div className="flex justify-end gap-3">
                        <GhostButton onClick={() => setCanceling(false)}>Voltar</GhostButton>
                        <DangerButton type="submit" disabled={cancelForm.processing}>Cancelar venda</DangerButton>
                    </div>
                </form>
            </DialogShell>
        </Layout>
    );
}
