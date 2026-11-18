import { newKey } from '@/Components/Platform/ExerciseBuilder';
import { FileDrop, IconButton, inputClass, Segmented } from '@/Components/Platform/UI';
import { useMemo, useState } from 'react';

/* Lista dinâmica de vídeos do módulo. Cada vídeo recebe uma categoria
 * (Conceito, Exemplo, Erros comuns… ou uma nova) antes de ser enviado. */

const CATEGORY_ICONS = {
    conceito: 'lightbulb',
    exemplo: 'play_lesson',
    'erros comuns': 'report',
    aplicação: 'construction',
    revisão: 'replay',
    'estudo de caso': 'cases',
    'dica rápida': 'bolt',
};

export const iconForCategory = (c) => CATEGORY_ICONS[(c ?? '').trim().toLowerCase()] ?? 'smart_display';

export function blankVideo() {
    return { _key: newKey(), id: null, category: '', source: 'upload', url: '', title: '', duration_minutes: '', file: null, _existing: null };
}

export function videoFromServer(m) {
    return {
        _key: newKey(),
        id: m.id,
        category: m.category ?? '',
        source: m.file_path ? 'upload' : 'url',
        url: m.url ?? '',
        title: m.title && m.title !== m.category ? m.title : '',
        duration_minutes: m.duration_minutes ?? '',
        file: null,
        _existing: m.file_path ? { name: m.file_name, size: m.file_size, url: m.file_url } : null,
    };
}

export function videosForSubmit(list) {
    return list.map(({ _key, _existing, ...v }) => ({ ...v, file: v.source === 'upload' ? v.file : null }));
}

const sameText = (a, b) => (a ?? '').trim().toLowerCase() === (b ?? '').trim().toLowerCase();

export default function VideoList({ videos, onChange, errors, suggestions = [] }) {
    // Categorias digitadas neste formulário passam a ser sugeridas para os outros vídeos.
    const categoriesFor = (index) => {
        const all = [...suggestions];
        videos.forEach((v, i) => {
            if (i !== index && v.category.trim() && !all.some((c) => sameText(c, v.category))) all.push(v.category.trim());
        });
        return all;
    };

    const summary = useMemo(() => {
        const map = new Map();
        videos.forEach((v) => {
            const c = v.category.trim();
            if (!c) return;
            const key = c.toLowerCase();
            const cur = map.get(key) ?? { label: c, count: 0 };
            map.set(key, { ...cur, count: cur.count + 1 });
        });
        return [...map.values()];
    }, [videos]);

    const update = (i, patch) => onChange(videos.map((v, idx) => (idx === i ? { ...v, ...patch } : v)));
    const move = (i, dir) => {
        const j = i + dir;
        if (j < 0 || j >= videos.length) return;
        const copy = [...videos];
        [copy[i], copy[j]] = [copy[j], copy[i]];
        onChange(copy);
    };

    return (
        <div className="space-y-4">
            {summary.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {summary.map((s) => (
                        <span key={s.label} className="inline-flex items-center gap-1.5 bg-primary/10 text-primary dark:text-[#00D1FF] px-3 py-1 rounded-full text-[11px] font-bold">
                            <span className="material-symbols-outlined text-sm">{iconForCategory(s.label)}</span>
                            {s.label} · {s.count}
                        </span>
                    ))}
                </div>
            )}

            {videos.length === 0 && (
                <p className="text-sm text-[#507c94] dark:text-[#87b3cd] text-center py-8 bg-surface/50 dark:bg-slate-950/50 rounded-2xl">
                    Nenhum vídeo ainda. Adicione um vídeo e escolha a categoria dele (conceito, exemplo, erros comuns...).
                </p>
            )}

            {videos.map((v, i) => (
                <VideoItem
                    key={v._key}
                    index={i}
                    video={v}
                    total={videos.length}
                    categories={categoriesFor(i)}
                    errors={errors}
                    onChange={(patch) => update(i, patch)}
                    onMove={(dir) => move(i, dir)}
                    onRemove={() => onChange(videos.filter((_, idx) => idx !== i))}
                />
            ))}

            {errors.videos && <p className="text-xs text-error">{errors.videos}</p>}

            <button
                type="button"
                onClick={() => onChange([...videos, blankVideo()])}
                className="w-full flex items-center justify-center gap-2 px-4 py-4 rounded-2xl border-2 border-dashed border-outline-variant/30 dark:border-slate-700 text-sm font-bold text-primary dark:text-[#00D1FF] hover:bg-primary/5 hover:border-primary/40 transition-all"
            >
                <span className="material-symbols-outlined">video_call</span>
                Adicionar vídeo
            </button>
        </div>
    );
}

