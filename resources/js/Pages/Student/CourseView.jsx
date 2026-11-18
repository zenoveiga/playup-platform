import ExerciseList from '@/Components/Student/ExerciseList';
import VideoNotes from '@/Components/Student/VideoNotes';
import VideoPlayer from '@/Components/Student/VideoPlayer';
import StudentLayout from '@/Layouts/StudentLayout';
import { orderByOutline } from '@/lib/outline';
import useLessonTracker, { postProgress } from '@/lib/useLessonTracker';
import { Head, Link } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';

/* Ambiente do curso adquirido: vídeos, aplicação, materiais de apoio e exercícios. */

const formatDate = (d) => (d ? new Date(`${d}T00:00:00`).toLocaleDateString('pt-BR') : '');

const MATERIAL_ICONS = { video: 'smart_display', document: 'menu_book', link: 'link', file: 'attach_file' };

const exerciseLesson = (set) => ({ key: `es${set.id}`, token: `set:${set.id}`, track: { type: 'exercise_set', id: set.id }, kind: 'exercises', title: set.title, subtitle: `Exercício · ${set.questions.length} questão(ões)`, item: set });

/** Monta a trilha do curso como uma lista de "aulas" navegáveis. */
function buildOutline(course) {
    if (course.structure === 'modular') {
        return course.modules.map((m, mi) => ({
            key: `m${m.id}`,
            title: `Módulo ${mi + 1}: ${m.title}`,
            description: m.description,
            lessons: orderByOutline([
                ...m.videos.map((v) => ({ key: `v${v.id}`, token: `video:${v.id}`, track: { type: 'video', id: v.id }, kind: 'video', title: v.title, subtitle: v.category, minutes: v.duration_minutes, item: v })),
                ...(m.application_instructions
                    ? [{ key: `a${m.id}`, token: 'application', track: { type: 'application', id: m.id }, kind: 'application', title: 'Aplicação', subtitle: 'Atividade prática', minutes: m.application_minutes, item: m }]
                    : []),
                ...m.exercise_sets.map(exerciseLesson),
            ], m.outline),
        }));
    }

    return [
        {
            key: 'free',
            title: 'Conteúdo do curso',
            lessons: orderByOutline([
                ...course.materials.filter((v) => v.type === 'video').map((v) => ({
                    key: `v${v.id}`,
                    token: `material:${v.id}`,
                    track: { type: 'video', id: v.id },
                    kind: v.type === 'video' ? 'video' : 'material',
                    title: v.title,
                    subtitle: v.type === 'video' ? 'Vídeo' : v.type === 'document' ? 'Apostila' : v.type === 'link' ? 'Link' : 'Arquivo',
                    minutes: v.duration_minutes,
                    item: v,
                })),
                ...course.exercise_sets.map(exerciseLesson),
            ], course.outline),
        },
    ];
}

/** Materiais de apoio ficam fora da trilha, num cartão próprio (agrupados por módulo). */
function supportGroups(course) {
    if (course.structure === 'modular') {
        return course.modules
            .map((m, mi) => ({ key: `m${m.id}`, title: `Módulo ${mi + 1}: ${m.title}`, items: m.support }))
            .filter((g) => g.items.length);
    }
    const items = course.materials.filter((m) => m.type !== 'video');
    return items.length ? [{ key: 'free', title: null, items }] : [];
}

// PDFs abrem numa nova aba do navegador; outros arquivos baixam.
const isPdf = (m) => m.mime_type === 'application/pdf' || /\.pdf$/i.test(m.file_name ?? '');
const openIcon = (m) => (m.file_url && !isPdf(m) ? 'download' : 'open_in_new');

const MATERIAL_KIND = { document: 'Apostila', link: 'Link', file: 'Arquivo', video: 'Vídeo' };

