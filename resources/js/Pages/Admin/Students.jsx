import AdminLayout from '@/Layouts/AdminLayout';
import SchoolAdminLayout from '@/Layouts/SchoolAdminLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';

export default function Students({ students = [] }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const isSchoolAdmin = user.role === 'school_admin';
    const Layout = isSchoolAdmin ? SchoolAdminLayout : AdminLayout;

    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); // all, active, inactive
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Dynamic stat calculation based on seeded database users + mock base for high-fidelity alignment
    const dbTotal = students.length;
    const dbActive = students.filter(s => s.status === 'active').length;
    const dbInactive = students.filter(s => s.status === 'inactive').length;

    const displayTotal = 12480 + dbTotal;
    const displayActive = 11200 + dbActive;
    const displayInactive = 1280 + dbInactive;
    const displayNewThisMonth = 856 + (students.filter(s => new Date(s.created_at).getMonth() === new Date().getMonth()).length);

    // Form logic for Matricular Novo Aluno
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        status: 'active',
    });

    const storeRoute = isSchoolAdmin ? 'school-admin.students.store' : 'admin.students.store';

    const openCreateModal = () => {
        setIsCreateModalOpen(true);
    };

    const closeCreateModal = () => {
        setIsCreateModalOpen(false);
        reset();
    };

    const submit = (e) => {
        e.preventDefault();
        post(route(storeRoute), {
            onSuccess: () => closeCreateModal(),
        });
    };

    // Client-side filtering for search and tabs
    const filteredStudents = students.filter(student => {
        // Status filter
        if (statusFilter === 'active' && student.status !== 'active') return false;
        if (statusFilter === 'inactive' && student.status !== 'inactive') return false;

        // Search query filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const nameMatch = student.name?.toLowerCase().includes(query);
            const emailMatch = student.email?.toLowerCase().includes(query);
            const phoneMatch = student.phone?.includes(query);
            const idMatch = `#PUV-${student.id}-2026`.toLowerCase().includes(query);
            return nameMatch || emailMatch || phoneMatch || idMatch;
        }

        return true;
    });

    // Helper to get initials for avatar fallbacks
    const getInitials = (name) => {
        if (!name) return 'S';
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name[0].toUpperCase();
    };

    return (
        <Layout>
            <Head title="Gestão de Alunos - PlayUp Velocity" />

            <div className="p-8 max-w-7xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-on-surface mb-2 font-headline">
                            Gestão de Alunos
                        </h1>
                        <p className="text-[#507c94] dark:text-[#b5e3ff] font-medium">
                            Controle e acompanhamento de todos os estudantes da rede.
                        </p>
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                        <button className="flex-1 md:flex-none bg-surface-container-low dark:bg-slate-800 text-primary dark:text-[#00D1FF] font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-surface-container-high dark:hover:bg-slate-700 transition-colors select-none">
                            <span className="material-symbols-outlined text-lg">file_download</span>
                            <span>Exportar</span>
                        </button>
                        <button 
                            onClick={openCreateModal}
                            className="flex-1 md:flex-none bg-primary text-white font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-primary/20 hover:opacity-95 active:scale-[0.98] transition-all select-none cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-lg">person_add</span>
                            <span>Matricular Novo Aluno</span>
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {/* Stat: Total */}
                    <div className="bg-surface-container-lowest dark:bg-slate-900 p-6 rounded-3xl border border-outline-variant/10 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 dark:opacity-20 group-hover:opacity-25 transition-opacity pointer-events-none">
                            <span className="material-symbols-outlined text-6xl text-primary" style={{ fontVariationSettings: "'wght' 300" }}>groups</span>
                        </div>
                        <div className="text-[#507c94] dark:text-[#87b3cd] text-sm font-bold uppercase tracking-widest mb-1">
                            Total de Alunos
                        </div>
                        <div className="text-4xl font-black text-primary dark:text-[#00D1FF] font-headline">
                            {displayTotal.toLocaleString()}
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-tertiary dark:text-tertiary-fixed font-bold text-sm">
                            <span className="material-symbols-outlined text-sm">trending_up</span>
                            <span>+5.2% desde o último mês</span>
                        </div>
                    </div>

                    {/* Stat: Actives */}
                    <div className="bg-surface-container-lowest dark:bg-slate-900 p-6 rounded-3xl border border-outline-variant/10 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 dark:opacity-20 group-hover:opacity-25 transition-opacity pointer-events-none">
                            <span className="material-symbols-outlined text-6xl text-primary" style={{ fontVariationSettings: "'wght' 300" }}>person_check</span>
                        </div>
                        <div className="text-[#507c94] dark:text-[#87b3cd] text-sm font-bold uppercase tracking-widest mb-1">
                            Alunos Ativos
                        </div>
                        <div className="text-4xl font-black text-primary dark:text-[#00D1FF] font-headline">
                            {displayActive.toLocaleString()}
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-tertiary dark:text-tertiary-fixed font-bold text-sm">
                            <span className="material-symbols-outlined text-sm">check_circle</span>
                            <span>89.7% de retenção</span>
                        </div>
                    </div>

                    {/* Stat: News */}
                    <div className="bg-surface-container-lowest dark:bg-slate-900 p-6 rounded-3xl border border-outline-variant/10 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 dark:opacity-20 group-hover:opacity-25 transition-opacity pointer-events-none">
                            <span className="material-symbols-outlined text-6xl text-primary" style={{ fontVariationSettings: "'wght' 300" }}>auto_awesome</span>
                        </div>
                        <div className="text-[#507c94] dark:text-[#87b3cd] text-sm font-bold uppercase tracking-widest mb-1">
                            Novos este Mês
                        </div>
                        <div className="text-4xl font-black text-primary dark:text-[#00D1FF] font-headline">
                            {displayNewThisMonth}
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-primary dark:text-primary-fixed font-bold text-sm">
                            <span className="material-symbols-outlined text-sm">check_circle</span>
                            <span>Meta mensal atingida</span>
                        </div>
                    </div>
                </div>

                {/* Filter & Table Area */}
                <div className="bg-surface-container-lowest dark:bg-slate-900 rounded-[2rem] shadow-sm border border-outline-variant/10 dark:border-slate-800 overflow-hidden">
                    {/* Filter Bar */}
                    <div className="p-6 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between border-b border-outline-variant/10 dark:border-slate-800">
                        {/* Search and Filters */}
                        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center w-full">
                            {/* Tabs */}
                            <div className="flex gap-2 p-1 bg-surface dark:bg-slate-950 rounded-2xl self-start">
                                <button
                                    onClick={() => setStatusFilter('all')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all select-none ${
                                        statusFilter === 'all'
                                            ? 'bg-white dark:bg-slate-800 text-primary dark:text-[#00D1FF] shadow-sm'
                                            : 'text-[#507c94] dark:text-[#87b3cd] hover:text-primary dark:hover:text-[#00D1FF]'
                                    }`}
                                >
                                    <span>Todos</span>
                                    <span className="bg-[#eff8ff] dark:bg-slate-900 px-2 py-0.5 rounded-full text-[10px] text-primary dark:text-[#00D1FF] font-bold">
                                        {(12480 + dbTotal).toLocaleString()}
                                    </span>
                                </button>
                                <button
                                    onClick={() => setStatusFilter('active')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all select-none ${
                                        statusFilter === 'active'
                                            ? 'bg-white dark:bg-slate-800 text-primary dark:text-[#00D1FF] shadow-sm'
                                            : 'text-[#507c94] dark:text-[#87b3cd] hover:text-primary dark:hover:text-[#00D1FF]'
                                    }`}
                                >
                                    <span>Ativos</span>
                                    <span className="bg-[#eff8ff] dark:bg-slate-900 px-2 py-0.5 rounded-full text-[10px] text-primary dark:text-[#00D1FF] font-bold">
                                        {(11200 + dbActive).toLocaleString()}
                                    </span>
                                </button>
                                <button
                                    onClick={() => setStatusFilter('inactive')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all select-none ${
                                        statusFilter === 'inactive'
                                            ? 'bg-white dark:bg-slate-800 text-primary dark:text-[#00D1FF] shadow-sm'
                                            : 'text-[#507c94] dark:text-[#87b3cd] hover:text-primary dark:hover:text-[#00D1FF]'
                                    }`}
                                >
                                    <span>Inativos</span>
                                    <span className="bg-[#eff8ff] dark:bg-slate-900 px-2 py-0.5 rounded-full text-[10px] text-primary dark:text-[#00D1FF] font-bold">
                                        {(1280 + dbInactive).toLocaleString()}
                                    </span>
                                </button>
                            </div>

                            {/* Search bar inside the table area */}
                            <div className="relative flex-1">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#507c94] text-lg pointer-events-none">
                                    search
                                </span>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Filtrar nesta lista por nome, e-mail ou ID..."
                                    className="w-full bg-surface dark:bg-slate-950 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 placeholder:text-[#507c94]/40 text-on-surface outline-none"
                                />
                            </div>
                        </div>

                        {/* List Actions */}
                        <div className="flex gap-2 self-end sm:self-auto">
                            <button className="p-2 text-[#507c94] dark:text-[#87b3cd] hover:text-primary dark:hover:text-[#00D1FF] hover:bg-surface-container dark:hover:bg-slate-800 rounded-xl transition-all" title="Filtrar">
                                <span className="material-symbols-outlined">filter_list</span>
                            </button>
                            <button className="p-2 text-[#507c94] dark:text-[#87b3cd] hover:text-primary dark:hover:text-[#00D1FF] hover:bg-surface-container dark:hover:bg-slate-800 rounded-xl transition-all" title="Ordenar">
                                <span className="material-symbols-outlined">sort_by_alpha</span>
                            </button>
                        </div>
                    </div>

                    {/* Table Wrapper */}
                    <div className="overflow-x-auto px-6 pb-6">
                        <table className="w-full text-left border-separate border-spacing-y-3 min-w-[700px]">
                            <thead className="text-[#507c94] dark:text-[#87b3cd] uppercase text-[11px] font-black tracking-widest">
                                <tr>
                                    <th className="px-6 pb-2">Aluno</th>
                                    <th className="px-6 pb-2">Contato</th>
                                    <th className="px-6 pb-2">Status</th>
                                    <th className="px-6 pb-2 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.length > 0 ? (
                                    filteredStudents.map((student) => (
                                        <tr key={student.id} className="group bg-white dark:bg-slate-900 hover:bg-primary/5 dark:hover:bg-[#00D1FF]/5 transition-colors shadow-sm">
                                            {/* Name and ID */}
                                            <td className="px-6 py-4 rounded-l-2xl border-y border-l border-outline-variant/10 dark:border-slate-800">
                                                <div className="flex items-center gap-4">
                                                    {student.avatar ? (
                                                        <img
                                                            alt={student.name}
                                                            className="w-12 h-12 rounded-full object-cover ring-2 ring-transparent group-hover:ring-primary/20 dark:group-hover:ring-[#00D1FF]/20 transition-all shadow-sm"
                                                            src={student.avatar}
                                                        />
                                                    ) : (
                                                        <div className="w-12 h-12 rounded-full kinetic-gradient text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-transparent group-hover:ring-primary/20">
                                                            {getInitials(student.name)}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="font-bold text-on-surface group-hover:text-primary dark:group-hover:text-[#00D1FF] transition-colors font-headline">
                                                            {student.name}
                                                        </div>
                                                        <div className="text-xs font-semibold text-[#507c94] dark:text-[#87b3cd]/70 mt-0.5">
                                                            ID: #PUV-{student.id}-2026
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Contact details */}
                                            <td className="px-6 py-4 text-sm font-medium border-y border-outline-variant/10 dark:border-slate-800">
                                                <div className="text-on-surface/90">{student.email}</div>
                                                <div className="text-xs text-[#507c94] dark:text-[#87b3cd]/70 mt-0.5">{student.phone || '(S/ Contato)'}</div>
                                            </td>

                                            {/* Status Badge */}
                                            <td className="px-6 py-4 border-y border-outline-variant/10 dark:border-slate-800">
                                                {student.status === 'active' ? (
                                                    <span className="bg-[#cdffd4] dark:bg-emerald-950/50 text-[#006a35] dark:text-emerald-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm border border-emerald-500/10">
                                                        ATIVO
                                                    </span>
                                                ) : (
                                                    <span className="bg-surface-container-high dark:bg-slate-850 text-[#507c94] dark:text-slate-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm border border-slate-500/10">
                                                        INATIVO
                                                    </span>
                                                )}
                                            </td>

                                            {/* Actions */}
                                            <td className="px-6 py-4 rounded-r-2xl border-y border-r border-outline-variant/10 dark:border-slate-800 text-right">
                                                <div className="flex justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                                    <button className="p-2 hover:bg-surface-container-low dark:hover:bg-slate-800 rounded-xl text-[#507c94] hover:text-primary dark:hover:text-[#00D1FF] transition-all hover:scale-105 active:scale-95" title="Visualizar">
                                                        <span className="material-symbols-outlined text-lg">visibility</span>
                                                    </button>
                                                    <button className="p-2 hover:bg-surface-container-low dark:hover:bg-slate-800 rounded-xl text-[#507c94] hover:text-primary dark:hover:text-[#00D1FF] transition-all hover:scale-105 active:scale-95" title="Editar">
                                                        <span className="material-symbols-outlined text-lg">edit</span>
                                                    </button>
                                                    <button className="p-2 hover:bg-surface-container-low dark:hover:bg-[#b31b25]/10 rounded-xl text-[#507c94] hover:text-error transition-all hover:scale-105 active:scale-95" title="Deletar">
                                                        <span className="material-symbols-outlined text-lg">delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-8 py-12 text-center text-[#507c94] dark:text-[#87b3cd]/70 font-semibold">
                                            <span className="material-symbols-outlined text-4xl block mb-2 opacity-50">search_off</span>
                                            Nenhum aluno encontrado correspondente aos filtros.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Footer */}
                    <div className="px-8 py-6 bg-surface-container-low/40 dark:bg-slate-900/60 border-t border-outline-variant/10 dark:border-slate-800 flex flex-col sm:flex-row gap-4 items-center justify-between">
                        <div className="text-sm text-[#507c94] dark:text-[#87b3cd] font-semibold">
                            Mostrando <span className="font-bold text-on-surface">1-{filteredStudents.length}</span> de <span className="font-bold text-on-surface">{(statusFilter === 'all' ? displayTotal : statusFilter === 'active' ? displayActive : displayInactive).toLocaleString()}</span> alunos
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-container-lowest dark:bg-slate-850 border border-outline-variant/20 dark:border-slate-800 text-[#507c94] hover:border-primary dark:hover:border-[#00D1FF] hover:text-primary dark:hover:text-[#00D1FF] transition-all disabled:opacity-40" disabled>
                                <span className="material-symbols-outlined text-lg">chevron_left</span>
                            </button>
                            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/20 select-none">
                                1
                            </button>
                            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-container-lowest dark:bg-slate-850 border border-outline-variant/20 dark:border-slate-800 text-[#507c94] hover:border-primary dark:hover:border-[#00D1FF] hover:text-primary dark:hover:text-[#00D1FF] transition-all select-none">
                                2
                            </button>
                            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-container-lowest dark:bg-slate-850 border border-outline-variant/20 dark:border-slate-800 text-[#507c94] hover:border-primary dark:hover:border-[#00D1FF] hover:text-primary dark:hover:text-[#00D1FF] transition-all select-none">
                                3
                            </button>
                            <span className="px-2 text-[#507c94] opacity-50">...</span>
                            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-container-lowest dark:bg-slate-850 border border-outline-variant/20 dark:border-slate-800 text-[#507c94] hover:border-primary dark:hover:border-[#00D1FF] hover:text-primary dark:hover:text-[#00D1FF] transition-all select-none">
                                {Math.ceil(displayTotal / 10)}
                            </button>
                            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-container-lowest dark:bg-slate-850 border border-outline-variant/20 dark:border-slate-800 text-[#507c94] hover:border-primary dark:hover:border-[#00D1FF] hover:text-primary dark:hover:text-[#00D1FF] transition-all">
                                <span className="material-symbols-outlined text-lg">chevron_right</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Matricular Novo Aluno Modal */}
            <Modal show={isCreateModalOpen} onClose={closeCreateModal} maxWidth="md">
                <form onSubmit={submit} className="p-6 space-y-6">
                    <div>
                        <h2 className="text-xl font-bold text-on-surface font-headline">
                            Matricular Novo Aluno
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">
                            Preencha os dados do estudante para realizar a matrícula.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <InputLabel htmlFor="name" value="Nome Completo" className="text-sm font-bold text-on-surface" />
                            <TextInput
                                id="name"
                                type="text"
                                name="name"
                                value={data.name}
                                className="mt-1 block w-full rounded-xl border-slate-200 focus:border-primary focus:ring-primary/20"
                                isFocused={true}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            <InputError message={errors.name} className="mt-1" />
                        </div>

                        <div>
                            <InputLabel htmlFor="email" value="E-mail" className="text-sm font-bold text-on-surface" />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full rounded-xl border-slate-200 focus:border-primary focus:ring-primary/20"
                                onChange={(e) => setData('email', e.target.value)}
                                required
                            />
                            <InputError message={errors.email} className="mt-1" />
                        </div>

                        <div>
                            <InputLabel htmlFor="phone" value="Telefone / WhatsApp" className="text-sm font-bold text-on-surface" />
                            <TextInput
                                id="phone"
                                type="text"
                                name="phone"
                                value={data.phone}
                                className="mt-1 block w-full rounded-xl border-slate-200 focus:border-primary focus:ring-primary/20"
                                placeholder="(11) 99999-9999"
                                onChange={(e) => setData('phone', e.target.value)}
                            />
                            <InputError message={errors.phone} className="mt-1" />
                        </div>

                        <div>
                            <InputLabel htmlFor="status" value="Status Inicial" className="text-sm font-bold text-on-surface" />
                            <select
                                id="status"
                                name="status"
                                value={data.status}
                                className="mt-1 block w-full rounded-xl border-slate-200 focus:border-primary focus:ring-primary/20 bg-white text-sm py-2 px-3 text-on-surface outline-none"
                                onChange={(e) => setData('status', e.target.value)}
                            >
                                <option value="active">Ativo</option>
                                <option value="inactive">Inativo</option>
                            </select>
                            <InputError message={errors.status} className="mt-1" />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={closeCreateModal}
                            className="px-4 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-5 py-2.5 rounded-xl text-sm font-bold bg-primary text-white shadow-md shadow-primary/10 hover:opacity-95 transition-all disabled:opacity-50"
                        >
                            Confirmar Matrícula
                        </button>
                    </div>
                </form>
            </Modal>
        </Layout>
    );
}

