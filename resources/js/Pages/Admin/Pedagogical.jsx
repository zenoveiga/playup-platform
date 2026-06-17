import AdminLayout from '@/Layouts/AdminLayout';
import SchoolAdminLayout from '@/Layouts/SchoolAdminLayout';
import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Pedagogical() {
    const { auth } = usePage().props;
    const user = auth.user;
    const isSchoolAdmin = user.role === 'school_admin';
    const Layout = isSchoolAdmin ? SchoolAdminLayout : AdminLayout;

    // State management for page interactions
    const [notification, setNotification] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); // all, Pendente, Concluído, Urgente
    
    // Modal states
    const [isDeclarationModalOpen, setIsDeclarationModalOpen] = useState(false);
    const [isEvasionModalOpen, setIsEvasionModalOpen] = useState(false);
    
    // Document emission form state
    const [selectedStudent, setSelectedStudent] = useState('');
    const [selectedDocType, setSelectedDocType] = useState('');
    const [isEmitting, setIsEmitting] = useState(false);

    // Mock recent requests state for rich interaction
    const [requests, setRequests] = useState([
        { id: 1, name: 'Ricardo Mendonça', initials: 'RM', type: 'Histórico Escolar', location: 'Polo São Paulo Centro', date: 'Hoje, 14:20', status: 'Concluído', color: 'primary' },
        { id: 2, name: 'Amanda Ferreira', initials: 'AF', type: 'Declaração de Matrícula', location: 'Polo Curitiba', date: 'Hoje, 11:45', status: 'Pendente', color: 'secondary' },
        { id: 3, name: 'Gustavo Silva', initials: 'GS', type: 'Certificado Parcial', location: 'Polo Rio Barra', date: 'Ontem, 16:30', status: 'Concluído', color: 'primary' },
        { id: 4, name: 'Lucas Costa', initials: 'LC', type: 'Inatividade Alerta', location: 'EAD - Geral', date: 'Ontem, 09:12', status: 'Urgente', color: 'error' }
    ]);

    // Mock list of inactive students
    const inactiveStudents = [
        { name: 'Lucas Costa', email: 'lucas.costa@escola.com', lastAccess: '8 dias atrás', course: 'Marketing Digital' },
        { name: 'Beatriz Ramos', email: 'beatriz.r@escola.com', lastAccess: '10 dias atrás', course: 'Desenvolvimento Web' },
        { name: 'Matheus Vieira', email: 'matheus.v@escola.com', lastAccess: '12 dias atrás', course: 'Design UI/UX' },
        { name: 'Camila Souza', email: 'camila.s@escola.com', lastAccess: '14 dias atrás', course: 'Marketing Digital' },
        { name: 'Gabriel Pires', email: 'gabriel.p@escola.com', lastAccess: '15 dias atrás', course: 'Ciência de Dados' }
    ];

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => {
            setNotification(null);
        }, 3500);
    };

    // Filter requests list
    const filteredRequests = requests.filter(req => {
        if (statusFilter !== 'all' && req.status !== statusFilter) return false;
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return req.name.toLowerCase().includes(query) || req.type.toLowerCase().includes(query) || req.location.toLowerCase().includes(query);
        }
        return true;
    });

    const handleActionComplete = (id, studentName) => {
        setRequests(prev => prev.map(req => req.id === id ? { ...req, status: 'Concluído' } : req));
        showNotification(`Solicitação de "${studentName}" concluída com sucesso!`);
    };

    const handleActionNotify = (studentName) => {
        showNotification(`Alerta de reengajamento enviado para ${studentName} via WhatsApp e Email.`);
    };

    const handleEmitDocument = (e) => {
        e.preventDefault();
        if (!selectedStudent || !selectedDocType) {
            showNotification('Selecione o aluno e o documento para emissão.', 'error');
            return;
        }
        setIsEmitting(true);

        setTimeout(() => {
            setIsEmitting(false);
            setIsDeclarationModalOpen(false);
            
            // Add new request log
            const newId = requests.length + 1;
            const initials = selectedStudent.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
            const newRequest = {
                id: newId,
                name: selectedStudent,
                initials: initials,
                type: selectedDocType,
                location: isSchoolAdmin ? 'Polo Central' : 'Administração Geral',
                date: 'Agora mesmo',
                status: 'Concluído',
                color: 'primary'
            };
            setRequests([newRequest, ...requests]);
            
            showNotification(`Documento "${selectedDocType}" emitido para ${selectedStudent}!`);
            setSelectedStudent('');
            setSelectedDocType('');
        }, 1500);
    };

    return (
        <Layout>
            <Head title="Gestão Pedagógica | PlayUp Velocity" />

            <div className="max-w-7xl mx-auto p-8 space-y-8 animate-in fade-in duration-700 relative">
                {/* Notification toast */}
                {notification && (
                    <div className="fixed top-20 right-8 z-50 flex items-center gap-2 px-6 py-4 rounded-xl bg-tertiary-container dark:bg-emerald-950 text-[#006a35] dark:text-[#6bfe9c] border border-tertiary/20 shadow-xl animate-in slide-in-from-top-4 duration-300">
                        <span className="material-symbols-outlined text-lg">check_circle</span>
                        <span className="text-sm font-bold">{notification.message}</span>
                    </div>
                )}

                {/* Page Title Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <h2 className="text-4xl font-extrabold font-headline text-[#003346] dark:text-white tracking-tight leading-none mb-2">
                            Gestão Pedagógica
                        </h2>
                        <p className="text-on-surface-variant dark:text-[#b5e3ff] font-medium text-lg max-w-2xl">
                            Controle ferramentas de suporte acadêmico e monitoramento de alunos em tempo real.
                        </p>
                    </div>
                </div>

                {/* Principal Action Cards - Bento Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Card 1: Relatório de Inatividade */}
                    <div className="group relative overflow-hidden bg-primary p-8 rounded-[1.5rem] text-white flex flex-col justify-between min-h-[220px] transition-all hover:shadow-[0_20px_50px_rgba(0,80,212,0.3)] hover:-translate-y-1">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:scale-150 transition-transform duration-500"></div>
                        <div className="relative z-10">
                            <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6">
                                <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>history_toggle_off</span>
                            </div>
                            <h3 className="text-2xl font-bold font-headline mb-2">Relatório de Inatividade</h3>
                            <p className="text-white/80 font-medium max-w-xs">Identifique alunos sem acesso recente para ações de retenção imediata.</p>
                        </div>
                        <button 
                            onClick={() => setIsEvasionModalOpen(true)}
                            className="relative z-10 mt-6 self-start px-6 py-2.5 bg-white text-primary font-bold rounded-xl hover:scale-[1.03] active:scale-95 transition-all cursor-pointer text-sm shadow-sm"
                        >
                            Ver Alunos
                        </button>
                    </div>

                    {/* Card 2: Emitir Declaração */}
                    <div className="group relative overflow-hidden bg-white dark:bg-slate-900 p-8 rounded-[1.5rem] border border-outline-variant/10 dark:border-slate-800 flex flex-col justify-between min-h-[220px] transition-all hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:-translate-y-1">
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-full -ml-16 -mb-16 blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
                        <div className="relative z-10">
                            <div className="w-14 h-14 bg-secondary-container dark:bg-cyan-950 rounded-2xl flex items-center justify-center mb-6">
                                <span className="material-symbols-outlined text-primary dark:text-[#00D1FF] text-3xl">article</span>
                            </div>
                            <h3 className="text-2xl font-bold font-headline mb-2 text-[#003346] dark:text-white">Emitir Declaração</h3>
                            <p className="text-on-surface-variant dark:text-[#87b3cd] font-medium max-w-xs">Gere certificados de conclusão, histórico escolar e comprovantes de matrícula.</p>
                        </div>
                        <button 
                            onClick={() => setIsDeclarationModalOpen(true)}
                            className="relative z-10 mt-6 self-start px-6 py-2.5 bg-primary text-white font-bold rounded-xl hover:scale-[1.03] active:scale-95 transition-all cursor-pointer text-sm shadow-md shadow-primary/20"
                        >
                            Iniciar Emissão
                        </button>
                    </div>
                </div>

                {/* Statistics Section */}
                <section className="space-y-4">
                    <h2 className="text-[#003346] dark:text-white font-bold text-xl font-headline flex items-center gap-2">
                        <span className="w-2 h-6 bg-primary-container rounded-full"></span> Indicadores de Desempenho
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-surface-container-low dark:bg-slate-900 p-6 rounded-3xl flex items-center gap-5 border border-outline-variant/5 dark:border-slate-800">
                            <div className="w-14 h-14 rounded-full bg-error-container/20 flex items-center justify-center text-error dark:text-red-400">
                                <span className="material-symbols-outlined text-3xl">person_off</span>
                            </div>
                            <div>
                                <p className="text-on-surface-variant dark:text-[#87b3cd] text-sm font-semibold">Alunos Inativos (7 dias)</p>
                                <p className="text-[#003346] dark:text-white text-3xl font-extrabold font-headline">142</p>
                            </div>
                        </div>
                        
                        <div className="bg-surface-container-low dark:bg-slate-900 p-6 rounded-3xl flex items-center gap-5 border border-outline-variant/5 dark:border-slate-800">
                            <div className="w-14 h-14 rounded-full bg-tertiary-container/20 flex items-center justify-center text-tertiary dark:text-emerald-400">
                                <span className="material-symbols-outlined text-3xl">trending_up</span>
                            </div>
                            <div>
                                <p className="text-on-surface-variant dark:text-[#87b3cd] text-sm font-semibold">Média de Engajamento</p>
                                <p className="text-[#003346] dark:text-white text-3xl font-extrabold font-headline">84%</p>
                            </div>
                        </div>

                        <div className="bg-surface-container-low dark:bg-slate-900 p-6 rounded-3xl flex items-center gap-5 border border-outline-variant/5 dark:border-slate-800">
                            <div className="w-14 h-14 rounded-full bg-primary-container/20 flex items-center justify-center text-primary dark:text-[#00D1FF]">
                                <span className="material-symbols-outlined text-3xl">print</span>
                            </div>
                            <div>
                                <p className="text-on-surface-variant dark:text-[#87b3cd] text-sm font-semibold">Declarações (Mês)</p>
                                <p className="text-[#003346] dark:text-white text-3xl font-extrabold font-headline">1.280</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Recent Requests Table Section */}
                <section className="space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <h2 className="text-[#003346] dark:text-white font-bold text-xl font-headline flex items-center gap-2">
                            <span className="w-2 h-6 bg-secondary-fixed rounded-full"></span> Solicitações Recentes
                        </h2>
                        
                        {/* Table Controls */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                            {/* Search */}
                            <div className="relative font-body">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg pointer-events-none">search</span>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Buscar por aluno, tipo..."
                                    className="w-full sm:w-60 bg-white dark:bg-slate-900 border border-outline-variant/20 dark:border-slate-850 rounded-xl py-2 pl-9 pr-4 text-xs text-on-surface dark:text-white placeholder:text-on-surface-variant/40 outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>

                            {/* Filters Tab buttons */}
                            <div className="flex items-center gap-1 bg-[#cfecff] dark:bg-slate-900 p-1 rounded-xl">
                                {['all', 'Pendente', 'Concluído', 'Urgente'].map((f) => (
                                    <button
                                        key={f}
                                        onClick={() => setStatusFilter(f)}
                                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all capitalize ${statusFilter === f ? 'bg-white dark:bg-slate-850 text-primary dark:text-[#00D1FF] shadow-sm' : 'text-[#003346]/70 dark:text-white/60 hover:bg-white/40 dark:hover:bg-slate-800/40'}`}
                                    >
                                        {f === 'all' ? 'Todos' : f}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Table Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden border border-outline-variant/5 dark:border-slate-800 shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-surface-container-low/50 dark:bg-slate-950/40">
                                        <th className="px-6 py-5 text-[#003346] dark:text-white font-bold text-sm uppercase tracking-wider">Aluno</th>
                                        <th className="px-6 py-5 text-[#003346] dark:text-white font-bold text-sm uppercase tracking-wider">Solicitação</th>
                                        <th className="px-6 py-5 text-[#003346] dark:text-white font-bold text-sm uppercase tracking-wider">Polo / Unidade</th>
                                        <th className="px-6 py-5 text-[#003346] dark:text-white font-bold text-sm uppercase tracking-wider">Data</th>
                                        <th className="px-6 py-5 text-[#003346] dark:text-white font-bold text-sm uppercase tracking-wider text-center">Status</th>
                                        <th className="px-6 py-5 text-[#003346] dark:text-white font-bold text-sm uppercase tracking-wider text-right">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-outline-variant/10 dark:divide-slate-800/60">
                                    {filteredRequests.length > 0 ? (
                                        filteredRequests.map((req) => (
                                            <tr key={req.id} className="hover:bg-surface-container-low/30 dark:hover:bg-slate-800/20 transition-colors group">
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                                                            req.status === 'Urgente'
                                                                ? 'bg-error-container/20 text-error'
                                                                : req.status === 'Pendente'
                                                                ? 'bg-secondary-container/20 text-[#00647b]'
                                                                : 'bg-primary/10 text-primary dark:text-[#00D1FF]'
                                                        }`}>
                                                            {req.initials}
                                                        </div>
                                                        <span className="text-[#003346] dark:text-white font-bold">{req.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-on-surface-variant dark:text-[#b5e3ff] font-medium text-sm">
                                                    {req.type}
                                                </td>
                                                <td className="px-6 py-5 text-on-surface-variant dark:text-[#87b3cd] text-sm">
                                                    {req.location}
                                                </td>
                                                <td className="px-6 py-5 text-on-surface-variant dark:text-[#87b3cd]/80 text-sm">
                                                    {req.date}
                                                </td>
                                                <td className="px-6 py-5 text-center">
                                                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                                                        req.status === 'Concluído'
                                                            ? 'bg-tertiary-container dark:bg-emerald-950 text-tertiary dark:text-emerald-400'
                                                            : req.status === 'Pendente'
                                                            ? 'bg-secondary-container dark:bg-cyan-950 text-[#004e61] dark:text-cyan-400'
                                                            : 'bg-error-container dark:bg-red-950 text-error dark:text-red-400 animate-pulse'
                                                    }`}>
                                                        {req.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        {req.status !== 'Concluído' && (
                                                            <button
                                                                onClick={() => handleActionComplete(req.id, req.name)}
                                                                className="px-3 py-1 bg-tertiary text-white text-xs font-bold rounded-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
                                                                title="Concluir Solicitação"
                                                            >
                                                                <span className="material-symbols-outlined text-sm">check</span>
                                                                <span>Concluir</span>
                                                            </button>
                                                        )}
                                                        {req.status === 'Urgente' && (
                                                            <button
                                                                onClick={() => handleActionNotify(req.name)}
                                                                className="px-3 py-1 bg-primary text-white text-xs font-bold rounded-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
                                                                title="Alertar Aluno"
                                                            >
                                                                <span className="material-symbols-outlined text-sm">send</span>
                                                                <span>Alertar</span>
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => showNotification(`Detalhes de ${req.name} carregados (Simulação).`)}
                                                            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-on-surface-variant"
                                                        >
                                                            <span className="material-symbols-outlined text-sm">more_vert</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center text-on-surface-variant font-medium">
                                                Nenhuma solicitação encontrada correspondente aos filtros.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </div>

            {/* Modal: Emitir Declaração */}
            {isDeclarationModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-[2rem] w-full max-w-lg p-8 border border-outline-variant/15 dark:border-slate-800 shadow-2xl relative animate-in scale-in duration-200">
                        <button
                            onClick={() => setIsDeclarationModalOpen(false)}
                            className="absolute right-6 top-6 p-2 text-on-surface-variant hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                        
                        <div className="flex items-center gap-3 mb-6">
                            <span className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                                <span className="material-symbols-outlined text-2xl">description</span>
                            </span>
                            <div>
                                <h3 className="text-xl font-bold font-headline text-[#003346] dark:text-white">Emitir Nova Declaração</h3>
                                <p className="text-xs text-on-surface-variant dark:text-[#87b3cd] font-semibold">Geração imediata de documentos pedagógicos</p>
                            </div>
                        </div>

                        <form onSubmit={handleEmitDocument} className="space-y-5">
                            {/* Aluno Selection */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-[#003346]/70 dark:text-[#87b3cd] ml-1">Selecionar Aluno</label>
                                <select
                                    value={selectedStudent}
                                    onChange={(e) => setSelectedStudent(e.target.value)}
                                    className="w-full h-12 px-4 rounded-xl border border-outline-variant/20 bg-[#eff8ff] dark:bg-slate-950 text-on-surface dark:text-white outline-none focus:border-primary cursor-pointer text-sm"
                                    required
                                >
                                    <option value="">Selecione o estudante...</option>
                                    <option value="Amanda Ferreira">Amanda Ferreira</option>
                                    <option value="Ricardo Mendonça">Ricardo Mendonça</option>
                                    <option value="Gustavo Silva">Gustavo Silva</option>
                                    <option value="Lucas Costa">Lucas Costa</option>
                                    <option value="Beatriz Ramos">Beatriz Ramos</option>
                                </select>
                            </div>

                            {/* Document Type Selection */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-[#003346]/70 dark:text-[#87b3cd] ml-1">Tipo de Documento</label>
                                <select
                                    value={selectedDocType}
                                    onChange={(e) => setSelectedDocType(e.target.value)}
                                    className="w-full h-12 px-4 rounded-xl border border-outline-variant/20 bg-[#eff8ff] dark:bg-slate-950 text-on-surface dark:text-white outline-none focus:border-primary cursor-pointer text-sm"
                                    required
                                >
                                    <option value="">Selecione o documento...</option>
                                    <option value="Comprovante de Matrícula">Comprovante de Matrícula</option>
                                    <option value="Histórico Escolar">Histórico Escolar</option>
                                    <option value="Certificado de Conclusão">Certificado de Conclusão</option>
                                    <option value="Declaração de Vínculo">Declaração de Vínculo</option>
                                </select>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsDeclarationModalOpen(false)}
                                    className="flex-1 py-3 border border-outline-variant/20 dark:border-slate-800 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 text-[#003346] dark:text-[#87b3cd] transition-all rounded-xl text-center text-sm"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isEmitting}
                                    className="flex-1 py-3 bg-primary text-white font-bold rounded-xl hover:scale-[1.02] active:scale-95 transition-all text-sm shadow-md disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    {isEmitting ? (
                                        <>
                                            <span className="material-symbols-outlined animate-spin text-sm">sync</span>
                                            <span>Processando...</span>
                                        </>
                                    ) : (
                                        <span>Emitir Documento</span>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal: Relatório de Inatividade */}
            {isEvasionModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-[2rem] w-full max-w-xl p-8 border border-outline-variant/15 dark:border-slate-800 shadow-2xl relative animate-in scale-in duration-200">
                        <button
                            onClick={() => setIsEvasionModalOpen(false)}
                            className="absolute right-6 top-6 p-2 text-on-surface-variant hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                        
                        <div className="flex items-center gap-3 mb-6">
                            <span className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                                <span className="material-symbols-outlined text-2xl">history_toggle_off</span>
                            </span>
                            <div>
                                <h3 className="text-xl font-bold font-headline text-[#003346] dark:text-white">Alunos Sem Acesso Recente</h3>
                                <p className="text-xs text-on-surface-variant dark:text-[#87b3cd] font-semibold">Prevenção ativa de evasão escolar</p>
                            </div>
                        </div>

                        {/* List of inactive students */}
                        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                            {inactiveStudents.map((student, index) => (
                                <div key={index} className="flex justify-between items-center bg-[#eff8ff] dark:bg-slate-950 p-4 rounded-2xl border border-outline-variant/10 dark:border-slate-800/60">
                                    <div>
                                        <h4 className="font-bold text-[#003346] dark:text-white text-sm">{student.name}</h4>
                                        <p className="text-xs text-on-surface-variant dark:text-[#87b3cd]">{student.course} • <span className="text-error dark:text-red-400 font-bold">{student.lastAccess}</span></p>
                                    </div>
                                    <button
                                        onClick={() => handleActionNotify(student.name)}
                                        className="px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
                                    >
                                        <span className="material-symbols-outlined text-xs">notifications_active</span>
                                        <span>Notificar</span>
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Footer button */}
                        <div className="flex justify-end pt-6 mt-4 border-t border-outline-variant/10 dark:border-slate-800">
                            <button
                                onClick={() => setIsEvasionModalOpen(false)}
                                className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[#003346] dark:text-[#87b3cd] font-bold rounded-xl transition-all text-sm cursor-pointer"
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Kinetic Decorator Circles */}
            <div className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-gradient-to-br from-primary/5 to-transparent blur-3xl opacity-50 rounded-full pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -z-10 w-[300px] h-[300px] bg-gradient-to-tr from-secondary-fixed/10 to-transparent blur-2xl opacity-50 rounded-full pointer-events-none"></div>
        </Layout>
    );
}
