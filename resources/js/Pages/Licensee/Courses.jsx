import { EmptyState, PageHeader, PrimaryAction, SecondaryAction } from '@/Components/Platform/UI';
import { brl, formatDate, installmentText, useLicensee } from '@/lib/licensee';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

const LEVELS = { iniciante: 'Iniciante', intermediario: 'Intermediário', avancado: 'Avançado' };

export default function LicenseeCourses({ courses, suggestedTable, defaultTable, activeCampaigns }) {
    const { Layout, r } = useLicensee();
    const [search, setSearch] = useState('');

    const filtered = courses.filter((c) =>
        [c.title, c.category].filter(Boolean).join(' ').toLowerCase().includes(search.trim().toLowerCase()),
    );

    return (
        <Layout>
            <Head title="Cursos Disponíveis" />

            <div className="max-w-7xl mx-auto p-8 space-y-8 animate-in fade-in duration-700">
                <PageHeader
                    title="Cursos Disponíveis"
                    subtitle="Cursos publicados pela PlayUp, com o valor sugerido, o seu valor e as campanhas em andamento"
                    actions={
                        <>
                            <SecondaryAction as="link" href={r('campaigns.index')} icon="campaign">
                                Campanhas
                            </SecondaryAction>
                            <PrimaryAction as="link" href={r('students.create')} icon="person_add">
                                Matricular aluno
                            </PrimaryAction>
                        </>
                    }
                />

                {/* Situação das tabelas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-outline-variant/10 dark:border-slate-800 shadow-sm">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#87b3cd]">Sua tabela padrão</p>
                        {defaultTable ? (
                            <Link href={r('price-tables.edit', defaultTable.id)} className="block mt-1 font-headline font-bold text-[#003346] dark:text-white hover:text-primary">
                                {defaultTable.name}
                            </Link>
                        ) : (
                            <Link href={r('price-tables.create')} className="block mt-1 text-sm font-bold text-primary dark:text-[#00D1FF] hover:underline">
                                Criar minha tabela de preços →
                            </Link>
                        )}
                        <p className="text-[11px] text-[#507c94] mt-1">Sem tabela própria, vale o valor sugerido.</p>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-outline-variant/10 dark:border-slate-800 shadow-sm">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#87b3cd]">Valores sugeridos</p>
                        <p className="mt-1 font-headline font-bold text-[#003346] dark:text-white">{suggestedTable.name}</p>
                        <p className="text-[11px] text-[#507c94] mt-1">Definidos pela PlayUp · até {suggestedTable.max_installments}x</p>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-outline-variant/10 dark:border-slate-800 shadow-sm">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#87b3cd]">Campanhas em andamento</p>
                        {activeCampaigns.length ? (
                            <ul className="mt-1 space-y-0.5">
                                {activeCampaigns.map((c) => (
                                    <li key={c.id} className="text-sm font-bold text-[#003346] dark:text-white">
                                        {c.name} <span className="text-[11px] font-medium text-[#507c94]">até {formatDate(c.ends_on)}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="mt-1 text-sm text-[#507c94]">Nenhuma no momento.</p>
                        )}
                    </div>
                </div>

                <div className="relative w-full sm:w-80">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-base">search</span>
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-white dark:bg-slate-950 border border-outline-variant/20 dark:border-slate-800 rounded-full py-2.5 pl-10 pr-4 text-sm text-on-surface dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        placeholder="Pesquisar cursos..."
                    />
                </div>

                {filtered.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-outline-variant/10 dark:border-slate-800">
                        <EmptyState icon="auto_stories" title="Nenhum curso disponível" description="Os cursos publicados pela PlayUp aparecerão aqui." />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filtered.map((c) => {
                            const price = c.my_price ?? c.suggested_price;
                            const installments = c.my_price ? defaultTable?.max_installments : suggestedTable.max_installments;
                            return (
                                <div key={c.id} className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-outline-variant/10 dark:border-slate-800 overflow-hidden flex flex-col">
                                    <div className="relative h-36 bg-surface-container">
                                        {c.cover_url ? (
                                            <img src={c.cover_url} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full kinetic-gradient opacity-80 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-5xl text-white/80">auto_stories</span>
                                            </div>
                                        )}
                                        {c.campaign_options.length > 0 && (
                                            <span className="absolute top-3 left-3 bg-error text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1">
                                                <span className="material-symbols-outlined text-xs">campaign</span>Em campanha
                                            </span>
                                        )}
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-[#507c94]">
                                            {[c.category, LEVELS[c.level], c.workload_hours && `${c.workload_hours}h`].filter(Boolean).join(' · ')}
                                        </p>
                                        <h3 className="font-headline font-bold text-lg text-[#003346] dark:text-white leading-tight mt-1">{c.title}</h3>
                                        <p className="text-xs text-[#507c94] dark:text-[#87b3cd] mt-1">
                                            {c.structure === 'modular' ? `${c.modules_count} módulos` : `${c.materials_count} materiais · ${c.exercises_count} exercícios`}
                                        </p>

                                        <div className="mt-5 pt-4 border-t border-outline-variant/10 dark:border-slate-800 space-y-3">
                                            <div className="flex items-end justify-between">
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-wider text-[#507c94]">
                                                        {c.my_price ? 'Seu valor' : 'Valor sugerido'}
                                                    </p>
                                                    <p className="text-2xl font-black text-primary dark:text-[#00D1FF] font-headline">{brl(price)}</p>
                                                    <p className="text-[11px] text-[#507c94]">{price ? installmentText(price, installments) : 'Sem valor definido'}</p>
                                                </div>
                                                {c.my_price && c.suggested_price && (
                                                    <p className="text-[11px] text-right text-[#507c94]">
                                                        Sugerido
                                                        <span className="block font-bold">{brl(c.suggested_price)}</span>
                                                    </p>
                                                )}
                                            </div>

                                            {c.campaign_options.map((o, i) => (
                                                <div key={i} className="flex items-center justify-between gap-3 bg-error/5 border border-error/10 rounded-xl px-3 py-2">
                                                    <div className="min-w-0">
                                                        <p className="text-xs font-bold text-[#003346] dark:text-white truncate">{o.table}</p>
                                                        <p className="text-[10px] text-[#507c94] truncate">{o.campaign} · até {formatDate(o.campaign_ends_on)}</p>
                                                    </div>
                                                    <div className="text-right shrink-0">
                                                        <p className="text-sm font-black text-error">{brl(o.price)}</p>
                                                        <p className="text-[10px] text-[#507c94]">{installmentText(o.price, o.max_installments)}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </Layout>
    );
}
