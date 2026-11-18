import { Card, EmptyState, PageHeader } from '@/Components/Platform/UI';
import { ACCESS_STATUS, formatDateTime, formatDuration, LESSON_TYPES, useLicensee } from '@/lib/licensee';
import { Head, Link, router } from '@inertiajs/react';

/* Progresso dos alunos por curso e engajamento em cada aula (vídeos, aplicação, exercícios). */

function Bar({ value, tone = 'kinetic-gradient', className = 'h-2' }) {
    return (
        <div className={`${className} w-full rounded-full bg-surface-container dark:bg-slate-800 overflow-hidden`}>
            <div className={`h-full rounded-full ${value >= 100 ? 'bg-[#006a35]' : tone}`} style={{ width: `${Math.min(100, value)}%` }} />
        </div>
    );
}

function CourseTile({ course, active, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`text-left rounded-3xl p-5 border-2 transition-all ${
                active ? 'border-primary bg-primary/5 dark:bg-primary/10' : 'border-transparent bg-white dark:bg-slate-900 hover:border-primary/30 shadow-sm'
            }`}
        >
            <p className="font-headline font-bold text-[#003346] dark:text-white leading-tight line-clamp-2">{course.title}</p>
            <p className="text-[11px] font-bold text-[#507c94] mt-1">
                {course.students} aluno(s) · {course.started} iniciaram · {course.finished} concluíram
            </p>
            <div className="mt-4 flex items-center gap-3">
                <Bar value={course.avg_percent} />
                <span className="text-sm font-black text-primary dark:text-[#00D1FF] tabular-nums">{course.avg_percent}%</span>
            </div>
            <p className="text-[11px] text-[#507c94] mt-2 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">schedule</span>
                {formatDuration(course.time_spent)} de estudo no total
            </p>
        </button>
    );
}

