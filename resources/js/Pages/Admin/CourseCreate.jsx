import AdminLayout from '@/Layouts/AdminLayout';
import SchoolAdminLayout from '@/Layouts/SchoolAdminLayout';
import { Head, usePage, Link, useForm } from '@inertiajs/react';

export default function CourseCreate() {
    const { auth } = usePage().props;
    const user = auth.user;
    const isSchoolAdmin = user.role === 'school_admin';
    const Layout = isSchoolAdmin ? SchoolAdminLayout : AdminLayout;

    const indexRoute = isSchoolAdmin ? 'school-admin.courses.index' : 'admin.courses.index';
    const storeRoute = isSchoolAdmin ? 'school-admin.courses.store' : 'admin.courses.store';

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        category: '',
        hours: '',
        level: 'iniciante',
        description: '',
        price: '',
        installments: 'À vista',
        discount_active: false,
        instructor: '',
        modules: '',
        certificate_auto: true,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route(storeRoute));
    };

    return (
        <Layout>
            <Head title="Cadastrar Novo Curso | PlayUp Velocity" />

            <div className="max-w-6xl mx-auto p-8 space-y-8 animate-in fade-in duration-700 pb-36">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-[#507c94] dark:text-[#87b3cd] font-bold text-sm mb-2 uppercase tracking-wider font-label">
                            <Link className="hover:underline" href={route(indexRoute)}>Cursos e Pacotes</Link>
                            <span className="material-symbols-outlined text-xs">chevron_right</span>
                            <span className="text-primary dark:text-[#00D1FF] font-bold">Novo Curso</span>
                        </div>
                        <h2 className="text-4xl font-display font-extrabold text-[#003346] dark:text-white tracking-tight leading-none mb-2">
                            Cadastrar Novo Curso
                        </h2>
                        <p className="text-[#507c94] dark:text-[#87b3cd] font-medium">
                            Crie um novo curso acadêmico ou configure pacotes promocionais
                        </p>
                    </div>
                </div>

                {/* Form Wrapper */}
                <form onSubmit={submit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        
                        {/* Informações Básicas (col-span-8) */}
                        <section className="col-span-12 lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-outline-variant/10 dark:border-slate-800">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 rounded-2xl bg-primary-container/20 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-primary dark:text-[#00D1FF]">info</span>
                                </div>
                                <h3 className="font-headline font-bold text-lg text-[#003346] dark:text-white">Informações Básicas</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="col-span-1 md:col-span-2 space-y-2">
                                    <label className="block text-xs font-bold text-[#507c94] dark:text-[#87b3cd] uppercase tracking-wide">Nome do Curso *</label>
                                    <input 
                                        type="text"
                                        required
                                        placeholder="Ex: Gestão de Projetos Ágeis"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full bg-surface dark:bg-slate-950 border-none rounded-xl px-4 py-3 text-on-surface dark:text-white focus:ring-2 focus:ring-primary outline-none"
                                    />
                                    {errors.name && <p className="text-xs text-error mt-1">{errors.name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-[#507c94] dark:text-[#87b3cd] uppercase tracking-wide">Categoria *</label>
                                    <select 
                                        required
                                        value={data.category}
                                        onChange={(e) => setData('category', e.target.value)}
                                        className="w-full bg-surface dark:bg-slate-950 border-none rounded-xl px-4 py-3 text-on-surface dark:text-white focus:ring-2 focus:ring-primary outline-none"
                                    >
                                        <option value="">Selecione uma categoria</option>
                                        <option value="Tecnologia">Tecnologia</option>
                                        <option value="Negócios">Negócios</option>
                                        <option value="Design">Design</option>
                                        <option value="Marketing">Marketing</option>
                                    </select>
                                    {errors.category && <p className="text-xs text-error mt-1">{errors.category}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-[#507c94] dark:text-[#87b3cd] uppercase tracking-wide">Carga Horária (horas) *</label>
                                    <input 
                                        type="number"
                                        required
                                        placeholder="Ex: 40"
                                        value={data.hours}
                                        onChange={(e) => setData('hours', e.target.value)}
                                        className="w-full bg-surface dark:bg-slate-950 border-none rounded-xl px-4 py-3 text-on-surface dark:text-white focus:ring-2 focus:ring-primary outline-none"
                                    />
                                    {errors.hours && <p className="text-xs text-error mt-1">{errors.hours}</p>}
                                </div>

                                <div className="col-span-1 md:col-span-2 space-y-2">
                                    <label className="block text-xs font-bold text-[#507c94] dark:text-[#87b3cd] uppercase tracking-wide">Nível de Dificuldade</label>
                                    <div className="flex gap-4">
                                        {['iniciante', 'intermediario', 'avancado'].map((lvl) => (
                                            <label key={lvl} className="flex-1 relative cursor-pointer group select-none">
                                                <input 
                                                    type="radio" 
                                                    name="level"
                                                    value={lvl}
                                                    checked={data.level === lvl}
                                                    onChange={(e) => setData('level', e.target.value)}
                                                    className="peer sr-only" 
                                                />
                                                <div className="p-4 rounded-2xl bg-surface dark:bg-slate-950 border-2 border-transparent peer-checked:border-primary dark:peer-checked:border-[#00D1FF] peer-checked:bg-primary/5 dark:peer-checked:bg-primary/10 transition-all text-center font-bold text-sm text-[#003346] dark:text-white">
                                                    {lvl === 'iniciante' ? 'Iniciante' : lvl === 'intermediario' ? 'Intermediário' : 'Avançado'}
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                    {errors.level && <p className="text-xs text-error mt-1">{errors.level}</p>}
                                </div>
                            </div>
                        </section>

                        {/* Capa e Descrição (col-span-4) */}
                        <section className="col-span-12 lg:col-span-4 bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-outline-variant/10 dark:border-slate-800 flex flex-col justify-between">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 rounded-2xl bg-tertiary-container/20 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-tertiary dark:text-[#6bfe9c]">movie</span>
                                </div>
                                <h3 className="font-headline font-bold text-lg text-[#003346] dark:text-white">Mídia e Capa</h3>
                            </div>

                            <div className="flex-1 flex flex-col justify-between space-y-6">
                                <div className="relative group cursor-pointer mb-2 border-2 border-dashed border-outline-variant/30 dark:border-slate-800 rounded-3xl h-44 flex flex-col items-center justify-center hover:bg-surface dark:hover:bg-slate-950 transition-all overflow-hidden">
                                    <img 
                                        className="absolute inset-0 w-full h-full object-cover opacity-10 group-hover:opacity-20 transition-opacity" 
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_d9inySj_-PA8wBgY8dEvnu8v-4FW8MXyuknAgokMzavyOpbwWIaOkIarG-jXMRI0bRoeh85xDfvTqFfzueIMZuNGTdu2P71RQ5s2i3PmDR63z_ykuWEZ6pkrseaOh8G_eUU4v493ef6_6XC7Xc5aAtj5NCZJsaL3rZQ7SaHVlSY7UGpjXiGYk2BRCqP-4hTpACYh1EP38ynTWQE8SdO5NZ9JlOESWROSgw1ZyaAt5O30EL0dCpDAHZeg_RK816B0HBvaLW7KgLm-" 
                                        alt="Capa do Curso"
                                    />
                                    <span className="material-symbols-outlined text-4xl text-primary dark:text-[#00D1FF] mb-2 relative z-10">cloud_upload</span>
                                    <p className="text-sm font-bold text-primary dark:text-[#00D1FF] relative z-10">Upload da Capa</p>
                                    <p className="text-[10px] text-[#507c94] dark:text-[#87b3cd] relative z-10 mt-1">PNG, JPG (Recomendado: 1200x630)</p>
                                </div>

                                <div className="space-y-2 flex-1 flex flex-col">
                                    <label className="block text-xs font-bold text-[#507c94] dark:text-[#87b3cd] uppercase tracking-wide">Descrição Curta</label>
                                    <textarea 
                                        placeholder="Escreva uma breve apresentação do curso..."
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        rows="4"
                                        className="w-full bg-surface dark:bg-slate-950 border-none rounded-xl px-4 py-3 text-on-surface dark:text-white focus:ring-2 focus:ring-primary outline-none resize-none flex-1"
                                    />
                                    {errors.description && <p className="text-xs text-error mt-1">{errors.description}</p>}
                                </div>
                            </div>
                        </section>

                        {/* Estrutura de Preço (col-span-6) */}
                        <section className="col-span-12 lg:col-span-6 bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-outline-variant/10 dark:border-slate-800">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 rounded-2xl bg-secondary-container/20 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-secondary dark:text-[#80deff]">payments</span>
                                </div>
                                <h3 className="font-headline font-bold text-lg text-[#003346] dark:text-white">Estrutura de Preço</h3>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="block text-xs font-bold text-[#507c94] dark:text-[#87b3cd] uppercase tracking-wide">Valor do Curso *</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-[#507c94] dark:text-[#87b3cd]">R$</span>
                                            <input 
                                                type="text"
                                                required
                                                placeholder="0,00"
                                                value={data.price}
                                                onChange={(e) => setData('price', e.target.value)}
                                                className="w-full bg-surface dark:bg-slate-950 border-none rounded-xl pl-12 pr-4 py-3 text-on-surface dark:text-white focus:ring-2 focus:ring-primary outline-none"
                                            />
                                        </div>
                                        {errors.price && <p className="text-xs text-error mt-1">{errors.price}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-xs font-bold text-[#507c94] dark:text-[#87b3cd] uppercase tracking-wide">Parcelamento Máx.</label>
                                        <select 
                                            value={data.installments}
                                            onChange={(e) => setData('installments', e.target.value)}
                                            className="w-full bg-surface dark:bg-slate-950 border-none rounded-xl px-4 py-3 text-on-surface dark:text-white focus:ring-2 focus:ring-primary outline-none"
                                        >
                                            <option value="À vista">À vista</option>
                                            <option value="2x sem juros">2x sem juros</option>
                                            <option value="6x sem juros">6x sem juros</option>
                                            <option value="12x com juros">12x com juros</option>
                                        </select>
                                        {errors.installments && <p className="text-xs text-error mt-1">{errors.installments}</p>}
                                    </div>
                                </div>

                                <div className="bg-surface dark:bg-slate-950 p-4 rounded-2xl flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-tertiary dark:text-[#6bfe9c]">sell</span>
                                        <div>
                                            <p className="text-sm font-bold text-[#003346] dark:text-white">Desconto Ativo</p>
                                            <p className="text-[10px] text-[#507c94] dark:text-[#87b3cd] uppercase tracking-widest font-label">Preço promocional de lançamento</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer select-none">
                                        <input 
                                            type="checkbox" 
                                            checked={data.discount_active}
                                            onChange={(e) => setData('discount_active', e.target.checked)}
                                            className="sr-only peer" 
                                        />
                                        <div className="w-12 h-6 bg-outline-variant/30 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-tertiary"></div>
                                    </label>
                                </div>
                            </div>
                        </section>

                        {/* Configurações Pedagógicas (col-span-6) */}
                        <section className="col-span-12 lg:col-span-6 bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-outline-variant/10 dark:border-slate-800">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 rounded-2xl bg-primary-container/20 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-primary dark:text-[#00D1FF]">school</span>
                                </div>
                                <h3 className="font-headline font-bold text-lg text-[#003346] dark:text-white">Pedagógico</h3>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-[#507c94] dark:text-[#87b3cd] uppercase tracking-wide">Professor / Instrutor *</label>
                                    <select 
                                        required
                                        value={data.instructor}
                                        onChange={(e) => setData('instructor', e.target.value)}
                                        className="w-full bg-surface dark:bg-slate-950 border-none rounded-xl px-4 py-3 text-on-surface dark:text-white focus:ring-2 focus:ring-primary outline-none"
                                    >
                                        <option value="">Selecione um instrutor</option>
                                        <option value="Dr. Ricardo Santos">Dr. Ricardo Santos</option>
                                        <option value="Dra. Marina Lopes">Dra. Marina Lopes</option>
                                        <option value="Prof. Carlos Alberto">Prof. Carlos Alberto</option>
                                    </select>
                                    {errors.instructor && <p className="text-xs text-error mt-1">{errors.instructor}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-[#507c94] dark:text-[#87b3cd] uppercase tracking-wide">Total de Módulos *</label>
                                    <input 
                                        type="number"
                                        required
                                        placeholder="Ex: 12"
                                        value={data.modules}
                                        onChange={(e) => setData('modules', e.target.value)}
                                        className="w-full bg-surface dark:bg-slate-950 border-none rounded-xl px-4 py-3 text-on-surface dark:text-white focus:ring-2 focus:ring-primary outline-none"
                                    />
                                    {errors.modules && <p className="text-xs text-error mt-1">{errors.modules}</p>}
                                </div>

                                <div className="bg-surface dark:bg-slate-950 p-4 rounded-2xl flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-primary dark:text-[#00D1FF]">workspace_premium</span>
                                        <div>
                                            <p className="text-sm font-bold text-[#003346] dark:text-white">Certificado Automático</p>
                                            <p className="text-[10px] text-[#507c94] dark:text-[#87b3cd] uppercase tracking-widest font-label">Liberar ao concluir 100%</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer select-none">
                                        <input 
                                            type="checkbox" 
                                            checked={data.certificate_auto}
                                            onChange={(e) => setData('certificate_auto', e.target.checked)}
                                            className="sr-only peer" 
                                        />
                                        <div className="w-12 h-6 bg-outline-variant/30 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                    </label>
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
                                className="px-8 py-3 rounded-2xl font-bold text-[#507c94] dark:text-[#87b3cd] hover:bg-[#c2e8ff]/30 dark:hover:bg-slate-800 transition-all text-sm flex items-center justify-center select-none"
                            >
                                Cancelar
                            </Link>
                            <button 
                                type="submit"
                                disabled={processing}
                                className="px-10 py-4 rounded-2xl bg-primary text-white font-bold shadow-xl shadow-primary/30 hover:scale-[1.03] active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50 text-sm"
                            >
                                <span className="material-symbols-outlined text-sm">save</span>
                                <span>{processing ? 'Salvando...' : 'Salvar Curso'}</span>
                            </button>
                        </div>
                    </footer>
                </form>
            </div>
        </Layout>
    );
}
