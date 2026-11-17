import { DangerButton, DialogShell, EmptyState, GhostButton, IconButton, PageHeader, PrimaryAction } from '@/Components/Platform/UI';
import { CAMPAIGN_STATUS, formatDate, useLicensee } from '@/lib/licensee';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

const daysBetween = (a, b) => Math.round((new Date(`${b}T00:00:00`) - new Date(`${a}T00:00:00`)) / 86400000);

export default function CampaignsIndex({ campaigns }) {
    const { Layout, r } = useLicensee();
    const [filter, setFilter] = useState('all');
    const [removing, setRemoving] = useState(null);

    const today = new Date().toISOString().slice(0, 10);
    const counts = campaigns.reduce((acc, c) => ({ ...acc, [c.status]: (acc[c.status] ?? 0) + 1 }), {});
    const filtered = campaigns.filter((c) => filter === 'all' || c.status === filter);

    return (
        <Layout>
            <Head title="Campanhas" />

            <div className="max-w-6xl mx-auto p-8 space-y-8 animate-in fade-in duration-700">
                <PageHeader
                    title="Campanhas"
                    subtitle="Ofereça tabelas de preços especiais por um período, com data de início e de fim"
                    actions={
                        <PrimaryAction as="link" href={r('campaigns.create')} icon="add">
                            Nova campanha
                        </PrimaryAction>
                    }
                />

                <div className="flex flex-wrap gap-2">
                    {[
                        { key: 'all', label: 'Todas', count: campaigns.length },
                        { key: 'active', label: 'Em andamento', count: counts.active },
                        { key: 'scheduled', label: 'Agendadas', count: counts.scheduled },
                        { key: 'ended', label: 'Encerradas', count: counts.ended },
                    ].map((t) => (
                        <button
                            key={t.key}
                            onClick={() => setFilter(t.key)}
                            className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-all ${
                                filter === t.key ? 'bg-white dark:bg-slate-800 text-primary dark:text-[#00D1FF] shadow-sm' : 'text-on-surface-variant hover:bg-white/50'
                            }`}
                        >
                            {t.label}
                            {t.count > 0 && <span className="bg-primary/10 px-2 rounded-full text-xs">{t.count}</span>}
                        </button>
                    ))}
                </div>

                {filtered.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-outline-variant/10 dark:border-slate-800">
                        <EmptyState
                            icon="campaign"
                            title="Nenhuma campanha"
                            description="Crie uma campanha para oferecer tabelas de preços especiais em um período determinado."
                            action={<PrimaryAction as="link" href={r('campaigns.create')} icon="add">Criar campanha</PrimaryAction>}
                        />
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filtered.map((c) => {
                            const status = CAMPAIGN_STATUS[c.status];
                            const total = Math.max(daysBetween(c.starts_on, c.ends_on) + 1, 1);
                            const elapsed = Math.min(Math.max(daysBetween(c.starts_on, today) + 1, 0), total);
                            const pct = c.status === 'ended' ? 100 : c.status === 'scheduled' ? 0 : Math.round((elapsed / total) * 100);
                            return (
                                <div key={c.id} className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-outline-variant/10 dark:border-slate-800">
                                    <div className="flex flex-wrap items-start gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-error/10 flex items-center justify-center shrink-0">
                                            <span className="material-symbols-outlined text-error">campaign</span>
                                        </div>
                                        <div className="flex-1 min-w-[220px]">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <Link href={r('campaigns.edit', c.id)} className="font-headline font-bold text-lg text-[#003346] dark:text-white hover:text-primary">
                                                    {c.name}
                                                </Link>
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${status.className}`}>{status.label}</span>
                                            </div>
                                            <p className="text-sm text-[#507c94] dark:text-[#87b3cd] flex items-center gap-1 mt-0.5">
                                                <span className="material-symbols-outlined text-base">date_range</span>
                                                {formatDate(c.starts_on)} a {formatDate(c.ends_on)} · {total} dia(s)
                                            </p>
                                            <div className="flex flex-wrap gap-2 mt-3">
                                                {c.price_tables.map((t) => (
                                                    <span key={t.id} className="inline-flex items-center gap-1 bg-surface dark:bg-slate-950 text-[#003346] dark:text-white px-3 py-1 rounded-full text-[11px] font-bold">
                                                        <span className="material-symbols-outlined text-sm text-primary">sell</span>
                                                        {t.name} · {t.max_installments > 1 ? `até ${t.max_installments}x` : 'à vista'}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex gap-1">
                                            <Link href={r('campaigns.edit', c.id)} className="p-2 rounded-lg text-[#507c94] hover:text-primary hover:bg-primary/10 transition-colors" title="Editar">
                                                <span className="material-symbols-outlined text-lg">edit</span>
                                            </Link>
                                            <IconButton icon="delete" title="Remover" tone="danger" onClick={() => setRemoving(c)} />
                                        </div>
                                    </div>
                                    <div className="mt-4 h-1.5 bg-surface-container dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div className={`h-full rounded-full ${c.status === 'ended' ? 'bg-slate-300' : 'kinetic-gradient'}`} style={{ width: `${pct}%` }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <DialogShell
                show={!!removing}
                onClose={() => setRemoving(null)}
                icon="delete"
                iconTone="error"
                title={`Remover a campanha "${removing?.name ?? ''}"?`}
                description="As tabelas de preços continuam disponíveis; só a campanha é removida."
                footer={
                    <>
                        <GhostButton onClick={() => setRemoving(null)}>Cancelar</GhostButton>
                        <DangerButton onClick={() => router.delete(r('campaigns.destroy', removing.id), { onFinish: () => setRemoving(null) })}>
                            Remover campanha
                        </DangerButton>
                    </>
                }
            />
        </Layout>
    );
}
