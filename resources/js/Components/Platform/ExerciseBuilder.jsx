import { Field, IconButton, inputClass } from '@/Components/Platform/UI';

/* Formulário dinâmico de exercícios de um módulo. */

export const EXERCISE_TYPES = [
    { value: 'multiple_choice', label: 'Múltipla escolha', icon: 'checklist' },
    { value: 'true_false', label: 'Verdadeiro ou falso', icon: 'rule' },
    { value: 'short_answer', label: 'Resposta curta', icon: 'short_text' },
    { value: 'essay', label: 'Dissertativa', icon: 'notes' },
];

let seq = 0;
export const newKey = () => `k${Date.now()}${seq++}`;

export function blankExercise(type = 'multiple_choice') {
    return {
        _key: newKey(),
        type,
        statement: '',
        options:
            type === 'multiple_choice'
                ? [
                      { _key: newKey(), text: '', correct: true },
                      { _key: newKey(), text: '', correct: false },
                  ]
                : [],
        expected_answer: type === 'true_false' ? 'true' : '',
        points: 1,
        explanation: '',
    };
}

export function exerciseFromServer(e) {
    return {
        _key: newKey(),
        type: e.type,
        statement: e.statement ?? '',
        options: (e.options ?? []).map((o) => ({ _key: newKey(), text: o.text, correct: !!o.correct })),
        expected_answer: e.expected_answer ?? (e.type === 'true_false' ? 'true' : ''),
        points: e.points ?? 1,
        explanation: e.explanation ?? '',
    };
}

/** Remove chaves internas (_key) antes do envio. */
export function exercisesForSubmit(list) {
    return list.map(({ _key, options, ...rest }) => ({
        ...rest,
        options: rest.type === 'multiple_choice' ? options.map(({ _key: k, ...o }) => o) : [],
    }));
}

