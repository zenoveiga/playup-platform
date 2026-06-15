import AdminLayout from '@/Layouts/AdminLayout';
import SchoolAdminLayout from '@/Layouts/SchoolAdminLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import { useState } from 'react';

export default function StudentCreate() {
    const { auth } = usePage().props;
    const user = auth.user;
    const isSchoolAdmin = user.role === 'school_admin';
    const Layout = isSchoolAdmin ? SchoolAdminLayout : AdminLayout;
    const indexRoute = isSchoolAdmin ? 'school-admin.students.index' : 'admin.students.index';
    const storeRoute = isSchoolAdmin ? 'school-admin.students.store' : 'admin.students.store';

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        status: 'active',
        birth_date: '',
        gender: '',
        cpf: '',
        rg: '',
        phone2: '',
        guardian_name: '',
        guardian_cpf: '',
        guardian_rg: '',
        cep: '',
        address: '',
        neighborhood: '',
        city: '',
        state: '',
        polo: '',
        courses: [],
        notes: '',
    });

    const [isCepLoading, setIsCepLoading] = useState(false);

    const handleCourseToggle = (courseName) => {
        if (data.courses.includes(courseName)) {
            setData('courses', data.courses.filter(c => c !== courseName));
        } else {
            setData('courses', [...data.courses, courseName]);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route(storeRoute));
    };

    const simulateCepSearch = () => {
        if (!data.cep) return;
        setIsCepLoading(true);
        setTimeout(() => {
            setIsCepLoading(false);
            // Pre-fill mock data for simulation
            setData(prev => ({
                ...prev,
                address: 'Avenida Paulista, 1000',
                neighborhood: 'Bela Vista',
                city: 'São Paulo',
                state: 'SP'
            }));
        }, 1000);
    };

    return (
        <Layout>
            <Head title="Matricular Novo Aluno | PlayUp Velocity" />

            <div className="max-w-6xl mx-auto p-8 animate-in fade-in duration-700">
                {/* Header Section */}
                <div className="flex flex-col gap-1 mb-8">
                    <div className="flex items-center gap-2 text-primary dark:text-[#00D1FF] font-bold text-sm mb-2">
                        <Link className="hover:underline" href={route(indexRoute)}>Alunos</Link>
                        <span className="material-symbols-outlined text-xs">chevron_right</span>
                        <span className="text-on-surface-variant">Nova Matrícula</span>
                    </div>
                    <h1 className="text-4xl font-headline font-extrabold text-[#003346] dark:text-[#eff8ff] tracking-tight">Matricular Novo Aluno</h1>
                    <p className="text-on-surface-variant dark:text-[#b5e3ff] font-medium">Complete o perfil detalhado para registro do novo acadêmico.</p>
                </div>

                {/* Registration Form */}
                <form onSubmit={submit} className="flex flex-col gap-8 pb-12">
                    {/* Section: Perfil e Foto */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-outline-variant/15 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            <div className="flex flex-col items-center gap-4">
                                <div className="relative w-32 h-32 group">
                                    <div className="w-full h-full rounded-2xl bg-surface dark:bg-slate-950 flex items-center justify-center overflow-hidden border-2 border-dashed border-outline-variant/30 group-hover:border-primary transition-colors cursor-pointer">
                                        <span className="material-symbols-outlined text-4xl text-on-surface-variant group-hover:text-primary">add_a_photo</span>
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 flex flex-col gap-1">
                                        <button className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform" title="Abrir Câmera" type="button">
                                            <span className="material-symbols-outlined text-sm">photo_camera</span>
                                        </button>
                                        <button className="w-8 h-8 rounded-lg bg-secondary text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform" title="Upload de Arquivo" type="button">
                                            <span className="material-symbols-outlined text-sm">upload_file</span>
                                        </button>
                                    </div>
                                </div>
                                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest text-center mt-2">Foto do Aluno</span>
                            </div>

                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Nome Completo *</label>
                                    <input
                                        className="w-full bg-surface dark:bg-slate-950 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary transition-all placeholder:text-on-surface-variant/40 text-on-surface outline-none"
                                        placeholder="Ex: João da Silva Santos"
                                        type="text"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.name} className="mt-1" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">E-mail *</label>
                                    <input
                                        className="w-full bg-surface dark:bg-slate-950 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary transition-all text-on-surface outline-none"
                                        placeholder="email@exemplo.com"
                                        type="email"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.email} className="mt-1" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Data de Nasc.</label>
                                        <input
                                            className="w-full bg-surface dark:bg-slate-950 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary transition-all text-on-surface outline-none"
                                            type="date"
                                            value={data.birth_date}
                                            onChange={e => setData('birth_date', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Sexo</label>
                                        <select
                                            className="w-full bg-surface dark:bg-slate-950 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary transition-all text-on-surface outline-none"
                                            value={data.gender}
                                            onChange={e => setData('gender', e.target.value)}
                                        >
                                            <option value="">Selecione</option>
                                            <option value="male">Masculino</option>
                                            <option value="female">Feminino</option>
                                            <option value="other">Outro</option>
                                            <option value="none">Não Informar</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>

                    {/* Section: Documentos e Contato */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-outline-variant/15 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center gap-3 mb-8 border-b border-outline-variant/10 dark:border-slate-850 pb-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                <span className="material-symbols-outlined">badge</span>
                            </div>
                            <div>
                                <h2 className="text-xl font-headline font-bold text-on-surface">Identificação do aluno</h2>
                                <p className="text-sm text-on-surface-variant">Informações pessoais e documentos</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">CPF</label>
                                <input
                                    className="w-full bg-surface dark:bg-slate-950 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary transition-all text-on-surface outline-none"
                                    placeholder="000.000.000-00"
                                    type="text"
                                    value={data.cpf}
                                    onChange={e => setData('cpf', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">RG</label>
                                <input
                                    className="w-full bg-surface dark:bg-slate-950 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary transition-all text-on-surface outline-none"
                                    placeholder="00.000.000-0"
                                    type="text"
                                    value={data.rg}
                                    onChange={e => setData('rg', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Telefone 1 (WhatsApp) *</label>
                                <input
                                    className="w-full bg-surface dark:bg-slate-950 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary transition-all text-on-surface outline-none"
                                    placeholder="(00) 00000-0000"
                                    type="tel"
                                    value={data.phone}
                                    onChange={e => setData('phone', e.target.value)}
                                    required
                                />
                                <InputError message={errors.phone} className="mt-1" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Telefone 2</label>
                                <input
                                    className="w-full bg-surface dark:bg-slate-950 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary transition-all text-on-surface outline-none"
                                    placeholder="(00) 00000-0000"
                                    type="tel"
                                    value={data.phone2}
                                    onChange={e => setData('phone2', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section: Responsável Legal */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-outline-variant/15 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center gap-3 mb-8 border-b border-outline-variant/10 dark:border-slate-850 pb-4">
                            <div className="w-12 h-12 rounded-xl bg-secondary-container/20 text-[#00647b] dark:text-[#80deff] flex items-center justify-center">
                                <span className="material-symbols-outlined">family_restroom</span>
                            </div>
                            <div>
                                <h2 className="text-xl font-headline font-bold text-on-surface">Responsável Legal</h2>
                                <p className="text-sm text-on-surface-variant">Obrigatório para alunos menores de idade</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
                            <div className="md:col-span-3">
                                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Nome do Responsável</label>
                                <input
                                    className="w-full bg-surface dark:bg-slate-950 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary transition-all text-on-surface outline-none"
                                    placeholder="Nome completo do pai, mãe ou tutor"
                                    type="text"
                                    value={data.guardian_name}
                                    onChange={e => setData('guardian_name', e.target.value)}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">CPF Responsável</label>
                                <input
                                    className="w-full bg-surface dark:bg-slate-950 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary transition-all text-on-surface outline-none"
                                    placeholder="000.000.000-00"
                                    type="text"
                                    value={data.guardian_cpf}
                                    onChange={e => setData('guardian_cpf', e.target.value)}
                                />
                            </div>
                            <div className="md:col-span-1">
                                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">RG Responsável</label>
                                <input
                                    className="w-full bg-surface dark:bg-slate-950 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary transition-all text-on-surface outline-none"
                                    placeholder="00.000.000-0"
                                    type="text"
                                    value={data.guardian_rg}
                                    onChange={e => setData('guardian_rg', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section: Endereço */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-outline-variant/15 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center gap-3 mb-8 border-b border-outline-variant/10 dark:border-slate-850 pb-4">
                            <div className="w-12 h-12 rounded-xl bg-tertiary/10 text-tertiary flex items-center justify-center">
                                <span className="material-symbols-outlined">map</span>
                            </div>
                            <div>
                                <h2 className="text-xl font-headline font-bold text-on-surface">Endereço</h2>
                                <p className="text-sm text-on-surface-variant">Localização residencial</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">CEP</label>
                                <div className="relative">
                                    <input
                                        className="w-full bg-surface dark:bg-slate-950 border-none rounded-xl pl-4 pr-12 py-3 text-sm focus:ring-2 focus:ring-primary transition-all placeholder:text-on-surface-variant/40 text-on-surface outline-none"
                                        placeholder="00000-000"
                                        type="text"
                                        value={data.cep}
                                        onChange={e => setData('cep', e.target.value)}
                                    />
                                    <button
                                        onClick={simulateCepSearch}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-primary text-white rounded-lg hover:scale-105 active:scale-95 transition-transform"
                                        type="button"
                                        title="Buscar CEP"
                                    >
                                        <span className={`material-symbols-outlined text-sm ${isCepLoading ? 'animate-spin' : ''}`}>
                                            {isCepLoading ? 'sync' : 'search'}
                                        </span>
                                    </button>
                                </div>
                            </div>
                            <div className="md:col-span-3">
                                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Rua / Logradouro</label>
                                <input
                                    className="w-full bg-surface dark:bg-slate-950 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary transition-all text-on-surface outline-none"
                                    placeholder="Ex: Av. Paulista, 1000"
                                    type="text"
                                    value={data.address}
                                    onChange={e => setData('address', e.target.value)}
                                />
                            </div>
                            <div className="md:col-span-1">
                                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Bairro</label>
                                <input
                                    className="w-full bg-surface dark:bg-slate-950 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary transition-all text-on-surface outline-none"
                                    placeholder="Centro"
                                    type="text"
                                    value={data.neighborhood}
                                    onChange={e => setData('neighborhood', e.target.value)}
                                />
                            </div>
                            <div className="md:col-span-4">
                                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Cidade</label>
                                <input
                                    className="w-full bg-surface dark:bg-slate-950 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary transition-all text-on-surface outline-none"
                                    placeholder="Sua Cidade"
                                    type="text"
                                    value={data.city}
                                    onChange={e => setData('city', e.target.value)}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Estado</label>
                                <select
                                    className="w-full bg-surface dark:bg-slate-950 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary transition-all text-on-surface outline-none"
                                    value={data.state}
                                    onChange={e => setData('state', e.target.value)}
                                >
                                    <option value="">Selecione a UF</option>
                                    <option value="SP">SP</option>
                                    <option value="RJ">RJ</option>
                                    <option value="MG">MG</option>
                                    <option value="PR">PR</option>
                                    <option value="SC">SC</option>
                                    <option value="RS">RS</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Section: Dados Acadêmicos */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-outline-variant/15 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center gap-3 mb-8 border-b border-outline-variant/10 dark:border-slate-850 pb-4">
                            <div className="w-12 h-12 rounded-xl bg-secondary-container/20 text-[#00647b] dark:text-[#80deff] flex items-center justify-center">
                                <span className="material-symbols-outlined">school</span>
                            </div>
                            <div>
                                <h2 className="text-xl font-headline font-bold text-on-surface">Informações Acadêmicas</h2>
                                <p className="text-sm text-on-surface-variant">Seleção de polos, cursos e status atual</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Polo de Atendimento</label>
                                <select
                                    className="w-full bg-surface dark:bg-slate-950 border-none rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-primary transition-all text-on-surface outline-none"
                                    value={data.polo}
                                    onChange={e => setData('polo', e.target.value)}
                                >
                                    <option value="">Selecione o Polo</option>
                                    <option value="central">Polo Central - São Paulo</option>
                                    <option value="norte">Polo Norte - Belém</option>
                                    <option value="sul">Polo Sul - Curitiba</option>
                                    <option value="digital">Polo Digital - EAD Global</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Status do Aluno *</label>
                                <select
                                    className="w-full bg-surface dark:bg-slate-950 border-none rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-primary transition-all text-on-surface outline-none"
                                    value={data.status}
                                    onChange={e => setData('status', e.target.value)}
                                >
                                    <option value="active">Ativo</option>
                                    <option value="inactive">Inativo</option>
                                </select>
                                <InputError message={errors.status} className="mt-1" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-4">Cursos Desejados (Múltipla Seleção)</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {['Análise de Sistemas', 'Ciência da Computação', 'Engenharia de Software', 'Segurança da Informação', 'Gestão de TI'].map((course, idx) => {
                                        const isSelected = data.courses.includes(course);
                                        return (
                                            <div
                                                key={idx}
                                                onClick={() => handleCourseToggle(course)}
                                                className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer select-none transition-all duration-200 ${isSelected
                                                    ? 'bg-primary-container/20 border-primary text-primary dark:text-[#00D1FF]'
                                                    : 'bg-surface dark:bg-slate-950 border-transparent hover:border-outline-variant/30 text-on-surface'
                                                    }`}
                                            >
                                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-primary border-primary text-white' : 'border-outline-variant'
                                                    }`}>
                                                    {isSelected && <span className="material-symbols-outlined text-xs font-bold">check</span>}
                                                </div>
                                                <span className="text-sm font-medium">{course}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section: Observações */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-outline-variant/15 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-lg bg-surface dark:bg-slate-950 flex items-center justify-center text-on-surface-variant">
                                <span className="material-symbols-outlined">notes</span>
                            </div>
                            <h2 className="text-lg font-headline font-bold text-on-surface">Observações</h2>
                        </div>
                        <div className="bg-surface dark:bg-slate-950 rounded-xl overflow-hidden border border-outline-variant/10 dark:border-slate-800">
                            {/* Editor Toolbar */}
                            <div className="flex items-center gap-1 p-2 border-b border-outline-variant/10 dark:border-slate-850 bg-slate-50 dark:bg-slate-900">
                                <button className="p-1.5 hover:bg-white dark:hover:bg-slate-800 rounded transition-colors text-on-surface-variant" type="button"><span className="material-symbols-outlined text-lg">format_bold</span></button>
                                <button className="p-1.5 hover:bg-white dark:hover:bg-slate-800 rounded transition-colors text-on-surface-variant" type="button"><span className="material-symbols-outlined text-lg">format_italic</span></button>
                                <button className="p-1.5 hover:bg-white dark:hover:bg-slate-800 rounded transition-colors text-on-surface-variant" type="button"><span className="material-symbols-outlined text-lg">format_list_bulleted</span></button>
                                <div className="h-4 w-px bg-outline-variant/30 mx-1"></div>
                                <button className="p-1.5 hover:bg-white dark:hover:bg-slate-800 rounded transition-colors text-on-surface-variant" type="button"><span className="material-symbols-outlined text-lg">link</span></button>
                            </div>
                            <textarea
                                className="w-full bg-transparent border-none p-4 text-sm focus:ring-0 min-h-[160px] resize-y text-on-surface outline-none"
                                placeholder="Adicione aqui notas adicionais, históricos ou detalhes relevantes sobre a matrícula..."
                                value={data.notes}
                                onChange={e => setData('notes', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex flex-col md:flex-row items-center justify-end gap-4 mt-4">
                        <Link
                            href={route(indexRoute)}
                            className="w-full md:w-auto px-8 py-4 text-on-surface-variant text-center font-bold hover:bg-surface-container dark:hover:bg-slate-800 rounded-xl transition-all font-headline"
                        >
                            Cancelar
                        </Link>
                        <button
                            className="w-full md:w-auto px-12 py-4 bg-gradient-to-br from-primary to-primary-dim text-white font-headline font-extrabold text-lg rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                            type="submit"
                            disabled={processing}
                        >
                            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>how_to_reg</span>
                            {processing ? 'Matriculando...' : 'Matricular Aluno'}
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    );
}
