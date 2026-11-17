import MaterialList, { materialFromServer, materialsForSubmit } from '@/Components/Platform/MaterialList';
import { Card, Field, IconButton, inputClass, PageHeader, PrimaryAction, StatusBadge } from '@/Components/Platform/UI';
import PlatformLayout from '@/Layouts/PlatformLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useMemo, useRef, useState } from 'react';

const LEVELS = [
    { value: 'iniciante', label: 'Iniciante' },
    { value: 'intermediario', label: 'Intermediário' },
    { value: 'avancado', label: 'Avançado' },
];

const CATEGORIES = ['Tecnologia', 'Negócios', 'Design', 'Marketing', 'Finanças', 'Idiomas', 'Desenvolvimento Pessoal'];

// Remonta o formulário quando o servidor devolve nova versão do curso (após salvar).
export default function CourseFormPage({ course, availableModules }) {
    const version = course ? [course.id, course.updated_at, ...(course.materials ?? []).map((m) => m.id)].join(':') : 'new';
    return <CourseForm key={version} course={course} availableModules={availableModules} />;
}

function CourseForm({ course, availableModules }) {
    const isEdit = !!course;
    const coverInput = useRef(null);
    const [coverPreview, setCoverPreview] = useState(course?.cover_url ?? null);
    const [moduleSearch, setModuleSearch] = useState('');

    const { data, setData, post, transform, processing, errors, progress, isDirty } = useForm({
        title: course?.title ?? '',
        description: course?.description ?? '',
        category: course?.category ?? '',
        level: course?.level ?? 'iniciante',
        workload_hours: course?.workload_hours ?? '',
        status: course?.status ?? 'draft',
        structure: course?.structure ?? 'modular',
        cover: null,
        remove_cover: false,
        module_ids: (course?.modules ?? []).map((m) => m.id),
        materials: (course?.materials ?? []).map(materialFromServer),
    });

    const modulesById = useMemo(() => Object.fromEntries(availableModules.map((m) => [m.id, m])), [availableModules]);
    const selectedModules = data.module_ids.map((id) => modulesById[id]).filter(Boolean);
    const unselected = availableModules.filter(
        (m) => !data.module_ids.includes(m.id) && m.title.toLowerCase().includes(moduleSearch.trim().toLowerCase()),
    );

    const moveModule = (i, dir) => {
        const j = i + dir;
        if (j < 0 || j >= data.module_ids.length) return;
        const ids = [...data.module_ids];
        [ids[i], ids[j]] = [ids[j], ids[i]];
        setData('module_ids', ids);
    };

    const pickCover = (file) => {
        if (!file) return;
        setData((d) => ({ ...d, cover: file, remove_cover: false }));
        setCoverPreview(URL.createObjectURL(file));
    };

    const submit = (status) => (e) => {
        e?.preventDefault();
        transform((d) => ({
            ...d,
            status,
            ...(isEdit ? { _method: 'put' } : {}),
            module_ids: d.structure === 'modular' ? d.module_ids : [],
            materials: d.structure === 'free' ? materialsForSubmit(d.materials) : [],
        }));
        post(isEdit ? route('platform.courses.update', course.id) : route('platform.courses.store'), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    const estimatedMinutes =
        data.structure === 'free'
            ? data.materials.reduce((s, m) => s + (Number(m.duration_minutes) || 0), 0)
            : null;
    const errorCount = Object.keys(errors).length;

    return (
        <PlatformLayout>
            <Head title={isEdit ? `Editar curso: ${course.title}` : 'Novo curso'} />

            <form onSubmit={submit(data.status)} className="max-w-6xl mx-auto p-8 space-y-6 animate-in fade-in duration-700 pb-36">
                <PageHeader
                    breadcrumb={[{ label: 'Cursos', href: route('platform.courses.index') }, { label: isEdit ? 'Editar' : 'Novo curso' }]}
                    title={isEdit ? course.title : 'Cadastrar Novo Curso'}
                    subtitle="Defina as informações do curso e escolha como o conteúdo será organizado"
                    actions={isEdit && <StatusBadge status={course.status} />}
                />

                {errorCount > 0 && (
                    <div className="flex items-center gap-3 bg-error/5 border border-error/20 text-error rounded-2xl px-5 py-4 text-sm font-bold">
                        <span className="material-symbols-outlined">error</span>
                        Revise os campos destacados ({errorCount}).
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Informações básicas */}
                    <Card icon="info" title="Informações Básicas" className="col-span-12 lg:col-span-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Field label="Nome do Curso *" error={errors.title} className="md:col-span-2">
                                <input className={inputClass} value={data.title} onChange={(e) => setData('title', e.target.value)} placeholder="Ex.: Excel do Básico ao Avançado" required />
                            </Field>
                            <Field label="Categoria" error={errors.category}>
                                <input list="course-categories" className={inputClass} value={data.category} onChange={(e) => setData('category', e.target.value)} placeholder="Selecione ou digite" />
                                <datalist id="course-categories">
                                    {CATEGORIES.map((c) => <option key={c} value={c} />)}
                                </datalist>
                            </Field>
                            <Field label="Carga Horária (horas)" error={errors.workload_hours}>
                                <input type="number" min="1" className={inputClass} value={data.workload_hours} onChange={(e) => setData('workload_hours', e.target.value)} placeholder="Ex.: 40" />
                            </Field>
                            <Field label="Nível de Dificuldade" error={errors.level} className="md:col-span-2">
                                <div className="flex gap-4">
                                    {LEVELS.map((lvl) => (
                                        <label key={lvl.value} className="flex-1 relative cursor-pointer select-none">
                                            <input type="radio" name="level" value={lvl.value} checked={data.level === lvl.value} onChange={(e) => setData('level', e.target.value)} className="peer sr-only" />
                                            <div className="p-4 rounded-2xl bg-surface dark:bg-slate-950 border-2 border-transparent peer-checked:border-primary dark:peer-checked:border-[#00D1FF] peer-checked:bg-primary/5 transition-all text-center font-bold text-sm text-[#003346] dark:text-white">
                                                {lvl.label}
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </Field>
                        </div>
                    </Card>

                    {/* Capa e descrição */}
                    <Card icon="movie" iconTone="tertiary" title="Mídia e Capa" className="col-span-12 lg:col-span-4 flex flex-col">
                        <input ref={coverInput} type="file" accept="image/*" className="hidden" onChange={(e) => pickCover(e.target.files?.[0])} />
                        <button
                            type="button"
                            onClick={() => coverInput.current?.click()}
                            className="relative group w-full mb-2 border-2 border-dashed border-outline-variant/30 dark:border-slate-800 rounded-3xl h-44 flex flex-col items-center justify-center hover:bg-surface dark:hover:bg-slate-950 transition-all overflow-hidden"
                        >
                            {coverPreview ? (
                                <>
                                    <img src={coverPreview} alt="Capa do curso" className="absolute inset-0 w-full h-full object-cover" />
                                    <span className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white font-bold text-sm">
                                        Trocar capa
                                    </span>
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-4xl text-primary dark:text-[#00D1FF] mb-2">cloud_upload</span>
                                    <span className="text-sm font-bold text-primary dark:text-[#00D1FF]">Upload da Capa</span>
                                    <span className="text-[10px] text-[#507c94] dark:text-[#87b3cd] mt-1">PNG, JPG (Recomendado: 1200x630)</span>
                                </>
                            )}
                        </button>
                        {coverPreview && (
                            <button
                                type="button"
                                onClick={() => {
                                    setData((d) => ({ ...d, cover: null, remove_cover: true }));
                                    setCoverPreview(null);
                                }}
                                className="text-xs font-bold text-error hover:underline self-start mb-2"
                            >
                                Remover capa
                            </button>
                        )}
                        {errors.cover && <p className="text-xs text-error mb-2">{errors.cover}</p>}
                        <Field label="Descrição Curta" error={errors.description}>
                            <textarea rows="4" className={`${inputClass} resize-none`} value={data.description} onChange={(e) => setData('description', e.target.value)} placeholder="Escreva uma breve apresentação do curso..." />
                        </Field>
                    </Card>
                </div>

                {/* Estrutura */}
                <Card icon="account_tree" iconTone="secondary" title="Estrutura do curso" description="Escolha como o conteúdo será organizado">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            {
                                value: 'modular',
                                icon: 'view_module',
                                title: 'Compilado de módulos',
                                text: 'O curso é composto por módulos da biblioteca (conceito, exemplo, aplicação, erros comuns e exercícios).',
                            },
                            {
                                value: 'free',
                                icon: 'perm_media',
                                title: 'Curso livre',
                                text: 'Adicione vídeos, apostilas, links e arquivos diretamente, sem necessidade de módulos.',
                            },
                        ].map((opt) => (
                            <label key={opt.value} className="relative cursor-pointer select-none">
                                <input type="radio" name="structure" value={opt.value} checked={data.structure === opt.value} onChange={(e) => setData('structure', e.target.value)} className="peer sr-only" />
                                <div className="h-full p-5 rounded-2xl bg-surface dark:bg-slate-950 border-2 border-transparent peer-checked:border-primary dark:peer-checked:border-[#00D1FF] peer-checked:bg-primary/5 transition-all flex gap-4">
                                    <span className="w-11 h-11 shrink-0 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-primary dark:text-[#00D1FF]">{opt.icon}</span>
                                    </span>
                                    <span>
                                        <span className="block font-headline font-bold text-[#003346] dark:text-white">{opt.title}</span>
                                        <span className="block text-xs text-[#507c94] dark:text-[#87b3cd] mt-1">{opt.text}</span>
                                    </span>
                                </div>
                            </label>
                        ))}
                    </div>
                    {isEdit && course.structure !== data.structure && (
                        <p className="mt-4 text-xs font-bold text-amber-700 bg-amber-100 dark:bg-amber-950/50 rounded-xl px-4 py-3">
                            Ao salvar, o conteúdo da estrutura anterior será desvinculado deste curso.
                        </p>
                    )}
                </Card>

                {data.structure === 'modular' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        <Card
                            icon="format_list_numbered"
                            title="Módulos do curso"
                            description={`${selectedModules.length} módulo(s) na ordem em que o aluno irá cursar`}
                            className="col-span-12 lg:col-span-7"
                        >
                            {selectedModules.length === 0 ? (
                                <p className="text-sm text-[#507c94] dark:text-[#87b3cd] text-center py-10 bg-surface/50 dark:bg-slate-950/50 rounded-2xl">
                                    Adicione módulos da biblioteca ao lado.
                                </p>
                            ) : (
                                <ol className="space-y-2">
                                    {selectedModules.map((m, i) => (
                                        <li key={m.id} className="flex items-center gap-3 bg-surface/60 dark:bg-slate-950/60 rounded-2xl px-4 py-3">
                                            <span className="w-8 h-8 shrink-0 rounded-xl kinetic-gradient text-white flex items-center justify-center font-black text-sm">{i + 1}</span>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-sm text-[#003346] dark:text-white truncate">{m.title}</p>
                                                <p className="text-[11px] text-[#507c94] dark:text-[#87b3cd]">
                                                    {m.videos_count}/3 vídeos · {m.application_minutes} min aplicação · {m.exercises_count} exercícios · {m.support_materials_count} materiais
                                                </p>
                                            </div>
                                            {m.status === 'draft' && <StatusBadge status="draft" />}
                                            <IconButton icon="arrow_upward" title="Subir" onClick={() => moveModule(i, -1)} disabled={i === 0} />
                                            <IconButton icon="arrow_downward" title="Descer" onClick={() => moveModule(i, 1)} disabled={i === selectedModules.length - 1} />
                                            <IconButton icon="remove_circle" title="Retirar do curso" tone="danger" onClick={() => setData('module_ids', data.module_ids.filter((id) => id !== m.id))} />
                                        </li>
                                    ))}
                                </ol>
                            )}
                            {errors.module_ids && <p className="text-xs text-error mt-3">{errors.module_ids}</p>}
                        </Card>

                        <Card
                            icon="library_books"
                            iconTone="tertiary"
                            title="Biblioteca de módulos"
                            className="col-span-12 lg:col-span-5"
                            actions={
                                <Link href={route('platform.modules.create')} className="text-xs font-bold text-primary dark:text-[#00D1FF] hover:underline whitespace-nowrap">
                                    + Criar módulo
                                </Link>
                            }
                        >
                            <input value={moduleSearch} onChange={(e) => setModuleSearch(e.target.value)} className={`${inputClass} mb-3 py-2.5`} placeholder="Pesquisar módulos..." />
                            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                                {unselected.length === 0 ? (
                                    <p className="text-xs text-[#507c94] text-center py-6">
                                        {availableModules.length === 0 ? 'Nenhum módulo cadastrado ainda.' : 'Nenhum módulo disponível.'}
                                    </p>
                                ) : (
                                    unselected.map((m) => (
                                        <button
                                            key={m.id}
                                            type="button"
                                            onClick={() => setData('module_ids', [...data.module_ids, m.id])}
                                            className="w-full flex items-center gap-3 text-left bg-surface/60 dark:bg-slate-950/60 hover:bg-primary/5 rounded-2xl px-4 py-3 transition group"
                                        >
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-sm text-[#003346] dark:text-white truncate">{m.title}</p>
                                                <p className="text-[11px] text-[#507c94]">
                                                    {m.videos_count}/3 vídeos · {m.exercises_count} exercícios
                                                    {m.status === 'draft' ? ' · rascunho' : ''}
                                                </p>
                                            </div>
                                            <span className="material-symbols-outlined text-primary dark:text-[#00D1FF] opacity-60 group-hover:opacity-100">add_circle</span>
                                        </button>
                                    ))
                                )}
                            </div>
                        </Card>
                    </div>
                ) : (
                    <Card
                        icon="perm_media"
                        title="Conteúdo do curso"
                        description={`${data.materials.length} item(ns)${estimatedMinutes ? ` · ${estimatedMinutes} min de vídeo` : ''}`}
                    >
                        <MaterialList
                            items={data.materials}
                            onChange={(materials) => setData('materials', materials)}
                            errors={errors}
                            prefix="materials"
                            emptyText="Adicione vídeos, apostilas, links ou arquivos para compor o curso."
                        />
                        {errors.materials && <p className="text-xs text-error mt-3">{errors.materials}</p>}
                    </Card>
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
                                <Link href={route('platform.courses.index')} className="text-sm font-bold text-[#507c94] hover:text-primary">
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
                            {course?.status === 'published' ? 'Salvar e manter publicado' : 'Publicar curso'}
                        </PrimaryAction>
                    </div>
                </div>
            </form>
        </PlatformLayout>
    );
}
