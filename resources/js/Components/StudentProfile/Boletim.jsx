import { formatDateTime } from '@/lib/licensee';

/* Boletim real: resultado do aluno em cada exercício dos seus cursos. */

const metric = 'bg-[#eff8ff]/40 dark:bg-slate-950 p-4 rounded-2xl border border-outline-variant/5 dark:border-slate-800/40 text-center flex flex-col justify-center relative';

function situation(r) {
    if (r.answered === 0) return ['Não iniciado', 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'];
    if (r.answered < r.questions) return ['Em andamento', 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'];
    if (r.pending > 0) return ['Aguardando correção', 'bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300'];
    return ['Concluído', 'bg-[#e6f4ea] text-[#137333] dark:bg-emerald-950/60 dark:text-[#6bfe9c]'];
}

function CourseReport({ course }) {
    const rep = course.report;

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h4 className="font-headline font-bold text-[#003346] dark:text-white">{course.title}</h4>
                <span className="text-xs text-[#507c94]">
                    {rep.answered}/{rep.questions} questões respondidas
                </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className={metric}>
                    <span className="text-[10px] text-[#507c94] dark:text-[#87b3cd] uppercase tracking-wider font-bold">Acerto</span>
                    <span className="text-2xl font-black text-primary dark:text-[#00D1FF] font-headline mt-1">{rep.score_pct === null ? '—' : `${rep.score_pct}%`}</span>
                </div>
                <div className={metric}>
                    <span className="text-[10px] text-[#507c94] dark:text-[#87b3cd] uppercase tracking-wider font-bold">Pontos</span>
                    <span className="text-2xl font-black text-primary dark:text-[#00D1FF] font-headline mt-1 tabular-nums">
                        {Number(rep.score)}/{rep.max_score}
                    </span>
                </div>
                <div className={metric}>
                    <span className="text-[10px] text-[#507c94] dark:text-[#87b3cd] uppercase tracking-wider font-bold">Progresso no curso</span>
                    <span className="text-2xl font-black text-primary dark:text-[#00D1FF] font-headline mt-1">{course.percent}%</span>
                </div>
                <div className={metric}>
                    <span className="text-[10px] text-[#507c94] dark:text-[#87b3cd] uppercase tracking-wider font-bold">Aguardando correção</span>
                    <span className={`text-2xl font-black font-headline mt-1 ${rep.pending ? 'text-amber-600' : 'text-primary dark:text-[#00D1FF]'}`}>{rep.pending}</span>
                </div>
            </div>

            {rep.rows.length ? (
                <div className="overflow-x-auto rounded-2xl border border-outline-variant/10 dark:border-slate-850 shadow-sm">
                    <table className="w-full text-left border-collapse min-w-[760px]">
                        <thead>
                            <tr className="bg-[#eff8ff]/45 dark:bg-slate-950/60 border-b border-outline-variant/10 dark:border-slate-850 text-[10px] text-[#507c94] dark:text-[#87b3cd] font-black uppercase tracking-wider">
                                <th className="px-4 py-3">Exercício</th>
                                <th className="px-4 py-3">Respondidas</th>
                                <th className="px-4 py-3">Acertos</th>
                                <th className="px-4 py-3">Pontos</th>
                                <th className="px-4 py-3">Tentativas</th>
                                <th className="px-4 py-3">Última resposta</th>
                                <th className="px-4 py-3">Situação</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rep.rows.map((r) => {
                                const [label, cls] = situation(r);
                                return (
                                    <tr key={r.key} className="border-b border-outline-variant/5 dark:border-slate-850 last:border-0 text-sm">
                                        <td className="px-4 py-3">
                                            <p className="font-bold text-[#003346] dark:text-white">{r.title}</p>
                                            {r.module_title && <p className="text-[11px] text-[#507c94]">{r.module_title}</p>}
                                        </td>
                                        <td className="px-4 py-3 tabular-nums text-[#003346] dark:text-white">
                                            {r.answered}/{r.questions}
                                        </td>
                                        <td className="px-4 py-3 tabular-nums text-[#003346] dark:text-white">{r.answered ? r.correct : '—'}</td>
                                        <td className="px-4 py-3 tabular-nums text-[#003346] dark:text-white">
                                            {r.answered ? `${Number(r.score)}/${r.max_score}` : '—'}
                                            {r.score_pct !== null && <span className="text-[11px] text-[#507c94]"> ({r.score_pct}%)</span>}
                                        </td>
                                        <td className={`px-4 py-3 tabular-nums ${r.attempts >= 3 ? 'text-amber-600 font-bold' : 'text-[#003346] dark:text-white'}`} title={r.attempts >= 3 ? 'Muitas tentativas podem indicar dificuldade' : undefined}>
                                            {r.attempts ?? '—'}
                                        </td>
                                        <td className="px-4 py-3 text-xs text-[#507c94] tabular-nums">{formatDateTime(r.last_answer_at)}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap ${cls}`}>{label}</span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-sm text-[#507c94]">Este curso não tem exercícios.</p>
            )}
        </div>
    );
}

export default function Boletim({ insights }) {
    const courses = insights?.courses ?? [];

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h3 className="font-headline font-bold text-lg text-[#003346] dark:text-white">Boletim de exercícios</h3>
                    <p className="text-xs text-[#507c94] dark:text-[#87b3cd]">Resultado do aluno em cada exercício dos cursos liberados. Tentativas = média de envios por questão.</p>
                </div>
                <button
                    type="button"
                    onClick={() => window.print()}
                    className="border border-outline-variant/15 dark:border-slate-800 text-[#003346] dark:text-[#87b3cd] hover:bg-slate-50 dark:hover:bg-slate-850 px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all select-none active:scale-95"
                >
                    <span className="material-symbols-outlined text-md">print</span>
                    <span>Imprimir</span>
                </button>
            </div>

            {courses.length ? (
                courses.map((c) => <CourseReport key={c.id} course={c} />)
            ) : (
                <p className="text-sm text-[#507c94] py-8 text-center">O aluno ainda não tem cursos liberados.</p>
            )}
        </div>
    );
}
