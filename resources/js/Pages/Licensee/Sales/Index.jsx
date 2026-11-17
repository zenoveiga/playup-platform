import { EmptyState, PageHeader, PrimaryAction, StatCard } from '@/Components/Platform/UI';
import { brl, SALE_STATUS, useLicensee } from '@/lib/licensee';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

const th = 'px-6 py-4 text-xs font-bold text-on-surface-variant dark:text-outline-variant uppercase tracking-widest border-b border-outline-variant/10 dark:border-slate-800';

export default function SalesIndex({ sales, stats, paymentMethods }) {
    const { Layout, r } = useLicensee();
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');

    const filtered = sales.filter((s) => {
        if (filter !== 'all' && s.status !== filter) return false;
        const q = search.trim().toLowerCase();
        return !q || [s.code, s.student?.name, s.student?.email, ...s.items.map((i) => i.course_title)].join(' ').toLowerCase().includes(q);
    });

    return (
        <Layout>
            <Head title="Vendas" />

            <div className="max-w-7xl mx-auto p-8 space-y-8 animate-in fade-in duration-700">
                <PageHeader
                    title="Vendas"
                    subtitle="Venda cursos para seus alunos e acompanhe os pagamentos"
                    actions={
                        <PrimaryAction as="link" href={r('sales.create')} icon="add_shopping_cart">
                            Nova venda
                        </PrimaryAction>
                    }
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard label="Vendido no mês" value={brl(stats.month_total)} icon="payments" tone="tertiary" />
                    <StatCard label="Vendas pagas no mês" value={stats.month_count} icon="receipt_long" />
                    <StatCard label="A receber" value={brl(stats.pending_total)} icon="hourglass_top" tone="amber" />
                    <StatCard label="Aguardando pagamento" value={stats.pending_count} icon="pending_actions" tone="amber" />
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-xl border border-outline-variant/15 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-outline-variant/10 dark:border-slate-800">
                        <div className="flex flex-wrap gap-2">
                            {[
                                { key: 'all', label: 'Todas' },
                                { key: 'paid', label: 'Pagas' },
                                { key: 'pending', label: 'Aguardando' },
                                { key: 'canceled', label: 'Canceladas' },
                            ].map((t) => (
                                <button
                                    key={t.key}
                                    onClick={() => setFilter(t.key)}
                                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                                        filter === t.key ? 'bg-surface-container-low dark:bg-slate-800 text-primary dark:text-[#00D1FF]' : 'text-on-surface-variant hover:bg-surface-container-low/50'
                                    }`}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>
                        <div className="relative w-full sm:w-72">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-base">search</span>
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-surface-container-lowest dark:bg-slate-950 border border-outline-variant/20 dark:border-slate-800 rounded-full py-2 pl-10 pr-4 text-xs text-on-surface dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                placeholder="Código, aluno ou curso..."
                            />
                        </div>
                    </div>

                    {filtered.length === 0 ? (
                        <EmptyState
                            icon="point_of_sale"
                            title="Nenhuma venda encontrada"
                            description="Registre a venda de um curso para liberar o acesso ao aluno."
                            action={<PrimaryAction as="link" href={r('sales.create')} icon="add_shopping_cart">Nova venda</PrimaryAction>}
                        />
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-separate border-spacing-0">
                                <thead>
                                    <tr className="bg-surface-container-low/30 dark:bg-slate-950/40">
                                        <th className={th}>Venda</th>
                                        <th className={th}>Aluno</th>
                                        <th className={th}>Cursos</th>
                                        <th className={th}>Pagamento</th>
                                        <th className={`${th} text-right`}>Total</th>
                                        <th className={th}>Situação</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-outline-variant/10 dark:divide-slate-800">
                                    {filtered.map((s) => (
                                        <tr key={s.id} className="hover:bg-surface-container-low/30 dark:hover:bg-slate-800/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <Link href={r('sales.show', s.id)} className="font-bold text-sm text-primary dark:text-[#00D1FF] hover:underline">
                                                    {s.code}
                                                </Link>
                                                <p className="text-[11px] text-[#507c94]">{new Date(s.created_at).toLocaleDateString('pt-BR')}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-sm text-[#003346] dark:text-white">{s.student?.name}</p>
                                                <p className="text-[11px] text-[#507c94]">{s.student?.email}</p>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-[#003346] dark:text-white max-w-xs">
                                                <span className="line-clamp-2">{s.items.map((i) => i.course_title).join(', ')}</span>
                                            </td>
                                            <td className="px-6 py-4 text-xs text-[#507c94]">
                                                {paymentMethods[s.payment_method]}
                                                {s.installments > 1 ? ` · ${s.installments}x` : ''}
                                            </td>
                                            <td className="px-6 py-4 text-right font-black text-[#003346] dark:text-white tabular-nums">{brl(s.total)}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${SALE_STATUS[s.status].className}`}>
                                                    {SALE_STATUS[s.status].label}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
