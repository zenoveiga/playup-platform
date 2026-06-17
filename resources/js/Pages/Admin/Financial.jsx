import AdminLayout from '@/Layouts/AdminLayout';
import SchoolAdminLayout from '@/Layouts/SchoolAdminLayout';
import { Head, usePage } from '@inertiajs/react';
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

            <div className="max-w-7xl mx-auto p-8 space-y-8 animate-in fade-in duration-700 relative">
                {/* Toast Notification */}
                {notification && (
                    <div className={`fixed top-20 right-8 z-50 flex items-center gap-2 px-6 py-4 rounded-xl border shadow-xl animate-in slide-in-from-top-4 duration-300 ${
                        notification.type === 'error'
                            ? 'bg-rose-50 dark:bg-rose-950/30 text-[#b31b25] border-rose-200 dark:border-rose-900/50'
                            : notification.type === 'warning'
                            ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-900/50'
                            : 'bg-emerald-50 dark:bg-emerald-950/30 text-[#006a35] dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50'
                    }`}>
                        <span className="material-symbols-outlined text-lg">
                            {notification.type === 'error' ? 'error' : notification.type === 'warning' ? 'warning' : 'check_circle'}
                        </span>
                        <span className="text-sm font-bold">{notification.message}</span>
                    </div>
                )}

                {/* Page Title & Overview */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <h2 className="text-4xl font-extrabold font-headline text-[#003346] dark:text-white tracking-tight leading-none mb-2">
                            Gestão Financeira
                        </h2>
                        <p className="text-on-surface-variant dark:text-[#b5e3ff] font-medium text-lg max-w-2xl">
                            Controle fluxos de caixa, gere carnês de pagamento e monitore índices de adimplência em tempo real.
                        </p>
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                        <button 
                            onClick={() => showNotification('Planilhas financeiras exportadas com sucesso (simulado).')}
                            className="flex-1 md:flex-none bg-surface-container-low dark:bg-slate-800 text-primary dark:text-[#00D1FF] font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-surface-container-high dark:hover:bg-slate-700 transition-colors select-none"
                        >
                            <span className="material-symbols-outlined text-lg">file_download</span>
                            <span>Relatórios</span>
                        </button>
                        <button 
                            onClick={() => setIsRecebimentoModalOpen(true)}
                            className="flex-1 md:flex-none bg-primary text-white font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-primary/20 hover:opacity-95 active:scale-[0.98] transition-all select-none cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-lg">add_circle</span>
                            <span>Registrar Recebimento</span>
                        </button>
                    </div>
                </div>

                {/* Primary Financial Indicators */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Card 1: Overdue Installments */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border-l-4 border-[#b31b25] border-y border-r border-outline-variant/10 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-on-surface-variant dark:text-[#87b3cd] text-sm font-semibold mb-1">Parcelas Vencidas</p>
                                <h3 className="text-3xl font-extrabold font-headline text-[#b31b25] dark:text-rose-400">R$ 12.450,00</h3>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/20 flex items-center justify-center text-[#b31b25] dark:text-rose-400">
                                <span className="material-symbols-outlined text-2xl">gavel</span>
                            </div>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                            <span className="text-xs font-semibold text-slate-500 dark:text-[#87b3cd]">42 mensalidades pendentes</span>
                            <button 
                                onClick={() => setIsOverdueModalOpen(true)}
                                className="text-xs font-extrabold text-primary dark:text-[#00D1FF] hover:underline"
                            >
                                Ver Alunos
                            </button>
                        </div>
                    </div>

                    {/* Card 2: Delinquency Rate */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border-l-4 border-amber-500 border-y border-r border-outline-variant/10 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-on-surface-variant dark:text-[#87b3cd] text-sm font-semibold mb-1">Taxa de Inadimplência</p>
                                <h3 className="text-3xl font-extrabold font-headline text-amber-600 dark:text-amber-400">15.8%</h3>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-950/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
                                <span className="material-symbols-outlined text-2xl">trending_up</span>
                            </div>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                            <span className="text-xs font-semibold text-slate-500 dark:text-[#87b3cd]">+1.2% em relação ao mês anterior</span>
                            <button 
                                onClick={() => showNotification('Estabilidade de pagamentos projetada em 84.2% para os próximos 30 dias.', 'warning')}
                                className="text-xs font-extrabold text-amber-600 dark:text-amber-400 hover:underline"
                            >
                                Detalhes
                            </button>
                        </div>
                    </div>

                    {/* Card 3: Daily Balance / Cashier State */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border-l-4 border-[#006a35] border-y border-r border-outline-variant/10 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-on-surface-variant dark:text-[#87b3cd] text-sm font-semibold mb-1">Saldo em Caixa</p>
                                <h3 className="text-3xl font-extrabold font-headline text-[#006a35] dark:text-[#6bfe9c]">
                                    R$ {cashBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </h3>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center text-[#006a35] dark:text-emerald-400">
                                <span className="material-symbols-outlined text-2xl">account_balance_wallet</span>
                            </div>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                            <div className="flex items-center gap-1.5">
                                <span className={`w-2.5 h-2.5 rounded-full ${cashDrawerOpen ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
                                <span className="text-xs font-semibold text-slate-500 dark:text-[#87b3cd]">
                                    Caixa {cashDrawerOpen ? 'ABERTO' : 'FECHADO'}
                                </span>
                            </div>
                            <button 
                                onClick={handleToggleCaixa}
                                className="text-xs font-extrabold text-[#006a35] dark:text-emerald-400 hover:underline"
                            >
                                Ajustes
                            </button>
                        </div>
                    </div>
                </div>

                {/* Dashboard layout bento: Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* Transactions Left canvas */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-slate-900 rounded-[1.5rem] border border-outline-variant/10 dark:border-slate-800 shadow-sm overflow-hidden">
                            
                            {/* Table controls */}
                            <div className="p-6 border-b border-outline-variant/10 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <h3 className="text-lg font-extrabold font-headline text-[#003346] dark:text-white">
                                    Transações Recentes
                                </h3>
                                <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center w-full md:w-auto">
                                    <div className="flex items-center bg-[#eff8ff] dark:bg-slate-800 px-4 py-2 rounded-xl gap-2 w-full sm:w-64 border border-outline-variant/10 dark:border-slate-700">
                                        <span className="material-symbols-outlined text-outline text-sm">search</span>
                                        <input 
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder-outline-variant text-[#003346] dark:text-white p-0" 
                                            placeholder="Buscar transações..." 
                                            type="text"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Status filter tabs */}
                            <div className="px-6 py-3 bg-[#eff8ff]/40 dark:bg-slate-900/60 border-b border-outline-variant/10 dark:border-slate-800 flex gap-2 overflow-x-auto scrollbar-none">
                                {[
                                    { value: 'all', label: 'Todas' },
                                    { value: 'confirmado', label: 'Confirmadas' },
                                    { value: 'pendente', label: 'Pendentes' },
                                    { value: 'atrasado', label: 'Atrasadas' }
                                ].map((tab) => (
                                    <button
                                        key={tab.value}
                                        onClick={() => setStatusFilter(tab.value)}
                                        className={`px-4 py-2 text-xs font-extrabold rounded-full transition-all cursor-pointer whitespace-nowrap ${
                                            statusFilter === tab.value
                                                ? 'bg-primary text-white shadow-sm'
                                                : 'bg-white dark:bg-slate-850 text-[#003346]/70 dark:text-[#87b3cd] border border-outline-variant/10 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* Transactions Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 dark:bg-slate-850/50 border-b border-outline-variant/10 dark:border-slate-800">
                                            <th className="px-6 py-4 text-xs font-black text-outline dark:text-[#87b3cd]/80 uppercase tracking-wider">Aluno</th>
                                            <th className="px-6 py-4 text-xs font-black text-outline dark:text-[#87b3cd]/80 uppercase tracking-wider">Método</th>
                                            <th className="px-6 py-4 text-xs font-black text-outline dark:text-[#87b3cd]/80 uppercase tracking-wider">Valor</th>
                                            <th className="px-6 py-4 text-xs font-black text-outline dark:text-[#87b3cd]/80 uppercase tracking-wider">Vencimento / Data</th>
                                            <th className="px-6 py-4 text-xs font-black text-outline dark:text-[#87b3cd]/80 uppercase tracking-wider text-center">Status</th>
                                            <th className="px-6 py-4 text-xs font-black text-outline dark:text-[#87b3cd]/80 uppercase tracking-wider text-center">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {filteredTransactions.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="px-6 py-8 text-center text-sm font-medium text-slate-400 dark:text-[#87b3cd]">
                                                    Nenhuma transação encontrada correspondente aos filtros.
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredTransactions.map((tx) => (
                                                <tr key={tx.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/20 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-[#eff8ff] dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-primary dark:text-[#00D1FF]">
                                                                {tx.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                                                            </div>
                                                            <span className="text-sm font-extrabold text-[#003346] dark:text-white">{tx.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-xs font-semibold text-[#507c94] dark:text-[#87b3cd]">
                                                            {tx.method}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-sm font-bold text-[#003346] dark:text-white">
                                                            R$ {tx.amount.toFixed(2)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-xs font-medium text-slate-500 dark:text-[#87b3cd]/80">
                                                            {tx.date}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                                                            tx.status === 'confirmado'
                                                                ? 'bg-emerald-50 dark:bg-emerald-950/20 text-[#006a35] dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30'
                                                                : tx.status === 'atrasado'
                                                                ? 'bg-rose-50 dark:bg-rose-950/20 text-[#b31b25] dark:text-rose-400 border-rose-100 dark:border-rose-900/30'
                                                                : 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-900/30'
                                                        }`}>
                                                            {tx.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <div className="flex justify-center items-center gap-2">
                                                            {tx.status !== 'confirmado' ? (
                                                                <button
                                                                    onClick={() => handleConfirmPayment(tx.id, tx.name, tx.amount)}
                                                                    title="Confirmar Recebimento"
                                                                    className="p-2 bg-emerald-50 dark:bg-slate-800 text-[#006a35] dark:text-emerald-400 rounded-xl hover:bg-emerald-100 hover:scale-105 active:scale-95 transition-all"
                                                                >
                                                                    <span className="material-symbols-outlined text-sm">check_circle</span>
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    onClick={() => showNotification(`Comprovante de pagamento de ${tx.name} baixado!`)}
                                                                    title="Download Comprovante"
                                                                    className="p-2 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-[#87b3cd] rounded-xl hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all"
                                                                >
                                                                    <span className="material-symbols-outlined text-sm">receipt</span>
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Table Pagination footer */}
                            <div className="p-6 border-t border-outline-variant/10 dark:border-slate-800 flex justify-between items-center text-xs font-semibold text-slate-500 dark:text-[#87b3cd]">
                                <span>Mostrando {filteredTransactions.length} de {transactions.length} transações</span>
                                <div className="flex gap-2">
                                    <button disabled className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center opacity-50 cursor-not-allowed">
                                        <span className="material-symbols-outlined text-base">chevron_left</span>
                                    </button>
                                    <button className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center font-bold">1</button>
                                    <button disabled className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center opacity-50 cursor-not-allowed">
                                        <span className="material-symbols-outlined text-base">chevron_right</span>
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Bento Actions and Insights Right column */}
                    <div className="space-y-6">

                        {/* Caixa Status Controller */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-outline-variant/10 dark:border-slate-800 shadow-sm">
                            <h3 className="text-lg font-extrabold font-headline text-[#003346] dark:text-white mb-2">Estado de Caixa</h3>
                            <p className="text-sm text-on-surface-variant dark:text-[#87b3cd] font-medium leading-relaxed mb-6">
                                {cashDrawerOpen 
                                    ? 'O caixa da escola está aberto para registros, sangrias e conciliação de faturas diárias.' 
                                    : 'O caixa está fechado. Abra-o para autorizar lançamentos de dinheiro ou PIX presenciais.'
                                }
                            </p>
                            
                            <button
                                onClick={handleToggleCaixa}
                                className={`w-full py-3.5 rounded-xl font-bold transition-all hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2 cursor-pointer text-sm shadow-md ${
                                    cashDrawerOpen
                                        ? 'bg-rose-50 hover:bg-rose-100/80 text-[#b31b25] shadow-rose-200/20'
                                        : 'bg-primary hover:opacity-95 text-white shadow-primary/20'
                                }`}
                            >
                                <span className="material-symbols-outlined text-sm">
                                    {cashDrawerOpen ? 'lock' : 'lock_open'}
                                </span>
                                <span>{cashDrawerOpen ? 'Fechar Caixa Diário' : 'Abrir Caixa Diário'}</span>
                            </button>
                        </div>

                        {/* Bento Quick Actions list */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-outline-variant/10 dark:border-slate-800 shadow-sm space-y-4">
                            <h3 className="text-lg font-extrabold font-headline text-[#003346] dark:text-white">Ações Rápidas</h3>
                            
                            {/* Gerar Carnê */}
                            <button
                                onClick={() => setIsSlipsModalOpen(true)}
                                className="w-full flex items-center justify-between p-4 bg-[#eff8ff] dark:bg-slate-800 rounded-2xl hover:bg-primary hover:text-white dark:hover:bg-primary transition-all group text-left border border-outline-variant/10 dark:border-slate-700 cursor-pointer"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-primary/10 dark:bg-slate-700 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-colors">
                                        <span className="material-symbols-outlined text-primary dark:text-[#00D1FF] group-hover:text-white">receipt_long</span>
                                    </div>
                                    <div>
                                        <span className="block font-bold text-sm text-[#003346] dark:text-white group-hover:text-white">Gerar Carnê Escolar</span>
                                        <span className="text-[10px] text-slate-500 dark:text-[#87b3cd] group-hover:text-white/80">Boletos parcelados para novos planos</span>
                                    </div>
                                </div>
                                <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">chevron_right</span>
                            </button>

                            {/* Receber Boleto Presencial */}
                            <button
                                onClick={() => setIsRecebimentoModalOpen(true)}
                                className="w-full flex items-center justify-between p-4 bg-[#eff8ff] dark:bg-slate-800 rounded-2xl hover:bg-primary hover:text-white dark:hover:bg-primary transition-all group text-left border border-outline-variant/10 dark:border-slate-700 cursor-pointer"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-primary/10 dark:bg-slate-700 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-colors">
                                        <span className="material-symbols-outlined text-primary dark:text-[#00D1FF] group-hover:text-white">currency_exchange</span>
                                    </div>
                                    <div>
                                        <span className="block font-bold text-sm text-[#003346] dark:text-white group-hover:text-white">Lançamento de Caixa</span>
                                        <span className="text-[10px] text-slate-500 dark:text-[#87b3cd] group-hover:text-white/80">Entrada manual rápida em dinheiro</span>
                                    </div>
                                </div>
                                <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">chevron_right</span>
                            </button>

                            {/* Fechamento Mensal */}
                            <button
                                onClick={() => showNotification('Fechamento consolidado e enviado para auditoria (Simulado).')}
                                className="w-full flex items-center justify-between p-4 bg-[#eff8ff] dark:bg-slate-800 rounded-2xl hover:bg-primary hover:text-white dark:hover:bg-primary transition-all group text-left border border-outline-variant/10 dark:border-slate-700 cursor-pointer"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-primary/10 dark:bg-slate-700 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-colors">
                                        <span className="material-symbols-outlined text-primary dark:text-[#00D1FF] group-hover:text-white">analytics</span>
                                    </div>
                                    <div>
                                        <span className="block font-bold text-sm text-[#003346] dark:text-white group-hover:text-white">Fechamento do Mês</span>
                                        <span className="text-[10px] text-slate-500 dark:text-[#87b3cd] group-hover:text-white/80">Balanço consolidado de receitas</span>
                                    </div>
                                </div>
                                <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">chevron_right</span>
                            </button>
                        </div>

                        {/* Interactive Insights Box */}
                        <div className="relative overflow-hidden bg-primary text-white p-6 rounded-[1.5rem] shadow-lg shadow-primary/10 flex flex-col justify-between min-h-[200px]">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                            <div className="relative z-10">
                                <span className="text-[10px] font-black text-white/70 uppercase tracking-widest font-headline">Insights de Caixa</span>
                                <h4 className="text-xl font-bold font-headline mt-2 mb-1">Crescimento Saudável</h4>
                                <p className="text-white/80 font-medium text-xs leading-relaxed max-w-[210px]">
                                    A conciliação automática via Pix reduziu a taxa de inadimplência em <span className="text-[#6bfe9c] font-bold">4.2%</span> esta semana.
                                </p>
                            </div>
                            <div className="relative z-10 mt-4 h-1.5 w-full bg-white/25 rounded-full overflow-hidden">
                                <div className="h-full bg-[#6bfe9c] w-[84.2%] rounded-full"></div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>

            {/* Overdue Students Modal */}
            {isOverdueModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-outline-variant/10 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-outline-variant/10 dark:border-slate-800 flex justify-between items-center bg-[#eff8ff] dark:bg-slate-900/60">
                            <div>
                                <h3 className="text-xl font-extrabold text-[#003346] dark:text-white font-headline">
                                    Alunos em Inadimplência
                                </h3>
                                <p className="text-xs font-semibold text-slate-500 dark:text-[#87b3cd] mt-0.5">
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
                                        <p className="text-xs font-medium text-slate-500 dark:text-[#87b3cd]">{st.document}</p>
                                        <span className="inline-block mt-2 text-[10px] font-bold text-[#b31b25] bg-rose-50 dark:bg-rose-950/20 px-2 py-0.5 rounded border border-rose-100 dark:border-rose-900/30">
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
                                className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-[#87b3cd] font-bold text-xs rounded-xl hover:bg-slate-200 transition-colors"
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Cash Drawer Modal (Sangria / Entrada / Fechamento) */}
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
                                    <span className="block font-bold text-xs text-[#003346] dark:text-white">Estado do Caixa</span>
                                    <span className="text-[10px] text-slate-500 dark:text-[#87b3cd]">Caixa atualmente {cashDrawerOpen ? 'Aberto' : 'Fechado'}</span>
                                </div>
                                <button
                                    onClick={confirmToggleCaixa}
                                    className={`px-4 py-2 text-xs font-black rounded-xl cursor-pointer transition-all ${
                                        cashDrawerOpen 
                                            ? 'bg-rose-50 text-[#b31b25] border border-rose-200 hover:bg-rose-100'
                                            : 'bg-emerald-50 text-[#006a35] border border-emerald-200 hover:bg-emerald-100'
                                    }`}
                                >
                                    {cashDrawerOpen ? 'Fechar Caixa' : 'Abrir Caixa'}
                                </button>
                            </div>

                            {/* Cash Flow Inputs */}
                            {cashDrawerOpen && (
                                <form onSubmit={handleAdjustCash} className="space-y-4">
                                    <h4 className="text-xs font-black text-slate-500 dark:text-[#87b3cd] uppercase tracking-wider">Ajuste de Saldo Diário</h4>
                                    
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setCaixaAdjustType('add')}
                                            className={`py-3 rounded-xl text-xs font-bold border transition-all ${
                                                caixaAdjustType === 'add'
                                                    ? 'bg-emerald-50 dark:bg-emerald-950/20 text-[#006a35] dark:text-emerald-400 border-[#006a35]'
                                                    : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-[#87b3cd] border-outline-variant/10 dark:border-slate-850 hover:bg-slate-50'
                                            }`}
                                        >
                                            Entrada / Reforço
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setCaixaAdjustType('remove')}
                                            className={`py-3 rounded-xl text-xs font-bold border transition-all ${
                                                caixaAdjustType === 'remove'
                                                    ? 'bg-rose-50 dark:bg-rose-950/20 text-[#b31b25] dark:text-rose-400 border-rose-300'
                                                    : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-[#87b3cd] border-outline-variant/10 dark:border-slate-850 hover:bg-slate-50'
                                            }`}
                                        >
                                            Sangria / Retirada
                                        </button>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-bold text-[#003346] dark:text-white">Valor do Lançamento</label>
                                        <div className="relative flex items-center">
                                            <span className="absolute left-4 text-sm font-bold text-slate-500 dark:text-[#87b3cd]">R$</span>
                                            <input
                                                value={caixaAdjustValue}
                                                onChange={(e) => setCaixaAdjustValue(e.target.value)}
                                                type="number"
                                                step="0.01"
                                                placeholder="0,00"
                                                className="w-full h-12 pl-12 pr-4 bg-[#eff8ff] dark:bg-slate-800 border-outline-variant/15 dark:border-slate-700 focus:ring-primary focus:border-primary dark:focus:ring-[#00D1FF] dark:focus:border-[#00D1FF] rounded-xl text-sm font-bold text-[#003346] dark:text-white"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full py-3 bg-primary text-white text-xs font-extrabold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-95 transition-all mt-2 cursor-pointer"
                                    >
                                        Confirmar Lançamento
                                    </button>
                                </form>
                            )}

                        </div>
                    </div>
                </div>
            )}

            {/* Confirm Manual Recebimento Modal */}
            {isRecebimentoModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-outline-variant/10 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-outline-variant/10 dark:border-slate-800 flex justify-between items-center bg-[#eff8ff] dark:bg-slate-900/60">
                            <h3 className="text-lg font-extrabold text-[#003346] dark:text-white font-headline">
                                Registrar Recebimento Presencial
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
                                    placeholder="Ex: Carlos Eduardo Silva"
                                    className="w-full h-12 px-4 bg-[#eff8ff] dark:bg-slate-800 border-outline-variant/15 dark:border-slate-700 focus:ring-primary focus:border-primary dark:focus:ring-[#00D1FF] dark:focus:border-[#00D1FF] rounded-xl text-sm text-[#003346] dark:text-white font-medium"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold text-[#003346] dark:text-white">Valor</label>
                                    <div className="relative flex items-center">
                                        <span className="absolute left-4 text-xs font-bold text-slate-500 dark:text-[#87b3cd]">R$</span>
                                        <input
                                            value={recebimentoForm.amount}
                                            onChange={(e) => setRecebimentoForm({ ...recebimentoForm, amount: e.target.value })}
                                            type="number"
                                            step="0.01"
                                            placeholder="350,00"
                                            className="w-full h-12 pl-10 pr-4 bg-[#eff8ff] dark:bg-slate-800 border-outline-variant/15 dark:border-slate-700 focus:ring-primary focus:border-primary dark:focus:ring-[#00D1FF] dark:focus:border-[#00D1FF] rounded-xl text-sm font-bold text-[#003346] dark:text-white"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold text-[#003346] dark:text-white">Forma de Pagamento</label>
                                    <select
                                        value={recebimentoForm.method}
                                        onChange={(e) => setRecebimentoForm({ ...recebimentoForm, method: e.target.value })}
                                        className="w-full h-12 px-4 bg-[#eff8ff] dark:bg-slate-800 border-outline-variant/15 dark:border-slate-700 focus:ring-primary focus:border-primary dark:focus:ring-[#00D1FF] dark:focus:border-[#00D1FF] rounded-xl text-sm text-[#003346] dark:text-white font-bold"
                                    >
                                        <option value="Pix">Pix</option>
                                        <option value="Dinheiro">Dinheiro</option>
                                        <option value="Cartão de Crédito">Cartão de Crédito</option>
                                        <option value="Cartão de Débito">Cartão de Débito</option>
                                        <option value="Boleto">Boleto Bancário</option>
                                    </select>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3.5 bg-primary text-white text-xs font-extrabold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-95 transition-all mt-4 cursor-pointer"
                            >
                                Confirmar e Conciliar Recebimento
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Generate Carnê Modal */}
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
                                    className="w-full h-12 px-4 bg-[#eff8ff] dark:bg-slate-800 border-outline-variant/15 dark:border-slate-700 focus:ring-primary focus:border-primary dark:focus:ring-[#00D1FF] dark:focus:border-[#00D1FF] rounded-xl text-sm text-[#003346] dark:text-white font-medium"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-[#003346] dark:text-white">Curso / Pacote Relacionado</label>
                                <select
                                    value={slipsForm.course}
                                    onChange={(e) => setSlipsForm({ ...slipsForm, course: e.target.value })}
                                    className="w-full h-12 px-4 bg-[#eff8ff] dark:bg-slate-800 border-outline-variant/15 dark:border-slate-700 focus:ring-primary focus:border-primary dark:focus:ring-[#00D1FF] dark:focus:border-[#00D1FF] rounded-xl text-sm text-[#003346] dark:text-white font-bold"
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
                                        className="w-full h-12 px-4 bg-[#eff8ff] dark:bg-slate-800 border-outline-variant/15 dark:border-slate-700 focus:ring-primary focus:border-primary dark:focus:ring-[#00D1FF] dark:focus:border-[#00D1FF] rounded-xl text-sm text-[#003346] dark:text-white font-bold"
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
                                            className="w-full h-12 pl-10 pr-4 bg-[#eff8ff] dark:bg-slate-800 border-outline-variant/15 dark:border-slate-700 focus:ring-primary focus:border-primary dark:focus:ring-[#00D1FF] dark:focus:border-[#00D1FF] rounded-xl text-sm font-bold text-[#003346] dark:text-white"
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