function VideoItem({ index, video, total, categories, errors, onChange, onMove, onRemove }) {
    const isKnown = categories.some((c) => sameText(c, video.category));
    const [customOpen, setCustomOpen] = useState(!!video.category && !isKnown);
    const hasCategory = !!video.category.trim();
    const err = (f) => errors[`videos.${index}.${f}`];
    const fileError = err('file') || err('url') || err('source');

    return (
        <div
            className={`rounded-2xl border p-5 ${
                fileError || err('category') ? 'border-error/40 bg-error/5' : 'border-outline-variant/20 dark:border-slate-800 bg-surface/50 dark:bg-slate-950/50'
            }`}
        >
            <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 shrink-0 rounded-xl kinetic-gradient text-white flex items-center justify-center font-black text-sm">{index + 1}</span>
                <div className="flex-1 min-w-0">
                    <p className="font-headline font-bold text-[#003346] dark:text-white flex items-center gap-2 truncate">
                        <span className="material-symbols-outlined text-lg text-primary dark:text-[#00D1FF]">{iconForCategory(video.category)}</span>
                        {hasCategory ? `Vídeo · ${video.category}` : 'Novo vídeo'}
                    </p>
                </div>
                <IconButton icon="arrow_upward" title="Subir" onClick={() => onMove(-1)} disabled={index === 0} />
                <IconButton icon="arrow_downward" title="Descer" onClick={() => onMove(1)} disabled={index === total - 1} />
                <IconButton icon="delete" title="Remover vídeo" tone="danger" onClick={onRemove} />
            </div>

            {/* 1. Categoria */}
            <div className="space-y-2">
                <label className="block text-xs font-bold text-[#507c94] dark:text-[#87b3cd] uppercase tracking-wide">Categoria *</label>
                <div className="flex flex-wrap gap-2">
                    {categories.map((c) => {
                        const active = !customOpen && sameText(c, video.category);
                        return (
                            <button
                                key={c}
                                type="button"
                                onClick={() => {
                                    setCustomOpen(false);
                                    onChange({ category: c });
                                }}
                                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border-2 transition-all ${
                                    active
                                        ? 'border-primary dark:border-[#00D1FF] bg-primary/5 text-primary dark:text-[#00D1FF]'
                                        : 'border-transparent bg-white dark:bg-slate-900 text-[#003346] dark:text-white hover:text-primary'
                                }`}
                            >
                                <span className="material-symbols-outlined text-sm">{iconForCategory(c)}</span>
                                {c}
                            </button>
                        );
                    })}
                    <button
                        type="button"
                        onClick={() => {
                            setCustomOpen(true);
                            if (isKnown) onChange({ category: '' });
                        }}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border-2 border-dashed transition-all ${
                            customOpen ? 'border-primary text-primary bg-primary/5' : 'border-outline-variant/40 text-[#507c94] hover:text-primary'
                        }`}
                    >
                        <span className="material-symbols-outlined text-sm">add</span>
                        Nova categoria
                    </button>
                </div>
                {customOpen && (
                    <input
                        autoFocus
                        value={video.category}
                        onChange={(e) => onChange({ category: e.target.value })}
                        maxLength={60}
                        className={`${inputClass} bg-white dark:bg-slate-900 py-2.5 max-w-sm`}
                        placeholder="Ex.: Bastidores, Entrevista, Desafio..."
                    />
                )}
                {err('category') && <p className="text-xs text-error">{err('category')}</p>}
            </div>

            {/* 2. Envio — liberado após escolher a categoria */}
            {hasCategory ? (
                <div className="mt-4 space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                        <Segmented
                            value={video.source}
                            onChange={(source) => onChange({ source })}
                            options={[
                                { value: 'upload', label: 'Upload', icon: 'upload' },
                                { value: 'url', label: 'Link (YouTube/Vimeo)', icon: 'link' },
                            ]}
                        />
                        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 rounded-xl px-3 py-1.5">
                            <span className="material-symbols-outlined text-sm text-[#507c94]">timer</span>
                            <input
                                type="number"
                                min="1"
                                value={video.duration_minutes}
                                onChange={(e) => onChange({ duration_minutes: e.target.value })}
                                className="w-14 bg-transparent border-none p-0 text-xs font-bold text-[#003346] dark:text-white focus:ring-0"
                                placeholder="min"
                            />
                            <span className="text-[10px] font-bold text-[#507c94]">min</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                        <div className="md:col-span-8">
                            {video.source === 'url' ? (
                                <input
                                    type="url"
                                    value={video.url}
                                    onChange={(e) => onChange({ url: e.target.value })}
                                    className={`${inputClass} bg-white dark:bg-slate-900`}
                                    placeholder="https://youtube.com/... ou https://vimeo.com/..."
                                />
                            ) : (
                                <FileDrop
                                    compact
                                    accept="video/*"
                                    file={video.file}
                                    existing={video._existing}
                                    onChange={(file) => onChange({ file })}
                                    label={`Enviar vídeo de ${video.category}`}
                                    hint="MP4, WEBM ou MOV"
                                    icon="video_call"
                                />
                            )}
                        </div>
                        <input
                            value={video.title}
                            onChange={(e) => onChange({ title: e.target.value })}
                            className={`${inputClass} bg-white dark:bg-slate-900 md:col-span-4`}
                            placeholder={`Título (padrão: ${video.category})`}
                        />
                    </div>
                    {fileError && <p className="text-xs text-error">{fileError}</p>}
                </div>
            ) : (
                <p className="mt-4 text-xs font-bold text-[#507c94] dark:text-[#87b3cd] flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">info</span>
                    Escolha a categoria para enviar o vídeo.
                </p>
            )}
        </div>
    );
}
