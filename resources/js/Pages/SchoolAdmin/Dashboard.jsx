import SchoolAdminLayout from '@/Layouts/SchoolAdminLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <SchoolAdminLayout>
            <Head title="Painel da Escola" />
            
            <div className="p-8 max-w-7xl mx-auto space-y-8">
                {/* Welcome Header */}
                <section className="flex flex-col md:flex-row justify-between items-end gap-4">
                    <div>
                        <h2 className="text-4xl font-extrabold text-on-surface font-['Plus_Jakarta_Sans'] tracking-tight">Painel de Gestão Escolar</h2>
                        <p className="text-outline-variant font-medium mt-1">Bem-vindo, Gestor. Aqui estão os dados da sua unidade hoje.</p>
                    </div>
                    <div className="flex gap-3">
                        <div className="flex items-center bg-surface-container-high px-4 py-2 rounded-xl text-primary font-bold text-sm">
                            <span className="material-symbols-outlined mr-2 text-lg">school</span>
                            Unidade: Centro
                        </div>
                    </div>
                </section>

                {/* KPI Grid */}
                <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Alunos Card */}
                    <div className="bg-surface-container-lowest p-6 rounded-[1.5rem] relative overflow-hidden group shadow-sm">
                        <div className="absolute -right-4 -top-4 w-20 h-20 bg-primary/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                        <div className="relative z-10">
                            <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-3">
                                <span className="material-symbols-outlined">group</span>
                            </div>
                            <p className="text-xs font-semibold text-outline-variant uppercase tracking-wider">Alunos Ativos</p>
                            <h3 className="text-3xl font-black text-on-surface mt-1">1,248</h3>
                            <p className="text-[10px] text-tertiary font-bold mt-2 flex items-center">
                                +4% este mês <span className="material-symbols-outlined text-xs ml-1">trending_up</span>
                            </p>
                        </div>
                    </div>

                    {/* Turmas Card */}
                    <div className="bg-surface-container-lowest p-6 rounded-[1.5rem] relative overflow-hidden group shadow-sm">
                        <div className="absolute -right-4 -top-4 w-20 h-20 bg-secondary/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                        <div className="relative z-10">
                            <div className="w-10 h-10 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center mb-3">
                                <span className="material-symbols-outlined">school</span>
                            </div>
                            <p className="text-xs font-semibold text-outline-variant uppercase tracking-wider">Turmas Ativas</p>
                            <h3 className="text-3xl font-black text-on-surface mt-1">18</h3>
                            <p className="text-[10px] text-outline font-bold mt-2">Capacidade média: 85%</p>
                        </div>
                    </div>

                    {/* Rendimento Card */}
                    <div className="bg-surface-container-lowest p-6 rounded-[1.5rem] relative overflow-hidden group shadow-sm">
                        <div className="absolute -right-4 -top-4 w-20 h-20 bg-tertiary/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                        <div className="relative z-10">
                            <div className="w-10 h-10 bg-tertiary/10 text-tertiary rounded-xl flex items-center justify-center mb-3">
                                <span className="material-symbols-outlined">grade</span>
                            </div>
                            <p className="text-xs font-semibold text-outline-variant uppercase tracking-wider">Média de Rendimento</p>
                            <h3 className="text-3xl font-black text-on-surface mt-1">82.4%</h3>
                            <p className="text-[10px] text-tertiary font-bold mt-2 flex items-center">
                                +1.2% vs. bim. anterior <span className="material-symbols-outlined text-xs ml-1">trending_up</span>
                            </p>
                        </div>
                    </div>

                    {/* Professores Card */}
                    <div className="bg-surface-container-lowest p-6 rounded-[1.5rem] relative overflow-hidden group shadow-sm">
                        <div className="absolute -right-4 -top-4 w-20 h-20 bg-error/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                        <div className="relative z-10">
                            <div className="w-10 h-10 bg-error/10 text-error rounded-xl flex items-center justify-center mb-3">
                                <span className="material-symbols-outlined">badge</span>
                            </div>
                            <p className="text-xs font-semibold text-outline-variant uppercase tracking-wider">Professores</p>
                            <h3 className="text-3xl font-black text-on-surface mt-1">24</h3>
                            <p className="text-[10px] text-outline font-bold mt-2">Nenhum afastado</p>
                        </div>
                    </div>
                </section>

                {/* Bento Grid */}
                <section className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Classes Status */}
                    <div className="md:col-span-7 bg-surface-container-lowest p-8 rounded-[1.5rem] shadow-sm">
                        <h4 className="text-xl font-bold text-on-surface mb-6">Desempenho por Turma</h4>
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between text-sm font-bold text-on-surface mb-2">
                                    <span>Turma A - Engenharia de Prompt (Integral)</span>
                                    <span className="text-[#0050d4]">92% de presença</span>
                                </div>
                                <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                                    <div className="h-full kinetic-gradient w-[92%]"></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm font-bold text-on-surface mb-2">
                                    <span>Turma B - Desenvolvimento Fullstack (Noturno)</span>
                                    <span className="text-[#0050d4]">87% de presença</span>
                                </div>
                                <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                                    <div className="h-full kinetic-gradient w-[87%]"></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm font-bold text-on-surface mb-2">
                                    <span>Turma C - Gestão Ágil Scrum (EAD/Híbrido)</span>
                                    <span className="text-[#0050d4]">78% de presença</span>
                                </div>
                                <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                                    <div className="h-full kinetic-gradient w-[78%]"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Upcoming Events */}
                    <div className="md:col-span-5 bg-surface-container-lowest p-8 rounded-[1.5rem] shadow-sm">
                        <h4 className="text-xl font-bold text-on-surface mb-6">Próximos Eventos</h4>
                        <div className="space-y-4">
                            <div className="flex gap-4 p-3 hover:bg-surface-container-low rounded-xl transition-colors">
                                <div className="w-12 h-12 rounded-xl bg-primary-container text-on-primary-container font-black flex flex-col items-center justify-center shrink-0">
                                    <span className="text-sm leading-none">12</span>
                                    <span className="text-[10px] uppercase leading-none mt-1">Jun</span>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-on-surface">Reunião Pedagógica</p>
                                    <p className="text-xs text-outline-variant">Alinhamento de novos cursos com docentes.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 p-3 hover:bg-surface-container-low rounded-xl transition-colors">
                                <div className="w-12 h-12 rounded-xl bg-tertiary-container text-on-tertiary-container font-black flex flex-col items-center justify-center shrink-0">
                                    <span className="text-sm leading-none">18</span>
                                    <span className="text-[10px] uppercase leading-none mt-1">Jun</span>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-on-surface">Conselho de Classe</p>
                                    <p className="text-xs text-outline-variant">Fechamento do 2º bimestre.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </SchoolAdminLayout>
    );
}
