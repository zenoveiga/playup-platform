import AdminLayout from '@/Layouts/AdminLayout';
import SchoolAdminLayout from '@/Layouts/SchoolAdminLayout';
import { Head, usePage, Link, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function StudentInterestedCreate() {
    const { auth } = usePage().props;
    const user = auth.user;
    const isSchoolAdmin = user.role === 'school_admin';
    const Layout = isSchoolAdmin ? SchoolAdminLayout : AdminLayout;

    const indexRoute = isSchoolAdmin ? 'school-admin.sales.index' : 'admin.sales.index';
    const storeRoute = isSchoolAdmin ? 'school-admin.students.interested.store' : 'admin.students.interested.store';

    // State for calculated age
    const [age, setAge] = useState('--');
    const [isCepLoading, setIsCepLoading] = useState(false);

    // Form inputs state managed via Inertia useForm
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        gender: '',
        birthdate: '',
        cpf: '',
        rg: '',
        status: 'interested',
        polo: 'São Paulo - Matriz',
        course: 'Desenvolvimento Full Stack',
        email: '',
        phone: '',
        phone2: '',
        cep: '',
        address: '',
        neighborhood: '',
        city: '',
        state: '',
        guardian_name: '',
        guardian_cpf: '',
        guardian_rg: '',
    });

    // Calculate age reactively
    useEffect(() => {
        if (data.birthdate) {
            const birthDate = new Date(data.birthdate);
            const today = new Date();
            let calculatedAge = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                calculatedAge--;
            }
            setAge(calculatedAge > 0 ? calculatedAge : 0);
        } else {
            setAge('--');
        }
    }, [data.birthdate]);

    // Simulate CEP Search
    const handleCepSearch = () => {
        if (!data.cep) return;
        setIsCepLoading(true);
        setTimeout(() => {
            setIsCepLoading(false);
            setData(prev => ({
                ...prev,
                address: 'Avenida Paulista, 1000',
                neighborhood: 'Bela Vista',
                city: 'São Paulo',
                state: 'São Paulo (SP)'
            }));
        }, 1000);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route(storeRoute));
    };

    return (
        <Layout>
            <Head title="Novo Interessado | PlayUp Velocity" />

            <div className="max-w-6xl mx-auto p-8 space-y-8 animate-in fade-in duration-700 pb-36 relative">
                
                {/* Header breadcrumb & info */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-[#507c94] dark:text-[#87b3cd] font-bold text-sm mb-2 uppercase tracking-wider font-label">
                            <Link className="hover:underline" href={route(indexRoute)}>Vendas</Link>
                            <span className="material-symbols-outlined text-xs">chevron_right</span>
                            <span className="text-primary dark:text-[#00D1FF] font-bold">Novo Interessado</span>
                        </div>
                        <h2 className="text-4xl font-display font-extrabold text-[#003346] dark:text-white tracking-tight leading-none mb-2">
                            Novo Interessado
                        </h2>
                        <p className="text-[#507c94] dark:text-[#87b3cd] font-medium">
                            Cadastre um novo perfil na academia cinética.
                        </p>
                    </div>
                </div>

                {/* Form Canvas */}
                <form onSubmit={submit} className="space-y-6">
                    <div className="grid grid-cols-12 gap-6">
                        
                        {/* Section 1: Dados Pessoais (col-span-8) */}
                        <section className="col-span-12 lg:col-span-8 bg-white dark:bg-slate-900 rounded-[1.5rem] p-8 border border-outline-variant/15 dark:border-slate-800 shadow-sm flex flex-col gap-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-lg bg-primary-container/20 flex items-center justify-center text-primary dark:text-[#00D1FF]">
                                    <span className="material-symbols-outlined">person</span>
                                </div>
                                <h3 className="font-headline text-lg font-bold text-[#003346] dark:text-white">Dados Pessoais</h3>
                            </div>

                            <div className="grid grid-cols-12 gap-6">
                                <div className="col-span-12 md:col-span-8 space-y-1.5">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#87b3cd]">Nome Completo *</label>
                                    <input 
                                        type="text"
                                        required
                                        placeholder="Ex: Lucas Ferreira Silva"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className="w-full bg-surface dark:bg-slate-950 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary text-on-surface dark:text-white outline-none"
                                    />
                                    {errors.name && <p className="text-xs text-error mt-1">{errors.name}</p>}
                                </div>

                                <div className="col-span-12 md:col-span-4 space-y-1.5">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#87b3cd]">Sexo</label>
                                    <select 
                                        value={data.gender}
                                        onChange={e => setData('gender', e.target.value)}
                                        className="w-full bg-surface dark:bg-slate-950 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary text-on-surface dark:text-white outline-none font-bold"
                                    >
                                        <option value="">Selecionar...</option>
                                        <option value="Masculino">Masculino</option>
                                        <option value="Feminino">Feminino</option>
                                        <option value="Não Informado">Não Informado</option>
                                    </select>
                                </div>

                                <div className="col-span-12 md:col-span-4 space-y-1.5">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#87b3cd]">Data de Nascimento</label>
                                    <input 
                                        type="date"
                                        value={data.birthdate}
                                        onChange={e => setData('birthdate', e.target.value)}
                                        className="w-full bg-surface dark:bg-slate-950 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary text-on-surface dark:text-white outline-none"
                                    />
                                </div>

                                <div className="col-span-12 md:col-span-2 space-y-1.5">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#87b3cd] text-center">Idade</label>
                                    <div className="w-full py-3.5 bg-surface-container-low dark:bg-slate-800 text-primary dark:text-[#00D1FF] font-black rounded-xl text-center text-sm">
                                        {age}
                                    </div>
                                </div>

                                <div className="col-span-12 md:col-span-3 space-y-1.5">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#87b3cd]">CPF</label>
                                    <input 
                                        type="text"
                                        placeholder="000.000.000-00"
                                        value={data.cpf}
                                        onChange={e => setData('cpf', e.target.value)}
                                        className="w-full bg-surface dark:bg-slate-950 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary text-on-surface dark:text-white outline-none"
                                    />
                                </div>

                                <div className="col-span-12 md:col-span-3 space-y-1.5">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#87b3cd]">RG</label>
                                    <input 
                                        type="text"
                                        placeholder="00.000.000-0"
                                        value={data.rg}
                                        onChange={e => setData('rg', e.target.value)}
                                        className="w-full bg-surface dark:bg-slate-950 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary text-on-surface dark:text-white outline-none"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Section 2: Informações de Interesse (col-span-4) */}
                        <section className="col-span-12 lg:col-span-4 bg-white dark:bg-slate-900 rounded-[1.5rem] p-8 border border-outline-variant/15 dark:border-slate-800 shadow-sm flex flex-col gap-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-lg bg-secondary-container/20 flex items-center justify-center text-secondary dark:text-cyan-400">
                                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>interests</span>
                                </div>
                                <h3 className="font-headline text-lg font-bold text-[#003346] dark:text-white">Interesse</h3>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#87b3cd]">Status</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {[
                                            { value: 'active', label: 'Ativo' },
                                            { value: 'interested', label: 'Interessado' },
                                            { value: 'inactive', label: 'Inativo' },
                                            { value: 'blocked', label: 'Bloqueado' }
                                        ].map((st) => {
                                            const isSelected = data.status === st.value;
                                            return (
                                                <label 
                                                    key={st.value}
                                                    className={`flex items-center gap-2 p-3 rounded-xl border transition-colors cursor-pointer group ${
                                                        isSelected 
                                                            ? 'bg-primary-container/20 border-primary text-primary dark:text-[#00D1FF] font-bold' 
                                                            : 'bg-surface dark:bg-slate-950 border-transparent hover:border-outline-variant/30 text-on-surface dark:text-white'
                                                    }`}
                                                >
                                                    <input 
                                                        type="radio" 
                                                        name="status"
                                                        value={st.value}
                                                        checked={isSelected}
                                                        onChange={e => setData('status', e.target.value)}
                                                        className="text-primary focus:ring-primary h-4 w-4"
                                                    />
                                                    <span className="text-xs font-bold">{st.label}</span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#87b3cd]">Selecione o Polo</label>
                                    <select
                                        value={data.polo}
                                        onChange={e => setData('polo', e.target.value)}
                                        className="w-full bg-surface dark:bg-slate-950 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary text-on-surface dark:text-white outline-none font-bold"
                                    >
                                        <option value="São Paulo - Matriz">São Paulo - Matriz</option>
                                        <option value="Curitiba - Tech Hub">Curitiba - Tech Hub</option>
                                        <option value="Rio de Janeiro - Labs">Rio de Janeiro - Labs</option>
                                        <option value="Belo Horizonte - Station">Belo Horizonte - Station</option>
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#87b3cd]">Curso</label>
                                    <select
                                        value={data.course}
                                        onChange={e => setData('course', e.target.value)}
                                        className="w-full bg-surface dark:bg-slate-950 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary text-on-surface dark:text-white outline-none font-bold"
                                    >
                                        <option value="Desenvolvimento Full Stack">Desenvolvimento Full Stack</option>
                                        <option value="UX/UI Design Editorial">UX/UI Design Editorial</option>
                                        <option value="Data Science e IA">Data Science e IA</option>
                                        <option value="Gestão Ágil de Projetos">Gestão Ágil de Projetos</option>
                                    </select>
                                </div>
                            </div>
                        </section>

                        {/* Section 3: Contato e Endereço (col-span-12) */}
                        <section className="col-span-12 bg-white dark:bg-slate-900 rounded-[1.5rem] p-8 border border-outline-variant/15 dark:border-slate-800 shadow-sm flex flex-col gap-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-lg bg-primary-container/20 flex items-center justify-center text-primary dark:text-[#00D1FF]">
                                    <span className="material-symbols-outlined">contact_mail</span>
                                </div>
                                <h3 className="font-headline text-lg font-bold text-[#003346] dark:text-white">Contato e Endereço</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="md:col-span-2 space-y-1.5">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#87b3cd]">E-mail *</label>
                                    <input 
                                        type="email"
                                        required
                                        placeholder="contato@exemplo.com"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        className="w-full bg-surface dark:bg-slate-950 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary text-on-surface dark:text-white outline-none"
                                    />
                                    {errors.email && <p className="text-xs text-error mt-1">{errors.email}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#87b3cd]">Telefone 1 (Principal)</label>
                                    <input 
                                        type="tel"
                                        placeholder="(00) 00000-0000"
                                        value={data.phone}
                                        onChange={e => setData('phone', e.target.value)}
                                        className="w-full bg-surface dark:bg-slate-950 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary text-on-surface dark:text-white outline-none"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#87b3cd]">Telefone 2</label>
                                    <input 
                                        type="tel"
                                        placeholder="(00) 00000-0000"
                                        value={data.phone2}
                                        onChange={e => setData('phone2', e.target.value)}
                                        className="w-full bg-surface dark:bg-slate-950 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary text-on-surface dark:text-white outline-none"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#87b3cd]">CEP</label>
                                    <div className="relative flex items-center">
                                        <input 
                                            type="text"
                                            placeholder="00000-000"
                                            value={data.cep}
                                            onChange={e => setData('cep', e.target.value)}
                                            className="w-full bg-surface dark:bg-slate-950 border-none rounded-xl pl-4 pr-12 py-3 text-sm focus:ring-2 focus:ring-primary text-on-surface dark:text-white outline-none"
                                        />
                                        <button 
                                            type="button"
                                            onClick={handleCepSearch}
                                            className="absolute right-2 p-1.5 bg-primary text-white rounded-lg hover:scale-105 active:scale-95 transition-transform"
                                        >
                                            <span className={`material-symbols-outlined text-sm ${isCepLoading ? 'animate-spin' : ''}`}>
                                                {isCepLoading ? 'sync' : 'search'}
                                            </span>
                                        </button>
                                    </div>
                                </div>

                                <div className="md:col-span-2 space-y-1.5">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#87b3cd]">Endereço</label>
                                    <input 
                                        type="text"
                                        placeholder="Rua, Número, Complemento"
                                        value={data.address}
                                        onChange={e => setData('address', e.target.value)}
                                        className="w-full bg-surface dark:bg-slate-950 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary text-on-surface dark:text-white outline-none"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#87b3cd]">Bairro</label>
                                    <input 
                                        type="text"
                                        placeholder="Nome do Bairro"
                                        value={data.neighborhood}
                                        onChange={e => setData('neighborhood', e.target.value)}
                                        className="w-full bg-surface dark:bg-slate-950 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary text-on-surface dark:text-white outline-none"
                                    />
                                </div>

                                <div className="md:col-span-2 space-y-1.5">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#87b3cd]">Cidade</label>
                                    <input 
                                        type="text"
                                        placeholder="Cidade"
                                        value={data.city}
                                        onChange={e => setData('city', e.target.value)}
                                        className="w-full bg-surface dark:bg-slate-950 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary text-on-surface dark:text-white outline-none"
                                    />
                                </div>

                                <div className="md:col-span-2 space-y-1.5">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#87b3cd]">Estado</label>
                                    <select
                                        value={data.state}
                                        onChange={e => setData('state', e.target.value)}
                                        className="w-full bg-surface dark:bg-slate-950 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary text-on-surface dark:text-white outline-none font-bold"
                                    >
                                        <option value="">UF</option>
                                        <option value="São Paulo (SP)">São Paulo (SP)</option>
                                        <option value="Rio de Janeiro (RJ)">Rio de Janeiro (RJ)</option>
                                        <option value="Minas Gerais (MG)">Minas Gerais (MG)</option>
                                        <option value="Paraná (PR)">Paraná (PR)</option>
                                    </select>
                                </div>
                            </div>
                        </section>

                        {/* Section 4: Responsável Legal (col-span-12) */}
                        <section className="col-span-12 bg-white dark:bg-slate-900 rounded-[1.5rem] p-8 border border-outline-variant/15 dark:border-slate-800 shadow-sm flex flex-col gap-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-lg bg-tertiary-container/20 flex items-center justify-center text-tertiary dark:text-emerald-400">
                                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>family_restroom</span>
                                </div>
                                <h3 className="font-headline text-lg font-bold text-[#003346] dark:text-white">Responsável Legal</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#87b3cd]">Nome do Responsável</label>
                                    <input 
                                        type="text"
                                        placeholder="Nome completo do responsável"
                                        value={data.guardian_name}
                                        onChange={e => setData('guardian_name', e.target.value)}
                                        className="w-full bg-surface dark:bg-slate-950 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary text-on-surface dark:text-white outline-none"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#87b3cd]">CPF do Responsável</label>
                                    <input 
                                        type="text"
                                        placeholder="000.000.000-00"
                                        value={data.guardian_cpf}
                                        onChange={e => setData('guardian_cpf', e.target.value)}
                                        className="w-full bg-surface dark:bg-slate-950 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary text-on-surface dark:text-white outline-none"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#87b3cd]">RG do Responsável</label>
                                    <input 
                                        type="text"
                                        placeholder="00.000.000-0"
                                        value={data.guardian_rg}
                                        onChange={e => setData('guardian_rg', e.target.value)}
                                        className="w-full bg-surface dark:bg-slate-950 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary text-on-surface dark:text-white outline-none"
                                    />
                                </div>
                            </div>
                        </section>

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
                                <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>person_add</span>
                                <span>{processing ? 'Salvando...' : 'Salvar Interessado'}</span>
                            </button>
                        </div>
                    </footer>

                </form>

                {/* Decorative background circle */}
                <div className="fixed -bottom-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
            </div>
        </Layout>
    );
}
