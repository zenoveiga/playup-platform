import axios from 'axios';
import { useState } from 'react';

/* Exercício com título e questões respondíveis: a resposta é gravada e corrigida automaticamente quando possível. */

const QUESTION_TYPES = {
    single_choice: 'Escolha única',
    multiple_choice: 'Múltipla seleção',
    true_false: 'Verdadeiro ou falso',
    statements: 'Julgue as afirmações',
    fill_blanks: 'Complete as lacunas',
    matching: 'Associe as colunas',
    ordering: 'Ordene a sequência',
    numeric: 'Resposta numérica',
    short_answer: 'Resposta curta',
    essay: 'Dissertativa',
};

const INSTRUCTIONS = {
    single_choice: 'Selecione a resposta correta.',
    multiple_choice: 'Marque todas as alternativas corretas.',
    statements: 'Indique se cada afirmação é verdadeira (V) ou falsa (F).',
    fill_blanks: 'Preencha as lacunas do texto.',
    matching: 'Associe cada item da coluna A ao seu par na coluna B.',
    ordering: 'Use as setas para colocar os itens na ordem correta.',
};

const letter = (i) => String.fromCharCode(65 + i);

function emptyAnswer(q) {
    switch (q.type) {
        case 'multiple_choice':
            return [];
        case 'single_choice':
            return null;
        case 'statements':
            return q.options.map(() => null);
        case 'fill_blanks':
            return Array.from({ length: Math.max(0, q.segments.length - 1) }, () => '');
        case 'matching':
            return q.left.map(() => null);
        case 'ordering':
            return q.items.map((_, i) => i);
        default:
            return '';
    }
}

function isFilled(q, answer) {
    switch (q.type) {
        case 'multiple_choice':
            return answer.length > 0;
        case 'single_choice':
            return answer !== null && answer !== undefined;
        case 'statements':
        case 'matching':
            return answer.every((a) => a !== null && a !== undefined);
        case 'fill_blanks':
            return answer.every((a) => String(a ?? '').trim() !== '');
        case 'ordering':
            return true;
        default:
            return String(answer ?? '').trim() !== '';
    }
}

function Result({ result }) {
    if (!result) return null;
    const pending = result.is_correct === null;
    const partial = !pending && !result.is_correct && Number(result.score) > 0;
    const tone = pending
        ? 'bg-amber-50 text-amber-800 border-amber-200'
        : result.is_correct
          ? 'bg-[#cdffd4]/60 text-[#006a35] border-[#6bfe9c]'
          : partial
            ? 'bg-amber-50 text-amber-800 border-amber-200'
            : 'bg-error/5 text-error border-error/20';
    return (
        <div className={`rounded-xl border px-4 py-3 text-sm ${tone}`}>
            <p className="font-bold flex flex-wrap items-center gap-2">
                <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {pending ? 'hourglass_top' : result.is_correct ? 'check_circle' : partial ? 'contrast' : 'cancel'}
                </span>
                {pending
                    ? 'Resposta enviada — aguardando correção'
                    : result.is_correct
                      ? `Resposta correta! +${Number(result.score)} pt(s)`
                      : partial
                        ? `Parcialmente correta: ${Number(result.score)} de ${result.max_score} pt(s)`
                        : 'Resposta incorreta'}
                <span className="ml-auto text-[11px] font-medium opacity-70">
                    {result.attempts} tentativa(s) · {new Date(result.answered_at.replace(' ', 'T')).toLocaleString('pt-BR')}
                </span>
            </p>
            {result.explanation && <p className="mt-1 text-on-surface">{result.explanation}</p>}
        </div>
    );
}

