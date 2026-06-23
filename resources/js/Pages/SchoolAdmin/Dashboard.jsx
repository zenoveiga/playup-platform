import SchoolAdminLayout from '@/Layouts/SchoolAdminLayout';
import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Dashboard() {
    // Determine the correct Layout
    const Layout = SchoolAdminLayout;

    // Toast Notification State
    const [notification, setNotification] = useState(null);
    
    // Animation trigger for chart bars
    const [animateBars, setAnimateBars] = useState(false);

    // Initial chart data
    const chartData = [
        { month: 'Jan', value: 30, peak: false },
        { month: 'Fev', value: 45, peak: false },
        { month: 'Mar', value: 60, peak: false },
        { month: 'Abr', value: 85, peak: false },
        { month: 'Mai', value: 95, peak: true, peakLabel: 'Pico: 124' },
        { month: 'Jun', value: 70, peak: false },
        { month: 'Jul', value: 55, peak: false },
        { month: 'Ago', value: 65, peak: false },
        { month: 'Set', value: 75, peak: false },
        { month: 'Out', value: 80, peak: false },
        { month: 'Nov', value: 60, peak: false },
        { month: 'Dez', value: 50, peak: false },
    ];

    useEffect(() => {
        // Trigger the grow animation shortly after component mount
        const timer = setTimeout(() => setAnimateBars(true), 150);
        return () => clearTimeout(timer);
    }, []);

    // Toast triggers
    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3500);
    };

    return (
        <Layout>
            <Head title="Gestão Escolar | PlayUp Velocity" />

            {/* Toast Notification */}
            {notification && (
                <div className={`fixed top-20 right-8 z-50 flex items-center gap-2 px-6 py-4 rounded-xl border shadow-xl animate-in slide-in-from-top-4 duration-300 ${
                    notification.type === 'error'
                        ? 'bg-rose-50 dark:bg-rose-955 text-[#b31b25] border-rose-200 dark:border-rose-900/50'
                        : 'bg-emerald-50 dark:bg-emerald-955 text-[#006a35] dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50'
                }`}>
                    <span className="material-symbols-outlined text-lg">
                        {notification.type === 'error' ? 'error' : 'check_circle'}
                    </span>
                    <span className="text-sm font-bold">{notification.message}</span>
                </div>
            )}

            <div className="p-8 space-y-8 max-w-7xl mx-auto animate-in fade-in duration-700">
                {/* PAGE HEADER */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                    <div className="space-y-1">
                        <h1 className="font-headline font-extrabold text-4xl text-on-surface dark:text-white tracking-tight">Gestão Escolar</h1>
                        <p className="text-on-surface-variant dark:text-outline-variant font-medium opacity-80">Visão geral e estratégica da unidade operacional (Centro)</p>
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto">
                        <button 
                            onClick={() => showNotification("Relatório PDF geral da unidade gerado com sucesso!")}
                            className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl border border-outline-variant/30 dark:border-slate-700 text-on-surface-variant dark:text-outline-variant font-bold text-sm hover:bg-surface-container-low dark:hover:bg-slate-800 transition-all cursor-pointer text-center"
                        >
                            Exportar PDF
                        </button>
                        <button 
                            onClick={() => showNotification("Visualizando dados do período de Maio/2026...", "info")}
                            className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-lg">calendar_today</span>
                            <span>Maio, 2026</span>
                        </button>
                    </div>
                </div>

                {/* STRATEGIC KPIs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* KPI 1: Alunos */}
                    <Link 
                        href={route('school-admin.students.index')}
                        className="bg-surface-container-lowest dark:bg-slate-900 p-6 rounded-xl relative overflow-hidden group shadow-sm border border-outline-variant/10 dark:border-slate-800 hover:shadow-md transition-all cursor-pointer"
                    >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 -mr-8 -mt-8 rounded-full group-hover:scale-110 transition-transform"></div>
                        <div className="flex flex-col gap-4">
                            <div className="flex justify-between items-start">
                                <div className="p-2 bg-primary/10 text-primary dark:text-[#00D1FF] rounded-lg">
                                    <span className="material-symbols-outlined">group</span>
                                </div>
                                <span className="text-[10px] font-bold text-tertiary dark:text-emerald-400 bg-tertiary-container/20 px-2 py-1 rounded-full">+4% este mês</span>
                            </div>
                            <div>
                                <p className="text-on-surface-variant dark:text-outline-variant text-xs font-bold uppercase tracking-wider">Alunos Ativos</p>
                                <h3 className="text-3xl font-headline font-extrabold text-on-surface dark:text-white mt-1">1.248</h3>
                            </div>
                        </div>
                    </Link>

                    {/* KPI 2: Turmas */}
                    <Link 
                        href={route('school-admin.classes.index')}
                        className="bg-surface-container-lowest dark:bg-slate-900 p-6 rounded-xl relative overflow-hidden group shadow-sm border border-outline-variant/10 dark:border-slate-800 hover:shadow-md transition-all cursor-pointer"
                    >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-tertiary/5 -mr-8 -mt-8 rounded-full"></div>
                        <div className="flex flex-col gap-4">
                            <div className="flex justify-between items-start">
                                <div className="p-2 bg-tertiary/10 text-tertiary dark:text-emerald-400 rounded-lg">
                                    <span className="material-symbols-outlined">school</span>
                                </div>
                                <span className="text-[10px] font-bold text-tertiary dark:text-emerald-400 bg-tertiary-container/20 px-2 py-1 rounded-full">Cap. Média: 85%</span>
                            </div>
                            <div>
                                <p className="text-on-surface-variant dark:text-outline-variant text-xs font-bold uppercase tracking-wider">Turmas Ativas</p>
                                <h3 className="text-3xl font-headline font-extrabold text-on-surface dark:text-white mt-1">18</h3>
                            </div>
                        </div>
                    </Link>

                    {/* KPI 3: Rendimento */}
                    <div className="bg-surface-container-lowest dark:bg-slate-900 p-6 rounded-xl relative overflow-hidden group shadow-sm border border-outline-variant/10 dark:border-slate-800 hover:shadow-md transition-all">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/5 -mr-8 -mt-8 rounded-full"></div>
                        <div className="flex flex-col gap-4">
                            <div className="flex justify-between items-start">
                                <div className="p-2 bg-secondary/10 text-secondary dark:text-sky-400 rounded-lg">
                                    <span className="material-symbols-outlined">grade</span>
                                </div>
                                <span className="text-[10px] font-bold text-tertiary dark:text-emerald-400 bg-tertiary-container/20 px-2 py-1 rounded-full">+1.2% vs bim.</span>
                            </div>
                            <div>
                                <p className="text-on-surface-variant dark:text-outline-variant text-xs font-bold uppercase tracking-wider">Média Rendimento</p>
                                <h3 className="text-3xl font-headline font-extrabold text-on-surface dark:text-white mt-1">82.4%</h3>
                            </div>
                        </div>
                    </div>

                    {/* KPI 4: Professores */}
                    <div className="bg-surface-container-lowest dark:bg-slate-900 p-6 rounded-xl relative overflow-hidden group shadow-sm border border-outline-variant/10 dark:border-slate-800 hover:shadow-md transition-all">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 -mr-8 -mt-8 rounded-full"></div>
                        <div className="flex flex-col gap-4">
                            <div className="flex justify-between items-start">
                                <div className="p-2 bg-primary/10 text-primary dark:text-[#00D1FF] rounded-lg">
                                    <span className="material-symbols-outlined">badge</span>
                                </div>
                                <span className="text-[10px] font-bold text-primary dark:text-[#00D1FF] bg-primary-container/20 px-2 py-1 rounded-full">Ativo</span>
                            </div>
                            <div>
                                <p className="text-on-surface-variant dark:text-outline-variant text-xs font-bold uppercase tracking-wider">Professores</p>
                                <h3 className="text-3xl font-headline font-extrabold text-on-surface dark:text-white mt-1">24</h3>
                            </div>
                        </div>
                    </div>
                </div>

                {/* OPERATIONAL & ACTION CENTER */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* QUICK ACTIONS (ASIDE) */}
                    <section className="lg:col-span-1 space-y-6">
                        <div className="bg-surface-container-lowest dark:bg-slate-900 p-6 rounded-xl border border-outline-variant/10 dark:border-slate-800">
                            <h4 className="font-headline font-bold text-lg mb-6 flex items-center gap-2 text-on-surface dark:text-white">
                                <span className="material-symbols-outlined text-primary dark:text-[#00D1FF]">bolt</span>
                                Ações Rápidas de Gestão
                            </h4>
                            <div className="space-y-3">
                                <button 
                                    onClick={() => showNotification("Boletins emitidos com sucesso em massa!")}
                                    className="w-full text-left p-4 rounded-xl border border-outline-variant/20 dark:border-slate-800 hover:border-primary dark:hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-all flex items-center justify-between group cursor-pointer"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-on-surface-variant dark:text-outline-variant group-hover:text-primary dark:group-hover:text-[#00D1FF]">description</span>
                                        <span className="text-sm font-bold text-on-surface dark:text-white">Emitir Boletins em Massa</span>
                                    </div>
                                    <span className="material-symbols-outlined text-sm text-outline-variant group-hover:translate-x-1 transition-transform">chevron_right</span>
                                </button>
                                
                                <button 
                                    onClick={() => showNotification("Relatório analítico de risco de evasão exportado para download!")}
                                    className="w-full text-left p-4 rounded-xl border border-outline-variant/20 dark:border-slate-800 hover:border-error hover:bg-error/5 dark:hover:bg-rose-955/20 transition-all flex items-center justify-between group cursor-pointer"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-on-surface-variant dark:text-outline-variant group-hover:text-error">analytics</span>
                                        <span className="text-sm font-bold text-on-surface dark:text-white">Gerar Relatório de Evasão</span>
                                    </div>
                                    <span className="material-symbols-outlined text-sm text-outline-variant group-hover:translate-x-1 transition-transform">chevron_right</span>
                                </button>

                                <button 
                                    onClick={() => showNotification("Agendamento de reunião geral de pais e mestres iniciado!")}
                                    className="w-full text-left p-4 rounded-xl border border-outline-variant/20 dark:border-slate-800 hover:border-primary dark:hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-all flex items-center justify-between group cursor-pointer"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-on-surface-variant dark:text-outline-variant group-hover:text-primary dark:group-hover:text-[#00D1FF]">groups</span>
                                        <span className="text-sm font-bold text-on-surface dark:text-white">Agendar Reunião de Pais</span>
                                    </div>
                                    <span className="material-symbols-outlined text-sm text-outline-variant group-hover:translate-x-1 transition-transform">chevron_right</span>
                                </button>

                                <button 
                                    onClick={() => showNotification("Redirecionando para envio de comunicado pedagógico...")}
                                    className="w-full text-left p-4 rounded-xl border border-outline-variant/20 dark:border-slate-800 hover:border-primary dark:hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-all flex items-center justify-between group cursor-pointer"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-on-surface-variant dark:text-outline-variant group-hover:text-primary dark:group-hover:text-[#00D1FF]">campaign</span>
                                        <span className="text-sm font-bold text-on-surface dark:text-white">Comunicado Geral</span>
                                    </div>
                                    <span className="material-symbols-outlined text-sm text-outline-variant group-hover:translate-x-1 transition-transform">chevron_right</span>
                                </button>
                            </div>
                        </div>

                        {/* CRITICAL ALERTS */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-outline-variant/10 dark:border-slate-800">
                            <div className="flex justify-between items-center mb-6">
                                <h4 className="font-headline font-bold text-lg flex items-center gap-2 text-on-surface dark:text-white">
                                    <span className="material-symbols-outlined text-error">warning</span>
                                    Atenção Necessária
                                </h4>
                                <span className="px-2 py-0.5 bg-error/10 text-error text-[10px] font-extrabold rounded uppercase">Urgente</span>
                            </div>
                            <div className="space-y-4">
                                {/* Alert Item 1 */}
                                <div 
                                    onClick={() => showNotification("Notificações enviadas aos responsáveis do aluno Lucas Oliveira.", "success")}
                                    className="flex gap-4 p-3 hover:bg-surface-container-low dark:hover:bg-slate-850 rounded-lg transition-all cursor-pointer border-l-4 border-error"
                                >
                                    <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-sm text-slate-500">
                                        LO
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-on-surface dark:text-white">Lucas Oliveira</span>
                                        <span className="text-[11px] text-error font-medium">Risco Alto de Evasão (15 dias ausente)</span>
                                    </div>
                                </div>

                                {/* Alert Item 2 */}
                                <div 
                                    onClick={() => showNotification("Abrindo ficha cadastral de pendências da aluna Ana Clara Mendes.", "info")}
                                    className="flex gap-4 p-3 hover:bg-surface-container-low dark:hover:bg-slate-850 rounded-lg transition-all cursor-pointer border-l-4 border-error-container"
                                >
                                    <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-sm text-slate-500">
                                        AM
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-on-surface dark:text-white">Ana Clara Mendes</span>
                                        <span className="text-[11px] text-on-surface-variant dark:text-outline-variant font-medium">Documentação de matrícula pendente</span>
                                    </div>
                                </div>
                            </div>
                            <button 
                                onClick={() => showNotification("Abrindo todos os alertas de inadimplência e presença...")}
                                className="w-full mt-4 py-2 text-xs font-bold text-primary dark:text-[#00D1FF] hover:underline transition-all cursor-pointer text-center"
                            >
                                Ver todos os alertas (8)
                            </button>
                        </div>
                    </section>

                    {/* VISUAL INSIGHTS (MAIN CONTENT) */}
                    <section className="lg:col-span-2 space-y-8">
                        {/* CHART 1: LINE CHART PLACEHOLDER */}
                        <div className="bg-surface-container-lowest dark:bg-slate-900 p-8 rounded-xl border border-outline-variant/10 dark:border-slate-800 relative overflow-hidden min-h-[360px]">
                            <div className="flex justify-between items-start mb-10">
                                <div>
                                    <h4 className="font-headline font-bold text-xl text-on-surface dark:text-white">Matrículas vs Cancelamentos</h4>
                                    <p className="text-sm text-on-surface-variant dark:text-outline-variant">Análise comparativa do ciclo anual (Jan - Dez)</p>
                                </div>
                                <div className="flex gap-4 text-xs font-bold text-on-surface dark:text-slate-200">
                                    <div className="flex items-center gap-2">
                                        <span className="w-3 h-3 bg-primary rounded-full"></span>
                                        <span>Matrículas</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-3 h-3 bg-outline-variant dark:bg-slate-600 rounded-full"></span>
                                        <span>Cancelamentos</span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Visual representation of a chart */}
                            <div className="h-48 flex items-end justify-between gap-2 px-4 relative">
                                <div className="absolute inset-0 flex flex-col justify-between py-2 pointer-events-none opacity-20 dark:opacity-10">
                                    <div className="border-t border-outline-variant dark:border-slate-700"></div>
                                    <div className="border-t border-outline-variant dark:border-slate-700"></div>
                                    <div className="border-t border-outline-variant dark:border-slate-700"></div>
                                    <div className="border-t border-outline-variant dark:border-slate-700"></div>
                                </div>
                                
                                {/* Bars mockup */}
                                <div className="w-full h-4/5 flex items-end gap-1">
                                    {chartData.map((d, index) => {
                                        const barHeight = animateBars ? `${d.value}%` : '0%';
                                        return (
                                            <div 
                                                key={d.month} 
                                                className={`flex-1 ${d.peak ? 'bg-primary/40 dark:bg-sky-500/40' : 'bg-primary/20 dark:bg-sky-500/20'} hover:bg-primary dark:hover:bg-sky-400 transition-all rounded-t-sm relative group`}
                                                style={{ 
                                                    height: barHeight,
                                                    transition: `height 1s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${index * 0.05}s`
                                                }}
                                                title={d.month}
                                            >
                                                {d.peak && (
                                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-on-surface dark:bg-slate-950 text-white px-2 py-1 rounded text-[10px] whitespace-nowrap z-10 shadow-md">
                                                        {d.peakLabel}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="flex justify-between mt-4 px-4 text-[10px] font-bold text-outline-variant dark:text-outline-variant uppercase tracking-widest">
                                <span>Jan</span><span>Mar</span><span>Mai</span><span>Jul</span><span>Set</span><span>Nov</span>
                            </div>
                        </div>

                        {/* CHART 2: PERFORMANCE BY UNIT (BENTO) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Desempenho por Turma */}
                            <div className="bg-surface-container-lowest dark:bg-slate-900 p-6 rounded-xl border border-outline-variant/10 dark:border-slate-800">
                                <h4 className="font-headline font-bold text-lg mb-4 text-on-surface dark:text-white">Desempenho por Turma</h4>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm font-bold text-on-surface dark:text-slate-200">
                                            <span>Turma A - Engenharia de Prompt (Integral)</span>
                                            <span className="text-primary dark:text-[#00D1FF]">92% de presença</span>
                                        </div>
                                        <div className="w-full h-2 bg-surface-container-low dark:bg-slate-800 rounded-full overflow-hidden">
                                            <div className="bg-primary dark:bg-[#00D1FF] h-full w-[92%] transition-all duration-1000"></div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm font-bold text-on-surface dark:text-slate-200">
                                            <span>Turma B - Desenvolvimento Fullstack (Noturno)</span>
                                            <span className="text-primary dark:text-[#00D1FF]">87% de presença</span>
                                        </div>
                                        <div className="w-full h-2 bg-surface-container-low dark:bg-slate-800 rounded-full overflow-hidden">
                                            <div className="bg-primary dark:bg-[#00D1FF] h-full w-[87%] transition-all duration-1000"></div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm font-bold text-on-surface dark:text-slate-200">
                                            <span>Turma C - Gestão Ágil Scrum (EAD/Híbrido)</span>
                                            <span className="text-primary dark:text-[#00D1FF]">78% de presença</span>
                                        </div>
                                        <div className="w-full h-2 bg-surface-container-low dark:bg-slate-800 rounded-full overflow-hidden">
                                            <div className="bg-primary dark:bg-[#00D1FF] h-full w-[78%] transition-all duration-1000"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* UPCOMING EVENTS */}
                            <div className="bg-surface-container-lowest dark:bg-slate-900 p-6 rounded-xl border border-outline-variant/10 dark:border-slate-800">
                                <h4 className="font-headline font-bold text-lg mb-4 text-on-surface dark:text-white">Próximos Eventos</h4>
                                <div className="space-y-4">
                                    <div 
                                        onClick={() => showNotification("Detalhes do evento: Reunião Pedagógica para o dia 12/Jun.", "info")}
                                        className="flex gap-4 p-3 hover:bg-surface-container-low dark:hover:bg-slate-850 rounded-xl transition-all cursor-pointer"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-primary-container text-on-primary-container font-black flex flex-col items-center justify-center shrink-0">
                                            <span className="text-sm leading-none">12</span>
                                            <span className="text-[10px] uppercase leading-none mt-1">Jun</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-on-surface dark:text-white">Reunião Pedagógica</p>
                                            <p className="text-xs text-outline-variant">Alinhamento de novos cursos com docentes.</p>
                                        </div>
                                    </div>
                                    <div 
                                        onClick={() => showNotification("Detalhes do evento: Conselho de Classe para o dia 18/Jun.", "info")}
                                        className="flex gap-4 p-3 hover:bg-surface-container-low dark:hover:bg-slate-850 rounded-xl transition-all cursor-pointer"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-tertiary-container text-on-tertiary-container font-black flex flex-col items-center justify-center shrink-0">
                                            <span className="text-sm leading-none">18</span>
                                            <span className="text-[10px] uppercase leading-none mt-1">Jun</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-on-surface dark:text-white">Conselho de Classe</p>
                                            <p className="text-xs text-outline-variant">Fechamento do 2º bimestre.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            {/* FAB for quick entry */}
            <button 
                onClick={() => showNotification("Abertura rápida de formulário de nova entrada acadêmica.")}
                className="fixed bottom-8 right-8 h-14 w-14 bg-gradient-to-br from-primary to-[#7b9cff] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 group cursor-pointer"
            >
                <span className="material-symbols-outlined text-2xl group-hover:rotate-90 transition-transform">add</span>
            </button>
        </Layout>
    );
}
