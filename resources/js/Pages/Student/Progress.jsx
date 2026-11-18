import StudentLayout from '@/Layouts/StudentLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

export default function Progress() {
    const [semester, setSemester] = useState('1º Semestre 2024');

    const modules = [
        { name: 'Fundamentos da Computação', hours: '20h', percent: 100, status: 'Concluído', color: 'bg-emerald-500' },
        { name: 'Bancos de Dados Relacionais', hours: '30h', percent: 100, status: 'Concluído', color: 'bg-emerald-500' },
        { name: 'Desenvolvimento Web Frontend', hours: '40h', percent: 100, status: 'Concluído', color: 'bg-emerald-500' },
        { name: 'Backend e APIs RESTful', hours: '40h', percent: 72, status: 'Em andamento', color: 'bg-primary' },
        { name: 'Arquitetura Cloud & DevOps', hours: '30h', percent: 0, status: 'Bloqueado', color: 'bg-slate-300' }
    ];

    const badges = [
        { title: 'Streak Master', desc: '40+ dias seguidos', icon: 'bolt', color: 'text-amber-500 bg-amber-50' },
        { title: 'Speed Coder', desc: 'Entregas adiantadas', icon: 'speed', color: 'text-primary bg-primary/10' },
        { title: 'Quiz Champ', desc: '100% acertos em testes', icon: 'military_tech', color: 'text-purple-600 bg-purple-50' },
        { title: 'Night Owl', desc: 'Estudos pós-meia-noite', icon: 'dark_mode', color: 'text-slate-700 bg-slate-100' }
    ];

    return (
        <StudentLayout>
            <Head title="Meu Progresso Acadêmico - PlayUp" />
            
            <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 lg:space-y-8">
                {/* Header Title with Semester Filter */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100 font-headline tracking-tight">Meu Progresso</h2>
                        <p className="text-sm text-slate-500 font-medium">Acompanhe seu avanço em módulos, atividades e marcos do curso.</p>
                    </div>
                    
                    <div className="relative bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 px-4 py-2.5 rounded-full flex items-center gap-3 shadow-sm min-w-[200px] shrink-0">
                        <span className="material-symbols-outlined text-primary text-sm">calendar_today</span>
                        <select 
                            className="bg-transparent border-none focus:ring-0 text-sm font-semibold text-slate-600 dark:text-slate-300 appearance-none pr-8 py-0 w-full cursor-pointer"
                            value={semester}
                            onChange={(e) => setSemester(e.target.value)}
                        >
                            <option value="1º Semestre 2024">1º Semestre 2024</option>
                            <option value="2º Semestre 2023">2º Semestre 2023</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-4 pointer-events-none text-xs text-slate-400">expand_more</span>
                    </div>
                </div>

                {/* Hero Card */}
                <section className="bg-[#f7f5ff] dark:bg-[#13112b] rounded-3xl p-8 relative overflow-hidden flex flex-col md:flex-row items-center border border-purple-100 dark:border-purple-950/20">
                    <div className="relative z-10 max-w-2xl space-y-6">
                        <div className="flex gap-3">
                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-slate-900 text-primary text-xs font-extrabold shadow-sm">
                                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                                PROGRESSO DA CERTIFICAÇÃO
                            </span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100 font-headline leading-tight">
                            🚀 Seu progresso de certificação está voando!
                        </h2>
                        <p className="text-base lg:text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                            Você já concluiu <span className="text-primary font-black">18 de 24</span> aulas obrigatórias. Falta muito pouco para desbloquear o seu Certificado oficial.
                        </p>
                    </div>
                    <div className="ml-auto relative shrink-0 hidden lg:block">
                        <img 
                            className="w-64 h-auto drop-shadow-2xl object-contain filter brightness-95" 
                            alt="Progress 3D Illustration"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDfT1oiBUV5LOh2uxeiCN9gc097pwxYaBNBXMYMe1d4yp7Jlim9gwTZEL-3O0AQ7gBHduugrUVpTtpgdnpkGGN5FaGd_BMUitSbdfA9HwIxq20OkzVvLB6YmufKVU6iv6i3atOh8dtTEH05gOGsXQvgkWc2pKh2Li1iJNJHywLPx383vVQmciuHqbwwc3GYi2IN8vqeHCT_MV5K_4IkJahQeNrjJKsXikda-F-wNId5V-RJwf462wK7dA"
                        />
                    </div>
                </section>

                {/* Bento Metrics Grid */}
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:-translate-y-1 transition-all duration-200">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4 shrink-0">
                            <span className="material-symbols-outlined">schedule</span>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">TOTAL DE HORAS</p>
                            <p className="text-3xl font-black text-slate-800 dark:text-slate-200">120h <span className="text-xs font-semibold text-slate-400">/ 160h</span></p>
                            <p className="text-[10px] font-bold text-slate-500 mt-2">75% concluídas</p>
                        </div>
                    </div>
                    
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:-translate-y-1 transition-all duration-200">
                        <div className="w-12 h-12 bg-sky-50 dark:bg-slate-850 rounded-xl flex items-center justify-center text-sky-600 mb-4 shrink-0">
                            <span className="material-symbols-outlined">menu_book</span>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">AULAS ASSISTIDAS</p>
                            <p className="text-3xl font-black text-slate-800 dark:text-slate-200">18 <span className="text-xs font-semibold text-slate-400">/ 24</span></p>
                            <p className="text-[10px] font-bold text-slate-500 mt-2">6 aulas restantes</p>
                        </div>
                    </div>
                    
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:-translate-y-1 transition-all duration-200">
                        <div className="w-12 h-12 bg-purple-50 dark:bg-slate-850 rounded-xl flex items-center justify-center text-purple-600 mb-4 shrink-0">
                            <span className="material-symbols-outlined">quiz</span>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">PROVAS FEITAS</p>
                            <p className="text-3xl font-black text-slate-800 dark:text-slate-200">3 <span className="text-xs font-semibold text-slate-400">/ 4</span></p>
                            <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-500 mt-2">Apenas 1 restante</p>
                        </div>
                    </div>
                    
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:-translate-y-1 transition-all duration-200">
                        <div className="w-12 h-12 bg-amber-50 dark:bg-slate-850 rounded-xl flex items-center justify-center text-amber-500 mb-4 shrink-0">
                            <span className="material-symbols-outlined">military_tech</span>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">CONQUISTAS</p>
                            <p className="text-3xl font-black text-slate-800 dark:text-slate-200">4 <span className="text-xs font-semibold text-slate-400">/ 6</span></p>
                            <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-500 mt-2">Próxima medalha ativa</p>
                        </div>
                    </div>
                    
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:-translate-y-1 transition-all duration-200">
                        <div className="w-12 h-12 bg-emerald-50 dark:bg-slate-850 rounded-xl flex items-center justify-center text-emerald-600 mb-4 shrink-0">
                            <span className="material-symbols-outlined">event_available</span>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">CONEXÃO ESTIMADA</p>
                            <p className="text-2xl font-black text-slate-800 dark:text-slate-200">Dez/2024</p>
                            <p className="text-[10px] font-bold text-slate-500 mt-2">Dentro do cronograma</p>
                        </div>
                    </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Modules Detailed Timeline */}
                    <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 lg:p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="font-headline font-bold text-xl text-slate-800 dark:text-slate-200">Progresso por Módulo</h3>
                            <span className="text-xs font-bold text-primary">5 Módulos</span>
                        </div>
                        
                        <div className="space-y-6">
                            {modules.map((mod, idx) => (
                                <div key={idx} className="space-y-2 group">
                                    <div className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2.5 h-2.5 rounded-full ${mod.color}`}></span>
                                            <span className="font-bold text-slate-700 dark:text-slate-300 group-hover:text-primary transition-colors">{mod.name}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs text-slate-400 font-semibold">{mod.hours}</span>
                                            <span className={`text-xs font-black ${mod.percent === 100 ? 'text-emerald-500' : 'text-slate-650'}`}>
                                                {mod.percent}%
                                            </span>
                                        </div>
                                    </div>
                                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div className={`h-full ${mod.color}`} style={{ width: `${mod.percent}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Horas Complementares & Medals */}
                    <div className="lg:col-span-5 space-y-6">
                        {/* Horas Complementares */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-5">
                            <div className="flex justify-between items-center">
                                <h4 className="font-headline font-bold text-slate-800 dark:text-slate-200">Horas Complementares</h4>
                                <span className="text-xs font-bold text-slate-400">Meta: 100h</span>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                                        <span>Horas Concluídas</span>
                                        <span>65h / 100h</span>
                                    </div>
                                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-850 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary" style={{ width: '65%' }}></div>
                                    </div>
                                </div>
                                
                                <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                                    <div className="py-2.5 flex justify-between items-center">
                                        <span className="text-slate-600 dark:text-slate-400 font-medium">Web Hackathon 2024</span>
                                        <span className="font-bold text-emerald-600 dark:text-emerald-500">+20h</span>
                                    </div>
                                    <div className="py-2.5 flex justify-between items-center">
                                        <span className="text-slate-600 dark:text-slate-400 font-medium">Curso Avançado de React</span>
                                        <span className="font-bold text-emerald-600 dark:text-emerald-500">+30h</span>
                                    </div>
                                    <div className="py-2.5 flex justify-between items-center">
                                        <span className="text-slate-600 dark:text-slate-400 font-medium">Monitoria na Comunidade</span>
                                        <span className="font-bold text-emerald-600 dark:text-emerald-500">+15h</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Medals Conquered */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
                            <h4 className="font-headline font-bold text-slate-800 dark:text-slate-200">Medalhas Conquistadas</h4>
                            <div className="grid grid-cols-2 gap-3">
                                {badges.map((b, idx) => (
                                    <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-100 dark:border-slate-800/80">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${b.color}`}>
                                            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>{b.icon}</span>
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate leading-tight">{b.title}</p>
                                            <p className="text-[9px] text-slate-400 font-semibold truncate mt-0.5">{b.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
}
