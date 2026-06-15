import StudentLayout from '@/Layouts/StudentLayout';
import { Head, usePage } from '@inertiajs/react';

export default function Dashboard() {
    const { auth } = usePage().props;
    const user = auth.user;

    return (
        <StudentLayout>
            <Head title="Meu Painel" />
            
            <div className="p-8 max-w-7xl mx-auto space-y-8">
                {/* Welcome Hero Section */}
                <section className="kinetic-gradient p-8 rounded-[1.5rem] text-white flex flex-col md:flex-row justify-between items-center shadow-lg shadow-primary/10 gap-6">
                    <div className="space-y-2 text-center md:text-left">
                        <span className="text-xs font-black uppercase tracking-[0.2em] opacity-80">Portal do Aluno</span>
                        <h2 className="text-4xl font-extrabold tracking-tight">Olá, {user.name}!</h2>
                        <p className="opacity-80 text-sm max-w-md">Pronto para a sua dose diária de aprendizado? Você já completou 64% da sua meta semanal.</p>
                    </div>
                    <div className="bg-white/10 border border-white/20 backdrop-blur-md px-6 py-4 rounded-2xl text-center">
                        <p className="text-3xl font-black text-white">4.8</p>
                        <p className="text-[10px] text-white/70 uppercase font-bold tracking-wider mt-1">Sua Nota Média</p>
                    </div>
                </section>

                {/* Main Bento Grid */}
                <section className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Courses in Progress */}
                    <div className="md:col-span-8 bg-surface-container-lowest p-8 rounded-[1.5rem] shadow-sm space-y-6">
                        <div className="flex justify-between items-center">
                            <h4 className="text-xl font-bold text-on-surface">Meus Cursos em Andamento</h4>
                            <span className="text-xs text-primary font-bold hover:underline cursor-pointer">Ver todos</span>
                        </div>
                        
                        <div className="space-y-6">
                            <div className="border border-outline-variant/15 p-4 rounded-2xl flex flex-col sm:flex-row gap-4 items-center hover:border-primary/30 transition-colors">
                                <div className="w-16 h-16 rounded-xl bg-surface-container-high overflow-hidden shrink-0">
                                    <img 
                                        alt="Course logo" 
                                        className="w-full h-full object-cover" 
                                        src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=120&auto=format&fit=crop"
                                    />
                                </div>
                                <div className="flex-1 w-full space-y-2">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-sm font-bold text-on-surface">Desenvolvimento Fullstack React & Laravel</p>
                                            <p className="text-xs text-outline font-medium">Módulo 4: Integração de APIs com Axios</p>
                                        </div>
                                        <span className="text-xs font-black text-primary">64%</span>
                                    </div>
                                    <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                                        <div className="h-full kinetic-gradient w-[64%]"></div>
                                    </div>
                                </div>
                                <button className="kinetic-gradient text-white font-bold text-xs px-4 py-3 rounded-xl shadow-md shrink-0 w-full sm:w-auto hover:opacity-90 active:scale-95 transition-transform">
                                    Continuar Aula
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Pending Tasks */}
                    <div className="md:col-span-4 bg-surface-container-lowest p-8 rounded-[1.5rem] shadow-sm space-y-6">
                        <h4 className="text-xl font-bold text-on-surface">Tarefas Pendentes</h4>
                        
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-3 hover:bg-surface-container-low rounded-xl transition-colors">
                                <span className="material-symbols-outlined text-error text-xl shrink-0">event_busy</span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-on-surface truncate">Projeto Integrador (Etapa 1)</p>
                                    <p className="text-xs text-outline">Entrega até amanhã, 23:59</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 hover:bg-surface-container-low rounded-xl transition-colors">
                                <span className="material-symbols-outlined text-[#003346]/40 text-xl shrink-0">assignment</span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-on-surface truncate">Exercício: Rotas com Inertia.js</p>
                                    <p className="text-xs text-outline">Entrega em 5 dias</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Achievements */}
                    <div className="md:col-span-6 bg-surface-container-lowest p-8 rounded-[1.5rem] shadow-sm space-y-6">
                        <h4 className="text-xl font-bold text-on-surface">Minhas Conquistas</h4>
                        <div className="grid grid-cols-4 gap-4">
                            <div className="flex flex-col items-center text-center space-y-2">
                                <div className="w-12 h-12 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center shadow-sm" title="Primeiro código enviado">
                                    <span className="material-symbols-outlined text-xl">terminal</span>
                                </div>
                                <span className="text-[10px] font-bold text-outline">Coder</span>
                            </div>
                            <div className="flex flex-col items-center text-center space-y-2">
                                <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shadow-sm" title="7 dias seguidos de acesso">
                                    <span className="material-symbols-outlined text-xl">local_fire_department</span>
                                </div>
                                <span className="text-[10px] font-bold text-outline">Constante</span>
                            </div>
                            <div className="flex flex-col items-center text-center space-y-2">
                                <div className="w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shadow-sm" title="Completou módulo de banco de dados">
                                    <span className="material-symbols-outlined text-xl">database</span>
                                </div>
                                <span className="text-[10px] font-bold text-outline">DB Guru</span>
                            </div>
                            <div className="flex flex-col items-center text-center space-y-2">
                                <div className="w-12 h-12 rounded-full bg-surface-container-high text-outline flex items-center justify-center opacity-40 shadow-sm" title="Ainda não desbloqueado">
                                    <span className="material-symbols-outlined text-xl">lock</span>
                                </div>
                                <span className="text-[10px] font-bold text-outline/50">Certificado</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="md:col-span-6 bg-surface-container-lowest p-8 rounded-[1.5rem] shadow-sm space-y-6">
                        <h4 className="text-xl font-bold text-on-surface">Estatísticas Rápidas</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-surface-container-low p-4 rounded-2xl text-center">
                                <p className="text-2xl font-black text-primary">124h</p>
                                <p className="text-[10px] text-outline font-bold uppercase tracking-wider mt-1">Tempo de Estudo</p>
                            </div>
                            <div className="bg-surface-container-low p-4 rounded-2xl text-center">
                                <p className="text-2xl font-black text-tertiary">98.2%</p>
                                <p className="text-[10px] text-outline font-bold uppercase tracking-wider mt-1">Presença Geral</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </StudentLayout>
    );
}
