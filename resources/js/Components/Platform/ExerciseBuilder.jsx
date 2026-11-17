import { Field, IconButton, inputClass } from '@/Components/Platform/UI';
import { useState } from 'react';

/*
 * Formulário dinâmico de exercícios: cada exercício tem título e uma lista de questões.
 * Usado nos módulos e nos cursos livres (campo exercise_sets).
 */

export const QUESTION_TYPES = [
    { value: 'single_choice', label: 'Escolha única', icon: 'radio_button_checked', hint: 'Selecione a resposta correta' },
    { value: 'multiple_choice', label: 'Múltipla seleção', icon: 'checklist', hint: 'Marque todas as corretas' },
    { value: 'true_false', label: 'Verdadeiro ou falso', icon: 'rule', hint: 'Julgue uma afirmação' },
    { value: 'statements', label: 'Julgue as afirmações', icon: 'fact_check', hint: 'Várias afirmações, cada uma V ou F' },
    { value: 'fill_blanks', label: 'Complete as lacunas', icon: 'text_fields', hint: 'Preencha os espaços do texto' },
    { value: 'matching', label: 'Associe as colunas', icon: 'compare_arrows', hint: 'Ligue cada item ao seu par' },
    { value: 'ordering', label: 'Ordene a sequência', icon: 'format_list_numbered', hint: 'Coloque os itens na ordem certa' },
    { value: 'numeric', label: 'Resposta numérica', icon: 'pin', hint: 'Cálculo com resultado em número' },
    { value: 'short_answer', label: 'Resposta curta', icon: 'short_text', hint: 'Palavra ou frase, corrigida automaticamente' },
    { value: 'essay', label: 'Dissertativa', icon: 'notes', hint: 'Texto livre, correção manual' },
];

const typeInfo = (value) => QUESTION_TYPES.find((t) => t.value === value) ?? QUESTION_TYPES[0];

// Tipos cujas alternativas/itens ficam em "options" e o formato de cada item.
const OPTION_TYPES = ['single_choice', 'multiple_choice', 'statements', 'matching', 'ordering'];
const MIN_OPTIONS = { single_choice: 2, multiple_choice: 2, statements: 1, matching: 2, ordering: 2 };

let seq = 0;
export const newKey = () => `k${Date.now()}${seq++}`;

const option = (text = '', correct = false, match = '') => ({ _key: newKey(), text, correct, match });

function blankOptions(type) {
    switch (type) {
        case 'single_choice':
        case 'multiple_choice':
            return [option('', true), option('', false), option('', false)];
        case 'statements':
            return [option('', true), option('', false)];
        case 'matching':
        case 'ordering':
            return [option(), option(), option()];
        default:
            return [];
    }
}

export function blankQuestion(type = 'single_choice') {
    return {
        _key: newKey(),
        id: null,
        type,
        statement: '',
        options: blankOptions(type),
        expected_answer: type === 'true_false' ? 'true' : '',
        tolerance: '',
        points: 1,
        explanation: '',
    };
}

export function blankSet(title = '') {
    return { _key: newKey(), id: null, title, description: '', questions: [] };
}

function questionFromServer(e) {
    return {
        _key: newKey(),
        id: e.id ?? null,
        type: e.type,
        statement: e.statement ?? '',
        options: (e.options ?? []).map((o) => option(o.text ?? '', !!o.correct, o.match ?? '')),
        expected_answer: e.expected_answer ?? (e.type === 'true_false' ? 'true' : ''),
        tolerance: e.settings?.tolerance ?? '',
        points: e.points ?? 1,
        explanation: e.explanation ?? '',
    };
}

export function setFromServer(s) {
    return {
        _key: newKey(),
        id: s.id ?? null,
        title: s.title ?? '',
        description: s.description ?? '',
        questions: (s.questions ?? []).map(questionFromServer),
    };
}

