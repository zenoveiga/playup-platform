import AdminLayout from '@/Layouts/AdminLayout';
import SchoolAdminLayout from '@/Layouts/SchoolAdminLayout';
import { Head, usePage, Link, useForm } from '@inertiajs/react';

export default function PoloCreate() {
    const { auth } = usePage().props;
    const user = auth.user;
    const isSchoolAdmin = user.role === 'school_admin';
    const Layout = isSchoolAdmin ? SchoolAdminLayout : AdminLayout;
    
    const indexRoute = isSchoolAdmin ? 'school-admin.polos.index' : 'admin.polos.index';
    const storeRoute = isSchoolAdmin ? 'school-admin.polos.store' : 'admin.polos.store';

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        responsible: '',
        phone: '',
        email: '',
        address: '',
        status: 'active',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route(storeRoute));
    };

    return (
        <Layout>
            <Head title="Cadastrar Novo Polo | PlayUp Velocity" />

            <div className="max-w-6xl mx-auto p-8 space-y-8 animate-in fade-in duration-700 pb-36 relative">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-[#507c94] dark:text-[#87b3cd] font-bold text-sm mb-2 uppercase tracking-wider">
                            <Link className="hover:underline" href={route(indexRoute)}>Polos</Link>
                            <span className="material-symbols-outlined text-xs">chevron_right</span>
                            <span className="text-primary dark:text-[#00D1FF] font-bold">Novo Polo</span>
                        </div>
                        <h2 className="text-4xl font-display font-extrabold text-[#003346] dark:text-white tracking-tight leading-none mb-2">
                            Cadastrar Novo Polo
                        </h2>
                        <p className="text-[#507c94] dark:text-[#87b3cd] font-medium">
                            Cadastre e gerencie as unidades de atendimento da sua Escola
                        </p>
                    </div>
                    
                    <div className="flex gap-3">
                        <div className="bg-[#cfecff] dark:bg-slate-800 px-4 py-2.5 rounded-xl flex items-center gap-2 border border-outline-variant/10">
                            <span className="material-symbols-outlined text-primary dark:text-[#00D1FF]" style={{ fontVariationSettings: "'FILL' 1" }}>hub</span>
                            <span className="text-sm font-bold text-on-surface dark:text-white">
                                <span className="text-primary dark:text-[#00D1FF]">12</span> Polos Ativos
                            </span>
                        </div>
                    </div>
                </div>

                {/* Main grid section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Form Panel */}
                    <section className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-outline-variant/10 dark:border-slate-800">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary dark:text-[#00D1FF] flex items-center justify-center">
                                <span className="material-symbols-outlined text-xl">add_location_alt</span>
                            </div>
                            <h3 className="text-xl font-display font-bold text-[#003346] dark:text-white">Cadastrar Novo Polo</h3>
                        </div>

                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Nome do Polo */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-[#507c94] dark:text-[#87b3cd] ml-1">Nome do Polo *</label>
                                    <input 
                                        type="text" 
                                        required
                                        placeholder="Ex: Polo São Paulo Centro"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full bg-surface dark:bg-slate-950 border-none rounded-xl px-4 py-3 placeholder:opacity-50 text-on-surface dark:text-white focus:ring-2 focus:ring-primary outline-none"
                                    />
                                    {errors.name && <p className="text-xs text-error mt-1">{errors.name}</p>}
                                </div>

                                {/* Responsavel */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-[#507c94] dark:text-[#87b3cd] ml-1">Responsável *</label>
                                    <input 
                                        type="text" 
                                        required
                                        placeholder="Nome completo do gestor"
                                        value={data.responsible}
                                        onChange={(e) => setData('responsible', e.target.value)}
                                        className="w-full bg-surface dark:bg-slate-950 border-none rounded-xl px-4 py-3 placeholder:opacity-50 text-on-surface dark:text-white focus:ring-2 focus:ring-primary outline-none"
                                    />
                                    {errors.responsible && <p className="text-xs text-error mt-1">{errors.responsible}</p>}
                                </div>

                                {/* Telefone */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-[#507c94] dark:text-[#87b3cd] ml-1">Telefone</label>
                                    <input 
                                        type="tel" 
                                        placeholder="(11) 99999-9999"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        className="w-full bg-surface dark:bg-slate-950 border-none rounded-xl px-4 py-3 placeholder:opacity-50 text-on-surface dark:text-white focus:ring-2 focus:ring-primary outline-none"
                                    />
                                    {errors.phone && <p className="text-xs text-error mt-1">{errors.phone}</p>}
                                </div>

                                {/* E-mail */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-[#507c94] dark:text-[#87b3cd] ml-1">E-mail</label>
                                    <input 
                                        type="email" 
                                        placeholder="contato@polo.com"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="w-full bg-surface dark:bg-slate-950 border-none rounded-xl px-4 py-3 placeholder:opacity-50 text-on-surface dark:text-white focus:ring-2 focus:ring-primary outline-none"
                                    />
                                    {errors.email && <p className="text-xs text-error mt-1">{errors.email}</p>}
                                </div>

                                {/* Endereco */}
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-sm font-bold text-[#507c94] dark:text-[#87b3cd] ml-1">Endereço Completo</label>
                                    <input 
                                        type="text" 
                                        placeholder="Rua, Número, Bairro, Cidade - UF"
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                        className="w-full bg-surface dark:bg-slate-950 border-none rounded-xl px-4 py-3 placeholder:opacity-50 text-on-surface dark:text-white focus:ring-2 focus:ring-primary outline-none"
                                    />
                                    {errors.address && <p className="text-xs text-error mt-1">{errors.address}</p>}
                                </div>

                                {/* Status */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-[#507c94] dark:text-[#87b3cd] ml-1">Status da Unidade</label>
                                    <select 
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        className="w-full bg-surface dark:bg-slate-950 border-none rounded-xl px-4 py-3 text-on-surface dark:text-white focus:ring-2 focus:ring-primary outline-none"
                                    >
                                        <option value="active">Ativo</option>
                                        <option value="inactive">Inativo</option>
                                    </select>
                                </div>
                            </div>

                            {/* Fixed Footer Actions */}
                            <footer className="fixed bottom-0 left-72 right-0 bg-[#eff8ff]/85 dark:bg-slate-950/85 backdrop-blur-xl h-24 px-12 flex items-center justify-between shadow-[0_-8px_20px_-15px_rgba(0,0,0,0.1)] z-40 border-t border-outline-variant/10 dark:border-slate-800">
                                <div className="flex items-center gap-2 text-[#507c94] dark:text-[#87b3cd]/80">
                                    <span className="material-symbols-outlined text-sm">schedule</span>
                                    <p className="text-xs font-medium font-label">As alterações não salvas serão perdidas ao sair.</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Link
                                        href={route(indexRoute)}
                                        className="w-full md:w-auto px-8 py-3.5 text-on-surface-variant text-center font-bold hover:bg-surface-container dark:hover:bg-slate-800 rounded-xl transition-all text-sm select-none"
                                    >
                                        Cancelar
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full md:w-auto px-10 py-3.5 bg-gradient-to-br from-primary to-primary-dim text-white font-bold text-sm rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                                    >
                                        <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                        <span>{processing ? 'Cadastrando...' : 'Cadastrar Polo'}</span>
                                    </button>
                                </div>
                            </footer>
                        </form>
                    </section>

                    {/* Right Insights Panel */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-gradient-to-br from-secondary to-[#00586d] rounded-3xl p-8 text-white shadow-lg relative overflow-hidden h-full flex flex-col justify-between border border-[#80deff]/10">
                            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
                            
                            <div>
                                <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-bold tracking-wider mb-6">INSIGHTS</span>
                                <h4 className="text-3xl font-display font-extrabold leading-tight mb-4">Expansão de Rede</h4>
                                <p className="text-white/80 text-sm leading-relaxed font-medium">
                                    Você já alcançou <span className="font-extrabold text-[#80deff]">85%</span> da meta de abertura de polos para este trimestre.
                                </p>
                            </div>

                            <div className="mt-12">
                                <div className="flex justify-between text-xs font-bold mb-2">
                                    <span>PROGRESSO ANUAL</span>
                                    <span>24 / 30 POLOS</span>
                                </div>
                                <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-[#6bfe9c] rounded-full shadow-[0_0_15px_rgba(107,254,156,0.5)] transition-all duration-1000"
                                        style={{ width: '80%' }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