/** Campo de resposta conforme o tipo da questão. */
function AnswerInput({ q, answer, setAnswer, locked }) {
    const optionClass = (selected) =>
        `w-full flex items-center gap-3 p-3 rounded-xl text-sm text-left border-2 transition-all ${
            selected ? 'border-primary bg-primary/5 text-primary font-bold' : 'border-transparent bg-surface-container-low text-on-surface hover:border-primary/30'
        } ${locked ? 'cursor-default' : ''}`;
    const setAt = (i, value) => setAnswer(answer.map((a, idx) => (idx === i ? value : a)));
    const textInput = 'bg-surface-container-low border-none rounded-xl px-4 py-3 text-sm text-on-surface focus:ring-2 focus:ring-primary outline-none';

    switch (q.type) {
        case 'single_choice':
        case 'multiple_choice': {
            const single = q.type === 'single_choice';
            const selected = (i) => (single ? answer === i : answer.includes(i));
            const toggle = (i) => (single ? setAnswer(i) : setAnswer(answer.includes(i) ? answer.filter((x) => x !== i) : [...answer, i]));
            return (
                <ul className="space-y-2">
                    {q.options.map((o, oi) => (
                        <li key={oi}>
                            <button type="button" disabled={locked} onClick={() => toggle(oi)} className={optionClass(selected(oi))}>
                                <span className="material-symbols-outlined text-lg">
                                    {single ? (selected(oi) ? 'radio_button_checked' : 'radio_button_unchecked') : selected(oi) ? 'check_box' : 'check_box_outline_blank'}
                                </span>
                                <span className="font-black">{letter(oi)}</span>
                                {o}
                            </button>
                        </li>
                    ))}
                </ul>
            );
        }

        case 'true_false':
            return (
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
            );

        case 'statements':
            return (
                <ul className="space-y-2">
                    {q.options.map((text, i) => (
                        <li key={i} className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low">
                            <span className="text-xs font-black text-on-surface-variant w-5">{i + 1}.</span>
                            <span className="flex-1 text-sm text-on-surface">{text}</span>
                            {[
                                { v: 'true', label: 'V', on: 'bg-[#cdffd4] text-[#006a35]' },
                                { v: 'false', label: 'F', on: 'bg-error/10 text-error' },
                            ].map((o) => (
                                <button
                                    key={o.v}
                                    type="button"
                                    disabled={locked}
                                    onClick={() => setAt(i, o.v)}
                                    className={`w-9 h-9 rounded-lg text-sm font-black transition-colors ${
                                        answer[i] === o.v ? o.on : 'bg-surface-container-lowest text-on-surface-variant hover:text-primary'
                                    }`}
                                >
                                    {o.label}
                                </button>
                            ))}
                        </li>
                    ))}
                </ul>
            );

        case 'fill_blanks':
            return (
                <p className="text-sm text-on-surface leading-10 p-4 rounded-xl bg-surface-container-low">
                    {q.segments.map((seg, i) => (
                        <span key={i}>
                            <span className="whitespace-pre-line">{seg}</span>
                            {i < q.segments.length - 1 && (
                                <input
                                    value={answer[i] ?? ''}
                                    readOnly={locked}
                                    onChange={(e) => setAt(i, e.target.value)}
                                    placeholder={`(${i + 1})`}
                                    className="inline-block w-36 mx-1 px-2 py-1 bg-surface-container-lowest border-0 border-b-2 border-primary rounded-md text-sm font-bold text-primary text-center focus:ring-2 focus:ring-primary"
                                />
                            )}
                        </span>
                    ))}
                </p>
            );

        case 'matching':
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-wider text-on-surface-variant">Coluna A</p>
                        {q.left.map((text, i) => (
                            <div key={i} className="flex items-center gap-2 p-2 pl-3 rounded-xl bg-surface-container-low">
                                <span className="flex-1 text-sm text-on-surface">{text}</span>
                                <select
                                    value={answer[i] ?? ''}
                                    disabled={locked}
                                    onChange={(e) => setAt(i, e.target.value === '' ? null : Number(e.target.value))}
                                    className="w-20 bg-surface-container-lowest border-none rounded-lg text-sm font-black text-primary focus:ring-2 focus:ring-primary"
                                >
                                    <option value="">—</option>
                                    {q.right.map((_, k) => (
                                        <option key={k} value={k}>{letter(k)}</option>
                                    ))}
                                </select>
                            </div>
                        ))}
                    </div>
                    <div className="space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-wider text-on-surface-variant">Coluna B</p>
                        {q.right.map((text, k) => (
                            <div key={k} className={`flex items-center gap-3 p-3 rounded-xl text-sm ${answer.includes(k) ? 'bg-primary/5 text-primary' : 'bg-surface-container-low text-on-surface'}`}>
                                <span className="font-black">{letter(k)}</span>
                                {text}
                            </div>
                        ))}
                    </div>
                </div>
            );

        case 'ordering': {
            const move = (pos, dir) => {
                const j = pos + dir;
                if (j < 0 || j >= answer.length) return;
                const copy = [...answer];
                [copy[pos], copy[j]] = [copy[j], copy[pos]];
                setAnswer(copy);
            };
            return (
                <ol className="space-y-2">
                    {answer.map((k, pos) => (
                        <li key={k} className="flex items-center gap-3 p-2 pl-3 rounded-xl bg-surface-container-low">
                            <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary text-xs font-black flex items-center justify-center">{pos + 1}</span>
                            <span className="flex-1 text-sm text-on-surface">{q.items[k]}</span>
                            {!locked && (
                                <>
                                    <button type="button" onClick={() => move(pos, -1)} disabled={pos === 0} className="p-1.5 text-on-surface-variant hover:text-primary disabled:opacity-30" title="Subir">
                                        <span className="material-symbols-outlined text-base">arrow_upward</span>
                                    </button>
                                    <button type="button" onClick={() => move(pos, 1)} disabled={pos === answer.length - 1} className="p-1.5 text-on-surface-variant hover:text-primary disabled:opacity-30" title="Descer">
                                        <span className="material-symbols-outlined text-base">arrow_downward</span>
                                    </button>
                                </>
                            )}
                        </li>
                    ))}
                </ol>
            );
        }

        case 'numeric':
            return <input inputMode="decimal" value={answer} readOnly={locked} onChange={(e) => setAnswer(e.target.value)} placeholder="Digite o número" className={`${textInput} w-48 tabular-nums`} />;

        default:
            return (
                <textarea
                    rows={q.type === 'essay' ? 5 : 2}
                    value={answer}
                    readOnly={locked}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder={q.type === 'essay' ? 'Escreva sua resposta...' : 'Sua resposta'}
                    className={`${textInput} w-full resize-y`}
                />
            );
    }
}

