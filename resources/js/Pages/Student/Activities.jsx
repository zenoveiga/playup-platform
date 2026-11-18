import StudentLayout from '@/Layouts/StudentLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

export default function Activities() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterPeriod, setFilterPeriod] = useState('Tudo');
    const [filterPriority, setFilterPriority] = useState('Todas');
    const [filterCourse, setFilterCourse] = useState('Todos');
    const [filterStatus, setFilterStatus] = useState('Pendente');

    return (
        <StudentLayout>
            <Head title="Atividades - PlayUp" />

            <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 lg:space-y-8">
                {/* Header Title Banner */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100 font-headline tracking-tight">Atividades</h2>
                        <p className="text-sm text-slate-500 font-medium">Acompanhe e gerencie suas tarefas do portal</p>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    <div className="lg:col-span-4 relative group">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">search</span>
                        <input
                            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 rounded-2xl border-none focus:ring-2 focus:ring-primary/20 text-sm font-medium placeholder:text-slate-400 text-slate-700 dark:text-slate-300 shadow-sm"
                            placeholder="Buscar atividade..."
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="lg:col-span-8 flex flex-wrap gap-3">
                        <select
                            className="bg-white dark:bg-slate-900 border-none rounded-xl text-sm font-semibold px-4 py-3 focus:ring-2 focus:ring-primary/20 cursor-pointer shadow-sm text-slate-600 dark:text-slate-300"
                            value={filterPeriod}
                            onChange={(e) => setFilterPeriod(e.target.value)}
                        >
                            <option value="Tudo">Prazo: Tudo</option>
                            <option value="Hoje">Hoje</option>
                            <option value="Esta Semana">Esta Semana</option>
                            <option value="Próximos">Próximos</option>
                        </select>
                        <select
                            className="bg-white dark:bg-slate-900 border-none rounded-xl text-sm font-semibold px-4 py-3 focus:ring-2 focus:ring-primary/20 cursor-pointer shadow-sm text-slate-600 dark:text-slate-300"
                            value={filterPriority}
                            onChange={(e) => setFilterPriority(e.target.value)}
                        >
                            <option value="Todas">Prioridade: Todas</option>
                            <option value="Alta">Alta</option>
                            <option value="Média">Média</option>
                            <option value="Baixa">Baixa</option>
                        </select>
                        <select
                            className="bg-white dark:bg-slate-900 border-none rounded-xl text-sm font-semibold px-4 py-3 focus:ring-2 focus:ring-primary/20 cursor-pointer shadow-sm text-slate-600 dark:text-slate-300"
                            value={filterCourse}
                            onChange={(e) => setFilterCourse(e.target.value)}
                        >
                            <option value="Todos">Curso: Todos</option>
                            <option value="Marketing Digital">Marketing Digital</option>
                            <option value="Power BI Avançado">Power BI Avançado</option>
                            <option value="Excel para Negócios">Excel para Negócios</option>
                        </select>
                        <select
                            className="bg-white dark:bg-slate-900 border-none rounded-xl text-sm font-semibold px-4 py-3 focus:ring-2 focus:ring-primary/20 cursor-pointer shadow-sm text-slate-600 dark:text-slate-300"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="Pendente">Status: Pendente</option>
                            <option value="Em andamento">Em andamento</option>
                            <option value="Concluído">Concluído</option>
                        </select>
                    </div>
                </div>

                {/* Destaque de Hoje (Bento Style) */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-extrabold flex items-center gap-2 text-slate-800 dark:text-slate-200">
                            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                            Destaque de Hoje
                        </h3>
                        <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-tighter">O que devo fazer hoje?</span>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Urgent Card 1 */}
                        <div className="lg:col-span-2 group relative overflow-hidden bg-primary p-8 rounded-3xl text-on-primary flex flex-col justify-between min-h-[240px] shadow-lg shadow-primary/10 hover:shadow-xl hover:shadow-primary/20 transition-all duration-250">
                            <div className="relative z-10 flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full w-fit mb-4">
                                        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
                                        <span className="text-[10px] font-bold uppercase tracking-wider">Alta Prioridade</span>
                                    </div>
                                    <h4 className="text-2xl md:text-3xl font-black leading-tight max-w-lg">
                                        Entrega do Projeto Final: Microsserviços Scalable
                                    </h4>
                                    <p className="text-primary-container mt-2 font-medium">Arquitetura de Sistemas Cloud • Módulo 12</p>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="text-3xl md:text-4xl font-black">23:59</p>
                                    <p className="text-[10px] font-bold uppercase opacity-60">Hoje</p>
                                </div>
                            </div>
                            <div className="relative z-10 flex items-center justify-between mt-6">
                                <div className="flex -space-x-2">
                                    <div className="w-8 h-8 rounded-full border-2 border-primary bg-white flex items-center justify-center text-xs font-black text-primary">
                                        ☁
                                    </div>
                                    <div className="w-8 h-8 rounded-full border-2 border-primary bg-primary-container flex items-center justify-center text-[10px] font-bold">+3</div>
                                </div>
                                <button className="bg-white text-primary px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-lg shadow-black/10 active:scale-95 transition-transform">
                                    Abrir Atividade
                                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                </button>
                            </div>
                        </div>

                        {/* Secondary Urgent Card */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl flex flex-col justify-between border-2 border-dashed border-primary/25 hover:border-primary/50 transition-colors shadow-sm">
                            <div>
                                <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/30 flex items-center justify-center mb-4 text-sky-600">
                                    <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>quiz</span>
                                </div>
                                <h4 className="text-lg font-bold leading-snug text-slate-800 dark:text-slate-200">
                                    Prova de Avaliação: Algoritmos Avançados
                                </h4>
                                <p className="text-sm text-slate-500 mt-1">Ciência da Computação</p>
                            </div>
                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4 flex items-center justify-between">
                                <span className="text-xs font-bold text-error flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm">schedule</span> Termina em 4h
                                </span>
                                <button className="text-primary font-bold text-sm hover:underline active:scale-95 transition-transform">Iniciar</button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Task Manager List */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-extrabold text-slate-800 dark:text-slate-200">Próximas Atividades</h3>
                        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                            <button className="p-1.5 rounded-md bg-white dark:bg-slate-900 shadow-sm"><span className="material-symbols-outlined text-sm">view_list</span></button>
                            <button className="p-1.5 rounded-md hover:bg-white/50 dark:hover:bg-slate-900/50 transition-all"><span className="material-symbols-outlined text-sm">grid_view</span></button>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {/* Task Item 1 */}
                        <div className="group bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80 flex flex-col md:flex-row md:items-center gap-4 transition-all hover:translate-x-1 hover:shadow-md">
                            <div className="flex items-center gap-4 md:w-1/3">
                                <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/20 text-[#7f56d9] flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>forum</span>
                                </div>
                                <div className="overflow-hidden">
                                    <h4 className="font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-primary transition-colors">
                                        Responder Fórum: Ética em IA
                                    </h4>
                                    <p className="text-xs text-slate-400 font-semibold mt-0.5">Design System &amp; UX</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-8 md:flex-1 justify-between">
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Prazo</span>
                                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">12 Nov • 18:00</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Prioridade</span>
                                    <div className="flex items-center gap-1.5 text-secondary">
                                        <div className="w-1.5 h-1.5 rounded-full bg-secondary"></div>
                                        <span className="text-sm font-semibold">Média</span>
                                    </div>
                                </div>
                                <div className="flex flex-col min-w-[100px]">
                                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Status</span>
                                    <span className="text-sm font-bold text-slate-500 italic">Pendente</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 md:ml-4">
                                <button className="flex-1 md:flex-none px-4 py-2 bg-slate-50 dark:bg-slate-800 hover:bg-primary/10 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold transition-all">Editar</button>
                                <button className="flex-1 md:flex-none px-4 py-2 bg-primary text-on-primary rounded-xl text-xs font-bold hover:bg-primary-dim transition-all active:scale-95">Ir para Fórum</button>
                            </div>
                        </div>

                        {/* Task Item 2 */}
                        <div className="group bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80 flex flex-col md:flex-row md:items-center gap-4 transition-all hover:translate-x-1 hover:shadow-md">
                            <div className="flex items-center gap-4 md:w-1/3">
                                <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
                                </div>
                                <div className="overflow-hidden">
                                    <h4 className="font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-primary transition-colors">
                                        Vídeo: Introdução ao React Native
                                    </h4>
                                    <p className="text-xs text-slate-400 font-semibold mt-0.5">Desenvolvimento Mobile</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-8 md:flex-1 justify-between">
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Prazo</span>
                                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">14 Nov • Sem hora</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Prioridade</span>
                                    <div className="flex items-center gap-1.5 text-slate-400">
                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                                        <span className="text-sm font-semibold">Baixa</span>
                                    </div>
                                </div>
                                <div className="flex flex-col min-w-[100px]">
                                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Status</span>
                                    <div className="flex items-center gap-1 text-primary">
                                        <span className="material-symbols-outlined text-sm animate-pulse">sync</span>
                                        <span className="text-sm font-bold">Em andamento</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 md:ml-4">
                                <button className="flex-1 md:flex-none px-4 py-2 bg-slate-50 dark:bg-slate-800 hover:bg-primary/10 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold transition-all">Continuar</button>
                            </div>
                        </div>

                        {/* Task Item 3 */}
                        <div className="group bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80 flex flex-col md:flex-row md:items-center gap-4 transition-all hover:translate-x-1 hover:shadow-md">
                            <div className="flex items-center gap-4 md:w-1/3">
                                <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-950/20 text-red-600 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>description</span>
                                </div>
                                <div className="overflow-hidden">
                                    <h4 className="font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-primary transition-colors">
                                        Artigo: Redes Neurais Convolucionais
                                    </h4>
                                    <p className="text-xs text-slate-400 font-semibold mt-0.5">Inteligência Artificial</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-8 md:flex-1 justify-between">
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Prazo</span>
                                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Amanhã • 09:00</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Prioridade</span>
                                    <div className="flex items-center gap-1.5 text-error">
                                        <div className="w-1.5 h-1.5 rounded-full bg-error"></div>
                                        <span className="text-sm font-semibold">Alta</span>
                                    </div>
                                </div>
                                <div className="flex flex-col min-w-[100px]">
                                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Status</span>
                                    <span className="text-sm font-bold text-slate-500 italic">Pendente</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 md:ml-4">
                                <button className="flex-1 md:flex-none px-4 py-2 bg-primary text-on-primary rounded-xl text-xs font-bold hover:bg-primary-dim transition-all active:scale-95">Baixar PDF</button>
                            </div>
                        </div>
                    </div>

                    {/* Load More */}
                    <div className="flex justify-center pt-6">
                        <button className="group flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-300 font-bold rounded-2xl transition-all">
                            Ver atividades anteriores
                            <span className="material-symbols-outlined text-lg group-hover:translate-y-0.5 transition-transform">keyboard_arrow_down</span>
                        </button>
                    </div>
                </section>
            </div>

            {/* Float Info (Glassmorphism) */}
            <div className="fixed bottom-24 right-4 lg:bottom-8 lg:right-8 z-50">
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-white/20 dark:border-slate-800 p-4 rounded-3xl shadow-xl flex items-center gap-4">
                    <div className="relative w-12 h-12">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e2f3ff" strokeWidth="3"></path>
                            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#0050d4" strokeDasharray="60, 100" strokeWidth="3"></path>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-primary">60%</div>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Foco do Dia</p>
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mt-1">3 de 5 concluídas</p>
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
}
