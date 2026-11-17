import axios from 'axios';
import { useState } from 'react';

/* Exercícios respondíveis: a resposta é gravada e corrigida automaticamente quando possível. */

const EXERCISE_TYPES = {
    multiple_choice: 'Múltipla escolha',
    true_false: 'Verdadeiro ou falso',
    short_answer: 'Resposta curta',
    essay: 'Dissertativa',
};

const emptyAnswer = (ex) => (ex.type === 'multiple_choice' ? [] : '');

function Result({ result }) {
    if (!result) return null;
    const pending = result.is_correct === null;
    const tone = pending
        ? 'bg-amber-50 text-amber-800 border-amber-200'
        : result.is_correct
          ? 'bg-[#cdffd4]/60 text-[#006a35] border-[#6bfe9c]'
          : 'bg-error/5 text-error border-error/20';
    return (
        <div className={`rounded-xl border px-4 py-3 text-sm ${tone}`}>
            <p className="font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {pending ? 'hourglass_top' : result.is_correct ? 'check_circle' : 'cancel'}
                </span>
                {pending ? 'Resposta enviada — aguardando correção' : result.is_correct ? `Resposta correta! +${Number(result.score)} pt(s)` : 'Resposta incorreta'}
                <span className="ml-auto text-[11px] font-medium opacity-70">
                    {result.attempts} tentativa(s) · {new Date(result.answered_at.replace(' ', 'T')).toLocaleString('pt-BR')}
                </span>
            </p>
            {result.explanation && <p className="mt-1 text-on-surface">{result.explanation}</p>}
        </div>
    );
}

function Exercise({ exercise, index, courseSlug, saved, onSaved }) {
    const [answer, setAnswer] = useState(saved?.answer ?? emptyAnswer(exercise));
    const [editing, setEditing] = useState(!saved);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState(null);

    const toggleOption = (i) => setAnswer((a) => (a.includes(i) ? a.filter((x) => x !== i) : [...a, i]));
    const filled = Array.isArray(answer) ? answer.length > 0 : String(answer).trim() !== '';
    const locked = !editing;

    const submit = async () => {
        setSending(true);
        setError(null);
        try {
            const { data } = await axios.post(route('student.exercises.answer', { course: courseSlug, exercise: exercise.id }), { answer });
            onSaved(data);
            setEditing(false);
        } catch (err) {
            setError(Object.values(err?.response?.data?.errors ?? {}).flat()[0] || 'Não foi possível enviar a resposta.');
        } finally {
            setSending(false);
        }
    };

    const optionClass = (selected) =>
        `w-full flex items-center gap-3 p-3 rounded-xl text-sm text-left border-2 transition-all ${
            selected ? 'border-primary bg-primary/5 text-primary font-bold' : 'border-transparent bg-surface-container-low text-on-surface hover:border-primary/30'
        } ${locked ? 'cursor-default' : ''}`;

    return (
        <li className="space-y-3">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-on-surface-variant">
                <span className="w-6 h-6 rounded-lg bg-primary text-white flex items-center justify-center">{index + 1}</span>
                {EXERCISE_TYPES[exercise.type]} · {exercise.points} pt(s)
            </div>
            <p className="text-sm font-semibold text-on-surface whitespace-pre-line">{exercise.statement}</p>

            {exercise.type === 'multiple_choice' && (
                <ul className="space-y-2">
                    {exercise.options.map((o, oi) => (
                        <li key={oi}>
                            <button type="button" disabled={locked} onClick={() => toggleOption(oi)} className={optionClass(answer.includes(oi))}>
                                <span className="material-symbols-outlined text-lg">{answer.includes(oi) ? 'check_box' : 'check_box_outline_blank'}</span>
                                <span className="font-black">{String.fromCharCode(65 + oi)}</span>
                                {o}
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {exercise.type === 'true_false' && (
                <div className="flex gap-2">
                    {[
                        { v: 'true', label: 'Verdadeiro', icon: 'check' },
                        { v: 'false', label: 'Falso', icon: 'close' },
                    ].map((o) => (
                        <button key={o.v} type="button" disabled={locked} onClick={() => setAnswer(o.v)} className={`${optionClass(answer === o.v)} justify-center`}>
                            <span className="material-symbols-outlined text-lg">{o.icon}</span>
                            {o.label}
                        </button>
                    ))}
                </div>
            )}

            {(exercise.type === 'short_answer' || exercise.type === 'essay') && (
                <textarea
                    rows={exercise.type === 'essay' ? 5 : 2}
                    value={answer}
                    readOnly={locked}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder={exercise.type === 'essay' ? 'Escreva sua resposta...' : 'Sua resposta'}
                    className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-sm text-on-surface focus:ring-2 focus:ring-primary outline-none resize-y"
                />
            )}

            {!editing && <Result result={saved} />}
            {error && <p className="text-xs font-bold text-error">{error}</p>}

            <div className="flex justify-end gap-3">
                {editing ? (
                    <>
                        {saved && (
                            <button
                                type="button"
                                onClick={() => {
                                    setAnswer(saved.answer);
                                    setEditing(false);
                                }}
                                className="text-xs font-bold text-on-surface-variant"
                            >
                                Cancelar
                            </button>
                        )}
                        <button
                            type="button"
                            disabled={!filled || sending}
                            onClick={submit}
                            className="kinetic-gradient text-white px-5 py-2 rounded-xl text-sm font-bold disabled:opacity-40 flex items-center gap-1"
                        >
                            <span className="material-symbols-outlined text-base">send</span>
                            {sending ? 'Enviando...' : 'Enviar resposta'}
                        </button>
                    </>
                ) : (
                    <button type="button" onClick={() => setEditing(true)} className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">replay</span>
                        Responder novamente
                    </button>
                )}
            </div>
        </li>
    );
}

export default function ExerciseList({ exercises, courseSlug, answers, onAnswer }) {
    const answered = exercises.filter((e) => answers[e.id]).length;
    const total = exercises.reduce((s, e) => s + e.points, 0);
    const scored = exercises.reduce((s, e) => s + Number(answers[e.id]?.score ?? 0), 0);

    return (
        <div className="w-full bg-surface-container-lowest rounded-xl shadow-sm p-8">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <h3 className="font-headline font-bold text-xl text-on-surface">Exercícios</h3>
                <div className="flex gap-2 text-xs font-bold">
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary">
                        {answered}/{exercises.length} respondido(s)
                    </span>
                    <span className="px-3 py-1 rounded-full bg-[#cdffd4] text-[#006a35]">
                        {scored} / {total} pts
                    </span>
                </div>
            </div>
            <ol className="space-y-8">
                {exercises.map((ex, i) => (
                    <Exercise key={ex.id} exercise={ex} index={i} courseSlug={courseSlug} saved={answers[ex.id]} onSaved={onAnswer} />
                ))}
            </ol>
        </div>
    );
}
