import StudentLayout from '@/Layouts/StudentLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function Payments() {
    // Search query
    const [searchQuery, setSearchQuery] = useState('');

    // Filter selectors
    const [selectedCourse, setSelectedCourse] = useState('Todos os cursos');
    const [selectedMethod, setSelectedMethod] = useState('Todas');
    const [selectedStatus, setSelectedStatus] = useState('Todos');

    // Selected payment for drawer details
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Toast feedback state
    const [toastMessage, setToastMessage] = useState(null);

    const showToast = (message) => {
        setToastMessage(message);
        setTimeout(() => {
            setToastMessage(null);
        }, 3000);
    };

    // Payment transactions list
    const [payments] = useState([
        {
            id: 1,
            date: '08/05/2024',
            time: '14:32',
            title: 'Mensalidade Maio/2024 (05/12)',
            course: 'Marketing Digital',
            method: 'PIX',
            value: 'R$ 780,00',
            status: 'Pago',
            transactionId: '#PAY-2024-0582',
            statusColor: 'bg-tertiary-container text-on-tertiary-container'
        },
        {
            id: 2,
            date: '10/04/2024',
            time: '18:15',
            title: 'Mensalidade Abril/2024 (04/12)',
            course: 'Marketing Digital',
            method: 'Cartão de Crédito',
            value: 'R$ 780,00',
            status: 'Pago',
            transactionId: '#PAY-2024-0491',
            statusColor: 'bg-tertiary-container text-on-tertiary-container'
        },
        {
            id: 3,
            date: '10/03/2024',
            time: '10:04',
            title: 'Mensalidade Março/2024 (03/12)',
            course: 'Marketing Digital',
            method: 'PIX',
            value: 'R$ 780,00',
            status: 'Pago',
            transactionId: '#PAY-2024-0310',
            statusColor: 'bg-tertiary-container text-on-tertiary-container'
        },
        {
            id: 4,
            date: '10/02/2024',
            time: '09:20',
            title: 'Mensalidade Fevereiro/2024 (02/12)',
            course: 'Marketing Digital',
            method: 'PIX',
            value: 'R$ 780,00',
            status: 'Pago',
            transactionId: '#PAY-2024-0209',
            statusColor: 'bg-tertiary-container text-on-tertiary-container'
        }
    ]);

    // Handle open transaction details drawer
    const handleViewDetails = (payment) => {
        setSelectedPayment(payment);
        setIsDrawerOpen(true);
    };

    // Filter payments list
    const filteredPayments = payments.filter(pay => {
        const matchesSearch = pay.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              pay.transactionId.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesCourse = selectedCourse === 'Todos os cursos' || pay.course === selectedCourse;
        const matchesMethod = selectedMethod === 'Todas' || pay.method === selectedMethod;
        const matchesStatus = selectedStatus === 'Todos' || pay.status === selectedStatus;

        return matchesSearch && matchesCourse && matchesMethod && matchesStatus;
    });

    return (
        <StudentLayout>
            <Head title="Extrato Financeiro | PlayUp Velocity" />

            <style dangerouslySetInnerHTML={{ __html: `
                .glass-panel { 
                    background: rgba(239, 248, 255, 0.7); 
                    backdrop-filter: blur(24px); 
                    -webkit-backdrop-filter: blur(24px); 
                }
                .ghost-border { 
                    border: 1px solid rgba(135, 179, 205, 0.15); 
                }
                .ambient-shadow { 
                    box-shadow: 0 0 32px 0 rgba(0, 51, 70, 0.06); 
                }
                .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #cfecff; border-radius: 9999px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #b5e3ff; }
            `}} />

            <div className="p-8 max-w-7xl mx-auto space-y-8 relative">
                {/* Toast Notification */}
                {toastMessage && (
                    <div className="fixed bottom-8 right-8 bg-[#003346] text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-55 border border-outline-variant/20 animate-fade-in">
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

                {/* Page Header */}
                <div>
                    <h2 className="text-4xl font-headline font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">Extrato Financeiro</h2>
                    <p className="text-lg font-body text-slate-500 mt-2">Acompanhe todo o histórico de pagamentos realizados.</p>
                </div>

                {/* Summary Cards Row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between h-28">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-850 flex items-center justify-center text-primary shrink-0">
                                <span className="material-symbols-outlined text-xl">payments</span>
                            </div>
                            <h3 className="font-body text-xs font-bold text-slate-400">Total pago</h3>
                        </div>
                        <p className="font-headline text-2xl font-bold text-emerald-650">R$ 5.000,00</p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between h-28">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-850 flex items-center justify-center text-secondary shrink-0">
                                <span className="material-symbols-outlined text-xl">receipt_long</span>
                            </div>
                            <h3 className="font-body text-xs font-bold text-slate-400">Pagamentos</h3>
                        </div>
                        <p className="font-headline text-2xl font-bold text-slate-800 dark:text-slate-100">8</p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between h-28">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-850 flex items-center justify-center text-secondary-dim shrink-0">
                                <span className="material-symbols-outlined text-xl">event</span>
                            </div>
                            <h3 className="font-body text-xs font-bold text-slate-400">Último pago</h3>
                        </div>
                        <p className="font-headline text-2xl font-bold text-slate-800 dark:text-slate-100">08 Mai 2024</p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between h-28">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-850 flex items-center justify-center text-primary-dim shrink-0">
                                <span className="material-symbols-outlined text-xl">credit_card</span>
                            </div>
                            <h3 className="font-body text-xs font-bold text-slate-400">Mais utilizado</h3>
                        </div>
                        <p className="font-headline text-xl font-bold text-slate-800 dark:text-slate-100">PIX <span className="text-xs font-body text-slate-400 dark:text-slate-500 font-semibold">(5 vezes)</span></p>
                    </div>
                </div>

                {/* Filters Row */}
                <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-grow max-w-4xl">
                        {/* Period select */}
                        <div className="flex flex-col">
                            <label className="text-xs font-bold text-slate-400 mb-2 uppercase px-1">Período</label>
                            <select className="bg-slate-55 dark:bg-slate-950 border-none rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-primary/20 cursor-pointer">
                                <option>01/01/2024 - 31/12/2024</option>
                                <option>Últimos 30 dias</option>
                                <option>Últimos 6 meses</option>
                            </select>
                        </div>
                        
                        {/* Course Select */}
                        <div className="flex flex-col">
                            <label className="text-xs font-bold text-slate-400 mb-2 uppercase px-1">Curso</label>
                            <select 
                                value={selectedCourse}
                                onChange={(e) => setSelectedCourse(e.target.value)}
                                className="bg-slate-55 dark:bg-slate-950 border-none rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-primary/20 cursor-pointer"
                            >
                                <option>Todos os cursos</option>
                                <option>Marketing Digital</option>
                                <option>Engenharia de Software</option>
                            </select>
                        </div>

                        {/* Method Select */}
                        <div className="flex flex-col">
                            <label className="text-xs font-bold text-slate-400 mb-2 uppercase px-1">Forma</label>
                            <select 
                                value={selectedMethod}
                                onChange={(e) => setSelectedMethod(e.target.value)}
                                className="bg-slate-55 dark:bg-slate-950 border-none rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-primary/20 cursor-pointer"
                            >
                                <option>Todas</option>
                                <option>PIX</option>
                                <option>Cartão de Crédito</option>
                            </select>
                        </div>

                        {/* Status Select */}
                        <div className="flex flex-col">
                            <label className="text-xs font-bold text-slate-400 mb-2 uppercase px-1">Status</label>
                            <select 
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="bg-slate-55 dark:bg-slate-950 border-none rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-primary/20 cursor-pointer"
                            >
                                <option>Todos</option>
                                <option>Pago</option>
                                <option>Pendente</option>
                            </select>
                        </div>
                    </div>

                    {/* Search and Export Buttons */}
                    <div className="flex gap-3 shrink-0 items-center justify-end w-full xl:w-auto">
                        <div className="relative group flex-grow sm:flex-none">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-base">search</span>
                            <input 
                                className="pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-full text-xs font-medium focus:ring-2 focus:ring-primary/20 outline-none w-full sm:w-56" 
                                placeholder="Buscar pagamentos..." 
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button 
                            onClick={() => showToast("Exportando extrato...")}
                            className="flex items-center justify-center gap-2 h-9 px-4 bg-white dark:bg-slate-950 border border-primary rounded-xl text-primary text-xs font-bold hover:bg-slate-50 transition-colors"
                        >
                            <span className="material-symbols-outlined text-base">download</span>
                            <span>Exportar</span>
                        </button>
                    </div>
                </div>

                {/* Payments Table Card */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
                    <h3 className="text-lg font-headline font-bold text-slate-800 dark:text-slate-100">Histórico de Pagamentos</h3>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-850 border-b border-slate-100 dark:border-slate-850">
                                    <th className="px-6 py-4 font-headline text-xs font-bold text-slate-400 uppercase tracking-wider">Data</th>
                                    <th className="px-6 py-4 font-headline text-xs font-bold text-slate-400 uppercase tracking-wider">Descrição</th>
                                    <th className="px-6 py-4 font-headline text-xs font-bold text-slate-400 uppercase tracking-wider">Curso</th>
                                    <th className="px-6 py-4 font-headline text-xs font-bold text-slate-400 uppercase tracking-wider">Forma</th>
                                    <th className="px-6 py-4 font-headline text-xs font-bold text-slate-400 tracking-wider text-right uppercase">Valor</th>
                                    <th className="px-6 py-4 font-headline text-xs font-bold text-slate-400 tracking-wider text-center uppercase">Status</th>
                                    <th className="px-6 py-4 font-headline text-xs font-bold text-slate-400 tracking-wider text-center uppercase">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                                {filteredPayments.length > 0 ? (
                                    filteredPayments.map((pay) => (
                                        <tr 
                                            key={pay.id} 
                                            onClick={() => handleViewDetails(pay)}
                                            className={`hover:bg-slate-50/50 dark:hover:bg-slate-850/50 transition-colors cursor-pointer group ${selectedPayment?.id === pay.id ? 'bg-slate-50 dark:bg-slate-850/80 border-l-4 border-primary' : ''}`}
                                        >
                                            <td className="px-6 py-4 text-sm font-medium text-slate-700 dark:text-slate-350">{pay.date}</td>
                                            <td className="px-6 py-4 text-sm text-slate-800 dark:text-slate-100 font-bold">{pay.title}</td>
                                            <td className="px-6 py-4 text-sm text-slate-500">{pay.course}</td>
                                            <td className="px-6 py-4 text-sm text-slate-500">{pay.method}</td>
                                            <td className="px-6 py-4 text-sm font-black text-slate-850 dark:text-slate-100 text-right">{pay.value}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${pay.statusColor}`}>
                                                    {pay.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-center gap-2 text-slate-400">
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); handleViewDetails(pay); }}
                                                        className="hover:text-primary transition-colors p-1"
                                                    >
                                                        <span className="material-symbols-outlined text-base">visibility</span>
                                                    </button>
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); showToast(`Mais opções para a fatura ${pay.transactionId}`); }}
                                                        className="hover:text-primary transition-colors p-1"
                                                    >
                                                        <span className="material-symbols-outlined text-base">more_vert</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-10 text-center text-sm text-slate-450 dark:text-slate-500">
                                            Nenhum pagamento registrado.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Sliding Right Side Drawer Details Panel */}
                {isDrawerOpen && selectedPayment && (
                    <div className="fixed inset-0 z-50 flex justify-end">
                        {/* Backdrop overlay */}
                        <div className="absolute inset-0 bg-[#003346]/10 backdrop-blur-sm" onClick={() => setIsDrawerOpen(false)}></div>
                        
                        {/* Drawer body */}
                        <div className="relative w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl flex flex-col h-full z-50 border-l border-slate-100 dark:border-slate-800 animate-slide-in-right">
                            {/* Drawer Header */}
                            <div className="p-6 pb-4 flex justify-between items-start border-b border-slate-50 dark:border-slate-850">
                                <div>
                                    <h2 className="text-xl font-headline font-bold text-slate-800 dark:text-slate-100">Detalhes do Pagamento</h2>
                                    <p className="text-xs font-mono text-slate-400 mt-1">Transaction ID: {selectedPayment.transactionId}</p>
                                </div>
                                <button 
                                    onClick={() => setIsDrawerOpen(false)}
                                    className="text-slate-400 hover:text-primary transition-colors p-1.5 rounded-full hover:bg-slate-50 dark:hover:bg-slate-850"
                                >
                                    <span className="material-symbols-outlined text-xl">close</span>
                                </button>
                            </div>

                            {/* Drawer Content */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                                {/* Confirm status */}
                                <div className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-350 rounded-2xl p-4 flex items-center gap-3">
                                    <span className="material-symbols-outlined text-xl">check_circle</span>
                                    <span className="font-headline font-bold text-sm">Pagamento Confirmado</span>
                                </div>

                                {/* Details List */}
                                <div className="flex flex-col gap-4">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="font-body text-slate-400">Descrição</span>
                                        <span className="font-body font-bold text-slate-700 dark:text-slate-200 text-right">{selectedPayment.title.split('(')[0]}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="font-body text-slate-400">Curso</span>
                                        <span className="font-body font-bold text-slate-700 dark:text-slate-200 text-right">{selectedPayment.course}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="font-body text-slate-400">Valor</span>
                                        <span className="font-headline text-lg font-black text-slate-800 dark:text-slate-100 text-right">{selectedPayment.value}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="font-body text-slate-400">Data/Hora</span>
                                        <span className="font-body font-bold text-slate-700 dark:text-slate-200 text-right">{selectedPayment.date} {selectedPayment.time}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="font-body text-slate-400">Forma</span>
                                        <span className="font-body font-bold text-slate-700 dark:text-slate-200 text-right">{selectedPayment.method}</span>
                                    </div>
                                </div>

                                {/* Documents list block */}
                                <div className="space-y-3">
                                    <h4 className="font-headline font-bold text-sm text-slate-800 dark:text-slate-250">Documentos</h4>
                                    <div className="flex flex-col gap-2">
                                        <button 
                                            onClick={() => showToast("Efetuando download do comprovante...")}
                                            className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-850 transition-colors w-full group text-left"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="material-symbols-outlined text-red-500">picture_as_pdf</span>
                                                <span className="font-body text-xs font-semibold text-slate-700 dark:text-slate-350">Comprovante de pagamento</span>
                                            </div>
                                            <span className="material-symbols-outlined text-slate-400 group-hover:text-primary text-sm">download</span>
                                        </button>
                                        
                                        <button 
                                            onClick={() => showToast("Efetuando download da Nota Fiscal...")}
                                            className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-850 transition-colors w-full group text-left"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="material-symbols-outlined text-red-500">picture_as_pdf</span>
                                                <span className="font-body text-xs font-semibold text-slate-700 dark:text-slate-350">Nota Fiscal</span>
                                            </div>
                                            <span className="material-symbols-outlined text-slate-400 group-hover:text-primary text-sm">download</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Drawer Footer */}
                            <div className="p-6 bg-slate-50/50 dark:bg-slate-950/20 border-t border-slate-100 dark:border-slate-850 flex flex-col gap-3">
                                <button 
                                    onClick={() => showToast("Efetuando download do recibo...")}
                                    className="w-full py-3 bg-primary text-white text-xs font-bold rounded-2xl hover:opacity-90 shadow-md shadow-primary/10 transition-opacity"
                                >
                                    Baixar Recibo
                                </button>
                                <button 
                                    onClick={() => setIsDrawerOpen(false)}
                                    className="w-full py-3 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors rounded-2xl text-xs"
                                >
                                    Fechar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </StudentLayout>
    );
}
