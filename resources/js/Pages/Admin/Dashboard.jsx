import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <AdminLayout>
            <Head title="Painel Rápido" />
            
            <div className="p-8 max-w-7xl mx-auto space-y-8">
                {/* Welcome Header */}
                <section className="flex flex-col md:flex-row justify-between items-end gap-4">
                    <div>
                        <h2 className="text-4xl font-extrabold text-on-surface font-['Plus_Jakarta_Sans'] tracking-tight">Dashboard Executivo</h2>
                        <p className="text-outline-variant font-medium mt-1">Bem-vindo de volta. Aqui está o desempenho da PlayUp hoje.</p>
                    </div>
                    <div className="flex gap-3">
                        <div className="flex items-center bg-surface-container-high px-4 py-2 rounded-xl text-primary font-bold text-sm">
                            <span className="material-symbols-outlined mr-2 text-lg">calendar_today</span>
                            Hoje: 24 Out, 2023
                        </div>
                    </div>
                </section>

                {/* KPI Grid */}
                <section className="grid grid-cols-1 gap-6">
                    {/* Students KPI */}
                    <div className="bg-surface-container-lowest p-6 rounded-[1.5rem] relative overflow-hidden group shadow-sm">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4">
                                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>group</span>
                            </div>
                            <p className="text-sm font-semibold text-outline-variant uppercase tracking-wider">Total de Alunos</p>
                            <div className="flex items-baseline gap-2 mt-2">
                                <h3 className="text-4xl font-black text-on-surface">24,892</h3>
                                <span className="text-tertiary text-sm font-bold flex items-center">
                                    +12% <span className="material-symbols-outlined text-xs">trending_up</span>
                                </span>
                            </div>
                            <div className="mt-4 h-1 bg-surface-container rounded-full overflow-hidden">
                                <div className="h-full kinetic-gradient w-[78%]"></div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Bento Content Grid */}
                <section className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Large Chart Placeholder Area */}
                    <div className="md:col-span-8 bg-surface-container-lowest p-8 rounded-[1.5rem] shadow-sm">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h4 className="text-xl font-bold text-on-surface">Crescimento de Matrículas</h4>
                                <p className="text-sm text-outline-variant">Performance mensal comparada ao ano anterior</p>
                            </div>
                            <select className="bg-surface-container border-none rounded-xl text-sm font-bold text-primary focus:ring-primary">
                                <option>Últimos 12 meses</option>
                                <option>Últimos 6 meses</option>
                            </select>
                        </div>
                        {/* Mockup Chart Area */}
                        <div className="h-64 flex items-end justify-between gap-4 px-4">
                            <div className="w-full bg-surface-container-high rounded-t-xl h-[40%]"></div>
                            <div className="w-full bg-surface-container-high rounded-t-xl h-[55%]"></div>
                            <div className="w-full bg-surface-container-high rounded-t-xl h-[45%]"></div>
                            <div className="w-full bg-surface-container-high rounded-t-xl h-[70%]"></div>
                            <div className="w-full bg-surface-container-high rounded-t-xl h-[60%]"></div>
                            <div className="w-full bg-surface-container-high rounded-t-xl h-[85%]"></div>
                            <div className="w-full kinetic-gradient rounded-t-xl h-[95%] shadow-lg shadow-primary/20"></div>
                            <div className="w-full bg-surface-container-high rounded-t-xl h-[65%]"></div>
                            <div className="w-full bg-surface-container-high rounded-t-xl h-[75%]"></div>
                            <div className="w-full bg-surface-container-high rounded-t-xl h-[50%]"></div>
                            <div className="w-full bg-surface-container-high rounded-t-xl h-[60%]"></div>
                            <div className="w-full bg-surface-container-high rounded-t-xl h-[80%]"></div>
                        </div>
                        <div className="flex justify-between mt-4 px-4 text-[10px] font-bold text-outline-variant uppercase tracking-widest">
                            <span>Jan</span><span>Fev</span><span>Mar</span><span>Abr</span><span>Mai</span><span>Jun</span><span>Jul</span><span>Ago</span><span>Set</span><span>Out</span><span>Nov</span><span>Dez</span>
                        </div>
                    </div>

                    {/* Activity Feed */}
                    <div className="md:col-span-4 bg-surface-container-lowest p-8 rounded-[1.5rem] shadow-sm">
                        <h4 className="text-xl font-bold text-on-surface mb-6">Atividades Recentes</h4>
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-tertiary-container flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-on-tertiary-container text-sm">person_add</span>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-on-surface">Nova Matrícula</p>
                                    <p className="text-xs text-outline-variant">Ricardo Silva em 'Engenharia de Prompt'</p>
                                    <p className="text-[10px] text-outline mt-1 uppercase font-bold">Há 2 minutos</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-on-primary-container text-sm">shopping_cart</span>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-on-surface">Venda Realizada</p>
                                    <p className="text-xs text-outline-variant">Pacote Business Plus - Unidade Centro</p>
                                    <p className="text-[10px] text-outline mt-1 uppercase font-bold">Há 15 minutos</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-on-secondary-container text-sm">domain</span>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-on-surface">Novo Polo Ativado</p>
                                    <p className="text-xs text-outline-variant">Unidade Curitiba - Santa Felicidade</p>
                                    <p className="text-[10px] text-outline mt-1 uppercase font-bold">Há 1 hora</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-outline text-sm">edit</span>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-on-surface">Curso Atualizado</p>
                                    <p className="text-xs text-outline-variant">Conteúdo de 'Marketing Digital' revisado</p>
                                    <p className="text-[10px] text-outline mt-1 uppercase font-bold">Há 3 horas</p>
                                </div>
                            </div>
                        </div>
                        <button className="w-full mt-8 py-3 text-sm font-bold text-primary hover:bg-primary/5 rounded-xl transition-colors">Ver Todo Histórico</button>
                    </div>

                    {/* Bottom Grid Items */}
                    <div className="md:col-span-6 bg-surface-container-lowest p-8 rounded-[1.5rem] relative overflow-hidden shadow-sm">
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="text-xl font-bold text-on-surface">Cursos Populares</h4>
                                <p className="text-sm text-outline-variant mb-6">Top performance por engajamento</p>
                            </div>
                            <div className="bg-tertiary-container text-on-tertiary-container px-3 py-1 rounded-full text-[10px] font-black uppercase">Alta Demanda</div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-lg bg-surface-container-high overflow-hidden">
                                        <img 
                                            alt="Course Thumbnail" 
                                            className="w-full h-full object-cover" 
                                            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=100&auto=format&fit=crop"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold">Desenvolvimento Fullstack</p>
                                        <p className="text-xs text-outline">8,420 alunos</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-tertiary">R$ 124k</p>
                                    <p className="text-[10px] text-outline uppercase">Mês Atual</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-lg bg-surface-container-high overflow-hidden">
                                        <img 
                                            alt="Course Thumbnail" 
                                            className="w-full h-full object-cover" 
                                            src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=100&auto=format&fit=crop"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold">Gestão Ágil (Scrum)</p>
                                        <p className="text-xs text-outline">5,190 alunos</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-tertiary">R$ 89k</p>
                                    <p className="text-[10px] text-outline uppercase">Mês Atual</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-6 kinetic-gradient p-8 rounded-[1.5rem] text-white flex flex-col justify-between shadow-sm">
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-xs font-black uppercase tracking-[0.2em] opacity-80">Meta Mensal</span>
                                <span className="material-symbols-outlined">rocket_launch</span>
                            </div>
                            <h4 className="text-3xl font-black">R$ 500.000</h4>
                            <p className="text-white/70 text-sm mt-1">Faltam apenas R$ 47.900 para atingir a meta global do mês!</p>
                        </div>
                        <div className="mt-8">
                            <div className="flex justify-between text-xs font-bold mb-2">
                                <span>Progresso Atual</span>
                                <span>90.4%</span>
                            </div>
                            <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                                <div className="h-full bg-white w-[90.4%] rounded-full shadow-[0_0_15px_rgba(255,255,255,0.5)]"></div>
                            </div>
                            <div className="mt-6 flex gap-4">
                                <button className="bg-white text-primary px-6 py-2 rounded-xl text-xs font-bold hover:bg-white/90 transition-colors">Impulsionar Vendas</button>
                                <button className="bg-white/10 border border-white/20 px-6 py-2 rounded-xl text-xs font-bold hover:bg-white/20 transition-colors">Relatório Detalhado</button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </AdminLayout>
    );
}
