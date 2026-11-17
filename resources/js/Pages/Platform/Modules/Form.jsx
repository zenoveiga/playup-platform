import ExerciseBuilder, { setFromServer, setsForSubmit } from '@/Components/Platform/ExerciseBuilder';
import MaterialList, { materialFromServer, materialsForSubmit } from '@/Components/Platform/MaterialList';
import { Card, Field, inputClass, PageHeader, PrimaryAction, StatusBadge } from '@/Components/Platform/UI';
import VideoList, { videoFromServer, videosForSubmit } from '@/Components/Platform/VideoList';
import PlatformLayout from '@/Layouts/PlatformLayout';
import { uploadKindFor, useDirectUploads, withUploadKey } from '@/lib/directUpload';
import { Head, Link, useForm } from '@inertiajs/react';

// Remonta o formulário sempre que o servidor devolve uma nova versão do módulo
// (ex.: após salvar), para que IDs de materiais recém-criados sejam usados no próximo envio.
export default function ModuleFormPage({ module, videoCategories }) {
    const version = module
        ? [module.id, module.updated_at, ...(module.materials ?? []).map((m) => m.id), ...(module.exercise_sets ?? []).flatMap((s) => [s.id, ...(s.questions ?? []).map((q) => q.id)])].join(':')
        : 'new';
    return <ModuleForm key={version} module={module} videoCategories={videoCategories} />;
}

