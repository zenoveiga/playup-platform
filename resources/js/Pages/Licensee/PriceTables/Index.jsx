import { DangerButton, DialogShell, EmptyState, GhostButton, IconButton, PageHeader, PrimaryAction } from '@/Components/Platform/UI';
import { useLicensee } from '@/lib/licensee';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function PriceTablesIndex({ tables, publishedCourses }) {
    const { Layout, r } = useLicensee();
    const [removing, setRemoving] = useState(null);

    return (
        <Layout>
            <Head title="Tabelas de Preços" />

            <div className="max-w-6xl mx-auto p-8 space-y-8 animate-in fade-in duration-700">
                <PageHeader
                    title="Tabelas de Preços"
                    subtitle="Defina seus próprios valores para os cursos. A tabela padrão vale fora das campanhas."
                    actions={
                        <PrimaryAction as="link" href={r('price-tables.create')} icon="add">
                            Nova tabela
                        </PrimaryAction>
                    }
                />

                {tables.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-outline-variant/10 dark:border-slate-800">
                        <EmptyState
                            icon="sell"
                            title="Você ainda não tem tabelas de preços"
                            description="Enquanto isso, valem os valores sugeridos pela PlayUp. Crie sua tabela partindo deles."
                            action={<PrimaryAction as="link" href={r('price-tables.create')} icon="add">Criar minha tabela</PrimaryAction>}
                        />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {tables.map((t) => (
                            <div key={t.id} className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-outline-variant/10 dark:border-slate-800 flex flex-col">
                                <div className="flex items-start justify-between gap-3 mb-3">
                                    <div className="w-11 h-11 rounded-2xl bg-primary-container/20 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-primary dark:text-[#00D1FF]">sell</span>
                                    </div>
                                    {t.is_default && (
                                        <span className="bg-[#cdffd4] text-[#006a35] text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full">Padrão</span>
                                    )}
                                </div>
                                <Link href={r('price-tables.edit', t.id)} className="font-headline font-bold text-lg text-[#003346] dark:text-white hover:text-primary">
                                    {t.name}
                                </Link>
                                {t.description && <p className="text-sm text-[#507c94] dark:text-[#87b3cd] mt-1 line-clamp-2">{t.description}</p>}
                                <div className="flex flex-wrap gap-4 mt-4 text-xs font-bold text-[#507c94] dark:text-[#87b3cd]">
                                    <span className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-base">payments</span>
                                        {t.max_installments > 1 ? `Até ${t.max_installments}x` : 'À vista'}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-base">auto_stories</span>
                                        {t.items_count}/{publishedCourses} cursos
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-base">campaign</span>
                                        {t.campaigns_count} campanha(s)
                                    </span>
                                </div>
                                <div className="flex justify-end gap-1 mt-auto pt-4">
                                    <Link href={r('price-tables.edit', t.id)} className="p-2 rounded-lg text-[#507c94] hover:text-primary hover:bg-primary/10 transition-colors" title="Editar">
                                        <span className="material-symbols-outlined text-lg">edit</span>
                                    </Link>
                                    <IconButton icon="delete" title="Remover" tone="danger" onClick={() => setRemoving(t)} />
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
                title={`Remover a tabela "${removing?.name ?? ''}"?`}
                description={
                    removing?.campaigns_count
                        ? `Ela será retirada de ${removing.campaigns_count} campanha(s).`
                        : removing?.is_default
                          ? 'Sem tabela padrão, os cursos voltam a usar os valores sugeridos.'
                          : 'Os valores desta tabela serão apagados.'
                }
                footer={
                    <>
                        <GhostButton onClick={() => setRemoving(null)}>Cancelar</GhostButton>
                        <DangerButton onClick={() => router.delete(r('price-tables.destroy', removing.id), { onFinish: () => setRemoving(null) })}>
                            Remover tabela
                        </DangerButton>
                    </>
                }
            />
        </Layout>
    );
}
