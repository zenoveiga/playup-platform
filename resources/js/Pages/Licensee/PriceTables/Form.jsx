import { Card, Field, inputClass, MoneyInput, PageHeader, PrimaryAction, SecondaryAction } from '@/Components/Platform/UI';
import { brl, formatDate, installmentText, useLicensee } from '@/lib/licensee';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function PriceTableForm({ table, prices, suggestedPrices, courses, campaigns, isFirstTable }) {
    const { Layout, r } = useLicensee();
    const isEdit = !!table;
    const [search, setSearch] = useState('');
    const [adjust, setAdjust] = useState('');

    const { data, setData, post, put, processing, errors, isDirty } = useForm({
        name: table?.name ?? (isFirstTable ? 'Minha tabela padrão' : ''),
        description: table?.description ?? '',
        max_installments: table?.max_installments ?? 12,
        is_default: table?.is_default ?? isFirstTable,
        prices: Object.fromEntries(courses.map((c) => [c.id, prices[c.id] ?? ''])),
    });

    const setPrice = (id, value) => setData('prices', { ...data.prices, [id]: value });

    // Preenche com o valor sugerido, aplicando um ajuste percentual opcional (ex.: -10 = 10% de desconto).
    const fillFromSuggested = (onlyEmpty) => {
        const factor = 1 + (Number(adjust) || 0) / 100;
        setData(
            'prices',
            Object.fromEntries(
                courses.map((c) => {
                    const current = data.prices[c.id];
                    const suggested = suggestedPrices[c.id];
                    if ((onlyEmpty && current !== '') || suggested === undefined) return [c.id, current];
                    return [c.id, (Number(suggested) * factor).toFixed(2)];
                }),
            ),
        );
    };

    const submit = (e) => {
        e.preventDefault();
        const opts = { preserveScroll: true };
        isEdit ? put(r('price-tables.update', table.id), opts) : post(r('price-tables.store'), opts);
    };

    const filtered = courses.filter((c) => c.title.toLowerCase().includes(search.trim().toLowerCase()));
    const filled = courses.filter((c) => data.prices[c.id] !== '').length;

    return (
        <Layout>
            <Head title={isEdit ? `Tabela: ${table.name}` : 'Nova tabela de preços'} />

            <form onSubmit={submit} className="max-w-6xl mx-auto p-8 space-y-6 animate-in fade-in duration-700 pb-36">
                <PageHeader
                    breadcrumb={[{ label: 'Tabelas de Preços', href: r('price-tables.index') }, { label: isEdit ? 'Editar' : 'Nova tabela' }]}
                    title={isEdit ? table.name : 'Nova Tabela de Preços'}
                    subtitle="Valores que você cobra pelos cursos publicados pela PlayUp"
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <Card icon="info" title="Dados da tabela" className="col-span-12 lg:col-span-7">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <Field label="Nome *" error={errors.name} className="md:col-span-2">
                                <input className={inputClass} value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="Ex.: À vista com desconto, Parcelado 12x" required />
                            </Field>
                            <Field label="Parcelamento" error={errors.max_installments}>
                                <select value={data.max_installments} onChange={(e) => setData('max_installments', Number(e.target.value))} className={inputClass}>
                                    {Array.from({ length: 24 }, (_, i) => i + 1).map((n) => (
                                        <option key={n} value={n}>{n === 1 ? 'À vista' : `Até ${n}x`}</option>
                                    ))}
                                </select>
                            </Field>
                            <Field label="Descrição" error={errors.description}>
                                <input className={inputClass} value={data.description} onChange={(e) => setData('description', e.target.value)} placeholder="Opcional" />
                            </Field>
                            <label className="md:col-span-2 flex items-start gap-3 p-4 rounded-2xl bg-surface dark:bg-slate-950 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={data.is_default}
                                    disabled={isFirstTable}
                                    onChange={(e) => setData('is_default', e.target.checked)}
                                    className="mt-0.5 h-5 w-5 rounded border-outline-variant text-primary focus:ring-primary"
                                />
                                <span>
                                    <span className="block text-sm font-bold text-[#003346] dark:text-white">Usar como minha tabela padrão</span>
                                    <span className="block text-xs text-[#507c94] dark:text-[#87b3cd]">
                                        Vale para todas as vendas fora de campanhas. {isFirstTable && 'Sua primeira tabela é sempre a padrão.'}
                                    </span>
                                </span>
                            </label>
                        </div>
                    </Card>

                    <Card icon="auto_fix_high" iconTone="tertiary" title="Partir dos valores sugeridos" className="col-span-12 lg:col-span-5">
                        <p className="text-xs text-[#507c94] dark:text-[#87b3cd] mb-4">
                            Copie os valores sugeridos pela PlayUp, com um ajuste percentual opcional (ex.: -10 para 10% de desconto, 15 para 15% a mais).
                        </p>
                        <Field label="Ajuste (%)">
                            <input type="number" step="0.5" className={inputClass} value={adjust} onChange={(e) => setAdjust(e.target.value)} placeholder="0" />
                        </Field>
                        <div className="flex flex-wrap gap-2 mt-4">
                            <SecondaryAction type="button" icon="content_copy" onClick={() => fillFromSuggested(false)}>
                                Aplicar em todos
                            </SecondaryAction>
                            <button type="button" onClick={() => fillFromSuggested(true)} className="px-4 py-2 text-xs font-bold text-primary dark:text-[#00D1FF] hover:underline">
                                Só nos vazios
                            </button>
                        </div>
                        {campaigns?.length > 0 && (
                            <p className="mt-5 text-[11px] font-bold text-[#507c94]">
                                Usada nas campanhas: {campaigns.map((c) => `${c.name} (${formatDate(c.starts_on)}–${formatDate(c.ends_on)})`).join(', ')}
                            </p>
                        )}
                    </Card>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-xl border border-outline-variant/15 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="p-6 flex flex-wrap items-center justify-between gap-4 border-b border-outline-variant/10 dark:border-slate-800">
                        <div>
                            <h3 className="font-headline font-bold text-lg text-[#003346] dark:text-white">Valores por curso</h3>
                            <p className="text-xs text-[#507c94]">{filled} de {courses.length} curso(s) com valor · cursos sem valor usam o sugerido</p>
                        </div>
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
                        <p className="p-10 text-center text-sm text-[#507c94]">Nenhum curso publicado pela PlayUp ainda.</p>
                    ) : (
                        <ul className="divide-y divide-outline-variant/10 dark:divide-slate-800">
                            {filtered.map((c) => {
                                const value = data.prices[c.id];
                                const suggested = suggestedPrices[c.id];
                                const diff = value !== '' && suggested ? ((Number(value) - Number(suggested)) / Number(suggested)) * 100 : null;
                                return (
                                    <li key={c.id} className="px-6 py-4 flex flex-wrap items-center gap-4">
                                        <div className="flex-1 min-w-[220px]">
                                            <p className="font-bold text-sm text-[#003346] dark:text-white">{c.title}</p>
                                            <p className="text-xs text-[#507c94] dark:text-[#87b3cd]">
                                                Sugerido: <span className="font-bold">{brl(suggested)}</span>
                                                {diff !== null && Math.abs(diff) >= 0.5 && (
                                                    <span className={`ml-2 font-bold ${diff < 0 ? 'text-tertiary' : 'text-amber-600'}`}>
                                                        {diff > 0 ? '+' : ''}
                                                        {diff.toFixed(0)}%
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                        <div className="w-44">
                                            <MoneyInput value={value} onChange={(v) => setPrice(c.id, v)} placeholder={suggested ? Number(suggested).toFixed(2) : 'Sem valor'} />
                                            {errors[`prices.${c.id}`] && <p className="text-xs text-error mt-1">{errors[`prices.${c.id}`]}</p>}
                                        </div>
                                        <p className="w-40 text-right text-[11px] font-bold text-[#507c94]">
                                            {value !== '' ? installmentText(value, data.max_installments) : ''}
                                        </p>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>

                <div className="fixed bottom-0 left-72 right-0 z-30 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-t border-outline-variant/10 dark:border-slate-800 px-8 py-4">
                    <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
                        <Link href={r('price-tables.index')} className="text-sm font-bold text-[#507c94] hover:text-primary">
                            {isDirty ? 'Descartar alterações' : 'Voltar'}
                        </Link>
                        <PrimaryAction type="submit" icon="save" disabled={processing}>
                            Salvar tabela
                        </PrimaryAction>
                    </div>
                </div>
            </form>
        </Layout>
    );
}
