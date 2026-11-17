import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const NAV = [
    { route: 'platform.dashboard', match: 'platform.dashboard', icon: 'dashboard', label: 'Painel Geral' },
    { route: 'platform.licensees.index', match: 'platform.licensees.*', icon: 'storefront', label: 'Licenciados', badge: 'pendingLicensees' },
    { route: 'platform.courses.index', match: 'platform.courses.*', icon: 'auto_stories', label: 'Cursos' },
    { route: 'platform.modules.index', match: 'platform.modules.*', icon: 'view_module', label: 'Biblioteca de Módulos' },
    { route: 'platform.users.index', match: 'platform.users.*', icon: 'admin_panel_settings', label: 'Usuários Admin' },
];

function FlashToast() {
    const { flash } = usePage().props;
    const [toast, setToast] = useState(null);

    useEffect(() => {
        if (flash?.success) setToast({ type: 'success', message: flash.success });
        else if (flash?.error) setToast({ type: 'error', message: flash.error });
    }, [flash]);

    useEffect(() => {
        if (!toast) return;
        const t = setTimeout(() => setToast(null), 4000);
        return () => clearTimeout(t);
    }, [toast]);

    if (!toast) return null;

    const isError = toast.type === 'error';

    return (
        <div className="fixed bottom-6 right-6 z-[60] animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div
                className={`flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border ${
                    isError
                        ? 'bg-white dark:bg-slate-900 border-error/20 text-error'
                        : 'bg-white dark:bg-slate-900 border-tertiary/20 text-tertiary dark:text-[#6bfe9c]'
                }`}
            >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {isError ? 'error' : 'check_circle'}
                </span>
                <span className="text-sm font-bold text-[#003346] dark:text-white">{toast.message}</span>
                <button onClick={() => setToast(null)} className="ml-2 text-[#507c94] hover:text-primary">
                    <span className="material-symbols-outlined text-base">close</span>
                </button>
            </div>
        </div>
    );
}

export default function PlatformLayout({ children }) {
    const { auth, platform } = usePage().props;
    const user = auth.user;

    return (
        <div className="bg-surface min-h-screen">
            {/* TopAppBar */}
            <header className="fixed top-0 right-0 left-72 flex justify-between items-center px-6 h-16 bg-[#eff8ff]/70 backdrop-blur-xl dark:bg-slate-950/70 z-40">
                <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary dark:text-[#00D1FF] px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest">
                        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>shield_person</span>
                        Administração da Plataforma
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <Link
                        href={route('platform.licensees.index')}
                        className="p-2 rounded-full hover:bg-[#c2e8ff] transition-colors relative"
                        title="Licenciados aguardando aprovação"
                    >
                        <span className="material-symbols-outlined text-[#003346]">notifications</span>
                        {platform?.pendingLicensees > 0 && (
                            <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
                        )}
                    </Link>
                    <div className="flex items-center gap-3 pl-4 border-l border-outline-variant/15">
                        <div className="text-right hidden sm:block">
                            <p className="text-xs font-bold text-on-surface leading-none">{user.name}</p>
                            <p className="text-[10px] text-outline font-medium">Administrador</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl kinetic-gradient flex items-center justify-center text-white font-black text-sm">
                            {user.name?.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()}
                        </div>
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="p-2 rounded-full hover:bg-red-50 text-error flex items-center justify-center transition-colors"
                            title="Sair"
                        >
                            <span className="material-symbols-outlined text-md">logout</span>
                        </Link>
                    </div>
                </div>
            </header>

            {/* SideNavBar */}
            <aside className="h-screen w-72 fixed left-0 top-0 overflow-y-auto no-scrollbar bg-[#e2f3ff] dark:bg-slate-900 z-50 flex flex-col p-4 gap-1">
                <div className="px-4 py-6 mb-2">
                    <div className="flex items-center gap-3">
                        <ApplicationLogo className="w-10 h-10 object-contain text-primary dark:text-[#00D1FF]" />
                        <div>
                            <h1 className="text-2xl font-black text-[#0050d4] dark:text-[#00D1FF] leading-none">PlayUp</h1>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#003346]/40 dark:text-white/40">Platform Admin</p>
                        </div>
                    </div>
                </div>
                <nav className="flex-1 space-y-1">
                    {NAV.map((item) => {
                        const active = route().current(item.match);
                        const badge = item.badge ? platform?.[item.badge] : 0;
                        return (
                            <Link
                                key={item.route}
                                href={route(item.route)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl hover:translate-x-1 transition-all duration-200 ${
                                    active
                                        ? 'bg-white dark:bg-slate-800 text-[#0050d4] dark:text-[#00D1FF] font-bold shadow-sm'
                                        : 'text-[#003346]/70 dark:text-white/70 hover:bg-white/40 dark:hover:bg-slate-800/40'
                                }`}
                            >
                                <span
                                    className="material-symbols-outlined"
                                    style={active ? { fontVariationSettings: "'FILL' 1" } : {}}
                                >
                                    {item.icon}
                                </span>
                                <span className="font-['Manrope'] text-sm flex-1">{item.label}</span>
                                {badge > 0 && (
                                    <span className="bg-error text-white text-[10px] font-black px-2 py-0.5 rounded-full">{badge}</span>
                                )}
                            </Link>
                        );
                    })}
                    <div className="pt-4 mt-4 border-t border-[#003346]/10">
                        <Link
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/40 dark:hover:bg-slate-800/40 hover:translate-x-1 transition-all duration-200 ${
                                route().current('profile.edit') ? 'text-[#0050d4] font-bold' : 'text-[#003346]/70 dark:text-white/70'
                            }`}
                            href={route('profile.edit')}
                        >
                            <span className="material-symbols-outlined">settings</span>
                            <span className="font-['Manrope'] text-sm">Configurações</span>
                        </Link>
                    </div>
                </nav>
                <div className="mt-8 px-2">
                    <Link
                        href={route('platform.courses.create')}
                        className="w-full py-4 kinetic-gradient text-white rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 font-bold active:scale-95 transition-transform"
                    >
                        <span className="material-symbols-outlined">add_circle</span>
                        <span>Novo Curso</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content Canvas */}
            <main className="ml-72 pt-16 min-h-screen bg-surface">{children}</main>

            <FlashToast />
        </div>
    );
}
