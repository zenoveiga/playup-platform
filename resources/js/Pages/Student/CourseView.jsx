import ExerciseList from '@/Components/Student/ExerciseList';
import VideoNotes from '@/Components/Student/VideoNotes';
import VideoPlayer from '@/Components/Student/VideoPlayer';
import StudentLayout from '@/Layouts/StudentLayout';
import { Head, Link } from '@inertiajs/react';
import { useMemo, useRef, useState } from 'react';

/* Ambiente do curso adquirido: vídeos, aplicação, materiais de apoio e exercícios. */

const formatDate = (d) => (d ? new Date(`${d}T00:00:00`).toLocaleDateString('pt-BR') : '');

const MATERIAL_ICONS = { video: 'smart_display', document: 'menu_book', link: 'link', file: 'attach_file' };

/** Monta a trilha do curso como uma lista de "aulas" navegáveis. */
function buildOutline(course) {
    if (course.structure === 'modular') {
        return course.modules.map((m, mi) => ({
            key: `m${m.id}`,
            title: `Módulo ${mi + 1}: ${m.title}`,
            description: m.description,
            lessons: [
                ...m.videos.map((v) => ({ key: `v${v.id}`, kind: 'video', title: v.title, subtitle: v.category, minutes: v.duration_minutes, item: v })),
                ...(m.application_instructions
                    ? [{ key: `a${m.id}`, kind: 'application', title: 'Aplicação', subtitle: 'Atividade prática', minutes: m.application_minutes, item: m }]
                    : []),
                ...(m.support.length ? [{ key: `s${m.id}`, kind: 'materials', title: 'Materiais de apoio', subtitle: `${m.support.length} arquivo(s)`, item: m.support }] : []),
                ...(m.exercises.length ? [{ key: `e${m.id}`, kind: 'exercises', title: 'Exercícios', subtitle: `${m.exercises.length} questão(ões)`, item: m.exercises }] : []),
            ],
        }));
    }

    return [
        {
            key: 'free',
            title: 'Conteúdo do curso',
            lessons: [
                ...course.materials.map((v) => ({
                    key: `v${v.id}`,
                    kind: v.type === 'video' ? 'video' : 'material',
                    title: v.title,
                    subtitle: v.type === 'video' ? 'Vídeo' : v.type === 'document' ? 'Apostila' : v.type === 'link' ? 'Link' : 'Arquivo',
                    minutes: v.duration_minutes,
                    item: v,
                })),
                ...(course.exercises.length
                    ? [{ key: 'ex', kind: 'exercises', title: 'Exercícios', subtitle: `${course.exercises.length} questão(ões)`, item: course.exercises }]
                    : []),
            ],
        },
    ];
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
            <span className="material-symbols-outlined text-on-surface-variant">{material.file_url ? 'download' : 'open_in_new'}</span>
        </a>
    );
}

function Player({ lesson, playerRef, courseSlug, answers, onAnswer, onPlayback }) {
    if (!lesson) return null;

    if (lesson.kind === 'video') {
        return (
            <VideoPlayer
                ref={playerRef}
                video={lesson.item}
                onTime={(time) => onPlayback((p) => (Math.floor(p.time) === Math.floor(time) ? p : { ...p, time }))}
                onPlayState={(paused) => onPlayback((p) => (p.paused === paused ? p : { ...p, paused }))}
            />
        );
    }

    const panel = 'w-full min-h-[280px] bg-surface-container-lowest rounded-xl shadow-sm p-8';

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
                    <span className="material-symbols-outlined">{lesson.item.file_url ? 'download' : 'open_in_new'}</span>
                    {lesson.item.file_url ? 'Abrir material' : 'Acessar link'}
                </a>
            </div>
        );
    }

    // exercícios
    return <ExerciseList exercises={lesson.item} courseSlug={courseSlug} answers={answers} onAnswer={onAnswer} />;
}

