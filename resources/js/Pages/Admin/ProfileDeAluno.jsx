import AdminLayout from '@/Layouts/AdminLayout';
import SchoolAdminLayout from '@/Layouts/SchoolAdminLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

// Subcomponents import
import DadosAcademicos from '@/Components/StudentProfile/DadosAcademicos';
import ControleMatricula from '@/Components/StudentProfile/ControleMatricula';
import Boletim from '@/Components/StudentProfile/Boletim';
import DadosPessoais from '@/Components/StudentProfile/DadosPessoais';
import Financeiro from '@/Components/StudentProfile/Financeiro';
import Mensagem from '@/Components/StudentProfile/Mensagem';
import Notas from '@/Components/StudentProfile/Notas';
import Historico from '@/Components/StudentProfile/Historico';
import Frequencia from '@/Components/StudentProfile/Frequencia';

export default function ProfileDeAluno({ student }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const isSchoolAdmin = user.role === 'school_admin';
    const Layout = isSchoolAdmin ? SchoolAdminLayout : AdminLayout;

    // React state for page messaging and active tabs
    const [activeTab, setActiveTab] = useState('pessoal'); // pedagogico, pessoal, financeiro
    const [activePedagogicoSubTab, setActivePedagogicoSubTab] = useState('boletim'); // boletim, notas, etc.
    const [successToast, setSuccessToast] = useState(null);

    // Form initialization using Inertia's useForm hook
    const { data, setData, put, processing, errors } = useForm({
        name: student.name || '',
        email: student.email || '',
        phone: student.phone || '',
        status: student.status || 'active',
        // Mock fields to match high-fidelity design
        curso: 'Ensino Fundamental',
        polo: 'Polo Centro',
        turma: '9º Ano A',
        professor: 'João Silva',
        matricula: `2024-PUV-${9980 + student.id}`,
        data_matricula: '2024-02-12',
        periodo_letivo: '2024 - 1º Semestre',
        follow_up: '',
        birth_date: '2010-04-14',
        gender: 'male',
        cpf: '456.789.012-34',
        rg: '45.678.901-2',
        guardian_name: 'Roberto Santos',
        guardian_cpf: '123.456.789-01',
        cep: '01310-100',
        address: 'Avenida Paulista, 1000',
        city: 'São Paulo',
        state: 'SP'
    });

    const triggerToast = (message) => {
        setSuccessToast(message);
        setTimeout(() => setSuccessToast(null), 3500);
    };

    const handleSave = (e) => {
        e.preventDefault();
        put(route(isSchoolAdmin ? 'school-admin.students.update' : 'admin.students.update', { student: student.id }), {
            onSuccess: () => {
                triggerToast('Alterações salvas com sucesso!');
            },
            onError: () => {
                triggerToast('Erro ao salvar alterações.');
            }
        });
    };

    const handleMessageSubmit = (e) => {
        e.preventDefault();
        triggerToast('Mensagem enviada com sucesso ao aluno/responsável!');
    };

    // Sub-tab styling helper
    const getSubTabClass = (tabName) => {
        return `flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all select-none border border-transparent ${activePedagogicoSubTab === tabName
            ? 'bg-white dark:bg-slate-800 text-primary dark:text-[#00D1FF] shadow-sm border-outline-variant/10'
            : 'text-[#507c94] dark:text-[#87b3cd] hover:text-primary dark:hover:text-[#00D1FF]'
            }`;
    };

    return (
        <Layout>
            <Head title={`Perfil de ${student.name} | PlayUp Velocity`} />

            <div className="p-8 max-w-7xl mx-auto space-y-6 pb-24 relative">
                {/* Toast Notification */}
                {successToast && (
                    <div className="fixed top-20 right-8 z-50 flex items-center gap-2 px-6 py-4 rounded-xl bg-[#e6f4ea] dark:bg-emerald-950 text-[#137333] dark:text-[#6bfe9c] border border-emerald-500/20 shadow-xl animate-in slide-in-from-top-4 duration-300">
                        <span className="material-symbols-outlined text-lg">check_circle</span>
                        <span className="text-sm font-bold">{successToast}</span>
                    </div>
                )}

                {/* Back Nav Link */}
                <div className="flex items-center gap-2 text-primary dark:text-[#00D1FF] font-bold text-xs">
                    <Link className="hover:underline" href={route(isSchoolAdmin ? 'school-admin.students.index' : 'admin.students.index')}>
                        Voltar para Alunos
                    </Link>
                    <span className="material-symbols-outlined text-xs">chevron_right</span>
                    <span className="text-[#507c94] dark:text-[#87b3cd] font-semibold">{student.name}</span>
                </div>

                {/* Top Nav Tabs Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-white/40 dark:bg-slate-900/40 p-2 rounded-2xl border border-outline-variant/10">
                    <div className="flex gap-2 p-1 bg-surface dark:bg-slate-950 rounded-xl self-start">
                        <button
                            onClick={() => setActiveTab('pessoal')}
                            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all select-none ${activeTab === 'pessoal'
                                ? 'bg-white dark:bg-slate-800 text-primary dark:text-[#00D1FF] shadow-sm'
                                : 'text-[#507c94] dark:text-[#87b3cd] hover:text-primary dark:hover:text-[#00D1FF]'
                                }`}
                        >
                            Dados Pessoais
                        </button>
                        <button
                            onClick={() => setActiveTab('financeiro')}
                            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all select-none ${activeTab === 'financeiro'
                                ? 'bg-white dark:bg-slate-800 text-primary dark:text-[#00D1FF] shadow-sm'
                                : 'text-[#507c94] dark:text-[#87b3cd] hover:text-primary dark:hover:text-[#00D1FF]'
                                }`}
                        >
                            Financeiro
                        </button>
                        <button
                            onClick={() => setActiveTab('pedagogico')}
                            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all select-none ${activeTab === 'pedagogico'
                                ? 'bg-white dark:bg-slate-800 text-primary dark:text-[#00D1FF] shadow-sm'
                                : 'text-[#507c94] dark:text-[#87b3cd] hover:text-primary dark:hover:text-[#00D1FF]'
                                }`}
                        >
                            Pedagógico
                        </button>
                    </div>

                    <button
                        onClick={() => setActiveTab('mensagem')}
                        className="bg-sky-50 dark:bg-slate-800 hover:bg-sky-100 dark:hover:bg-slate-700 text-[#003346] dark:text-[#00D1FF] border border-sky-200/50 dark:border-slate-700 px-6 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 select-none active:scale-95 transition-all text-sm"
                    >
                        <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'wght' 500" }}>send</span>
                        <span>ENVIAR MENSAGEM</span>
                    </button>
                </div>

                {/* Dashboard Columns Layout */}
                <div className="grid grid-cols-12 gap-6 items-start pb-24">

                    {/* Left Main Form/Details Column */}
                    <div className="col-span-12 space-y-6">

                        {/* Tab Content: Pedagógico */}
                        {activeTab === 'pedagogico' && (
                            <>
                                <DadosAcademicos data={data} setData={setData} />

                                <ControleMatricula data={data} setData={setData} triggerToast={triggerToast} />

                                {/* Report Card Subtabs and Details */}
                                <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-outline-variant/10 dark:border-slate-800 shadow-sm space-y-6">

                                    {/* Report Subtabs Bar */}
                                    <div className="flex flex-wrap gap-2 pb-4 border-b border-outline-variant/10">
                                        <button onClick={() => setActivePedagogicoSubTab('boletim')} className={getSubTabClass('boletim')}>
                                            <span className="material-symbols-outlined text-md">assignment</span>
                                            <span>Boletim</span>
                                        </button>
                                        <button onClick={() => setActivePedagogicoSubTab('notas')} className={getSubTabClass('notas')}>
                                            <span className="material-symbols-outlined text-md">star</span>
                                            <span>Notas</span>
                                        </button>
                                        <button onClick={() => setActivePedagogicoSubTab('avaliacoes')} className={getSubTabClass('avaliacoes')}>
                                            <span className="material-symbols-outlined text-md">analytics</span>
                                            <span>Avaliações</span>
                                        </button>
                                        <button onClick={() => setActivePedagogicoSubTab('frequencia')} className={getSubTabClass('frequencia')}>
                                            <span className="material-symbols-outlined text-md">date_range</span>
                                            <span>Frequência</span>
                                        </button>
                                        <button onClick={() => setActivePedagogicoSubTab('historico')} className={getSubTabClass('historico')}>
                                            <span className="material-symbols-outlined text-md">menu_book</span>
                                            <span>Histórico</span>
                                        </button>
                                        <button onClick={() => setActivePedagogicoSubTab('certificados')} className={getSubTabClass('certificados')}>
                                            <span className="material-symbols-outlined text-md">workspace_premium</span>
                                            <span>Certificados</span>
                                        </button>
                                        <button onClick={() => setActivePedagogicoSubTab('declaracoes')} className={getSubTabClass('declaracoes')}>
                                            <span className="material-symbols-outlined text-md">description</span>
                                            <span>Declarações</span>
                                        </button>
                                        <button onClick={() => setActivePedagogicoSubTab('ia_insights')} className={getSubTabClass('ia_insights')}>
                                            <span className="material-symbols-outlined text-md">auto_awesome</span>
                                            <span>IA Insights</span>
                                        </button>
                                    </div>

                                    {/* Subtab Content: Boletim */}
                                    {activePedagogicoSubTab === 'boletim' && (
                                        <Boletim
                                            student={student}
                                            data={data}
                                            setData={setData}
                                            processing={processing}
                                            handleSave={handleSave}
                                            isSchoolAdmin={isSchoolAdmin}
                                            triggerToast={triggerToast}
                                        />
                                    )}

                                    {/* Subtab Content: Notas */}
                                    {activePedagogicoSubTab === 'notas' && (
                                        <Notas
                                            student={student}
                                            triggerToast={triggerToast}
                                        />
                                    )}

                                    {/* Subtab Content: Historico */}
                                    {activePedagogicoSubTab === 'historico' && (
                                        <Historico
                                            student={student}
                                            triggerToast={triggerToast}
                                        />
                                    )}

                                    {/* Subtab Content: Frequencia */}
                                    {activePedagogicoSubTab === 'frequencia' && (
                                        <Frequencia
                                            student={student}
                                            triggerToast={triggerToast}
                                        />
                                    )}

                                    {/* Simulated other Pedagogico tabs */}
                                    {activePedagogicoSubTab !== 'boletim' && activePedagogicoSubTab !== 'notas' && activePedagogicoSubTab !== 'historico' && activePedagogicoSubTab !== 'frequencia' && (
                                        <div className="py-12 text-center text-[#507c94] dark:text-[#87b3cd]/70 font-semibold space-y-2">
                                            <span className="material-symbols-outlined text-4xl opacity-50 block">auto_awesome</span>
                                            <p className="text-sm">Painel de "{activePedagogicoSubTab.toUpperCase()}" simulado com sucesso.</p>
                                            <button onClick={() => setActivePedagogicoSubTab('boletim')} className="text-xs text-primary dark:text-[#00D1FF] font-bold hover:underline">
                                                Voltar para Boletim
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        {/* Tab Content: Dados Pessoais */}
                        {activeTab === 'pessoal' && (
                            <DadosPessoais data={data} setData={setData} errors={errors} />
                        )}

                        {/* Tab Content: Financeiro */}
                        {activeTab === 'financeiro' && (
                            <Financeiro student={student} />
                        )}

                        {/* Tab Content: Enviar Mensagem */}
                        {activeTab === 'mensagem' && (
                            <Mensagem student={student} handleMessageSubmit={handleMessageSubmit} />
                        )}

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
                            href={route(isSchoolAdmin ? 'school-admin.students.index' : 'admin.students.index')}
                            className="px-8 py-3.5 text-on-surface-variant text-center font-bold hover:bg-surface-container dark:hover:bg-slate-800 rounded-xl transition-all text-sm select-none"
                        >
                            Descartar Mudanças
                        </Link>
                        <button
                            onClick={handleSave}
                            disabled={processing}
                            className="px-10 py-3.5 bg-gradient-to-br from-primary to-primary-dim text-white font-bold text-sm rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>save</span>
                            <span>{processing ? 'Salvando...' : 'Salvar Alterações'}</span>
                        </button>
                    </div>
                </footer>
            </div>
        </Layout>
    );
}