function LessonRow({ lesson, students }) {
    const type = LESSON_TYPES[lesson.type];
    return (
        <tr className="border-t border-outline-variant/10 dark:border-slate-800">
            <td className="py-3 pr-4">
                <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 shrink-0 rounded-xl flex items-center justify-center ${type.className}`}>
                        <span className="material-symbols-outlined text-base">{type.icon}</span>
                    </span>
                    <div className="min-w-0">
                        <p className="text-sm font-bold text-[#003346] dark:text-white truncate">{lesson.title}</p>
                        <p className="text-[11px] text-[#507c94]">{type.label} · {lesson.subtitle}</p>
                    </div>
                </div>
            </td>
            <td className="py-3 pr-4 text-sm tabular-nums text-[#003346] dark:text-white whitespace-nowrap">
                {lesson.viewers}/{students}
            </td>
            <td className="py-3 pr-4 w-40">
                <div className="flex items-center gap-2">
                    <Bar value={lesson.completion_rate} className="h-1.5" />
                    <span className="text-xs font-bold tabular-nums text-[#507c94] w-9 text-right">{lesson.completion_rate}%</span>
                </div>
            </td>
            <td className="py-3 pr-4 text-sm tabular-nums text-[#003346] dark:text-white whitespace-nowrap">{lesson.viewers ? formatDuration(lesson.avg_time) : '—'}</td>
            <td className="py-3 text-sm tabular-nums text-[#003346] dark:text-white whitespace-nowrap">
                {lesson.type === 'video' && lesson.viewers ? `${lesson.avg_watched_pct}% assistido` : lesson.type === 'exercise_set' && lesson.avg_score_pct !== null && lesson.viewers ? `${lesson.avg_score_pct}% de acerto` : '—'}
            </td>
        </tr>
    );
}

export default function EngagementIndex({ courses, selected }) {
    const { Layout, r } = useLicensee();

    // Agrupa as aulas por módulo.
    const groups = [];
    for (const l of selected?.lessons ?? []) {
        const g = groups.at(-1);
        if (g && g.title === l.module_title) g.items.push(l);
        else groups.push({ title: l.module_title, items: [l] });
    }

    return (
        <Layout>
            <Head title="Engajamento" />
            <div className="max-w-7xl mx-auto p-8 space-y-6 animate-in fade-in duration-700">
                <PageHeader title="Engajamento" subtitle="Progresso dos seus alunos e tempo dedicado a cada vídeo, atividade e exercício." />

                {courses.length === 0 ? (
                    <Card>
                        <EmptyState icon="monitoring" title="Nenhum aluno matriculado ainda" description="Assim que seus alunos tiverem cursos liberados, o progresso de cada um aparecerá aqui." />
                    </Card>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                            {courses.map((c) => (
                                <CourseTile
                                    key={c.id}
                                    course={c}
                                    active={selected?.course.id === c.id}
                                    onClick={() => router.get(r('engagement.index'), { curso: c.id }, { preserveScroll: true, preserveState: true, only: ['selected'] })}
                                />
                            ))}
                        </div>

                        {selected && (
                            <>
                                <Card icon="groups" title={`Alunos · ${selected.course.title}`} description="Clique em um aluno para ver o detalhe por aula">
                                    <div className="overflow-x-auto -mx-2 px-2">
                                        <table className="w-full min-w-[720px]">
                                            <thead>
                                                <tr className="text-left text-[10px] font-black uppercase tracking-wider text-[#507c94]">
                                                    <th className="pb-2 pr-4">Aluno</th>
                                                    <th className="pb-2 pr-4 w-56">Progresso</th>
                                                    <th className="pb-2 pr-4">Aulas</th>
                                                    <th className="pb-2 pr-4">Tempo de estudo</th>
                                                    <th className="pb-2 pr-4">Último acesso</th>
                                                    <th className="pb-2" />
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {selected.students.map((s) => (
                                                    <tr key={s.id} className="border-t border-outline-variant/10 dark:border-slate-800 hover:bg-surface/60 dark:hover:bg-slate-950/40">
                                                        <td className="py-3 pr-4">
                                                            <p className="text-sm font-bold text-[#003346] dark:text-white">{s.name}</p>
                                                            <p className="text-[11px] text-[#507c94]">
                                                                {s.email}
                                                                {s.access_status !== 'active' && (
                                                                    <span className={`ml-2 font-bold ${ACCESS_STATUS[s.access_status]?.className ?? ''}`}>· {ACCESS_STATUS[s.access_status]?.label ?? s.access_status}</span>
                                                                )}
                                                            </p>
                                                        </td>
                                                        <td className="py-3 pr-4">
                                                            <div className="flex items-center gap-2">
                                                                <Bar value={s.percent} />
                                                                <span className="text-xs font-black tabular-nums text-primary dark:text-[#00D1FF] w-9 text-right">{s.percent}%</span>
                                                            </div>
                                                        </td>
                                                        <td className="py-3 pr-4 text-sm tabular-nums text-[#003346] dark:text-white">
                                                            {s.completed}/{s.total}
                                                        </td>
                                                        <td className="py-3 pr-4 text-sm tabular-nums text-[#003346] dark:text-white">{s.time_spent ? formatDuration(s.time_spent) : '—'}</td>
                                                        <td className="py-3 pr-4 text-sm tabular-nums text-[#507c94]">{s.last_seen_at ? formatDateTime(s.last_seen_at) : 'Não iniciou'}</td>
                                                        <td className="py-3 text-right">
                                                            <Link
                                                                href={r('engagement.student', { course: selected.course.id, student: s.id })}
                                                                className="text-xs font-bold text-primary dark:text-[#00D1FF] hover:underline inline-flex items-center gap-1"
                                                            >
                                                                Detalhes
                                                                <span className="material-symbols-outlined text-sm">chevron_right</span>
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </Card>

                                <Card icon="insights" iconTone="tertiary" title="Engajamento por aula" description="Quantos alunos acessaram, quantos concluíram e quanto tempo dedicaram em média">
                                    <div className="overflow-x-auto -mx-2 px-2 space-y-6">
                                        {groups.map((g, gi) => (
                                            <div key={gi}>
                                                {g.title && <p className="text-[11px] font-black uppercase tracking-wider text-[#507c94] mb-1">{g.title}</p>}
                                                <table className="w-full min-w-[720px]">
                                                    <thead>
                                                        <tr className="text-left text-[10px] font-black uppercase tracking-wider text-[#507c94]">
                                                            <th className="pb-2 pr-4">Aula</th>
                                                            <th className="pb-2 pr-4">Acessaram</th>
                                                            <th className="pb-2 pr-4">Concluíram</th>
                                                            <th className="pb-2 pr-4">Tempo médio</th>
                                                            <th className="pb-2">Aproveitamento</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {g.items.map((l) => (
                                                            <LessonRow key={l.key} lesson={l} students={selected.students.length} />
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ))}
                                        {groups.length === 0 && <p className="text-sm text-[#507c94]">Este curso ainda não tem aulas.</p>}
                                    </div>
                                </Card>
                            </>
                        )}
                    </>
                )}
            </div>
        </Layout>
    );
}