function ModuleForm({ module, videoCategories }) {
    const isEdit = !!module;

    const { data, setData, post, transform, processing, errors, progress, isDirty } = useForm({
        title: module?.title ?? '',
        description: module?.description ?? '',
        objectives: module?.objectives ?? '',
        application_minutes: module?.application_minutes ?? 10,
        application_instructions: module?.application_instructions ?? '',
        status: module?.status ?? 'draft',
        videos: (module?.materials ?? []).filter((m) => m.slot === 'video').map(videoFromServer),
        support: (module?.materials ?? []).filter((m) => m.slot === 'support').map(materialFromServer),
        exercise_sets: (module?.exercise_sets ?? []).map(setFromServer),
    });

    const { run: uploadFiles, uploading, uploadError } = useDirectUploads();

    const submit = (status) => async (e) => {
        e?.preventDefault();

        // Vídeos e arquivos vão direto para o bucket; o formulário leva só as chaves.
        const jobs = [
            ...data.videos.filter((v) => v.source === 'upload' && v.file).map((v) => ({ id: v._key, file: v.file, kind: 'video' })),
            ...data.support
                .filter((m) => m.type !== 'link' && m.source !== 'url' && m.file)
                .map((m) => ({ id: m._key, file: m.file, kind: uploadKindFor(m.type) })),
        ];
        let keys;
        try {
            keys = await uploadFiles(jobs);
        } catch {
            return;
        }

        transform((d) => ({
            ...d,
            status,
            ...(isEdit ? { _method: 'put' } : {}),
            videos: videosForSubmit(d.videos.map(withUploadKey(keys))),
            support: materialsForSubmit(d.support.map(withUploadKey(keys))),
            exercise_sets: setsForSubmit(d.exercise_sets),
        }));
        post(isEdit ? route('platform.modules.update', module.id) : route('platform.modules.store'), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    const videoMinutes = data.videos.reduce((s, v) => s + (Number(v.duration_minutes) || 0), 0);
    const totalMinutes = videoMinutes + (Number(data.application_minutes) || 0);

    const errorCount = Object.keys(errors).length;

    return (
        <PlatformLayout>
            <Head title={isEdit ? `Editar módulo: ${module.title}` : 'Novo módulo'} />

            <form onSubmit={submit(data.status)} className="max-w-6xl mx-auto p-8 space-y-6 animate-in fade-in duration-700 pb-36">
                <PageHeader
                    breadcrumb={[
                        { label: 'Módulos', href: route('platform.modules.index') },
                        { label: isEdit ? 'Editar' : 'Novo módulo' },
                    ]}
                    title={isEdit ? module.title : 'Novo Módulo'}
                    subtitle="Vídeos categorizados, aplicação prática, materiais de apoio e exercícios"
                    actions={isEdit && <StatusBadge status={module.status} />}
                />

                {errorCount > 0 && (
                    <div className="flex items-center gap-3 bg-error/5 border border-error/20 text-error rounded-2xl px-5 py-4 text-sm font-bold">
                        <span className="material-symbols-outlined">error</span>
                        Revise os campos destacados ({errorCount}).
                    </div>
                )}

                {/* Informações */}
                <Card icon="info" title="Informações do módulo">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Field label="Título do módulo *" error={errors.title} className="md:col-span-2">
                            <input className={inputClass} value={data.title} onChange={(e) => setData('title', e.target.value)} placeholder="Ex.: Funções condicionais no Excel" required />
                        </Field>
                        <Field label="Descrição" error={errors.description}>
                            <textarea rows="3" className={`${inputClass} resize-none`} value={data.description} onChange={(e) => setData('description', e.target.value)} />
                        </Field>
                        <Field label="Objetivos de aprendizagem" error={errors.objectives}>
                            <textarea rows="3" className={`${inputClass} resize-none`} value={data.objectives} onChange={(e) => setData('objectives', e.target.value)} placeholder="Ao final, o aluno será capaz de..." />
                        </Field>
                    </div>
                </Card>

                {/* Vídeos */}
                <Card
                    icon="smart_display"
                    title="Vídeos do módulo"
                    description={`${data.videos.length} vídeo(s) · ${videoMinutes} min de vídeo · duração estimada do módulo: ${totalMinutes} min`}
                >
                    <VideoList videos={data.videos} onChange={(videos) => setData('videos', videos)} errors={errors} suggestions={videoCategories} />
                </Card>

                <Card
                    icon="construction"
                    iconTone="tertiary"
                    title="Aplicação"
                    description="Atividade prática guiada para o aluno aplicar o conteúdo"
                    actions={
                        <div className="flex items-center gap-2 bg-surface dark:bg-slate-950 rounded-xl px-3 py-2">
                            <span className="material-symbols-outlined text-base text-tertiary">timer</span>
                            <input
                                type="number"
                                min="1"
                                value={data.application_minutes}
                                onChange={(e) => setData('application_minutes', e.target.value)}
                                className="w-14 bg-transparent border-none p-0 text-sm font-bold text-[#003346] dark:text-white focus:ring-0"
                            />
                            <span className="text-xs font-bold text-[#507c94]">min</span>
                        </div>
                    }
                >
                    <Field error={errors.application_minutes || errors.application_instructions}>
                        <textarea
                            rows="4"
                            value={data.application_instructions}
                            onChange={(e) => setData('application_instructions', e.target.value)}
                            className={`${inputClass} resize-y`}
                            placeholder="Descreva o passo a passo da atividade prática (aprox. 10 minutos)..."
                        />
                    </Field>
                </Card>

                {/* Materiais de apoio */}
                <Card icon="folder_open" iconTone="secondary" title="Materiais de apoio" description="Apostilas, planilhas, slides, links e outros arquivos auxiliares">
                    <MaterialList
                        items={data.support}
                        onChange={(support) => setData('support', support)}
                        errors={errors}
                        prefix="support"
                        allowedTypes={['document', 'file', 'link', 'video']}
                        emptyText="Nenhum material de apoio adicionado."
                    />
                </Card>

                {/* Exercícios */}
                <Card icon="quiz" iconTone="tertiary" title="Exercícios" description="Crie um ou mais exercícios com título, cada um com suas questões">
                    <ExerciseBuilder sets={data.exercise_sets} onChange={(sets) => setData('exercise_sets', sets)} errors={errors} />
                </Card>

                {isEdit && module.courses?.length > 0 && (
                    <p className="text-xs font-bold text-[#507c94] dark:text-[#87b3cd]">
                        Este módulo faz parte de: {module.courses.map((c) => c.title).join(', ')}
                    </p>
                )}

                {/* Barra de ações fixa */}
                <div className="fixed bottom-0 left-72 right-0 z-30 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-t border-outline-variant/10 dark:border-slate-800 px-8 py-4">
                    <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
                        <div className="flex-1">
                            {uploading || progress ? (
                                <div className="max-w-sm">
                                    <p className="text-xs font-bold text-[#507c94] mb-1 truncate">
                                        {uploading
                                            ? `Enviando ${uploading.current}/${uploading.total}: ${uploading.name} — ${uploading.percentage}%`
                                            : `Salvando... ${progress.percentage}%`}
                                    </p>
                                    <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                                        <div className="h-full kinetic-gradient transition-all" style={{ width: `${(uploading ?? progress).percentage}%` }} />
                                    </div>
                                </div>
                            ) : uploadError ? (
                                <p className="text-xs font-bold text-error flex items-center gap-2 max-w-md">
                                    <span className="material-symbols-outlined text-base">error</span>
                                    {uploadError}
                                </p>
                            ) : (
                                <Link href={route('platform.modules.index')} className="text-sm font-bold text-[#507c94] hover:text-primary">
                                    {isDirty ? 'Descartar alterações' : 'Voltar'}
                                </Link>
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={submit('draft')}
                            disabled={processing || !!uploading}
                            className="px-6 py-3.5 rounded-xl font-bold text-primary dark:text-[#00D1FF] bg-surface-container-high dark:bg-slate-800 hover:bg-primary hover:text-white transition-all disabled:opacity-50"
                        >
                            Salvar rascunho
                        </button>
                        <PrimaryAction type="button" icon="publish" onClick={submit('published')} disabled={processing || !!uploading}>
                            {module?.status === 'published' ? 'Salvar e manter publicado' : 'Publicar módulo'}
                        </PrimaryAction>
                    </div>
                </div>
            </form>
        </PlatformLayout>
    );
}