/** Remove chaves internas (_key) antes do envio. */
export function setsForSubmit(list) {
    return list.map(({ _key, questions, ...set }) => ({
        ...set,
        questions: questions.map(({ _key: k, options, ...q }) => ({
            ...q,
            options: OPTION_TYPES.includes(q.type) ? options.map(({ _key: ok, ...o }) => o) : [],
        })),
    }));
}

const cloneQuestion = (q) => ({ ...q, _key: newKey(), id: null, options: q.options.map((o) => ({ ...o, _key: newKey() })) });

/** Troca o tipo aproveitando enunciado, pontos e textos das alternativas quando fizer sentido. */
function convertQuestion(current, type) {
    const base = blankQuestion(type);
    let options = base.options;
    if (OPTION_TYPES.includes(type) && OPTION_TYPES.includes(current.type) && current.options.length) {
        options = current.options.map((o) => ({ ...o }));
        if (type === 'single_choice') {
            const first = Math.max(0, options.findIndex((o) => o.correct));
            options = options.map((o, i) => ({ ...o, correct: i === first }));
        }
    }
    const keepAnswer = ['short_answer', 'essay'].includes(type) && ['short_answer', 'essay'].includes(current.type);
    return {
        ...base,
        _key: current._key,
        id: current.id,
        statement: current.statement,
        points: current.points,
        explanation: current.explanation,
        options,
        expected_answer: keepAnswer ? current.expected_answer : base.expected_answer,
    };
}

const labelClass = 'block text-xs font-bold text-[#507c94] dark:text-[#87b3cd] uppercase tracking-wide';
const lightInput = `${inputClass} bg-white dark:bg-slate-900`;

function AddLink({ onClick, children }) {
    return (
        <button type="button" onClick={onClick} className="flex items-center gap-1 text-xs font-bold text-primary dark:text-[#00D1FF] hover:underline pt-1">
            <span className="material-symbols-outlined text-base">add</span>
            {children}
        </button>
    );
}

function ToggleButton({ active, onClick, children, tone = 'primary', className = '' }) {
    const on = tone === 'success' ? 'bg-[#cdffd4] text-[#006a35]' : tone === 'danger' ? 'bg-error/10 text-error' : 'bg-primary/10 text-primary dark:text-[#00D1FF]';
    return (
        <button
            type="button"
            onClick={onClick}
            className={`px-3 h-9 shrink-0 rounded-xl text-xs font-black flex items-center gap-1 transition-colors ${
                active ? on : 'bg-white dark:bg-slate-900 text-[#507c94] hover:text-primary'
            } ${className}`}
        >
            {children}
        </button>
    );
}

