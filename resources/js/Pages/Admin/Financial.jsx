import AdminLayout from '@/Layouts/AdminLayout';
import SchoolAdminLayout from '@/Layouts/SchoolAdminLayout';
import { Head, usePage, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function Financial() {
    const { auth } = usePage().props;
    const user = auth.user;
    const isSchoolAdmin = user.role === 'school_admin';
    const Layout = isSchoolAdmin ? SchoolAdminLayout : AdminLayout;

    // Toast Notification State
    const [notification, setNotification] = useState(null);

    // Search and Status Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); // all, confirmado, pendente, atrasado

    // Cashier (Caixa) Drawer State
    const [cashDrawerOpen, setCashDrawerOpen] = useState(true);
    const [cashBalance, setCashBalance] = useState(45892.10);

    // Modal Visibility States
    const [isOverdueModalOpen, setIsOverdueModalOpen] = useState(false);
    const [isCaixaModalOpen, setIsCaixaModalOpen] = useState(false);
    const [isRecebimentoModalOpen, setIsRecebimentoModalOpen] = useState(false);
    const [isSlipsModalOpen, setIsSlipsModalOpen] = useState(false);

    // Mock Recent Transactions Data
    const [transactions, setTransactions] = useState([
        { id: 1, name: 'Arthur Camargo', method: 'Pix', amount: 350.00, date: 'Hoje, 10:15', status: 'confirmado' },
        { id: 2, name: 'Beatriz Lima', method: 'Boleto', amount: 420.00, date: 'Vence amanhã', status: 'pendente' },
        { id: 3, name: 'Gustavo Santos', method: 'Cartão de Crédito', amount: 350.00, date: 'Ontem, 17:30', status: 'confirmado' },
        { id: 4, name: 'Mariana Silva', method: 'Pix', amount: 290.00, date: 'Venceu há 5 dias', status: 'atrasado' },
        { id: 5, name: 'Daniel Souza', method: 'Dinheiro', amount: 450.00, date: '15 Jun, 14:00', status: 'confirmado' },
        { id: 6, name: 'Carolina Costa', method: 'Boleto', amount: 420.00, date: 'Vence em 3 dias', status: 'pendente' }
    ]);

    // Mock Overdue Installments Details
    const overdueList = [
        { id: 101, name: 'Mariana Silva', document: 'Mensalidade Jun/2026', delayDays: 5, amount: 290.00 },
        { id: 102, name: 'Ricardo Mendonça', document: 'Mensalidade Mai/2026', delayDays: 35, amount: 350.00 },
        { id: 103, name: 'Lucas Costa', document: 'Mensalidade Abr/2026', delayDays: 65, amount: 420.00 },
        { id: 104, name: 'Amanda Ferreira', document: 'Mensalidade Jun/2026', delayDays: 12, amount: 350.00 },
        { id: 105, name: 'Matheus Vieira', document: 'Mensalidade Jun/2026', delayDays: 8, amount: 420.00 }
    ];

    // Form inputs for Recebimento Modal
    const [recebimentoForm, setRecebimentoForm] = useState({
        studentName: '',
        amount: '',
        method: 'Pix'
    });

    // Form inputs for Carnê Modal
    const [slipsForm, setSlipsForm] = useState({
        studentName: '',
        course: '',
        installments: '12',
        value: ''
    });

    // Form inputs for Cashier Adjustment Modal
    const [caixaAdjustValue, setCaixaAdjustValue] = useState('');
    const [caixaAdjustType, setCaixaAdjustType] = useState('add'); // add, remove

    // Notification Helper
    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => {
            setNotification(null);
        }, 3500);
    };

    // Confirm a single pending/overdue transaction
    const handleConfirmPayment = (id, studentName, amount) => {
        setTransactions(prev =>
            prev.map(t => (t.id === id ? { ...t, status: 'confirmado', date: 'Agora mesmo' } : t))
        );
        setCashBalance(prev => prev + amount);
        showNotification(`Recebimento de R$ ${amount.toFixed(2)} de ${studentName} confirmado!`);
    };

    // Clear alert trigger
    const handleSendAlert = (studentName) => {
        showNotification(`Alerta de cobrança enviado para ${studentName} via WhatsApp e Email.`);
    };

    // Quick cash register drawer action
    const handleToggleCaixa = () => {
        setIsCaixaModalOpen(true);
    };

    const confirmToggleCaixa = () => {
        setCashDrawerOpen(!cashDrawerOpen);
        setIsCaixaModalOpen(false);
        showNotification(
            `Caixa ${!cashDrawerOpen ? 'ABERTO' : 'FECHADO'} com sucesso.`,
            !cashDrawerOpen ? 'success' : 'warning'
        );
    };

    // Submit Cash Adjustments (Sangria ou Entrada)
    const handleAdjustCash = (e) => {
        e.preventDefault();
        const numVal = parseFloat(caixaAdjustValue);
        if (isNaN(numVal) || numVal <= 0) {
            showNotification('Digite um valor numérico válido.', 'error');
            return;
        }

        if (caixaAdjustType === 'remove' && numVal > cashBalance) {
            showNotification('Saldo insuficiente para realizar sangria.', 'error');
            return;
        }

        const delta = caixaAdjustType === 'add' ? numVal : -numVal;
        setCashBalance(prev => prev + delta);
        setCaixaAdjustValue('');
        setIsCaixaModalOpen(false);
        showNotification(
            caixaAdjustType === 'add'
                ? `Depósito de R$ ${numVal.toFixed(2)} adicionado ao caixa!`
                : `Retirada (Sangria) de R$ ${numVal.toFixed(2)} efetuada!`
        );
    };

    // Register a Manual Transaction
    const handleCreateRecebimento = (e) => {
        e.preventDefault();
        const { studentName, amount, method } = recebimentoForm;
        const numVal = parseFloat(amount);

        if (!studentName || isNaN(numVal) || numVal <= 0) {
            showNotification('Preencha o nome do aluno e o valor do recebimento.', 'error');
            return;
        }

        // Add to transaction log
        const newId = transactions.length + 1;
        const newTx = {
            id: newId,
            name: studentName,
            method: method,
            amount: numVal,
            date: 'Agora mesmo',
            status: 'confirmado'
        };

        setTransactions([newTx, ...transactions]);
        setCashBalance(prev => prev + numVal);
        setIsRecebimentoModalOpen(false);
        setRecebimentoForm({ studentName: '', amount: '', method: 'Pix' });
        showNotification(`Recebimento manual de R$ ${numVal.toFixed(2)} registrado com sucesso!`);
    };

    // Generate Carnê
    const handleGenerateSlips = (e) => {
        e.preventDefault();
        const { studentName, course, installments, value } = slipsForm;
        const numVal = parseFloat(value);

        if (!studentName || !course || isNaN(numVal) || numVal <= 0) {
            showNotification('Selecione o aluno, curso e o valor da mensalidade.', 'error');
            return;
        }

        setIsSlipsModalOpen(false);
        setSlipsForm({ studentName: '', course: '', installments: '12', value: '' });
        showNotification(`Carnê de ${installments}x de R$ ${numVal.toFixed(2)} gerado para ${studentName}!`);
    };

    // Filtered Recent Transactions list
    const filteredTransactions = transactions.filter(t => {
        if (statusFilter !== 'all' && t.status !== statusFilter) return false;
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return (
                t.name.toLowerCase().includes(query) ||
                t.method.toLowerCase().includes(query) ||
                t.amount.toString().includes(query)
            );
        }
        return true;
    });

    return (
        <Layout>
            <Head title="Gestão Financeira | PlayUp Velocity" />

            <div className="max-w-7xl mx-auto p-8 space-y-10 animate-in fade-in duration-700 relative">
                {/* Toast Notification */}
                {notification && (
                    <div className={`fixed top-20 right-8 z-50 flex items-center gap-2 px-6 py-4 rounded-xl border shadow-xl animate-in slide-in-from-top-4 duration-300 ${
                        notification.type === 'error'
                            ? 'bg-rose-50 dark:bg-rose-955 text-[#b31b25] border-rose-200 dark:border-rose-900/50'
                            : notification.type === 'warning'
                            ? 'bg-amber-50 dark:bg-amber-955 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-900/50'
                            : 'bg-emerald-50 dark:bg-emerald-955 text-[#006a35] dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50'
                    }`}>
                        <span className="material-symbols-outlined text-lg">
                            {notification.type === 'error' ? 'error' : notification.type === 'warning' ? 'warning' : 'check_circle'}
                        </span>
                        <span className="text-sm font-bold">{notification.message}</span>
                    </div>
                )}

                {/* Header Title */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                    <div className="space-y-1">
                        <h1 className="text-[#003346] dark:text-white font-extrabold text-3xl font-headline tracking-tight">Gestão Financeira</h1>
                        <p className="text-on-surface-variant dark:text-outline-variant font-medium">Fluxo de Caixa e Controle de Recebimentos</p>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <div 
                            onClick={handleToggleCaixa}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm shadow-sm border border-tertiary/10 cursor-pointer select-none ${
                                cashDrawerOpen 
                                    ? 'bg-tertiary-container text-on-tertiary-container' 
                                    : 'bg-rose-100 text-[#b31b25]'
                            }`}
                        >
                            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                                {cashDrawerOpen ? 'account_balance_wallet' : 'lock'}
                            </span>
                            <span>{cashDrawerOpen ? 'Caixa Aberto' : 'Caixa Fechado'}</span>
                        </div>
                        <button 
                            onClick={() => setIsRecebimentoModalOpen(true)}
                            className="bg-[#00D1FF] hover:bg-sky-400 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-sky-400/20 cursor-pointer active:scale-95"
                        >
                            <span className="material-symbols-outlined text-lg">add</span> 
                            <span>Nova Operação</span>
                        </button>
                    </div>
                </div>

                {/* KPI Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* KPI 1: Parcelas Vencidas */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-outline-variant/15 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="w-10 h-10 rounded-full bg-error-container/10 text-error flex items-center justify-center mb-4">
                                    <span className="material-symbols-outlined">warning</span>
                                </div>
                                <p className="text-[10px] text-on-surface-variant dark:text-outline-variant font-bold uppercase tracking-wider">Parcelas Vencidas</p>
                            </div>
                            <button 
                                onClick={() => setIsOverdueModalOpen(true)}
                                className="text-xs font-extrabold text-primary dark:text-[#00D1FF] hover:underline cursor-pointer"
                            >
                                Ver Alunos
                            </button>
                        </div>
                        <div className="mt-4">
                            <h3 className="text-2xl font-bold font-headline text-on-surface dark:text-white">R$ 12.450,00</h3>
                            <p className="text-[10px] text-error font-bold flex items-center gap-1">
                                <span className="material-symbols-outlined text-xs">group</span>
                                42 Alunos em atraso
                            </p>
                        </div>
                    </div>

                    {/* KPI 2: Total Inadimplentes */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-outline-variant/15 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="w-10 h-10 rounded-full bg-primary-container/10 text-primary dark:text-[#00D1FF] flex items-center justify-center mb-4">
                                    <span className="material-symbols-outlined">trending_down</span>
                                </div>
                                <p className="text-[10px] text-on-surface-variant dark:text-outline-variant font-bold uppercase tracking-wider">Total Inadimplentes</p>
                            </div>
                            <button 
                                onClick={() => showNotification("Projeção de pagamento saudável baseada em Pix (84.2%).", "warning")}
                                className="text-xs font-extrabold text-primary dark:text-[#00D1FF] hover:underline cursor-pointer"
                            >
                                Detalhes
                            </button>
                        </div>
                        <div className="mt-4">
                            <h3 className="text-2xl font-bold font-headline text-on-surface dark:text-white">15.8%</h3>
                            <p className="text-[10px] text-on-surface-variant dark:text-[#87b3cd] font-bold flex items-center gap-1">
                                <span className="material-symbols-outlined text-xs text-tertiary">arrow_downward</span>
                                -2% em relação ao mês anterior
                            </p>
                        </div>
                    </div>

                    {/* KPI 3: Saldo em Caixa */}
                    <div className="bg-gradient-to-br from-primary to-primary-dim p-6 rounded-2xl shadow-xl flex flex-col justify-between text-on-primary">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mb-4">
                                    <span className="material-symbols-outlined">account_balance_wallet</span>
                                </div>
                                <p className="text-[10px] opacity-80 font-bold uppercase tracking-wider">Saldo em Caixa Hoje</p>
                            </div>
                            <button 
                                onClick={() => setIsCaixaModalOpen(true)}
                                className="text-xs font-extrabold text-white hover:underline cursor-pointer opacity-90 hover:opacity-100"
                            >
                                Ajustes
                            </button>
                        </div>
                        <div className="mt-4">
                            <h3 className="text-2xl font-bold font-headline">
                                R$ {cashBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </h3>
                            <p className="text-[10px] opacity-90 font-bold">+ R$ 3.200,00 hoje</p>
                        </div>
                    </div>
                </div>

                {/* Grouped Work Context Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* GESTÃO DE COBRANÇA */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-6 bg-[#00D1FF] rounded-full"></div>
                            <h2 className="text-on-surface dark:text-white font-bold text-sm font-headline uppercase tracking-wide">Gestão de Cobrança</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <button 
                                onClick={() => setIsSlipsModalOpen(true)}
                                className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-outline-variant/10 dark:border-slate-800 shadow-sm hover:shadow-md transition-all text-center flex flex-col items-center gap-3 group cursor-pointer hover:-translate-y-0.5"
                            >
                                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-955/40 text-primary dark:text-[#00D1FF] flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                                    <span className="material-symbols-outlined text-2xl">receipt_long</span>
                                </div>
                                <p className="font-bold text-[10px] text-on-surface dark:text-white leading-tight">Gerar Carnê</p>
                            </button>
                            
                            <button 
                                onClick={() => setIsOverdueModalOpen(true)}
                                className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-outline-variant/10 dark:border-slate-800 shadow-sm hover:shadow-md transition-all text-center flex flex-col items-center gap-3 group cursor-pointer hover:-translate-y-0.5"
                            >
                                <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-955/40 text-red-600 dark:text-red-400 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-all">
                                    <span className="material-symbols-outlined text-2xl">event_busy</span>
                                </div>
                                <p className="font-bold text-[10px] text-on-surface dark:text-white leading-tight">Parcelas Vencidas</p>
                            </button>

                            <button 
                                onClick={() => setIsOverdueModalOpen(true)}
                                className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-outline-variant/10 dark:border-slate-800 shadow-sm hover:shadow-md transition-all text-center flex flex-col items-center gap-3 group cursor-pointer hover:-translate-y-0.5"
                            >
                                <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-all">
                                    <span className="material-symbols-outlined text-2xl">person_remove</span>
                                </div>
                                <p className="font-bold text-[10px] text-on-surface dark:text-white leading-tight">Inadimplentes</p>
                            </button>

                            <button 
                                onClick={() => showNotification("Visualizando histórico de cancelamentos...", "info")}
                                className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-outline-variant/10 dark:border-slate-800 shadow-sm hover:shadow-md transition-all text-center flex flex-col items-center gap-3 group cursor-pointer hover:-translate-y-0.5"
                            >
                                <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 flex items-center justify-center group-hover:bg-slate-500 group-hover:text-white transition-all">
                                    <span className="material-symbols-outlined text-2xl">cancel</span>
                                </div>
                                <p className="font-bold text-[10px] text-on-surface dark:text-white leading-tight">Cancelamentos</p>
                            </button>
                        </div>
                    </section>

                    {/* OPERAÇÕES FINANCEIRAS */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-6 bg-[#00D1FF] rounded-full"></div>
                            <h2 className="text-on-surface dark:text-white font-bold text-sm font-headline uppercase tracking-wide">Operações Financeiras</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <button 
                                onClick={() => setIsRecebimentoModalOpen(true)}
                                className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-outline-variant/10 dark:border-slate-800 shadow-sm hover:shadow-md transition-all text-center flex flex-col items-center gap-3 group cursor-pointer hover:-translate-y-0.5"
                            >
                                <div className="w-12 h-12 rounded-xl bg-green-50 dark:bg-emerald-955/40 text-green-600 dark:text-emerald-400 flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-all">
                                    <span className="material-symbols-outlined text-2xl">payments</span>
                                </div>
                                <p className="font-bold text-[10px] text-on-surface dark:text-white leading-tight">Recebimentos</p>
                            </button>

                            <button 
                                onClick={() => setIsCaixaModalOpen(true)}
                                className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-outline-variant/10 dark:border-slate-800 shadow-sm hover:shadow-md transition-all text-center flex flex-col items-center gap-3 group cursor-pointer hover:-translate-y-0.5"
                            >
                                <div className="w-12 h-12 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 flex items-center justify-center group-hover:bg-cyan-600 group-hover:text-white transition-all">
                                    <span className="material-symbols-outlined text-2xl">point_of_sale</span>
                                </div>
                                <p className="font-bold text-[10px] text-on-surface dark:text-white leading-tight">Caixa</p>
                            </button>

                            <button 
                                onClick={() => showNotification("Visualizando contratos e planos acadêmicos...", "info")}
                                className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-outline-variant/10 dark:border-slate-800 shadow-sm hover:shadow-md transition-all text-center flex flex-col items-center gap-3 group col-span-2 cursor-pointer hover:-translate-y-0.5"
                            >
                                <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                    <span className="material-symbols-outlined text-2xl">history_edu</span>
                                </div>
                                <p className="font-bold text-[10px] text-on-surface dark:text-white leading-tight">Contratos</p>
                            </button>
                        </div>
                    </section>

                    {/* RELATÓRIOS E ANÁLISES */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-6 bg-[#00D1FF] rounded-full"></div>
                            <h2 className="text-on-surface dark:text-white font-bold text-sm font-headline uppercase tracking-wide">Relatórios e Análises</h2>
                        </div>
                        <div className="space-y-3">
                            <button 
                                onClick={() => showNotification("Balanço financeiro consolidado exportado com sucesso!")}
                                className="w-full bg-white dark:bg-slate-900 p-4 rounded-2xl border border-outline-variant/10 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex items-center gap-4 group cursor-pointer hover:-translate-y-0.5"
                            >
                                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-955/40 text-primary dark:text-[#00D1FF] flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined">assessment</span>
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-[10px] text-on-surface dark:text-white leading-tight">Relatório Geral</p>
                                    <p className="text-[8px] text-on-surface-variant dark:text-outline-variant font-medium">Balanço mensal e anual</p>
                                </div>
                            </button>

                            <button 
                                onClick={() => showNotification("Exportando análise de novas matrículas...")}
                                className="w-full bg-white dark:bg-slate-900 p-4 rounded-2xl border border-outline-variant/10 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex items-center gap-4 group cursor-pointer hover:-translate-y-0.5"
                            >
                                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined">how_to_reg</span>
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-[10px] text-on-surface dark:text-white leading-tight">Relatório de Matrículas</p>
                                    <p className="text-[8px] text-on-surface-variant dark:text-outline-variant font-medium">Novos alunos vs. Perda</p>
                                </div>
                            </button>

                            <button 
                                onClick={() => showNotification("Relatório de bolsistas e descontos gerado com sucesso!")}
                                className="w-full bg-white dark:bg-slate-900 p-4 rounded-2xl border border-outline-variant/10 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex items-center gap-4 group cursor-pointer hover:-translate-y-0.5"
                            >
                                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined">workspace_premium</span>
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-[10px] text-on-surface dark:text-white leading-tight">Relatório Bolsista</p>
                                    <p className="text-[8px] text-on-surface-variant dark:text-outline-variant font-medium">Gestão de descontos e bolsas</p>
                                </div>
                            </button>
                        </div>
                    </section>
                </div>

                {/* Bottom Data Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-10">
                    {/* Transactions List */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-outline-variant/10 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-outline-variant/5 dark:border-slate-800 flex items-center justify-between">
                            <h2 className="text-on-surface dark:text-white font-bold text-lg font-headline">Transações Recentes</h2>
                            <button 
                                onClick={() => {
                                    setSearchQuery('');
                                    setStatusFilter('all');
                                    showNotification("Mostrando todas as transações.");
                                }}
                                className="text-xs text-primary dark:text-[#00D1FF] font-bold hover:underline cursor-pointer"
                            >
                                Ver todas
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-surface-container-low/30 dark:bg-slate-950/40">
                                    <tr>
                                        <th className="px-6 py-4 text-[10px] text-on-surface-variant dark:text-outline-variant font-bold uppercase">Aluno</th>
                                        <th className="px-6 py-4 text-[10px] text-on-surface-variant dark:text-outline-variant font-bold uppercase">Valor</th>
                                        <th className="px-6 py-4 text-[10px] text-on-surface-variant dark:text-outline-variant font-bold uppercase text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-outline-variant/5 dark:divide-slate-800">
                                    {filteredTransactions.map((tx) => (
                                        <tr key={tx.id} className="hover:bg-surface-container-low/20 dark:hover:bg-slate-800/20 transition-colors">
                                            <td className="px-6 py-4 flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center font-bold text-xs text-blue-700 dark:text-blue-300">
                                                    {tx.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                                                </div>
                                                <span className="text-xs font-bold text-[#003346] dark:text-white">{tx.name}</span>
                                            </td>
                                            <td className="px-6 py-4 text-xs font-bold text-on-surface dark:text-slate-200">
                                                R$ {tx.amount.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase ${
                                                    tx.status === 'confirmado'
                                                        ? 'bg-green-100 text-green-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                                                        : tx.status === 'atrasado'
                                                        ? 'bg-rose-100 text-[#b31b25] dark:bg-rose-950/40 dark:text-rose-400'
                                                        : 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                                                }`}>
                                                    {tx.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Insights/Visual Section */}
                    <div className="relative h-full rounded-2xl overflow-hidden shadow-sm group min-h-[300px]">
                        <img 
                            alt="Dashboard data visualization" 
                            className="w-full h-full object-cover absolute inset-0" 
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbtuv0ZeUSLmZpjIX3kIGzgFXEN-eyiMp2xAsnJlgh5T5UxLSbaXhEymXKutQapoxYYH8XJVPnftxmWZDc_PHEJHJEV3ro-tL8KS2Esaf6vQF3yLZYsitVmH1Y4EZG2Elznx4P6x8jXs3WwCvfZDgf9l74HkvWr8gFOSJIlSI8q2j9X7taQAnJuNvQRhQ8PAmfY5FLWwOhQG6yboL9tYQJtD5oTfarGtQXq4SUpknQi87M1GG3Gx5DfBu98mDgFmRKrwTNIU5flh86"
                        />
                        <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px] flex items-center justify-center p-6">
                            <div className="text-center p-6 bg-white/90 dark:bg-slate-900/90 rounded-2xl shadow-2xl max-w-[90%]">
                                <span className="material-symbols-outlined text-primary dark:text-[#00D1FF] text-4xl mb-2">insights</span>
                                <h4 className="font-bold text-on-surface dark:text-white text-sm mb-1">Visão Analítica de Fluxo</h4>
                                <p className="text-[10px] text-on-surface-variant dark:text-outline-variant mb-4 leading-tight">Explore projeções financeiras e tendências de inadimplência para os próximos meses.</p>
                                <button 
                                    onClick={() => showNotification("Abrindo painel analítico de fluxo de caixa e inadimplência...", "info")}
                                    className="bg-primary hover:bg-primary-dim text-white px-6 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
                                >
                                    Explorar Insights
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Shell */}
                <footer className="p-8 bg-surface-container dark:bg-slate-900/50 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-6 border border-outline-variant/10 dark:border-slate-800">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm">
                            <span className="material-symbols-outlined text-primary dark:text-[#00D1FF] text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                        </div>
                        <div>
                            <h4 className="font-extrabold text-[#003346] dark:text-white font-headline text-sm">PlayUp Velocity</h4>
                            <p className="text-[10px] text-on-surface-variant dark:text-outline-variant font-medium">Impulsionando o crescimento da Kinetic Academy</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button 
                            onClick={() => showNotification("Redirecionando para canal de suporte técnico...", "info")}
                            className="px-6 py-2 bg-white dark:bg-slate-800 text-on-surface dark:text-white text-xs font-bold rounded-xl hover:bg-surface-container-low transition-colors border border-outline-variant/20 dark:border-slate-700 cursor-pointer"
                        >
                            Suporte
                        </button>
                        <button 
                            onClick={() => showNotification("Acessando portal de ajuda e documentação...", "info")}
                            className="px-6 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-dim transition-colors shadow-lg shadow-primary/20 cursor-pointer"
                        >
                            Portal de Ajuda
                        </button>
                    </div>
                </footer>
            </div>

            {/* Floating Action Button for Support */}
            <button 
                onClick={() => showNotification("Abrindo chat de suporte financeiro...", "info")}
                className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 cursor-pointer"
            >
                <span className="material-symbols-outlined text-3xl">support_agent</span>
            </button>

            {/* Overdue Students Modal */}
            {isOverdueModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-outline-variant/10 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-outline-variant/10 dark:border-slate-800 flex justify-between items-center bg-[#eff8ff] dark:bg-slate-900/60">
                            <div>
                                <h3 className="text-xl font-extrabold text-[#003346] dark:text-white font-headline">
                                    Alunos em Inadimplência
                                </h3>
                                <p className="text-xs font-semibold text-slate-500 dark:text-outline-variant mt-0.5">
                                    Lista detalhada de faturas e mensalidades atualmente vencidas
                                </p>
                            </div>
                            <button 
                                onClick={() => setIsOverdueModalOpen(false)}
                                className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-850 text-slate-500 dark:text-white transition-colors"
                            >
                                <span className="material-symbols-outlined text-base">close</span>
                            </button>
                        </div>
                        <div className="p-6 max-h-[400px] overflow-y-auto space-y-4">
                            {overdueList.map((st) => (
                                <div 
                                    key={st.id} 
                                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-100 dark:border-slate-800 gap-4"
                                >
                                    <div>
                                        <p className="font-extrabold text-sm text-[#003346] dark:text-white">{st.name}</p>
                                        <p className="text-xs font-medium text-slate-500 dark:text-outline-variant">{st.document}</p>
                                        <span className="inline-block mt-2 text-[10px] font-bold text-[#b31b25] bg-rose-50 dark:bg-rose-955 px-2 py-0.5 rounded border border-rose-100 dark:border-rose-900/30">
                                            Atrasado há {st.delayDays} dias
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                                        <span className="text-base font-extrabold text-[#003346] dark:text-white">R$ {st.amount.toFixed(2)}</span>
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => handleSendAlert(st.name)}
                                                title="Enviar cobrança WhatsApp"
                                                className="p-2 bg-emerald-50 dark:bg-slate-800 text-[#006a35] dark:text-emerald-400 rounded-xl hover:bg-emerald-100 active:scale-95 transition-all flex items-center justify-center"
                                            >
                                                <span className="material-symbols-outlined text-sm">sms</span>
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    handleConfirmPayment(st.id, st.name, st.amount);
                                                    setIsOverdueModalOpen(false);
                                                }}
                                                className="px-4 py-2 bg-primary text-white text-xs font-extrabold rounded-xl hover:opacity-95 active:scale-95 transition-all shadow-sm"
                                            >
                                                Receber
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-6 border-t border-outline-variant/10 dark:border-slate-800 flex justify-end">
                            <button
                                onClick={() => setIsOverdueModalOpen(false)}
                                className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-outline-variant font-bold text-xs rounded-xl hover:bg-slate-200 transition-colors"
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Cash Drawer Modal (Sangria / Entrada) */}
            {isCaixaModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-outline-variant/10 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-outline-variant/10 dark:border-slate-800 flex justify-between items-center bg-[#eff8ff] dark:bg-slate-900/60">
                            <h3 className="text-lg font-extrabold text-[#003346] dark:text-white font-headline">
                                Operações de Caixa
                            </h3>
                            <button 
                                onClick={() => setIsCaixaModalOpen(false)}
                                className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-850 text-slate-500 dark:text-white transition-colors"
                            >
                                <span className="material-symbols-outlined text-base">close</span>
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            
                            {/* Toggle Cashier State Section */}
                            <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-2xl flex items-center justify-between border border-slate-100 dark:border-slate-800">
                                <div>
                                    <span className="block text-xs font-bold text-slate-500 dark:text-outline-variant uppercase tracking-wider">Status do Caixa</span>
                                    <span className="text-sm font-extrabold text-[#003346] dark:text-white">
                                        Caixa está atualmente {cashDrawerOpen ? 'ABERTO' : 'FECHADO'}
                                    </span>
                                </div>
                                <button
                                    onClick={confirmToggleCaixa}
                                    className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
                                        cashDrawerOpen 
                                            ? 'bg-rose-50 text-[#b31b25] hover:bg-rose-100' 
                                            : 'bg-emerald-50 text-[#006a35] hover:bg-emerald-100'
                                    }`}
                                >
                                    {cashDrawerOpen ? 'Fechar Caixa' : 'Abrir Caixa'}
                                </button>
                            </div>

                            {/* Adjust cash value form */}
                            <form onSubmit={handleAdjustCash} className="space-y-4">
                                <div className="flex gap-4">
                                    <label className="flex-1 flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-100 dark:border-slate-800 cursor-pointer">
                                        <input 
                                            type="radio" 
                                            name="caixa_type" 
                                            checked={caixaAdjustType === 'add'}
                                            onChange={() => setCaixaAdjustType('add')}
                                            className="text-primary focus:ring-primary focus:ring-offset-0"
                                        />
                                        <span className="text-xs font-extrabold text-[#003346] dark:text-white">Entrada (Reforço)</span>
                                    </label>
                                    <label className="flex-1 flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-100 dark:border-slate-800 cursor-pointer">
                                        <input 
                                            type="radio" 
                                            name="caixa_type" 
                                            checked={caixaAdjustType === 'remove'}
                                            onChange={() => setCaixaAdjustType('remove')}
                                            className="text-primary focus:ring-primary focus:ring-offset-0"
                                        />
                                        <span className="text-xs font-extrabold text-[#003346] dark:text-white">Saída (Sangria)</span>
                                    </label>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold text-[#003346] dark:text-white">Valor da Ajustagem</label>
                                    <div className="relative flex items-center">
                                        <span className="absolute left-4 text-xs font-bold text-slate-500 dark:text-[#87b3cd]">R$</span>
                                        <input
                                            value={caixaAdjustValue}
                                            onChange={(e) => setCaixaAdjustValue(e.target.value)}
                                            type="number"
                                            step="0.01"
                                            placeholder="0,00"
                                            className="w-full h-12 pl-10 pr-4 bg-[#eff8ff] dark:bg-slate-800 border border-outline-variant/15 dark:border-slate-700 focus:ring-primary focus:border-primary rounded-xl text-sm font-bold text-[#003346] dark:text-white"
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-3 bg-primary text-white text-xs font-extrabold rounded-xl hover:opacity-95 active:scale-95 transition-all cursor-pointer"
                                >
                                    Confirmar Lançamento
                                </button>
                            </form>

                        </div>
                        <div className="p-6 border-t border-outline-variant/10 dark:border-slate-800 flex justify-end">
                            <button
                                onClick={() => setIsCaixaModalOpen(false)}
                                className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-outline-variant font-bold text-xs rounded-xl hover:bg-slate-200 transition-colors"
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal: Registrar Recebimento */}
            {isRecebimentoModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-955/60 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-outline-variant/10 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-outline-variant/10 dark:border-slate-800 flex justify-between items-center bg-[#eff8ff] dark:bg-slate-900/60">
                            <h3 className="text-lg font-extrabold text-[#003346] dark:text-white font-headline">
                                Registrar Recebimento Manual
                            </h3>
                            <button 
                                onClick={() => setIsRecebimentoModalOpen(false)}
                                className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-850 text-slate-500 dark:text-white transition-colors"
                            >
                                <span className="material-symbols-outlined text-base">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleCreateRecebimento} className="p-6 space-y-4">
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-[#003346] dark:text-white">Nome do Aluno</label>
                                <input
                                    value={recebimentoForm.studentName}
                                    onChange={(e) => setRecebimentoForm({ ...recebimentoForm, studentName: e.target.value })}
                                    type="text"
                                    placeholder="Ex: Arthur Camargo"
                                    className="w-full h-12 px-4 bg-[#eff8ff] dark:bg-slate-800 border-outline-variant/15 dark:border-slate-700 focus:ring-primary focus:border-primary rounded-xl text-sm text-[#003346] dark:text-white font-medium"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold text-[#003346] dark:text-white">Valor Pago</label>
                                    <div className="relative flex items-center">
                                        <span className="absolute left-4 text-xs font-bold text-slate-500 dark:text-[#87b3cd]">R$</span>
                                        <input
                                            value={recebimentoForm.amount}
                                            onChange={(e) => setRecebimentoForm({ ...recebimentoForm, amount: e.target.value })}
                                            type="number"
                                            step="0.01"
                                            placeholder="350,00"
                                            className="w-full h-12 pl-10 pr-4 bg-[#eff8ff] dark:bg-slate-800 border-outline-variant/15 dark:border-slate-700 focus:ring-primary focus:border-primary rounded-xl text-sm font-bold text-[#003346] dark:text-white"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold text-[#003346] dark:text-white">Meio de Pagamento</label>
                                    <select
                                        value={recebimentoForm.method}
                                        onChange={(e) => setRecebimentoForm({ ...recebimentoForm, method: e.target.value })}
                                        className="w-full h-12 px-4 bg-[#eff8ff] dark:bg-slate-800 border-outline-variant/15 dark:border-slate-700 focus:ring-primary focus:border-primary rounded-xl text-sm text-[#003346] dark:text-white font-bold cursor-pointer"
                                    >
                                        <option value="Pix">Pix</option>
                                        <option value="Boleto">Boleto Bancário</option>
                                        <option value="Cartão de Crédito">Cartão de Crédito</option>
                                        <option value="Dinheiro">Dinheiro Físico</option>
                                    </select>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3.5 bg-primary text-white text-xs font-extrabold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-95 transition-all mt-4 cursor-pointer"
                            >
                                Registrar Recebimento
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* slips modal (Gerar Carnê) */}
            {isSlipsModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-outline-variant/10 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-outline-variant/10 dark:border-slate-800 flex justify-between items-center bg-[#eff8ff] dark:bg-slate-900/60">
                            <h3 className="text-lg font-extrabold text-[#003346] dark:text-white font-headline">
                                Emissão de Carnê / Mensalidade
                            </h3>
                            <button 
                                onClick={() => setIsSlipsModalOpen(false)}
                                className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-850 text-slate-500 dark:text-white transition-colors"
                            >
                                <span className="material-symbols-outlined text-base">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleGenerateSlips} className="p-6 space-y-4">
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-[#003346] dark:text-white">Nome do Aluno</label>
                                <input
                                    value={slipsForm.studentName}
                                    onChange={(e) => setSlipsForm({ ...slipsForm, studentName: e.target.value })}
                                    type="text"
                                    placeholder="Ex: Arthur Camargo"
                                    className="w-full h-12 px-4 bg-[#eff8ff] dark:bg-slate-800 border-outline-variant/15 dark:border-slate-700 focus:ring-primary focus:border-primary rounded-xl text-sm text-[#003346] dark:text-white font-medium"
                                    required
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-[#003346] dark:text-white">Curso / Pacote Relacionado</label>
                                <select
                                    value={slipsForm.course}
                                    onChange={(e) => setSlipsForm({ ...slipsForm, course: e.target.value })}
                                    className="w-full h-12 px-4 bg-[#eff8ff] dark:bg-slate-800 border-outline-variant/15 dark:border-slate-700 focus:ring-primary focus:border-primary rounded-xl text-sm text-[#003346] dark:text-white font-bold cursor-pointer"
                                    required
                                >
                                    <option value="">Selecione o curso...</option>
                                    <option value="Marketing Digital">Marketing Digital Avançado</option>
                                    <option value="Web Dev Fullstack">Desenvolvimento Web Moderno</option>
                                    <option value="Design UI/UX">Design UI/UX Master</option>
                                    <option value="Ciência de Dados">Ciência de Dados Starter</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold text-[#003346] dark:text-white">Parcelas</label>
                                    <select
                                        value={slipsForm.installments}
                                        onChange={(e) => setSlipsForm({ ...slipsForm, installments: e.target.value })}
                                        className="w-full h-12 px-4 bg-[#eff8ff] dark:bg-slate-800 border-outline-variant/15 dark:border-slate-700 focus:ring-primary focus:border-primary rounded-xl text-sm text-[#003346] dark:text-white font-bold cursor-pointer"
                                    >
                                        <option value="1">1x (À vista)</option>
                                        <option value="3">3x</option>
                                        <option value="6">6x</option>
                                        <option value="10">10x</option>
                                        <option value="12">12x</option>
                                        <option value="24">24x</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold text-[#003346] dark:text-white">Valor da Parcela</label>
                                    <div className="relative flex items-center">
                                        <span className="absolute left-4 text-xs font-bold text-slate-500 dark:text-[#87b3cd]">R$</span>
                                        <input
                                            value={slipsForm.value}
                                            onChange={(e) => setSlipsForm({ ...slipsForm, value: e.target.value })}
                                            type="number"
                                            step="0.01"
                                            placeholder="350,00"
                                            className="w-full h-12 pl-10 pr-4 bg-[#eff8ff] dark:bg-slate-800 border-outline-variant/15 dark:border-slate-700 focus:ring-primary focus:border-primary rounded-xl text-sm font-bold text-[#003346] dark:text-white"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3.5 bg-primary text-white text-xs font-extrabold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-95 transition-all mt-4 cursor-pointer"
                            >
                                Gerar e Registrar Carnê
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    );
}
