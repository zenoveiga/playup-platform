import ExerciseBuilder, { exerciseFromServer, exercisesForSubmit } from '@/Components/Platform/ExerciseBuilder';
import MaterialList, { materialFromServer, materialsForSubmit } from '@/Components/Platform/MaterialList';
import { Card, Field, FileDrop, inputClass, PageHeader, PrimaryAction, Segmented, StatusBadge } from '@/Components/Platform/UI';
import PlatformLayout from '@/Layouts/PlatformLayout';
import { Head, Link, useForm } from '@inertiajs/react';

const VIDEO_SLOTS = [
    { slot: 'concept', step: 1, label: 'Vídeo conceito', hint: 'Apresenta o conceito central do módulo', suggested: 6, icon: 'lightbulb' },
    { slot: 'example', step: 2, label: 'Vídeo exemplo', hint: 'Demonstra o conceito aplicado em um caso real', suggested: null, icon: 'play_lesson' },
    { slot: 'common_errors', step: 4, label: 'Vídeo de erros comuns', hint: 'Mostra os erros mais frequentes e como evitá-los', suggested: null, icon: 'report' },
];

function videoFromServer(module, slot, suggested) {
    const m = module?.materials?.find((x) => x.slot === slot);
    if (!m) return { id: null, source: 'upload', url: '', title: '', duration_minutes: suggested ?? '', file: null, _existing: null };
    return {
        id: m.id,
        source: m.file_path ? 'upload' : 'url',
        url: m.url ?? '',
        title: m.title ?? '',
        duration_minutes: m.duration_minutes ?? '',
        file: null,
        _existing: m.file_path ? { name: m.file_name, size: m.file_size, url: m.file_url } : null,
    };
}

// Remonta o formulário sempre que o servidor devolve uma nova versão do módulo
// (ex.: após salvar), para que IDs de materiais recém-criados sejam usados no próximo envio.
export default function ModuleFormPage({ module }) {
    const version = module
        ? [module.id, module.updated_at, ...(module.materials ?? []).map((m) => m.id), ...(module.exercises ?? []).map((e) => e.id)].join(':')
        : 'new';
    return <ModuleForm key={version} module={module} />;
}

