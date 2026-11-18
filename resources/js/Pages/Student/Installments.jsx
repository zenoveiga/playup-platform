import StudentLayout from '@/Layouts/StudentLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function Installments() {
    // Search query state
    const [searchQuery, setSearchQuery] = useState('');

    // Tab filter state ('todas', 'pagas', 'aberto', 'futuras')
    const [activeTab, setActiveTab] = useState('todas');

    // Toast state
    const [toastMessage, setToastMessage] = useState(null);

    const showToast = (message) => {
        setToastMessage(message);
        setTimeout(() => {
            setToastMessage(null);
        }, 3000);
    };

    // Installments dataset
    const [installments] = useState([
        {
            id: 1,
            month: 'Janeiro',
            year: '2027',
            installmentNum: '01/12',
            dueDate: '10/01/2027',
            value: 'R$ 780,00',
            status: 'pagas',
            statusLabel: 'PAGO EM 08/01',
            statusColor: 'bg-emerald-50 text-emerald-800',
            icon: 'task_alt',
            iconColor: 'text-emerald-600 bg-emerald-100/40'
        },
        {
            id: 2,
            month: 'Fevereiro',
            year: '2027',
            installmentNum: '02/12',
            dueDate: '10/02/2027',
            value: 'R$ 780,00',
            status: 'pagas',
            statusLabel: 'PAGO EM 07/02',
            statusColor: 'bg-emerald-50 text-emerald-800',
            icon: 'task_alt',
            iconColor: 'text-emerald-600 bg-emerald-100/40'
        },
        {
            id: 3,
            month: 'Março',
            year: '2027',
            installmentNum: '03/12',
            dueDate: '10/03/2027',
            value: 'R$ 780,00',
            status: 'pagas',
            statusLabel: 'PAGO EM 09/03',
            statusColor: 'bg-emerald-50 text-emerald-800',
            icon: 'task_alt',
            iconColor: 'text-emerald-600 bg-emerald-100/40'
        },
        {
            id: 4,
            month: 'Abril',
            year: '2027',
            installmentNum: '04/12',
            dueDate: '10/04/2027',
            value: 'R$ 780,00',
            status: 'pagas',
            statusLabel: 'PAGO EM 08/04',
            statusColor: 'bg-emerald-50 text-emerald-800',
            icon: 'task_alt',
            iconColor: 'text-emerald-600 bg-emerald-100/40'
        },
        {
            id: 5,
            month: 'Maio',
            year: '2027',
            installmentNum: '05/12',
            dueDate: '10/05/2027',
            value: 'R$ 780,00',
            status: 'aberto',
            statusLabel: 'Aguardando Pagamento',
            warningBadge: 'Vence em 6 dias',
            statusColor: 'bg-[#fef3c7] text-[#d97706]',
            icon: 'error',
            iconColor: 'text-[#d97706] bg-[#fef3c7] animate-pulse'
        },
        {
            id: 6,
            month: 'Junho',
            year: '2027',
            installmentNum: '06/12',
            dueDate: '10/06/2027',
            value: 'R$ 780,00',
            status: 'futuras',
            statusLabel: 'FUTURA',
            statusColor: 'bg-primary-container/20 text-primary',
            icon: 'event',
            iconColor: 'text-on-surface-variant bg-surface-container'
        }
    ]);

    // Filtering logic
    const filteredInstallments = installments.filter(inst => {
        const matchesSearch = inst.month.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              inst.statusLabel.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesTab = activeTab === 'todas' || inst.status === activeTab;

        return matchesSearch && matchesTab;
    });

    return (
        <StudentLayout>
            <Head title="Mensalidades | PlayUp Velocity" />

            <style dangerouslySetInnerHTML={{ __html: `
                .glass-panel { 
                    background: rgba(255, 255, 255, 0.7); 
                    backdrop-filter: blur(12px); 
                    border: 1px solid rgba(135, 179, 205, 0.15); 
                }
                .radial-progress { 
                    position: relative; 
                    width: 120px; 
                    height: 120px; 
                    border-radius: 50%; 
                    background: conic-gradient(#0050d4 120deg, #cfecff 0deg); 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                }
                .radial-progress::before { 
                    content: ""; 
                    position: absolute; 
                    width: 90px; 
                    height: 90px; 
                    background: white; 
                    border-radius: 50%; 
                }
                .radial-progress-content { 
                    position: relative; 
                    z-index: 10; 
                    text-align: center; 
                }
            `}} />

            <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 lg:space-y-8 relative">
                {/* Toast Notification */}
                {toastMessage && (
                    <div className="fixed bottom-24 left-4 right-4 sm:left-auto lg:bottom-8 lg:right-8 bg-[#003346] text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-50 border border-outline-variant/20 animate-fade-in">
                        <span className="material-symbols-outlined text-primary text-xl font-bold animate-pulse">check_circle</span>
                        <span className="text-sm font-semibold">{toastMessage}</span>
                    </div>
                )}

                {/* Back to financial dashboard */}
                <div className="flex items-center gap-2">
                    <Link href={route('student.financial')} className="flex items-center gap-1 text-xs font-bold text-on-surface-variant hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-sm">arrow_back</span>
                        Voltar para Financeiro
                    </Link>
                </div>

                {/* Grid Content */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Feed Area (8/12) */}
                    <div className="col-span-12 lg:col-span-8 space-y-8">
                        {/* Title block */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-headline font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">Mensalidades</h1>
                                <p className="text-slate-500 text-sm mt-1">Acompanhe todas as parcelas do seu curso e gerencie seus pagamentos.</p>
                            </div>
                            <button 
                                onClick={() => showToast("Exportando extrato financeiro...")}
                                className="flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 dark:bg-slate-900 dark:border-slate-800 text-primary font-bold px-4 py-2.5 rounded-2xl transition-all active:scale-95 text-xs shadow-sm"
                            >
                                <span className="material-symbols-outlined text-base">download</span>
                                <span>Exportar extrato</span>
                            </button>
                        </div>

                        {/* Summary Cards Row */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl shadow-sm flex flex-col justify-between h-28">
                                <div className="flex items-center justify-between">
                                    <span className="material-symbols-outlined text-emerald-600 bg-emerald-50 dark:bg-emerald-950 p-1.5 rounded-xl text-lg">check_circle</span>
                                    <span className="text-[9px] font-black text-emerald-800 bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded-md">OK</span>
                                </div>
                                <div>
                                    <p className="text-2xl font-headline font-black text-slate-800 dark:text-slate-100 leading-none">04</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mt-1">Parcelas Pagas</p>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl shadow-sm flex flex-col justify-between h-28 ring-2 ring-red-500/10">
                                <div className="flex items-center justify-between">
                                    <span className="material-symbols-outlined text-red-650 bg-red-50 dark:bg-red-950 p-1.5 rounded-xl text-lg">schedule</span>
                                    <span className="text-[9px] font-black text-red-850 bg-red-50 dark:bg-red-950 px-1.5 py-0.5 rounded-md">Pendente</span>
                                </div>
                                <div>
                                    <p className="text-2xl font-headline font-black text-slate-800 dark:text-slate-100 leading-none">01</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mt-1">Em Aberto</p>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl shadow-sm flex flex-col justify-between h-28">
                                <div className="flex items-center justify-between">
                                    <span className="material-symbols-outlined text-primary bg-primary/10 p-1.5 rounded-xl text-lg">calendar_month</span>
                                    <span className="text-[9px] font-black text-primary bg-primary/10 px-1.5 py-0.5 rounded-md">Agenda</span>
                                </div>
                                <div>
                                    <p className="text-2xl font-headline font-black text-slate-800 dark:text-slate-100 leading-none">07</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mt-1">Futuras</p>
                                </div>
                            </div>
                            <div className="bg-primary p-5 rounded-2xl flex flex-col justify-between h-28 text-white">
                                <div className="flex items-center justify-between">
                                    <span className="material-symbols-outlined text-white bg-white/20 p-1.5 rounded-xl text-lg">payments</span>
                                    <span className="text-[9px] font-black text-white bg-white/20 px-1.5 py-0.5 rounded-md">Total</span>
                                </div>
                                <div>
                                    <p className="text-xl font-headline font-black leading-none">R$ 15.000</p>
                                    <p className="text-[10px] font-bold text-white/70 uppercase tracking-wide mt-1">Valor do Curso</p>
                                </div>
                            </div>
                        </div>

                        {/* Search and Tab Controls Bar */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
                            {/* Tabs */}
                            <div className="flex gap-2 overflow-x-auto no-scrollbar py-1 shrink-0">
                                {['todas', 'pagas', 'aberto', 'futuras'].map((tab) => (
                                    <button 
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all capitalize shrink-0 ${activeTab === tab ? 'bg-primary text-white shadow-md shadow-primary/10' : 'bg-slate-50 dark:bg-slate-950 text-slate-500 hover:bg-slate-100'}`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                            
                            {/* Local Search input */}
                            <div className="relative group w-full md:max-w-xs">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-base">search</span>
                                <input 
                                    className="w-full pl-10 pr-4 py-1.5 bg-slate-50 dark:bg-slate-950 border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-xs font-medium" 
                                    placeholder="Buscar parcelas..." 
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Payment List */}
                        <div className="space-y-4">
                            {filteredInstallments.length > 0 ? (
                                filteredInstallments.map((inst) => {
                                    if (inst.status === 'aberto') {
                                        // May highlighted item layout
                                        return (
                                            <div key={inst.id} className="bg-[#fffbeb] dark:bg-amber-950/20 p-6 rounded-2xl border-2 border-[#fbbf24] flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden group">
                                                <div className="absolute top-0 left-0 w-1.5 h-full bg-[#fbbf24]"></div>
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${inst.iconColor}`}>
                                                        <span className="material-symbols-outlined text-2xl">{inst.icon}</span>
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <h4 className="text-base font-bold text-slate-800 dark:text-slate-150">{inst.month} • {inst.year}</h4>
                                                            {inst.warningBadge && (
                                                                <span className="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded tracking-wider uppercase">{inst.warningBadge}</span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                                                            <span>Parcela {inst.installmentNum}</span>
                                                            <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                                                            <span>Vencimento: {inst.dueDate}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col sm:flex-row md:items-center gap-4 sm:gap-6 self-start md:self-auto w-full md:w-auto">
                                                    <div className="text-left md:text-right">
                                                        <p className="text-xl font-black text-slate-800 dark:text-slate-150">{inst.value}</p>
                                                        <p className="text-[10px] font-bold text-[#d97706] uppercase">{inst.statusLabel}</p>
                                                    </div>
                                                    <div className="flex gap-2 w-full sm:w-auto">
                                                        <button 
                                                            onClick={() => showToast("Código Pix copiado para a área de transferência!")}
                                                            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-bold px-4 py-2.5 rounded-xl text-xs hover:bg-slate-50 transition-colors"
                                                        >
                                                            <span className="material-symbols-outlined text-base">content_copy</span>
                                                            <span>Copiar PIX</span>
                                                        </button>
                                                        <button 
                                                            onClick={() => showToast("Processando pagamento via Pix...")}
                                                            className="flex-1 sm:flex-none bg-primary text-white font-bold px-5 py-2.5 rounded-xl text-xs hover:scale-102 transition-transform shadow-md shadow-primary/20"
                                                        >
                                                            Pagar agora
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }

                                    // Paid and Future items layout
                                    return (
                                        <div key={inst.id} className={`bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between hover:shadow-md transition-all ${inst.status === 'futuras' ? 'opacity-70 hover:opacity-100' : ''}`}>
                                            <div className="flex items-center gap-4">
                                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${inst.iconColor}`}>
                                                    <span className="material-symbols-outlined text-2xl">{inst.icon}</span>
                                                </div>
                                                <div>
                                                    <h4 className="text-base font-bold text-slate-800 dark:text-slate-100">{inst.month} • {inst.year}</h4>
                                                    <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-400">
                                                        <span>Parcela {inst.installmentNum}</span>
                                                        <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                                                        <span>Vencimento: {inst.dueDate}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <div className="text-right">
                                                    <p className="text-base font-black text-slate-800 dark:text-slate-100">{inst.value}</p>
                                                    <span className={`text-[9px] font-black uppercase rounded px-1.5 py-0.5 ${inst.statusColor}`}>
                                                        {inst.statusLabel}
                                                    </span>
                                                </div>
                                                {inst.status === 'pagas' ? (
                                                    <button 
                                                        onClick={() => showToast(`Baixando recibo de ${inst.month}...`)}
                                                        className="bg-slate-50 dark:bg-slate-950 hover:bg-primary hover:text-white text-primary font-bold px-4 py-2 rounded-xl text-xs transition-colors shrink-0"
                                                    >
                                                        Visualizar
                                                    </button>
                                                ) : (
                                                    <button 
                                                        onClick={() => showToast(`Detalhes da parcela de ${inst.month}.`)}
                                                        className="text-slate-400 dark:text-slate-550 font-bold px-4 py-2 hover:bg-slate-50 rounded-xl text-xs transition-colors shrink-0"
                                                    >
                                                        Ver detalhes
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 text-center text-sm text-slate-400 rounded-2xl">
                                    Nenhuma parcela encontrada.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Sidebar Area (4/12) */}
                    <div className="col-span-12 lg:col-span-4 space-y-6">
                        {/* Next Installment Widget */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Próxima parcela</h3>
                            <div className="flex items-start justify-between mb-8">
                                <div>
                                    <p className="text-2xl font-headline font-black text-slate-850 dark:text-slate-100">R$ 780,00</p>
                                    <p className="text-xs font-semibold text-slate-500">Vence em 10 de Maio</p>
                                </div>
                                <span className="bg-red-50 text-red-500 text-[9px] font-black px-2 py-1 rounded uppercase tracking-wider flex items-center gap-1 shrink-0">
                                    <span className="material-symbols-outlined text-[10px]">warning</span> Em aberto
                                </span>
                            </div>
                            <div className="space-y-3">
                                <button 
                                    onClick={() => showToast("Código Pix copiado!")}
                                    className="w-full bg-primary text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:opacity-95 transition-all text-xs"
                                >
                                    <span className="material-symbols-outlined text-base">qr_code_2</span> 
                                    <span>Copiar PIX</span>
                                </button>
                                <button 
                                    onClick={() => showToast("Boleto gerado com sucesso!")}
                                    className="w-full bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-200 font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors text-xs"
                                >
                                    <span className="material-symbols-outlined text-base">description</span> 
                                    <span>Gerar boleto</span>
                                </button>
                                <button 
                                    onClick={() => showToast("Direcionando para pagamento com cartão...")}
                                    className="w-full bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-200 font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors text-xs"
                                >
                                    <span className="material-symbols-outlined text-base">credit_card</span> 
                                    <span>Pagar com cartão</span>
                                </button>
                            </div>
                        </div>

                        {/* Radial Progress Widget */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Seu progresso no curso</h3>
                            <div className="flex items-center gap-6">
                                <div className="radial-progress shrink-0">
                                    <div className="radial-progress-content">
                                        <p className="text-lg font-black text-primary leading-tight">33%</p>
                                        <p className="text-[8px] font-bold text-slate-400 uppercase">Concluído</p>
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xl font-headline font-black text-slate-800 dark:text-slate-100 leading-tight">5 de 12</p>
                                    <p className="text-xs text-slate-400 font-medium">Parcelas liquidadas</p>
                                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-1">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-slate-450 font-medium">Pago:</span>
                                            <span className="font-black text-emerald-650">R$ 5.000</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-slate-450 font-medium">Restante:</span>
                                            <span className="font-black text-slate-700 dark:text-slate-300">R$ 10.000</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Timeline Payment Widget */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Linha do tempo 2027</h3>
                            <div className="relative space-y-1">
                                <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-slate-100 dark:bg-slate-800"></div>
                                
                                {/* Month Green */}
                                <div className="flex items-center gap-4 relative z-10 py-1.5">
                                    <div className="w-5 h-5 bg-emerald-100 dark:bg-emerald-950 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-sm shrink-0">
                                        <span className="material-symbols-outlined text-[10px] text-emerald-800 font-black">check</span>
                                    </div>
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter truncate">Janeiro - Abril</span>
                                    <span className="ml-auto text-[10px] font-black text-emerald-600 shrink-0">PAGO</span>
                                </div>
                                {/* Month Yellow */}
                                <div className="flex items-center gap-4 relative z-10 py-1.5">
                                    <div className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-sm shrink-0">
                                        <span className="material-symbols-outlined text-[10px] text-white font-black">priority_high</span>
                                    </div>
                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-tighter">Maio</span>
                                    <span className="ml-auto text-[10px] font-black text-[#d97706] shrink-0">ABERTO</span>
                                </div>
                                {/* Months Blue/Gray */}
                                <div className="flex items-center gap-4 relative z-10 py-1.5 opacity-40">
                                    <div className="w-5 h-5 bg-slate-100 dark:bg-slate-800 rounded-full border-2 border-white dark:border-slate-900 shadow-sm shrink-0"></div>
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter truncate">Junho - Dezembro</span>
                                    <span className="ml-auto text-[10px] font-black text-slate-400 shrink-0">FUTURO</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
}
