import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen bg-surface dark:bg-slate-950 font-body transition-colors duration-300">
            {/* Lado Esquerdo - Banner Premium (Apenas Desktop) */}
            <div className="hidden lg:flex lg:w-1/2 kinetic-gradient relative overflow-hidden flex-col justify-between p-16 text-white select-none">
                {/* Background Shapes for Premium Depth */}
                <div className="absolute -top-16 -left-16 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>
                <div className="absolute -bottom-20 -right-20 w-[500px] h-[500px] rounded-full bg-primary-container/20 blur-3xl pointer-events-none"></div>
                
                {/* Header Logo */}
                <div className="relative z-10 flex items-center gap-3">
                    <img
                        alt="PlayUp Logo"
                        className="w-10 h-10 object-contain brightness-0 invert"
                        src="https://lh3.googleusercontent.com/aida/ADBb0ujjMtbP5QMlZPGkRV2MC2aBO2D_Otck_Qk8vxtNqxMdMhWeJOUxCQm8rStFOTGRxTTy3NIyEG3520ikvHIgCWD4VRN_7rInuEKt3vzWWSnFC01wANIRs3-znFDeSGcFkyYBJ1-Ipx2Nuo6USdCpnLboiq8PyBZBsR6CxWAgOhF3UexQGz-pfwoTWFGtJ8s8A9H6-5Cig7sSHB7ycoNj_2t-HD9CVCnjQxA22CKwRxTCvCejoN4F_HSw6PYG18lHlI5p7ar424AQzQ"
                    />
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-white leading-none">PlayUp</h1>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">Velocity Admin</p>
                    </div>
                </div>

                {/* Tagline and Graphic */}
                <div className="relative z-10 my-auto max-w-lg space-y-8">
                    <div className="space-y-4">
                        <h2 className="text-4xl font-extrabold font-headline leading-tight tracking-tight text-white">
                            Impulsione a performance da sua instituição
                        </h2>
                        <p className="text-white/85 text-lg font-medium">
                            Acelere a gestão de alunos, polos, cursos e financeiro com a plataforma administrativa mais rápida e inteligente do mercado.
                        </p>
                    </div>

                    {/* Glassmorphic Mockup Widget */}
                    <div className="glass-panel border border-white/20 p-6 rounded-3xl shadow-2xl relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                        <div className="relative z-10 flex flex-col gap-3 text-on-surface">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold uppercase tracking-wider text-[#003346]/60 dark:text-white/60">Matrículas Ativas</span>
                                <span className="bg-[#cdffd4] text-[#004a23] text-[10px] font-black px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                                    +12% <span className="material-symbols-outlined text-[10px]">trending_up</span>
                                </span>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-black text-[#003346] dark:text-[#eff8ff]">24.892</span>
                                <span className="text-xs text-[#507c94] dark:text-[#b5e3ff] font-medium">alunos este mês</span>
                            </div>
                            {/* Graphic simulation */}
                            <div className="mt-2 h-2 bg-[#cfecff] dark:bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full kinetic-gradient w-[78%] rounded-full"></div>
                            </div>
                            {/* Visual representation of recent dynamic updates */}
                            <div className="mt-2 flex gap-3 text-left">
                                <div className="flex -space-x-2">
                                    <div className="w-6 h-6 rounded-full bg-primary-container border border-white flex items-center justify-center text-[8px] font-bold text-white">RS</div>
                                    <div className="w-6 h-6 rounded-full bg-secondary-container border border-white flex items-center justify-center text-[8px] font-bold text-white">AM</div>
                                    <div className="w-6 h-6 rounded-full bg-tertiary-container border border-white flex items-center justify-center text-[8px] font-bold text-[#004a23]">PL</div>
                                </div>
                                <span className="text-[10px] text-[#507c94] dark:text-[#b5e3ff] self-center font-semibold">+47 novas matrículas hoje</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer details */}
                <div className="relative z-10 text-xs text-white/50 font-medium">
                    &copy; 2026 PlayUp Platform. Todos os direitos reservados.
                </div>
            </div>

            {/* Lado Direito - Formulário */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 min-h-screen bg-surface dark:bg-slate-950">
                <div className="w-full max-w-md">
                    {/* Logo Mobile */}
                    <div className="lg:hidden flex justify-center mb-8 gap-3 items-center">
                        <img
                            alt="PlayUp Logo"
                            className="w-10 h-10 object-contain"
                            src="https://lh3.googleusercontent.com/aida/ADBb0ujjMtbP5QMlZPGkRV2MC2aBO2D_Otck_Qk8vxtNqxMdMhWeJOUxCQm8rStFOTGRxTTy3NIyEG3520ikvHIgCWD4VRN_7rInuEKt3vzWWSnFC01wANIRs3-znFDeSGcFkyYBJ1-Ipx2Nuo6USdCpnLboiq8PyBZBsR6CxWAgOhF3UexQGz-pfwoTWFGtJ8s8A9H6-5Cig7sSHB7ycoNj_2t-HD9CVCnjQxA22CKwRxTCvCejoN4F_HSw6PYG18lHlI5p7ar424AQzQ"
                        />
                        <div className="text-left">
                            <h1 className="text-2xl font-black tracking-tight text-primary dark:text-[#00D1FF] leading-none">PlayUp</h1>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#003346]/60 dark:text-white/60">Velocity Admin</p>
                        </div>
                    </div>

                    {/* Form Card */}
                    <div className="bg-surface-container-lowest dark:bg-slate-900 shadow-xl border border-outline-variant/10 dark:border-slate-800 p-8 rounded-3xl relative overflow-hidden">
                        {/* Glow effect at top of card */}
                        <div className="absolute top-0 left-0 right-0 h-1.5 kinetic-gradient"></div>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}

