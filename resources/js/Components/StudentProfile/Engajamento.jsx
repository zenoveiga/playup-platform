import { formatDate, formatDateTime, formatDuration } from '@/lib/licensee';
import { Link } from '@inertiajs/react';
import { useState } from 'react';

/* Engajamento do aluno: situação, indicadores, estudo diário e ritmo por curso. */

const STATUS = {
    engaged: { icon: 'check_circle', className: 'bg-[#e6f4ea] text-[#137333] border-emerald-500/20 dark:bg-emerald-950/60 dark:text-[#6bfe9c]' },
    attention: { icon: 'warning', className: 'bg-amber-50 text-amber-800 border-amber-300/40 dark:bg-amber-950/50 dark:text-amber-300' },
    risk: { icon: 'error', className: 'bg-red-50 text-[#b31b25] border-red-300/40 dark:bg-red-950/50 dark:text-red-300' },
    none: { icon: 'info', className: 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800' },
};

const tile = 'bg-[#eff8ff]/40 dark:bg-slate-950 p-4 rounded-2xl border border-outline-variant/5 dark:border-slate-800/40 relative';

function Kpi({ icon, label, value, hint }) {
    return (
        <div className={tile}>
            <span className="material-symbols-outlined absolute top-3 right-3 text-primary dark:text-[#00D1FF] text-base opacity-60">{icon}</span>
            <span className="text-[10px] text-[#507c94] dark:text-[#87b3cd] uppercase tracking-wider font-bold">{label}</span>
            <p className="text-2xl font-black text-[#003346] dark:text-white font-headline mt-1 tabular-nums">{value}</p>
            {hint && <p className="text-[11px] text-[#507c94] dark:text-[#87b3cd] mt-0.5">{hint}</p>}
        </div>
    );
}

const sinceText = (days) => (days === null ? 'Nunca acessou' : days === 0 ? 'Hoje' : days === 1 ? 'Ontem' : `Há ${days} dias`);

/** Barras de minutos por dia (série única, sem legenda; detalhe no hover). */
function DailyChart({ daily }) {
    const [hover, setHover] = useState(null);
    const minutes = daily.map((d) => Math.round(d.seconds / 60));
    const max = Math.max(...minutes, 1);
    const top = Math.max(5, Math.ceil(max / 5) * 5);
    const total = minutes.reduce((a, b) => a + b, 0);

    return (
        <div className="space-y-3">
            <div className="flex items-end justify-between gap-4">
                <div>
                    <h4 className="font-headline font-bold text-[#003346] dark:text-white">Minutos estudados por dia</h4>
                    <p className="text-xs text-[#507c94] dark:text-[#87b3cd]">Últimos 30 dias · {total} min no período</p>
                </div>
                <p className="text-xs font-bold text-[#507c94] dark:text-[#87b3cd] tabular-nums h-4">
                    {hover !== null && `${formatDate(daily[hover].date)} · ${minutes[hover]} min`}
                </p>
            </div>
            <div className="relative h-36 pl-8" role="img" aria-label={`Minutos estudados por dia nos últimos 30 dias, total de ${total} minutos`}>
                {/* Grade recessiva */}
                {[top, top / 2, 0].map((v, i) => (
                    <div key={i} className="absolute left-8 right-0 border-t border-dashed border-outline-variant/20 dark:border-slate-800" style={{ top: `${(i / 2) * 100}%` }}>
                        <span className="absolute -left-8 -translate-y-1/2 text-[10px] text-[#507c94] tabular-nums w-6 text-right">{v}</span>
                    </div>
                ))}
                <div className="absolute left-8 right-0 inset-y-0 flex items-end gap-[2px]">
                    {minutes.map((m, i) => (
                        <div
                            key={daily[i].date}
                            className="flex-1 h-full flex items-end cursor-default"
                            onMouseEnter={() => setHover(i)}
                            onMouseLeave={() => setHover(null)}
                            title={`${formatDate(daily[i].date)}: ${m} min`}
                        >
                            <div
                                className={`w-full rounded-t-[4px] transition-colors ${hover === i ? 'bg-[#003da6] dark:bg-[#66e3ff]' : 'bg-primary dark:bg-[#00D1FF]'}`}
                                style={{ height: m ? `${Math.max(3, (m / top) * 100)}%` : 0 }}
                            />
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex justify-between pl-8 text-[10px] text-[#507c94] tabular-nums">
                {[0, 7, 14, 21, 29].map((i) => (
                    <span key={i}>{formatDate(daily[i].date).slice(0, 5)}</span>
                ))}
            </div>
        </div>
    );
}

function PaceCard({ course, detailHref }) {
    const flag = course.will_miss
        ? { text: 'Risco de não concluir no prazo', className: 'bg-red-50 text-[#b31b25] dark:bg-red-950/50 dark:text-red-300', icon: 'error' }
        : course.behind
          ? { text: 'Abaixo do ritmo', className: 'bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300', icon: 'warning' }
          : course.percent === 100
            ? { text: 'Concluído', className: 'bg-[#e6f4ea] text-[#137333] dark:bg-emerald-950/60 dark:text-[#6bfe9c]', icon: 'check_circle' }
            : course.access_status === 'active'
              ? { text: 'No ritmo', className: 'bg-[#e6f4ea] text-[#137333] dark:bg-emerald-950/60 dark:text-[#6bfe9c]', icon: 'check_circle' }
              : { text: course.access_status === 'expired' ? 'Acesso encerrado' : 'Acesso agendado', className: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300', icon: 'schedule' };

    return (
        <div className="rounded-2xl border border-outline-variant/10 dark:border-slate-800 p-5 space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <p className="font-headline font-bold text-[#003346] dark:text-white">{course.title}</p>
                    <p className="text-[11px] text-[#507c94] dark:text-[#87b3cd]">
                        Acesso {formatDate(course.starts_at)} {course.expires_at ? `até ${formatDate(course.expires_at)}` : '· vitalício'} · {formatDuration(course.time_spent)} de estudo
                    </p>
                </div>
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${flag.className}`}>
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>{flag.icon}</span>
                    {flag.text}
                </span>
            </div>

            <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                    <span className="text-[#003346] dark:text-white">
                        {course.completed} de {course.total} aulas · <span className="text-primary dark:text-[#00D1FF]">{course.percent}%</span>
                    </span>
                    {course.expected_percent !== null && <span className="text-[#507c94]">Esperado hoje: ~{course.expected_percent}%</span>}
                </div>
                <div className="relative h-3 rounded-full bg-surface-container dark:bg-slate-800">
                    <div className="h-full rounded-full kinetic-gradient" style={{ width: `${course.percent}%` }} />
                    {course.expected_percent !== null && (
                        <div className="absolute -top-1 -bottom-1 w-0.5 bg-[#003346] dark:bg-white rounded" style={{ left: `${course.expected_percent}%` }} title={`Esperado: ${course.expected_percent}%`} />
                    )}
                </div>
                {course.expected_percent !== null && (
                    <p className="text-[10px] text-[#507c94] flex items-center gap-1">
                        <span className="inline-block w-0.5 h-3 bg-[#003346] dark:bg-white rounded" /> marca onde o aluno deveria estar, pelo tempo de acesso que já passou
                    </p>
                )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#507c94] dark:text-[#87b3cd]">
                <span>
                    {course.percent === 100
                        ? 'Curso concluído.'
                        : course.projected_end
                          ? `No ritmo atual, conclui em ${formatDate(course.projected_end)}.`
                          : course.percent === 0
                            ? 'Ainda sem aulas concluídas para projetar o término.'
                            : ''}
                    {course.videos_watched_pct !== null && ` Assiste em média ${course.videos_watched_pct}% de cada vídeo.`}
                </span>
                {detailHref && (
                    <Link href={detailHref} className="font-bold text-primary dark:text-[#00D1FF] hover:underline inline-flex items-center gap-0.5">
                        Ver aula por aula
                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                    </Link>
                )}
            </div>
        </div>
    );
}

export default function Engajamento({ student, insights, routePrefix }) {
    if (!insights) return null;
    const { overview: o, status, daily, courses } = insights;
    const st = STATUS[status.level] ?? STATUS.none;

    return (
        <div className="space-y-6">
            <div className={`rounded-2xl border px-5 py-4 flex items-start gap-3 ${st.className}`}>
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>{st.icon}</span>
                <div>
                    <p className="font-headline font-extrabold">{status.label}</p>
                    {status.reasons.length > 0 && (
                        <ul className="text-sm mt-1 space-y-0.5">
                            {status.reasons.map((r, i) => (
                                <li key={i}>• {r}</li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
                <Kpi icon="donut_large" label="Progresso geral" value={`${o.percent}%`} hint={`${o.completed} de ${o.total} aulas`} />
                <Kpi icon="schedule" label="Estudo em 7 dias" value={formatDuration(o.time_7d)} hint={`${formatDuration(o.time_30d)} em 30 dias`} />
                <Kpi icon="history" label="Último acesso" value={sinceText(o.days_since_access)} hint={o.last_seen_at ? formatDateTime(o.last_seen_at) : null} />
                <Kpi icon="calendar_month" label="Dias ativos (30d)" value={o.active_days_30d} hint={o.streak ? `${o.streak} dia(s) seguidos` : 'Sem sequência atual'} />
                <Kpi icon="task_alt" label="Acerto exercícios" value={o.score_pct === null ? '—' : `${o.score_pct}%`} hint={`${o.answered} questão(ões) respondida(s)`} />
                <Kpi icon="smart_display" label="Vídeos assistidos" value={o.videos_watched_pct === null ? '—' : `${o.videos_watched_pct}%`} hint="Média de cada vídeo" />
            </div>

            <div className="rounded-2xl border border-outline-variant/10 dark:border-slate-800 p-5">
                <DailyChart daily={daily} />
            </div>

            <div className="space-y-3">
                <h4 className="font-headline font-bold text-[#003346] dark:text-white">Ritmo por curso</h4>
                {courses.length ? (
                    courses.map((c) => (
                        <PaceCard key={c.id} course={c} detailHref={route(`${routePrefix}engagement.student`, { course: c.id, student: student.id })} />
                    ))
                ) : (
                    <p className="text-sm text-[#507c94]">O aluno ainda não tem cursos liberados.</p>
                )}
            </div>
        </div>
    );
}
