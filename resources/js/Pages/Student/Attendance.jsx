import StudentLayout from '@/Layouts/StudentLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

export default function Attendance() {
    const [semester, setSemester] = useState('1º Semestre 2024');

    return (
        <StudentLayout>
            <Head title="Frequência & Desempenho - PlayUp" />
            
            <div className="p-8 max-w-7xl mx-auto space-y-8">
                {/* Header Title with Semester Filter */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 font-headline tracking-tight">Meu Desempenho</h2>
                        <p className="text-sm text-slate-500 font-medium">Acompanhe sua evolução e mantenha o foco nos seus objetivos.</p>
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
                <section className="bg-[#f7f5ff] dark:bg-[#13112b] rounded-3xl p-8 relative overflow-hidden flex flex-col md:flex-row items-center border border-purple-50 dark:border-purple-950/20">
                    <div className="relative z-10 max-w-2xl space-y-6">
                        <div className="flex gap-3">
                            <span className="material-symbols-outlined text-primary bg-white dark:bg-slate-800 p-2.5 rounded-xl shadow-sm text-xl">trending_up</span>
                            <span className="material-symbols-outlined text-primary bg-white dark:bg-slate-800 p-2.5 rounded-xl shadow-sm text-xl">calendar_today</span>
                            <span className="material-symbols-outlined text-primary bg-white dark:bg-slate-800 p-2.5 rounded-xl shadow-sm text-xl">military_tech</span>
                        </div>
                        <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 font-headline leading-tight">
                            👋 Olá! Seu desempenho está excelente!
                        </h2>
                        <p className="text-base lg:text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                            Você concluiu <span className="text-primary font-black">72%</span> do curso e mantém <span className="text-emerald-600 dark:text-emerald-500 font-black">94%</span> de frequência. Continue assim para conquistar seu certificado.
                        </p>
                    </div>
                    <div className="ml-auto relative shrink-0 hidden lg:block">
                        <img 
                            className="w-72 h-auto drop-shadow-2xl translate-y-4 object-contain" 
                            alt="Progress 3D Mascot"
                            src="https://lh3.googleusercontent.com/aida/AP1WRLvE4f8EqZCBrVmAtDBX-AY0IJd8BwB7eImTYsiqy5DPuUAsPxwpJi5uxHklg4RufZ8CjgwgASb9uUc9dOIBtb0GYp3AYeM_g3jUSzAenXpQTAeTM8rIShPHD90jiidJ-27Tc2bKy0J0pRb5t1cRsMT47NX8mGlc5BlPglnpPQmcmpWPEs3fgWS7LPZxQdP4qXWcO4stAaVeWXxvqc7dgAXbIpEm2TBseV8ezRp9yA3NWRxBi2v73Msi2cw"
                        />
                    </div>
                </section>

                {/* Top Cards (Progresso & Frequência) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Card 1: Progresso */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col gap-5 relative overflow-hidden">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-[10px] font-black tracking-widest text-primary uppercase leading-none">📈 PROGRESSO</p>
                                <h3 className="text-4xl font-black text-slate-800 dark:text-slate-200 mt-2">72%</h3>
                            </div>
                            <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">Curso em andamento</div>
                        </div>
                        <div className="w-full h-3 bg-slate-100 dark:bg-slate-850 rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: '72%' }}></div>
                        </div>
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 leading-none">
                            <span className="material-symbols-outlined text-base">menu_book</span> 8 aulas restantes
                        </p>
                    </div>
                    
                    {/* Card 2: Frequência */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col gap-5 relative overflow-hidden">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-[10px] font-black tracking-widest text-emerald-600 dark:text-emerald-500 uppercase leading-none">📅 FREQUÊNCIA</p>
                                <h3 className="text-4xl font-black text-slate-800 dark:text-slate-200 mt-2">94%</h3>
                            </div>
                            <div className="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-500 px-3 py-1 rounded-full text-xs font-bold">Excelente presença</div>
                        </div>
                        <div className="w-full h-3 bg-slate-100 dark:bg-slate-850 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: '94%' }}></div>
                        </div>
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 leading-none">
                            <span className="material-symbols-outlined text-base">verified</span> 42 dias consecutivos
                        </p>
                    </div>
                </div>

                {/* Dynamic Area */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Section 1: Progresso Geral */}
                    <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col gap-6">
                        <div className="flex justify-between items-center">
                            <h4 className="font-headline font-bold text-slate-800 dark:text-slate-200">Progresso Geral</h4>
                            <span className="material-symbols-outlined text-slate-400">info</span>
                        </div>
                        <div className="bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-950/25 p-4 rounded-xl flex items-center gap-3">
                            <div className="bg-emerald-500 rounded-full p-1 text-white flex items-center justify-center">
                                <span className="material-symbols-outlined text-sm font-black">check</span>
                            </div>
                            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-500">Você está no caminho certo!</p>
                        </div>
                        <div className="space-y-6 flex-1">
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                                    <span>Marketing Digital</span>
                                    <span>72%</span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary" style={{ width: '72%' }}></div>
                                </div>
                            </div>
                            <div className="space-y-2 opacity-60">
                                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                                    <span>Power BI</span>
                                    <span>31%</span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-secondary" style={{ width: '31%' }}></div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                                    <span>Excel Avançado</span>
                                    <span className="text-emerald-600 dark:text-emerald-500">100%</span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500" style={{ width: '100%' }}></div>
                                </div>
                            </div>
                        </div>
                        <button className="w-full py-3 text-xs font-bold text-primary hover:bg-primary/5 transition-colors rounded-xl border border-primary/20">
                            Ver todos os cursos
                        </button>
                    </div>

                    {/* Section 2: Módulos do Curso */}
                    <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col gap-6">
                        <h4 className="font-headline font-bold text-slate-800 dark:text-slate-200">Módulos do Curso</h4>
                        <div className="flex-1 space-y-4 max-h-[280px] overflow-y-auto no-scrollbar pr-1">
                            <div className="flex items-center gap-4 group">
                                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-sm font-black">check</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate">Introdução ao Marketing</p>
                                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Concluído</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 group">
                                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-sm font-black">check</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate">Análise de Público</p>
                                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Concluído</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 group">
                                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center border-4 border-primary-container shrink-0">
                                    <span className="material-symbols-outlined text-sm">play_arrow</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-primary truncate">SEO & Conteúdo</p>
                                    <p className="text-[10px] text-primary font-bold uppercase tracking-wider mt-0.5">Em andamento</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 opacity-40">
                                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center shrink-0 text-xs font-black">
                                    04
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate">Mídias Pagas</p>
                                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Bloqueado</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 opacity-40">
                                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center shrink-0 text-xs font-black">
                                    05
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate">E-mail Marketing</p>
                                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Bloqueado</p>
                                </div>
                            </div>
                        </div>
                        <button className="w-full py-3.5 bg-primary text-white text-sm font-bold rounded-2xl hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.98]">
                            Ver conteúdo do curso
                        </button>
                    </div>

                    {/* Section 3: Próximas Etapas & Certificação */}
                    <div className="lg:col-span-3 space-y-6 flex flex-col justify-between">
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-5">
                            <h4 className="font-headline font-bold text-slate-800 dark:text-slate-200">Próximas Etapas</h4>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-xl border border-primary/10">
                                    <span className="material-symbols-outlined text-primary text-lg">play_circle</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">Aula 23: Backlinks</p>
                                        <span className="inline-block text-[8px] bg-primary text-white px-2 py-0.5 rounded-full font-bold uppercase mt-1">Próxima Aula</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-850 rounded-xl">
                                    <span className="material-symbols-outlined text-slate-400 text-lg">assignment</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">Atividade SEO</p>
                                        <p className="text-[9px] text-red-500 font-bold mt-1">Pendente</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-850 rounded-xl opacity-60">
                                    <span className="material-symbols-outlined text-slate-400 text-lg">quiz</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">Prova Final</p>
                                        <p className="text-[9px] text-slate-500 font-medium mt-1">Agendada (20/Out)</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-sm space-y-4 relative overflow-hidden flex-1 flex flex-col justify-center min-h-[140px]">
                            <div className="absolute -right-4 -top-4 opacity-10">
                                <span className="material-symbols-outlined text-8xl">military_tech</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-emerald-400 font-bold">military_tech</span>
                                <h4 className="font-headline font-bold text-sm">Certificação</h4>
                            </div>
                            <p className="text-[11px] text-slate-400 leading-relaxed">
                                Faltam para seu certificado: 8 aulas, 2 atividades, 1 prova.
                            </p>
                            <div className="space-y-1.5">
                                <div className="flex justify-between text-[9px] font-black uppercase text-slate-300">
                                    <span>Progresso Final</span>
                                    <span>72%</span>
                                </div>
                                <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500" style={{ width: '72%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Row (3 Cards) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Card 1: Evolução do Progresso */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
                        <h4 className="font-headline font-bold text-slate-800 dark:text-slate-200">Evolução do Progresso</h4>
                        <div className="h-40 w-full relative flex items-end justify-between px-2 pt-4">
                            <div className="absolute inset-x-0 bottom-0 border-b border-slate-200 dark:border-slate-850"></div>
                            <div className="absolute inset-y-0 left-0 border-l border-slate-200 dark:border-slate-850"></div>
                            
                            <div className="flex flex-col items-center gap-2 group cursor-pointer z-10">
                                <div className="w-8 bg-primary/20 rounded-t-lg transition-all h-[45%] group-hover:bg-primary/30" title="Fev: 45%"></div>
                                <span className="text-[10px] font-bold text-slate-400">Fev</span>
                            </div>
                            <div className="flex flex-col items-center gap-2 group cursor-pointer z-10">
                                <div className="w-8 bg-primary/40 rounded-t-lg transition-all h-[52%] group-hover:bg-primary/50" title="Mar: 52%"></div>
                                <span className="text-[10px] font-bold text-slate-400">Mar</span>
                            </div>
                            <div className="flex flex-col items-center gap-2 group cursor-pointer z-10">
                                <div className="w-8 bg-primary/60 rounded-t-lg transition-all h-[61%] group-hover:bg-primary/70" title="Abr: 61%"></div>
                                <span className="text-[10px] font-bold text-slate-400">Abr</span>
                            </div>
                            <div className="flex flex-col items-center gap-2 group cursor-pointer z-10">
                                <div className="w-8 bg-primary rounded-t-lg transition-all h-[72%] group-hover:scale-y-[1.02]" title="Mai: 72%"></div>
                                <span className="text-[10px] font-bold text-primary">Mai</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Card 2: Comparativo com a turma */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-6 flex flex-col justify-between">
                        <h4 className="font-headline font-bold text-slate-800 dark:text-slate-200">Comparativo com a turma</h4>
                        <div className="space-y-4 flex-1">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
                                    <span className="text-xs font-semibold text-slate-500">Sua evolução</span>
                                </div>
                                <span className="text-sm font-black text-primary">72%</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700"></div>
                                    <span className="text-xs font-semibold text-slate-500">Média da turma</span>
                                </div>
                                <span className="text-sm font-black text-slate-700 dark:text-slate-300">58%</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                                    <span className="text-xs font-semibold text-slate-500">Melhores alunos</span>
                                </div>
                                <span className="text-sm font-black text-emerald-600 dark:text-emerald-500">85%</span>
                            </div>
                        </div>
                        <div className="bg-emerald-50/50 dark:bg-emerald-950/10 p-3 rounded-xl flex items-center gap-2 border border-emerald-100 dark:border-emerald-950/20 mt-4">
                            <span className="text-base shrink-0">🏆</span>
                            <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-500 uppercase tracking-wider">
                                Você está acima da média da turma.
                            </p>
                        </div>
                    </div>
                    
                    {/* Card 3: Próximos Desafios */}
                    <div className="bg-primary text-white p-6 rounded-3xl shadow-sm flex flex-col justify-between overflow-hidden relative min-h-[220px]">
                        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                        <div className="space-y-3 z-10">
                            <span className="material-symbols-outlined text-3xl">rocket_launch</span>
                            <h4 className="font-headline font-bold text-xl leading-tight">Potencialize sua jornada!</h4>
                            <p className="text-xs text-purple-100 leading-relaxed font-medium">
                                Novos fóruns de discussão foram abertos no módulo de SEO. Participe para ganhar bônus de performance.
                            </p>
                        </div>
                        <button className="bg-white text-primary text-xs font-black py-3 px-6 rounded-xl hover:bg-slate-50 transition-colors active:scale-95 z-10 w-fit">
                            IR PARA O FÓRUM
                        </button>
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
}