function ModuleForm({ module }) {
    const isEdit = !!module;

    const { data, setData, post, transform, processing, errors, progress, isDirty } = useForm({
        title: module?.title ?? '',
        description: module?.description ?? '',
        objectives: module?.objectives ?? '',
        application_minutes: module?.application_minutes ?? 10,
        application_instructions: module?.application_instructions ?? '',
        status: module?.status ?? 'draft',
        videos: Object.fromEntries(VIDEO_SLOTS.map((v) => [v.slot, videoFromServer(module, v.slot, v.suggested)])),
        support: (module?.materials ?? []).filter((m) => m.slot === 'support').map(materialFromServer),
        exercises: (module?.exercises ?? []).map(exerciseFromServer),
    });

    const setVideo = (slot, patch) => setData('videos', { ...data.videos, [slot]: { ...data.videos[slot], ...patch } });

    const submit = (status) => (e) => {
        e?.preventDefault();
        transform((d) => ({
            ...d,
            status,
            ...(isEdit ? { _method: 'put' } : {}),
            videos: Object.fromEntries(
                Object.entries(d.videos).map(([slot, { _existing, ...v }]) => [slot, { ...v, file: v.source === 'upload' ? v.file : null }]),
            ),
            support: materialsForSubmit(d.support),
            exercises: exercisesForSubmit(d.exercises),
        }));
        post(isEdit ? route('platform.modules.update', module.id) : route('platform.modules.store'), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    const videoReady = (v) => (v.source === 'url' ? !!v.url : !!(v.file || v._existing));
    const readyCount = VIDEO_SLOTS.filter((v) => videoReady(data.videos[v.slot])).length;
    const totalMinutes =
        VIDEO_SLOTS.reduce((s, v) => s + (Number(data.videos[v.slot].duration_minutes) || 0), 0) + (Number(data.application_minutes) || 0);

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
                    subtitle="Conceito → Exemplo → Aplicação → Erros comuns, com materiais de apoio e exercícios"
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

                {/* Trilha do módulo */}
                <Card
                    icon="route"
                    title="Estrutura do módulo"
                    description={`${readyCount}/3 vídeos configurados · duração estimada de ${totalMinutes} min`}
                >
                    <div className="space-y-4">
                        {VIDEO_SLOTS.slice(0, 2).map((v) => (
                            <VideoSlot key={v.slot} config={v} value={data.videos[v.slot]} onChange={(patch) => setVideo(v.slot, patch)} errors={errors} />
                        ))}

                        {/* Aplicação */}
                        <div className="rounded-2xl border border-tertiary/20 bg-tertiary-container/10 p-5">
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                <span className="w-8 h-8 rounded-xl bg-tertiary text-white flex items-center justify-center font-black text-sm">3</span>
                                <div className="flex-1">
                                    <p className="font-headline font-bold text-[#003346] dark:text-white">Aplicação</p>
                                    <p className="text-xs text-[#507c94] dark:text-[#87b3cd]">Atividade prática guiada para o aluno aplicar o conceito</p>
                                </div>
                                <div className="flex items-center gap-2 bg-white dark:bg-slate-900 rounded-xl px-3 py-2">
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
                            </div>
                            <Field error={errors.application_minutes || errors.application_instructions}>
                                <textarea
                                    rows="4"
                                    value={data.application_instructions}
                                    onChange={(e) => setData('application_instructions', e.target.value)}
                                    className={`${inputClass} bg-white dark:bg-slate-900 resize-y`}
                                    placeholder="Descreva o passo a passo da atividade prática (aprox. 10 minutos)..."
                                />
                            </Field>
                        </div>

                        <VideoSlot config={VIDEO_SLOTS[2]} value={data.videos.common_errors} onChange={(patch) => setVideo('common_errors', patch)} errors={errors} />
                    </div>
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
                <Card icon="quiz" iconTone="tertiary" title="Exercícios" description="Monte a lista de exercícios do módulo">
                    <ExerciseBuilder exercises={data.exercises} onChange={(exercises) => setData('exercises', exercises)} errors={errors} />
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
                            {progress ? (
                                <div className="max-w-sm">
                                    <p className="text-xs font-bold text-[#507c94] mb-1">Enviando arquivos... {progress.percentage}%</p>
                                    <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                                        <div className="h-full kinetic-gradient transition-all" style={{ width: `${progress.percentage}%` }} />
                                    </div>
                                </div>
                            ) : (
                                <Link href={route('platform.modules.index')} className="text-sm font-bold text-[#507c94] hover:text-primary">
                                    {isDirty ? 'Descartar alterações' : 'Voltar'}
                                </Link>
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={submit('draft')}
                            disabled={processing}
                            className="px-6 py-3.5 rounded-xl font-bold text-primary dark:text-[#00D1FF] bg-surface-container-high dark:bg-slate-800 hover:bg-primary hover:text-white transition-all disabled:opacity-50"
                        >
                            Salvar rascunho
                        </button>
                        <PrimaryAction type="button" icon="publish" onClick={submit('published')} disabled={processing}>
                            {module?.status === 'published' ? 'Salvar e manter publicado' : 'Publicar módulo'}
                        </PrimaryAction>
                    </div>
                </div>
            </form>
        </PlatformLayout>
    );
}

function VideoSlot({ config, value, onChange, errors }) {
    const prefix = `videos.${config.slot}`;
    const slotError = errors[prefix] || errors[`${prefix}.file`] || errors[`${prefix}.url`] || errors[`${prefix}.source`];

    return (
        <div className={`rounded-2xl border p-5 ${slotError ? 'border-error/40 bg-error/5' : 'border-outline-variant/20 dark:border-slate-800 bg-surface/50 dark:bg-slate-950/50'}`}>
            <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-xl kinetic-gradient text-white flex items-center justify-center font-black text-sm">{config.step}</span>
                <div className="flex-1 min-w-[200px]">
                    <p className="font-headline font-bold text-[#003346] dark:text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg text-primary dark:text-[#00D1FF]">{config.icon}</span>
                        {config.label}
                        {config.suggested && <span className="text-[10px] font-black uppercase tracking-wider text-[#507c94] bg-white dark:bg-slate-900 px-2 py-0.5 rounded-full">~{config.suggested} min</span>}
                    </p>
                    <p className="text-xs text-[#507c94] dark:text-[#87b3cd]">{config.hint}</p>
                </div>
                <Segmented
                    value={value.source}
                    onChange={(source) => onChange({ source })}
                    options={[
                        { value: 'upload', label: 'Upload', icon: 'upload' },
                        { value: 'url', label: 'Link', icon: 'link' },
                    ]}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                <div className="md:col-span-8">
                    {value.source === 'url' ? (
                        <input
                            type="url"
                            value={value.url}
                            onChange={(e) => onChange({ url: e.target.value })}
                            className={`${inputClass} bg-white dark:bg-slate-900`}
                            placeholder="https://youtube.com/... ou https://vimeo.com/..."
                        />
                    ) : (
                        <FileDrop
                            compact
                            accept="video/*"
                            file={value.file}
                            existing={value._existing}
                            onChange={(file) => onChange({ file })}
                            label="Enviar vídeo"
                            hint="MP4, WEBM ou MOV"
                            icon="video_call"
                        />
                    )}
                </div>
                <div className="md:col-span-4 grid grid-cols-3 gap-3">
                    <input
                        value={value.title}
                        onChange={(e) => onChange({ title: e.target.value })}
                        className={`${inputClass} bg-white dark:bg-slate-900 col-span-2`}
                        placeholder="Título (opcional)"
                    />
                    <div className="flex items-center gap-1 bg-white dark:bg-slate-900 rounded-xl px-3">
                        <input
                            type="number"
                            min="1"
                            value={value.duration_minutes}
                            onChange={(e) => onChange({ duration_minutes: e.target.value })}
                            className="w-full bg-transparent border-none p-0 text-sm font-bold text-[#003346] dark:text-white focus:ring-0"
                            placeholder="min"
                        />
                        <span className="text-[10px] font-bold text-[#507c94]">min</span>
                    </div>
                </div>
            </div>
            {slotError && <p className="text-xs text-error mt-2">{slotError}</p>}
        </div>
    );
}