function Question({ question, index, courseSlug, saved, onSaved }) {
    const [answer, setAnswer] = useState(saved?.answer ?? emptyAnswer(question));
    const [editing, setEditing] = useState(!saved);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState(null);

    const submit = async () => {
        setSending(true);
        setError(null);
        try {
            const { data } = await axios.post(route('student.exercises.answer', { course: courseSlug, exercise: question.id }), { answer });
            onSaved(data);
            setEditing(false);
        } catch (err) {
            setError(Object.values(err?.response?.data?.errors ?? {}).flat()[0] || 'Não foi possível enviar a resposta.');
        } finally {
            setSending(false);
        }
    };

    return (
        <li className="space-y-3">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-on-surface-variant">
                <span className="w-6 h-6 rounded-lg bg-primary text-white flex items-center justify-center">{index + 1}</span>
                {QUESTION_TYPES[question.type]} · {question.points} pt(s)
            </div>
            {question.type !== 'fill_blanks' && <p className="text-sm font-semibold text-on-surface whitespace-pre-line">{question.statement}</p>}
            {INSTRUCTIONS[question.type] && <p className="text-xs text-on-surface-variant">{INSTRUCTIONS[question.type]}</p>}

            <AnswerInput q={question} answer={answer} setAnswer={setAnswer} locked={!editing} />

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
                            disabled={!isFilled(question, answer) || sending}
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

export default function ExerciseList({ exerciseSet, courseSlug, answers, onAnswer }) {
    const questions = exerciseSet.questions;
    const answered = questions.filter((q) => answers[q.id]).length;
    const total = questions.reduce((s, q) => s + q.points, 0);
    const scored = questions.reduce((s, q) => s + Number(answers[q.id]?.score ?? 0), 0);

    return (
        <div className="w-full bg-surface-container-lowest rounded-xl shadow-sm p-8">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
                <div>
                    <h3 className="font-headline font-bold text-xl text-on-surface">{exerciseSet.title}</h3>
                    {exerciseSet.description && <p className="text-sm text-on-surface-variant mt-1 whitespace-pre-line">{exerciseSet.description}</p>}
                </div>
                <div className="flex gap-2 text-xs font-bold">
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary">
                        {answered}/{questions.length} respondida(s)
                    </span>
                    <span className="px-3 py-1 rounded-full bg-[#cdffd4] text-[#006a35]">
                        {Math.round(scored * 100) / 100} / {total} pts
                    </span>
                </div>
            </div>
            <ol className="space-y-8">
                {questions.map((q, i) => (
                    <Question key={q.id} question={q} index={i} courseSlug={courseSlug} saved={answers[q.id]} onSaved={onAnswer} />
                ))}
            </ol>
        </div>
    );
}
