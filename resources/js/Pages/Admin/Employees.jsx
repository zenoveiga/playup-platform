import AdminLayout from '@/Layouts/AdminLayout';
import SchoolAdminLayout from '@/Layouts/SchoolAdminLayout';
import { Head, usePage, Link } from '@inertiajs/react';
import { useState, useMemo } from 'react';

export default function Employees() {
    const { auth } = usePage().props;
    const user = auth.user;
    const isSchoolAdmin = user.role === 'school_admin';
    const Layout = isSchoolAdmin ? SchoolAdminLayout : AdminLayout;

    // Initial Employee state list with new mockup fields (phone, city, polo)
    const [employees, setEmployees] = useState([
        {
            id: '#EMP-2041',
            name: 'Ana Paula Mendes',
            email: 'ana.mendes@playup.edu',
            phone: '(11) 98765-4321',
            city: 'São Paulo',
            polo: 'Polo Central',
            role: 'Coordenadora Pedagógica',
            department: 'Pedagógico',
            status: 'active',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSkTJUSsqSThMfTFUGrdoacMOyyweHQgcVlEhVr3ZSUwgmQj5jeLnUlOr5tGc6oUpaJcSECPwz-Vh_HikBH6t5b76dclKBg3EVfvgL3Fq-4pzspXguPc4P60NrsFUCKQFP2kMBz065o1FDZWprhqy4K5iKP2RDD44H6cUCtGwxbHtKJYu8R_mBeW0XO--dUHyRLu0364vSiGpg7l-nii6SlO5fOu9t77su3TJvFq6jIzRzlMTkVfPW-kSV9Hdmau0ip957PZNWcYpA',
        },
        {
            id: '#EMP-2042',
            name: 'Marcos Vinícius',
            email: 'marcos.v@playup.edu',
            phone: '(21) 99888-7766',
            city: 'Rio de Janeiro',
            polo: 'Polo Sul',
            role: 'Diretor Administrativo',
            department: 'Administrativo',
            status: 'active',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBy0lzUI-rAkaqUEGk5zCfZ-Q7IeAb7AW7XknWXRVQirMdBJnVL55UqR2zdSapVvI1JknknoYLwFzbuTCm9YtoEJJDwpm3NSxoP_IdKJZ2KmDtADuDi9qSUlRQNRK6tOqo2aYoJMQ_rYqxaHH3XqHtT7FCyvNraK_GOjQSs8Ns_58gkBn1bk9BtCxXvMHJEXEtqTJA5diGJGPxjRdrMpupMok96mBl4qGnTpMnSgIzQTiWvCezBTd0QocExI4Zzev-N0Lh_T3PkoOo3',
        },
        {
            id: '#EMP-2043',
            name: 'Beatriz Helena',
            email: 'beatriz.h@playup.edu',
            phone: '(31) 99922-3344',
            city: 'Belo Horizonte',
            polo: 'Polo Minas',
            role: 'Gerente Financeira',
            department: 'Financeiro',
            status: 'inactive',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDg2riDjCnFM92klbnJDYT4xmprG5L9L0WvuuDW-ilNlbGlcTO3hu_ZqRFrkdMqWBpq2em65efSJMzp_t4_pyXJVosS5qJgPFia1f3TufemJG3t0rRViR2wKwFEfmSr3cPJFJmfs45ODzsMLjmEkosGEidN8OSSDHW3-RiCf1NGJO-brfsuw6WFtfvOvUduePLS_S12OAGb-5rH79Xjuo2Kw3qWxve9ITnylhzu18VSfTPCUTbi22J7MYRL1WBZTYILm8CJ3xEhbTfw',
        },
        {
            id: '#EMP-2044',
            name: 'Ricardo Gomes',
            email: 'ricardo.g@playup.edu',
            phone: '(41) 98877-6655',
            city: 'Curitiba',
            polo: 'Polo Sul',
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
        setTimeout(() => setNotification(null), 3500);
    };

    // Filter logic
    const filteredEmployees = useMemo(() => {
        return employees.filter(emp => {
            const matchesSearch = 
                emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                emp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                emp.polo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                emp.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                emp.phone.includes(searchQuery);
            
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
                    <div className={`fixed top-20 right-8 z-50 px-6 py-4 rounded-xl shadow-xl flex items-center gap-3 animate-in slide-in-from-top-4 duration-300 ${
                        notification.type === 'error' 
                            ? 'bg-rose-50 dark:bg-rose-955 text-[#b31b25] border border-rose-200 dark:border-rose-900/50' 
                            : 'bg-emerald-50 dark:bg-emerald-955 text-[#006a35] dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/50'
                    }`}>
                        <span className="material-symbols-outlined text-lg">
                            {notification.type === 'error' ? 'error' : 'check_circle'}
                        </span>
                        <span className="text-sm font-bold">{notification.message}</span>
                    </div>
                )}

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="space-y-1">
                        <h2 className="font-display text-4xl font-extrabold text-on-surface dark:text-white tracking-tight leading-none">
                            Gestão de Funcionários
                        </h2>
                        <p className="text-on-surface-variant dark:text-outline-variant font-medium">
                            Visualize e gerencie a equipe interna da sua escola
                        </p>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <button 
                            onClick={() => triggerNotification('Visualizando quadro de funções administrativas...', 'info')}
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-surface-container-high dark:bg-slate-800 text-primary dark:text-[#00D1FF] px-6 py-3.5 rounded-xl font-bold hover:bg-primary hover:text-white dark:hover:bg-primary transition-all cursor-pointer border border-primary/5 shadow-sm"
                        >
                            <span className="material-symbols-outlined text-lg">account_tree</span>
                            <span>Quadro de funções</span>
                        </button>
                        <button 
                            onClick={() => triggerNotification('Formulário de cadastro de novo funcionário em desenvolvimento!', 'info')}
                            className="flex-1 md:flex-none group flex items-center justify-center gap-2 bg-gradient-to-br from-primary to-primary-container text-white px-6 py-3.5 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-102 active:scale-95 transition-all cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-lg">person_add</span> 
                            <span>Novo funcionário</span>
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-outline-variant/10 dark:border-slate-800 space-y-2 shadow-sm">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#87b3cd]">Total de Funcionários</p>
                        <div className="flex items-end gap-2">
                            <span className="text-3xl font-extrabold text-on-surface dark:text-white">142</span>
                            <span className="text-tertiary dark:text-[#5bef90] font-bold text-sm mb-1 flex items-center">
                                <span className="material-symbols-outlined text-sm">trending_up</span>
                                <span>+4%</span>
                            </span>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-outline-variant/10 dark:border-slate-800 space-y-2 shadow-sm">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#87b3cd]">Ativos Agora</p>
                        <div className="flex items-end gap-2">
                            <span className="text-3xl font-extrabold text-on-surface dark:text-white">128</span>
                            <div className="w-2.5 h-2.5 rounded-full bg-tertiary dark:bg-[#5bef90] animate-pulse mb-2.5 ml-1"></div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-outline-variant/10 dark:border-slate-800 space-y-2 shadow-sm">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#87b3cd]">Novas Contratações</p>
                        <div className="flex items-end gap-2">
                            <span className="text-3xl font-extrabold text-on-surface dark:text-white">06</span>
                            <span className="text-on-surface-variant/60 dark:text-outline-variant/60 text-xs mb-1 font-semibold">Este mês</span>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-outline-variant/10 dark:border-slate-800 space-y-2 shadow-sm">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#87b3cd]">Taxa de Retenção</p>
                        <div className="flex items-end gap-2">
                            <span className="text-3xl font-extrabold text-on-surface dark:text-white">94%</span>
                            <span className="text-tertiary dark:text-[#5bef90] font-bold text-sm mb-1">Estável</span>
                        </div>
                    </div>
                </div>

                {/* Table Container */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-outline-variant/15 dark:border-slate-800 shadow-sm overflow-hidden">
                    
                    {/* Table Filters */}
                    <div className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-outline-variant/10 dark:border-slate-800">
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                            <div 
                                onClick={() => setActiveTab('all')}
                                className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 cursor-pointer transition-all ${
                                    activeTab === 'all' 
                                        ? 'bg-surface-container-low dark:bg-slate-800 text-primary dark:text-[#00D1FF]' 
                                        : 'text-on-surface-variant dark:text-outline-variant hover:bg-surface-container-low/50'
                                }`}
                            >
                                <span>Todos</span> 
                                <span className="bg-primary/10 dark:bg-sky-500/20 px-2 rounded-full text-xs">{employees.length}</span>
                            </div>
                            <div 
                                onClick={() => setActiveTab('active')}
                                className={`px-4 py-2 rounded-full text-sm font-bold cursor-pointer transition-all ${
                                    activeTab === 'active' 
                                        ? 'bg-surface-container-low dark:bg-slate-800 text-primary dark:text-[#00D1FF]' 
                                        : 'text-on-surface-variant dark:text-outline-variant hover:bg-surface-container-low/50'
                                }`}
                            >
                                Ativos
                            </div>
                            <div 
                                onClick={() => setActiveTab('inactive')}
                                className={`px-4 py-2 rounded-full text-sm font-bold cursor-pointer transition-all ${
                                    activeTab === 'inactive' 
                                        ? 'bg-surface-container-low dark:bg-slate-800 text-primary dark:text-[#00D1FF]' 
                                        : 'text-on-surface-variant dark:text-outline-variant hover:bg-surface-container-low/50'
                                }`}
                            >
                                Inativos
                            </div>
                        </div>

                        {/* Right tools search input and filters */}
                        <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
                            <div className="relative w-full sm:w-64">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-base">search</span>
                                <input 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-surface-container-lowest dark:bg-slate-950 border border-outline-variant/20 dark:border-slate-800 rounded-full py-2 pl-10 pr-4 text-xs text-on-surface dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-on-surface-variant/50" 
                                    placeholder="Pesquisar funcionários..." 
                                    type="text"
                                />
                            </div>
                            <button 
                                onClick={() => triggerNotification('Abertura de filtros avançados...', 'info')}
                                className="flex items-center gap-2 text-on-surface-variant dark:text-outline-variant hover:text-on-surface dark:hover:text-white px-4 py-2 text-sm font-medium transition-colors cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-lg">filter_list</span>
                                <span>Filtrar</span>
                            </button>
                            <button 
                                onClick={() => triggerNotification('Exportando listagem de funcionários...', 'success')}
                                className="flex items-center gap-2 text-on-surface-variant dark:text-outline-variant hover:text-on-surface dark:hover:text-white px-4 py-2 text-sm font-medium transition-colors cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-lg">file_download</span>
                                <span>Exportar</span>
                            </button>
                        </div>
                    </div>

                    {/* The Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-separate border-spacing-0">
                            <thead>
                                <tr className="bg-surface-container-low/30 dark:bg-slate-950/40">
                                    <th className="px-6 py-4 text-xs font-bold text-on-surface-variant dark:text-outline-variant uppercase tracking-widest border-b border-outline-variant/10 dark:border-slate-800">ID</th>
                                    <th className="px-6 py-4 text-xs font-bold text-on-surface-variant dark:text-outline-variant uppercase tracking-widest border-b border-outline-variant/10 dark:border-slate-800">Foto</th>
                                    <th className="px-6 py-4 text-xs font-bold text-on-surface-variant dark:text-outline-variant uppercase tracking-widest border-b border-outline-variant/10 dark:border-slate-800">Nome</th>
                                    <th className="px-6 py-4 text-xs font-bold text-on-surface-variant dark:text-outline-variant uppercase tracking-widest border-b border-outline-variant/10 dark:border-slate-800">Telefone</th>
                                    <th className="px-6 py-4 text-xs font-bold text-on-surface-variant dark:text-outline-variant uppercase tracking-widest border-b border-outline-variant/10 dark:border-slate-800">Cidade</th>
                                    <th className="px-6 py-4 text-xs font-bold text-on-surface-variant dark:text-outline-variant uppercase tracking-widest border-b border-outline-variant/10 dark:border-slate-800">Polo</th>
                                    <th className="px-6 py-4 text-xs font-bold text-on-surface-variant dark:text-outline-variant uppercase tracking-widest border-b border-outline-variant/10 dark:border-slate-800 text-right">Ação</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant/10 dark:divide-slate-800">
                                {filteredEmployees.length > 0 ? (
                                    filteredEmployees.map((emp) => (
                                        <tr 
                                            key={emp.id}
                                            className="hover:bg-surface-container-low/20 dark:hover:bg-slate-800/20 hover:translate-x-1.5 transition-all duration-200 ease-out group"
                                        >
                                            <td className="px-6 py-4 text-sm font-bold text-on-surface-variant dark:text-slate-400">{emp.id}</td>
                                            <td className="px-6 py-4">
                                                <div className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant/30 dark:border-slate-700 flex-shrink-0">
                                                    <img className="w-full h-full object-cover" src={emp.avatar} alt={emp.name} />
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-bold text-on-surface dark:text-white">
                                                <div>
                                                    <p>{emp.name}</p>
                                                    <p className="text-[10px] font-medium text-on-surface-variant dark:text-slate-500">{emp.role}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-on-surface-variant dark:text-outline-variant">{emp.phone}</td>
                                            <td className="px-6 py-4 text-sm text-on-surface-variant dark:text-outline-variant">{emp.city}</td>
                                            <td className="px-6 py-4 text-sm text-on-surface-variant dark:text-outline-variant">{emp.polo}</td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button 
                                                        onClick={() => triggerNotification(`Editar cadastro de ${emp.name}...`, 'info')}
                                                        className="p-2 hover:bg-surface-container-high dark:hover:bg-slate-800 rounded-lg text-on-surface-variant dark:text-slate-400 hover:text-primary transition-colors cursor-pointer"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">edit</span>
                                                    </button>
                                                    <button 
                                                        onClick={() => triggerNotification(`Funcionário ${emp.name} desativado com sucesso!`, 'error')}
                                                        className="p-2 hover:bg-error-container/20 rounded-lg text-error transition-colors cursor-pointer"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-12 text-center text-sm font-bold text-slate-400 dark:text-slate-600">
                                            Nenhum funcionário encontrado.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Table Footer */}
                    <div className="p-6 flex items-center justify-between bg-surface-container-low/20 dark:bg-slate-900/50 border-t border-outline-variant/10 dark:border-slate-800">
                        <p className="text-xs text-on-surface-variant dark:text-outline-variant font-medium">
                            Mostrando 1-{filteredEmployees.length} de 142 funcionários
                        </p>
                        <div className="flex items-center gap-2">
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-high transition-colors">
                                <span className="material-symbols-outlined text-lg">chevron_left</span>
                            </button>
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-on-primary font-bold text-xs">1</button>
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-high text-on-surface-variant font-medium text-xs transition-colors">2</button>
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-high text-on-surface-variant font-medium text-xs transition-colors">3</button>
                            <span className="text-on-surface-variant/40 px-1">...</span>
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-high text-on-surface-variant font-medium text-xs transition-colors">36</button>
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-high transition-colors">
                                <span className="material-symbols-outlined text-lg">chevron_right</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bento Widgets for Insights */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* MVP Card */}
                    <div className="bg-primary/5 dark:bg-slate-900 p-6 rounded-xl relative overflow-hidden group border border-outline-variant/10 dark:border-slate-800">
                        <div className="relative z-10 space-y-4">
                            <h3 className="font-headline text-lg font-bold text-primary dark:text-[#00D1FF] flex items-center gap-2">
                                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                <span>Destaque do Mês</span>
                            </h3>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full border-2 border-primary overflow-hidden flex-shrink-0">
                                    <img 
                                        alt="MVP" 
                                        className="w-full h-full object-cover" 
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnqUIdv9XKFEGURyJiCQE5sEWcomVE8himFwpd5RDpO9klBKG91nxQGoQwvH7USKmHbbPu5bx-qEvODmmqneBZQOU0aw5_dtNCN2jK_KyQK5L5HfGBG7NJMdO-981kmObc3vhA0kudlaOelVDBpDszyuuapDBy9GBlQ2rJVJQ4GGJyQSxIeIkiUKIQF5rGn8NGv4DynmusG7cR3Qd6TDA6iYLQYrDnU_7ZVRP63f8u-m9yGCn8wxkI-D9Xnmdhc2E4fMF79qr1IKNl"
                                    />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-on-surface dark:text-white leading-tight">Ana Paula Mendes</p>
                                    <p className="text-xs text-on-surface-variant dark:text-slate-400">Excelência Pedagógica</p>
                                </div>
                            </div>
                        </div>
                        <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-8xl text-primary/10 dark:text-sky-500/10 group-hover:scale-110 transition-transform duration-500" style={{ fontVariationSettings: "'FILL' 1" }}>emoji_events</span>
                    </div>

                    {/* Announcement card */}
                    <div className="md:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between border border-outline-variant/10 dark:border-slate-800 gap-4">
                        <div className="space-y-2">
                            <p className="text-on-surface-variant dark:text-outline-variant font-bold text-xs uppercase tracking-widest">Aviso Administrativo</p>
                            <h3 className="font-display text-xl font-extrabold text-on-surface dark:text-white leading-none">Atualização de Cadastro 2026</h3>
                            <p className="text-sm text-on-surface-variant/80 dark:text-outline-variant/80">Lembre de solicitar o comprovante de residência atualizado para toda a equipe administrativa até o próximo dia 15.</p>
                        </div>
                        <div className="flex-shrink-0">
                            <button 
                                onClick={() => triggerNotification('Notificação de cobrança enviada por email para a equipe!', 'success')}
                                className="bg-surface-container-high dark:bg-slate-800 text-primary dark:text-[#00D1FF] font-bold px-6 py-2.5 rounded-full hover:bg-primary hover:text-white transition-all cursor-pointer shadow-sm border border-primary/5"
                            >
                                Enviar Lembrete
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </Layout>
    );
}
