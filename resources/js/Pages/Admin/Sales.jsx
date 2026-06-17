import AdminLayout from '@/Layouts/AdminLayout';
import SchoolAdminLayout from '@/Layouts/SchoolAdminLayout';
import { Head, usePage, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function Sales() {
    const { auth } = usePage().props;
    const user = auth.user;
    const isSchoolAdmin = user.role === 'school_admin';
    const Layout = isSchoolAdmin ? SchoolAdminLayout : AdminLayout;

    // Toast Notification
    const [notification, setNotification] = useState(null);

    // Filter states
    const [feedbackFilter, setFeedbackFilter] = useState('all'); // all, elogios, criticas
    const [searchQuery, setSearchQuery] = useState('');

    // Modals
    const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
    const [isReferralsModalOpen, setIsReferralsModalOpen] = useState(false);
    const [isFabModalOpen, setIsFabModalOpen] = useState(false);

    // Coupon Database state
    const [coupons, setCoupons] = useState([
        { id: 1, code: 'BLACKFRIDAY2024', name: '20% OFF em Cursos Tech', usages: 452, limit: 600, pct: 75, expiry: '12 dias', status: 'active', bg: 'primary' },
        { id: 2, code: 'BEMVINDO50', name: 'R$ 50 de Desconto', usages: 1284, limit: 'Ilimitado', pct: 42, expiry: 'Vitalício', status: 'active', bg: 'tertiary' },
        { id: 3, code: 'VERAO25', name: 'Combo Férias Ativo', usages: 89, limit: 500, pct: 15, expiry: 'Jan/2025', status: 'active', bg: 'secondary-dim' }
    ]);

    // Referrals Leaderboard
    const [referrals, setReferrals] = useState([
        { id: 1, name: 'Amanda Martins', location: 'Vila Velha - ES', count: 32, avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDltn0JGz6gU_TDGlaxUuLpW1hjmXMxhoFzH2P53llLo0q_l2mqRAv7M4v-0G-en4D1TxfBcrAKrF1a_7RgHxxXqSVjyUfkvBinCNpXSwe6700W2EchplbOMq2xLTaUXcw9cWXxyl-R0SZBOoMddREjmHVne98GyNz_95f8YnI0nS6knbxBk1kr4IomTib2uxrVVAIxb2hDUx3FCjNOzb0sOeWZyDhcZ-NKQaaBk5O6iviNHmnu9R6Eos6Ng4j9bwV8Uti9aEdXloVe' },
        { id: 2, name: 'Ricardo Costa', location: 'São Paulo - SP', count: 28, avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDPfsj0GEMdi_1aIThaDW0Ar7pZ6lzxPpeRmvA7nOXqnIW3k0YZnriNiCGPVFbe8Yry1ucFuojf0P2_p3jK55EpZlFdTu5eaNgpovdb615jasn4pJtEbQTqjQuQ60HVFrAMzwM_qj29Ud94BOLSGHqdg53rSbFmIvEpcEXsz-6jzS1LmsnAIkTTL-I55qMgDVQsKFMA4JiKw2HrPgFL2Fw_-nAQdexLYZZRwaiBH9xCd5qBEMDdGDca-DiXQMLaRz590qEn13L8OQe' },
        { id: 3, name: 'Leticia Nunes', location: 'Curitiba - PR', count: 25, avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-sacpJZSs83AWxcYH1JrQ3miqDMkOJPmWCKFggmvaWnJb-nGyHgM83kmqgM0kFwRFcGc_u0Vd7yR54mKRVpILa6ArtAraO9sIpoYk9j59EhOapzk5aWjvJO-RzHTqCNMJDzbgOKco6ILbcUbRM-IYQ6Y1QI-jwecOwTgnUdC1QSykfseLPdD2offUSCx4Rz1v9xyl6hI4vquEVwT02q--W9c4EqFtPalsT4q8gX5MG-2SK2LloYgbpDQI7FoPqVQewHHX4udLyBrg' }
    ]);

    // Feedbacks Feed
    const [feedbacks, setFeedbacks] = useState([
        { id: 1, name: 'João Delgado', initials: 'JD', stars: 5, date: '2 horas atrás', text: 'O conteúdo do curso de Gestão Esportiva superou minhas expectativas. A plataforma é muito intuitiva e o suporte responde rápido.', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBIJ63sxhLaPYpmM6mUN9IshwB7-qsqn-YdUyh8s6ZVrfBOXgZOOa5ls9CLeFJw7yOgxSH4qZRPk6DS6OL6PrSZhiozpSKLl3YGlVlvW-KSr53Z6i5msiHs_euwL31JHwlwXJMDcJ2khgwjC-smfBx73qrNCwnC0KvRMUo5CtCxCRu7vZ9XV3L-XG-mywDhlPb7UbDDhwFSco_hc_4tJ6nhkFUNUINKh2-WxLhhRCH1Uxwnrq_FI5-WacU_zJtCBvyKCT4g1n6MsIYJ' },
        { id: 2, name: 'Maria Silva', initials: 'MS', stars: 4, date: '5 horas atrás', text: 'Gostei muito do desconto que recebi por indicação. Já chamei mais dois amigos para a turma de 2025.', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbBCFNiVh938dBztpHdk0lvmhJAHhf3H4S0YNkbXJNFuhIV0I087jqiHfOP-bUMm_ZFpampCMTd-RfwPhDj7A7GGET-m6UOgLRyGcmIJSKYettV2aqVHWH0Tns7POO_zgC353sz-i4592OH6LsCEteSkXMbrjnuD1zY1xAS5zgRlvg7QsHpb7AO1XjKX3nNf0JGTFZQVtxIooEZjLeC35B_2nVF1ZLMmO49pFwXREUSAp2aMVdw59PtFx6j_PiY3B1Vad-XgAn8tOK' },
        { id: 3, name: 'Pedro Rocha', initials: 'PR', stars: 5, date: '1 dia atrás', text: 'O Black Friday facilitou minha entrada na Velocity. Estou ansioso para começar as aulas de desenvolvimento web no polo.', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAlnYaNllTm-4INmlZsT9BOFfHA5963AKL1jsN42QLOTTuW3OYshvbq4T6bFh8nqLYUIbPUoFkraZ9UOn3WWQkSOb1stxzp4I5HJ6dQTM9T5e5A5swYtTAcAB5Yzt5FJZXnkXjGeOvj2OmfN-Ya2vjTeT1DhTze48LYfX8dx5VFQx-jmBZdDp2H7QM4HAzujd0tV0WSG_8-XIBueZh3ektJW_k7XtZ34MWQl-7MIKyZYrE_ddgnz8AP9hjgXvOYfFNFutjYy-5v4Vk_' },
        { id: 4, name: 'Camila Sousa', initials: 'CS', stars: 2, date: '2 dias atrás', text: 'Tive problemas para acessar a plataforma no primeiro dia e perdi o início da aula inicial. O polo ajudou a redefinir, mas o aplicativo móvel falhou.', avatar: null },
        { id: 5, name: 'Ricardo Mendes', initials: 'RM', stars: 3, date: '3 dias atrás', text: 'O material de estudo é excelente, mas o polo físico de atendimento presencial fica muito distante do meu bairro principal.', avatar: null }
    ]);

    // Modal Forms State
    const [couponForm, setCouponForm] = useState({
        code: '',
        name: '',
        limit: '',
        expiry: 'Vitalício',
        category: 'Tech'
    });

    const [referralForm, setReferralForm] = useState({
        name: '',
        location: '',
        count: '1'
    });

    // Helper to trigger notification toasts
    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => {
            setNotification(null);
        }, 3500);
    };

    // Filter Feedbacks
    const filteredFeedbacks = feedbacks.filter(fb => {
        if (feedbackFilter === 'elogios') return fb.stars >= 4;
        if (feedbackFilter === 'criticas') return fb.stars <= 3;
        return true;
    });

    // Handle Create Coupon
    const handleCreateCoupon = (e) => {
        e.preventDefault();
        const { code, name, limit, expiry, category } = couponForm;
        if (!code || !name) {
            showNotification('Preencha o código do cupom e a descrição.', 'error');
            return;
        }

        const newId = coupons.length + 1;
        const color = category === 'Tech' ? 'primary' : category === 'Geral' ? 'tertiary' : 'secondary-dim';
        const limitVal = limit ? parseInt(limit) : 'Ilimitado';

        const newCp = {
            id: newId,
            code: code.toUpperCase().replace(/\s+/g, ''),
            name: name,
            usages: 0,
            limit: limitVal,
            pct: 0,
            expiry: expiry || 'Vitalício',
            status: 'active',
            bg: color
        };

        setCoupons([...coupons, newCp]);
        setIsCouponModalOpen(false);
        setCouponForm({ code: '', name: '', limit: '', expiry: 'Vitalício', category: 'Tech' });
        showNotification(`Cupom "${newCp.code}" criado com sucesso!`);
    };

    // Handle Create Referral Leaderboard manual addition
    const handleCreateReferral = (e) => {
        e.preventDefault();
        const { name, location, count } = referralForm;
        if (!name || !location) {
            showNotification('Preencha o nome do aluno e a localidade.', 'error');
            return;
        }

        const countVal = parseInt(count) || 1;
        const newId = referrals.length + 1;
        const newRef = {
            id: newId,
            name: name,
            location: location,
            count: countVal,
            avatar: null
        };

        setReferrals([newRef, ...referrals]);
        setIsReferralsModalOpen(false);
        setReferralForm({ name: '', location: '', count: '1' });
        showNotification(`Indicação de ${name} registrada! +${countVal} no ranking.`);
    };

    return (
        <Layout>
            <Head title="Gestão de Vendas | PlayUp Velocity" />

            <div className="max-w-7xl mx-auto p-8 space-y-8 animate-in fade-in duration-700 relative">
                {/* Toast Notification */}
                {notification && (
                    <div className={`fixed top-20 right-8 z-50 flex items-center gap-2 px-6 py-4 rounded-xl border shadow-xl animate-in slide-in-from-top-4 duration-300 ${notification.type === 'error'
                            ? 'bg-rose-50 dark:bg-rose-950/30 text-[#b31b25] border-rose-200 dark:border-rose-900/50'
                            : 'bg-emerald-50 dark:bg-emerald-950/30 text-[#006a35] dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50'
                        }`}>
                        <span className="material-symbols-outlined text-lg">
                            {notification.type === 'error' ? 'error' : 'check_circle'}
                        </span>
                        <span className="text-sm font-bold">{notification.message}</span>
                    </div>
                )}

                {/* Page Title & Hero */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <h2 className="text-4xl font-extrabold font-headline text-[#003346] dark:text-white tracking-tight leading-none mb-2">
                            Gestão de Vendas
                        </h2>
                        <p className="text-on-surface-variant dark:text-[#b5e3ff] font-medium text-lg max-w-2xl">
                            Controle cupons promocionais, indicações de amigos e os índices de satisfação NPS dos alunos.
                        </p>
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                        <button
                            onClick={() => showNotification('Relatórios consolidados salvos na pasta de downloads.')}
                            className="flex-1 md:flex-none bg-surface-container-low dark:bg-slate-800 text-primary dark:text-[#00D1FF] font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-surface-container-high dark:hover:bg-slate-700 transition-colors select-none"
                        >
                            <span className="material-symbols-outlined text-lg">download</span>
                            <span>Exportar</span>
                        </button>
                        <Link
                            href={route(isSchoolAdmin ? 'school-admin.students.interested.create' : 'admin.students.interested.create')}
                            className="flex-1 md:flex-none bg-primary text-white font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-primary/20 hover:opacity-95 active:scale-[0.98] transition-all select-none cursor-pointer text-center"
                        >
                            <span className="material-symbols-outlined text-lg">add_circle</span>
                            <span>Novo Interessado</span>
                        </Link>
                    </div>
                </div>

                {/* Main Bento Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Section 1: Coupons Panel (col-span-8) */}
                    <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-outline-variant/10 dark:border-slate-800 space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-primary-container/10 dark:bg-slate-800 flex items-center justify-center text-primary dark:text-[#00D1FF]">
                                    <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>confirmation_number</span>
                                </div>
                                <h3 className="text-xl font-extrabold font-headline text-[#003346] dark:text-white">Cupons de Desconto</h3>
                            </div>
                            <button
                                onClick={() => showNotification('Cupons filtrados por ordem de utilização recente.')}
                                className="text-sm font-bold text-primary dark:text-[#00D1FF] hover:underline"
                            >
                                Ver todos os cupons
                            </button>
                        </div>

                        {/* Coupons Sub-grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {coupons.map((cp) => (
                                <div
                                    key={cp.id}
                                    className="group relative overflow-hidden bg-surface-container-low dark:bg-slate-850/50 rounded-2xl p-5 hover:bg-[#c2e8ff]/40 dark:hover:bg-slate-800 transition-all border border-transparent hover:border-primary/20 dark:hover:border-slate-700"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <span className={`inline-block px-3 py-1 text-white text-[10px] font-black rounded-full mb-2 tracking-widest ${cp.bg === 'primary'
                                                    ? 'bg-primary'
                                                    : cp.bg === 'tertiary'
                                                        ? 'bg-tertiary'
                                                        : 'bg-secondary'
                                                }`}>
                                                {cp.code}
                                            </span>
                                            <h4 className="font-bold text-sm text-[#003346] dark:text-white">{cp.name}</h4>
                                        </div>
                                        <div className="text-right">
                                            <p className={`text-2xl font-black ${cp.bg === 'primary'
                                                    ? 'text-primary dark:text-[#00D1FF]'
                                                    : cp.bg === 'tertiary'
                                                        ? 'text-tertiary dark:text-emerald-400'
                                                        : 'text-secondary dark:text-cyan-400'
                                                }`}>{cp.usages.toLocaleString('pt-BR')}</p>
                                            <p className="text-[10px] uppercase font-bold text-[#003346]/50 dark:text-[#87b3cd] tracking-wider">Usos</p>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="w-full h-1.5 bg-[#eff8ff] dark:bg-slate-800 rounded-full overflow-hidden">
                                            <div className={`h-full rounded-full ${cp.bg === 'primary'
                                                    ? 'bg-primary'
                                                    : cp.bg === 'tertiary'
                                                        ? 'bg-tertiary'
                                                        : 'bg-secondary'
                                                }`} style={{ width: `${cp.pct}%` }}></div>
                                        </div>
                                        <div className="flex justify-between text-[11px] font-bold text-[#507c94] dark:text-[#87b3cd] opacity-80">
                                            <span>Limite: {cp.limit}</span>
                                            <span>Expira: {cp.expiry}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Create coupon card shortcut */}
                            <div
                                onClick={() => setIsCouponModalOpen(true)}
                                className="group relative overflow-hidden border-2 border-dashed border-outline-variant/30 dark:border-slate-800 rounded-2xl p-5 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary dark:hover:border-[#00D1FF] hover:bg-primary/5 dark:hover:bg-slate-800/20 transition-all min-h-[140px]"
                            >
                                <span className="material-symbols-outlined text-primary dark:text-[#00D1FF] text-3xl group-hover:scale-110 transition-transform">add_circle</span>
                                <span className="font-extrabold text-sm text-primary dark:text-[#00D1FF]">Criar Novo Cupom</span>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Referrals Panel (col-span-4) */}
                    <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-outline-variant/10 dark:border-slate-800 flex flex-col justify-between space-y-6">
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-tertiary/10 dark:bg-slate-800 flex items-center justify-center text-tertiary dark:text-emerald-400">
                                    <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>person_add</span>
                                </div>
                                <h3 className="text-xl font-extrabold font-headline text-[#003346] dark:text-white">Indicações</h3>
                            </div>

                            {/* Aggregates block */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-surface-container-low dark:bg-slate-850 p-4 rounded-2xl border border-outline-variant/5 dark:border-slate-800">
                                    <p className="text-[10px] uppercase font-black text-on-surface-variant dark:text-[#87b3cd] tracking-wider mb-1">Total Indicados</p>
                                    <p className="text-2xl font-black text-[#003346] dark:text-white">1.240</p>
                                </div>
                                <div className="bg-surface-container-low dark:bg-slate-850 p-4 rounded-2xl border border-outline-variant/5 dark:border-slate-800">
                                    <p className="text-[10px] uppercase font-black text-on-surface-variant dark:text-[#87b3cd] tracking-wider mb-1">Conversão</p>
                                    <p className="text-2xl font-black text-tertiary dark:text-emerald-400">24.8%</p>
                                </div>
                            </div>

                            {/* Top ranking indicators */}
                            <h4 className="text-xs font-black text-slate-500 dark:text-[#87b3cd] opacity-75 uppercase tracking-widest mb-4">Melhores Indicadores</h4>
                            <div className="space-y-4">
                                {referrals.map((rf, idx) => (
                                    <div
                                        key={rf.id}
                                        onClick={() => showNotification(`Detalhes de indicações de ${rf.name} (Simulado).`)}
                                        className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            {rf.avatar ? (
                                                <img alt={rf.name} className="w-9 h-9 rounded-full object-cover border-2 border-white dark:border-slate-800 shadow-sm" src={rf.avatar} />
                                            ) : (
                                                <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xs text-[#003346] dark:text-[#00D1FF]">
                                                    {rf.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                                                </div>
                                            )}
                                            <div>
                                                <p className="text-sm font-extrabold text-[#003346] dark:text-white">{rf.name}</p>
                                                <p className="text-[10px] text-on-surface-variant dark:text-[#87b3cd]">{rf.location}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-black text-primary dark:text-[#00D1FF]">{rf.count}</p>
                                            <p className="text-[9px] font-bold text-on-surface-variant dark:text-[#87b3cd] uppercase tracking-wider">Matrículas</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={() => setIsReferralsModalOpen(true)}
                            className="w-full py-3 bg-tertiary text-white text-xs font-extrabold rounded-xl hover:scale-[1.01] active:scale-95 transition-all cursor-pointer shadow-md shadow-emerald-500/10 flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined text-sm">workspace_premium</span>
                            <span>Novo Lançamento / Matrícula</span>
                        </button>
                    </div>

                    {/* Section 3: NPS & Satisfaction Feed (col-span-12) */}
                    <div className="col-span-12 bg-white dark:bg-slate-900 rounded-3xl p-6 lg:p-8 shadow-sm border border-outline-variant/10 dark:border-slate-800">
                        <div className="flex flex-col md:flex-row gap-12 items-stretch">

                            {/* NPS Gauge Ring chart */}
                            <div className="w-full md:w-1/3 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#eff8ff] to-[#c2e8ff] dark:from-slate-850 dark:to-slate-800/80 rounded-3xl relative overflow-hidden border border-outline-variant/5 dark:border-slate-800">
                                <div className="absolute top-0 right-0 p-4 opacity-5 dark:opacity-10 text-primary dark:text-[#00D1FF] pointer-events-none">
                                    <span className="material-symbols-outlined text-8xl" style={{ fontVariationSettings: "'FILL' 1" }}>sentiment_very_satisfied</span>
                                </div>
                                <h3 className="text-xs font-black text-primary dark:text-[#00D1FF] uppercase tracking-[0.2em] mb-4">NPS Global</h3>

                                <div className="relative w-40 h-40 flex items-center justify-center">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle className="text-slate-200 dark:text-slate-700" cx="80" cy="80" fill="transparent" r="70" stroke="currentColor" stroke-width="12"></circle>
                                        {/* 440 represents 2 * PI * R (R=70). 82% filled means dashoffset = 440 * (1 - 0.82) = 79.2 */}
                                        <circle className="text-primary dark:text-[#00D1FF]" cx="80" cy="80" fill="transparent" r="70" stroke="currentColor" stroke-dasharray="440" stroke-dashoffset="79" stroke-width="12"></circle>
                                    </svg>
                                    <div className="absolute flex flex-col items-center">
                                        <span className="text-5xl font-black text-[#003346] dark:text-white">82</span>
                                        <span className="text-[10px] font-bold text-primary dark:text-[#00D1FF] tracking-widest">PONTOS</span>
                                    </div>
                                </div>

                                <div className="mt-6 text-center z-10">
                                    <span className="px-4 py-1.5 bg-tertiary dark:bg-emerald-600 text-white text-xs font-black rounded-full shadow-md">ZONA DE EXCELÊNCIA</span>
                                    <p className="mt-3 text-xs text-[#003346]/70 dark:text-[#87b3cd] font-semibold">Baseado em 1.450 respostas este mês.</p>
                                </div>
                            </div>

                            {/* Feedbacks Feed list */}
                            <div className="w-full md:w-2/3 flex flex-col justify-between">
                                <div>
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                                        <h3 className="text-xl font-extrabold font-headline text-[#003346] dark:text-white">Feedbacks Recentes</h3>

                                        {/* Filter tabs */}
                                        <div className="flex gap-2">
                                            {[
                                                { value: 'all', label: 'TODOS' },
                                                { value: 'elogios', label: 'ELOGIOS' },
                                                { value: 'criticas', label: 'CRÍTICAS' }
                                            ].map((tab) => (
                                                <button
                                                    key={tab.value}
                                                    onClick={() => setFeedbackFilter(tab.value)}
                                                    className={`px-3 py-1.5 text-[10px] font-black rounded-full border cursor-pointer transition-all ${feedbackFilter === tab.value
                                                            ? 'bg-primary text-white border-primary shadow-sm'
                                                            : 'bg-slate-50 dark:bg-slate-850 text-slate-500 dark:text-[#87b3cd] border-outline-variant/15 dark:border-slate-800 hover:bg-slate-100'
                                                        }`}
                                                >
                                                    {tab.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Feed list */}
                                    <div className="space-y-4 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar divide-y divide-slate-100 dark:divide-slate-800">
                                        {filteredFeedbacks.length === 0 ? (
                                            <p className="text-center text-sm font-medium text-slate-400 dark:text-[#87b3cd] py-8">Nenhum feedback nesta categoria.</p>
                                        ) : (
                                            filteredFeedbacks.map((fb, idx) => (
                                                <div
                                                    key={fb.id}
                                                    className={`p-4 rounded-2xl bg-surface-container-low dark:bg-slate-850/30 border border-outline-variant/5 dark:border-slate-800/50 ${idx > 0 ? 'mt-4' : ''}`}
                                                >
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center gap-2">
                                                            {fb.avatar ? (
                                                                <img alt={fb.name} className="w-6 h-6 rounded-full object-cover shadow-sm" src={fb.avatar} />
                                                            ) : (
                                                                <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-extrabold text-[9px] text-[#003346] dark:text-[#00D1FF]">
                                                                    {fb.initials}
                                                                </div>
                                                            )}
                                                            <span className="text-sm font-extrabold text-[#003346] dark:text-white">{fb.name}</span>
                                                            <span className="text-[10px] text-on-surface-variant dark:text-[#87b3cd] font-semibold">• {fb.date}</span>
                                                        </div>
                                                        <div className="flex text-amber-500 dark:text-amber-400">
                                                            {Array.from({ length: 5 }).map((_, stIdx) => (
                                                                <span
                                                                    key={stIdx}
                                                                    className="material-symbols-outlined text-sm"
                                                                    style={stIdx < fb.stars ? { fontVariationSettings: "'FILL' 1" } : {}}
                                                                >
                                                                    star
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-on-surface-variant dark:text-[#87b3cd]/90 leading-relaxed italic">
                                                        "{fb.text}"
                                                    </p>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>

            </div>

            {/* Floating Action Button (FAB) */}
            <button
                onClick={() => setIsFabModalOpen(true)}
                className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-white rounded-2xl shadow-2xl flex items-center justify-center hover:scale-110 hover:rotate-6 active:scale-95 transition-all group cursor-pointer z-50 shadow-primary/40"
            >
                <span className="material-symbols-outlined text-2xl group-hover:rotate-90 transition-transform">bolt</span>
                <span className="absolute right-full mr-4 px-3 py-1.5 bg-[#003346] text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-md">
                    Ações Rápidas
                </span>
            </button>

            {/* Modal: Novo Cupom */}
            {isCouponModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-outline-variant/10 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-outline-variant/10 dark:border-slate-800 flex justify-between items-center bg-[#eff8ff] dark:bg-slate-900/60">
                            <h3 className="text-lg font-extrabold text-[#003346] dark:text-white font-headline">
                                Criar Novo Cupom
                            </h3>
                            <button
                                onClick={() => setIsCouponModalOpen(false)}
                                className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-850 text-slate-500 dark:text-white transition-colors"
                            >
                                <span className="material-symbols-outlined text-base">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleCreateCoupon} className="p-6 space-y-4">
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-[#003346] dark:text-white">Código do Cupom</label>
                                <input
                                    value={couponForm.code}
                                    onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value })}
                                    type="text"
                                    placeholder="Ex: VELOCITY30"
                                    className="w-full h-12 px-4 bg-[#eff8ff] dark:bg-slate-800 border-outline-variant/15 dark:border-slate-700 focus:ring-primary focus:border-primary dark:focus:ring-[#00D1FF] dark:focus:border-[#00D1FF] rounded-xl text-sm font-bold text-[#003346] dark:text-white"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-[#003346] dark:text-white">Descrição / Benefício</label>
                                <input
                                    value={couponForm.name}
                                    onChange={(e) => setCouponForm({ ...couponForm, name: e.target.value })}
                                    type="text"
                                    placeholder="Ex: 30% OFF em Cursos Tech"
                                    className="w-full h-12 px-4 bg-[#eff8ff] dark:bg-slate-800 border-outline-variant/15 dark:border-slate-700 focus:ring-primary focus:border-primary dark:focus:ring-[#00D1FF] dark:focus:border-[#00D1FF] rounded-xl text-sm text-[#003346] dark:text-white font-medium"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold text-[#003346] dark:text-white">Limite de Usos</label>
                                    <input
                                        value={couponForm.limit}
                                        onChange={(e) => setCouponForm({ ...couponForm, limit: e.target.value })}
                                        type="number"
                                        placeholder="Ex: 500 (Opcional)"
                                        className="w-full h-12 px-4 bg-[#eff8ff] dark:bg-slate-800 border-outline-variant/15 dark:border-slate-700 focus:ring-primary focus:border-primary dark:focus:ring-[#00D1FF] dark:focus:border-[#00D1FF] rounded-xl text-sm text-[#003346] dark:text-white"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold text-[#003346] dark:text-white">Validade</label>
                                    <input
                                        value={couponForm.expiry}
                                        onChange={(e) => setCouponForm({ ...couponForm, expiry: e.target.value })}
                                        type="text"
                                        placeholder="Ex: 15 dias, Jan/2025"
                                        className="w-full h-12 px-4 bg-[#eff8ff] dark:bg-slate-800 border-outline-variant/15 dark:border-slate-700 focus:ring-primary focus:border-primary dark:focus:ring-[#00D1FF] dark:focus:border-[#00D1FF] rounded-xl text-sm text-[#003346] dark:text-white font-bold"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-[#003346] dark:text-white">Categoria do Cupom</label>
                                <select
                                    value={couponForm.category}
                                    onChange={(e) => setCouponForm({ ...couponForm, category: e.target.value })}
                                    className="w-full h-12 px-4 bg-[#eff8ff] dark:bg-slate-800 border-outline-variant/15 dark:border-slate-700 focus:ring-primary focus:border-primary dark:focus:ring-[#00D1FF] dark:focus:border-[#00D1FF] rounded-xl text-sm text-[#003346] dark:text-white font-bold"
                                >
                                    <option value="Tech">Cursos Tecnologia (Tech)</option>
                                    <option value="Geral">Institucional Geral (Descontos Fixos)</option>
                                    <option value="Temporada">Promoção Sazonal (Temporada)</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3.5 bg-primary text-white text-xs font-extrabold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-95 transition-all mt-4 cursor-pointer"
                            >
                                Registrar Cupom Ativo
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal: Novo Lançamento de Indicação */}
            {isReferralsModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-outline-variant/10 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-outline-variant/10 dark:border-slate-800 flex justify-between items-center bg-[#eff8ff] dark:bg-slate-900/60">
                            <h3 className="text-lg font-extrabold text-[#003346] dark:text-white font-headline">
                                Registrar Matrícula por Indicação
                            </h3>
                            <button
                                onClick={() => setIsReferralsModalOpen(false)}
                                className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-850 text-slate-500 dark:text-white transition-colors"
                            >
                                <span className="material-symbols-outlined text-base">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleCreateReferral} className="p-6 space-y-4">
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-[#003346] dark:text-white">Nome do Aluno que Indicou</label>
                                <input
                                    value={referralForm.name}
                                    onChange={(e) => setReferralForm({ ...referralForm, name: e.target.value })}
                                    type="text"
                                    placeholder="Ex: Amanda Martins"
                                    className="w-full h-12 px-4 bg-[#eff8ff] dark:bg-slate-800 border-outline-variant/15 dark:border-slate-700 focus:ring-primary focus:border-primary dark:focus:ring-[#00D1FF] dark:focus:border-[#00D1FF] rounded-xl text-sm text-[#003346] dark:text-white font-bold"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold text-[#003346] dark:text-white">Polo / Cidade</label>
                                    <input
                                        value={referralForm.location}
                                        onChange={(e) => setReferralForm({ ...referralForm, location: e.target.value })}
                                        type="text"
                                        placeholder="Ex: São Paulo - SP"
                                        className="w-full h-12 px-4 bg-[#eff8ff] dark:bg-slate-800 border-outline-variant/15 dark:border-slate-700 focus:ring-primary focus:border-primary dark:focus:ring-[#00D1FF] dark:focus:border-[#00D1FF] rounded-xl text-sm text-[#003346] dark:text-white"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold text-[#003346] dark:text-white">Total Indicações Adicionais</label>
                                    <input
                                        value={referralForm.count}
                                        onChange={(e) => setReferralForm({ ...referralForm, count: e.target.value })}
                                        type="number"
                                        min="1"
                                        placeholder="1"
                                        className="w-full h-12 px-4 bg-[#eff8ff] dark:bg-slate-800 border-outline-variant/15 dark:border-slate-700 focus:ring-primary focus:border-primary dark:focus:ring-[#00D1FF] dark:focus:border-[#00D1FF] rounded-xl text-sm text-[#003346] dark:text-white font-bold"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3.5 bg-tertiary text-white text-xs font-extrabold rounded-xl shadow-lg shadow-emerald-500/20 hover:scale-[1.01] active:scale-95 transition-all mt-4 cursor-pointer"
                            >
                                Adicionar no Quadro de Vendas
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal: FAB Quick Actions */}
            {isFabModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl shadow-2xl border border-outline-variant/10 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-outline-variant/10 dark:border-slate-800 flex justify-between items-center bg-[#eff8ff] dark:bg-slate-900/60">
                            <h3 className="text-lg font-extrabold text-[#003346] dark:text-white font-headline">
                                Ações de Vendas Rápidas
                            </h3>
                            <button
                                onClick={() => setIsFabModalOpen(false)}
                                className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-850 text-slate-500 dark:text-white transition-colors"
                            >
                                <span className="material-symbols-outlined text-base">close</span>
                            </button>
                        </div>
                        <div className="p-6 space-y-4">

                            <button
                                onClick={() => {
                                    setIsFabModalOpen(false);
                                    showNotification('Link de indicação individual copiado para a área de transferência!');
                                }}
                                className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-xl transition-all text-left"
                            >
                                <div className="w-10 h-10 bg-primary/10 dark:bg-slate-800 text-primary dark:text-[#00D1FF] rounded-lg flex items-center justify-center">
                                    <span className="material-symbols-outlined text-base">share</span>
                                </div>
                                <div>
                                    <span className="block font-bold text-xs text-[#003346] dark:text-white">Gerar Link de Convite</span>
                                    <span className="text-[10px] text-slate-500 dark:text-[#87b3cd]">Link rápido para alunos enviarem a amigos</span>
                                </div>
                            </button>

                            <button
                                onClick={() => {
                                    setIsFabModalOpen(false);
                                    showNotification('Cupom relâmpago de 10% criado e ativo!');
                                }}
                                className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-xl transition-all text-left"
                            >
                                <div className="w-10 h-10 bg-tertiary/10 dark:bg-slate-800 text-tertiary dark:text-emerald-400 rounded-lg flex items-center justify-center">
                                    <span className="material-symbols-outlined text-base">percent</span>
                                </div>
                                <div>
                                    <span className="block font-bold text-xs text-[#003346] dark:text-white">Gerar Desconto Expresso</span>
                                    <span className="text-[10px] text-slate-500 dark:text-[#87b3cd]">Desconto relâmpago de 10% automático</span>
                                </div>
                            </button>

                            <button
                                onClick={() => {
                                    setIsFabModalOpen(false);
                                    showNotification('Dashboard de relatórios de conversão atualizado.');
                                }}
                                className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-xl transition-all text-left"
                            >
                                <div className="w-10 h-10 bg-amber-500/10 dark:bg-slate-800 text-amber-500 dark:text-amber-400 rounded-lg flex items-center justify-center">
                                    <span className="material-symbols-outlined text-base">campaign</span>
                                </div>
                                <div>
                                    <span className="block font-bold text-xs text-[#003346] dark:text-white">Enviar Campanha Email</span>
                                    <span className="text-[10px] text-slate-500 dark:text-[#87b3cd]">Notificar leads sobre cupons vigentes</span>
                                </div>
                            </button>

                        </div>
                    </div>
                </div>
            )}

        </Layout>
    );
}