/** Editor das alternativas/itens das questões baseadas em lista. */
function OptionsEditor({ q, update, error }) {
    const setOptions = (options) => update({ options });
    const setOption = (oi, patch) => setOptions(q.options.map((o, idx) => (idx === oi ? { ...o, ...patch } : o)));
    const removeOption = (oi) => setOptions(q.options.filter((_, idx) => idx !== oi));
    const moveOption = (oi, dir) => {
        const j = oi + dir;
        if (j < 0 || j >= q.options.length) return;
        const copy = [...q.options];
        [copy[oi], copy[j]] = [copy[j], copy[oi]];
        setOptions(copy);
    };
    const canRemove = q.options.length > MIN_OPTIONS[q.type];
    const canAdd = q.options.length < 20;
    const letter = (i) => String.fromCharCode(65 + i);

    const remove = (oi) => <IconButton icon="close" title="Remover" tone="danger" disabled={!canRemove} onClick={() => removeOption(oi)} />;

    let body;
    if (q.type === 'single_choice' || q.type === 'multiple_choice') {
        const single = q.type === 'single_choice';
        body = (
            <>
                <label className={labelClass}>
                    Alternativas <span className="normal-case font-medium">({single ? 'clique na correta' : 'marque todas as corretas'})</span>
                </label>
                {q.options.map((opt, oi) => (
                    <div key={opt._key} className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() =>
                                setOptions(q.options.map((o, idx) => (single ? { ...o, correct: idx === oi } : idx === oi ? { ...o, correct: !o.correct } : o)))
                            }
                            className={`w-9 h-9 shrink-0 rounded-xl flex items-center justify-center transition-colors ${
                                opt.correct ? 'bg-[#cdffd4] text-[#006a35]' : 'bg-white dark:bg-slate-900 text-[#507c94] hover:text-primary'
                            }`}
                            title={opt.correct ? 'Alternativa correta' : 'Marcar como correta'}
                        >
                            <span className="material-symbols-outlined text-lg" style={opt.correct ? { fontVariationSettings: "'FILL' 1" } : {}}>
                                {single ? (opt.correct ? 'radio_button_checked' : 'radio_button_unchecked') : opt.correct ? 'check_box' : 'check_box_outline_blank'}
                            </span>
                        </button>
                        <span className="text-xs font-black text-[#507c94] w-4">{letter(oi)}</span>
                        <input value={opt.text} onChange={(e) => setOption(oi, { text: e.target.value })} className={`${lightInput} py-2`} placeholder={`Alternativa ${letter(oi)}`} />
                        {remove(oi)}
                    </div>
                ))}
                {canAdd && <AddLink onClick={() => setOptions([...q.options, option()])}>Adicionar alternativa</AddLink>}
            </>
        );
    } else if (q.type === 'statements') {
        body = (
            <>
                <label className={labelClass}>
                    Afirmações <span className="normal-case font-medium">(indique se cada uma é verdadeira ou falsa)</span>
                </label>
                {q.options.map((opt, oi) => (
                    <div key={opt._key} className="flex items-center gap-2">
                        <span className="text-xs font-black text-[#507c94] w-5">{oi + 1}.</span>
                        <input value={opt.text} onChange={(e) => setOption(oi, { text: e.target.value })} className={`${lightInput} py-2`} placeholder={`Afirmação ${oi + 1}`} />
                        <ToggleButton active={opt.correct} tone="success" onClick={() => setOption(oi, { correct: true })}>V</ToggleButton>
                        <ToggleButton active={!opt.correct} tone="danger" onClick={() => setOption(oi, { correct: false })}>F</ToggleButton>
                        {remove(oi)}
                    </div>
                ))}
                {canAdd && <AddLink onClick={() => setOptions([...q.options, option('', true)])}>Adicionar afirmação</AddLink>}
            </>
        );
    } else if (q.type === 'matching') {
        body = (
            <>
                <label className={labelClass}>
                    Pares corretos <span className="normal-case font-medium">(o aluno verá a coluna B embaralhada)</span>
                </label>
                <div className="hidden sm:grid grid-cols-[1fr_auto_1fr_auto] gap-2 text-[10px] font-black uppercase text-[#507c94]">
                    <span>Coluna A</span>
                    <span className="w-6" />
                    <span>Coluna B</span>
                    <span className="w-9" />
                </div>
                {q.options.map((opt, oi) => (
                    <div key={opt._key} className="grid grid-cols-[1fr_auto_1fr_auto] items-center gap-2">
                        <input value={opt.text} onChange={(e) => setOption(oi, { text: e.target.value })} className={`${lightInput} py-2`} placeholder={`Item ${oi + 1}`} />
                        <span className="material-symbols-outlined text-[#507c94] w-6 text-center">sync_alt</span>
                        <input value={opt.match} onChange={(e) => setOption(oi, { match: e.target.value })} className={`${lightInput} py-2`} placeholder={`Par do item ${oi + 1}`} />
                        {remove(oi)}
                    </div>
                ))}
                {canAdd && <AddLink onClick={() => setOptions([...q.options, option()])}>Adicionar par</AddLink>}
            </>
        );
    } else if (q.type === 'ordering') {
        body = (
            <>
                <label className={labelClass}>
                    Itens na ordem correta <span className="normal-case font-medium">(o aluno verá embaralhado)</span>
                </label>
                {q.options.map((opt, oi) => (
                    <div key={opt._key} className="flex items-center gap-2">
                        <span className="w-7 h-7 shrink-0 rounded-lg bg-primary/10 text-primary dark:text-[#00D1FF] text-xs font-black flex items-center justify-center">{oi + 1}</span>
                        <input value={opt.text} onChange={(e) => setOption(oi, { text: e.target.value })} className={`${lightInput} py-2`} placeholder={`Passo ${oi + 1}`} />
                        <IconButton icon="arrow_upward" title="Subir" disabled={oi === 0} onClick={() => moveOption(oi, -1)} />
                        <IconButton icon="arrow_downward" title="Descer" disabled={oi === q.options.length - 1} onClick={() => moveOption(oi, 1)} />
                        {remove(oi)}
                    </div>
                ))}
                {canAdd && <AddLink onClick={() => setOptions([...q.options, option()])}>Adicionar item</AddLink>}
            </>
        );
    }

    return (
        <div className="mt-4 space-y-2">
            {body}
            {error && <p className="text-xs text-error">{error}</p>}
        </div>
    );
}

