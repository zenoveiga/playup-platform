import AdminLayout from '@/Layouts/AdminLayout';
import SchoolAdminLayout from '@/Layouts/SchoolAdminLayout';
import { Head, usePage, Link } from '@inertiajs/react';
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

            <div className="max-w-7xl mx-auto p-8 space-y-10 animate-in fade-in duration-700 relative">
                {/* Notification toast */}
                {notification && (
                    <div className="fixed top-20 right-8 z-50 flex items-center gap-2 px-6 py-4 rounded-xl bg-tertiary-container dark:bg-emerald-950 text-[#006a35] dark:text-[#6bfe9c] border border-tertiary/20 shadow-xl animate-in slide-in-from-top-4 duration-300">
                        <span className="material-symbols-outlined text-lg">check_circle</span>
                        <span className="text-sm font-bold">{notification.message}</span>
                    </div>
                )}

                {/* Header Title */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                    <div className="space-y-1">
                        <h1 className="text-[#003346] dark:text-white font-extrabold text-3xl font-headline tracking-tight">Gestão Pedagógica</h1>
                        <p className="text-on-surface-variant dark:text-outline-variant font-medium">Agrupamento por Contexto de Trabalho</p>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <button 
                            onClick={() => showNotification("Funcionalidade de Novo Registro em desenvolvimento!", "info")}
                            className="w-full sm:w-auto bg-[#00D1FF] hover:bg-sky-400 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-sky-400/10 active:scale-95"
                        >
                            <span className="material-symbols-outlined text-lg">add</span> 
                            <span>Novo Registro</span>
                        </button>
                    </div>
                </div>

                {/* Metric Cards (Top Row) */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-outline-variant/10 dark:border-slate-800 shadow-sm text-center flex flex-col justify-between">
                        <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/40 text-primary flex items-center justify-center mx-auto mb-2">
                            <span className="material-symbols-outlined">groups</span>
                        </div>
                        <p className="text-[10px] text-on-surface-variant dark:text-outline-variant font-bold uppercase tracking-wider">Alunos ativos</p>
                        <p className="text-2xl font-bold font-headline text-[#003346] dark:text-white py-1">248</p>
                        <Link 
                            href={route(isSchoolAdmin ? 'school-admin.students.index' : 'admin.students.index')} 
                            className="text-[10px] text-primary dark:text-[#00D1FF] font-bold hover:underline"
                        >
                            Ver todos
                        </Link>
                    </div>
                    
                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-outline-variant/10 dark:border-slate-800 shadow-sm text-center flex flex-col justify-between">
                        <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto mb-2">
                            <span className="material-symbols-outlined">school</span>
                        </div>
                        <p className="text-[10px] text-on-surface-variant dark:text-outline-variant font-bold uppercase tracking-wider">Turmas</p>
                        <p className="text-2xl font-bold font-headline text-[#003346] dark:text-white py-1">18</p>
                        <Link 
                            href={route(isSchoolAdmin ? 'school-admin.classes.index' : 'admin.classes.index')} 
                            className="text-[10px] text-primary dark:text-[#00D1FF] font-bold hover:underline"
                        >
                            Ver todas
                        </Link>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-outline-variant/10 dark:border-slate-800 shadow-sm text-center flex flex-col justify-between">
                        <div className="w-10 h-10 rounded-full bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 flex items-center justify-center mx-auto mb-2">
                            <span className="material-symbols-outlined">assignment_turned_in</span>
                        </div>
                        <p className="text-[10px] text-on-surface-variant dark:text-outline-variant font-bold uppercase tracking-wider">Avaliações</p>
                        <p className="text-2xl font-bold font-headline text-[#003346] dark:text-white py-1">32</p>
                        <button 
                            onClick={() => showNotification("Exibindo avaliações...")}
                            className="text-[10px] text-primary dark:text-[#00D1FF] font-bold hover:underline cursor-pointer"
                        >
                            Ver todas
                        </button>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-outline-variant/10 dark:border-slate-800 shadow-sm text-center flex flex-col justify-between">
                        <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-emerald-950/40 text-green-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-2">
                            <span className="material-symbols-outlined">trending_up</span>
                        </div>
                        <p className="text-[10px] text-on-surface-variant dark:text-outline-variant font-bold uppercase tracking-wider">Média geral</p>
                        <p className="text-2xl font-bold font-headline text-[#003346] dark:text-white py-1">8,4</p>
                        <button 
                            onClick={() => showNotification("Gerando relatório de desempenho...")}
                            className="text-[10px] text-primary dark:text-[#00D1FF] font-bold hover:underline cursor-pointer"
                        >
                            Ver relatório
                        </button>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-outline-variant/10 dark:border-slate-800 shadow-sm text-center flex flex-col justify-between">
                        <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-955/40 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto mb-2">
                            <span className="material-symbols-outlined">analytics</span>
                        </div>
                        <p className="text-[10px] text-on-surface-variant dark:text-outline-variant font-bold uppercase tracking-wider">Presença média</p>
                        <p className="text-2xl font-bold font-headline text-[#003346] dark:text-white py-1">92%</p>
                        <button 
                            onClick={() => showNotification("Gerando relatório de presença...")}
                            className="text-[10px] text-primary dark:text-[#00D1FF] font-bold hover:underline cursor-pointer"
                        >
                            Ver relatório
                        </button>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-outline-variant/10 dark:border-slate-800 shadow-sm text-center flex flex-col justify-between">
                        <div className="w-10 h-10 rounded-full bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 flex items-center justify-center mx-auto mb-2">
                            <span className="material-symbols-outlined">notifications</span>
                        </div>
                        <p className="text-[10px] text-on-surface-variant dark:text-outline-variant font-bold uppercase tracking-wider">Comunicados</p>
                        <p className="text-2xl font-bold font-headline text-[#003346] dark:text-white py-1">7</p>
                        <button 
                            onClick={() => showNotification("Exibindo todos os comunicados...")}
                            className="text-[10px] text-primary dark:text-[#00D1FF] font-bold hover:underline cursor-pointer"
                        >
                            Ver todos
                        </button>
                    </div>
                </div>

                {/* Work Context Grouping */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Group 1: Relatórios */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-6 bg-[#00D1FF] rounded-full"></div>
                            <h2 className="text-on-surface dark:text-white font-bold text-lg font-headline uppercase tracking-wide text-sm">Relatórios</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <button 
                                onClick={() => setIsEvasionModalOpen(true)}
                                className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-outline-variant/10 dark:border-slate-800 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-center flex flex-col items-center gap-3 group cursor-pointer"
                            >
                                <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-2xl">show_chart</span>
                                </div>
                                <p className="font-bold text-[10px] text-on-surface dark:text-white leading-tight">Relatório de inatividade</p>
                            </button>
                            
                            <button 
                                onClick={() => showNotification("Abrindo Relatório Curso/Aluno...")}
                                className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-outline-variant/10 dark:border-slate-800 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-center flex flex-col items-center gap-3 group cursor-pointer"
                            >
                                <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-2xl">school</span>
                                </div>
                                <p className="font-bold text-[10px] text-on-surface dark:text-white leading-tight">Relatório curso/aluno</p>
                            </button>

                            <button 
                                onClick={() => showNotification("Fazendo download do Boletim Geral...")}
                                className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-outline-variant/10 dark:border-slate-800 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-center flex flex-col items-center gap-3 group cursor-pointer"
                            >
                                <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-955/40 text-red-600 dark:text-red-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-2xl">content_paste</span>
                                </div>
                                <p className="font-bold text-[10px] text-on-surface dark:text-white leading-tight">Boletim</p>
                            </button>
                        </div>
                    </section>

                    {/* Group 2: Avaliações & Notas */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-6 bg-[#00D1FF] rounded-full"></div>
                            <h2 className="text-on-surface dark:text-white font-bold text-lg font-headline uppercase tracking-wide text-sm">Avaliações &amp; Notas</h2>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <button 
                                onClick={() => showNotification("Visualizando notas...")}
                                className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-outline-variant/10 dark:border-slate-800 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-center flex flex-col items-center gap-3 group cursor-pointer"
                            >
                                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-955/40 text-primary dark:text-[#00D1FF] flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                                    <span className="material-symbols-outlined text-xl">bar_chart</span>
                                </div>
                                <p className="font-bold text-[10px] text-on-surface dark:text-white leading-tight">Ver notas</p>
                            </button>

                            <button 
                                onClick={() => showNotification("Abrindo painel de Lançamento de notas EAD...")}
                                className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-outline-variant/10 dark:border-slate-800 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-center flex flex-col items-center gap-3 group cursor-pointer"
                            >
                                <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-all">
                                    <span className="material-symbols-outlined text-xl">format_list_numbered</span>
                                </div>
                                <div className="flex flex-col">
                                    <p className="font-bold text-[10px] text-on-surface dark:text-white leading-tight">Lançar notas</p>
                                    <p className="text-[8px] text-on-surface-variant dark:text-outline-variant font-bold">(Notas EAD)</p>
                                </div>
                            </button>

                            <button 
                                onClick={() => showNotification("Exibindo gabaritos das provas...")}
                                className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-outline-variant/10 dark:border-slate-800 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-center flex flex-col items-center gap-3 group cursor-pointer"
                            >
                                <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-955/40 text-orange-600 dark:text-orange-400 flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-all">
                                    <span className="material-symbols-outlined text-xl">help_center</span>
                                </div>
                                <p className="font-bold text-[10px] text-on-surface dark:text-white leading-tight">Gabaritos das provas</p>
                            </button>

                            <button 
                                onClick={() => showNotification("Visualizando listagem de provas...")}
                                className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-outline-variant/10 dark:border-slate-800 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-center flex flex-col items-center gap-3 group cursor-pointer"
                            >
                                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-all">
                                    <span className="material-symbols-outlined text-xl">assignment</span>
                                </div>
                                <p className="font-bold text-[10px] text-on-surface dark:text-white leading-tight">Provas</p>
                            </button>
                        </div>
                    </section>

                    {/* Group 3: Presença & Salas */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-6 bg-[#00D1FF] rounded-full"></div>
                            <h2 className="text-on-surface dark:text-white font-bold text-lg font-headline uppercase tracking-wide text-sm">Presença &amp; Salas</h2>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <button 
                                onClick={() => showNotification("Exibindo lista de presença...")}
                                className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-outline-variant/10 dark:border-slate-800 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-center flex flex-col items-center gap-3 group cursor-pointer"
                            >
                                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-xl">list_alt</span>
                                </div>
                                <p className="font-bold text-[10px] text-on-surface dark:text-white leading-tight">Lista de presença</p>
                            </button>

                            <button 
                                onClick={() => showNotification("Carregando painel de marcar presença rápida...")}
                                className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-outline-variant/10 dark:border-slate-800 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-center flex flex-col items-center gap-3 group cursor-pointer"
                            >
                                <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-emerald-955/40 text-green-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-xl">back_hand</span>
                                </div>
                                <p className="font-bold text-[10px] text-on-surface dark:text-white leading-tight">Marcar presença</p>
                            </button>

                            <button 
                                onClick={() => showNotification("Acessando registro de presença geral...")}
                                className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-outline-variant/10 dark:border-slate-800 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-center flex flex-col items-center gap-3 group cursor-pointer"
                            >
                                <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-xl">how_to_reg</span>
                                </div>
                                <p className="font-bold text-[10px] text-on-surface dark:text-white leading-tight">Registro de presença</p>
                            </button>

                            <button 
                                onClick={() => showNotification("Abrindo painel das salas de aula ao vivo...")}
                                className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-outline-variant/10 dark:border-slate-800 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-center flex flex-col items-center gap-3 group cursor-pointer"
                            >
                                <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-955/40 text-rose-600 dark:text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-xl">video_call</span>
                                </div>
                                <div className="flex flex-col">
                                    <p className="font-bold text-[10px] text-on-surface dark:text-white leading-tight">Salas de aula</p>
                                    <p className="text-[8px] text-on-surface-variant dark:text-outline-variant font-bold">(Sala ao vivo)</p>
                                </div>
                            </button>
                        </div>
                    </section>

                    {/* Group 4: Comunicação & Certificados */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-6 bg-[#00D1FF] rounded-full"></div>
                            <h2 className="text-on-surface dark:text-white font-bold text-lg font-headline uppercase tracking-wide text-sm">Comunicação &amp; Certificados</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <button 
                                onClick={() => showNotification("Carregando painel de envio de comunicado geral...")}
                                className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-outline-variant/10 dark:border-slate-800 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-center flex flex-col items-center gap-3 group cursor-pointer"
                            >
                                <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-955/40 text-orange-600 dark:text-orange-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-2xl">send</span>
                                </div>
                                <div className="flex flex-col">
                                    <p className="font-bold text-[10px] text-on-surface dark:text-white leading-tight">Mensagem para todos</p>
                                    <p className="text-[8px] text-on-surface-variant dark:text-outline-variant font-bold">(Enviar comunicado)</p>
                                </div>
                            </button>

                            <button 
                                onClick={() => {
                                    setSelectedDocType("Certificado de Conclusão");
                                    setIsDeclarationModalOpen(true);
                                }}
                                className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-outline-variant/10 dark:border-slate-800 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-center flex flex-col items-center gap-3 group cursor-pointer"
                            >
                                <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-955/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-2xl">verified</span>
                                </div>
                                <p className="font-bold text-[10px] text-on-surface dark:text-white leading-tight">Emitir certificado</p>
                            </button>

                            <button 
                                onClick={() => setIsDeclarationModalOpen(true)}
                                className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-outline-variant/10 dark:border-slate-800 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-center flex flex-col items-center gap-3 group cursor-pointer"
                            >
                                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-955/40 text-primary dark:text-[#00D1FF] flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-2xl">description</span>
                                </div>
                                <p className="font-bold text-[10px] text-on-surface dark:text-white leading-tight">Emitir declaração</p>
                            </button>
                        </div>
                    </section>
                </div>

                {/* Data Tables / Lists Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-10">
                    {/* Turmas em andamento */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-outline-variant/10 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-outline-variant/5 dark:border-slate-800 flex items-center justify-between">
                            <h2 className="text-on-surface dark:text-white font-bold text-lg font-headline">Turmas em andamento</h2>
                            <Link 
                                href={route(isSchoolAdmin ? 'school-admin.classes.index' : 'admin.classes.index')} 
                                className="text-xs text-primary dark:text-[#00D1FF] font-bold hover:underline"
                            >
                                Ver todas
                            </Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-surface-container-low/30 dark:bg-slate-950/40">
                                    <tr>
                                        <th className="px-6 py-4 text-[10px] text-[#003346] dark:text-white font-bold uppercase">Turma</th>
                                        <th className="px-6 py-4 text-[10px] text-[#003346] dark:text-white font-bold uppercase">Disciplina</th>
                                        <th className="px-6 py-4 text-[10px] text-[#003346] dark:text-white font-bold uppercase">Alunos</th>
                                        <th className="px-6 py-4 text-[10px] text-[#003346] dark:text-white font-bold uppercase text-right">Média</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-outline-variant/5 dark:divide-slate-800">
                                    <tr className="hover:bg-surface-container-low/20 dark:hover:bg-slate-800/20 transition-colors">
                                        <td className="px-6 py-4 text-xs font-bold text-[#003346] dark:text-white">9º ano A</td>
                                        <td className="px-6 py-4 text-xs text-on-surface-variant dark:text-outline-variant">Língua Portuguesa</td>
                                        <td className="px-6 py-4 text-xs text-on-surface-variant dark:text-outline-variant">28</td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="px-3 py-1 bg-green-100 dark:bg-emerald-950 text-green-700 dark:text-emerald-400 text-[10px] font-bold rounded-full">8,7</span>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-surface-container-low/20 dark:hover:bg-slate-800/20 transition-colors">
                                        <td className="px-6 py-4 text-xs font-bold text-[#003346] dark:text-white">8º ano B</td>
                                        <td className="px-6 py-4 text-xs text-on-surface-variant dark:text-outline-variant">Matemática</td>
                                        <td className="px-6 py-4 text-xs text-on-surface-variant dark:text-outline-variant">25</td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="px-3 py-1 bg-green-100 dark:bg-emerald-950 text-green-700 dark:text-emerald-400 text-[10px] font-bold rounded-full">8,1</span>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-surface-container-low/20 dark:hover:bg-slate-800/20 transition-colors">
                                        <td className="px-6 py-4 text-xs font-bold text-[#003346] dark:text-white">7º ano A</td>
                                        <td className="px-6 py-4 text-xs text-on-surface-variant dark:text-outline-variant">Ciências</td>
                                        <td className="px-6 py-4 text-xs text-on-surface-variant dark:text-outline-variant">24</td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="px-3 py-1 bg-green-100 dark:bg-emerald-950 text-green-700 dark:text-emerald-400 text-[10px] font-bold rounded-full">8,5</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Avaliações recentes */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-outline-variant/10 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-outline-variant/5 dark:border-slate-800 flex items-center justify-between">
                            <h2 className="text-on-surface dark:text-white font-bold text-lg font-headline">Avaliações recentes</h2>
                            <button 
                                onClick={() => showNotification("Exibindo histórico de avaliações...")}
                                className="text-xs text-primary dark:text-[#00D1FF] font-bold hover:underline cursor-pointer"
                            >
                                Ver histórico
                            </button>
                        </div>
                        <div className="p-0 flex-1 divide-y divide-outline-variant/5 dark:divide-slate-800">
                            <div className="p-5 flex items-center justify-between hover:bg-surface-container-low/20 dark:hover:bg-slate-800/20 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-955/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                                        <span className="material-symbols-outlined">book</span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-on-surface dark:text-white">Prova Bimestral</p>
                                        <p className="text-[10px] text-on-surface-variant dark:text-outline-variant">Língua Portuguesa • 9º ano A</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-on-surface-variant dark:text-outline-variant">20/05</p>
                                    <span className="text-green-600 dark:text-emerald-400 font-bold text-sm">8,7</span>
                                </div>
                            </div>
                            <div className="p-5 flex items-center justify-between hover:bg-surface-container-low/20 dark:hover:bg-slate-800/20 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                                        <span className="material-symbols-outlined">grid_view</span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-on-surface dark:text-white">Prova de Matemática</p>
                                        <p className="text-[10px] text-on-surface-variant dark:text-outline-variant">Matemática • 8º ano B</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-on-surface-variant dark:text-outline-variant">18/05</p>
                                    <span className="text-green-600 dark:text-emerald-400 font-bold text-sm">8,1</span>
                                </div>
                            </div>
                            <div className="p-5 flex items-center justify-between hover:bg-surface-container-low/20 dark:hover:bg-slate-800/20 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                                        <span className="material-symbols-outlined">science</span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-on-surface dark:text-white">Avaliação de Ciências</p>
                                        <p className="text-[10px] text-on-surface-variant dark:text-outline-variant">Ciências • 7º ano A</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-on-surface-variant dark:text-outline-variant">17/05</p>
                                    <span className="text-green-600 dark:text-emerald-400 font-bold text-sm">8,5</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Action Button for Support */}
            <button 
                onClick={() => showNotification("Redirecionando para o chat de suporte pedagógico...")}
                className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 cursor-pointer"
            >
                <span className="material-symbols-outlined text-3xl">support_agent</span>
            </button>

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
