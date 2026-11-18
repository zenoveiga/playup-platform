import { Card, PageHeader, StatCard } from '@/Components/Platform/UI';
import { ACCESS_STATUS, formatDate, formatDateTime, formatDuration, LESSON_TYPES, useLicensee } from '@/lib/licensee';
import { Head } from '@inertiajs/react';

/* Detalhe do progresso de um aluno em um curso, aula por aula. */

function LessonStatus({ lesson }) {
    const started = lesson.time_spent > 0 || lesson.views > 0 || (lesson.answered ?? 0) > 0;
    const [label, cls, icon] = lesson.completed
        ? ['Concluída', 'bg-[#cdffd4] text-[#006a35]', 'check_circle']
        : started
          ? ['Em andamento', 'bg-amber-100 text-amber-700', 'pending']
          : ['Não iniciada', 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400', 'radio_button_unchecked'];
    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap ${cls}`}>
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
            {label}
        </span>
    );
}

function detail(l) {
    if (!(l.time_spent > 0 || l.views > 0 || (l.answered ?? 0) > 0 || l.watched > 0)) return '—';
    if (l.type === 'video') return l.watched_pct !== null && l.watched_pct !== undefined ? `${l.watched_pct}% assistido · ${formatDuration(l.watched)} de vídeo` : l.watched ? `${formatDuration(l.watched)} de vídeo` : '—';
    if (l.type === 'exercise_set') return `${l.answered}/${l.questions} respondidas · ${l.score}/${l.max_score} pts`;
    return '—';
}

export default function EngagementStudent({ course, student, access, summary, lessons, materials }) {
    const { Layout, r } = useLicensee();
    const acc = ACCESS_STATUS[access.status];

    const groups = [];
    for (const l of lessons) {
        const g = groups.at(-1);
        if (g && g.title === l.module_title) g.items.push(l);
        else groups.push({ title: l.module_title, items: [l] });
    }

    return (
        <Layout>
            <Head title={`${student.name} · ${course.title}`} />
            <div className="max-w-6xl mx-auto p-8 space-y-6 animate-in fade-in duration-700">
                <PageHeader
                    breadcrumb={[{ label: 'Engajamento', href: r('engagement.index', { curso: course.id }) }, { label: student.name }]}
                    title={student.name}
                    subtitle={`${course.title} · ${student.email}`}
                    actions={
                        acc && (
                            <span className={`text-xs font-bold ${acc.className}`}>
                                {acc.label} · {formatDate(access.starts_at)} {access.expires_at ? `até ${formatDate(access.expires_at)}` : '(vitalício)'}
                            </span>
                        )
                    }
                />

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard label="Progresso" value={`${summary.percent}%`} icon="donut_large" />
                    <StatCard label="Aulas concluídas" value={`${summary.completed}/${summary.total}`} icon="task_alt" tone="tertiary" />
                    <StatCard label="Tempo de estudo" value={formatDuration(summary.time_spent)} icon="schedule" tone="amber" />
                    <StatCard label="Último acesso" value={summary.last_seen_at ? formatDateTime(summary.last_seen_at).split(',')[0] : '—'} hint={summary.last_seen_at ? formatDateTime(summary.last_seen_at).split(', ')[1] : null} icon="history" />
                </div>

                <Card icon="format_list_numbered" title="Aula por aula" description="Tempo com a aula aberta, quanto do vídeo foi assistido e resultado dos exercícios">
                    <div className="overflow-x-auto -mx-2 px-2 space-y-6">
                        {groups.map((g, gi) => (
                            <div key={gi}>
                                {g.title && <p className="text-[11px] font-black uppercase tracking-wider text-[#507c94] mb-1">{g.title}</p>}
                                <table className="w-full min-w-[760px]">
                                    <thead>
                                        <tr className="text-left text-[10px] font-black uppercase tracking-wider text-[#507c94]">
                                            <th className="pb-2 pr-4">Aula</th>
                                            <th className="pb-2 pr-4">Situação</th>
                                            <th className="pb-2 pr-4">Tempo</th>
                                            <th className="pb-2 pr-4">Detalhe</th>
                                            <th className="pb-2 pr-4">Acessos</th>
                                            <th className="pb-2">Último acesso</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {g.items.map((l) => {
                                            const type = LESSON_TYPES[l.type];
                                            return (
                                                <tr key={l.key} className="border-t border-outline-variant/10 dark:border-slate-800">
                                                    <td className="py-3 pr-4">
                                                        <div className="flex items-center gap-3">
                                                            <span className={`w-8 h-8 shrink-0 rounded-xl flex items-center justify-center ${type.className}`}>
                                                                <span className="material-symbols-outlined text-base">{type.icon}</span>
                                                            </span>
                                                            <div className="min-w-0">
                                                                <p className="text-sm font-bold text-[#003346] dark:text-white truncate">{l.title}</p>
                                                                <p className="text-[11px] text-[#507c94]">{type.label} · {l.subtitle}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 pr-4"><LessonStatus lesson={l} /></td>
                                                    <td className="py-3 pr-4 text-sm tabular-nums text-[#003346] dark:text-white whitespace-nowrap">{l.time_spent ? formatDuration(l.time_spent) : '—'}</td>
                                                    <td className="py-3 pr-4 text-xs text-[#507c94]">{detail(l)}</td>
                                                    <td className="py-3 pr-4 text-sm tabular-nums text-[#003346] dark:text-white">{l.views || '—'}</td>
                                                    <td className="py-3 text-xs tabular-nums text-[#507c94] whitespace-nowrap">{formatDateTime(l.last_seen_at)}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card icon="folder_open" iconTone="secondary" title="Materiais de apoio acessados" description="Apostilas, arquivos e links abertos pelo aluno">
                    {materials.length ? (
                        <ul className="divide-y divide-outline-variant/10 dark:divide-slate-800">
                            {materials.map((m, i) => (
                                <li key={i} className="py-3 flex items-center gap-3 text-sm">
                                    <span className="material-symbols-outlined text-secondary">description</span>
                                    <span className="flex-1 font-bold text-[#003346] dark:text-white">{m.title}</span>
                                    <span className="text-xs text-[#507c94]">{m.views} acesso(s) · último em {formatDateTime(m.last_seen_at)}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-[#507c94]">O aluno ainda não abriu nenhum material de apoio.</p>
                    )}
                </Card>
            </div>
        </Layout>
    );
}
