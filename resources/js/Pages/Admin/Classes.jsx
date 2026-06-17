import AdminLayout from '@/Layouts/AdminLayout';
import SchoolAdminLayout from '@/Layouts/SchoolAdminLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Classes() {
    const { auth } = usePage().props;
    const user = auth.user;
    const isSchoolAdmin = user.role === 'school_admin';
    const Layout = isSchoolAdmin ? SchoolAdminLayout : AdminLayout;

    // Search and filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); // all, active, inactive
    const [notification, setNotification] = useState(null);

    // Initial mock classes list matching the requested template
    const initialClasses = [
        {
            id: 1,
            name: 'Turma Alpha 2024.1',
            course: 'Marketing Digital Avançado',
            enrolled: 42,
            capacity: 50,
            start_date: '15 Jan, 2024',
            status: 'active'
        },
        {
            id: 2,
            name: 'Web Dev Fullstack #12',
            course: 'Desenvolvimento Web Moderno',
            enrolled: 30,
            capacity: 30,
            start_date: '02 Fev, 2024',
            status: 'active'
        },
        {
            id: 3,
            name: 'Design UI/UX Master',
            course: 'Artes e Design Digital',
            enrolled: 10,
            capacity: 50,
            start_date: '10 Mar, 2024',
            status: 'inactive'
        },
        {
            id: 4,
            name: 'Data Science Starter',
            course: 'Ciência de Dados',
            enrolled: 15,
            capacity: 25,
            start_date: '25 Abr, 2024',
            status: 'active'
        }
    ];

    // Show temporary notification toast
    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => {
            setNotification(null);
        }, 3500);
    };

    // Client-side filtering
    const filteredClasses = initialClasses.filter(classItem => {
        // Status filter
        if (statusFilter === 'active' && classItem.status !== 'active') return false;
        if (statusFilter === 'inactive' && classItem.status !== 'inactive') return false;

        // Search query filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const nameMatch = classItem.name.toLowerCase().includes(query);
            const courseMatch = classItem.course.toLowerCase().includes(query);
            return nameMatch || courseMatch;
        }

        return true;
    });

    const handleAction = (action, className) => {
        showNotification(`${action} "${className}" simulado com sucesso!`);
    };

    const handleQuickAction = (cardName) => {
        if (cardName === 'Turmas Cadastradas') {
            setSearchQuery('');
            setStatusFilter('all');
            showNotification('Filtros limpos! Exibindo todas as turmas.');
        } else if (cardName === 'Nova Turma') {
            showNotification('Fluxo de cadastro de nova turma (Modal/Página) em desenvolvimento.');
        } else {
            showNotification('Exportação de relatório iniciada (Simulada).');
        }
    };

    return (
        <Layout>
            <Head title="Gestão de Turmas | PlayUp Velocity" />

            <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700 relative">
                {/* Notification toast */}
                {notification && (
                    <div className="fixed top-20 right-8 z-50 flex items-center gap-2 px-6 py-4 rounded-xl bg-tertiary-container dark:bg-emerald-950 text-[#006a35] dark:text-[#6bfe9c] border border-tertiary/20 shadow-xl animate-in slide-in-from-top-4 duration-300">
                        <span className="material-symbols-outlined text-lg">check_circle</span>
                        <span className="text-sm font-bold">{notification.message}</span>
                    </div>
                )}

                {/* Hero / Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-on-surface mb-2 font-headline">
                            Gestão de Turmas
                        </h1>
                        <p className="text-[#507c94] dark:text-[#b5e3ff] font-medium leading-relaxed max-w-2xl">
                            Gerencie as turmas, acompanhe o engajamento e gere relatórios de desempenho em tempo real com nossa plataforma integrada.
                        </p>
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                        <button 
                            onClick={() => handleAction('Exportar relatório CSV', 'Geral')}
                            className="flex-1 md:flex-none bg-surface-container-low dark:bg-slate-800 text-primary dark:text-[#00D1FF] font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-surface-container-high dark:hover:bg-slate-700 transition-colors select-none"
                        >
                            <span className="material-symbols-outlined text-lg">file_download</span>
                            <span>Exportar</span>
                        </button>
                        <Link
                            href={route(isSchoolAdmin ? 'school-admin.classes.create' : 'admin.classes.create')}
                            className="flex-1 md:flex-none bg-primary text-white font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-primary/20 hover:opacity-95 active:scale-[0.98] transition-all select-none cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-lg">add_box</span>
                            <span>Nova Turma</span>
                        </Link>
                    </div>
                </div>

                {/* Action Quick Cards */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Link 
                        href={route(isSchoolAdmin ? 'school-admin.classes.create' : 'admin.classes.create')}
                        className="flex items-center gap-4 p-6 bg-surface-container-lowest dark:bg-slate-900 rounded-2xl hover:bg-primary dark:hover:bg-primary text-left group transition-all duration-300 border border-outline-variant/10 dark:border-slate-800 shadow-sm"
                    >
                        <div className="h-12 w-12 bg-primary/10 dark:bg-slate-800 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-colors">
                            <span className="material-symbols-outlined text-primary dark:text-[#00D1FF] group-hover:text-white">add_box</span>
                        </div>
                        <div>
                            <span className="block font-bold font-headline text-lg text-on-surface group-hover:text-white transition-colors">Nova Turma</span>
                            <span className="text-xs text-[#507c94] dark:text-[#87b3cd] group-hover:text-white/80 transition-colors">Cadastrar novas turmas e períodos</span>
                        </div>
                    </Link>

                    <button 
                        onClick={() => handleQuickAction('Turmas Cadastradas')}
                        className="flex items-center gap-4 p-6 bg-surface-container-lowest dark:bg-slate-900 rounded-2xl hover:bg-secondary dark:hover:bg-secondary text-left group transition-all duration-300 border border-outline-variant/10 dark:border-slate-800 shadow-sm"
                    >
                        <div className="h-12 w-12 bg-secondary/10 dark:bg-slate-800 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-colors">
                            <span className="material-symbols-outlined text-secondary dark:text-cyan-400 group-hover:text-white">list_alt</span>
                        </div>
                        <div>
                            <span className="block font-bold font-headline text-lg text-on-surface group-hover:text-white transition-colors">Turmas Cadastradas</span>
                            <span className="text-xs text-[#507c94] dark:text-[#87b3cd] group-hover:text-white/80 transition-colors">Visualize todas as turmas ativas</span>
                        </div>
                    </button>

                    <button 
                        onClick={() => handleQuickAction('Relatórios')}
                        className="flex items-center gap-4 p-6 bg-surface-container-lowest dark:bg-slate-900 rounded-2xl hover:bg-tertiary dark:hover:bg-tertiary text-left group transition-all duration-300 border border-outline-variant/10 dark:border-slate-800 shadow-sm"
                    >
                        <div className="h-12 w-12 bg-tertiary/10 dark:bg-slate-800 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-colors">
                            <span className="material-symbols-outlined text-tertiary dark:text-emerald-400 group-hover:text-white">analytics</span>
                        </div>
                        <div>
                            <span className="block font-bold font-headline text-lg text-on-surface group-hover:text-white transition-colors">Relatórios</span>
                            <span className="text-xs text-[#507c94] dark:text-[#87b3cd] group-hover:text-white/80 transition-colors">Exportar dados de desempenho</span>
                        </div>
                    </button>
                </section>

                {/* Metrics Overview Grid */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Stat: Total Turmas */}
                    <div className="bg-surface-container-lowest dark:bg-slate-900 p-6 rounded-3xl border border-outline-variant/10 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 dark:opacity-20 group-hover:opacity-25 transition-opacity pointer-events-none">
                            <span className="material-symbols-outlined text-6xl text-primary" style={{ fontVariationSettings: "'wght' 300" }}>groups</span>
                        </div>
                        <div className="text-[#507c94] dark:text-[#87b3cd] text-sm font-bold uppercase tracking-widest mb-1">
                            Total de Turmas
                        </div>
                        <div className="text-4xl font-black text-primary dark:text-[#00D1FF] font-headline flex items-baseline gap-2">
                            142
                            <span className="text-sm font-bold text-tertiary dark:text-emerald-400 flex items-center gap-0.5">
                                +4%
                                <span className="material-symbols-outlined text-xs">arrow_upward</span>
                            </span>
                        </div>
                        <div className="mt-4 text-xs text-[#507c94]/70 dark:text-[#87b3cd]/60">
                            Crescimento constante na rede
                        </div>
                    </div>

                    {/* Stat: Turmas Ativas */}
                    <div className="bg-surface-container-lowest dark:bg-slate-900 p-6 rounded-3xl border border-outline-variant/10 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 dark:opacity-20 group-hover:opacity-25 transition-opacity pointer-events-none">
                            <span className="material-symbols-outlined text-6xl text-primary" style={{ fontVariationSettings: "'wght' 300" }}>bolt</span>
                        </div>
                        <div className="text-[#507c94] dark:text-[#87b3cd] text-sm font-bold uppercase tracking-widest mb-1">
                            Turmas Ativas
                        </div>
                        <div className="text-4xl font-black text-primary dark:text-[#00D1FF] font-headline">
                            88
                        </div>
                        <div className="mt-4 text-xs text-[#507c94]/70 dark:text-[#87b3cd]/60 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
                            Em andamento
                        </div>
                    </div>

                    {/* Stat: Alunos em Turmas */}
                    <div className="bg-surface-container-lowest dark:bg-slate-900 p-6 rounded-3xl border border-outline-variant/10 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 dark:opacity-20 group-hover:opacity-25 transition-opacity pointer-events-none">
                            <span className="material-symbols-outlined text-6xl text-primary" style={{ fontVariationSettings: "'wght' 300" }}>person_add</span>
                        </div>
                        <div className="text-[#507c94] dark:text-[#87b3cd] text-sm font-bold uppercase tracking-widest mb-1">
                            Total de Alunos em Turmas
                        </div>
                        <div className="text-4xl font-black text-primary dark:text-[#00D1FF] font-headline flex items-baseline gap-2">
                            2,540
                            <span className="text-sm font-bold text-tertiary dark:text-emerald-400 flex items-center gap-0.5">
                                +12%
                                <span className="material-symbols-outlined text-xs">arrow_upward</span>
                            </span>
                        </div>
                        <div className="mt-4 text-xs text-[#507c94]/70 dark:text-[#87b3cd]/60">
                            Matrículas consolidadas este ano
                        </div>
                    </div>
                </section>

                {/* Main Data Table Container */}
                <div className="bg-surface-container-lowest dark:bg-slate-900 rounded-3xl border border-outline-variant/10 dark:border-slate-800 shadow-sm overflow-hidden">
                    
                    {/* Table Toolbar & Filters */}
                    <div className="p-6 border-b border-outline-variant/10 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-primary-container/10 dark:bg-slate-800 flex items-center justify-center text-primary dark:text-[#00D1FF]">
                                <span className="material-symbols-outlined">list_alt</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-headline font-bold text-[#003346] dark:text-white">Listagem de Turmas</h3>
                                <p className="text-xs text-[#507c94] dark:text-[#87b3cd] font-semibold">Lista completa de turmas e ocupação de salas</p>
                            </div>
                        </div>

                        {/* Search and Tabs */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                            {/* Search bar inside the table area */}
                            <div className="relative font-body">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#507c94] dark:text-[#87b3cd]/70 text-lg pointer-events-none">
                                    search
                                </span>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Buscar turmas ou cursos..."
                                    className="w-full sm:w-64 bg-surface dark:bg-slate-950 border-none rounded-xl py-2.5 pl-10 pr-4 text-xs focus:ring-2 focus:ring-primary/20 placeholder:text-[#507c94]/40 text-[#003346] dark:text-white outline-none"
                                />
                            </div>

                            {/* Filters Tab buttons */}
                            <div className="flex items-center gap-1 bg-surface dark:bg-slate-950 p-1 rounded-xl">
                                <button
                                    onClick={() => setStatusFilter('all')}
                                    className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${statusFilter === 'all' ? 'bg-white dark:bg-slate-800 text-primary dark:text-[#00D1FF] shadow-sm' : 'text-[#507c94] hover:bg-white/40 dark:hover:bg-slate-850'}`}
                                >
                                    Todos
                                </button>
                                <button
                                    onClick={() => setStatusFilter('active')}
                                    className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${statusFilter === 'active' ? 'bg-white dark:bg-slate-800 text-primary dark:text-[#00D1FF] shadow-sm' : 'text-[#507c94] hover:bg-white/40 dark:hover:bg-slate-850'}`}
                                >
                                    Ativos
                                </button>
                                <button
                                    onClick={() => setStatusFilter('inactive')}
                                    className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${statusFilter === 'inactive' ? 'bg-white dark:bg-slate-800 text-primary dark:text-[#00D1FF] shadow-sm' : 'text-[#507c94] hover:bg-white/40 dark:hover:bg-slate-850'}`}
                                >
                                    Inativos
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Table View */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-surface/50 dark:bg-slate-950/40">
                                    <th className="px-8 py-4 text-xs font-black text-[#507c94] dark:text-[#87b3cd] uppercase tracking-widest">Nome da Turma</th>
                                    <th className="px-6 py-4 text-xs font-black text-[#507c94] dark:text-[#87b3cd] uppercase tracking-widest">Curso Associado</th>
                                    <th className="px-6 py-4 text-xs font-black text-[#507c94] dark:text-[#87b3cd] uppercase tracking-widest">Alunos Matriculados</th>
                                    <th className="px-6 py-4 text-xs font-black text-[#507c94] dark:text-[#87b3cd] uppercase tracking-widest">Data de Início</th>
                                    <th className="px-6 py-4 text-xs font-black text-[#507c94] dark:text-[#87b3cd] uppercase tracking-widest text-center">Status</th>
                                    <th className="px-8 py-4 text-xs font-black text-[#507c94] dark:text-[#87b3cd] uppercase tracking-widest text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant/10 dark:divide-slate-800">
                                {filteredClasses.length > 0 ? (
                                    filteredClasses.map((item) => {
                                        const percentage = Math.round((item.enrolled / item.capacity) * 100);

                                        return (
                                            <tr key={item.id} className="hover:bg-surface/30 dark:hover:bg-slate-800/30 transition-colors group">
                                                <td className="px-8 py-5">
                                                    <span className="font-bold text-[#003346] dark:text-white group-hover:text-primary dark:group-hover:text-[#00D1FF] transition-colors">{item.name}</span>
                                                </td>
                                                <td className="px-6 py-5 text-[#507c94] dark:text-[#b5e3ff] font-medium text-sm">
                                                    {item.course}
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-3 max-w-xs">
                                                        <div className="w-24 bg-surface-container-high dark:bg-slate-950 h-2 rounded-full overflow-hidden">
                                                            <div 
                                                                className="bg-primary dark:bg-[#00D1FF] h-full rounded-full" 
                                                                style={{ width: `${percentage}%` }}
                                                            ></div>
                                                        </div>
                                                        <span className="font-semibold text-sm text-[#003346] dark:text-white">{item.enrolled}/{item.capacity}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-sm font-semibold text-[#507c94] dark:text-[#87b3cd]/80">{item.start_date}</td>
                                                <td className="px-6 py-5 text-center">
                                                    {item.status === 'active' ? (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#cdffd4] dark:bg-emerald-950 text-[#006a35] dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-[#006a35] dark:bg-emerald-400 animate-pulse"></span>
                                                            Ativo
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container dark:bg-slate-800 text-[#507c94]/70 dark:text-slate-400 text-[10px] font-black uppercase tracking-wider">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-[#507c94]/50 dark:bg-slate-600"></span>
                                                            Inativo
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-8 py-5 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button 
                                                            onClick={() => handleAction('Visualizar detalhes de', item.name)}
                                                            className="p-2 rounded-lg hover:bg-primary/10 text-[#507c94] dark:text-[#87b3cd] hover:text-primary dark:hover:text-[#00D1FF] transition-all active:scale-90"
                                                            title="Visualizar"
                                                        >
                                                            <span className="material-symbols-outlined text-lg">visibility</span>
                                                        </button>
                                                        <button 
                                                            onClick={() => handleAction('Editar informações de', item.name)}
                                                            className="p-2 rounded-lg hover:bg-primary/10 text-[#507c94] dark:text-[#87b3cd] hover:text-primary dark:hover:text-[#00D1FF] transition-all active:scale-90"
                                                            title="Editar"
                                                        >
                                                            <span className="material-symbols-outlined text-lg">edit</span>
                                                        </button>
                                                        <button 
                                                            onClick={() => handleAction('Excluir', item.name)}
                                                            className="p-2 rounded-lg hover:bg-error/10 text-[#507c94] dark:text-[#87b3cd] hover:text-[#b31b25] transition-all active:scale-90"
                                                            title="Excluir"
                                                        >
                                                            <span className="material-symbols-outlined text-lg">delete</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-8 py-16 text-center text-[#507c94] dark:text-[#87b3cd]/70 font-semibold">
                                            <span className="material-symbols-outlined text-4xl block mb-2 opacity-50">search_off</span>
                                            Nenhuma turma encontrada correspondente aos filtros.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Footer */}
                    <div className="p-6 border-t border-outline-variant/10 dark:border-slate-800 bg-surface-container-low/30 dark:bg-slate-900/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <span className="text-xs text-[#507c94] dark:text-[#87b3cd] font-semibold">
                            Mostrando <span className="font-bold text-on-surface dark:text-white">{filteredClasses.length}</span> de <span className="font-bold text-on-surface dark:text-white">142</span> turmas
                        </span>
                        <div className="flex gap-1.5">
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-white font-bold text-xs shadow-md shadow-primary/10">1</button>
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-high dark:hover:bg-slate-800 text-[#507c94] dark:text-[#87b3cd] text-xs transition-all">2</button>
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-high dark:hover:bg-slate-800 text-[#507c94] dark:text-[#87b3cd] text-xs transition-all">3</button>
                            <span className="px-2 text-[#507c94] opacity-50">...</span>
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-high dark:hover:bg-slate-800 text-[#507c94] dark:text-[#87b3cd] text-xs transition-all">15</button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bento Area */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
                    {/* Evasion Prevention Card */}
                    <div className="p-8 rounded-[2rem] border border-outline-variant/10 dark:border-slate-800 flex flex-col justify-between h-64 bg-gradient-to-br from-blue-50/50 to-white dark:from-slate-900 dark:to-slate-950 shadow-sm relative overflow-hidden group">
                        <div className="relative z-10">
                            <span className="px-3 py-1 bg-primary/10 text-primary dark:text-[#00D1FF] rounded-full text-[10px] font-bold uppercase tracking-wider mb-4 inline-block font-label">Prevenção por IA</span>
                            <h4 className="font-headline font-extrabold text-2xl text-primary dark:text-[#00D1FF] mb-2">Otimização de Engajamento</h4>
                            <p className="text-[#507c94] dark:text-[#87b3cd] text-xs font-semibold leading-relaxed max-w-sm">
                                Descubra quais turmas possuem maior taxa de evasão e tome medidas preventivas automáticas com IA.
                            </p>
                        </div>
                        <button 
                            onClick={() => handleAction('Estatísticas avançadas', 'IA')}
                            className="self-start text-primary dark:text-[#00D1FF] font-bold flex items-center gap-1.5 group text-sm relative z-10"
                        >
                            <span>Ver estatísticas avançadas</span>
                            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform text-md">arrow_forward</span>
                        </button>
                        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl group-hover:scale-110 transition-transform"></div>
                    </div>

                    {/* Monthly Report Photo Card */}
                    <div className="relative rounded-[2rem] overflow-hidden h-64 group shadow-xl border border-outline-variant/10 dark:border-slate-850">
                        <img 
                            alt="Learning environment" 
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAicIiOyZTQ4pPSMBR35_p3B7Xs_uCiJPXZ67cH0PkbqVVNl2j4Oe64_6GFSwTnggng-luAD2D3Sg9EC9ppyU388E9ldeVvv_ZDnGWEepCGPIDbs_gNRN2Q40ENHpLTVGAQFnpNd-aLef63GsypoO274V-0AZ50-nOvqE9XO42FRzGALG7Ad03nAIzErVbM3uPNazY0OzAcL7_LueQZle27L6kQfL81QDAdvhLYaRJoqyHSMtj7OjN0Wk_OtKnuVRznwRgt7-JENfcX"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent dark:from-slate-950/95 dark:to-transparent"></div>
                        <div className="absolute bottom-6 left-6 text-white max-w-sm">
                            <h4 className="font-headline font-bold text-xl mb-1 text-white">Relatórios Mensais Disponíveis</h4>
                            <p className="text-white/80 text-xs font-medium">O fechamento de Março já está pronto para exportação.</p>
                        </div>
                    </div>
                </section>
            </div>
        </Layout>
    );
}
