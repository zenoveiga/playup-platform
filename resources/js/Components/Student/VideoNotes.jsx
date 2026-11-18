import axios from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';

/* Anotações do aluno no vídeo: cada nota guarda o instante; clicar nela leva o vídeo até ali. */

export const formatTime = (total) => {
    const s = Math.max(0, Math.floor(total || 0));
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = String(s % 60).padStart(2, '0');
    return h ? `${h}:${String(m).padStart(2, '0')}:${sec}` : `${String(m).padStart(2, '0')}:${sec}`;
};

const errorMessage = (error) =>
    Object.values(error?.response?.data?.errors ?? {}).flat()[0] || error?.response?.data?.message || 'Não foi possível salvar a anotação.';

export default function VideoNotes({ courseSlug, video, notes, onNotesChange, playerRef, currentTime = 0, paused = true }) {
    const [draft, setDraft] = useState('');
    const [draftTime, setDraftTime] = useState(null); // null = editor fechado
    const resumeAfter = useRef(false); // o vídeo estava tocando quando a nota foi aberta?
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [editing, setEditing] = useState(null); // { id, body }

    const videoNotes = notes.filter((n) => n.course_material_id === video.id).sort((a, b) => a.timestamp_seconds - b.timestamp_seconds);
    const controllable = playerRef.current?.controllable ?? true;

    const isOpen = draftTime !== null;

    // Abre a nota no instante atual e pausa o vídeo.
    const openDraft = useCallback(() => {
        resumeAfter.current = !paused;
        setDraftTime(Math.floor(playerRef.current?.getTime() ?? currentTime));
        playerRef.current?.pause();
    }, [paused, currentTime, playerRef]);

    // Fecha o editor e retoma o vídeo se ele estava tocando.
    const closeDraft = () => {
        setDraft('');
        setDraftTime(null);
        setError(null);
        if (resumeAfter.current) playerRef.current?.play();
        resumeAfter.current = false;
    };

    // Atalho: tecla N abre uma nota no instante atual (fora de campos de texto).
    useEffect(() => {
        const onKey = (e) => {
            if (e.key.toLowerCase() !== 'n' || e.metaKey || e.ctrlKey || e.altKey || isOpen || !controllable) return;
            const el = document.activeElement;
            if (el && (el.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName))) return;
            e.preventDefault();
            openDraft();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [isOpen, controllable, openDraft]);

    const save = async (e) => {
        e.preventDefault();
        if (!draft.trim()) return;
        setSaving(true);
        setError(null);
        try {
            const { data } = await axios.post(route('student.notes.store', courseSlug), {
                course_material_id: video.id,
                timestamp_seconds: draftTime ?? Math.floor(playerRef.current?.getTime() ?? 0),
                body: draft.trim(),
            });
            onNotesChange([...notes, data]);
            closeDraft();
        } catch (err) {
            setError(errorMessage(err));
        } finally {
            setSaving(false);
        }
    };

    const update = async (note) => {
        if (!editing?.body.trim()) return;
        try {
            const { data } = await axios.put(route('student.notes.update', note.id), { body: editing.body.trim() });
            onNotesChange(notes.map((n) => (n.id === note.id ? data : n)));
            setEditing(null);
        } catch (err) {
            setError(errorMessage(err));
        }
    };

    const remove = async (note) => {
        try {
            await axios.delete(route('student.notes.destroy', note.id));
            onNotesChange(notes.filter((n) => n.id !== note.id));
        } catch (err) {
            setError(errorMessage(err));
        }
    };

    return (
        <div className="bg-surface-container-lowest rounded-xl p-4 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="font-headline font-bold text-lg text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">edit_note</span>
                    Minhas anotações
                </h3>
                <span className="text-xs font-bold text-on-surface-variant">{videoNotes.length} nota(s) neste vídeo</span>
            </div>

            {!controllable ? (
                <p className="text-xs text-on-surface-variant">Anotações com marcação de tempo não estão disponíveis para este tipo de vídeo.</p>
            ) : !isOpen ? (
                <button
                    type="button"
                    onClick={openDraft}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed text-sm font-bold transition-all ${
                        paused
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-outline-variant/30 text-on-surface-variant hover:border-primary/40 hover:text-primary'
                    }`}
                >
                    <span className="material-symbols-outlined text-lg">{paused ? 'bookmark_add' : 'edit_note'}</span>
                    <span className="flex-1 text-left">
                        {paused ? 'Anotar este momento' : 'Adicionar nota em'}{' '}
                        <span className="tabular-nums">{formatTime(currentTime)}</span>
                    </span>
                    <kbd className="hidden sm:inline-block text-[10px] font-black px-1.5 py-0.5 rounded border border-current opacity-60">N</kbd>
                </button>
            ) : (
                <form onSubmit={save} className="space-y-2 rounded-xl bg-primary/5 p-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-primary flex items-center gap-1 tabular-nums">
                            <span className="material-symbols-outlined text-sm">schedule</span>
                            Nota em {formatTime(draftTime)}
                        </span>
                        <button
                            type="button"
                            onClick={() => setDraftTime(Math.floor(playerRef.current?.getTime() ?? currentTime))}
                            className="text-[11px] font-bold text-on-surface-variant hover:text-primary"
                        >
                            Usar instante atual ({formatTime(currentTime)})
                        </button>
                    </div>
                    <textarea
                        rows="3"
                        autoFocus
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) save(e);
                            if (e.key === 'Escape') closeDraft();
                        }}
                        placeholder="O que você quer lembrar deste momento?"
                        className="w-full bg-white dark:bg-slate-900 border-none rounded-xl px-4 py-3 text-sm text-on-surface focus:ring-2 focus:ring-primary outline-none resize-none"
                    />
                    <div className="flex items-center justify-between gap-3">
                        <span className="text-[10px] text-on-surface-variant hidden sm:block">Ctrl/⌘ + Enter salva · Esc descarta</span>
                        <div className="flex items-center gap-3 ml-auto">
                            <button type="button" onClick={closeDraft} className="text-xs font-bold text-on-surface-variant hover:text-primary">
                                Descartar
                            </button>
                            <button
                                type="submit"
                                disabled={saving || !draft.trim()}
                                className="kinetic-gradient text-white px-5 py-2 rounded-xl text-sm font-bold disabled:opacity-40 flex items-center gap-1"
                            >
                                <span className="material-symbols-outlined text-base">bookmark_add</span>
                                Salvar nota
                            </button>
                        </div>
                    </div>
                    {error && <p className="text-xs font-bold text-error">{error}</p>}
                </form>
            )}

            {videoNotes.length > 0 ? (
                <ul className="divide-y divide-outline-variant/10">
                    {videoNotes.map((note) => (
                        <li key={note.id} className="py-3 flex items-start gap-3 group">
                            <button
                                type="button"
                                onClick={() => playerRef.current?.seek(note.timestamp_seconds)}
                                title="Ir para este momento do vídeo"
                                className="shrink-0 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-black tabular-nums flex items-center gap-1 hover:opacity-90"
                            >
                                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                                {formatTime(note.timestamp_seconds)}
                            </button>
                            {editing?.id === note.id ? (
                                <div className="flex-1 space-y-2">
                                    <textarea
                                        rows="2"
                                        autoFocus
                                        value={editing.body}
                                        onChange={(e) => setEditing({ ...editing, body: e.target.value })}
                                        className="w-full bg-surface-container-low border-none rounded-xl px-3 py-2 text-sm text-on-surface focus:ring-2 focus:ring-primary resize-none"
                                    />
                                    <div className="flex gap-3 justify-end">
                                        <button type="button" onClick={() => setEditing(null)} className="text-xs font-bold text-on-surface-variant">Cancelar</button>
                                        <button type="button" onClick={() => update(note)} className="text-xs font-bold text-primary">Salvar</button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => playerRef.current?.seek(note.timestamp_seconds)}
                                    className="flex-1 text-left text-sm text-on-surface whitespace-pre-line hover:text-primary"
                                >
                                    {note.body}
                                </button>
                            )}
                            {editing?.id !== note.id && (
                                <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button type="button" onClick={() => setEditing({ id: note.id, body: note.body })} className="p-1.5 text-on-surface-variant hover:text-primary" title="Editar">
                                        <span className="material-symbols-outlined text-base">edit</span>
                                    </button>
                                    <button type="button" onClick={() => remove(note)} className="p-1.5 text-on-surface-variant hover:text-error" title="Excluir">
                                        <span className="material-symbols-outlined text-base">delete</span>
                                    </button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-sm text-on-surface-variant text-center py-4">Nenhuma anotação neste vídeo ainda.</p>
            )}
        </div>
    );
}
