import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function StudentLayout({ children }) {
    const { auth } = usePage().props;
    const user = auth.user;

    const [expanded, setExpanded] = useState({
        aprendizagem: true,
        desempenho: true,
        comunicacao: true,
        servicos: true,
    });

    const toggleExpand = (category) => {
        setExpanded(prev => ({ ...prev, [category]: !prev[category] }));
    };

    const getInitials = (name) => {
        if (!name) return 'TS';
        const parts = name.trim().split(/\s+/);
        if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };

    return (
        <div className="bg-slate-50 min-h-screen">
            {/* TopAppBar */}
            <header className="fixed top-0 right-0 left-72 flex justify-between items-center px-8 h-20 bg-white/80 backdrop-blur-xl dark:bg-slate-950/80 border-b border-slate-100 dark:border-slate-800/40 z-40">
                <div className="flex-1 flex justify-center max-w-xl">
                    <div className="flex items-center bg-[#f1f3f9] px-4 py-2.5 rounded-full gap-2 w-full max-w-md border border-slate-200/50">
                        <span className="material-symbols-outlined text-slate-400 text-xl">search</span>
                        <input
                            className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder-slate-400 text-slate-700 font-medium py-0 px-1"
                            placeholder="Pesquisar curso, aula, autdcodo..."
                            type="text"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative">
                        <span className="material-symbols-outlined text-slate-600 dark:text-slate-300 text-2xl">notifications</span>
                        <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-950"></span>
                    </button>
                    <div className="flex items-center gap-3 pl-6 border-l border-slate-200 dark:border-slate-800">
                        <div className="w-9 h-9 rounded-full bg-[#8b5cf6] text-white flex items-center justify-center font-bold text-sm shadow-sm select-none">
                            {getInitials(user.name)}
                        </div>
                        <div className="flex items-center gap-1 cursor-pointer group">
                            <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider group-hover:text-primary transition-colors">
                                {user.name}
                            </span>
                            <span className="material-symbols-outlined text-slate-400 text-xl select-none">expand_more</span>
                        </div>
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="ml-2 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-950/20 text-error flex items-center justify-center transition-colors"
                            title="Sair"
                        >
                            <span className="material-symbols-outlined text-lg">logout</span>
                        </Link>
                    </div>
                </div>
            </header>

            {/* SideNavBar */}
            <aside className="h-screen w-72 fixed left-0 top-0 overflow-y-auto no-scrollbar bg-surface-container-low dark:bg-slate-950 border-r border-slate-100 dark:border-slate-800/40 flex flex-col py-6 px-4 z-50">
                <div className="px-4 py-6 mb-2">
                    <div className="flex items-center gap-3">
                        <ApplicationLogo
                            className="w-10 h-10 object-contain text-primary dark:text-[#00D1FF]"
                        />
                        <div>
                            <h1 className="text-2xl font-black text-[#0050d4] dark:text-[#00D1FF] leading-none">PlayUp</h1>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#003346]/40 dark:text-white/40">Student Hub</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar pr-2">
                    {/* Dashboard */}
                    <Link
                        className={`flex items-center px-4 py-3 rounded-xl font-bold transition-all duration-200 ease-in-out ${route().current('student.dashboard')
                            ? 'bg-primary text-on-primary shadow-lg shadow-primary/20'
                            : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                            }`}
                        href={route('student.dashboard')}
                    >
                        <span className="material-symbols-outlined mr-3" style={{ fontVariationSettings: route().current('student.dashboard') ? "'FILL' 1" : "'FILL' 0" }}>dashboard</span>
                        <span className="font-body text-sm">Dashboard</span>
                    </Link>

                    {/* 📚 Aprendizagem (Expandable category) */}
                    <div className="pt-2">
                        <button
                            className="w-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ease-in-out"
                            onClick={() => toggleExpand('aprendizagem')}
                        >
                            <div className="flex items-center">
                                <span className="material-symbols-outlined mr-3">school</span>
                                <span className="font-body text-sm font-semibold">Aprendizagem</span>
                            </div>
                            <span className={`material-symbols-outlined text-sm transition-transform duration-200 ${expanded.aprendizagem ? 'rotate-180' : ''}`}>expand_more</span>
                        </button>
                        <div
                            className={`pl-9 space-y-1 mt-1 transition-all duration-300 ease-in-out overflow-hidden ${expanded.aprendizagem ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                }`}
                        >
                            <Link
                                className={`block py-2 px-3 text-sm rounded-lg transition-colors ${route().current('student.courses')
                                    ? 'text-primary font-bold bg-[#cfecff]/40 dark:bg-slate-800'
                                    : 'text-on-surface-variant hover:text-primary'
                                    }`}
                                href={route('student.courses')}
                            >
                                Meus Cursos
                            </Link>
                            <Link
                                className={`block py-2 px-3 text-sm rounded-lg transition-colors ${route().current('student.courses.available')
                                    ? 'text-primary font-bold bg-[#cfecff]/40 dark:bg-slate-800'
                                    : 'text-on-surface-variant hover:text-primary'
                                    }`}
                                href={route('student.courses.available')}
                            >
                                Cursos Disponíveis
                            </Link>
                            {/* <Link 
                                className={`block py-2 px-3 text-sm rounded-lg transition-colors ${
                                    route().current('student.activities') 
                                        ? 'text-primary font-bold bg-[#cfecff]/40 dark:bg-slate-800' 
                                        : 'text-on-surface-variant hover:text-primary'
                                }`} 
                                href={route('student.activities')}
                            >
                                Atividades
                            </Link> */}
                            <Link
                                className={`block py-2 px-3 text-sm rounded-lg transition-colors ${route().current('student.agenda')
                                    ? 'text-primary font-bold bg-[#cfecff]/40 dark:bg-slate-800'
                                    : 'text-on-surface-variant hover:text-primary'
                                    }`}
                                href={route('student.agenda')}
                            >
                                Agenda
                            </Link>
                            {/* <Link 
                                className={`block py-2 px-3 text-sm rounded-lg transition-colors ${
                                    route().current('student.library') 
                                        ? 'text-primary font-bold bg-[#cfecff]/40 dark:bg-slate-800' 
                                        : 'text-on-surface-variant hover:text-primary'
                                }`} 
                                href={route('student.library')}
                            >
                                Biblioteca
                            </Link> */}
                        </div>
                    </div>

                    {/* 📈 Meu Desempenho (Expandable category) */}
                    <div className="pt-1">
                        <button
                            className="w-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ease-in-out"
                            onClick={() => toggleExpand('desempenho')}
                        >
                            <div className="flex items-center">
                                <span className="material-symbols-outlined mr-3">insights</span>
                                <span className="font-body text-sm font-semibold">Meu Desempenho</span>
                            </div>
                            <span className={`material-symbols-outlined text-sm transition-transform duration-200 ${expanded.desempenho ? 'rotate-180' : ''}`}>expand_more</span>
                        </button>
                        <div
                            className={`pl-9 space-y-1 mt-1 transition-all duration-300 ease-in-out overflow-hidden ${expanded.desempenho ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                }`}
                        >
                            <Link
                                className={`block py-2 px-3 text-sm rounded-lg transition-colors ${route().current('student.report-card')
                                    ? 'text-primary font-bold bg-[#cfecff]/40 dark:bg-slate-800'
                                    : 'text-on-surface-variant hover:text-primary'
                                    }`}
                                href={route('student.report-card')}
                            >
                                Boletim
                            </Link>
                            <Link
                                className={`block py-2 px-3 text-sm rounded-lg transition-colors ${route().current('student.attendance')
                                    ? 'text-primary font-bold bg-[#cfecff]/40 dark:bg-slate-800'
                                    : 'text-on-surface-variant hover:text-primary'
                                    }`}
                                href={route('student.attendance')}
                            >
                                Frequência
                            </Link>
                            {/* <Link 
                                className={`block py-2 px-3 text-sm rounded-lg transition-colors ${
                                    route().current('student.progress') 
                                        ? 'text-primary font-bold bg-[#cfecff]/40 dark:bg-slate-800' 
                                        : 'text-on-surface-variant hover:text-primary'
                                }`} 
                                href={route('student.progress')}
                            >
                                Progresso
                            </Link> */}
                        </div>
                    </div>

                    {/* 💬 Comunicação (Expandable category) */}
                    <div className="pt-1">
                        <button
                            className="w-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ease-in-out"
                            onClick={() => toggleExpand('comunicacao')}
                        >
                            <div className="flex items-center">
                                <span className="material-symbols-outlined mr-3">chat</span>
                                <span className="font-body text-sm font-semibold">Comunicação</span>
                            </div>
                            <span className={`material-symbols-outlined text-sm transition-transform duration-200 ${expanded.comunicacao ? 'rotate-180' : ''}`}>expand_more</span>
                        </button>
                        <div
                            className={`pl-9 space-y-1 mt-1 transition-all duration-300 ease-in-out overflow-hidden ${expanded.comunicacao ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                }`}
                        >
                            <Link
                                className={`block py-2 px-3 text-sm rounded-lg transition-colors ${route().current('student.messages')
                                    ? 'text-primary font-bold bg-[#cfecff]/40 dark:bg-slate-800'
                                    : 'text-on-surface-variant hover:text-primary'
                                    }`}
                                href={route('student.messages')}
                            >
                                Mensagens
                            </Link>
                        </div>
                    </div>

                    {/* 💼 Serviços (Expandable category) */}
                    <div className="pt-1">
                        <button
                            className="w-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ease-in-out"
                            onClick={() => toggleExpand('servicos')}
                        >
                            <div className="flex items-center">
                                <span className="material-symbols-outlined mr-3">payments</span>
                                <span className="font-body text-sm font-semibold">Serviços</span>
                            </div>
                            <span className={`material-symbols-outlined text-sm transition-transform duration-200 ${expanded.servicos ? 'rotate-180' : ''}`}>expand_more</span>
                        </button>
                        <div
                            className={`pl-9 space-y-1 mt-1 transition-all duration-300 ease-in-out overflow-hidden ${expanded.servicos ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                }`}
                        >
                            <a className="block py-2 px-3 text-sm text-on-surface-variant hover:text-primary rounded-lg transition-colors" href="#">Matrículas</a>
                            <Link
                                className={`block py-2 px-3 text-sm rounded-lg transition-colors ${route().current('student.documents*')
                                    ? 'text-primary font-bold bg-[#cfecff]/40 dark:bg-slate-800'
                                    : 'text-on-surface-variant hover:text-primary'
                                    }`}
                                href={route('student.documents')}
                            >
                                Documentos
                            </Link>
                            <Link
                                className={`block py-2 px-3 text-sm rounded-lg transition-colors ${route().current('student.financial*')
                                    ? 'text-primary font-bold bg-[#cfecff]/40 dark:bg-slate-800'
                                    : 'text-on-surface-variant hover:text-primary'
                                    }`}
                                href={route('student.financial')}
                            >
                                Financeiro
                            </Link>
                            {/* <a className="block py-2 px-3 text-sm text-on-surface-variant hover:text-primary rounded-lg transition-colors" href="#">Solicitações</a> */}
                        </div>
                    </div>

                    {/* Configurações */}
                    <div className="pt-1">
                        <Link
                            className={`flex items-center px-4 py-3 rounded-xl font-bold transition-all duration-200 ease-in-out ${route().current('profile.edit')
                                ? 'bg-primary text-on-primary shadow-lg shadow-primary/20'
                                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                                }`}
                            href={route('profile.edit')}
                        >
                            <span className="material-symbols-outlined mr-3">settings</span>
                            <span className="font-body text-sm font-semibold">Configurações</span>
                        </Link>
                    </div>
                </nav>
            </aside>

            {/* Main Content Canvas */}
            <main className="ml-72 pt-24 min-h-screen bg-slate-50 dark:bg-slate-900">
                {children}
            </main>
        </div>
    );
}
