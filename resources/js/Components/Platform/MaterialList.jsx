import { newKey } from '@/Components/Platform/ExerciseBuilder';
import { FileDrop, IconButton, inputClass, Segmented } from '@/Components/Platform/UI';

/* Lista dinâmica de materiais: vídeos, apostilas/documentos, links e arquivos diversos.
 * Usada nos materiais de apoio do módulo e no curso livre (sem módulos). */

export const MATERIAL_TYPES = {
    video: { label: 'Vídeo', icon: 'smart_display', accept: 'video/*' },
    document: { label: 'Apostila / Documento', icon: 'menu_book', accept: '.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.odt,.txt' },
    link: { label: 'Link externo', icon: 'link' },
    file: { label: 'Arquivo', icon: 'attach_file', accept: undefined },
};

export function blankMaterial(type) {
    return { _key: newKey(), id: null, type, title: '', description: '', source: type === 'link' ? 'url' : 'upload', url: '', file: null, duration_minutes: '', _existing: null };
}

export function materialFromServer(m) {
    return {
        _key: newKey(),
        id: m.id,
        type: m.type,
        title: m.title ?? '',
        description: m.description ?? '',
        source: m.file_path ? 'upload' : 'url',
        url: m.url ?? '',
        file: null,
        duration_minutes: m.duration_minutes ?? '',
        _existing: m.file_path ? { name: m.file_name, size: m.file_size, url: m.file_url } : null,
    };
}

export function materialsForSubmit(list) {
    return list.map(({ _key, _existing, ...m }) => ({ ...m, file: m.source === 'upload' ? m.file : null }));
}

export default function MaterialList({ items, onChange, errors, prefix, allowedTypes = ['video', 'document', 'link', 'file'], emptyText }) {
    const update = (i, patch) => onChange(items.map((m, idx) => (idx === i ? { ...m, ...patch } : m)));
    const move = (i, dir) => {
        const j = i + dir;
        if (j < 0 || j >= items.length) return;
        const copy = [...items];
        [copy[i], copy[j]] = [copy[j], copy[i]];
        onChange(copy);
    };

    return (
        <div className="space-y-3">
            {items.length === 0 && emptyText && (
                <p className="text-sm text-[#507c94] dark:text-[#87b3cd] text-center py-6 bg-surface/50 dark:bg-slate-950/50 rounded-2xl">{emptyText}</p>
            )}

            {items.map((m, i) => {
                const t = MATERIAL_TYPES[m.type];
                const err = (f) => errors[`${prefix}.${i}.${f}`];
                return (
                    <div key={m._key} className="rounded-2xl border border-outline-variant/20 dark:border-slate-800 bg-surface/50 dark:bg-slate-950/50 p-4">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-primary dark:text-[#00D1FF]">{t.icon}</span>
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#507c94]">
                                {i + 1}. {t.label}
                            </span>
                            <div className="ml-auto flex items-center">
                                <IconButton icon="arrow_upward" title="Subir" onClick={() => move(i, -1)} disabled={i === 0} />
                                <IconButton icon="arrow_downward" title="Descer" onClick={() => move(i, 1)} disabled={i === items.length - 1} />
                                <IconButton icon="delete" title="Remover" tone="danger" onClick={() => onChange(items.filter((_, idx) => idx !== i))} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <input
                                    value={m.title}
                                    onChange={(e) => update(i, { title: e.target.value })}
                                    className={`${inputClass} bg-white dark:bg-slate-900 py-2.5`}
                                    placeholder="Título do material *"
                                />
                                {err('title') && <p className="text-xs text-error mt-1">{err('title')}</p>}
                            </div>
                            <input
                                value={m.description}
                                onChange={(e) => update(i, { description: e.target.value })}
                                className={`${inputClass} bg-white dark:bg-slate-900 py-2.5`}
                                placeholder="Descrição (opcional)"
                            />
                        </div>

                        <div className="mt-3 space-y-2">
                            {m.type === 'video' && (
                                <div className="flex flex-wrap items-center gap-3">
                                    <Segmented
                                        value={m.source}
                                        onChange={(source) => update(i, { source })}
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
                                            value={m.duration_minutes}
                                            onChange={(e) => update(i, { duration_minutes: e.target.value })}
                                            className="w-14 bg-transparent border-none p-0 text-xs font-bold text-[#003346] dark:text-white focus:ring-0"
                                            placeholder="min"
                                        />
                                        <span className="text-[10px] font-bold text-[#507c94]">min</span>
                                    </div>
                                </div>
                            )}

                            {m.type === 'link' || m.source === 'url' ? (
                                <div>
                                    <input
                                        type="url"
                                        value={m.url}
                                        onChange={(e) => update(i, { url: e.target.value })}
                                        className={`${inputClass} bg-white dark:bg-slate-900 py-2.5`}
                                        placeholder="https://"
                                    />
                                    {err('url') && <p className="text-xs text-error mt-1">{err('url')}</p>}
                                </div>
                            ) : (
                                <div>
                                    <FileDrop
                                        compact
                                        accept={t.accept}
                                        file={m.file}
                                        existing={m._existing}
                                        onChange={(file) => update(i, { file, title: m.title || (file ? file.name.replace(/\.[^.]+$/, '') : '') })}
                                        label={m.type === 'video' ? 'Enviar vídeo' : 'Enviar arquivo'}
                                        icon={m.type === 'video' ? 'video_call' : 'upload_file'}
                                    />
                                    {err('file') && <p className="text-xs text-error mt-1">{err('file')}</p>}
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}

            <div className="flex flex-wrap gap-2">
                {allowedTypes.map((type) => (
                    <button
                        key={type}
                        type="button"
                        onClick={() => onChange([...items, blankMaterial(type)])}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-outline-variant/30 dark:border-slate-700 text-xs font-bold text-primary dark:text-[#00D1FF] hover:bg-primary/5 hover:border-primary/40 transition-all"
                    >
                        <span className="material-symbols-outlined text-base">{MATERIAL_TYPES[type].icon}</span>+ {MATERIAL_TYPES[type].label}
                    </button>
                ))}
            </div>
        </div>
    );
}
