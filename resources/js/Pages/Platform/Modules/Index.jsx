import { DangerButton, DialogShell, EmptyState, GhostButton, IconButton, PageHeader, PrimaryAction, StatusBadge } from '@/Components/Platform/UI';
import PlatformLayout from '@/Layouts/PlatformLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function ModulesIndex({ modules }) {
    const [search, setSearch] = useState('');
    const [removing, setRemoving] = useState(null);

    const filtered = modules.filter((m) => m.title.toLowerCase().includes(search.trim().toLowerCase()));

    return (
        <PlatformLayout>
            <Head title="Biblioteca de Módulos" />

            <div className="max-w-7xl mx-auto p-8 space-y-8 animate-in fade-in duration-700">
                <PageHeader
                    breadcrumb={[{ label: 'Administração', href: route('platform.dashboard') }, { label: 'Módulos' }]}
                    title="Biblioteca de Módulos"
                    subtitle="Cada módulo reúne vídeo conceito, vídeo exemplo, aplicação, erros comuns, materiais de apoio e exercícios"
                    actions={
                        <PrimaryAction as="link" href={route('platform.modules.create')} icon="add">
                            Novo módulo
                        </PrimaryAction>
                    }
                />

                <div className="relative w-full sm:w-80">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-base">search</span>
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-white dark:bg-slate-950 border border-outline-variant/20 dark:border-slate-800 rounded-full py-2.5 pl-10 pr-4 text-sm text-on-surface dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-on-surface-variant/50"
                        placeholder="Pesquisar módulos..."
                    />
                </div>

                {filtered.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-outline-variant/10 dark:border-slate-800">
                        <EmptyState
                            icon="view_module"
                            title="Nenhum módulo por aqui"
                            description="Crie módulos para montá-los em cursos. Um mesmo módulo pode ser reutilizado em vários cursos."
                            action={<PrimaryAction as="link" href={route('platform.modules.create')} icon="add">Criar primeiro módulo</PrimaryAction>}
                        />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filtered.map((m) => (
                            <div key={m.id} className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-outline-variant/10 dark:border-slate-800 flex flex-col">
                                <div className="flex items-start justify-between gap-3 mb-3">
                                    <div className="w-11 h-11 rounded-2xl bg-primary-container/20 flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-primary dark:text-[#00D1FF]">view_module</span>
                                    </div>
                                    <StatusBadge status={m.status} />
                                </div>
                                <Link href={route('platform.modules.edit', m.id)} className="font-headline font-bold text-lg text-[#003346] dark:text-white hover:text-primary leading-tight">
                                    {m.title}
                                </Link>
                                {m.description && <p className="text-sm text-[#507c94] dark:text-[#87b3cd] mt-1 line-clamp-2">{m.description}</p>}

                                <div className="grid grid-cols-4 gap-2 mt-5 text-center">
                                    {[
                                        { icon: 'smart_display', value: `${m.videos_count}/3`, label: 'vídeos' },
                                        { icon: 'timer', value: `${m.application_minutes}'`, label: 'aplicação' },
                                        { icon: 'attach_file', value: m.support_materials_count, label: 'apoio' },
                                        { icon: 'quiz', value: m.exercises_count, label: 'exercícios' },
                                    ].map((s) => (
                                        <div key={s.label} className="bg-surface dark:bg-slate-950 rounded-xl py-2">
                                            <span className="material-symbols-outlined text-base text-primary dark:text-[#00D1FF]">{s.icon}</span>
                                            <p className="text-sm font-black text-[#003346] dark:text-white leading-none">{s.value}</p>
                                            <p className="text-[9px] uppercase font-bold tracking-wider text-[#507c94]">{s.label}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex items-center justify-between mt-5 pt-4 border-t border-outline-variant/10 dark:border-slate-800">
                                    <span className="text-xs font-bold text-[#507c94] dark:text-[#87b3cd]">
                                        Usado em {m.courses_count} curso(s)
                                    </span>
                                    <div className="flex gap-1">
                                        <Link href={route('platform.modules.edit', m.id)} className="p-2 rounded-lg text-[#507c94] hover:text-primary hover:bg-primary/10 transition-colors" title="Editar">
                                            <span className="material-symbols-outlined text-lg">edit</span>
                                        </Link>
                                        <IconButton icon="delete" title="Remover" tone="danger" onClick={() => setRemoving(m)} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <DialogShell
                show={!!removing}
                onClose={() => setRemoving(null)}
                icon="delete"
                iconTone="error"
                title={`Remover o módulo "${removing?.title ?? ''}"?`}
                description={
                    removing?.courses_count
                        ? `Ele será retirado de ${removing.courses_count} curso(s). Vídeos, materiais e exercícios serão apagados.`
                        : 'Vídeos, materiais e exercícios do módulo serão apagados.'
                }
                footer={
                    <>
                        <GhostButton onClick={() => setRemoving(null)}>Cancelar</GhostButton>
                        <DangerButton onClick={() => router.delete(route('platform.modules.destroy', removing.id), { onFinish: () => setRemoving(null) })}>
                            Remover módulo
                        </DangerButton>
                    </>
                }
            />
        </PlatformLayout>
    );
}
