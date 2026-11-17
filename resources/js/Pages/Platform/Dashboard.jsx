import { PageHeader, PrimaryAction, SecondaryAction, StatCard, StatusBadge } from '@/Components/Platform/UI';
import PlatformLayout from '@/Layouts/PlatformLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Dashboard({ stats, pendingLicensees, recentCourses }) {
    const approve = (id) => router.post(route('platform.licensees.approve', id), {}, { preserveScroll: true });

    return (
        <PlatformLayout>
            <Head title="Painel do Administrador" />

            <div className="max-w-7xl mx-auto p-8 space-y-8 animate-in fade-in duration-700">
                <PageHeader
                    title="Painel Geral"
                    subtitle="Visão consolidada de licenciados, alunos e catálogo de cursos da plataforma"
                    actions={
                        <>
                            <SecondaryAction as="link" href={route('platform.modules.create')} icon="view_module">
                                Novo módulo
                            </SecondaryAction>
                            <PrimaryAction as="link" href={route('platform.courses.create')} icon="add_circle">
                                Novo curso
                            </PrimaryAction>
                        </>
                    }
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard label="Aguardando aprovação" value={stats.pending_licensees} icon="hourglass_top" tone="amber" />
                    <StatCard label="Licenciados ativos" value={stats.active_licensees} icon="storefront" tone="tertiary" hint={`${stats.blocked_licensees} bloqueados`} />
                    <StatCard label="Alunos na plataforma" value={stats.students} icon="group" />
                    <StatCard label="Cursos" value={stats.courses} icon="auto_stories" hint={`${stats.published_courses} publicados · ${stats.modules} módulos`} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Pendências */}
                    <section className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-outline-variant/10 dark:border-slate-800 overflow-hidden">
                        <div className="p-6 flex items-center justify-between border-b border-outline-variant/10 dark:border-slate-800">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-amber-600">pending_actions</span>
                                </div>
                                <h3 className="font-headline font-bold text-lg text-[#003346] dark:text-white">Cadastros aguardando aprovação</h3>
                            </div>
                            <Link href={route('platform.licensees.index')} className="text-xs font-bold text-primary dark:text-[#00D1FF] hover:underline">
                                Ver todos
                            </Link>
                        </div>
                        {pendingLicensees.length === 0 ? (
                            <div className="p-10 text-center text-sm text-[#507c94] dark:text-[#87b3cd] font-medium">
                                <span className="material-symbols-outlined text-3xl text-tertiary block mb-2">task_alt</span>
                                Nenhum cadastro pendente.
                            </div>
                        ) : (
                            <ul className="divide-y divide-outline-variant/10 dark:divide-slate-800">
                                {pendingLicensees.map((l) => (
                                    <li key={l.id} className="px-6 py-4 flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-sm">
                                            {l.name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-sm text-[#003346] dark:text-white truncate">{l.name}</p>
                                            <p className="text-xs text-[#507c94] dark:text-[#87b3cd] truncate">
                                                {l.email} · {new Date(l.created_at).toLocaleDateString('pt-BR')}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => approve(l.id)}
                                            className="flex items-center gap-1 px-4 py-2 rounded-xl bg-[#cdffd4] text-[#006a35] text-xs font-black hover:opacity-90 transition"
                                        >
                                            <span className="material-symbols-outlined text-base">check</span>
                                            Aprovar
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>

                    {/* Cursos recentes */}
                    <section className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-outline-variant/10 dark:border-slate-800 overflow-hidden">
                        <div className="p-6 flex items-center justify-between border-b border-outline-variant/10 dark:border-slate-800">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-primary-container/20 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-primary dark:text-[#00D1FF]">auto_stories</span>
                                </div>
                                <h3 className="font-headline font-bold text-lg text-[#003346] dark:text-white">Cursos recentes</h3>
                            </div>
                            <Link href={route('platform.courses.index')} className="text-xs font-bold text-primary dark:text-[#00D1FF] hover:underline">
                                Catálogo
                            </Link>
                        </div>
                        {recentCourses.length === 0 ? (
                            <div className="p-10 text-center text-sm text-[#507c94] dark:text-[#87b3cd] font-medium">
                                Nenhum curso cadastrado ainda.
                            </div>
                        ) : (
                            <ul className="divide-y divide-outline-variant/10 dark:divide-slate-800">
                                {recentCourses.map((c) => (
                                    <li key={c.id}>
                                        <Link href={route('platform.courses.edit', c.id)} className="px-6 py-4 flex items-center gap-4 hover:bg-surface-container-low/40 dark:hover:bg-slate-800/40 transition">
                                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-surface-container shrink-0 flex items-center justify-center">
                                                {c.cover_url ? (
                                                    <img src={c.cover_url} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="material-symbols-outlined text-primary">image</span>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-sm text-[#003346] dark:text-white truncate">{c.title}</p>
                                                <p className="text-xs text-[#507c94] dark:text-[#87b3cd]">
                                                    {c.structure === 'modular' ? `${c.modules_count} módulos` : `${c.materials_count} materiais`}
                                                </p>
                                            </div>
                                            <StatusBadge status={c.status} />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>
                </div>
            </div>
        </PlatformLayout>
    );
}
