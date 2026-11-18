import StudentLayout from '@/Layouts/StudentLayout';
import { Head, usePage } from '@inertiajs/react';

export default function Dashboard() {
    const { auth } = usePage().props;
    const user = auth.user;

    const firstName = user.name ? user.name.split(' ')[0] : 'Teste';

    return (
        <StudentLayout>
            <Head title="Meu Painel - PlayUp" />
            
            <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 lg:space-y-8">
                {/* Top Bento Banner */}
                <section className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-3 sm:p-6 shadow-sm shadow-slate-100/50 flex flex-col xl:flex-row gap-6 items-stretch">
                    {/* Left Column: Indigo/Purple Gradient Box */}
                    <div className="flex-1 min-w-0 bg-gradient-to-br from-[#53389e] to-[#7f56d9] rounded-2xl p-5 sm:p-6 text-white flex flex-col justify-between relative overflow-hidden shadow-md">
                        {/* Core content row */}
                        <div className="flex flex-col md:flex-row items-center gap-6 z-10">
                            {/* 3D Student Illustration */}
                            <div className="w-24 h-24 sm:w-36 sm:h-36 shrink-0 relative flex items-center justify-center">
                                <img 
                                    alt="Student Illustration" 
                                    className="w-full h-full object-contain filter drop-shadow-md rounded-2xl" 
                                    src="/images/student_3d_avatar.png"
                                />
                            </div>
                            {/* Welcome and stats details */}
                            <div className="flex-1 text-center md:text-left space-y-4">
                                <div className="space-y-1">
                                    <h2 className="text-2xl sm:text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center justify-center md:justify-start gap-2">
                                        <span>👋</span> Bom dia, {firstName}!
                                    </h2>
                                    <p className="text-purple-100 text-sm font-medium">
                                        Você já concluiu <span className="font-extrabold text-white text-base">72%</span> do curso <span className="font-extrabold text-[#ffd966] underline decoration-wavy decoration-[#ffd966]">Marketing Digital</span>
                                    </p>
                                </div>
                                
                                {/* Progress bar container */}
                                <div className="flex items-center gap-4">
                                    <div className="flex-1 bg-white/20 h-3 rounded-full overflow-hidden">
                                        <div 
                                            className="bg-gradient-to-r from-[#ffd966] to-[#ffb84d] h-full rounded-full transition-all duration-500" 
                                            style={{ width: '72%' }}
                                        />
                                    </div>
                                    <span className="text-sm font-black text-white shrink-0">72%</span>
                                </div>
                                
                                {/* Streak line */}
                                <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-semibold text-purple-100">
                                    <span>🔥</span>
                                    <p>
                                        Você está no <span className="font-extrabold text-[#ffd966] text-sm">42° dia</span> consecutivo de estudos.
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Inner bottom panel: certification and CTA */}
                        <div className="mt-6 bg-white/10 backdrop-blur-md border border-white/15 rounded-xl p-4 flex flex-col md:flex-row justify-between items-center gap-4 z-10">
                            <div className="flex items-center gap-3 text-center md:text-left">
                                <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-300 shrink-0">
                                    <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>trophy</span>
                                </div>
                                <p className="text-sm font-medium text-white">
                                    Faltam apenas <span className="font-bold text-[#ffd966]">8 aulas</span> para conquistar seu certificado!
                                </p>
                            </div>
                            
                            <button className="bg-white hover:bg-slate-50 text-[#7f56d9] font-black text-xs px-5 py-3 rounded-xl shadow-lg hover:shadow-xl active:scale-95 transition-all duration-150 uppercase tracking-wider flex items-center gap-2 shrink-0">
                                <span className="material-symbols-outlined text-sm font-black" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                                Continuar de onde parei
                            </button>
                        </div>
                    </div>
                    
                    {/* Vertical line divider (visible on desktop) */}
                    <div className="hidden xl:block w-[1px] bg-slate-100 dark:bg-slate-800 self-stretch my-2" />
                    
                    {/* Right Column: "Hoje você possui:" Column */}
                    <div className="w-full xl:w-80 shrink-0 flex flex-col justify-center p-2 space-y-5">
                        <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                            Hoje você possui:
                        </h3>
                        <div className="space-y-4">
                            {/* Item 1 */}
                            <div className="flex items-center gap-4 group">
                                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-950/20 text-[#7f56d9] flex items-center justify-center shadow-sm select-none shrink-0 group-hover:scale-105 transition-transform">
                                    <span className="text-base font-black">2</span>
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">2 aulas para assistir</p>
                                </div>
                            </div>
                            {/* Item 2 */}
                            <div className="flex items-center gap-4 group">
                                <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-950/20 text-amber-700 flex items-center justify-center shadow-sm select-none shrink-0 group-hover:scale-105 transition-transform">
                                    <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>assignment_turned_in</span>
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">1 atividade pendente</p>
                                </div>
                            </div>
                            {/* Item 3 */}
                            <div className="flex items-center gap-4 group">
                                <div className="w-10 h-10 rounded-full bg-sky-100 dark:bg-sky-950/20 text-sky-700 flex items-center justify-center shadow-sm select-none shrink-0 group-hover:scale-105 transition-transform">
                                    <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>description</span>
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">1 prova disponível</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Main Bento Grid */}
                <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    {/* Courses in Progress (spans 8 cols) */}
                    <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 sm:p-6 rounded-3xl shadow-sm shadow-slate-100/50 flex flex-col justify-between space-y-6">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-[#7f56d9] text-2xl">trending_up</span>
                            <h3 className="text-lg font-extrabold text-slate-800 dark:text-slate-200">Progresso dos Cursos</h3>
                        </div>

                        {/* Courses Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                            {/* Card 1: Marketing Digital */}
                            <div className="bg-[#fcfaff] dark:bg-slate-900/40 border border-purple-100 dark:border-purple-950/30 rounded-2xl p-5 flex flex-col justify-between hover:shadow-md hover:border-purple-200 transition-all group">
                                <div className="space-y-4">
                                    {/* Header / Badge */}
                                    <div className="flex justify-between items-center">
                                        <span className="bg-purple-100/70 text-purple-700 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full dark:bg-purple-950/50 dark:text-purple-300">
                                            Em andamento
                                        </span>
                                    </div>
                                    {/* Illustration */}
                                    <div className="h-24 sm:h-32 bg-[#f4f0ff] dark:bg-purple-950/20 rounded-xl overflow-hidden flex items-center justify-center p-2 relative">
                                        <img 
                                            alt="Marketing Digital" 
                                            className="h-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-200" 
                                            src="/images/course_marketing.png"
                                        />
                                    </div>
                                    {/* Title & Progress */}
                                    <div className="space-y-3">
                                        <h4 className="text-base font-extrabold text-slate-800 dark:text-slate-200 group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors">
                                            Marketing Digital
                                        </h4>
                                        {/* Progress bar */}
                                        <div className="space-y-1">
                                            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                                                <div className="bg-purple-600 h-full rounded-full" style={{ width: '72%' }} />
                                            </div>
                                            <div className="flex justify-between text-[11px] font-bold text-slate-400">
                                                <span>Progresso</span>
                                                <span className="text-purple-700 dark:text-purple-400">72%</span>
                                            </div>
                                        </div>
                                        {/* Subdetails */}
                                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between text-[11px] font-semibold text-slate-500">
                                            <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">Módulo 6 de 8</span>
                                            <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">Aula 4 de 12</span>
                                        </div>
                                    </div>
                                </div>
                                <button className="mt-5 w-full py-2.5 px-4 bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/20 dark:hover:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 group-hover:translate-y-[-2px] transition-all">
                                    <span>Continuar estudando</span>
                                    <span className="material-symbols-outlined text-sm font-black">arrow_forward</span>
                                </button>
                            </div>

                            {/* Card 2: Power BI */}
                            <div className="bg-[#f7fbff] dark:bg-slate-900/40 border border-sky-100 dark:border-sky-950/30 rounded-2xl p-5 flex flex-col justify-between hover:shadow-md hover:border-sky-200 transition-all group">
                                <div className="space-y-4">
                                    {/* Header / Badge */}
                                    <div className="flex justify-between items-center">
                                        <span className="bg-sky-100/70 text-sky-700 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full dark:bg-sky-950/50 dark:text-sky-300">
                                            Em andamento
                                        </span>
                                    </div>
                                    {/* Illustration */}
                                    <div className="h-24 sm:h-32 bg-[#edf7ff] dark:bg-sky-950/20 rounded-xl overflow-hidden flex items-center justify-center p-2 relative">
                                        <img 
                                            alt="Power BI" 
                                            className="h-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-200" 
                                            src="/images/course_powerbi.png"
                                        />
                                    </div>
                                    {/* Title & Progress */}
                                    <div className="space-y-3">
                                        <h4 className="text-base font-extrabold text-slate-800 dark:text-slate-200 group-hover:text-sky-700 dark:group-hover:text-sky-400 transition-colors">
                                            Power BI
                                        </h4>
                                        {/* Progress bar */}
                                        <div className="space-y-1">
                                            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                                                <div className="bg-[#d97706] h-full rounded-full" style={{ width: '31%' }} />
                                            </div>
                                            <div className="flex justify-between text-[11px] font-bold text-slate-400">
                                                <span>Progresso</span>
                                                <span className="text-[#d97706]">31%</span>
                                            </div>
                                        </div>
                                        {/* Subdetails */}
                                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between text-[11px] font-semibold text-slate-500">
                                            <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">Módulo 3 de 10</span>
                                            <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">Aula 7 de 24</span>
                                        </div>
                                    </div>
                                </div>
                                <button className="mt-5 w-full py-2.5 px-4 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/20 dark:hover:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 group-hover:translate-y-[-2px] transition-all">
                                    <span>Continuar estudando</span>
                                    <span className="material-symbols-outlined text-sm font-black">arrow_forward</span>
                                </button>
                            </div>

                            {/* Card 3: Excel Avançado */}
                            <div className="bg-[#f5fbf7] dark:bg-slate-900/40 border border-emerald-100 dark:border-emerald-950/30 rounded-2xl p-5 flex flex-col justify-between hover:shadow-md hover:border-emerald-200 transition-all group">
                                <div className="space-y-4">
                                    {/* Header / Badge */}
                                    <div className="flex justify-between items-center">
                                        <span className="bg-emerald-100/70 text-emerald-700 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full dark:bg-emerald-950/50 dark:text-emerald-300">
                                            Concluído
                                        </span>
                                    </div>
                                    {/* Illustration */}
                                    <div className="h-24 sm:h-32 bg-[#ebf7ef] dark:bg-emerald-950/20 rounded-xl overflow-hidden flex items-center justify-center p-2 relative">
                                        <img 
                                            alt="Excel Avançado" 
                                            className="h-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-200" 
                                            src="/images/course_excel.png"
                                        />
                                    </div>
                                    {/* Title & Progress */}
                                    <div className="space-y-3">
                                        <h4 className="text-base font-extrabold text-slate-800 dark:text-slate-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                                            Excel Avançado
                                        </h4>
                                        {/* Progress bar */}
                                        <div className="space-y-1">
                                            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                                                <div className="bg-emerald-600 h-full rounded-full" style={{ width: '100%' }} />
                                            </div>
                                            <div className="flex justify-between text-[11px] font-bold text-slate-400">
                                                <span>Curso concluído</span>
                                                <span className="text-emerald-700 dark:text-emerald-400">100%</span>
                                            </div>
                                        </div>
                                        {/* Subdetails */}
                                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center text-xs font-extrabold text-emerald-700 dark:text-emerald-400 py-1 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg">
                                            Parabéns!
                                        </div>
                                    </div>
                                </div>
                                <button className="mt-5 w-full py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 dark:bg-[#004a23] dark:hover:bg-[#005c2d]/70 text-emerald-700 dark:text-emerald-300 font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 group-hover:translate-y-[-2px] transition-all">
                                    <span className="material-symbols-outlined text-sm">workspace_premium</span>
                                    <span>Ver certificado</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Trilha de Aprendizado (spans 4 cols) */}
                    <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 sm:p-6 rounded-[2rem] shadow-sm shadow-slate-100/50 flex flex-col justify-between">
                        <div className="space-y-6">
                            {/* Card Header with Cyan Pill */}
                            <div className="flex items-center gap-3">
                                <span className="w-1.5 h-6 bg-[#00d1ff] rounded-full shrink-0" />
                                <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-200 font-headline">
                                    Trilha de Aprendizado
                                </h3>
                            </div>
                            
                            {/* Timeline container */}
                            <div className="relative pl-3 space-y-6">
                                {/* Vertical line connecting steps */}
                                <div className="absolute left-[20px] top-4 bottom-4 w-[2px] bg-slate-100 dark:bg-slate-800" />
                                
                                {/* Step 1: Aula 21 */}
                                <div className="flex gap-4 relative items-center group">
                                    <div className="z-10 w-9 h-9 rounded-full bg-[#e8fbf1] text-emerald-500 flex items-center justify-center border border-emerald-100 shrink-0 select-none shadow-sm relative group-hover:scale-105 transition-transform">
                                        <span className="material-symbols-outlined text-xl font-black">check</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-base font-bold text-slate-800 dark:text-slate-200 leading-tight">
                                            Aula 21
                                        </h4>
                                        <p className="text-xs font-semibold text-slate-400 mt-0.5">Concluído</p>
                                    </div>
                                </div>

                                {/* Step 2: Exercício */}
                                <div className="flex gap-4 relative items-center group">
                                    <div className="z-10 w-9 h-9 rounded-full bg-[#e8fbf1] text-emerald-500 flex items-center justify-center border border-emerald-100 shrink-0 select-none shadow-sm relative group-hover:scale-105 transition-transform">
                                        <span className="material-symbols-outlined text-xl font-black">check</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-base font-bold text-slate-800 dark:text-slate-200 leading-tight">
                                            Exercício
                                        </h4>
                                        <p className="text-xs font-semibold text-slate-400 mt-0.5">Concluído</p>
                                    </div>
                                </div>

                                {/* Step 3: Aula 22 */}
                                <div className="flex gap-4 relative items-center group">
                                    {/* Glowing Cyan Circle with Play Button */}
                                    <div className="z-10 w-9 h-9 rounded-full bg-[#00d1ff] text-white flex items-center justify-center shrink-0 select-none relative shadow-[0_0_12px_rgba(0,209,255,0.4)] group-hover:scale-105 transition-transform">
                                        <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-base font-bold text-[#00d1ff] leading-tight">
                                            Aula 22
                                        </h4>
                                        <p className="text-[10px] font-black text-[#00d1ff] tracking-wider uppercase mt-0.5">
                                            ESTUDANDO AGORA
                                        </p>
                                    </div>
                                </div>

                                {/* Step 4: Fórum */}
                                <div className="flex gap-4 relative items-center group">
                                    <div className="z-10 w-9 h-9 rounded-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-300 flex items-center justify-center shrink-0 select-none relative group-hover:scale-105 transition-transform">
                                        <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-650" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-base font-bold text-slate-400 dark:text-slate-500 leading-tight">
                                            Fórum
                                        </h4>
                                        <p className="text-xs font-semibold text-slate-400 dark:text-slate-600 mt-0.5">Pendente</p>
                                    </div>
                                </div>

                                {/* Step 5: Prova */}
                                <div className="flex gap-4 relative items-center group">
                                    <div className="z-10 w-9 h-9 rounded-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-300 flex items-center justify-center shrink-0 select-none relative group-hover:scale-105 transition-transform">
                                        <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-650" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-base font-bold text-slate-400 dark:text-slate-500 leading-tight">
                                            Prova
                                        </h4>
                                        <p className="text-xs font-semibold text-slate-400 dark:text-slate-600 mt-0.5">Bloqueado</p>
                                    </div>
                                </div>

                                {/* Step 6: Certificado */}
                                <div className="flex gap-4 relative items-center group">
                                    <div className="z-10 w-9 h-9 rounded-full bg-amber-50 dark:bg-amber-950/20 text-amber-600 flex items-center justify-center border border-amber-200 shrink-0 select-none relative group-hover:scale-105 transition-transform">
                                        <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>trophy</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-base font-bold text-amber-600 dark:text-amber-500 leading-tight">
                                            Certificado
                                        </h4>
                                        <p className="text-xs font-bold text-amber-500 dark:text-amber-600 mt-0.5">Objetivo Final</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Divider and Button */}
                        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                            <button className="w-full py-4 bg-[#00d1ff] hover:bg-[#00c0eb] text-white font-extrabold rounded-2xl text-base shadow-lg shadow-[#00d1ff]/20 hover:scale-[1.01] active:scale-[0.99] transition-all">
                                Continuar de onde parei
                            </button>
                        </div>
                    </div>
                </section>

                {/* Bottom Row: 5 Stats Cards */}
                <section className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
                    {/* Card 1: Desempenho Geral */}
                    <div className="bg-[#f0f7ff] dark:bg-slate-900/30 border border-sky-100 dark:border-sky-950/20 rounded-2xl p-5 space-y-3 flex flex-col justify-between shadow-sm">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400">
                                <span className="material-symbols-outlined text-lg">insights</span>
                                <span className="text-[10px] font-extrabold uppercase tracking-wider">Desempenho Geral</span>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-semibold text-slate-400 leading-none">Nota média</p>
                                <p className="text-3xl font-black text-slate-800 dark:text-slate-100">8,7</p>
                            </div>
                            {/* Stars */}
                            <div className="flex items-center gap-0.5 text-amber-400">
                                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>star</span>
                            </div>
                        </div>
                        <p className="text-xs font-black text-emerald-600 dark:text-emerald-400">Muito bom!</p>
                    </div>

                    {/* Card 2: Tempo de estudo */}
                    <div className="bg-[#f9f5ff] dark:bg-slate-900/30 border border-purple-100 dark:border-purple-950/20 rounded-2xl p-5 space-y-3 flex flex-col justify-between shadow-sm">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                                <span className="material-symbols-outlined text-lg">schedule</span>
                                <span className="text-[10px] font-extrabold uppercase tracking-wider">Tempo de estudo</span>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-semibold text-slate-400 leading-none">Esta semana</p>
                                <div className="flex items-baseline gap-2">
                                    <p className="text-2xl font-black text-slate-800 dark:text-slate-100 leading-none">28h 45m</p>
                                    <span className="text-[10px] font-extrabold text-[#16a34a] dark:text-emerald-400 flex items-center bg-[#f0fdf4] dark:bg-emerald-950/20 px-1 rounded">
                                        ↑ +12%
                                    </span>
                                </div>
                            </div>
                        </div>
                        <p className="text-xs font-black text-purple-700 dark:text-purple-400">Excelente dedicação!</p>
                    </div>

                    {/* Card 3: Frequência */}
                    <div className="bg-[#f0fdf4] dark:bg-slate-900/30 border border-emerald-100 dark:border-emerald-950/20 rounded-2xl p-5 space-y-3 flex flex-col justify-between shadow-sm">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                                <span className="material-symbols-outlined text-lg">fact_check</span>
                                <span className="text-[10px] font-extrabold uppercase tracking-wider">Frequência</span>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-semibold text-slate-400 leading-none">Média geral</p>
                                <p className="text-3xl font-black text-slate-800 dark:text-slate-100">94%</p>
                            </div>
                        </div>
                        <p className="text-xs font-black text-emerald-600 dark:text-emerald-400">Muito bom!</p>
                    </div>

                    {/* Card 4: Mensagens */}
                    <div className="bg-[#fdf2f8] dark:bg-slate-900/30 border border-pink-100 dark:border-pink-950/20 rounded-2xl p-5 space-y-3 flex flex-col justify-between shadow-sm group">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-pink-600 dark:text-pink-400">
                                <span className="material-symbols-outlined text-lg">mail</span>
                                <span className="text-[10px] font-extrabold uppercase tracking-wider">Mensagens</span>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-semibold text-slate-400 leading-none">Não lidas</p>
                                <p className="text-3xl font-black text-slate-800 dark:text-slate-100">3</p>
                            </div>
                        </div>
                        <button className="text-left text-xs font-black text-purple-700 dark:text-purple-400 group-hover:underline flex items-center gap-1">
                            <span>Ver mensagens</span>
                            <span className="material-symbols-outlined text-xs font-bold group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
                        </button>
                    </div>

                    {/* Card 5: Financeiro */}
                    <div className="bg-[#f0fdfa] dark:bg-slate-900/30 border border-teal-100 dark:border-teal-950/20 rounded-2xl p-5 space-y-3 flex flex-col justify-between shadow-sm">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400">
                                <span className="material-symbols-outlined text-lg">payments</span>
                                <span className="text-[10px] font-extrabold uppercase tracking-wider">Financeiro</span>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-semibold text-slate-400 leading-none">Próximo vencimento</p>
                                <p className="text-lg font-black text-[#0f172a] dark:text-slate-100">15/06/2024</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-black text-teal-600 dark:text-teal-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                            <span>Em dia</span>
                        </div>
                    </div>
                </section>
            </div>
        </StudentLayout>
    );
}
