import StudentLayout from '@/Layouts/StudentLayout';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function ReportCard() {
    const [semester, setSemester] = useState('1º Semestre / 2024');
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowToast(true);
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    const grades = [
        { name: 'Desenvolvimento Web Fullstack', teacher: 'Carlos Eduardo', b1: '9.5', b2: '8.8', b3: '9.2', b4: '-', average: '9.1', status: 'Aprovado' },
        { name: 'Arquitetura de Software', teacher: 'Juliana Moraes', b1: '8.0', b2: '7.5', b3: '8.5', b4: '-', average: '8.0', status: 'Aprovado' },
        { name: 'Inteligência Artificial & UX', teacher: 'Ricardo Silva', b1: '10.0', b2: '9.8', b3: '10.0', b4: '-', average: '9.9', status: 'Aprovado' },
        { name: 'Estrutura de Dados II', teacher: 'Fernando Lopes', b1: '7.2', b2: '6.8', b3: '7.0', b4: '-', average: '7.0', status: 'Cursando' },
        { name: 'Gestão de Projetos Ágeis', teacher: 'Alice Santos', b1: '9.0', b2: '8.5', b3: '9.0', b4: '-', average: '8.8', status: 'Aprovado' }
    ];

    return (
        <StudentLayout>
            <Head title="Boletim Acadêmico - PlayUp" />
            
            <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 lg:space-y-8">
                {/* Header Title with Semester Filter */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100 font-headline tracking-tight">Boletim Acadêmico</h2>
                        <p className="text-sm text-slate-500 font-medium">Acompanhe seu desempenho e evolução acadêmica.</p>
                    </div>
                    
                    <div className="relative bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 px-4 py-2.5 rounded-full flex items-center gap-3 shadow-sm min-w-[200px] shrink-0">
                        <span className="material-symbols-outlined text-primary text-sm">calendar_today</span>
                        <select 
                            className="bg-transparent border-none focus:ring-0 text-sm font-semibold text-slate-600 dark:text-slate-300 appearance-none pr-8 py-0 w-full cursor-pointer"
                            value={semester}
                            onChange={(e) => setSemester(e.target.value)}
                        >
                            <option value="1º Semestre / 2024">1º Semestre / 2024</option>
                            <option value="2º Semestre / 2023">2º Semestre / 2023</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-4 pointer-events-none text-xs text-slate-400">expand_more</span>
                    </div>
                </div>

                {/* Hero Banner */}
                <section className="bg-[#f7f5ff] dark:bg-[#13112b] rounded-3xl shadow-sm border border-purple-50 dark:border-purple-950/20 overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[320px]">
                    <div className="lg:col-span-5 p-8 lg:p-10 space-y-6 flex flex-col justify-center">
                        <div className="space-y-2">
                            <p className="text-sm font-bold text-purple-550 text-slate-500 dark:text-slate-400">Sua jornada neste semestre</p>
                            <h3 className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold text-slate-800 dark:text-slate-100 leading-tight">Você está no caminho certo!</h3>
                            <p className="text-base text-slate-500 dark:text-slate-400">
                                Sua média geral é <span className="font-extrabold text-slate-800 dark:text-slate-200">8,3</span> e você está acima da média da turma.
                            </p>
                        </div>
                        <div className="space-y-3 max-w-sm">
                            <div className="flex justify-between items-center text-xs">
                                <span className="font-bold text-slate-700 dark:text-slate-300">Progresso do semestre</span>
                                <span className="font-black text-[#6d4aff]">72%</span>
                            </div>
                            <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-[#6d4aff] rounded-full" style={{ width: '72%' }}></div>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                Faltam apenas <span className="font-extrabold text-slate-700 dark:text-slate-300">2</span> avaliações para concluir o semestre.
                            </p>
                        </div>
                    </div>
                    
                    <div className="lg:col-span-3 flex items-center justify-center p-6 bg-slate-50/40 dark:bg-slate-900/10 border-y lg:border-y-0 lg:border-x border-slate-100 dark:border-slate-800/80">
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center space-y-4 w-full">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Situação Atual</p>
                            <div className="flex items-center gap-2">
                                <span className="text-xl font-black text-emerald-600 dark:text-emerald-500 tracking-wider">APROVADO</span>
                                <span className="material-symbols-outlined text-emerald-500 font-black" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                            </div>
                            <button className="w-full py-3 bg-[#6d4aff] hover:bg-[#5b3adb] text-white text-xs font-bold rounded-full transition-all active:scale-[0.98]">
                                Ver detalhes da situação
                            </button>
                        </div>
                    </div>
                    
                    <div className="lg:col-span-4 relative flex items-end justify-center overflow-hidden min-h-[220px] lg:min-h-0 bg-purple-50/20 dark:bg-slate-950/20">
                        <img 
                            alt="3D Student Illustration" 
                            className="h-[105%] lg:h-[110%] w-auto object-contain object-bottom filter drop-shadow-md" 
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCGKByecGMPaLTddGBV2msIL08IHiX7vWsd-NnLbkMj09lNIcUeXDqxPskQJOYSTHiNbUZgdMCrIyDDOYUYrkcnth_dMkGrgL4dEmdYjpQnkn5mfyJOevP9B4xlt0fHK8JciohZNVD4f0-UW9NUrV-AXAjLYHGcUt9InsvWi4gKR78gS9XdVE8Q_EbmlRP6VE2Uoyx4WlpWnC81DSdwkIYcR_vh2VVBLYI6SKVQ7xs1FgnputKIS0oVoQ"
                        />
                    </div>
                </section>

                {/* Metric Cards (Bento Grid) */}
                <section className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
                    {/* Card 1 */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:-translate-y-1 transition-all duration-200">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4 shrink-0">
                            <span className="material-symbols-outlined">star_rate</span>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">MÉDIA GERAL</p>
                            <p className="text-3xl font-black text-slate-800 dark:text-slate-200">8,3</p>
                            <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-500 mt-2">Acima da média da turma</p>
                        </div>
                    </div>
                    {/* Card 2 */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:-translate-y-1 transition-all duration-200">
                        <div className="w-12 h-12 bg-sky-50 dark:bg-slate-850 rounded-xl flex items-center justify-center text-sky-600 mb-4 shrink-0">
                            <span className="material-symbols-outlined">calendar_month</span>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">FREQUÊNCIA GERAL</p>
                            <p className="text-3xl font-black text-slate-800 dark:text-slate-200">94%</p>
                            <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-500 mt-2">Excelente frequência</p>
                        </div>
                    </div>
                    {/* Card 3 */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:-translate-y-1 transition-all duration-200">
                        <div className="w-12 h-12 bg-emerald-550/10 bg-emerald-50 dark:bg-slate-850 rounded-xl flex items-center justify-center text-emerald-600 mb-4 shrink-0">
                            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">SITUAÇÃO</p>
                            <p className="text-2xl font-black text-slate-800 dark:text-slate-200">Aprovado</p>
                            <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-500 mt-2">Parabéns! 🥳</p>
                        </div>
                    </div>
                    {/* Card 4 */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:-translate-y-1 transition-all duration-200">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4 shrink-0">
                            <span className="material-symbols-outlined">menu_book</span>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">DISCIPLINAS</p>
                            <p className="text-3xl font-black text-slate-800 dark:text-slate-200">7 / 8</p>
                            <p className="text-[10px] font-bold text-primary mt-2">Concluídas</p>
                        </div>
                    </div>
                    {/* Card 5 */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:-translate-y-1 transition-all duration-200">
                        <div className="w-12 h-12 bg-sky-50 dark:bg-slate-850 rounded-xl flex items-center justify-center text-sky-600 mb-4 shrink-0">
                            <span className="material-symbols-outlined">groups</span>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">POSIÇÃO NA TURMA</p>
                            <p className="text-3xl font-black text-slate-800 dark:text-slate-200">3º / 32</p>
                            <p className="text-[10px] font-bold text-sky-650 dark:text-sky-500 mt-2">Entre os melhores!</p>
                        </div>
                    </div>
                </section>

                {/* Grades Table Section */}
                <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="p-6 lg:p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <h4 className="font-headline text-xl font-extrabold text-slate-800 dark:text-slate-200">Detalhamento por Disciplina</h4>
                        <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-300 rounded-full text-xs font-bold transition-all shadow-sm">
                            <span className="material-symbols-outlined text-sm">download</span>
                            Baixar PDF
                        </button>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 dark:bg-slate-900/30">
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Disciplina</th>
                                    <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">B1</th>
                                    <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">B2</th>
                                    <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">B3</th>
                                    <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">B4</th>
                                    <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Média</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Situação</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {grades.map((grade, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                                        <td className="px-8 py-5">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-tight">
                                                    {grade.name}
                                                </span>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                                                    Prof. {grade.teacher}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-5 text-sm font-bold text-slate-700 dark:text-slate-300 text-center">{grade.b1}</td>
                                        <td className="px-4 py-5 text-sm font-bold text-slate-700 dark:text-slate-300 text-center">{grade.b2}</td>
                                        <td className="px-4 py-5 text-sm font-bold text-slate-700 dark:text-slate-300 text-center">{grade.b3}</td>
                                        <td className="px-4 py-5 text-sm font-semibold text-slate-300 dark:text-slate-600 text-center">{grade.b4}</td>
                                        <td className="px-4 py-5 text-sm font-black text-primary text-center">{grade.average}</td>
                                        <td className="px-8 py-5 text-right">
                                            <span className={`px-3 py-1 text-[9px] font-black uppercase rounded-full tracking-wider ${
                                                grade.status === 'Aprovado' 
                                                    ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-500' 
                                                    : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                                            }`}>
                                                {grade.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex justify-center bg-slate-50/20 dark:bg-slate-900/10">
                        <button className="text-primary hover:text-primary-dim font-bold text-xs uppercase tracking-widest hover:underline transition-all">
                            Ver todas as disciplinas
                        </button>
                    </div>
                </section>
            </div>

            {/* Sticky Bottom Achievement Notification */}
            {showToast && (
                <div className="fixed bottom-24 left-4 right-4 sm:left-auto lg:bottom-8 lg:right-8 bg-gradient-to-r from-primary to-[#7b9cff] text-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-4 z-50 animate-slide-up duration-300">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>emoji_events</span>
                    </div>
                    <div>
                        <p className="font-bold text-sm leading-none">Nova Conquista!</p>
                        <p className="text-xs opacity-90 mt-1">Você alcançou a média top 5% da instituição.</p>
                    </div>
                    <button className="ml-4 opacity-60 hover:opacity-100 shrink-0" onClick={() => setShowToast(false)}>
                        <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                </div>
            )}
        </StudentLayout>
    );
}
