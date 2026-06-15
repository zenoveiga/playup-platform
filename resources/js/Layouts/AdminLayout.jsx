import { Link, usePage } from '@inertiajs/react';

export default function AdminLayout({ children }) {
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
                            placeholder="Buscar em PlayUp..." 
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
                            <p className="text-[10px] text-outline font-medium">Master Admin</p>
                        </div>
                        <img 
                            alt="Admin User Avatar" 
                            className="w-10 h-10 rounded-xl object-cover" 
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBY__ywErMBdhJeGmNT5joA6XahfdnGBSjLQiEdM5cT7PnL9QYl4aPHDconJG89RISsbLIxI5VWALAfHHBrxJxslAl0dEC599CMSl6OmFaC4uDGFVYqtb3BGe0FOwV5TlSXsbxlvk5N48WEOWmdeLlnGdR24z3ZwqOzKSxva0r5HeM4ODxkhrfmKaXdamaWei-0v-njfp4o8XPt5xbDpSEKQW_trLgp0Mqwt27QiE5dTGlUMCvxDyhEqcA5ozjaDd7PfzUJkTm7WSs"
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
                        <img 
                            alt="PlayUp Logo" 
                            className="w-10 h-10 object-contain" 
                            src="https://lh3.googleusercontent.com/aida/ADBb0ujjMtbP5QMlZPGkRV2MC2aBO2D_Otck_Qk8vxtNqxMdMhWeJOUxCQm8rStFOTGRxTTy3NIyEG3520ikvHIgCWD4VRN_7rInuEKt3vzWWSnFC01wANIRs3-znFDeSGcFkyYBJ1-Ipx2Nuo6USdCpnLboiq8PyBZBsR6CxWAgOhF3UexQGz-pfwoTWFGtJ8s8A9H6-5Cig7sSHB7ycoNj_2t-HD9CVCnjQxA22CKwRxTCvCejoN4F_HSw6PYG18lHlI5p7ar424AQzQ"
                        />
                        <div>
                            <h1 className="text-2xl font-black text-[#0050d4] dark:text-[#00D1FF] leading-none">PlayUp</h1>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#003346]/40 dark:text-white/40">Velocity Admin</p>
                        </div>
                    </div>
                </div>
                <nav className="flex-1 space-y-1">
                    <Link 
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-sm font-bold transition-all duration-200 ${
                            route().current('admin.dashboard') 
                                ? 'bg-white dark:bg-slate-800 text-[#0050d4] dark:text-[#00D1FF]' 
                                : 'text-[#003346]/70 dark:text-white/70 hover:bg-white/40 dark:hover:bg-slate-800/40 hover:translate-x-1'
                        }`} 
                        href={route('admin.dashboard')}
                    >
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
                        <span className="font-['Manrope'] text-sm">Painel Rápido</span>
                    </Link>
                    <Link 
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl hover:translate-x-1 transition-all duration-200 ${
                            route().current('admin.students.index') 
                                ? 'bg-white dark:bg-slate-800 text-[#0050d4] dark:text-[#00D1FF] font-bold shadow-sm' 
                                : 'text-[#003346]/70 dark:text-white/70 hover:bg-white/40 dark:hover:bg-slate-800/40'
                        }`} 
                        href={route('admin.students.index')}
                    >
                        <span className="material-symbols-outlined">group</span>
                        <span className="font-['Manrope'] text-sm">Alunos</span>
                    </Link>
                    <a className="flex items-center gap-3 px-4 py-3 text-[#003346]/70 dark:text-white/70 hover:bg-white/40 dark:hover:bg-slate-800/40 rounded-xl hover:translate-x-1 transition-all duration-200" href="#">
                        <span className="material-symbols-outlined">location_on</span>
                        <span className="font-['Manrope'] text-sm">Polos</span>
                    </a>
                    <Link 
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl hover:translate-x-1 transition-all duration-200 ${
                            route().current('admin.courses.index') 
                                ? 'bg-white dark:bg-slate-800 text-[#0050d4] dark:text-[#00D1FF] font-bold shadow-sm' 
                                : 'text-[#003346]/70 dark:text-white/70 hover:bg-white/40 dark:hover:bg-slate-800/40'
                        }`} 
                        href={route('admin.courses.index')}
                    >
                        <span className="material-symbols-outlined">auto_stories</span>
                        <span className="font-['Manrope'] text-sm">Cursos e Pacotes</span>
                    </Link>
                    <a className="flex items-center gap-3 px-4 py-3 text-[#003346]/70 dark:text-white/70 hover:bg-white/40 dark:hover:bg-slate-800/40 rounded-xl hover:translate-x-1 transition-all duration-200" href="#">
                        <span className="material-symbols-outlined">school</span>
                        <span className="font-['Manrope'] text-sm">Turmas</span>
                    </a>
                    <a className="flex items-center gap-3 px-4 py-3 text-[#003346]/70 dark:text-white/70 hover:bg-white/40 dark:hover:bg-slate-800/40 rounded-xl hover:translate-x-1 transition-all duration-200" href="#">
                        <span className="material-symbols-outlined">psychology</span>
                        <span className="font-['Manrope'] text-sm">Pedagógico</span>
                    </a>
                    <a className="flex items-center gap-3 px-4 py-3 text-[#003346]/70 dark:text-white/70 hover:bg-white/40 dark:hover:bg-slate-800/40 rounded-xl hover:translate-x-1 transition-all duration-200" href="#">
                        <span className="material-symbols-outlined">inventory</span>
                        <span className="font-['Manrope'] text-sm">Produtos</span>
                    </a>
                    <a className="flex items-center gap-3 px-4 py-3 text-[#003346]/70 dark:text-white/70 hover:bg-white/40 dark:hover:bg-slate-800/40 rounded-xl hover:translate-x-1 transition-all duration-200" href="#">
                        <span className="material-symbols-outlined">payments</span>
                        <span className="font-['Manrope'] text-sm">Financeiro</span>
                    </a>
                    <a className="flex items-center gap-3 px-4 py-3 text-[#003346]/70 dark:text-white/70 hover:bg-white/40 dark:hover:bg-slate-800/40 rounded-xl hover:translate-x-1 transition-all duration-200" href="#">
                        <span className="material-symbols-outlined">trending_up</span>
                        <span className="font-['Manrope'] text-sm">Vendas</span>
                    </a>
                    <a className="flex items-center gap-3 px-4 py-3 text-[#003346]/70 dark:text-white/70 hover:bg-white/40 dark:hover:bg-slate-800/40 rounded-xl hover:translate-x-1 transition-all duration-200" href="#">
                        <span className="material-symbols-outlined">badge</span>
                        <span className="font-['Manrope'] text-sm">Funcionários</span>
                    </a>
                    <a className="flex items-center gap-3 px-4 py-3 text-[#003346]/70 dark:text-white/70 hover:bg-white/40 dark:hover:bg-slate-800/40 rounded-xl hover:translate-x-1 transition-all duration-200" href="#">
                        <span className="material-symbols-outlined">receipt_long</span>
                        <span className="font-['Manrope'] text-sm">Contas a Pagar</span>
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
                            <span className="material-symbols-outlined">support_agent</span>
                            <span className="font-['Manrope'] text-sm">Suporte</span>
                        </a>
                    </div>
                </nav>
                <div className="mt-8 px-2">
                    <button className="w-full py-4 kinetic-gradient text-white rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 font-bold active:scale-95 transition-transform">
                        <span className="material-symbols-outlined">add_shopping_cart</span>
                        <span>Fazer Nova Venda</span>
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
