import { newKey } from '@/Components/Platform/ExerciseBuilder';
import { Card, Field, IconButton, inputClass, MoneyInput, PageHeader, PrimaryAction } from '@/Components/Platform/UI';
import { brl, useLicensee } from '@/lib/licensee';
import { Head, Link, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';

const ACCESS_PRESETS = [
    { value: '30', label: '30 dias' },
    { value: '90', label: '3 meses' },
    { value: '180', label: '6 meses' },
    { value: '365', label: '1 ano' },
    { value: '730', label: '2 anos' },
    { value: 'lifetime', label: 'Vitalício' },
    { value: 'custom', label: 'Personalizado' },
];

const today = () => new Date().toISOString().slice(0, 10);

const addDays = (dateStr, days) => {
    const d = new Date(`${dateStr}T00:00:00`);
    d.setDate(d.getDate() + Number(days) - 1);
    return d.toLocaleDateString('pt-BR');
};

/** Opção inicial: campanha ativa > tabela padrão > outra tabela > sugerido > valor manual. */
function defaultOption(options) {
    return (
        options.find((o) => o.source === 'campaign') ??
        options.find((o) => o.is_default) ??
        options.find((o) => o.source === 'price_table') ??
        options.find((o) => o.source === 'suggested')
    )?.key ?? 'manual';
}

export default function SaleCreate({ students, courses, priceOptions, paymentMethods, preselectedStudentId }) {
    const { Layout, r } = useLicensee();
    const [studentSearch, setStudentSearch] = useState('');
    const [courseToAdd, setCourseToAdd] = useState('');

    const { data, setData, transform, post, processing, errors } = useForm({
        student_id: preselectedStudentId ?? '',
        payment_method: 'pix',
        installments: 1,
        status: 'paid',
        access_starts_on: today(),
        notes: '',
        items: [],
    });

    const coursesById = useMemo(() => Object.fromEntries(courses.map((c) => [c.id, c])), [courses]);
    const optionsFor = (courseId) => priceOptions[courseId] ?? [];

    const lines = data.items.map((item) => {
        const option = optionsFor(item.course_id).find((o) => o.key === item.price_option);
        const listPrice = item.price_option === 'manual' ? Number(item.manual_price) || 0 : Number(option?.price ?? 0);
        const discount = Math.min(Number(item.discount) || 0, listPrice);
        return { ...item, option, listPrice, discount, total: listPrice - discount };
    });
    const subtotal = lines.reduce((s, l) => s + l.listPrice, 0);
    const discount = lines.reduce((s, l) => s + l.discount, 0);
    const total = subtotal - discount;
    const suggestedMaxInstallments = Math.max(1, ...lines.map((l) => l.option?.max_installments ?? 1));

    const addCourse = (courseId) => {
        if (!courseId || data.items.some((i) => i.course_id === Number(courseId))) return;
        const opts = optionsFor(courseId);
        setData('items', [
            ...data.items,
            { _key: newKey(), course_id: Number(courseId), price_option: defaultOption(opts), manual_price: '', discount: '', access: '365', access_days: '' },
        ]);
        setCourseToAdd('');
    };
    const updateItem = (i, patch) => setData('items', data.items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));

    const submit = (e) => {
        e.preventDefault();
        transform((d) => ({
            ...d,
            items: d.items.map((it) => ({
                course_id: it.course_id,
                price_option: it.price_option,
                manual_price: it.price_option === 'manual' ? it.manual_price : null,
                discount: it.discount || 0,
                access_days: it.access === 'lifetime' ? null : it.access === 'custom' ? it.access_days : Number(it.access),
            })),
        }));
        post(r('sales.store'), { preserveScroll: true });
    };

    const filteredStudents = students.filter((s) =>
        [s.name, s.email, s.phone].filter(Boolean).join(' ').toLowerCase().includes(studentSearch.trim().toLowerCase()),
    );
    const selectedStudent = students.find((s) => s.id === Number(data.student_id));
    const availableCourses = courses.filter((c) => !data.items.some((i) => i.course_id === c.id));

    return (
        <Layout>
            <Head title="Nova venda" />

            <form onSubmit={submit} className="max-w-7xl mx-auto p-8 space-y-6 animate-in fade-in duration-700 pb-16">
                <PageHeader
                    breadcrumb={[{ label: 'Vendas', href: r('sales.index') }, { label: 'Nova venda' }]}
                    title="Nova Venda"
                    subtitle="Escolha o aluno, os cursos, o preço e por quanto tempo o curso ficará disponível"
                />

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                    <div className="xl:col-span-8 space-y-6">
                        {/* Aluno */}
                        <Card
                            icon="person"
                            title="Aluno"
                            actions={
                                <Link href={r('students.create')} className="text-xs font-bold text-primary dark:text-[#00D1FF] hover:underline whitespace-nowrap">
                                    + Cadastrar aluno
                                </Link>
                            }
                        >
                            {selectedStudent ? (
                                <div className="flex items-center gap-4 bg-primary/5 rounded-2xl px-4 py-3">
                                    <div className="w-11 h-11 rounded-xl kinetic-gradient text-white flex items-center justify-center font-black">
                                        {selectedStudent.name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-[#003346] dark:text-white">{selectedStudent.name}</p>
                                        <p className="text-xs text-[#507c94]">{[selectedStudent.email, selectedStudent.phone].filter(Boolean).join(' · ')}</p>
                                    </div>
                                    <button type="button" onClick={() => setData('student_id', '')} className="text-xs font-bold text-primary hover:underline">
                                        Trocar
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <input value={studentSearch} onChange={(e) => setStudentSearch(e.target.value)} className={`${inputClass} mb-3`} placeholder="Pesquisar aluno por nome, e-mail ou telefone..." />
                                    <div className="max-h-64 overflow-y-auto space-y-1 pr-1">
                                        {filteredStudents.map((s) => (
                                            <button
                                                key={s.id}
                                                type="button"
                                                onClick={() => setData('student_id', s.id)}
                                                className="w-full flex items-center gap-3 text-left px-4 py-2.5 rounded-xl hover:bg-primary/5 transition"
                                            >
                                                <span className="material-symbols-outlined text-primary">person</span>
                                                <span className="flex-1 min-w-0">
                                                    <span className="block text-sm font-bold text-[#003346] dark:text-white truncate">{s.name}</span>
                                                    <span className="block text-[11px] text-[#507c94] truncate">{s.email}</span>
                                                </span>
                                            </button>
                                        ))}
                                        {filteredStudents.length === 0 && (
                                            <p className="text-sm text-[#507c94] text-center py-6">
                                                {students.length === 0 ? 'Você ainda não tem alunos cadastrados.' : 'Nenhum aluno encontrado.'}
                                            </p>
                                        )}
                                    </div>
                                </>
                            )}
                            {errors.student_id && <p className="text-xs text-error mt-2">{errors.student_id}</p>}
                        </Card>

                        {/* Cursos */}
                        <Card icon="auto_stories" title="Cursos da venda" description="Cada curso tem seu preço e seu tempo de acesso">
                            <div className="flex gap-3 mb-5">
                                <select value={courseToAdd} onChange={(e) => addCourse(e.target.value)} className={`${inputClass} flex-1`}>
                                    <option value="">+ Adicionar curso...</option>
                                    {availableCourses.map((c) => (
                                        <option key={c.id} value={c.id}>{c.title}</option>
                                    ))}
                                </select>
                            </div>

                            {lines.length === 0 && (
                                <p className="text-sm text-[#507c94] text-center py-10 bg-surface/50 dark:bg-slate-950/50 rounded-2xl">Adicione os cursos que o aluno está comprando.</p>
                            )}

                            <div className="space-y-4">
                                {lines.map((line, i) => {
                                    const course = coursesById[line.course_id];
                                    const opts = optionsFor(line.course_id);
                                    const err = (f) => errors[`items.${i}.${f}`];
                                    return (
                                        <div key={line._key} className="rounded-2xl border border-outline-variant/20 dark:border-slate-800 bg-surface/50 dark:bg-slate-950/50 p-5 space-y-4">
                                            <div className="flex items-start gap-3">
                                                <span className="material-symbols-outlined text-primary mt-0.5">auto_stories</span>
                                                <div className="flex-1">
                                                    <p className="font-headline font-bold text-[#003346] dark:text-white">{course?.title}</p>
                                                    <p className="text-[11px] text-[#507c94]">{[course?.category, course?.workload_hours && `${course.workload_hours}h`].filter(Boolean).join(' · ')}</p>
                                                </div>
                                                <p className="text-lg font-black text-primary dark:text-[#00D1FF] tabular-nums">{brl(line.total)}</p>
                                                <IconButton icon="delete" title="Remover curso" tone="danger" onClick={() => setData('items', data.items.filter((_, idx) => idx !== i))} />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                                <Field label="Preço" className="md:col-span-6" error={err('price_option') || err('manual_price')}>
                                                    <select value={line.price_option} onChange={(e) => updateItem(i, { price_option: e.target.value })} className={inputClass}>
                                                        {opts.map((o) => (
                                                            <option key={o.key} value={o.key}>
                                                                {o.label} — {brl(o.price)}
                                                                {o.max_installments > 1 ? ` (até ${o.max_installments}x)` : ' (à vista)'}
                                                            </option>
                                                        ))}
                                                        <option value="manual">Valor negociado (manual)</option>
                                                    </select>
                                                </Field>
                                                {line.price_option === 'manual' ? (
                                                    <Field label="Valor" className="md:col-span-3">
                                                        <MoneyInput value={line.manual_price} onChange={(v) => updateItem(i, { manual_price: v })} placeholder="0,00" />
                                                    </Field>
                                                ) : (
                                                    <div className="md:col-span-3" />
                                                )}
                                                <Field label="Desconto" className="md:col-span-3" error={err('discount')}>
                                                    <MoneyInput value={line.discount} onChange={(v) => updateItem(i, { discount: v })} placeholder="0,00" />
                                                </Field>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold text-[#507c94] dark:text-[#87b3cd] uppercase tracking-wide mb-2">
                                                    Disponível para o aluno por *
                                                </label>
                                                <div className="flex flex-wrap items-center gap-2">
                                                    {ACCESS_PRESETS.map((p) => (
                                                        <button
                                                            key={p.value}
                                                            type="button"
                                                            onClick={() => updateItem(i, { access: p.value })}
                                                            className={`px-3 py-2 rounded-xl text-xs font-bold border-2 transition-all ${
                                                                line.access === p.value
                                                                    ? 'border-primary dark:border-[#00D1FF] bg-primary/5 text-primary dark:text-[#00D1FF]'
                                                                    : 'border-transparent bg-white dark:bg-slate-900 text-[#003346] dark:text-white hover:text-primary'
                                                            }`}
                                                        >
                                                            {p.label}
                                                        </button>
                                                    ))}
                                                    {line.access === 'custom' && (
                                                        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 rounded-xl px-3 py-1.5">
                                                            <input
                                                                type="number"
                                                                min="1"
                                                                value={line.access_days}
                                                                onChange={(e) => updateItem(i, { access_days: e.target.value })}
                                                                className="w-20 bg-transparent border-none p-0 text-sm font-bold text-[#003346] dark:text-white focus:ring-0"
                                                                placeholder="dias"
                                                            />
                                                            <span className="text-xs font-bold text-[#507c94]">dias</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="text-[11px] font-bold text-[#507c94] mt-2 flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-sm">event_available</span>
                                                    {line.access === 'lifetime'
                                                        ? 'Acesso sem data de término'
                                                        : (line.access === 'custom' ? Number(line.access_days) : Number(line.access)) > 0
                                                          ? `Acesso de ${new Date(`${data.access_starts_on}T00:00:00`).toLocaleDateString('pt-BR')} até ${addDays(
                                                                data.access_starts_on,
                                                                line.access === 'custom' ? line.access_days : line.access,
                                                            )}`
                                                          : 'Informe a quantidade de dias'}
                                                </p>
                                                {err('access_days') && <p className="text-xs text-error mt-1">{err('access_days')}</p>}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            {errors.items && <p className="text-xs text-error mt-3">{errors.items}</p>}
                        </Card>
                    </div>

                    {/* Resumo */}
                    <div className="xl:col-span-4 xl:sticky xl:top-24 space-y-6">
                        <Card icon="receipt_long" iconTone="tertiary" title="Pagamento">
                            <div className="space-y-4">
                                <Field label="Forma de pagamento" error={errors.payment_method}>
                                    <select value={data.payment_method} onChange={(e) => setData('payment_method', e.target.value)} className={inputClass}>
                                        {Object.entries(paymentMethods).map(([k, v]) => (
                                            <option key={k} value={k}>{v}</option>
                                        ))}
                                    </select>
                                </Field>
                                <Field
                                    label="Parcelas"
                                    error={errors.installments}
                                    hint={total > 0 && data.installments > 1 ? `${data.installments}x de ${brl(total / data.installments)}` : undefined}
                                >
                                    <select value={data.installments} onChange={(e) => setData('installments', Number(e.target.value))} className={inputClass}>
                                        {Array.from({ length: 24 }, (_, i) => i + 1).map((n) => (
                                            <option key={n} value={n}>
                                                {n === 1 ? 'À vista' : `${n}x`}
                                                {n > suggestedMaxInstallments ? ' (acima da tabela)' : ''}
                                            </option>
                                        ))}
                                    </select>
                                </Field>
                                <Field label="Início do acesso" error={errors.access_starts_on}>
                                    <input type="date" value={data.access_starts_on} onChange={(e) => setData('access_starts_on', e.target.value)} className={inputClass} />
                                </Field>
                                <Field label="Situação">
                                    <div className="grid grid-cols-2 gap-2">
                                        {[
                                            { v: 'paid', label: 'Pago', icon: 'check_circle' },
                                            { v: 'pending', label: 'A receber', icon: 'hourglass_top' },
                                        ].map((o) => (
                                            <button
                                                key={o.v}
                                                type="button"
                                                onClick={() => setData('status', o.v)}
                                                className={`flex items-center justify-center gap-1 p-3 rounded-xl border-2 text-xs font-bold transition-all ${
                                                    data.status === o.v ? 'border-primary bg-primary/5 text-primary' : 'border-transparent bg-surface dark:bg-slate-950 text-[#003346] dark:text-white'
                                                }`}
                                            >
                                                <span className="material-symbols-outlined text-base">{o.icon}</span>
                                                {o.label}
                                            </button>
                                        ))}
                                    </div>
                                    <p className="text-[11px] text-[#507c94] mt-1">
                                        {data.status === 'paid' ? 'O acesso é liberado assim que a venda for salva.' : 'O acesso é liberado quando o pagamento for confirmado.'}
                                    </p>
                                </Field>
                                <Field label="Observações">
                                    <textarea rows="2" value={data.notes} onChange={(e) => setData('notes', e.target.value)} className={`${inputClass} resize-none`} />
                                </Field>
                            </div>
                        </Card>

                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-outline-variant/10 dark:border-slate-800 space-y-3">
                            <div className="flex justify-between text-sm text-[#507c94]"><span>Subtotal</span><span className="tabular-nums">{brl(subtotal)}</span></div>
                            <div className="flex justify-between text-sm text-[#507c94]"><span>Descontos</span><span className="tabular-nums">− {brl(discount)}</span></div>
                            <div className="flex justify-between items-end pt-3 border-t border-outline-variant/10 dark:border-slate-800">
                                <span className="font-bold text-[#003346] dark:text-white">Total</span>
                                <span className="text-3xl font-black text-primary dark:text-[#00D1FF] font-headline tabular-nums">{brl(total)}</span>
                            </div>
                            <PrimaryAction type="submit" icon="point_of_sale" disabled={processing || !data.student_id || lines.length === 0}>
                                Registrar venda
                            </PrimaryAction>
                        </div>
                    </div>
                </div>
            </form>
        </Layout>
    );
}
