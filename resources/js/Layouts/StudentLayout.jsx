import { Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';

const NAV = [
    {
        key: 'aprendizagem',
        label: 'Aprendizagem',
        icon: 'school',
        items: [
            { label: 'Meus Cursos', route: 'student.courses' },
            { label: 'Cursos Disponíveis', route: 'student.courses.available' },
            { label: 'Agenda', route: 'student.agenda' },
        ],
    },
    {
        key: 'desempenho',
        label: 'Meu Desempenho',
        icon: 'insights',
        items: [
            { label: 'Boletim', route: 'student.report-card' },
            { label: 'Frequência', route: 'student.attendance' },
        ],
    },
    {
        key: 'comunicacao',
        label: 'Comunicação',
        icon: 'chat',
        items: [{ label: 'Mensagens', route: 'student.messages' }],
    },
    {
        key: 'servicos',
        label: 'Serviços',
        icon: 'payments',
        items: [
            { label: 'Matrículas', href: '#' },
            { label: 'Documentos', route: 'student.documents', match: 'student.documents*' },
            { label: 'Financeiro', route: 'student.financial', match: 'student.financial*' },
        ],
    },
];

// Atalhos da barra inferior no celular.
const TABS = [
    { label: 'Início', icon: 'dashboard', route: 'student.dashboard' },
    { label: 'Cursos', icon: 'school', route: 'student.courses', match: 'student.courses*' },
    { label: 'Agenda', icon: 'calendar_month', route: 'student.agenda' },
    { label: 'Mensagens', icon: 'chat', route: 'student.messages' },
];

const getInitials = (name) => {
    if (!name) return 'TS';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const isCurrent = (item) => item.route && route().current(item.match ?? item.route);

export default function StudentLayout({ children }) {
    const { auth } = usePage().props;
    const user = auth.user;

    const [expanded, setExpanded] = useState({ aprendizagem: true, desempenho: true, comunicacao: true, servicos: true });
    const [menuOpen, setMenuOpen] = useState(false);

    // Fecha o menu ao navegar e trava a rolagem da página enquanto ele está aberto.
    useEffect(() => router.on('navigate', () => setMenuOpen(false)), []);
    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : '';
        return () => (document.body.style.overflow = '');
    }, [menuOpen]);

    const toggleExpand = (category) => setExpanded((prev) => ({ ...prev, [category]: !prev[category] }));

    const topLink = (active) =>
        `flex items-center px-4 py-3 rounded-xl font-bold transition-all duration-200 ease-in-out ${active
            ? 'bg-primary text-on-primary shadow-lg shadow-primary/20'
            : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'}`;

    return (
        <div className="bg-slate-50 min-h-screen">
            {/* TopAppBar */}
            <header className="fixed top-0 right-0 left-0 lg:left-72 flex justify-between items-center gap-3 px-4 sm:px-6 lg:px-8 h-16 lg:h-20 bg-white/80 backdrop-blur-xl dark:bg-slate-950/80 border-b border-slate-100 dark:border-slate-800/40 z-40">
                <button
                    type="button"
                    onClick={() => setMenuOpen(true)}
                    className="lg:hidden -ml-1 p-2 rounded-full hover:bg-slate-100 text-slate-700"
                    aria-label="Abrir menu"
                >
                    <span className="material-symbols-outlined text-2xl">menu</span>
                </button>
                <Link href={route('student.dashboard')} className="lg:hidden flex items-center gap-2 mr-auto">
                    <ApplicationLogo className="w-7 h-7 object-contain text-primary" />
                    <span className="text-lg font-black text-[#0050d4] leading-none">PlayUp</span>
                </Link>

                <div className="hidden md:flex flex-1 justify-center max-w-xl">
                    <div className="flex items-center bg-[#f1f3f9] px-4 py-2.5 rounded-full gap-2 w-full max-w-md border border-slate-200/50">
                        <span className="material-symbols-outlined text-slate-400 text-xl">search</span>
                        <input
                            className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder-slate-400 text-slate-700 font-medium py-0 px-1"
                            placeholder="Pesquisar curso, aula, conteúdo..."
                            type="text"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-6">
                    <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative" aria-label="Notificações">
                        <span className="material-symbols-outlined text-slate-600 dark:text-slate-300 text-2xl">notifications</span>
                        <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-950"></span>
                    </button>
                    <div className="flex items-center gap-3 sm:pl-6 sm:border-l border-slate-200 dark:border-slate-800">
                        <div className="w-9 h-9 rounded-full bg-[#8b5cf6] text-white flex items-center justify-center font-bold text-sm shadow-sm select-none">
                            {getInitials(user.name)}
                        </div>
                        <div className="hidden sm:flex items-center gap-1 cursor-pointer group">
                            <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider group-hover:text-primary transition-colors">
                                {user.name}
                            </span>
                            <span className="material-symbols-outlined text-slate-400 text-xl select-none">expand_more</span>
                        </div>
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="hidden sm:flex ml-2 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-950/20 text-error items-center justify-center transition-colors"
                            title="Sair"
                        >
                            <span className="material-symbols-outlined text-lg">logout</span>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Fundo escuro do menu no celular */}
            <div
                className={`lg:hidden fixed inset-0 bg-slate-900/40 z-50 transition-opacity ${menuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setMenuOpen(false)}
                aria-hidden="true"
            />

            {/* SideNavBar: fixa no desktop, gaveta no celular */}
            <aside
                className={`h-[100dvh] w-72 max-w-[85vw] fixed left-0 top-0 overflow-y-auto no-scrollbar bg-surface-container-low dark:bg-slate-950 border-r border-slate-100 dark:border-slate-800/40 flex flex-col py-4 lg:py-6 px-4 z-50 transition-transform duration-300 lg:translate-x-0 ${menuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}
            >
                <div className="px-4 py-4 lg:py-6 mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <ApplicationLogo className="w-10 h-10 object-contain text-primary dark:text-[#00D1FF]" />
                        <div>
                            <h1 className="text-2xl font-black text-[#0050d4] dark:text-[#00D1FF] leading-none">PlayUp</h1>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#003346]/40 dark:text-white/40">Student Hub</p>
                        </div>
                    </div>
                    <button type="button" onClick={() => setMenuOpen(false)} className="lg:hidden p-2 -mr-2 rounded-full hover:bg-surface-container" aria-label="Fechar menu">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar pr-2">
                    <Link className={topLink(route().current('student.dashboard'))} href={route('student.dashboard')}>
                        <span className="material-symbols-outlined mr-3" style={{ fontVariationSettings: route().current('student.dashboard') ? "'FILL' 1" : "'FILL' 0" }}>dashboard</span>
                        <span className="font-body text-sm">Dashboard</span>
                    </Link>

                    {NAV.map((group, i) => (
                        <div key={group.key} className={i === 0 ? 'pt-2' : 'pt-1'}>
                            <button
                                className="w-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ease-in-out"
                                onClick={() => toggleExpand(group.key)}
                            >
                                <div className="flex items-center">
                                    <span className="material-symbols-outlined mr-3">{group.icon}</span>
                                    <span className="font-body text-sm font-semibold">{group.label}</span>
                                </div>
                                <span className={`material-symbols-outlined text-sm transition-transform duration-200 ${expanded[group.key] ? 'rotate-180' : ''}`}>expand_more</span>
                            </button>
                            <div className={`pl-9 space-y-1 mt-1 transition-all duration-300 ease-in-out overflow-hidden ${expanded[group.key] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                                {group.items.map((item) => {
                                    const cls = `block py-2.5 lg:py-2 px-3 text-sm rounded-lg transition-colors ${isCurrent(item)
                                        ? 'text-primary font-bold bg-[#cfecff]/40 dark:bg-slate-800'
                                        : 'text-on-surface-variant hover:text-primary'}`;

                                    return item.route ? (
                                        <Link key={item.label} className={cls} href={route(item.route)}>{item.label}</Link>
                                    ) : (
                                        <a key={item.label} className={cls} href={item.href}>{item.label}</a>
                                    );
                                })}
                            </div>
                        </div>
                    ))}

                    <div className="pt-1">
                        <Link className={topLink(route().current('profile.edit'))} href={route('profile.edit')}>
                            <span className="material-symbols-outlined mr-3">settings</span>
                            <span className="font-body text-sm font-semibold">Configurações</span>
                        </Link>
                    </div>
                </nav>

                {/* Sair (no celular o botão do topo fica escondido) */}
                <div className="sm:hidden border-t border-slate-200/70 mt-3 pt-3">
                    <div className="px-4 pb-2 text-xs font-bold text-slate-500 truncate">{user.name}</div>
                    <Link href={route('logout')} method="post" as="button" className="w-full flex items-center px-4 py-3 rounded-xl text-error font-semibold text-sm hover:bg-red-50">
                        <span className="material-symbols-outlined mr-3">logout</span>
                        Sair
                    </Link>
                </div>
            </aside>

            {/* Main Content Canvas */}
            <main className="lg:ml-72 pt-16 lg:pt-24 pb-20 lg:pb-0 min-h-screen bg-slate-50 dark:bg-slate-900">
                {children}
            </main>

            {/* Barra inferior no celular */}
            <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t border-slate-200 grid grid-cols-5 pb-[env(safe-area-inset-bottom)]">
                {TABS.map((tab) => {
                    const active = isCurrent(tab);
                    return (
                        <Link key={tab.label} href={route(tab.route)} className={`flex flex-col items-center justify-center gap-0.5 h-16 text-[11px] font-semibold ${active ? 'text-primary' : 'text-slate-500'}`}>
                            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}>{tab.icon}</span>
                            {tab.label}
                        </Link>
                    );
                })}
                <button type="button" onClick={() => setMenuOpen(true)} className="flex flex-col items-center justify-center gap-0.5 h-16 text-[11px] font-semibold text-slate-500">
                    <span className="material-symbols-outlined text-2xl">more_horiz</span>
                    Mais
                </button>
            </nav>
        </div>
    );
}
