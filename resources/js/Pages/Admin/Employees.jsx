import AdminLayout from '@/Layouts/AdminLayout';
import SchoolAdminLayout from '@/Layouts/SchoolAdminLayout';
import { Head, usePage, Link } from '@inertiajs/react';
import { useState, useMemo } from 'react';

export default function Employees() {
    const { auth } = usePage().props;
    const user = auth.user;
    const isSchoolAdmin = user.role === 'school_admin';
    const Layout = isSchoolAdmin ? SchoolAdminLayout : AdminLayout;

    // Initial Employee state list
    const [employees, setEmployees] = useState([
        {
            id: '#EMP-2041',
            name: 'Ana Paula Mendes',
            email: 'ana.mendes@playup.edu',
            role: 'Coordenadora Pedagógica',
            department: 'Pedagógico',
            status: 'active',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSkTJUSsqSThMfTFUGrdoacMOyyweHQgcVlEhVr3ZSUwgmQj5jeLnUlOr5tGc6oUpaJcSECPwz-Vh_HikBH6t5b76dclKBg3EVfvgL3Fq-4pzspXguPc4P60NrsFUCKQFP2kMBz065o1FDZWprhqy4K5iKP2RDD44H6cUCtGwxbHtKJYu8R_mBeW0XO--dUHyRLu0364vSiGpg7l-nii6SlO5fOu9t77su3TJvFq6jIzRzlMTkVfPW-kSV9Hdmau0ip957PZNWcYpA',
        },
        {
            id: '#EMP-2042',
            name: 'Marcos Vinícius',
            email: 'marcos.v@playup.edu',
            role: 'Diretor Administrativo',
            department: 'Administrativo',
            status: 'active',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBy0lzUI-rAkaqUEGk5zCfZ-Q7IeAb7AW7XknWXRVQirMdBJnVL55UqR2zdSapVvI1JknknoYLwFzbuTCm9YtoEJJDwpm3NSxoP_IdKJZ2KmDtADuDi9qSUlRQNRK6tOqo2aYoJMQ_rYqxaHH3XqHtT7FCyvNraK_GOjQSs8Ns_58gkBn1bk9BtCxXvMHJEXEtqTJA5diGJGPxjRdrMpupMok96mBl4qGnTpMnSgIzQTiWvCezBTd0QocExI4Zzev-N0Lh_T3PkoOo3',
        },
        {
            id: '#EMP-2043',
            name: 'Beatriz Helena',
            email: 'beatriz.h@playup.edu',
            role: 'Gerente Financeira',
            department: 'Financeiro',
            status: 'inactive',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDg2riDjCnFM92klbnJDYT4xmprG5L9L0WvuuDW-ilNlbGlcTO3hu_ZqRFrkdMqWBpq2em65efSJMzp_t4_pyXJVosS5qJgPFia1f3TufemJG3t0rRViR2wKwFEfmSr3cPJFJmfs45ODzsMLjmEkosGEidN8OSSDHW3-RiCf1NGJO-brfsuw6WFtfvOvUduePLS_S12OAGb-5rH79Xjuo2Kw3qWxve9ITnylhzu18VSfTPCUTbi22J7MYRL1WBZTYILm8CJ3xEhbTfw',
        },
        {
            id: '#EMP-2044',
            name: 'Ricardo Gomes',
            email: 'ricardo.g@playup.edu',
            role: 'Professor Sênior',
            department: 'Pedagógico',
            status: 'active',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBlWL30v0xGB6lPjJ9QsCcnYYrJZU9JjNP67BFbcz5-_fzkXhT8HUzinFSlgVGjINUisiIp_O0J4EwtIQIBB-c7CITncmbv6ADaWZkJqf5afBD4BuvWXEPfpentdpG-TZmIIKI11ZHNXFHNcuU6UWGtKGwLEpmuWQIbZCVzM3tGk4YKCqx5E5iqDmlBSeOPhFiQKGuomSzVGj-szE7K2Fhih0wpP0LX2kFZ7TfKO9p5aww_nC9Oe1-eZneTOJEoVY8i7gf4ADff4AU6',
        }
    ]);

    // Live search and filter tab states
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('all'); // all, active, inactive
    const [notification, setNotification] = useState(null);

    // Toast triggers
    const triggerNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 4000);
    };

    // Filter logic
    const filteredEmployees = useMemo(() => {
        return employees.filter(emp => {
            const matchesSearch = 
                emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                emp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                emp.department.toLowerCase().includes(searchQuery.toLowerCase());
            
            const matchesTab = 
                activeTab === 'all' || 
                (activeTab === 'active' && emp.status === 'active') ||
                (activeTab === 'inactive' && emp.status === 'inactive');

            return matchesSearch && matchesTab;
        });
    }, [employees, searchQuery, activeTab]);

    return (
        <Layout>
            <Head title="Gestão de Funcionários | PlayUp Velocity" />

            <div className="p-8 space-y-8 animate-in fade-in duration-500 relative">
                
                {/* Toast Notification */}
                {notification && (
                    <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-xl shadow-xl flex items-center gap-3 animate-in slide-in-from-top duration-300 ${
                        notification.type === 'error' 
                            ? 'bg-error text-white shadow-error/20' 
                            : 'bg-primary text-white shadow-primary/20'
                    }`}>
                        <span className="material-symbols-outlined">
                            {notification.type === 'error' ? 'error' : 'check_circle'}
                        </span>
                        <span className="text-sm font-bold">{notification.message}</span>
                    </div>
                )}

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="space-y-1">
                        <h2 className="font-headline text-4xl font-extrabold text-on-surface dark:text-white tracking-tight leading-none">
                            Gestão de Funcionários
                        </h2>
                        <p className="text-on-surface-variant dark:text-outline-variant font-medium">
                            Visualize e gerencie a equipe interna da sua escola
                        </p>
                    </div>
                    <button 
                        onClick={() => triggerNotification('Formulário de cadastro em desenvolvimento!', 'info')}
                        className="group flex items-center gap-2 bg-gradient-to-br from-primary to-primary-dim text-white px-6 py-3.5 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.03] active:scale-95 transition-all"
                    >
                        <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>person_add</span> 
                        <span>NOVO</span>
                    </button>
                </div>

                {/* Stats cards grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-outline-variant/10 dark:border-slate-800 space-y-2 shadow-sm">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#87b3cd]">Total de Funcionários</p>
                        <div className="flex items-end gap-2">
                            <span className="text-3xl font-extrabold text-on-surface dark:text-white">142</span>
                            <span className="text-tertiary dark:text-emerald-400 font-bold text-sm mb-1 flex items-center">
                                <span className="material-symbols-outlined text-sm">trending_up</span>
                                +4%
                            </span>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-outline-variant/10 dark:border-slate-800 space-y-2 shadow-sm">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#87b3cd]">Ativos Agora</p>
                        <div className="flex items-end gap-2">
                            <span className="text-3xl font-extrabold text-on-surface dark:text-white">128</span>
                            <div className="w-2.5 h-2.5 rounded-full bg-tertiary dark:bg-emerald-400 animate-pulse mb-2.5 ml-1"></div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-outline-variant/10 dark:border-slate-800 space-y-2 shadow-sm">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#87b3cd]">Novas Contratações</p>
                        <div className="flex items-end gap-2">
                            <span className="text-3xl font-extrabold text-on-surface dark:text-white">06</span>
                            <span className="text-[#507c94] dark:text-[#87b3cd]/60 text-xs mb-1 font-semibold">Este mês</span>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-outline-variant/10 dark:border-slate-800 space-y-2 shadow-sm">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#87b3cd]">Taxa de Retenção</p>
                        <div className="flex items-end gap-2">
                            <span className="text-3xl font-extrabold text-on-surface dark:text-white">94%</span>
                            <span className="text-tertiary dark:text-emerald-400 font-bold text-sm mb-1">Estável</span>
                        </div>
                    </div>
                </div>

                {/* Table Container */}
                <div className="bg-white dark:bg-slate-900 rounded-[1.5rem] border border-outline-variant/15 dark:border-slate-800 shadow-sm overflow-hidden">
                    
                    {/* Header Controls (Search & Filter Tabs) */}
                    <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-outline-variant/10 dark:border-slate-800">
                        
                        {/* Search and Tabs */}
                        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                            
                            {/* Input Search */}
                            <div className="relative w-full sm:w-80">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                                <input 
                                    type="text"
                                    placeholder="Pesquisar funcionários..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-surface dark:bg-slate-950 border-none rounded-full py-2.5 pl-10 pr-4 text-sm text-on-surface dark:text-white focus:ring-2 focus:ring-primary outline-none"
                                />
                            </div>

                            {/* Filters Tab */}
                            <div className="flex items-center gap-2 bg-surface dark:bg-slate-950 p-1 rounded-full w-full sm:w-auto">
                                <button
                                    onClick={() => setActiveTab('all')}
                                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                                        activeTab === 'all' 
                                            ? 'bg-white dark:bg-slate-800 text-primary dark:text-[#00D1FF] shadow-sm' 
                                            : 'text-slate-500 hover:text-on-surface'
                                    }`}
                                >
                                    Todos <span className="bg-primary-container/20 px-1.5 py-0.5 rounded-full text-[10px] ml-1">{employees.length}</span>
                                </button>
                                <button
                                    onClick={() => setActiveTab('active')}
                                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                                        activeTab === 'active' 
                                            ? 'bg-white dark:bg-slate-800 text-primary dark:text-[#00D1FF] shadow-sm' 
                                            : 'text-slate-500 hover:text-on-surface'
                                    }`}
                                >
                                    Ativos
                                </button>
                                <button
                                    onClick={() => setActiveTab('inactive')}
                                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                                        activeTab === 'inactive' 
                                            ? 'bg-white dark:bg-slate-800 text-primary dark:text-[#00D1FF] shadow-sm' 
                                            : 'text-slate-500 hover:text-on-surface'
                                    }`}
                                >
                                    Inativos
                                </button>
                            </div>
                        </div>

                        {/* Export & Filters Quick Buttons */}
                        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                            <button 
                                onClick={() => triggerNotification('Abertura de painel de filtros...', 'info')}
                                className="flex items-center gap-2 text-slate-500 hover:text-on-surface dark:hover:text-white px-4 py-2 text-xs font-bold transition-colors"
                            >
                                <span className="material-symbols-outlined text-lg">filter_list</span>
                                <span>Filtrar</span>
                            </button>
                            <button 
                                onClick={() => triggerNotification('Exportando relatório de funcionários...', 'info')}
                                className="flex items-center gap-2 text-slate-500 hover:text-on-surface dark:hover:text-white px-4 py-2 text-xs font-bold transition-colors"
                            >
                                <span className="material-symbols-outlined text-lg">file_download</span>
                                <span>Exportar</span>
                            </button>
                        </div>
                    </div>

                    {/* Table View */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-separate border-spacing-0">
                            <thead>
                                <tr className="bg-surface-container-low/20 dark:bg-slate-950/40">
                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 dark:text-[#87b3cd] uppercase tracking-widest border-b border-outline-variant/10 dark:border-slate-800">ID</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 dark:text-[#87b3cd] uppercase tracking-widest border-b border-outline-variant/10 dark:border-slate-800">Nome do Funcionário</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 dark:text-[#87b3cd] uppercase tracking-widest border-b border-outline-variant/10 dark:border-slate-800">Cargo/Função</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 dark:text-[#87b3cd] uppercase tracking-widest border-b border-outline-variant/10 dark:border-slate-800">Grupo/Departamento</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 dark:text-[#87b3cd] uppercase tracking-widest border-b border-outline-variant/10 dark:border-slate-800">Status</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 dark:text-[#87b3cd] uppercase tracking-widest border-b border-outline-variant/10 dark:border-slate-800 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant/10 dark:divide-slate-800">
                                {filteredEmployees.length > 0 ? (
                                    filteredEmployees.map((emp) => (
                                        <tr 
                                            key={emp.id}
                                            className="hover:bg-surface-container-low/20 dark:hover:bg-slate-800/20 hover:translate-x-1 transition-all group"
                                        >
                                            <td className="px-6 py-5 text-sm font-bold text-slate-400">{emp.id}</td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full border border-primary-container/20 overflow-hidden flex-shrink-0">
                                                        <img src={emp.avatar} alt={emp.name} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-on-surface dark:text-white leading-tight">{emp.name}</p>
                                                        <p className="text-[10px] text-slate-400 font-medium">{emp.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-sm font-bold text-on-surface dark:text-slate-200">{emp.role}</td>
                                            <td className="px-6 py-5">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                                                    emp.department === 'Pedagógico'
                                                        ? 'bg-secondary-container text-on-secondary-container'
                                                        : emp.department === 'Administrativo'
                                                        ? 'bg-surface-container-high text-on-surface dark:bg-slate-800 dark:text-slate-200'
                                                        : 'bg-primary-container text-on-primary-container'
                                                }`}>
                                                    {emp.department}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                {emp.status === 'active' ? (
                                                    <div className="flex items-center gap-1.5 text-tertiary dark:text-emerald-400 text-xs font-bold">
                                                        <span className="w-2 h-2 rounded-full bg-tertiary dark:bg-emerald-400"></span>
                                                        <span>Ativo</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold">
                                                        <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                                                        <span>Inativo</span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button 
                                                        onClick={() => triggerNotification(`Editar funcionário ${emp.name}...`, 'info')}
                                                        className="p-2 hover:bg-surface-container-high dark:hover:bg-slate-800 rounded-lg text-slate-500 hover:text-primary transition-all"
                                                        title="Editar Funcionário"
                                                    >
                                                        <span className="material-symbols-outlined text-sm">edit</span>
                                                    </button>
                                                    <button 
                                                        onClick={() => triggerNotification(`Excluir funcionário ${emp.name}...`, 'error')}
                                                        className="p-2 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg text-slate-500 hover:text-error transition-all"
                                                        title="Desativar/Excluir"
                                                    >
                                                        <span className="material-symbols-outlined text-sm">delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-sm font-semibold text-slate-400">
                                            Nenhum funcionário encontrado.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Table Footer / Pagination */}
                    <div className="p-6 flex items-center justify-between bg-surface-container-low/10 border-t border-outline-variant/10 dark:border-slate-850">
                        <p className="text-xs text-[#507c94] dark:text-[#87b3cd]/80 font-bold uppercase tracking-wider">
                            Mostrando 1-{filteredEmployees.length} de 142 funcionários
                        </p>
                        <div className="flex items-center gap-2">
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant/30 text-slate-400 hover:bg-surface-container-high transition-colors">
                                <span className="material-symbols-outlined text-sm">chevron_left</span>
                            </button>
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-white font-bold text-xs">1</button>
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-high text-slate-400 font-medium text-xs transition-colors">2</button>
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-high text-slate-400 font-medium text-xs transition-colors">3</button>
                            <span className="text-slate-300 dark:text-slate-700 px-1 text-xs">...</span>
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-high text-slate-400 font-medium text-xs transition-colors">36</button>
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant/30 text-slate-400 hover:bg-surface-container-high transition-colors">
                                <span className="material-symbols-outlined text-sm">chevron_right</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bento Widgets for Insights */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* MVP highlight */}
                    <div className="bg-primary/5 dark:bg-slate-900 rounded-[1.5rem] p-6 relative overflow-hidden group border border-outline-variant/10 dark:border-slate-800">
                        <div className="relative z-10 space-y-4">
                            <h3 className="font-headline text-lg font-bold text-primary dark:text-[#00D1FF] flex items-center gap-2">
                                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                <span>Destaque do Mês</span>
                            </h3>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full border-2 border-primary overflow-hidden">
                                    <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSkTJUSsqSThMfTFUGrdoacMOyyweHQgcVlEhVr3ZSUwgmQj5jeLnUlOr5tGc6oUpaJcSECPwz-Vh_HikBH6t5b76dclKBg3EVfvgL3Fq-4pzspXguPc4P60NrsFUCKQFP2kMBz065o1FDZWprhqy4K5iKP2RDD44H6cUCtGwxbHtKJYu8R_mBeW0XO--dUHyRLu0364vSiGpg7l-nii6SlO5fOu9t77su3TJvFq6jIzRzlMTkVfPW-kSV9Hdmau0ip957PZNWcYpA" alt="MVP avatar" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-on-surface dark:text-white leading-tight">Ana Paula Mendes</p>
                                    <p className="text-xs text-slate-400 font-semibold">Excelência Pedagógica</p>
                                </div>
                            </div>
                        </div>
                        <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-[7rem] text-primary/10 group-hover:scale-110 transition-transform duration-500" style={{ fontVariationSettings: "'FILL' 1" }}>emoji_events</span>
                    </div>

                    {/* Announcement card */}
                    <div className="md:col-span-2 bg-white dark:bg-slate-900 rounded-[1.5rem] p-6 flex flex-col sm:flex-row sm:items-center justify-between border border-outline-variant/10 dark:border-slate-800 gap-4">
                        <div className="space-y-2">
                            <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Aviso Administrativo</p>
                            <h3 className="font-display text-xl font-extrabold text-on-surface dark:text-white leading-none">Atualização de Cadastro 2024</h3>
                            <p className="text-sm text-slate-400 leading-normal font-medium">Lembre de solicitar o comprovante de residência atualizado para toda a equipe administrativa até o próximo dia 15.</p>
                        </div>
                        <div className="flex-shrink-0">
                            <button 
                                onClick={() => triggerNotification('Lembrete administrativo disparado para a equipe!', 'success')}
                                className="bg-[#eff8ff] dark:bg-slate-850 hover:bg-primary dark:hover:bg-primary hover:text-white text-primary dark:text-[#00D1FF] font-bold text-xs px-6 py-3.5 rounded-full transition-all border border-primary/10 shadow-sm"
                            >
                                Enviar Lembrete
                            </button>
                        </div>
                    </div>

                </div>

                {/* Decorative background circle */}
                <div className="fixed -bottom-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
            </div>
        </Layout>
    );
}