export default function CourseView({ course, access, answers: initialAnswers = {}, notes: initialNotes = [] }) {
    const outline = useMemo(() => buildOutline(course), [course]);
    const lessons = outline.flatMap((s) => s.lessons);
    const [currentKey, setCurrentKey] = useState(lessons[0]?.key);
    const playerRef = useRef(null);
    const [answers, setAnswers] = useState(initialAnswers);
    const [notes, setNotes] = useState(initialNotes);
    const [playback, setPlayback] = useState({ time: 0, paused: true });
    const [expanded, setExpanded] = useState(() => Object.fromEntries(outline.map((s, i) => [s.key, i === 0])));

    const index = lessons.findIndex((l) => l.key === currentKey);
    const current = lessons[index];
    const go = (dir) => {
        const next = lessons[index + dir];
        if (!next) return;
        setCurrentKey(next.key);
        const section = outline.find((s) => s.lessons.some((l) => l.key === next.key));
        if (section) setExpanded((e) => ({ ...e, [section.key]: true }));
    };

    return (
        <StudentLayout>
            <Head title={`${course.title} | PlayUp Academy`} />

            <div className="p-6 md:p-8 flex flex-col lg:flex-row gap-8">
                <section className="flex-grow flex flex-col gap-6 lg:w-2/3">
                    <div className="flex items-center gap-2 text-xs font-bold text-on-surface-variant">
                        <Link href={route('student.courses')} className="hover:text-primary">Meus Cursos</Link>
                        <span className="material-symbols-outlined text-xs">chevron_right</span>
                        <span className="text-primary">{course.title}</span>
                    </div>

                    {current ? (
                        <Player
                            lesson={current}
                            playerRef={playerRef}
                            courseSlug={course.slug}
                            answers={answers}
                            onAnswer={(result) => setAnswers((a) => ({ ...a, [result.exercise_id]: result }))}
                            onPlayback={setPlayback}
                        />
                    ) : (
                        <div className="w-full aspect-video bg-surface-container-lowest rounded-xl flex items-center justify-center text-on-surface-variant">
                            Este curso ainda não tem conteúdo.
                        </div>
                    )}

                    <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm space-y-4">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-primary">{current?.subtitle}</p>
                                <h1 className="text-2xl font-extrabold font-headline text-on-surface">{current?.title ?? course.title}</h1>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => go(-1)}
                                    disabled={index <= 0}
                                    className="px-4 py-2 rounded-xl bg-surface-container-low font-bold text-sm text-on-surface disabled:opacity-40 flex items-center gap-1"
                                >
                                    <span className="material-symbols-outlined text-base">skip_previous</span>Anterior
                                </button>
                                <button
                                    onClick={() => go(1)}
                                    disabled={index >= lessons.length - 1}
                                    className="px-4 py-2 rounded-xl gradient-button kinetic-gradient text-white font-bold text-sm disabled:opacity-40 flex items-center gap-1"
                                >
                                    Próxima<span className="material-symbols-outlined text-base">skip_next</span>
                                </button>
                            </div>
                        </div>
                        {current?.kind === 'video' && current.item.description && <p className="text-sm text-on-surface-variant">{current.item.description}</p>}
                        <p className="text-xs font-bold text-on-surface-variant flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">event_available</span>
                            {access.expires_at ? `Seu acesso vai até ${formatDate(access.expires_at)}` : 'Acesso vitalício'}
                        </p>
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
                <aside className="lg:w-1/3 space-y-4">
                    <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm">
                        <h2 className="font-headline font-extrabold text-lg text-on-surface">{course.title}</h2>
                        <p className="text-xs text-on-surface-variant mt-1">
                            {[course.category, course.workload_hours && `${course.workload_hours}h`, `${lessons.length} itens`].filter(Boolean).join(' · ')}
                        </p>
                    </div>

                    {outline.map((section) => (
                        <div key={section.key} className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
                            <button
                                onClick={() => setExpanded((e) => ({ ...e, [section.key]: !e[section.key] }))}
                                className="w-full flex items-center justify-between gap-3 p-4 text-left hover:bg-surface-container-low transition-colors"
                            >
                                <span className="font-bold text-sm text-on-surface">{section.title}</span>
                                <span className={`material-symbols-outlined text-on-surface-variant transition-transform ${expanded[section.key] ? 'rotate-180' : ''}`}>expand_more</span>
                            </button>
                            {expanded[section.key] && (
                                <ul className="pb-2">
                                    {section.lessons.map((l) => {
                                        const active = l.key === currentKey;
                                        const icon =
                                            l.kind === 'video' ? 'play_circle' : l.kind === 'application' ? 'construction' : l.kind === 'exercises' ? 'quiz' : MATERIAL_ICONS[l.item?.type] ?? 'folder_open';
                                        return (
                                            <li key={l.key}>
                                                <button
                                                    onClick={() => setCurrentKey(l.key)}
                                                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                                                        active ? 'bg-primary/10 border-l-4 border-primary' : 'hover:bg-surface-container-low border-l-4 border-transparent'
                                                    }`}
                                                >
                                                    <span className={`material-symbols-outlined ${active ? 'text-primary' : 'text-on-surface-variant'}`} style={active ? { fontVariationSettings: "'FILL' 1" } : {}}>
                                                        {icon}
                                                    </span>
                                                    <span className="flex-1 min-w-0">
                                                        <span className={`block text-sm truncate ${active ? 'font-bold text-primary' : 'text-on-surface'}`}>{l.title}</span>
                                                        <span className="block text-[11px] text-on-surface-variant truncate">{l.subtitle}</span>
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
                    ))}
                </aside>
            </div>
        </StudentLayout>
    );
}
