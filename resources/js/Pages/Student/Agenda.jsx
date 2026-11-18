import StudentLayout from '@/Layouts/StudentLayout';
import { Head } from '@inertiajs/react';

export default function Agenda() {
    return (
        <StudentLayout>
            <Head title="Agenda Mensal - PlayUp" />
            
            <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 lg:space-y-8">
                {/* Header Title */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100 font-headline tracking-tight">Minha Jornada</h2>
                        <p className="text-sm text-slate-500 font-medium">Acompanhe seu calendário de aulas, provas e mentorias</p>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Column: Weekly Journey & Today's Schedule */}
                    <div className="w-full lg:w-[380px] shrink-0 space-y-6">
                        <section className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl space-y-8 shadow-sm">
                            <div className="space-y-1">
                                <h3 className="font-headline font-bold text-xl text-slate-800 dark:text-slate-200">Jornada Semanal</h3>
                                <p className="text-sm text-slate-400">Seu progresso em tempo real</p>
                            </div>
                            
                            {/* Weekly Timeline */}
                            <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-850 p-3 rounded-2xl">
                                <div className="flex flex-col items-center gap-1">
                                    <span className="text-[10px] font-bold opacity-50 text-slate-500">SEG</span>
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-primary/10 text-primary">16</div>
                                </div>
                                <div className="flex flex-col items-center gap-1">
                                    <span className="text-[10px] font-bold opacity-50 text-slate-500">TER</span>
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-400">17</div>
                                </div>
                                <div className="flex flex-col items-center gap-1">
                                    <span className="text-[10px] font-bold opacity-50 text-slate-500">QUA</span>
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-400">18</div>
                                </div>
                                <div className="flex flex-col items-center gap-1">
                                    <span className="text-[10px] font-bold opacity-50 text-slate-500">QUI</span>
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-400">19</div>
                                </div>
                                <div className="flex flex-col items-center gap-1">
                                    <span className="text-[10px] font-bold opacity-50 text-slate-500">SEX</span>
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-400">20</div>
                                </div>
                                <div className="flex flex-col items-center gap-1">
                                    <span className="text-[10px] font-bold text-primary">SÁB</span>
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black bg-primary text-on-primary shadow-md">21</div>
                                </div>
                                <div className="flex flex-col items-center gap-1">
                                    <span className="text-[10px] font-bold opacity-50 text-slate-500">DOM</span>
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-400">22</div>
                                </div>
                            </div>
                            
                            {/* Today Schedule */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-bold text-sm uppercase tracking-wider text-primary">Agenda do Dia</h4>
                                    <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold">Hoje</span>
                                </div>
                                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary shrink-0">
                                        <span className="material-symbols-outlined text-xl">video_camera_front</span>
                                    </div>
                                    <div className="space-y-0.5">
                                        <h5 className="font-bold text-sm text-slate-800 dark:text-slate-200">Mentoria VIP Individual</h5>
                                        <p className="text-xs text-slate-500">19:00 • Google Meet</p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Tomorrow Schedule */}
                            <div className="space-y-3">
                                <h4 className="font-bold text-sm uppercase tracking-wider text-slate-400">Amanhã</h4>
                                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800/80 flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-on-secondary shrink-0">
                                        <span className="material-symbols-outlined text-xl">school</span>
                                    </div>
                                    <div className="space-y-0.5">
                                        <h5 className="font-bold text-sm text-slate-800 dark:text-slate-200">Arquitetura Cloud Avançada</h5>
                                        <p className="text-xs text-slate-500">08:00 • Aula ao Vivo</p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Upcoming Events */}
                            <div className="space-y-3">
                                <h4 className="font-bold text-sm uppercase tracking-wider text-slate-400">Próximos Eventos</h4>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group">
                                        <div className="w-2 h-2 rounded-full bg-error shrink-0"></div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">Check-in de Sprint</p>
                                            <p className="text-[10px] text-slate-400">Sexta, 27 Set • 14:00</p>
                                        </div>
                                        <span className="material-symbols-outlined text-sm text-slate-300 group-hover:translate-x-0.5 transition-transform">chevron_right</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group">
                                        <div className="w-2 h-2 rounded-full bg-secondary shrink-0"></div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">Laboratório de Microserviços</p>
                                            <p className="text-[10px] text-slate-400">Quinta, 26 Set • 10:00</p>
                                        </div>
                                        <span className="material-symbols-outlined text-sm text-slate-300 group-hover:translate-x-0.5 transition-transform">chevron_right</span>
                                    </div>
                                </div>
                            </div>
                            
                            <button className="w-full py-4 rounded-2xl bg-gradient-to-br from-primary to-[#7b9cff] text-on-primary font-bold flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-primary/20 active:scale-95">
                                <span>Ver Planejamento Completo</span>
                                <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </button>
                        </section>
                    </div>

                    {/* Right Column: Monthly Calendar View */}
                    <div className="flex-1 min-w-0">
                        {/* Calendar Header & View Switcher */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                            <div className="flex items-center gap-4">
                                <h2 className="font-headline font-extrabold text-3xl text-slate-800 dark:text-slate-100 tracking-tight">Setembro 2024</h2>
                                <div className="flex gap-1">
                                    <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-900 text-slate-500 hover:bg-primary/10 hover:text-primary transition-all border border-slate-100 dark:border-slate-800/80 shadow-sm active:scale-95">
                                        <span className="material-symbols-outlined">chevron_left</span>
                                    </button>
                                    <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-900 text-slate-500 hover:bg-primary/10 hover:text-primary transition-all border border-slate-100 dark:border-slate-800/80 shadow-sm active:scale-95">
                                        <span className="material-symbols-outlined">chevron_right</span>
                                    </button>
                                </div>
                            </div>
                            <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl self-start md:self-auto shadow-inner">
                                <button className="px-4 py-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 text-sm font-medium transition-colors">Semana</button>
                                <button className="px-6 py-2 bg-primary text-on-primary rounded-lg shadow-md font-bold text-sm">Mês</button>
                                <button className="px-4 py-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 text-sm font-medium transition-colors">Lista</button>
                            </div>
                        </div>

                        {/* Monthly Grid */}
                        <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm shadow-slate-100/50 overflow-hidden">
                            {/* Weekday Names */}
                            <div className="grid grid-cols-7 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
                                <div className="py-4 text-center text-xs font-bold uppercase tracking-widest text-slate-400">Dom</div>
                                <div className="py-4 text-center text-xs font-bold uppercase tracking-widest text-slate-400">Seg</div>
                                <div className="py-4 text-center text-xs font-bold uppercase tracking-widest text-slate-400">Ter</div>
                                <div className="py-4 text-center text-xs font-bold uppercase tracking-widest text-slate-400">Qua</div>
                                <div className="py-4 text-center text-xs font-bold uppercase tracking-widest text-slate-400">Qui</div>
                                <div className="py-4 text-center text-xs font-bold uppercase tracking-widest text-slate-400">Sex</div>
                                <div className="py-4 text-center text-xs font-bold uppercase tracking-widest text-slate-400">Sáb</div>
                            </div>
                            
                            {/* Days Grid */}
                            <div className="grid grid-cols-7 auto-rows-[120px] divide-x divide-y divide-slate-100 dark:divide-slate-800 border-l border-t border-slate-100 dark:border-slate-800">
                                {/* Row 1 */}
                                <div className="p-2 opacity-20 bg-slate-50/35 dark:bg-slate-950/20">
                                    <span className="text-sm font-bold ml-2 mt-1 block">25</span>
                                </div>
                                <div className="p-2 opacity-20 bg-slate-50/35 dark:bg-slate-950/20">
                                    <span className="text-sm font-bold ml-2 mt-1 block">26</span>
                                </div>
                                <div className="p-2 opacity-20 bg-slate-50/35 dark:bg-slate-950/20">
                                    <span className="text-sm font-bold ml-2 mt-1 block">27</span>
                                </div>
                                <div className="p-2 opacity-20 bg-slate-50/35 dark:bg-slate-950/20">
                                    <span className="text-sm font-bold ml-2 mt-1 block">28</span>
                                </div>
                                <div className="p-2 opacity-20 bg-slate-50/35 dark:bg-slate-950/20">
                                    <span className="text-sm font-bold ml-2 mt-1 block">29</span>
                                </div>
                                <div className="p-2 opacity-20 bg-slate-50/35 dark:bg-slate-950/20">
                                    <span className="text-sm font-bold ml-2 mt-1 block">30</span>
                                </div>
                                <div className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group">
                                    <span className="text-sm font-bold ml-2 mt-1 block text-slate-400">1</span>
                                </div>
                                
                                {/* Row 2 */}
                                <div className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group">
                                    <span className="text-sm font-bold ml-2 mt-1 block text-slate-600 dark:text-slate-400">2</span>
                                    <div className="mt-2">
                                        <div className="px-2 py-1 rounded bg-primary/10 text-primary text-[9px] font-bold truncate">Aula ao Vivo</div>
                                    </div>
                                </div>
                                <div className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group">
                                    <span className="text-sm font-bold ml-2 mt-1 block text-slate-600 dark:text-slate-400">3</span>
                                </div>
                                <div className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group">
                                    <span className="text-sm font-bold ml-2 mt-1 block text-slate-600 dark:text-slate-400">4</span>
                                    <div className="mt-2 flex gap-1 justify-center">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                                    </div>
                                </div>
                                <div className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group">
                                    <span className="text-sm font-bold ml-2 mt-1 block text-slate-600 dark:text-slate-400">5</span>
                                </div>
                                <div className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group">
                                    <span className="text-sm font-bold ml-2 mt-1 block text-slate-600 dark:text-slate-400">6</span>
                                    <div className="mt-2">
                                        <div className="px-2 py-1 rounded bg-red-100 dark:bg-red-950/40 text-red-650 dark:text-red-400 text-[9px] font-bold truncate">Prova Final</div>
                                    </div>
                                </div>
                                <div className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group">
                                    <span className="text-sm font-bold ml-2 mt-1 block text-slate-600 dark:text-slate-400">7</span>
                                </div>
                                <div className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group">
                                    <span className="text-sm font-bold ml-2 mt-1 block text-slate-600 dark:text-slate-400">8</span>
                                </div>
                                
                                {/* Row 3 */}
                                <div className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group">
                                    <span className="text-sm font-bold ml-2 mt-1 block text-slate-600 dark:text-slate-400">9</span>
                                    <div className="mt-2">
                                        <div className="px-2 py-1 rounded bg-primary/10 text-primary text-[9px] font-bold truncate">Aula ao Vivo</div>
                                    </div>
                                </div>
                                <div className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group">
                                    <span className="text-sm font-bold ml-2 mt-1 block text-slate-600 dark:text-slate-400">10</span>
                                </div>
                                <div className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group">
                                    <span className="text-sm font-bold ml-2 mt-1 block text-slate-600 dark:text-slate-400">11</span>
                                </div>
                                <div className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group">
                                    <span className="text-sm font-bold ml-2 mt-1 block text-slate-600 dark:text-slate-400">12</span>
                                    <div className="mt-2">
                                        <div className="px-2 py-1 rounded bg-sky-100 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 text-[9px] font-bold truncate">Laboratório</div>
                                    </div>
                                </div>
                                <div className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group">
                                    <span className="text-sm font-bold ml-2 mt-1 block text-slate-600 dark:text-slate-400">13</span>
                                </div>
                                <div className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group">
                                    <span className="text-sm font-bold ml-2 mt-1 block text-slate-600 dark:text-slate-400">14</span>
                                </div>
                                <div className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group">
                                    <span className="text-sm font-bold ml-2 mt-1 block text-slate-600 dark:text-slate-400">15</span>
                                </div>
                                
                                {/* Row 4 */}
                                <div className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group">
                                    <span className="text-sm font-bold ml-2 mt-1 block text-slate-600 dark:text-slate-400">16</span>
                                    <div className="mt-2">
                                        <div className="px-2 py-1 rounded bg-primary/10 text-primary text-[9px] font-bold truncate">Aula ao Vivo</div>
                                    </div>
                                </div>
                                <div className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group">
                                    <span className="text-sm font-bold ml-2 mt-1 block text-slate-600 dark:text-slate-400">17</span>
                                </div>
                                <div className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group">
                                    <span className="text-sm font-bold ml-2 mt-1 block text-slate-600 dark:text-slate-400">18</span>
                                </div>
                                <div className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group">
                                    <span className="text-sm font-bold ml-2 mt-1 block text-slate-600 dark:text-slate-400">19</span>
                                </div>
                                <div className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group">
                                    <span className="text-sm font-bold ml-2 mt-1 block text-slate-600 dark:text-slate-400">20</span>
                                    <div className="mt-2 flex gap-1 justify-center">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                                    </div>
                                </div>
                                {/* Today Highlighted */}
                                <div className="p-2 bg-primary/5 dark:bg-primary-container/10 border-2 border-primary/20 transition-colors cursor-pointer relative group">
                                    <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-primary text-on-primary text-[8px] font-black uppercase">Hoje</div>
                                    <span className="text-sm font-black ml-2 mt-1 block text-primary">21</span>
                                    <div className="mt-2">
                                        <div className="px-2 py-1 rounded bg-primary text-on-primary text-[9px] font-bold truncate shadow-sm">Mentoria VIP</div>
                                    </div>
                                </div>
                                <div className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group">
                                    <span className="text-sm font-bold ml-2 mt-1 block text-slate-600 dark:text-slate-400">22</span>
                                    <div className="mt-2">
                                        <div className="px-2 py-1 rounded bg-red-100 dark:bg-red-950/40 text-red-650 dark:text-red-400 text-[9px] font-bold truncate">Check-in Sprint</div>
                                    </div>
                                </div>
                                
                                {/* Row 5 */}
                                <div className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group">
                                    <span className="text-sm font-bold ml-2 mt-1 block text-slate-600 dark:text-slate-400">23</span>
                                </div>
                                <div className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group">
                                    <span className="text-sm font-bold ml-2 mt-1 block text-slate-600 dark:text-slate-400">24</span>
                                </div>
                                <div className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group">
                                    <span className="text-sm font-bold ml-2 mt-1 block text-slate-600 dark:text-slate-400">25</span>
                                </div>
                                <div className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group">
                                    <span className="text-sm font-bold ml-2 mt-1 block text-slate-600 dark:text-slate-400">26</span>
                                </div>
                                <div className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group">
                                    <span className="text-sm font-bold ml-2 mt-1 block text-slate-600 dark:text-slate-400">27</span>
                                </div>
                                <div className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group">
                                    <span className="text-sm font-bold ml-2 mt-1 block text-slate-600 dark:text-slate-400">28</span>
                                </div>
                                <div className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group">
                                    <span className="text-sm font-bold ml-2 mt-1 block text-slate-600 dark:text-slate-400">29</span>
                                </div>
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="mt-6 flex flex-wrap gap-6 items-center justify-center p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-primary shrink-0"></span>
                                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Aulas ao Vivo</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-error shrink-0"></span>
                                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Entregas / Provas</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-emerald-600 shrink-0"></span>
                                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Mentoria</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-secondary shrink-0"></span>
                                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Laboratórios</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* FAB for adding events */}
            <button className="fixed bottom-24 right-4 lg:bottom-8 lg:right-8 w-16 h-16 bg-primary text-on-primary rounded-2xl shadow-xl shadow-primary/30 flex items-center justify-center group hover:scale-110 active:scale-95 transition-all duration-200 z-50">
                <span className="material-symbols-outlined text-3xl group-hover:rotate-90 transition-transform">add</span>
            </button>
        </StudentLayout>
    );
}