export default function ExerciseBuilder({ exercises, onChange, errors }) {
    const update = (i, patch) => onChange(exercises.map((e, idx) => (idx === i ? { ...e, ...patch } : e)));
    const remove = (i) => onChange(exercises.filter((_, idx) => idx !== i));
    const move = (i, dir) => {
        const j = i + dir;
        if (j < 0 || j >= exercises.length) return;
        const copy = [...exercises];
        [copy[i], copy[j]] = [copy[j], copy[i]];
        onChange(copy);
    };
    const duplicate = (i) => {
        const e = exercises[i];
        const clone = { ...e, _key: newKey(), options: e.options.map((o) => ({ ...o, _key: newKey() })) };
        onChange([...exercises.slice(0, i + 1), clone, ...exercises.slice(i + 1)]);
    };
    const changeType = (i, type) => {
        const current = exercises[i];
        const base = blankExercise(type);
        update(i, {
            type,
            options: type === 'multiple_choice' ? (current.options.length ? current.options : base.options) : current.options,
            expected_answer: type === 'true_false' ? (['true', 'false'].includes(current.expected_answer) ? current.expected_answer : 'true') : type === 'multiple_choice' ? '' : current.expected_answer === 'true' || current.expected_answer === 'false' ? '' : current.expected_answer,
        });
    };

    const totalPoints = exercises.reduce((sum, e) => sum + (Number(e.points) || 0), 0);

    return (
        <div className="space-y-4">
            {exercises.length > 0 && (
                <p className="text-xs font-bold text-[#507c94] dark:text-[#87b3cd]">
                    {exercises.length} exercício(s) · {totalPoints} ponto(s) no total
                </p>
            )}

            {exercises.map((ex, i) => {
                const err = (field) => errors[`exercises.${i}.${field}`];
                return (
                    <div key={ex._key} className="rounded-2xl border border-outline-variant/20 dark:border-slate-800 bg-surface/50 dark:bg-slate-950/50 p-5">
                        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                            <div className="flex items-center gap-3">
                                <span className="w-8 h-8 rounded-xl kinetic-gradient text-white flex items-center justify-center font-black text-sm">{i + 1}</span>
                                <select
                                    value={ex.type}
                                    onChange={(e) => changeType(i, e.target.value)}
                                    className="bg-white dark:bg-slate-900 border-none rounded-xl px-3 py-2 text-xs font-bold text-[#003346] dark:text-white focus:ring-2 focus:ring-primary"
                                >
                                    {EXERCISE_TYPES.map((t) => (
                                        <option key={t.value} value={t.value}>{t.label}</option>
                                    ))}
                                </select>
                                <div className="flex items-center gap-1 bg-white dark:bg-slate-900 rounded-xl px-3 py-1.5">
                                    <span className="material-symbols-outlined text-sm text-amber-500">star</span>
                                    <input
                                        type="number"
                                        min="0"
                                        value={ex.points}
                                        onChange={(e) => update(i, { points: e.target.value })}
                                        className="w-14 bg-transparent border-none p-0 text-xs font-bold text-[#003346] dark:text-white focus:ring-0"
                                    />
                                    <span className="text-[10px] font-bold text-[#507c94]">pts</span>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <IconButton icon="arrow_upward" title="Subir" onClick={() => move(i, -1)} disabled={i === 0} />
                                <IconButton icon="arrow_downward" title="Descer" onClick={() => move(i, 1)} disabled={i === exercises.length - 1} />
                                <IconButton icon="content_copy" title="Duplicar" onClick={() => duplicate(i)} />
                                <IconButton icon="delete" title="Remover" tone="danger" onClick={() => remove(i)} />
                            </div>
                        </div>

                        <Field label="Enunciado *" error={err('statement')}>
                            <textarea
                                rows="2"
                                value={ex.statement}
                                onChange={(e) => update(i, { statement: e.target.value })}
                                className={`${inputClass} bg-white dark:bg-slate-900 resize-y`}
                                placeholder="Digite a pergunta ou o comando do exercício"
                            />
                        </Field>

                        {ex.type === 'multiple_choice' && (
                            <div className="mt-4 space-y-2">
                                <label className="block text-xs font-bold text-[#507c94] dark:text-[#87b3cd] uppercase tracking-wide">
                                    Alternativas <span className="normal-case font-medium">(marque a(s) correta(s))</span>
                                </label>
                                {ex.options.map((opt, oi) => (
                                    <div key={opt._key} className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                update(i, { options: ex.options.map((o, idx) => (idx === oi ? { ...o, correct: !o.correct } : o)) })
                                            }
                                            className={`w-9 h-9 shrink-0 rounded-xl flex items-center justify-center transition-colors ${
                                                opt.correct ? 'bg-[#cdffd4] text-[#006a35]' : 'bg-white dark:bg-slate-900 text-[#507c94] hover:text-primary'
                                            }`}
                                            title={opt.correct ? 'Alternativa correta' : 'Marcar como correta'}
                                        >
                                            <span className="material-symbols-outlined text-lg" style={opt.correct ? { fontVariationSettings: "'FILL' 1" } : {}}>
                                                {opt.correct ? 'check_circle' : 'radio_button_unchecked'}
                                            </span>
                                        </button>
                                        <span className="text-xs font-black text-[#507c94] w-4">{String.fromCharCode(65 + oi)}</span>
                                        <input
                                            value={opt.text}
                                            onChange={(e) =>
                                                update(i, { options: ex.options.map((o, idx) => (idx === oi ? { ...o, text: e.target.value } : o)) })
                                            }
                                            className={`${inputClass} bg-white dark:bg-slate-900 py-2`}
                                            placeholder={`Alternativa ${String.fromCharCode(65 + oi)}`}
                                        />
                                        <IconButton
                                            icon="close"
                                            title="Remover alternativa"
                                            tone="danger"
                                            disabled={ex.options.length <= 2}
                                            onClick={() => update(i, { options: ex.options.filter((_, idx) => idx !== oi) })}
                                        />
                                    </div>
                                ))}
                                {(err('options') || Object.keys(errors).some((k) => k.startsWith(`exercises.${i}.options.`))) && (
                                    <p className="text-xs text-error">{err('options') ?? 'Preencha o texto de todas as alternativas.'}</p>
                                )}
                                {ex.options.length < 8 && (
                                    <button
                                        type="button"
                                        onClick={() => update(i, { options: [...ex.options, { _key: newKey(), text: '', correct: false }] })}
                                        className="flex items-center gap-1 text-xs font-bold text-primary dark:text-[#00D1FF] hover:underline pt-1"
                                    >
                                        <span className="material-symbols-outlined text-base">add</span>
                                        Adicionar alternativa
                                    </button>
                                )}
                            </div>
                        )}

                        {ex.type === 'true_false' && (
                            <div className="mt-4 space-y-2">
                                <label className="block text-xs font-bold text-[#507c94] dark:text-[#87b3cd] uppercase tracking-wide">Resposta correta</label>
                                <div className="flex gap-3">
                                    {[
                                        { v: 'true', label: 'Verdadeiro', icon: 'check' },
                                        { v: 'false', label: 'Falso', icon: 'close' },
                                    ].map((o) => (
                                        <button
                                            key={o.v}
                                            type="button"
                                            onClick={() => update(i, { expected_answer: o.v })}
                                            className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-2xl border-2 font-bold text-sm transition-all ${
                                                ex.expected_answer === o.v
                                                    ? 'border-primary bg-primary/5 text-primary dark:text-[#00D1FF]'
                                                    : 'border-transparent bg-white dark:bg-slate-900 text-[#003346] dark:text-white'
                                            }`}
                                        >
                                            <span className="material-symbols-outlined text-lg">{o.icon}</span>
                                            {o.label}
                                        </button>
                                    ))}
                                </div>
                                {err('expected_answer') && <p className="text-xs text-error">{err('expected_answer')}</p>}
                            </div>
                        )}

                        {(ex.type === 'short_answer' || ex.type === 'essay') && (
                            <Field
                                className="mt-4"
                                label={ex.type === 'short_answer' ? 'Resposta esperada' : 'Critérios / resposta de referência'}
                                hint={ex.type === 'essay' ? 'Usado como referência na correção.' : undefined}
                                error={err('expected_answer')}
                            >
                                <textarea
                                    rows={ex.type === 'essay' ? 3 : 1}
                                    value={ex.expected_answer}
                                    onChange={(e) => update(i, { expected_answer: e.target.value })}
                                    className={`${inputClass} bg-white dark:bg-slate-900 resize-y`}
                                />
                            </Field>
                        )}

                        <Field className="mt-4" label="Explicação / feedback (opcional)" error={err('explanation')}>
                            <input
                                value={ex.explanation}
                                onChange={(e) => update(i, { explanation: e.target.value })}
                                className={`${inputClass} bg-white dark:bg-slate-900 py-2`}
                                placeholder="Exibida ao aluno após responder"
                            />
                        </Field>
                    </div>
                );
            })}

            <div className="flex flex-wrap gap-2">
                {EXERCISE_TYPES.map((t) => (
                    <button
                        key={t.value}
                        type="button"
                        onClick={() => onChange([...exercises, blankExercise(t.value)])}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-outline-variant/30 dark:border-slate-700 text-xs font-bold text-primary dark:text-[#00D1FF] hover:bg-primary/5 hover:border-primary/40 transition-all"
                    >
                        <span className="material-symbols-outlined text-base">{t.icon}</span>
                        + {t.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
