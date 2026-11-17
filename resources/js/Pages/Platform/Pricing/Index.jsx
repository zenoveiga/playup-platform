import { Card, EmptyState, Field, inputClass, MoneyInput, PageHeader, PrimaryAction, StatusBadge } from '@/Components/Platform/UI';
import PlatformLayout from '@/Layouts/PlatformLayout';
import { installmentText } from '@/lib/licensee';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function SuggestedPricing({ table, prices, courses }) {
    const [search, setSearch] = useState('');
    const { data, setData, put, processing, errors, isDirty } = useForm({
        max_installments: table.max_installments,
        prices: Object.fromEntries(courses.map((c) => [c.id, prices[c.id] ?? ''])),
    });

    const setPrice = (id, value) => setData('prices', { ...data.prices, [id]: value });
    const filtered = courses.filter((c) => c.title.toLowerCase().includes(search.trim().toLowerCase()));
    const priced = courses.filter((c) => data.prices[c.id] !== '').length;

    const submit = (e) => {
        e.preventDefault();
        put(route('platform.pricing.update'), { preserveScroll: true });
    };

    return (
        <PlatformLayout>
            <Head title="Valores Sugeridos" />

            <form onSubmit={submit} className="max-w-6xl mx-auto p-8 space-y-6 animate-in fade-in duration-700 pb-36">
                <PageHeader
                    breadcrumb={[{ label: 'Administração', href: route('platform.dashboard') }, { label: 'Valores Sugeridos' }]}
                    title="Tabela de Valores Sugeridos"
                    subtitle="Referência de preços para os licenciados. Cada licenciado pode montar a própria tabela a partir destes valores."
                />

                <Card icon="sell" title="Condição de pagamento" description={`${priced} de ${courses.length} curso(s) com valor sugerido`}>
                    <Field label="Parcelamento máximo sugerido" error={errors.max_installments} className="max-w-xs">
                        <select value={data.max_installments} onChange={(e) => setData('max_installments', Number(e.target.value))} className={inputClass}>
                            {Array.from({ length: 24 }, (_, i) => i + 1).map((n) => (
                                <option key={n} value={n}>{n === 1 ? 'À vista' : `Até ${n}x`}</option>
                            ))}
                        </select>
                    </Field>
                </Card>

                <div className="bg-white dark:bg-slate-900 rounded-xl border border-outline-variant/15 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="p-6 flex items-center justify-between gap-4 border-b border-outline-variant/10 dark:border-slate-800">
                        <h3 className="font-headline font-bold text-lg text-[#003346] dark:text-white">Valores por curso</h3>
                        <div className="relative w-72">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-base">search</span>
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-surface-container-lowest dark:bg-slate-950 border border-outline-variant/20 dark:border-slate-800 rounded-full py-2 pl-10 pr-4 text-xs text-on-surface dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                placeholder="Pesquisar curso..."
                            />
                        </div>
                    </div>
                    {courses.length === 0 ? (
                        <EmptyState icon="auto_stories" title="Nenhum curso cadastrado" description="Cadastre cursos para definir os valores sugeridos." />
                    ) : (
                        <ul className="divide-y divide-outline-variant/10 dark:divide-slate-800">
                            {filtered.map((c) => (
                                <li key={c.id} className="px-6 py-4 flex flex-wrap items-center gap-4">
                                    <div className="flex-1 min-w-[220px]">
                                        <p className="font-bold text-sm text-[#003346] dark:text-white">{c.title}</p>
                                        <p className="text-xs text-[#507c94] dark:text-[#87b3cd]">
                                            {[c.category, c.workload_hours && `${c.workload_hours}h`, c.structure === 'modular' ? 'Por módulos' : 'Livre'].filter(Boolean).join(' · ')}
                                        </p>
                                    </div>
                                    <StatusBadge status={c.status} />
                                    <div className="w-44">
                                        <MoneyInput value={data.prices[c.id]} onChange={(v) => setPrice(c.id, v)} placeholder="Sem valor" />
                                        {errors[`prices.${c.id}`] && <p className="text-xs text-error mt-1">{errors[`prices.${c.id}`]}</p>}
                                    </div>
                                    <p className="w-40 text-right text-[11px] font-bold text-[#507c94]">
                                        {data.prices[c.id] ? installmentText(data.prices[c.id], data.max_installments) : ''}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="fixed bottom-0 left-72 right-0 z-30 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-t border-outline-variant/10 dark:border-slate-800 px-8 py-4">
                    <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
                        <p className="text-xs font-bold text-[#507c94]">
                            {isDirty ? 'Há alterações não salvas.' : `Última atualização: ${new Date(table.updated_at).toLocaleString('pt-BR')}`}
                        </p>
                        <PrimaryAction type="submit" icon="save" disabled={processing}>
                            Salvar valores sugeridos
                        </PrimaryAction>
                    </div>
                </div>
            </form>
        </PlatformLayout>
    );
}
