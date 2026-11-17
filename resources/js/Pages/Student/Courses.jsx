import StudentLayout from '@/Layouts/StudentLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

const LEVELS = { iniciante: 'Iniciante', intermediario: 'Intermediário', avancado: 'Avançado' };

const ACCESS = {
    active: { label: 'Acesso liberado', className: 'bg-primary text-white' },
    scheduled: { label: 'Acesso agendado', className: 'bg-amber-600 text-white' },
    expired: { label: 'Acesso encerrado', className: 'bg-slate-400 text-white' },
};

const formatDate = (d) => (d ? new Date(`${d}T00:00:00`).toLocaleDateString('pt-BR') : '');

function CourseImage({ course, className }) {
    return course.cover_url ? (
        <img alt={course.title} className={className} src={course.cover_url} />
    ) : (
        <div className="w-full h-full kinetic-gradient flex items-center justify-center">
            <span className="material-symbols-outlined text-5xl text-white/80">auto_stories</span>
        </div>
    );
}

export default function Courses({ initialTab = 'meus-cursos', myCourses = [], availableCourses = [] }) {
    const [activeTab, setActiveTab] = useState(initialTab);

    return (
        <StudentLayout>
            <Head title="Meus Cursos - PlayUp" />

            <div className="p-8 max-w-7xl mx-auto space-y-8">
                {/* Header Title & Switcher */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 font-headline tracking-tight">Cursos</h2>
                        <p className="text-sm text-slate-500 font-medium">Acesse os cursos que você adquiriu e conheça os demais cursos disponíveis.</p>
                    </div>

                    <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl self-start md:self-auto shadow-inner">
                        {[
                            { key: 'meus-cursos', label: `Meus Cursos (${myCourses.length})` },
                            { key: 'disponiveis', label: 'Cursos Disponíveis' },
                        ].map((t) => (
                            <button
                                key={t.key}
                                className={`px-5 py-2 rounded-lg font-bold text-sm transition-all ${
                                    activeTab === t.key ? 'bg-white dark:bg-slate-900 text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                                }`}
                                onClick={() => setActiveTab(t.key)}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>
                </div>

                {activeTab === 'meus-cursos' ? (
                    myCourses.length === 0 ? (
                        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-12 text-center">
                            <span className="material-symbols-outlined text-5xl text-primary/60">school</span>
                            <h4 className="text-lg font-extrabold text-slate-800 dark:text-slate-200 mt-3">Você ainda não tem cursos</h4>
                            <p className="text-sm text-slate-500 mt-1">Quando sua escola liberar um curso para você, ele aparecerá aqui.</p>
                            <button onClick={() => setActiveTab('disponiveis')} className="mt-6 px-6 py-3 bg-primary/10 hover:bg-primary text-primary hover:text-white font-bold text-sm rounded-xl transition-all">
                                Ver cursos disponíveis
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {myCourses.map((course) => {
                                const access = ACCESS[course.access_status] ?? ACCESS.active;
                                const canOpen = course.access_status === 'active';
                                return (
                                    <div
                                        key={course.id}
                                        className={`bg-white dark:bg-slate-900 border border-primary/20 rounded-3xl p-6 flex flex-col justify-between hover:shadow-md hover:scale-[1.01] transition-all group ${canOpen ? '' : 'opacity-75'}`}
                                    >
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${access.className}`}>{access.label}</span>
                                                <span className="text-xs font-bold text-slate-400">
                                                    {course.structure === 'modular' ? `${course.modules_count} módulos` : 'Curso livre'}
                                                </span>
                                            </div>

                                            <div className="h-32 bg-slate-50 dark:bg-slate-850 rounded-2xl overflow-hidden flex items-center justify-center relative">
                                                <CourseImage course={course} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
                                            </div>

                                            <div className="space-y-2">
                                                <h4 className="text-lg font-extrabold text-slate-800 dark:text-slate-200 group-hover:text-primary transition-colors leading-tight">{course.title}</h4>
                                                <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed line-clamp-2">{course.description}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                                            <p className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                                                <span className="material-symbols-outlined text-sm">event_available</span>
                                                {course.access_status === 'scheduled'
                                                    ? `Disponível a partir de ${formatDate(course.starts_at)}`
                                                    : course.expires_at
                                                      ? `${course.access_status === 'expired' ? 'Acesso encerrado em' : 'Acesso até'} ${formatDate(course.expires_at)}`
                                                      : 'Acesso vitalício'}
                                            </p>
                                            {canOpen ? (
                                                <Link
                                                    href={route('student.courses.show', course.slug)}
                                                    className="w-full py-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-350 font-bold text-xs rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
                                                >
                                                    <span>Acessar curso</span>
                                                    <span className="material-symbols-outlined text-sm font-black">arrow_forward</span>
                                                </Link>
                                            ) : (
                                                <span className="w-full py-3 bg-slate-50 dark:bg-slate-800 text-slate-400 font-bold text-xs rounded-xl flex items-center justify-center gap-2">
                                                    <span className="material-symbols-outlined text-sm">lock</span>
                                                    {course.access_status === 'scheduled' ? 'Aguardando início' : 'Fale com sua escola para renovar'}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {availableCourses.map((course) => (
                            <div key={course.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl overflow-hidden group flex flex-col h-full hover:shadow-md hover:border-primary/20 transition-all">
                                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                                    <CourseImage course={course} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                    {course.owned && (
                                        <div className="absolute top-3 left-3 bg-[#006a35] text-white text-[9px] font-black px-2.5 py-0.5 rounded-md tracking-wider">ADQUIRIDO</div>
                                    )}
                                </div>

                                <div className="p-5 flex flex-col flex-1 space-y-3 justify-between">
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                                            <span>{course.category || LEVELS[course.level]}</span>
                                            <span>{course.workload_hours ? `${course.workload_hours} horas` : ''}</span>
                                        </div>
                                        <h5 className="font-bold text-base text-slate-800 dark:text-slate-200 line-clamp-1 leading-tight group-hover:text-primary transition-colors">{course.title}</h5>
                                        <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed line-clamp-3 font-medium">{course.description}</p>
                                    </div>

                                    {course.owned ? (
                                        <Link
                                            href={route('student.courses.show', course.slug)}
                                            className="w-full py-3 bg-primary text-white font-bold text-xs rounded-xl transition-all mt-4 active:scale-95 text-center"
                                        >
                                            Acessar curso
                                        </Link>
                                    ) : (
                                        <span className="w-full py-3 bg-primary/10 text-primary font-bold text-xs rounded-xl mt-4 text-center">
                                            Fale com sua escola para adquirir
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                        {availableCourses.length === 0 && <p className="text-sm text-slate-500 col-span-full">Nenhum curso disponível no momento.</p>}
                    </div>
                )}
            </div>
        </StudentLayout>
    );
}
