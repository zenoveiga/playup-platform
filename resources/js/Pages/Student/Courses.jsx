import StudentLayout from '@/Layouts/StudentLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

export default function Courses() {
    const [activeTab, setActiveTab] = useState('meus-cursos');

    const myCourses = [
        {
            title: 'Marketing Digital',
            desc: 'Aprenda SEO, tráfego pago, e-mail marketing e estratégias de conversão.',
            progress: 72,
            lessons: '18 / 24 aulas',
            status: 'Em andamento',
            badgeColor: 'bg-primary text-white',
            image: '/images/course_marketing.png',
            accent: 'border-primary/20'
        },
        {
            title: 'Power BI Avançado',
            desc: 'Domine a modelagem de dados, fórmulas DAX e crie dashboards interativos.',
            progress: 31,
            lessons: '7 / 24 aulas',
            status: 'Em andamento',
            badgeColor: 'bg-amber-600 text-white',
            image: '/images/course_powerbi.png',
            accent: 'border-amber-500/20'
        },
        {
            title: 'Excel para Negócios',
            desc: 'Planilhas inteligentes, PROCV, tabelas dinâmicas, macros e dashboards.',
            progress: 100,
            lessons: '12 / 12 aulas',
            status: 'Concluído',
            badgeColor: 'bg-emerald-600 text-white',
            image: '/images/course_excel.png',
            accent: 'border-emerald-500/20'
        }
    ];

    const suggestedCourses = [
        {
            title: 'Desenvolvimento Web Fullstack',
            desc: 'Domine React, Node.js, banco de dados e APIs RESTful para criar aplicações modernas.',
            hours: '80 horas',
            category: 'Tecnologia',
            demand: 'Alta Demanda',
            image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=280&auto=format&fit=crop'
        },
        {
            title: 'Arquitetura de Software',
            desc: 'Aprenda a projetar microsserviços tolerantes a falhas e sistemas escaláveis na nuvem.',
            hours: '60 horas',
            category: 'Tecnologia',
            demand: 'Recomendado',
            image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=280&auto=format&fit=crop'
        },
        {
            title: 'Design System & UX/UI',
            desc: 'Crie guias de estilo consistentes e projete experiências ricas com foco no usuário.',
            hours: '40 horas',
            category: 'Design',
            demand: 'Mais Procurado',
            image: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?q=80&w=280&auto=format&fit=crop'
        },
        {
            title: 'Gestão de Projetos Ágeis',
            desc: 'Lidere squads com metodologias ágeis como Scrum e Kanban de forma prática.',
            hours: '30 horas',
            category: 'Negócios',
            demand: 'Especialização',
            image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=280&auto=format&fit=crop'
        }
    ];

    return (
        <StudentLayout>
            <Head title="Meus Cursos & Sugestões - PlayUp" />
            
            <div className="p-8 max-w-7xl mx-auto space-y-8">
                {/* Header Title & Switcher */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 font-headline tracking-tight">Cursos</h2>
                        <p className="text-sm text-slate-500 font-medium">Acompanhe seu progresso atual e explore novas trilhas sugeridas.</p>
                    </div>
                    
                    <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl self-start md:self-auto shadow-inner">
                        <button 
                            className={`px-5 py-2 rounded-lg font-bold text-sm transition-all ${
                                activeTab === 'meus-cursos' 
                                    ? 'bg-white dark:bg-slate-900 text-primary shadow-sm' 
                                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                            }`}
                            onClick={() => setActiveTab('meus-cursos')}
                        >
                            Meus Cursos
                        </button>
                        <button 
                            className={`px-5 py-2 rounded-lg font-bold text-sm transition-all ${
                                activeTab === 'sugestoes' 
                                    ? 'bg-white dark:bg-slate-900 text-primary shadow-sm' 
                                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                            }`}
                            onClick={() => setActiveTab('sugestoes')}
                        >
                            Sugestões para Você
                        </button>
                    </div>
                </div>

                {/* Content based on Active Tab */}
                {activeTab === 'meus-cursos' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {myCourses.map((course, idx) => (
                            <div key={idx} className={`bg-white dark:bg-slate-900 border ${course.accent} rounded-3xl p-6 flex flex-col justify-between hover:shadow-md hover:scale-[1.01] transition-all group`}>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${course.badgeColor}`}>
                                            {course.status}
                                        </span>
                                        <span className="text-xs font-bold text-slate-400">{course.lessons}</span>
                                    </div>
                                    
                                    <div className="h-32 bg-slate-50 dark:bg-slate-850 rounded-2xl overflow-hidden flex items-center justify-center p-2 relative">
                                        <img 
                                            alt={course.title} 
                                            className="h-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-200" 
                                            src={course.image}
                                            onError={(e) => {
                                                e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=280&auto=format&fit=crop';
                                            }}
                                        />
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <h4 className="text-lg font-extrabold text-slate-800 dark:text-slate-200 group-hover:text-primary transition-colors leading-tight">
                                            {course.title}
                                        </h4>
                                        <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed line-clamp-2">
                                            {course.desc}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="space-y-4 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-[11px] font-bold text-slate-400">
                                            <span>Progresso</span>
                                            <span className="text-primary font-black">{course.progress}%</span>
                                        </div>
                                        <div className="w-full bg-slate-100 dark:bg-slate-850 h-2 rounded-full overflow-hidden">
                                            <div className="bg-primary h-full rounded-full" style={{ width: `${course.progress}%` }} />
                                        </div>
                                    </div>
                                    
                                    <button className="w-full py-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-350 font-bold text-xs rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform">
                                        <span>Continuar Estudando</span>
                                        <span className="material-symbols-outlined text-sm font-black">arrow_forward</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {suggestedCourses.map((course, idx) => (
                            <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl overflow-hidden group flex flex-col h-full hover:shadow-md hover:border-primary/20 transition-all">
                                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                                    <img 
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                                        alt={course.title} 
                                        src={course.image}
                                    />
                                    <div className="absolute top-3 left-3 bg-[#006a35] text-white text-[9px] font-black px-2.5 py-0.5 rounded-md tracking-wider">
                                        {course.demand}
                                    </div>
                                </div>
                                
                                <div className="p-5 flex flex-col flex-1 space-y-3 justify-between">
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                                            <span>{course.category}</span>
                                            <span>{course.hours}</span>
                                        </div>
                                        <h5 className="font-bold text-base text-slate-800 dark:text-slate-200 line-clamp-1 leading-tight group-hover:text-primary transition-colors">
                                            {course.title}
                                        </h5>
                                        <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed line-clamp-3 font-medium">
                                            {course.desc}
                                        </p>
                                    </div>
                                    
                                    <button className="w-full py-3 bg-primary/10 hover:bg-primary text-primary hover:text-white font-bold text-xs rounded-xl transition-all mt-4 active:scale-95">
                                        Saber mais
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </StudentLayout>
    );
}
