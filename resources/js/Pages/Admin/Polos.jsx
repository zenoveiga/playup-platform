import AdminLayout from '@/Layouts/AdminLayout';
import SchoolAdminLayout from '@/Layouts/SchoolAdminLayout';
import { Head, usePage, Link, router, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Polos({ polos = [] }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const isSchoolAdmin = user.role === 'school_admin';
    const Layout = isSchoolAdmin ? SchoolAdminLayout : AdminLayout;

    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); // all, active, inactive
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPolo, setEditingPolo] = useState(null);
    const [notification, setNotification] = useState(null);

    // Form inputs state managed via Inertia useForm
    const { data, setData, put, processing, errors } = useForm({
        name: '',
        responsible: '',
        phone: '',
        email: '',
        address: '',
        status: 'active',
    });

    // Show temporary notification
    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => {
            setNotification(null);
        }, 3000);
    };

    // Filter polos based on search and tab selections
    const filteredPolos = polos.filter(polo => {
        const matchesStatus =
            statusFilter === 'all' ||
            (statusFilter === 'active' && polo.status === 'active') ||
            (statusFilter === 'inactive' && polo.status === 'inactive');

        const query = searchQuery.toLowerCase();
        const matchesSearch =
            polo.name.toLowerCase().includes(query) ||
            (polo.city && polo.city.toLowerCase().includes(query)) ||
            (polo.state && polo.state.toLowerCase().includes(query)) ||
            polo.responsible.toLowerCase().includes(query) ||
            polo.code.toLowerCase().includes(query);

        return matchesStatus && matchesSearch;
    });

    // Active polos count
    const activeCount = polos.filter(p => p.status === 'active').length;

    const handleOpenEditModal = (polo) => {
        setEditingPolo(polo);
        setData({
            name: polo.name,
            responsible: polo.responsible,
            phone: polo.phone || '',
            email: polo.email || '',
            address: polo.address || '',
            status: polo.status,
        });
        setIsModalOpen(true);
    };

    const handleDeletePolo = (id) => {
        if (confirm('Tem certeza que deseja remover este polo?')) {
            router.delete(route(isSchoolAdmin ? 'school-admin.polos.destroy' : 'admin.polos.destroy', id), {
                onSuccess: () => showNotification('Polo removido com sucesso!', 'success')
            });
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();

        put(route(isSchoolAdmin ? 'school-admin.polos.update' : 'admin.polos.update', editingPolo.id), {
            onSuccess: () => {
                setIsModalOpen(false);
                showNotification('Polo atualizado com sucesso!');
            }
        });
    };

    return (
        <Layout>
            <Head title="Gestão de Polos | PlayUp Velocity" />

            <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700 relative">

                {/* Notification toast */}
                {notification && (
                    <div className="fixed top-20 right-8 z-50 flex items-center gap-2 px-6 py-4 rounded-xl bg-tertiary-container dark:bg-emerald-950 text-[#006a35] dark:text-[#6bfe9c] border border-tertiary/20 shadow-xl animate-in slide-in-from-top-4 duration-300">
                        <span className="material-symbols-outlined text-lg">check_circle</span>
                        <span className="text-sm font-bold">{notification.message}</span>
                    </div>
                )}

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-on-surface mb-2 font-headline">
                            Gestão de Polos
                        </h1>
                        <p className="text-[#507c94] dark:text-[#b5e3ff] font-medium">
                            Cadastre e gerencie as unidades de atendimento da sua Escola.
                        </p>
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                        <button className="flex-1 md:flex-none bg-surface-container-low dark:bg-slate-800 text-primary dark:text-[#00D1FF] font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-surface-container-high dark:hover:bg-slate-700 transition-colors select-none">
                            <span className="material-symbols-outlined text-lg">file_download</span>
                            <span>Exportar</span>
                        </button>
                        <Link
                            href={route(isSchoolAdmin ? 'school-admin.polos.create' : 'admin.polos.create')}
                            className="flex-1 md:flex-none bg-primary text-white font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-primary/20 hover:opacity-95 active:scale-[0.98] transition-all select-none cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-lg">add_location</span>
                            <span>Cadastrar Novo Polo</span>
                        </Link>
                    </div>
                </div>

                {/* Main section list */}
                <section className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-outline-variant/10 dark:border-slate-800 overflow-hidden">

                    {/* Toolbar / Filters */}
                    <div className="p-8 border-b border-outline-variant/10 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-primary-container/10 dark:bg-slate-800 flex items-center justify-center text-primary dark:text-[#00D1FF]">
                                <span className="material-symbols-outlined">list_alt</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-display font-bold text-[#003346] dark:text-white">Polos Cadastrados</h3>
                                <p className="text-sm text-[#507c94] dark:text-[#87b3cd] font-medium">Lista completa de unidades e performance</p>
                            </div>
                        </div>

                        {/* Search and Tabs */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                            {/* Search bar inside the table area */}
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#507c94] dark:text-[#87b3cd]/70 text-lg pointer-events-none">
                                    search
                                </span>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Buscar polo, cidade ou responsável..."
                                    className="w-full sm:w-64 bg-surface dark:bg-slate-950 border-none rounded-xl py-2 pl-10 pr-4 text-xs focus:ring-2 focus:ring-primary/20 placeholder:text-[#507c94]/40 text-[#003346] dark:text-white outline-none"
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
                                    <th className="px-8 py-4 text-xs font-black text-[#507c94] dark:text-[#87b3cd] uppercase tracking-widest">ID</th>
                                    <th className="px-6 py-4 text-xs font-black text-[#507c94] dark:text-[#87b3cd] uppercase tracking-widest">Polo / Cidade</th>
                                    <th className="px-6 py-4 text-xs font-black text-[#507c94] dark:text-[#87b3cd] uppercase tracking-widest">Responsável</th>
                                    <th className="px-6 py-4 text-xs font-black text-[#507c94] dark:text-[#87b3cd] uppercase tracking-widest text-center">Alunos Ativos</th>
                                    <th className="px-6 py-4 text-xs font-black text-[#507c94] dark:text-[#87b3cd] uppercase tracking-widest">Status</th>
                                    <th className="px-8 py-4 text-xs font-black text-[#507c94] dark:text-[#87b3cd] uppercase tracking-widest text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant/10 dark:divide-slate-800">
                                {filteredPolos.length > 0 ? (
                                    filteredPolos.map((polo) => {
                                        // Generate initials
                                        const initials = polo.responsible
                                            ? polo.responsible.trim().split(' ').map(n => n[0]).filter((_, i, arr) => i === 0 || i === arr.length - 1).join('').toUpperCase()
                                            : 'PL';

                                        // Try to extract city/state from name or address
                                        let cityState = 'Não Informado';
                                        if (polo.address) {
                                            const parts = polo.address.split(',');
                                            if (parts.length >= 3) {
                                                cityState = parts[parts.length - 1].trim();
                                            } else {
                                                cityState = polo.address;
                                            }
                                        }

                                        return (
                                            <tr key={polo.id} className="hover:bg-surface/30 dark:hover:bg-slate-800/30 transition-colors group">
                                                <td className="px-8 py-5 text-sm font-mono text-[#507c94] dark:text-[#87b3cd]/80">{polo.code}</td>
                                                <td className="px-6 py-5">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-[#003346] dark:text-white group-hover:text-primary dark:group-hover:text-[#00D1FF] transition-colors">{polo.name}</span>
                                                        <span className="text-xs text-[#507c94] dark:text-[#87b3cd]">{cityState}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-full bg-primary-container/20 flex items-center justify-center text-xs font-bold text-primary dark:text-[#00D1FF]">
                                                            {initials}
                                                        </div>
                                                        <span className="text-sm font-medium text-[#003346] dark:text-white">{polo.responsible}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <span className="text-sm font-black text-[#003346] dark:text-white">{polo.active_students}</span>
                                                        <div className="w-20 h-1 bg-surface dark:bg-slate-950 rounded-full mt-1 overflow-hidden">
                                                            <div
                                                                className={`h-full rounded-full ${polo.status === 'active' ? 'bg-[#006a35] dark:bg-emerald-400' : 'bg-[#507c94] dark:bg-slate-600'}`}
                                                                style={{ width: `${polo.capacity_pct}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    {polo.status === 'active' ? (
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#cdffd4] dark:bg-emerald-950 text-[#006a35] dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-[#006a35] dark:bg-emerald-400 animate-pulse"></span>
                                                            Ativo
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface dark:bg-slate-800 text-[#507c94]/70 dark:text-slate-400 text-[10px] font-black uppercase tracking-wider">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-[#507c94]/50 dark:bg-slate-600"></span>
                                                            Inativo
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-8 py-5 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => handleOpenEditModal(polo)}
                                                            className="p-2 rounded-lg hover:bg-primary/10 text-[#507c94] dark:text-[#87b3cd] hover:text-primary dark:hover:text-[#00D1FF] transition-all active:scale-90"
                                                            title="Editar"
                                                        >
                                                            <span className="material-symbols-outlined text-lg">edit</span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeletePolo(polo.id)}
                                                            className="p-2 rounded-lg hover:bg-error/10 text-[#507c94] dark:text-[#87b3cd] hover:text-error dark:hover:text-red-400 transition-all active:scale-90"
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
                                            Nenhum polo cadastrado correspondente aos filtros.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
                {/* Modal overlay to support EDIT Polo */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300">

                        <div
                            className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-outline-variant/10 dark:border-slate-800 animate-in zoom-in-95 duration-200"
                            onClick={(e) => e.stopPropagation()}
                        >

                            {/* Modal Header */}
                            <div className="px-8 py-6 bg-surface dark:bg-slate-950 flex items-center justify-between border-b border-outline-variant/10 dark:border-slate-850">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary dark:text-[#00D1FF] flex items-center justify-center">
                                        <span className="material-symbols-outlined">edit_square</span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-display font-bold text-[#003346] dark:text-white">
                                            Editar Polo
                                        </h3>
                                        <p className="text-xs text-[#507c94] dark:text-[#87b3cd]">Altere as informações da unidade de atendimento</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-[#507c94] dark:text-[#87b3cd] transition-colors"
                                >
                                    <span className="material-symbols-outlined text-md">close</span>
                                </button>
                            </div>

                            {/* Modal Form Content */}
                            <form onSubmit={handleFormSubmit} className="p-8 space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-[#507c94] dark:text-[#87b3cd] uppercase tracking-wider mb-2">Nome do Polo *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Ex: Polo São Paulo Jardins"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full bg-surface dark:bg-slate-950 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary placeholder:text-[#507c94]/40 text-[#003346] dark:text-white outline-none"
                                    />
                                    {errors.name && <p className="text-xs text-error mt-1">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-[#507c94] dark:text-[#87b3cd] uppercase tracking-wider mb-2">Responsável *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Ex: Ricardo Mendes"
                                        value={data.responsible}
                                        onChange={(e) => setData('responsible', e.target.value)}
                                        className="w-full bg-surface dark:bg-slate-950 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary placeholder:text-[#507c94]/40 text-[#003346] dark:text-white outline-none"
                                    />
                                    {errors.responsible && <p className="text-xs text-error mt-1">{errors.responsible}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-[#507c94] dark:text-[#87b3cd] uppercase tracking-wider mb-2">Telefone</label>
                                        <input
                                            type="tel"
                                            placeholder="(11) 99999-9999"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            className="w-full bg-surface dark:bg-slate-950 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary placeholder:text-[#507c94]/40 text-[#003346] dark:text-white outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-[#507c94] dark:text-[#87b3cd] uppercase tracking-wider mb-2">E-mail</label>
                                        <input
                                            type="email"
                                            placeholder="contato@polo.com"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="w-full bg-surface dark:bg-slate-950 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary placeholder:text-[#507c94]/40 text-[#003346] dark:text-white outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-[#507c94] dark:text-[#87b3cd] uppercase tracking-wider mb-2">Endereço Completo</label>
                                    <input
                                        type="text"
                                        placeholder="Rua, Número, Bairro, Cidade - UF"
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                        className="w-full bg-surface dark:bg-slate-950 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary placeholder:text-[#507c94]/40 text-[#003346] dark:text-white outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-[#507c94] dark:text-[#87b3cd] uppercase tracking-wider mb-2">Status da Unidade</label>
                                    <select
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        className="w-full bg-surface dark:bg-slate-950 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary text-[#003346] dark:text-white outline-none"
                                    >
                                        <option value="active">Ativo</option>
                                        <option value="inactive">Inativo</option>
                                    </select>
                                </div>

                                {/* Form Action Buttons */}
                                <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant/10 dark:border-slate-850">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-6 py-3 text-sm font-bold rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-[#507c94] dark:text-[#87b3cd] transition-all"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-8 py-3 kinetic-gradient text-white text-sm font-extrabold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
                                    >
                                        <span className="material-symbols-outlined text-sm">check</span>
                                        <span>{processing ? 'Salvando...' : 'Salvar Alterações'}</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}
