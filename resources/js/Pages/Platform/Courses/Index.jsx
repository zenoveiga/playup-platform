import { DangerButton, DialogShell, EmptyState, GhostButton, IconButton, PageHeader, PrimaryAction, StatusBadge } from '@/Components/Platform/UI';
import PlatformLayout from '@/Layouts/PlatformLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

const LEVELS = { iniciante: 'Iniciante', intermediario: 'Intermediário', avancado: 'Avançado' };

export default function CoursesIndex({ courses }) {
    const [filter, setFilter] = useState('all');
    const [removing, setRemoving] = useState(null);

    const filtered = courses.filter((c) => filter === 'all' || c.structure === filter || c.status === filter);

    return (
        <PlatformLayout>
            <Head title="Cursos" />

            <div className="max-w-7xl mx-auto p-8 space-y-8 animate-in fade-in duration-700">
                <PageHeader
                    breadcrumb={[{ label: 'Administração', href: route('platform.dashboard') }, { label: 'Cursos' }]}
                    title="Catálogo de Cursos"
                    subtitle="Monte cursos a partir de módulos ou organize vídeos e apostilas livremente"
                    actions={
                        <PrimaryAction as="link" href={route('platform.courses.create')} icon="add_circle">
                            Novo curso
                        </PrimaryAction>
                    }
                />

                <div className="flex flex-wrap gap-2">
                    {[
                        { key: 'all', label: 'Todos' },
                        { key: 'modular', label: 'Por módulos' },
                        { key: 'free', label: 'Livres' },
                        { key: 'published', label: 'Publicados' },
                        { key: 'draft', label: 'Rascunhos' },
                    ].map((t) => (
                        <button
                            key={t.key}
                            onClick={() => setFilter(t.key)}
                            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                                filter === t.key
                                    ? 'bg-white dark:bg-slate-800 text-primary dark:text-[#00D1FF] shadow-sm'
                                    : 'text-on-surface-variant dark:text-outline-variant hover:bg-white/50'
                            }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                {filtered.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-outline-variant/10 dark:border-slate-800">
                        <EmptyState
                            icon="auto_stories"
                            title="Nenhum curso encontrado"
                            description="Crie um curso compondo módulos da biblioteca ou adicionando materiais diretamente."
                            action={<PrimaryAction as="link" href={route('platform.courses.create')} icon="add_circle">Criar curso</PrimaryAction>}
                        />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filtered.map((c) => (
                            <div key={c.id} className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-outline-variant/10 dark:border-slate-800 overflow-hidden flex flex-col group">
                                <Link href={route('platform.courses.edit', c.id)} className="relative h-40 bg-surface-container block overflow-hidden">
                                    {c.cover_url ? (
                                        <img src={c.cover_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full kinetic-gradient opacity-80 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-5xl text-white/80">auto_stories</span>
                                        </div>
                                    )}
                                    <div className="absolute top-3 left-3"><StatusBadge status={c.status} /></div>
                                    <span className="absolute top-3 right-3 bg-white/90 text-[#003346] text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full">
                                        {c.structure === 'modular' ? 'Por módulos' : 'Livre'}
                                    </span>
                                </Link>
                                <div className="p-6 flex-1 flex flex-col">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[#507c94]">
                                        {[c.category, LEVELS[c.level]].filter(Boolean).join(' · ')}
                                    </p>
                                    <Link href={route('platform.courses.edit', c.id)} className="font-headline font-bold text-lg text-[#003346] dark:text-white hover:text-primary leading-tight mt-1">
                                        {c.title}
                                    </Link>
                                    <div className="flex items-center gap-4 mt-4 text-xs font-bold text-[#507c94] dark:text-[#87b3cd]">
                                        <span className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-base">{c.structure === 'modular' ? 'view_module' : 'perm_media'}</span>
                                            {c.structure === 'modular' ? `${c.modules_count} módulos` : `${c.materials_count} materiais`}
                                        </span>
                                        {c.workload_hours && (
                                            <span className="flex items-center gap-1">
                                                <span className="material-symbols-outlined text-base">schedule</span>
                                                {c.workload_hours}h
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex justify-end gap-1 mt-auto pt-4">
                                        <Link href={route('platform.courses.edit', c.id)} className="p-2 rounded-lg text-[#507c94] hover:text-primary hover:bg-primary/10 transition-colors" title="Editar">
                                            <span className="material-symbols-outlined text-lg">edit</span>
                                        </Link>
                                        <IconButton icon="delete" title="Remover" tone="danger" onClick={() => setRemoving(c)} />
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
                title={`Remover o curso "${removing?.title ?? ''}"?`}
                description="Os módulos continuam na biblioteca; materiais avulsos do curso serão apagados."
                footer={
                    <>
                        <GhostButton onClick={() => setRemoving(null)}>Cancelar</GhostButton>
                        <DangerButton onClick={() => router.delete(route('platform.courses.destroy', removing.id), { onFinish: () => setRemoving(null) })}>
                            Remover curso
                        </DangerButton>
                    </>
                }
            />
        </PlatformLayout>
    );
}
