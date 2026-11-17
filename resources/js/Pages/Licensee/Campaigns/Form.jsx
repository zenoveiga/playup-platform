import { Card, Field, IconButton, inputClass, PageHeader, PrimaryAction } from '@/Components/Platform/UI';
import { CAMPAIGN_STATUS, useLicensee } from '@/lib/licensee';
import { Head, Link, useForm } from '@inertiajs/react';

export default function CampaignForm({ campaign, priceTables }) {
    const { Layout, r } = useLicensee();
    const isEdit = !!campaign;

    const { data, setData, post, put, processing, errors, isDirty } = useForm({
        name: campaign?.name ?? '',
        description: campaign?.description ?? '',
        starts_on: campaign?.starts_on ?? new Date().toISOString().slice(0, 10),
        ends_on: campaign?.ends_on ?? '',
        price_table_ids: campaign?.price_table_ids ?? [],
    });

    const byId = Object.fromEntries(priceTables.map((t) => [t.id, t]));
    const selected = data.price_table_ids.map((id) => byId[id]).filter(Boolean);
    const available = priceTables.filter((t) => !data.price_table_ids.includes(t.id));

    const move = (i, dir) => {
        const j = i + dir;
        if (j < 0 || j >= data.price_table_ids.length) return;
        const ids = [...data.price_table_ids];
        [ids[i], ids[j]] = [ids[j], ids[i]];
        setData('price_table_ids', ids);
    };

    const days =
        data.starts_on && data.ends_on
            ? Math.round((new Date(`${data.ends_on}T00:00:00`) - new Date(`${data.starts_on}T00:00:00`)) / 86400000) + 1
            : null;

    const submit = (e) => {
        e.preventDefault();
        const opts = { preserveScroll: true };
        isEdit ? put(r('campaigns.update', campaign.id), opts) : post(r('campaigns.store'), opts);
    };

    const tableErrors = errors.price_table_ids || Object.entries(errors).find(([k]) => k.startsWith('price_table_ids.'))?.[1];

    return (
        <Layout>
            <Head title={isEdit ? `Campanha: ${campaign.name}` : 'Nova campanha'} />

            <form onSubmit={submit} className="max-w-6xl mx-auto p-8 space-y-6 animate-in fade-in duration-700 pb-36">
                <PageHeader
                    breadcrumb={[{ label: 'Campanhas', href: r('campaigns.index') }, { label: isEdit ? 'Editar' : 'Nova campanha' }]}
                    title={isEdit ? campaign.name : 'Nova Campanha'}
                    subtitle="Durante o período, as tabelas escolhidas ficam disponíveis como opções de pagamento"
                    actions={
                        isEdit && (
                            <span className={`px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider ${CAMPAIGN_STATUS[campaign.status].className}`}>
                                {CAMPAIGN_STATUS[campaign.status].label}
                            </span>
                        )
                    }
                />

                <Card icon="campaign" iconTone="error" title="Dados da campanha">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Field label="Nome da campanha *" error={errors.name} className="md:col-span-2">
                            <input className={inputClass} value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="Ex.: Volta às aulas, Black Friday" required />
                        </Field>
                        <Field label="Data de início *" error={errors.starts_on}>
                            <input type="date" className={inputClass} value={data.starts_on} onChange={(e) => setData('starts_on', e.target.value)} required />
                        </Field>
                        <Field label="Data de fim *" error={errors.ends_on} hint={days > 0 ? `${days} dia(s) de campanha` : undefined}>
                            <input type="date" min={data.starts_on} className={inputClass} value={data.ends_on} onChange={(e) => setData('ends_on', e.target.value)} required />
                        </Field>
                        <Field label="Descrição" error={errors.description} className="md:col-span-2">
                            <textarea rows="3" className={`${inputClass} resize-none`} value={data.description} onChange={(e) => setData('description', e.target.value)} placeholder="Opcional: regras, público-alvo..." />
                        </Field>
                    </div>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <Card
                        icon="sell"
                        title="Tabelas de preços da campanha"
                        description="Opções de pagamento oferecidas durante a campanha, na ordem de exibição"
                        className="col-span-12 lg:col-span-7"
                    >
                        {selected.length === 0 ? (
                            <p className="text-sm text-[#507c94] text-center py-10 bg-surface/50 dark:bg-slate-950/50 rounded-2xl">Adicione tabelas da lista ao lado.</p>
                        ) : (
                            <ol className="space-y-2">
                                {selected.map((t, i) => (
                                    <li key={t.id} className="flex items-center gap-3 bg-surface/60 dark:bg-slate-950/60 rounded-2xl px-4 py-3">
                                        <span className="w-8 h-8 shrink-0 rounded-xl kinetic-gradient text-white flex items-center justify-center font-black text-sm">{i + 1}</span>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-sm text-[#003346] dark:text-white truncate">{t.name}</p>
                                            <p className="text-[11px] text-[#507c94]">
                                                {t.max_installments > 1 ? `Até ${t.max_installments}x` : 'À vista'} · {t.items_count} curso(s) com valor
                                            </p>
                                        </div>
                                        <IconButton icon="arrow_upward" title="Subir" onClick={() => move(i, -1)} disabled={i === 0} />
                                        <IconButton icon="arrow_downward" title="Descer" onClick={() => move(i, 1)} disabled={i === selected.length - 1} />
                                        <IconButton
                                            icon="remove_circle"
                                            title="Retirar da campanha"
                                            tone="danger"
                                            onClick={() => setData('price_table_ids', data.price_table_ids.filter((id) => id !== t.id))}
                                        />
                                    </li>
                                ))}
                            </ol>
                        )}
                        {tableErrors && <p className="text-xs text-error mt-3">{tableErrors}</p>}
                    </Card>

                    <Card
                        icon="library_books"
                        iconTone="tertiary"
                        title="Suas tabelas"
                        className="col-span-12 lg:col-span-5"
                        actions={
                            <Link href={r('price-tables.create')} className="text-xs font-bold text-primary dark:text-[#00D1FF] hover:underline whitespace-nowrap">
                                + Nova tabela
                            </Link>
                        }
                    >
                        <div className="space-y-2">
                            {available.length === 0 ? (
                                <p className="text-xs text-[#507c94] text-center py-6">
                                    {priceTables.length === 0 ? 'Crie uma tabela de preços para usar na campanha.' : 'Todas as tabelas já estão na campanha.'}
                                </p>
                            ) : (
                                available.map((t) => (
                                    <button
                                        key={t.id}
                                        type="button"
                                        onClick={() => setData('price_table_ids', [...data.price_table_ids, t.id])}
                                        className="w-full flex items-center gap-3 text-left bg-surface/60 dark:bg-slate-950/60 hover:bg-primary/5 rounded-2xl px-4 py-3 transition group"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-sm text-[#003346] dark:text-white truncate">
                                                {t.name} {t.is_default && <span className="text-[10px] text-tertiary font-black uppercase ml-1">padrão</span>}
                                            </p>
                                            <p className="text-[11px] text-[#507c94]">
                                                {t.max_installments > 1 ? `Até ${t.max_installments}x` : 'À vista'} · {t.items_count} curso(s)
                                            </p>
                                        </div>
                                        <span className="material-symbols-outlined text-primary dark:text-[#00D1FF] opacity-60 group-hover:opacity-100">add_circle</span>
                                    </button>
                                ))
                            )}
                        </div>
                    </Card>
                </div>

                <div className="fixed bottom-0 left-72 right-0 z-30 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-t border-outline-variant/10 dark:border-slate-800 px-8 py-4">
                    <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
                        <Link href={r('campaigns.index')} className="text-sm font-bold text-[#507c94] hover:text-primary">
                            {isDirty ? 'Descartar alterações' : 'Voltar'}
                        </Link>
                        <PrimaryAction type="submit" icon="save" disabled={processing}>
                            Salvar campanha
                        </PrimaryAction>
                    </div>
                </div>
            </form>
        </Layout>
    );
}