function SupportCard({ groups, onOpen }) {
    const [open, setOpen] = useState(false);
    const total = groups.reduce((s, g) => s + g.items.length, 0);
    if (!total) return null;

    return (
        <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-expanded={open}
                className="w-full flex items-center gap-3 p-4 text-left hover:bg-surface-container-low transition-colors"
            >
                <span className="w-9 h-9 shrink-0 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
                    <span className="material-symbols-outlined text-lg">folder_open</span>
                </span>
                <span className="flex-1 min-w-0">
                    <span className="block font-bold text-sm text-on-surface">Materiais de apoio</span>
                    <span className="block text-[11px] text-on-surface-variant">Apostilas, arquivos e links</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-secondary/10 text-secondary text-[11px] font-black tabular-nums">{total}</span>
                <span className={`material-symbols-outlined text-on-surface-variant transition-transform ${open ? 'rotate-180' : ''}`}>expand_more</span>
            </button>
            {open && (
                <div className="px-4 pb-4 space-y-4">
                    {groups.map((g) => (
                        <div key={g.key} className="space-y-1">
                            {g.title && <p className="text-[10px] font-black uppercase tracking-wider text-on-surface-variant px-1 pt-1">{g.title}</p>}
                            {g.items.map((m) => (
                                <a
                                    key={m.id}
                                    href={m.file_url || m.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    onClick={() => onOpen?.(m)}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-container-low transition-colors group"
                                >
                                    <span className="material-symbols-outlined text-primary">{MATERIAL_ICONS[m.type] ?? 'attach_file'}</span>
                                    <span className="flex-1 min-w-0">
                                        <span className="block text-sm text-on-surface truncate group-hover:text-primary">{m.title}</span>
                                        <span className="block text-[11px] text-on-surface-variant truncate">{m.description || (isPdf(m) ? 'PDF · abre em nova aba' : MATERIAL_KIND[m.type] || 'Arquivo')}</span>
                                    </span>
                                    <span className="material-symbols-outlined text-base text-on-surface-variant group-hover:text-primary" title={isPdf(m) ? 'Abrir em nova aba' : m.file_url ? 'Baixar' : 'Abrir link'}>{openIcon(m)}</span>
                                </a>
                            ))}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function MaterialLink({ material }) {
    const href = material.file_url || material.url;
    return (
        <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 p-4 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors"
        >
            <span className="material-symbols-outlined text-primary">{MATERIAL_ICONS[material.type] ?? 'attach_file'}</span>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-on-surface truncate">{material.title}</p>
                {material.description && <p className="text-xs text-on-surface-variant truncate">{material.description}</p>}
            </div>
            <span className="material-symbols-outlined text-on-surface-variant">{openIcon(material)}</span>
        </a>
    );
}

function Player({ lesson, playerRef, courseSlug, answers, onAnswer, onPlayback, notes = [], tracker, completed }) {
    if (!lesson) return null;

    if (lesson.kind === 'video') {
        return (
            <VideoPlayer
                ref={playerRef}
                video={lesson.item}
                markers={notes.filter((n) => n.course_material_id === lesson.item.id).map((n) => ({ id: n.id, time: n.timestamp_seconds, label: n.body }))}
                onTime={(time, duration) => {
                    tracker.onMediaTime(time, duration);
                    onPlayback((p) => (Math.floor(p.time) === Math.floor(time) ? p : { ...p, time }));
                }}
                onPlayState={(paused) => {
                    tracker.onPlayState(paused);
                    onPlayback((p) => (p.paused === paused ? p : { ...p, paused }));
                }}
            />
        );
    }

    const panel = 'w-full min-h-[280px] bg-surface-container-lowest rounded-xl shadow-sm p-4 sm:p-8';

    if (lesson.kind === 'application') {
        return (
            <div className={panel}>
                <div className="flex items-center gap-3 mb-4">
                    <span className="material-symbols-outlined text-3xl text-tertiary">construction</span>
                    <div>
                        <h3 className="font-headline font-bold text-xl text-on-surface">Aplicação prática</h3>
                        <p className="text-xs text-on-surface-variant">Tempo sugerido: {lesson.item.application_minutes} minutos</p>
                    </div>
                </div>
                <p className="text-sm text-on-surface leading-relaxed whitespace-pre-line">{lesson.item.application_instructions}</p>
                <div className="mt-6 flex justify-end">
                    {completed ? (
                        <span className="px-4 py-2 rounded-xl bg-[#cdffd4] text-[#006a35] text-sm font-bold flex items-center gap-1">
                            <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                            Atividade concluída
                        </span>
                    ) : (
                        <button type="button" onClick={tracker.complete} className="kinetic-gradient text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-1">
                            <span className="material-symbols-outlined text-base">task_alt</span>
                            Marcar como concluída
                        </button>
                    )}
                </div>
            </div>
        );
    }

    if (lesson.kind === 'materials') {
        return (
            <div className={panel}>
                <h3 className="font-headline font-bold text-xl text-on-surface mb-4">Materiais de apoio</h3>
                <div className="space-y-2">{lesson.item.map((m) => <MaterialLink key={m.id} material={m} />)}</div>
            </div>
        );
    }

    if (lesson.kind === 'material') {
        return (
            <div className={`${panel} flex flex-col items-center justify-center text-center gap-4`}>
                <span className="material-symbols-outlined text-6xl text-primary">{MATERIAL_ICONS[lesson.item.type] ?? 'attach_file'}</span>
                <h3 className="font-headline font-bold text-xl text-on-surface">{lesson.item.title}</h3>
                {lesson.item.description && <p className="text-sm text-on-surface-variant max-w-md">{lesson.item.description}</p>}
                <a
                    href={lesson.item.file_url || lesson.item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="kinetic-gradient text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2"
                >
                    <span className="material-symbols-outlined">{openIcon(lesson.item)}</span>
                    {isPdf(lesson.item) ? 'Abrir PDF' : lesson.item.file_url ? 'Baixar material' : 'Acessar link'}
                </a>
            </div>
        );
    }

    // exercícios
    return <ExerciseList key={lesson.key} exerciseSet={lesson.item} courseSlug={courseSlug} answers={answers} onAnswer={onAnswer} />;
}

const trackKey = (l) => (l?.track ? `${l.track.type}:${l.track.id}` : null);

const watchedText = (p) => (p?.watched_pct ? `${p.watched_pct}% assistido` : null);

export default function CourseView({ course, access, answers: initialAnswers = {}, notes: initialNotes = [], progress: initialProgress = { lessons: {} } }) {
    const outline = useMemo(() => buildOutline(course), [course]);
    const lessons = outline.flatMap((s) => s.lessons);
    const [progress, setProgress] = useState(initialProgress.lessons ?? {});
    // Abre na última aula acessada; se ela já foi concluída, na próxima aula pendente
    // (assim módulos concluídos ficam recolhidos e o aluno continua de onde parou).
    const [currentKey, setCurrentKey] = useState(() => {
        const done = (l) =>
            l.kind === 'exercises'
                ? l.item.questions.length > 0 && l.item.questions.every((q) => initialAnswers[q.id])
                : !!progress[trackKey(l)]?.completed;
        const last = lessons
            .filter((l) => progress[trackKey(l)]?.last_seen_at)
            .sort((a, b) => progress[trackKey(b)].last_seen_at.localeCompare(progress[trackKey(a)].last_seen_at))[0];
        if (last && !done(last)) return last.key;
        const from = last ? lessons.indexOf(last) : 0;
        const next = lessons.slice(from).find((l) => !done(l)) ?? lessons.find((l) => !done(l));
        return (next ?? last ?? lessons[0])?.key;
    });
    const playerRef = useRef(null);
    const [answers, setAnswers] = useState(initialAnswers);
    const [notes, setNotes] = useState(initialNotes);
    const [playback, setPlayback] = useState({ time: 0, paused: true });
    // Só o módulo da aula atual fica aberto; ao mudar de módulo, os demais recolhem.
    const onlyCurrent = (key) => Object.fromEntries(outline.map((s) => [s.key, s.lessons.some((l) => l.key === key)]));
    const [expanded, setExpanded] = useState(() => onlyCurrent(currentKey));
    const currentSection = outline.find((s) => s.lessons.some((l) => l.key === currentKey))?.key;
    useEffect(() => {
        setExpanded(onlyCurrent(currentKey));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentSection]);

    // Exercício conta como concluído quando todas as questões foram respondidas.
    const isDone = (l) =>
        l.kind === 'exercises' ? l.item.questions.length > 0 && l.item.questions.every((q) => answers[q.id]) : !!progress[trackKey(l)]?.completed;
    const doneCount = lessons.filter(isDone).length;
    const percent = lessons.length ? Math.floor((doneCount / lessons.length) * 100) : 0;

    const index = lessons.findIndex((l) => l.key === currentKey);
    const current = lessons[index];

    const tracker = useLessonTracker(course.slug, current?.track ?? null, (r) =>
        setProgress((p) => ({ ...p, [r.key]: { ...p[r.key], completed: r.completed, time_spent: r.time_spent, watched: r.watched } })),
    );
    const go = (dir) => {
        const next = lessons[index + dir];
        if (!next) return;
        setCurrentKey(next.key);
    };
    // No celular a trilha fica abaixo do player: ao escolher uma aula, volta ao topo.
    const openLesson = (key) => {
        setCurrentKey(key);
        if (window.matchMedia('(max-width: 1023px)').matches) window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <StudentLayout>
            <Head title={`${course.title} | PlayUp Academy`} />

            <div className="p-3 sm:p-6 md:p-8 flex flex-col lg:flex-row gap-4 sm:gap-8">
                <section className="flex-grow min-w-0 flex flex-col gap-4 sm:gap-6 lg:w-2/3">
                    <div className="flex items-center gap-2 text-xs font-bold text-on-surface-variant min-w-0">
                        <Link href={route('student.courses')} className="hover:text-primary shrink-0">Meus Cursos</Link>
                        <span className="material-symbols-outlined text-xs">chevron_right</span>
                        <span className="text-primary truncate">{course.title}</span>
                    </div>

                    {current ? (
                        <Player
                            lesson={current}
                            playerRef={playerRef}
                            courseSlug={course.slug}
                            answers={answers}
                            onAnswer={(result) => setAnswers((a) => ({ ...a, [result.exercise_id]: result }))}
                            onPlayback={setPlayback}
                            notes={notes}
                            tracker={tracker}
                            completed={isDone(current)}
                        />
                    ) : (
                        <div className="w-full aspect-video bg-surface-container-lowest rounded-xl flex items-center justify-center text-on-surface-variant">
                            Este curso ainda não tem conteúdo.
                        </div>
                    )}

                    <div className="bg-surface-container-lowest rounded-xl p-4 sm:p-6 shadow-sm space-y-4">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-primary">{current?.subtitle}</p>
                                <h1 className="text-xl sm:text-2xl font-extrabold font-headline text-on-surface">{current?.title ?? course.title}</h1>
                            </div>
                            <div className="flex gap-2 w-full sm:w-auto">
                                <button
                                    onClick={() => go(-1)}
                                    disabled={index <= 0}
                                    className="flex-1 sm:flex-none justify-center px-4 py-2.5 sm:py-2 rounded-xl bg-surface-container-low font-bold text-sm text-on-surface disabled:opacity-40 flex items-center gap-1"
                                >
                                    <span className="material-symbols-outlined text-base">skip_previous</span>Anterior
                                </button>
                                <button
                                    onClick={() => go(1)}
                                    disabled={index >= lessons.length - 1}
                                    className="flex-1 sm:flex-none justify-center px-4 py-2.5 sm:py-2 rounded-xl gradient-button kinetic-gradient text-white font-bold text-sm disabled:opacity-40 flex items-center gap-1"
                                >
                                    Próxima<span className="material-symbols-outlined text-base">skip_next</span>
                                </button>
                            </div>
                        </div>
                        {current?.kind === 'video' && current.item.description && <p className="text-sm text-on-surface-variant">{current.item.description}</p>}
                        <div className="flex items-center justify-between gap-3 flex-wrap">
                            <p className="text-xs font-bold text-on-surface-variant flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">event_available</span>
                                {access.expires_at ? `Seu acesso vai até ${formatDate(access.expires_at)}` : 'Acesso vitalício'}
                            </p>
                            <a href="#trilha" className="lg:hidden text-xs font-bold text-primary flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">list</span>
                                Conteúdo do curso ({doneCount}/{lessons.length})
                            </a>
                        </div>
                    </div>

                    {current?.kind === 'video' && (
                        <VideoNotes
                            key={current.item.id}
                            courseSlug={course.slug}
                            video={current.item}
                            notes={notes}
                            onNotesChange={setNotes}
                            playerRef={playerRef}
                            currentTime={playback.time}
                            paused={playback.paused}
                        />
                    )}
                </section>

                {/* Trilha */}
                <aside id="trilha" className="lg:w-1/3 min-w-0 space-y-4 scroll-mt-20">
                    <div className="bg-surface-container-lowest rounded-xl p-4 sm:p-6 shadow-sm">
                        <h2 className="font-headline font-extrabold text-lg text-on-surface">{course.title}</h2>
                        <p className="text-xs text-on-surface-variant mt-1">
                            {[course.category, course.workload_hours && `${course.workload_hours}h`, `${lessons.length} itens`].filter(Boolean).join(' · ')}
                        </p>
                        <div className="mt-4">
                            <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                                <span className="text-on-surface-variant">
                                    {doneCount} de {lessons.length} aulas concluídas
                                </span>
                                <span className="text-primary tabular-nums">{percent}%</span>
                            </div>
                            <div className="h-2 rounded-full bg-surface-container overflow-hidden">
                                <div className="h-full kinetic-gradient rounded-full transition-all duration-500" style={{ width: `${percent}%` }} />
                            </div>
                        </div>
                    </div>

                    <SupportCard groups={supportGroups(course)} onOpen={(m) => postProgress(course.slug, { lesson_type: 'material', lesson_id: m.id, open: true })} />

                    {outline.map((section) => {
                        const sectionDone = section.lessons.filter(isDone).length;
                        const finished = section.lessons.length > 0 && sectionDone === section.lessons.length;
                        return (
                        <div
                            key={section.key}
                            className={`rounded-xl shadow-sm overflow-hidden ${finished ? 'bg-[#e6f4ea] dark:bg-emerald-950/40 ring-1 ring-emerald-500/20' : 'bg-surface-container-lowest'}`}
                        >
                            <button
                                onClick={() => setExpanded((e) => ({ ...e, [section.key]: !e[section.key] }))}
                                aria-expanded={!!expanded[section.key]}
                                className={`w-full flex items-center justify-between gap-3 p-4 text-left transition-colors ${
                                    finished ? 'hover:bg-emerald-100/60 dark:hover:bg-emerald-900/30' : 'hover:bg-surface-container-low'
                                }`}
                            >
                                {finished && (
                                    <span className="material-symbols-outlined text-[#137333] dark:text-[#6bfe9c] shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>
                                        check_circle
                                    </span>
                                )}
                                <span className="flex-1 min-w-0">
                                    <span className={`block font-bold text-sm ${finished ? 'text-[#0d5c2a] dark:text-[#6bfe9c]' : 'text-on-surface'}`}>{section.title}</span>
                                    <span className={`block text-[11px] font-bold mt-0.5 ${finished ? 'text-[#137333] dark:text-emerald-300' : 'text-on-surface-variant'}`}>
                                        {finished ? 'Módulo concluído' : `${sectionDone} de ${section.lessons.length} aulas concluídas`}
                                    </span>
                                </span>
                                <span
                                    className={`material-symbols-outlined transition-transform ${finished ? 'text-[#137333] dark:text-emerald-300' : 'text-on-surface-variant'} ${
                                        expanded[section.key] ? 'rotate-180' : ''
                                    }`}
                                >
                                    expand_more
                                </span>
                            </button>
                            {expanded[section.key] && (
                                <ul className="pb-2">
                                    {section.lessons.map((l) => {
                                        const active = l.key === currentKey;
                                        const done = isDone(l);
                                        const watched = l.kind === 'video' && !done ? watchedText(progress[trackKey(l)]) : null;
                                        const icon = done
                                            ? 'check_circle'
                                            :
                                            l.kind === 'video' ? 'play_circle' : l.kind === 'application' ? 'construction' : l.kind === 'exercises' ? 'quiz' : MATERIAL_ICONS[l.item?.type] ?? 'folder_open';
                                        return (
                                            <li key={l.key}>
                                                <button
                                                    onClick={() => openLesson(l.key)}
                                                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                                                        active ? 'bg-primary/10 border-l-4 border-primary' : 'hover:bg-surface-container-low border-l-4 border-transparent'
                                                    }`}
                                                >
                                                    <span
                                                        className={`material-symbols-outlined ${done ? 'text-[#006a35]' : active ? 'text-primary' : 'text-on-surface-variant'}`}
                                                        style={active || done ? { fontVariationSettings: "'FILL' 1" } : {}}
                                                        title={done ? 'Concluída' : undefined}
                                                    >
                                                        {icon}
                                                    </span>
                                                    <span className="flex-1 min-w-0">
                                                        <span className={`block text-sm truncate ${active ? 'font-bold text-primary' : 'text-on-surface'}`}>{l.title}</span>
                                                        <span className="block text-[11px] text-on-surface-variant truncate">
                                                            {[l.subtitle, watched].filter(Boolean).join(' · ')}
                                                        </span>
                                                    </span>
                                                    {l.minutes && <span className="text-[11px] text-on-surface-variant">{l.minutes} min</span>}
                                                </button>
                                            </li>
                                        );
                                    })}
                                    {section.lessons.length === 0 && <li className="px-4 py-3 text-xs text-on-surface-variant">Sem conteúdo.</li>}
                                </ul>
                            )}
                        </div>
                        );
                    })}
                </aside>
            </div>
        </StudentLayout>
    );
}
