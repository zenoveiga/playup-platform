import { Link, usePage } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function StudentLayout({ children }) {
    const { auth } = usePage().props;
    const user = auth.user;

    return (
        <div className="bg-surface min-h-screen">
            {/* TopAppBar */}
            <header className="fixed top-0 right-0 left-72 flex justify-between items-center px-6 h-16 bg-[#eff8ff]/70 backdrop-blur-xl dark:bg-slate-950/70 z-40">
                <div className="flex items-center gap-8">
                    <div className="hidden md:flex items-center bg-surface-container px-4 py-2 rounded-xl gap-2 w-96">
                        <span className="material-symbols-outlined text-outline text-sm">search</span>
                        <input 
                            className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder-outline-variant text-on-surface" 
                            placeholder="Buscar cursos, aulas..." 
                            type="text"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button className="p-2 rounded-full hover:bg-[#c2e8ff] transition-colors relative">
                        <span className="material-symbols-outlined text-[#003346]">notifications</span>
                        <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
                    </button>
                    <button className="p-2 rounded-full hover:bg-[#c2e8ff] transition-colors">
                        <span className="material-symbols-outlined text-[#003346]">help_outline</span>
                    </button>
                    <div className="flex items-center gap-3 pl-4 border-l border-outline-variant/15">
                        <div className="text-right hidden sm:block">
                            <p className="text-xs font-bold text-on-surface leading-none">{user.name}</p>
                            <p className="text-[10px] text-outline font-medium">Aluno</p>
                        </div>
                        <img 
                            alt="Student Avatar" 
                            className="w-10 h-10 rounded-xl object-cover" 
                            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=120&auto=format&fit=crop"
                        />
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
                        <ApplicationLogo 
                            className="w-10 h-10 object-contain text-primary dark:text-[#00D1FF]" 
                        />
                        <div>
                            <h1 className="text-2xl font-black text-[#0050d4] dark:text-[#00D1FF] leading-none">PlayUp</h1>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#003346]/40 dark:text-white/40">Student Hub</p>
                        </div>
                    </div>
                </div>
                <nav className="flex-1 space-y-1">
                    <Link 
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-sm font-bold transition-all duration-200 ${
                            route().current('student.dashboard') 
                                ? 'bg-white dark:bg-slate-800 text-[#0050d4] dark:text-[#00D1FF]' 
                                : 'text-[#003346]/70 dark:text-white/70 hover:bg-white/40 dark:hover:bg-slate-800/40 hover:translate-x-1'
                        }`} 
                        href={route('student.dashboard')}
                    >
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
                        <span className="font-['Manrope'] text-sm">Painel do Aluno</span>
                    </Link>
                    <a className="flex items-center gap-3 px-4 py-3 text-[#003346]/70 dark:text-white/70 hover:bg-white/40 dark:hover:bg-slate-800/40 rounded-xl hover:translate-x-1 transition-all duration-200" href="#">
                        <span className="material-symbols-outlined">auto_stories</span>
                        <span className="font-['Manrope'] text-sm">Meus Cursos</span>
                    </a>
                    <a className="flex items-center gap-3 px-4 py-3 text-[#003346]/70 dark:text-white/70 hover:bg-white/40 dark:hover:bg-slate-800/40 rounded-xl hover:translate-x-1 transition-all duration-200" href="#">
                        <span className="material-symbols-outlined">class</span>
                        <span className="font-['Manrope'] text-sm">Minhas Aulas</span>
                    </a>
                    <a className="flex items-center gap-3 px-4 py-3 text-[#003346]/70 dark:text-white/70 hover:bg-white/40 dark:hover:bg-slate-800/40 rounded-xl hover:translate-x-1 transition-all duration-200" href="#">
                        <span className="material-symbols-outlined">assignment</span>
                        <span className="font-['Manrope'] text-sm">Tarefas e Exercícios</span>
                    </a>
                    <a className="flex items-center gap-3 px-4 py-3 text-[#003346]/70 dark:text-white/70 hover:bg-white/40 dark:hover:bg-slate-800/40 rounded-xl hover:translate-x-1 transition-all duration-200" href="#">
                        <span className="material-symbols-outlined">workspace_premium</span>
                        <span className="font-['Manrope'] text-sm">Certificados</span>
                    </a>
                    <a className="flex items-center gap-3 px-4 py-3 text-[#003346]/70 dark:text-white/70 hover:bg-white/40 dark:hover:bg-slate-800/40 rounded-xl hover:translate-x-1 transition-all duration-200" href="#">
                        <span className="material-symbols-outlined">credit_card</span>
                        <span className="font-['Manrope'] text-sm">Financeiro</span>
                    </a>
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
                        <a className="flex items-center gap-3 px-4 py-3 text-[#003346]/70 dark:text-white/70 hover:bg-white/40 dark:hover:bg-slate-800/40 rounded-xl hover:translate-x-1 transition-all duration-200" href="#">
                            <span className="material-symbols-outlined">help_center</span>
                            <span className="font-['Manrope'] text-sm">Central de Ajuda</span>
                        </a>
                    </div>
                </nav>
                <div className="mt-8 px-2">
                    <button className="w-full py-4 kinetic-gradient text-white rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 font-bold active:scale-95 transition-transform">
                        <span className="material-symbols-outlined">local_library</span>
                        <span>Ver Novo Curso</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Canvas */}
            <main className="ml-72 pt-16 min-h-screen bg-surface">
                {children}
            </main>
        </div>
    );
}
