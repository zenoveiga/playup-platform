import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function CoursesAndPackages() {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); // all, active, inactive

    // Initial mock courses database (seeded with design template items and extended for high-fidelity filtering)
    const initialCourses = [
        {
            id: 1,
            name: 'Desenvolvimento Fullstack Master',
            modules: 48,
            hours: 240,
            category: 'Tecnologia',
            created_at: '12/03/2024',
            status: 'active',
            icon: 'code'
        },
        {
            id: 2,
            name: 'UI/UX Designer Profissional',
            modules: 32,
            hours: 160,
            category: 'Design',
            created_at: '05/04/2024',
            status: 'active',
            icon: 'palette'
        },
        {
            id: 3,
            name: 'Marketing Digital Estratégico',
            modules: 24,
            hours: 120,
            category: 'Marketing',
            created_at: '20/02/2024',
            status: 'inactive',
            icon: 'insights'
        },
        {
            id: 4,
            name: 'Gestão de Investimentos',
            modules: 15,
            hours: 80,
            category: 'Finanças',
            created_at: '28/05/2024',
            status: 'active',
            icon: 'account_balance'
        },
        {
            id: 5,
            name: 'Inteligência Artificial & Machine Learning',
            modules: 40,
            hours: 200,
            category: 'Tecnologia',
            created_at: '10/01/2026',
            status: 'active',
            icon: 'psychology'
        },
        {
            id: 6,
            name: 'Inglês para Negócios Internacionais',
            modules: 20,
            hours: 100,
            category: 'Idiomas',
            created_at: '14/11/2025',
            status: 'active',
            icon: 'translate'
        },
        {
            id: 7,
            name: 'Liderança de Alta Performance',
            modules: 12,
            hours: 60,
            category: 'Gestão',
            created_at: '03/03/2026',
            status: 'inactive',
            icon: 'groups'
        }
    ];

    // Filter courses client-side
    const filteredCourses = initialCourses.filter(course => {
        // Status filter
        if (statusFilter === 'active' && course.status !== 'active') return false;
        if (statusFilter === 'inactive' && course.status !== 'inactive') return false;

        // Search query filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const nameMatch = course.name.toLowerCase().includes(query);
            const categoryMatch = course.category.toLowerCase().includes(query);
            return nameMatch || categoryMatch;
        }

        return true;
    });

    // Dynamic counts
    const totalCourses = 124; // Visual match to HTML template
    const activeStudents = 3842; // Visual match to HTML template

    return (
        <AdminLayout>
            <Head title="Cursos e Pacotes - Kinetic Admin" />

            <div className="p-8 max-w-7xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-2">
                    <div>
                        <nav className="flex items-center gap-2 text-xs text-[#507c94] dark:text-[#87b3cd]/70 mb-2 font-bold uppercase tracking-wider">
                            <span>Administração</span>
                            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                            <span className="text-primary dark:text-[#00D1FF] font-bold">Cursos e Pacotes</span>
                        </nav>
                        <h1 className="text-4xl font-extrabold text-[#003346] dark:text-white tracking-tight font-headline">
                            Gestão de Cursos e Pacotes
                        </h1>
                        <p className="text-[#507c94] dark:text-[#87b3cd] mt-1 max-w-lg font-medium">
                            Gerencie o catálogo acadêmico, defina novos pacotes de aprendizado e acompanhe o engajamento dos alunos.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <button className="flex items-center gap-2 px-6 py-3 bg-surface-container-lowest dark:bg-slate-900 text-on-surface dark:text-white font-bold rounded-xl border border-outline-variant/15 dark:border-slate-800 hover:bg-surface-container dark:hover:bg-slate-800 transition-all active:scale-95 shadow-sm">
                            <span className="material-symbols-outlined text-primary dark:text-[#00D1FF]">edit_square</span>
                            <span>Alterar curso</span>
                        </button>
                        <button className="flex items-center gap-2 px-6 py-3 bg-surface-container-lowest dark:bg-slate-900 text-on-surface dark:text-white font-bold rounded-xl border border-outline-variant/15 dark:border-slate-800 hover:bg-surface-container dark:hover:bg-slate-800 transition-all active:scale-95 shadow-sm">
                            <span className="material-symbols-outlined text-primary dark:text-[#00D1FF]">list</span>
                            <span>Todos os cursos</span>
                        </button>
                        <button className="flex items-center gap-2 px-6 py-3 kinetic-gradient text-white font-bold rounded-xl hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95">
                            <span className="material-symbols-outlined">add</span>
                            <span>Novo curso</span>
                        </button>
                    </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Stat: Total Courses */}
                    <div className="glass-panel dark:bg-slate-900 rounded-[1.5rem] p-6 shadow-sm flex items-center justify-between border border-outline-variant/10 dark:border-slate-800 overflow-hidden relative group">
                        <div className="relative z-10">
                            <p className="text-[#507c94] dark:text-[#87b3cd] font-semibold uppercase tracking-widest text-[10px] mb-2">Total de Cursos</p>
                            <h3 className="text-5xl font-black text-[#003346] dark:text-white flex items-end gap-2 font-headline">
                                {totalCourses}
                                <span className="text-sm font-bold text-tertiary dark:text-[#6bfe9c] flex items-center gap-1 mb-2">
                                    <span className="material-symbols-outlined text-sm">trending_up</span>
                                    +12%
                                </span>
                            </h3>
                            <p className="text-xs text-[#507c94]/70 dark:text-[#87b3cd]/60 mt-4">Catálogo ativo atualizado hoje</p>
                        </div>
                        <div className="bg-primary/5 p-6 rounded-full group-hover:scale-110 transition-transform duration-500">
                            <span className="material-symbols-outlined text-primary dark:text-[#00D1FF] text-6xl opacity-30">library_books</span>
                        </div>
                        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>
                    </div>

                    {/* Stat: Active Students */}
                    <div className="glass-panel dark:bg-slate-900 rounded-[1.5rem] p-6 shadow-sm flex items-center justify-between border border-outline-variant/10 dark:border-slate-800 overflow-hidden relative group">
                        <div className="relative z-10">
                            <p className="text-[#507c94] dark:text-[#87b3cd] font-semibold uppercase tracking-widest text-[10px] mb-2">Alunos Ativos</p>
                            <h3 className="text-5xl font-black text-[#003346] dark:text-white flex items-end gap-2 font-headline">
                                {activeStudents.toLocaleString()}
                                <span className="text-sm font-bold text-tertiary dark:text-[#6bfe9c] flex items-center gap-1 mb-2">
                                    <span className="material-symbols-outlined text-sm">expand_less</span>
                                    4.2k
                                </span>
                            </h3>
                            <p className="text-xs text-[#507c94]/70 dark:text-[#87b3cd]/60 mt-4">Matrículas recorrentes este mês</p>
                        </div>
                        <div className="bg-tertiary/5 p-6 rounded-full group-hover:scale-110 transition-transform duration-500">
                            <span className="material-symbols-outlined text-tertiary dark:text-[#6bfe9c] text-6xl opacity-30">person_play</span>
                        </div>
                        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-tertiary/5 rounded-full blur-3xl"></div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-surface-container-lowest dark:bg-slate-900 rounded-[1.5rem] border border-outline-variant/10 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="px-8 py-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-outline-variant/10 dark:border-slate-800">
                        <h2 className="text-xl font-bold text-[#003346] dark:text-white font-headline">Lista de Cursos Disponíveis</h2>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                            {/* Search bar inside the table area */}
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#507c94] text-lg pointer-events-none">
                                    search
                                </span>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Buscar cursos..."
                                    className="w-full sm:w-64 bg-surface dark:bg-slate-950 border-none rounded-xl py-2 pl-10 pr-4 text-xs focus:ring-2 focus:ring-primary/20 placeholder:text-[#507c94]/40 text-on-surface dark:text-white outline-none"
                                />
                            </div>

                            {/* Dropdown status filter */}
                            <div className="flex items-center gap-2 bg-surface dark:bg-slate-950 rounded-xl px-3 py-2 border-none">
                                <span className="material-symbols-outlined text-sm text-[#507c94]" style={{ fontVariationSettings: "'wght' 500" }}>filter_list</span>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="bg-transparent border-none text-xs font-bold text-[#507c94] focus:ring-0 p-0 pr-6 outline-none cursor-pointer"
                                >
                                    <option value="all">Filtrar por Status</option>
                                    <option value="active">Ativo</option>
                                    <option value="inactive">Inativo</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-[#eff8ff]/50 dark:bg-slate-950/40">
                                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-[#507c94] dark:text-[#87b3cd]">Nome do Curso</th>
                                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-[#507c94] dark:text-[#87b3cd]">Categoria</th>
                                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-[#507c94] dark:text-[#87b3cd]">Data de Criação</th>
                                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-[#507c94] dark:text-[#87b3cd] text-center">Status</th>
                                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-[#507c94] dark:text-[#87b3cd] text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant/10 dark:divide-slate-800">
                                {filteredCourses.length > 0 ? (
                                    filteredCourses.map((course) => (
                                        <tr key={course.id} className="hover:bg-[#eff8ff]/40 dark:hover:bg-slate-800/40 transition-colors">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-primary-container/20 flex items-center justify-center">
                                                        <span className="material-symbols-outlined text-primary dark:text-[#00D1FF]">{course.icon}</span>
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-[#003346] dark:text-white text-sm">{course.name}</p>
                                                        <p className="text-xs text-[#507c94]/70 dark:text-[#87b3cd]/60">{course.modules} módulos • {course.hours} horas</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className="px-3 py-1 rounded-full bg-secondary-container dark:bg-cyan-950/50 text-[#00647b] dark:text-cyan-400 text-[10px] font-bold uppercase tracking-wider">
                                                    {course.category}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-sm text-[#507c94]/90 dark:text-[#87b3cd]/80 font-medium">{course.created_at}</td>
                                            <td className="px-8 py-5">
                                                <div className="flex justify-center">
                                                    {course.status === 'active' ? (
                                                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#cdffd4] dark:bg-emerald-950/50 text-[#006a35] dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-[#006a35] dark:bg-emerald-400 animate-pulse"></span>
                                                            Ativo
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container dark:bg-slate-800 text-[#507c94]/70 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-[#507c94]/50"></span>
                                                            Inativo
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button className="w-8 h-8 rounded-lg flex items-center justify-center text-[#507c94] hover:bg-surface-container-high dark:hover:bg-slate-800 hover:text-primary dark:hover:text-[#00D1FF] transition-all" title="Visualizar">
                                                        <span className="material-symbols-outlined text-[20px]">visibility</span>
                                                    </button>
                                                    <button className="w-8 h-8 rounded-lg flex items-center justify-center text-[#507c94] hover:bg-surface-container-high dark:hover:bg-slate-800 hover:text-primary dark:hover:text-[#00D1FF] transition-all" title="Editar">
                                                        <span className="material-symbols-outlined text-[20px]">edit</span>
                                                    </button>
                                                    <button className="w-8 h-8 rounded-lg flex items-center justify-center text-[#507c94] hover:bg-[#b31b25]/10 hover:text-[#b31b25] transition-all" title="Excluir">
                                                        <span className="material-symbols-outlined text-[20px]">delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-8 py-12 text-center text-[#507c94] dark:text-[#87b3cd]/70 font-semibold">
                                            <span className="material-symbols-outlined text-4xl block mb-2 opacity-50">search_off</span>
                                            Nenhum curso encontrado correspondente aos filtros.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="px-8 py-6 bg-[#eff8ff]/30 dark:bg-slate-950/20 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-outline-variant/10 dark:border-slate-800">
                        <p className="text-xs text-[#507c94] dark:text-[#87b3cd]/70 font-medium">
                            Mostrando <span className="font-bold text-on-surface dark:text-white">1-{filteredCourses.length}</span> de <span className="font-bold text-on-surface dark:text-white">{totalCourses}</span> cursos
                        </p>
                        <div className="flex items-center gap-2">
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant/15 dark:border-slate-800 text-[#507c94] dark:text-[#87b3cd] hover:bg-surface-container dark:hover:bg-slate-800 transition-all disabled:opacity-40" disabled>
                                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                            </button>
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-white font-bold text-xs">1</button>
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container dark:hover:bg-slate-800 text-[#507c94] dark:text-[#87b3cd] text-xs transition-all">2</button>
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container dark:hover:bg-slate-800 text-[#507c94] dark:text-[#87b3cd] text-xs transition-all">3</button>
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant/15 dark:border-slate-800 text-[#507c94] dark:text-[#87b3cd] hover:bg-surface-container dark:hover:bg-slate-800 transition-all">
                                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Featured Section Asymmetric Layout */}
                <div className="grid grid-cols-12 gap-8 mt-4">
                    {/* Left Banner */}
                    <div className="col-span-12 lg:col-span-8 bg-gradient-to-r from-[#0046bb] to-[#0050d4] rounded-[2rem] p-8 text-white flex flex-col md:flex-row items-center gap-12 relative overflow-hidden group shadow-md">
                        <div className="flex-1 relative z-10">
                            <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest mb-6 inline-block">Novidade Kinetic</span>
                            <h2 className="text-4xl font-black mb-4 leading-tight font-headline">
                                Impulsione as Vendas com<br/>Pacotes Personalizados
                            </h2>
                            <p className="text-white/80 mb-8 max-w-md font-medium text-sm">
                                Crie combinações inteligentes de cursos para aumentar o ticket médio e oferecer trilhas de aprendizado completas para seus polos.
                            </p>
                            <button className="bg-white text-primary px-8 py-3.5 rounded-xl font-black hover:bg-surface-container-high transition-all active:scale-95 shadow-xl shadow-black/20 text-sm">
                                Criar Novo Pacote
                            </button>
                        </div>
                        <div className="hidden md:block flex-shrink-0 relative z-10">
                            <div className="w-64 h-64 bg-white/10 rounded-[2rem] backdrop-blur-xl border border-white/20 rotate-3 group-hover:rotate-6 transition-transform duration-700 flex items-center justify-center overflow-hidden">
                                <img 
                                    alt="Collaboration" 
                                    className="w-full h-full object-cover opacity-80" 
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDUyZhP9K2YpcqOleX4323vBUSBKzTvrGuzd-QH8QPBSjvJyQwnoH4ZZeRML96R08SeVsIPTmm3vLZ8CxIQ90CuBWh-H2iwCg74mxmWuRiQx4qqihXLbEECZYNeQUxcXf2y9fjj3i_8M7zn3hQHeLr7i0xH0EySAghLhbwm_EXjP2L1__67O6Ue8snUwg_PFXUDu9CoYXm6PiAOibnN_eGOutHu62kOM1G1lW-X32ka7gHjHXbZrHZKZ64PrCcbFImbFSUZ8yEVd0G3"
                                />
                            </div>
                        </div>
                        <div className="absolute -left-20 -top-20 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
                        <div className="absolute right-0 bottom-0 w-64 h-64 bg-primary-container/20 rounded-full blur-[80px]"></div>
                    </div>

                    {/* Right Performance Card */}
                    <div className="col-span-12 lg:col-span-4 bg-surface-container-low dark:bg-slate-900 rounded-[2rem] p-8 border border-outline-variant/10 dark:border-slate-800 flex flex-col justify-between shadow-sm">
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <div className="w-12 h-12 bg-tertiary-container dark:bg-emerald-950/50 text-tertiary dark:text-emerald-400 rounded-2xl flex items-center justify-center">
                                    <span className="material-symbols-outlined text-2xl">trending_up</span>
                                </div>
                                <span className="text-[10px] font-black text-[#507c94] dark:text-[#87b3cd]/70 uppercase tracking-widest">Relatório Mensal</span>
                            </div>
                            <h3 className="text-2xl font-bold text-[#003346] dark:text-white mb-2 font-headline">Desempenho</h3>
                            <p className="text-sm text-[#507c94]/90 dark:text-[#87b3cd] font-medium leading-relaxed">
                                A taxa de conclusão de cursos aumentou <span class="text-tertiary dark:text-[#6bfe9c] font-extrabold">18.4%</span> em relação ao mês anterior.
                            </p>
                        </div>
                        <div className="mt-8 space-y-4">
                            <div className="h-2.5 w-full bg-surface-container-highest dark:bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-tertiary dark:bg-[#5bef90] w-[84%] rounded-full"></div>
                            </div>
                            <div className="flex justify-between items-center text-[10px] font-black text-[#507c94] dark:text-[#87b3cd]/70 uppercase tracking-wider">
                                <span>Meta de Engajamento</span>
                                <span className="text-[#003346] dark:text-white">84% de 100%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
