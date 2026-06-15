import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    return (
        <>
            <Head title="Play Up - Transforme sua escola online" />
            <div className="bg-background text-on-background font-sans min-h-screen">
                {/* TopNavBar */}
                <header className="bg-white/70 dark:bg-slate-950/70 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 sticky top-0 z-50">
                    <nav className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
                        <div className="flex items-center gap-8">
                            <Link className="flex items-center" href="/">
                                <img 
                                    alt="Play Up Logo" 
                                    className="object-contain object-left w-[140px] h-[40px]" 
                                    src="https://lh3.googleusercontent.com/aida/ADBb0uhS1JcQe8AiNAlR6jdKB6a8a4bwg0bGlB00VmLMT64X6h80yhV1uDpzVraS8eDbtG5Ln43dYbFr_GZmAqvIhWfKSVFsPeiuJvesQZl0MqRHPN27xPCBI-sFD1JFM49J3H7-p1XoJGQuRzllyu5Xz6-nxq2O-DD7oXQe7bRavFBPsacntHyR-Ge-9Ig8Mkhzc4WXUYdAo6A_7EpjtgHg7Mevsbz--PCEqDNHQZ0pgIag5jHp6oO0L-qYkCsFjTQmni0adYc49UlXZA"
                                />
                            </Link>
                            <div className="hidden md:flex gap-6">
                                <a className="font-headline text-sm font-semibold text-primary border-b-2 border-primary transition-colors" href="#">Home</a>
                                <a className="font-headline text-sm font-semibold text-[#507c94] hover:text-primary transition-colors" href="#como-funciona">Como funciona</a>
                                <a className="font-headline text-sm font-semibold text-[#507c94] hover:text-primary transition-colors" href="#beneficios">Diferenciais</a>
                                <a className="font-headline text-sm font-semibold text-[#507c94] hover:text-primary transition-colors" href="#recursos">Recursos</a>
                            </div>
                        </div>
                        
                        <div>
                            {auth.user ? (
                                <Link 
                                    href={route('dashboard')} 
                                    className="bg-primary text-white px-6 py-2.5 rounded-full font-semibold text-sm hover:opacity-90 hover:scale-[1.02] shadow-md shadow-primary/20 transition-all text-center inline-block font-headline"
                                >
                                    Painel Rápido
                                </Link>
                            ) : (
                                <div className="flex items-center gap-4">
                                    <Link 
                                        href={route('login')} 
                                        className="text-[#507c94] hover:text-primary font-semibold text-sm transition-colors font-headline"
                                    >
                                        Entrar
                                    </Link>
                                    <Link 
                                        href={route('register')} 
                                        className="bg-primary text-white px-6 py-2.5 rounded-full font-semibold text-sm hover:opacity-90 hover:scale-[1.02] shadow-md shadow-primary/20 transition-all text-center inline-block font-headline"
                                    >
                                        Criar Conta
                                    </Link>
                                </div>
                            )}
                        </div>
                    </nav>
                </header>

                <main>
                    {/* Hero Section */}
                    <section className="relative overflow-hidden pt-20 pb-20">
                        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
                            <div className="z-10">
                                <span className="inline-block py-1 px-3 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold mb-6 uppercase tracking-wider">
                                    Educação do Futuro
                                </span>
                                <h1 className="font-headline text-4xl sm:text-5xl font-extrabold text-on-surface mb-6 leading-tight">
                                    Transforme sua escola em uma potência digital com a <span className="text-primary">Play Up</span>
                                </h1>
                                <p className="text-lg text-on-surface-variant mb-10 max-w-lg">
                                    A plataforma definitiva para escolas que querem escalar seus cursos e oferecer uma experiência de aprendizado de elite.
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    <Link 
                                        href={auth.user ? route('dashboard') : route('register')}
                                        className="bg-primary text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-primary/25 hover:scale-[1.02] hover:shadow-xl transition-all text-center inline-block font-headline"
                                    >
                                        Comece Agora
                                    </Link>
                                    <a 
                                        href="#como-funciona" 
                                        className="border-2 border-secondary-container text-[#00647b] dark:text-[#80deff] px-8 py-4 rounded-xl font-bold hover:bg-secondary-container/10 hover:scale-[1.02] transition-all text-center inline-block font-headline"
                                    >
                                        Ver Demonstração
                                    </a>
                                </div>
                            </div>
                            <div className="relative">
                                <div className="absolute -top-12 -right-12 w-64 h-64 bg-secondary-container/20 rounded-full blur-3xl"></div>
                                <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-primary-fixed/20 rounded-full blur-3xl"></div>
                                <img 
                                    alt="Digital Education Elite" 
                                    className="rounded-3xl shadow-2xl relative z-10 w-full object-cover aspect-[4/3] border border-surface-container-high/40" 
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1xPcbS-03txzRQjFBZsgZDstejWdk_RY-w465m_skn0xOXdt_Mfsl5foygwoEbdk5CRkgtX30i3en9CER_Jap40wRdwJ-ALVQrbuM3oV92R6P_0okEgcN6xaVPEbWWXkd4nwcFYLt109iz3jfQOvx-GhvnZgn33rqOOfKsGQ-FwVdBed7-ylkPpILDFmDegbCyZP3vtZ77GxcVukk8SKStnWDmSHFZ69KhGQF1_CaOBKPLwtt2ck_aDZgGmMOHEcgbP8ZN9bk7jT8"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Problem Section */}
                    <section id="como-funciona" className="py-24 bg-surface-container-low">
                        <div className="max-w-7xl mx-auto px-6">
                            <div className="text-center mb-16">
                                <h2 className="font-headline text-3xl font-bold text-on-surface mb-4">Por que a maioria das escolas EAD estagna?</h2>
                                <p className="text-on-surface-variant max-w-2xl mx-auto">Gerenciar uma operação digital exige mais do que apenas vídeos. Sem as ferramentas certas, o crescimento se torna seu maior inimigo.</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-outline-variant/30 flex flex-col items-center text-center hover:scale-[1.02] transition-transform">
                                    <div className="w-16 h-16 rounded-full bg-error-container text-on-error-container flex items-center justify-center mb-6 shadow-sm">
                                        <span className="material-symbols-outlined text-3xl text-error dark:text-white">account_tree</span>
                                    </div>
                                    <h3 className="font-headline text-xl font-bold mb-3 text-on-surface">Gestão Fragmentada</h3>
                                    <p className="text-on-surface-variant text-sm leading-relaxed">Várias ferramentas que não se falam, causando perda de dados e retrabalho manual constante.</p>
                                </div>
                                <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-outline-variant/30 flex flex-col items-center text-center hover:scale-[1.02] transition-transform">
                                    <div className="w-16 h-16 rounded-full bg-error-container text-on-error-container flex items-center justify-center mb-6 shadow-sm">
                                        <span className="material-symbols-outlined text-3xl text-error dark:text-white">person_remove</span>
                                    </div>
                                    <h3 className="font-headline text-xl font-bold mb-3 text-on-surface">Baixa Retenção</h3>
                                    <p className="text-on-surface-variant text-sm leading-relaxed">Plataformas genéricas e frias que resultam em alunos desmotivados e altas taxas de cancelamento.</p>
                                </div>
                                <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-outline-variant/30 flex flex-col items-center text-center hover:scale-[1.02] transition-transform">
                                    <div className="w-16 h-16 rounded-full bg-error-container text-on-error-container flex items-center justify-center mb-6 shadow-sm">
                                        <span className="material-symbols-outlined text-3xl text-error dark:text-white">settings_suggest</span>
                                    </div>
                                    <h3 className="font-headline text-xl font-bold mb-3 text-on-surface">Complexidade Técnica</h3>
                                    <p className="text-on-surface-variant text-sm leading-relaxed">Sua equipe perde tempo resolvendo bugs e problemas de servidor em vez de focar no conteúdo.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Solution/Benefits Section */}
                    <section id="beneficios" className="py-24 bg-white dark:bg-slate-950">
                        <div className="max-w-7xl mx-auto px-6">
                            <div className="text-center mb-16">
                                <h2 className="font-headline text-3xl font-bold text-on-surface mb-4">Sua escola EAD completa, em um só lugar.</h2>
                                <p className="text-on-surface-variant max-w-2xl mx-auto">A Play Up resolve o caos operacional com uma infraestrutura de elite projetada para alta performance.</p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                                {/* Scalability - md:col-span-8 */}
                                <div className="md:col-span-8 bg-primary-container p-10 rounded-3xl text-on-primary-container relative overflow-hidden flex flex-col justify-between min-h-[400px] hover:shadow-lg transition-shadow">
                                    <div>
                                        <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block">Zero Preocupação Técnica</span>
                                        <h3 className="font-headline text-3xl font-extrabold mb-4">Escalabilidade Ilimitada</h3>
                                        <p className="opacity-90 max-w-md text-lg leading-relaxed">Esqueça quedas de servidor. Nossa infraestrutura elástica suporta de 10 a 100.000 alunos simultâneos com 99.9% de uptime garantido.</p>
                                    </div>
                                    <img 
                                        alt="Scale visualization" 
                                        className="absolute bottom-[-5%] right-[-5%] w-3/4 rounded-2xl shadow-2xl opacity-50 rotate-[-3deg] hidden sm:block pointer-events-none" 
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBITRmreKA4MoiMxNnIkP2fuW2Y_4bGHy9SfZWiIwURnqGFaY5oTIFCyF-KTZDKa0yJnxUbhtBjifQ6w7ZZW-08AvMz1dpBslcDbRnCZ7YwyGEweIKkM1EsjSnYCcg84_05uzbJjvZr3I66w4i_klEI90ALWN79qu1wYr021PwXPYNJqgBQm8CyQ5-GACM8bnft9Y5Yu-pEP2bVoc9TtE70iduM_ZpDdtDEeiZrEaIMQUx-PJ-u3GAfOFGu-X-qeEaiLAI3NsPOUb0z"
                                    />
                                </div>

                                {/* Premium Experience - md:col-span-4 */}
                                <div className="md:col-span-4 bg-secondary-container p-10 rounded-3xl text-on-secondary-container relative overflow-hidden flex flex-col justify-between min-h-[400px] hover:shadow-lg transition-shadow">
                                    <div>
                                        <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block">Design Elite</span>
                                        <h3 className="font-headline text-3xl font-extrabold mb-4">Interface Premium</h3>
                                        <p className="opacity-95 text-base leading-relaxed">Um ambiente de aprendizado moderno e fluido que seus alunos vão amar usar todos os dias.</p>
                                    </div>
                                    <div className="mt-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 self-end w-full shadow-inner">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white text-xs font-bold">PU</div>
                                            <div>
                                                <div className="h-2 w-20 bg-secondary rounded"></div>
                                                <div className="h-1.5 w-12 bg-secondary/60 rounded mt-1"></div>
                                            </div>
                                        </div>
                                        <div className="h-2 w-full bg-secondary/35 rounded mt-3"></div>
                                        <div className="h-2 w-3/4 bg-secondary/35 rounded mt-1.5"></div>
                                    </div>
                                </div>

                                {/* Integrated Dashboard - md:col-span-4 */}
                                <div className="md:col-span-4 bg-surface-container-high text-on-surface p-10 rounded-3xl relative overflow-hidden flex flex-col justify-between min-h-[400px] border border-surface-container-highest/50 hover:shadow-lg transition-shadow">
                                    <div>
                                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block">Gestão Eficiente</span>
                                        <h3 className="font-headline text-3xl font-extrabold mb-4">Tudo Em Um</h3>
                                        <p className="text-on-surface-variant text-base leading-relaxed">Gerencie matrículas, turmas, cursos e relatórios em uma única plataforma.</p>
                                    </div>
                                    <div className="space-y-2.5 mt-6 w-full">
                                        <div className="flex items-center gap-3 bg-white/50 dark:bg-slate-900/50 p-3 rounded-xl border border-surface-container-highest/40">
                                            <span className="material-symbols-outlined text-green-500 font-bold">check_circle</span>
                                            <span className="text-xs font-semibold">Alunos sob controle</span>
                                        </div>
                                        <div className="flex items-center gap-3 bg-white/50 dark:bg-slate-900/50 p-3 rounded-xl border border-surface-container-highest/40">
                                            <span className="material-symbols-outlined text-green-500 font-bold">check_circle</span>
                                            <span className="text-xs font-semibold">Cursos estruturados</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Analytics & Reports - md:col-span-8 */}
                                <div className="md:col-span-8 bg-surface-container text-on-surface p-10 rounded-3xl relative overflow-hidden flex flex-col justify-between min-h-[400px] border border-surface-container-high/50 hover:shadow-lg transition-shadow">
                                    <div>
                                        <span className="bg-secondary/15 text-secondary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block">Alta Performance</span>
                                        <h3 className="font-headline text-3xl font-extrabold mb-4">Relatórios Inteligentes</h3>
                                        <p className="text-on-surface-variant text-lg leading-relaxed max-w-lg">Acompanhe métricas de progresso de alunos, engajamento com aulas e performance de matrículas com gráficos completos.</p>
                                    </div>
                                    
                                    <div className="flex items-end gap-3 mt-6 self-end w-full sm:w-2/3 h-32 bg-white/40 dark:bg-slate-900/40 p-4 rounded-2xl border border-surface-container-high/60">
                                        <div className="w-full bg-primary/20 h-[30%] rounded-t-md"></div>
                                        <div className="w-full bg-primary/45 h-[65%] rounded-t-md"></div>
                                        <div className="w-full bg-primary/70 h-[50%] rounded-t-md"></div>
                                        <div className="w-full bg-primary h-[90%] rounded-t-md"></div>
                                        <div className="w-full bg-secondary h-[75%] rounded-t-md"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* CTA Section */}
                    <section className="py-24 bg-primary text-white text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-container/30 via-transparent to-transparent pointer-events-none"></div>
                        <div className="max-w-4xl mx-auto px-6 relative z-10">
                            <h2 className="font-headline text-4xl sm:text-5xl font-extrabold mb-6 leading-tight">
                                Pronto para elevar o nível da sua escola?
                            </h2>
                            <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">
                                Junte-se a centenas de escolas que utilizam a Play Up para impulsionar a educação digital.
                            </p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <Link 
                                    href={auth.user ? route('dashboard') : route('register')}
                                    className="bg-white text-primary px-8 py-4 rounded-xl font-bold hover:scale-105 shadow-xl hover:bg-slate-100 transition-all font-headline"
                                >
                                    Comece Agora
                                </Link>
                                <a 
                                    href="https://playup.com.br" 
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="border-2 border-white/60 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/10 hover:scale-102 transition-all font-headline"
                                >
                                    Falar com Especialista
                                </a>
                            </div>
                        </div>
                    </section>
                </main>

                {/* Footer */}
                <footer className="bg-slate-50 dark:bg-slate-950 py-16 border-t border-slate-200 dark:border-slate-800">
                    <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex flex-col items-center md:items-start gap-4">
                            <Link href="/">
                                <img 
                                    alt="Play Up Logo" 
                                    className="object-contain object-left w-[140px] h-[40px]" 
                                    src="https://lh3.googleusercontent.com/aida/ADBb0uhS1JcQe8AiNAlR6jdKB6a8a4bwg0bGlB00VmLMT64X6h80yhV1uDpzVraS8eDbtG5Ln43dYbFr_GZmAqvIhWfKSVFsPeiuJvesQZl0MqRHPN27xPCBI-sFD1JFM49J3H7-p1XoJGQuRzllyu5Xz6-nxq2O-DD7oXQe7bRavFBPsacntHyR-Ge-9Ig8Mkhzc4WXUYdAo6A_7EpjtgHg7Mevsbz--PCEqDNHQZ0pgIag5jHp6oO0L-qYkCsFjTQmni0adYc49UlXZA"
                                />
                            </Link>
                            <p className="font-headline text-sm text-slate-500">
                                © 2026 Play Up. Professional, Innovative, and Educational.
                            </p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-8 font-headline">
                            <a className="text-sm text-slate-500 hover:text-primary transition-all" href="#">Política de Privacidade</a>
                            <a className="text-sm text-slate-500 hover:text-primary transition-all" href="#">Termos de Uso</a>
                            <a className="text-sm text-slate-500 hover:text-primary transition-all" href="#">Suporte</a>
                            <a className="text-sm text-slate-500 hover:text-primary transition-all" href="#">Portal do Aluno</a>
                        </div>
                    </div>
                    <div className="max-w-7xl mx-auto px-6 mt-8 pt-8 border-t border-slate-200/50 dark:border-slate-800/50 text-center text-xs text-slate-400">
                        Laravel v{laravelVersion} (PHP v{phpVersion})
                    </div>
                </footer>
            </div>
        </>
    );
}