/** Pré-visualização do texto com lacunas, como o aluno verá. */
function BlanksPreview({ text }) {
    const parts = text.split(/\[\[(.+?)\]\]/);
    const blanks = (parts.length - 1) / 2;
    if (!blanks) {
        return <p className="text-[11px] text-[#507c94]">Nenhuma lacuna ainda. Ex.: "A capital do Brasil é [[Brasília]]".</p>;
    }
    return (
        <div className="rounded-xl bg-white dark:bg-slate-900 px-4 py-3 text-sm text-[#003346] dark:text-white leading-8">
            <span className="block text-[10px] font-black uppercase text-[#507c94] leading-4 mb-1">Prévia do aluno · {blanks} lacuna(s)</span>
            {parts.map((p, i) =>
                i % 2 ? (
                    <span key={i} className="inline-block min-w-[80px] mx-1 px-2 border-b-2 border-primary text-primary/70 text-xs font-bold leading-6 align-middle" title={`Aceita: ${p.split('|').join(', ')}`}>
                        {p.split('|')[0]}
                    </span>
                ) : (
                    <span key={i} className="whitespace-pre-line">{p}</span>
                ),
            )}
        </div>
    );
}

function QuestionCard({ q, index, total, update, onMove, onDuplicate, onRemove, err, optionsError }) {
    const info = typeInfo(q.type);
    const statementLabel = q.type === 'fill_blanks' ? 'Texto com lacunas *' : q.type === 'true_false' ? 'Afirmação *' : 'Enunciado *';

    return (
        <div className="rounded-2xl border border-outline-variant/20 dark:border-slate-800 bg-surface/50 dark:bg-slate-950/50 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex flex-wrap items-center gap-3">
                    <span className="w-8 h-8 rounded-xl kinetic-gradient text-white flex items-center justify-center font-black text-sm">{index + 1}</span>
                    <div className="flex items-center gap-1 bg-white dark:bg-slate-900 rounded-xl pl-3">
                        <span className="material-symbols-outlined text-base text-primary dark:text-[#00D1FF]">{info.icon}</span>
                        <select
                            value={q.type}
                            onChange={(e) => update(convertQuestion(q, e.target.value))}
                            className="bg-transparent border-none rounded-xl pl-1 pr-8 py-2 text-xs font-bold text-[#003346] dark:text-white focus:ring-2 focus:ring-primary"
                        >
                            {QUESTION_TYPES.map((t) => (
                                <option key={t.value} value={t.value}>{t.label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center gap-1 bg-white dark:bg-slate-900 rounded-xl px-3 py-1.5">
                        <span className="material-symbols-outlined text-sm text-amber-500">star</span>
                        <input
                            type="number"
                            min="0"
                            value={q.points}
                            onChange={(e) => update({ points: e.target.value })}
                            className="w-14 bg-transparent border-none p-0 text-xs font-bold text-[#003346] dark:text-white focus:ring-0"
                        />
                        <span className="text-[10px] font-bold text-[#507c94]">pts</span>
                    </div>
                </div>
                <div className="flex items-center">
                    <IconButton icon="arrow_upward" title="Subir" onClick={() => onMove(-1)} disabled={index === 0} />
                    <IconButton icon="arrow_downward" title="Descer" onClick={() => onMove(1)} disabled={index === total - 1} />
                    <IconButton icon="content_copy" title="Duplicar" onClick={onDuplicate} />
                    <IconButton icon="delete" title="Remover questão" tone="danger" onClick={onRemove} />
                </div>
            </div>

            <Field
                label={statementLabel}
                error={err('statement')}
                hint={q.type === 'fill_blanks' ? 'Coloque cada resposta entre colchetes duplos: [[resposta]]. Para aceitar variações use |, ex.: [[SP|São Paulo]].' : undefined}
            >
                <textarea
                    rows={q.type === 'fill_blanks' ? 3 : 2}
                    value={q.statement}
                    onChange={(e) => update({ statement: e.target.value })}
                    className={`${lightInput} resize-y`}
                    placeholder={
                        q.type === 'fill_blanks'
                            ? 'Ex.: A função [[SOMA]] adiciona valores e a função [[MÉDIA]] calcula a média.'
                            : q.type === 'true_false'
                              ? 'Ex.: A função PROCV busca valores na vertical.'
                              : q.type === 'ordering'
                                ? 'Ex.: Coloque as etapas na ordem em que devem ser executadas.'
                                : q.type === 'matching'
                                  ? 'Ex.: Associe cada função à sua finalidade.'
                                  : 'Digite a pergunta ou o comando da questão'
                    }
                />
            </Field>

            {q.type === 'fill_blanks' && (
                <div className="mt-3">
                    <BlanksPreview text={q.statement} />
                </div>
            )}

            {OPTION_TYPES.includes(q.type) && <OptionsEditor q={q} update={update} error={optionsError} />}

            {q.type === 'true_false' && (
                <div className="mt-4 space-y-2">
                    <label className={labelClass}>Resposta correta</label>
                    <div className="flex gap-3">
                        {[
                            { v: 'true', label: 'Verdadeiro', icon: 'check' },
                            { v: 'false', label: 'Falso', icon: 'close' },
                        ].map((o) => (
                            <button
                                key={o.v}
                                type="button"
                                onClick={() => update({ expected_answer: o.v })}
                                className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-2xl border-2 font-bold text-sm transition-all ${
                                    q.expected_answer === o.v
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

            {q.type === 'numeric' && (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Resposta correta *" error={err('expected_answer')}>
                        <input inputMode="decimal" value={q.expected_answer} onChange={(e) => update({ expected_answer: e.target.value })} className={`${lightInput} py-2`} placeholder="Ex.: 42,5" />
                    </Field>
                    <Field label="Margem de erro aceita" hint="Ex.: 0,1 aceita 42,4 a 42,6. Deixe vazio para exigir o valor exato." error={err('tolerance')}>
                        <input type="number" min="0" step="any" value={q.tolerance} onChange={(e) => update({ tolerance: e.target.value })} className={`${lightInput} py-2`} placeholder="0" />
                    </Field>
                </div>
            )}

            {(q.type === 'short_answer' || q.type === 'essay') && (
                <Field
                    className="mt-4"
                    label={q.type === 'short_answer' ? 'Respostas aceitas' : 'Critérios / resposta de referência'}
                    hint={
                        q.type === 'short_answer'
                            ? 'Uma por linha. Maiúsculas, acentos e espaços extras são ignorados. Vazio = correção manual.'
                            : 'Usado como referência na correção.'
                    }
                    error={err('expected_answer')}
                >
                    <textarea rows={q.type === 'essay' ? 3 : 2} value={q.expected_answer} onChange={(e) => update({ expected_answer: e.target.value })} className={`${lightInput} resize-y`} />
                </Field>
            )}

            <Field className="mt-4" label="Explicação / feedback (opcional)" error={err('explanation')}>
                <input value={q.explanation} onChange={(e) => update({ explanation: e.target.value })} className={`${lightInput} py-2`} placeholder="Exibida ao aluno após responder" />
            </Field>
        </div>
    );
}

/** Grade de tipos para adicionar uma nova questão. */
function TypePicker({ onPick, onClose }) {
    return (
        <div className="rounded-2xl border-2 border-dashed border-primary/30 p-4 space-y-3">
            <div className="flex items-center justify-between">
                <p className="text-xs font-black uppercase tracking-wide text-[#507c94] dark:text-[#87b3cd]">Escolha o tipo da questão</p>
                <IconButton icon="close" title="Fechar" onClick={onClose} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
                {QUESTION_TYPES.map((t) => (
                    <button
                        key={t.value}
                        type="button"
                        onClick={() => onPick(t.value)}
                        className="flex items-start gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 text-left hover:ring-2 hover:ring-primary/40 transition-all"
                    >
                        <span className="material-symbols-outlined text-primary dark:text-[#00D1FF]">{t.icon}</span>
                        <span>
                            <span className="block text-sm font-bold text-[#003346] dark:text-white">{t.label}</span>
                            <span className="block text-[11px] text-[#507c94]">{t.hint}</span>
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}

function SetCard({ set, index, total, onChange, onMove, onDuplicate, onRemove, errors }) {
    const [collapsed, setCollapsed] = useState(false);
    const [picking, setPicking] = useState(set.questions.length === 0);
    const prefix = `exercise_sets.${index}`;
    const questions = set.questions;
    const points = questions.reduce((sum, q) => sum + (Number(q.points) || 0), 0);
    const hasErrors = Object.keys(errors).some((k) => k.startsWith(`${prefix}.`));

    const setQuestions = (list) => onChange({ ...set, questions: list });
    const updateQuestion = (i, patch) => setQuestions(questions.map((q, idx) => (idx === i ? { ...q, ...patch } : q)));
    const moveQuestion = (i, dir) => {
        const j = i + dir;
        if (j < 0 || j >= questions.length) return;
        const copy = [...questions];
        [copy[i], copy[j]] = [copy[j], copy[i]];
        setQuestions(copy);
    };

    return (
        <div className={`rounded-3xl border-2 ${hasErrors ? 'border-error/40' : 'border-outline-variant/20 dark:border-slate-800'} bg-white/60 dark:bg-slate-900/40 p-5 space-y-4`}>
            <div className="flex items-start gap-3">
                <span className="mt-1 w-10 h-10 shrink-0 rounded-2xl bg-tertiary/10 text-tertiary flex items-center justify-center">
                    <span className="material-symbols-outlined">quiz</span>
                </span>
                <div className="flex-1 min-w-0">
                    <input
                        value={set.title}
                        onChange={(e) => onChange({ ...set, title: e.target.value })}
                        placeholder={`Título do exercício ${index + 1} *`}
                        className="w-full bg-transparent border-none p-0 text-lg font-headline font-extrabold text-[#003346] dark:text-white placeholder:text-[#507c94]/50 focus:ring-0"
                    />
                    <p className="text-[11px] font-bold text-[#507c94] dark:text-[#87b3cd]">
                        {questions.length} questão(ões) · {points} ponto(s)
                    </p>
                    {errors[`${prefix}.title`] && <p className="text-xs text-error mt-1">{errors[`${prefix}.title`]}</p>}
                </div>
                <div className="flex items-center">
                    <IconButton icon={collapsed ? 'expand_more' : 'expand_less'} title={collapsed ? 'Expandir' : 'Recolher'} onClick={() => setCollapsed((c) => !c)} />
                    <IconButton icon="arrow_upward" title="Subir exercício" onClick={() => onMove(-1)} disabled={index === 0} />
                    <IconButton icon="arrow_downward" title="Descer exercício" onClick={() => onMove(1)} disabled={index === total - 1} />
                    <IconButton icon="content_copy" title="Duplicar exercício" onClick={onDuplicate} />
                    <IconButton icon="delete" title="Remover exercício" tone="danger" onClick={onRemove} />
                </div>
            </div>

            {!collapsed && (
                <>
                    <input
                        value={set.description}
                        onChange={(e) => onChange({ ...set, description: e.target.value })}
                        placeholder="Instruções para o aluno (opcional)"
                        className={`${inputClass} py-2`}
                    />

                    {questions.map((q, i) => (
                        <QuestionCard
                            key={q._key}
                            q={q}
                            index={i}
                            total={questions.length}
                            update={(patch) => updateQuestion(i, patch)}
                            onMove={(dir) => moveQuestion(i, dir)}
                            onDuplicate={() => setQuestions([...questions.slice(0, i + 1), cloneQuestion(q), ...questions.slice(i + 1)])}
                            onRemove={() => setQuestions(questions.filter((_, idx) => idx !== i))}
                            err={(field) => errors[`${prefix}.questions.${i}.${field}`]}
                            optionsError={
                                errors[`${prefix}.questions.${i}.options`] ??
                                (Object.keys(errors).some((k) => k.startsWith(`${prefix}.questions.${i}.options.`)) ? 'Preencha o texto de todos os itens.' : undefined)
                            }
                        />
                    ))}

                    {errors[`${prefix}.questions`] && <p className="text-xs text-error">{errors[`${prefix}.questions`]}</p>}

                    {picking ? (
                        <TypePicker
                            onPick={(type) => {
                                setQuestions([...questions, blankQuestion(type)]);
                                setPicking(false);
                            }}
                            onClose={() => setPicking(false)}
                        />
                    ) : (
                        <button
                            type="button"
                            onClick={() => setPicking(true)}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border-2 border-dashed border-outline-variant/30 dark:border-slate-700 text-sm font-bold text-primary dark:text-[#00D1FF] hover:bg-primary/5 hover:border-primary/40 transition-all"
                        >
                            <span className="material-symbols-outlined text-base">add_circle</span>
                            Adicionar questão
                        </button>
                    )}
                </>
            )}
        </div>
    );
}

export default function ExerciseBuilder({ sets, onChange, errors }) {
    const update = (i, value) => onChange(sets.map((s, idx) => (idx === i ? value : s)));
    const move = (i, dir) => {
        const j = i + dir;
        if (j < 0 || j >= sets.length) return;
        const copy = [...sets];
        [copy[i], copy[j]] = [copy[j], copy[i]];
        onChange(copy);
    };
    const duplicate = (i) => {
        const s = sets[i];
        const clone = { ...s, _key: newKey(), id: null, title: `${s.title} (cópia)`, questions: s.questions.map(cloneQuestion) };
        onChange([...sets.slice(0, i + 1), clone, ...sets.slice(i + 1)]);
    };

    const totalQuestions = sets.reduce((sum, s) => sum + s.questions.length, 0);
    const totalPoints = sets.reduce((sum, s) => sum + s.questions.reduce((p, q) => p + (Number(q.points) || 0), 0), 0);

    return (
        <div className="space-y-5">
            {sets.length > 0 && (
                <p className="text-xs font-bold text-[#507c94] dark:text-[#87b3cd]">
                    {sets.length} exercício(s) · {totalQuestions} questão(ões) · {totalPoints} ponto(s) no total
                </p>
            )}

            {sets.map((set, i) => (
                <SetCard
                    key={set._key}
                    set={set}
                    index={i}
                    total={sets.length}
                    onChange={(value) => update(i, value)}
                    onMove={(dir) => move(i, dir)}
                    onDuplicate={() => duplicate(i)}
                    onRemove={() => onChange(sets.filter((_, idx) => idx !== i))}
                    errors={errors}
                />
            ))}

            <button
                type="button"
                onClick={() => onChange([...sets, blankSet()])}
                className="w-full flex items-center justify-center gap-2 px-4 py-4 rounded-2xl kinetic-gradient text-white text-sm font-bold shadow-sm hover:opacity-95"
            >
                <span className="material-symbols-outlined">library_add</span>
                Novo exercício
            </button>
        </div>
    );
}
