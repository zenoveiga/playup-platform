import StudentLayout from '@/Layouts/StudentLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function Financial() {
    // Toast state
    const [toastMessage, setToastMessage] = useState(null);

    const showToast = (message) => {
        setToastMessage(message);
        setTimeout(() => {
            setToastMessage(null);
        }, 3000);
    };

    return (
        <StudentLayout>
            <Head title="Financeiro | PlayUp Velocity" />

            <style dangerouslySetInnerHTML={{ __html: `
                .premium-card {
                    background-color: #ffffff;
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .premium-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 12px 24px -10px rgba(0, 51, 70, 0.08);
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #87b3cd33;
                    border-radius: 10px;
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

                {/* Page Header Section */}
                <section>
                    <h1 className="text-3xl sm:text-4xl font-headline font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">Financeiro</h1>
                    <p className="text-slate-500 mt-1 text-lg">Gerencie seus pagamentos, documentos e informações financeiras.</p>
                </section>

                {/* Summary Cards Grid */}
                <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                    <div className="premium-card p-4 sm:p-6 border border-slate-100 dark:border-slate-800 dark:bg-slate-900 rounded-2xl flex flex-col justify-between min-h-[8rem] sm:h-36 shadow-sm min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-3 sm:mb-4">
                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Situação Atual</span>
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center">
                                <span className="material-symbols-outlined text-emerald-600 text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-lg sm:text-2xl font-headline font-extrabold text-emerald-650">Em dia</p>
                            <p className="text-xs text-slate-400 mt-1">Sem pendências registradas</p>
                        </div>
                    </div>

                    <div className="premium-card p-4 sm:p-6 border border-slate-100 dark:border-slate-800 dark:bg-slate-900 rounded-2xl flex flex-col justify-between min-h-[8rem] sm:h-36 shadow-sm min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-3 sm:mb-4">
                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Próximo Vencimento</span>
                            <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-950 flex items-center justify-center">
                                <span className="material-symbols-outlined text-red-650 text-xl">calendar_month</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-lg sm:text-2xl font-headline font-extrabold text-slate-800 dark:text-slate-150">10 Mai</p>
                            <div className="flex items-center gap-1.5 mt-1">
                                <span className="text-xs text-red-650 font-bold">Vence em 6 dias</span>
                                <span className="text-xs text-slate-400">• Parcela 05/12</span>
                            </div>
                        </div>
                    </div>

                    <div className="premium-card p-4 sm:p-6 border border-slate-100 dark:border-slate-800 dark:bg-slate-900 rounded-2xl flex flex-col justify-between min-h-[8rem] sm:h-36 shadow-sm min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-3 sm:mb-4">
                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Em Aberto</span>
                            <div className="w-8 h-8 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                                <span className="material-symbols-outlined text-primary text-xl">account_balance_wallet</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-lg sm:text-2xl font-headline font-extrabold text-slate-800 dark:text-slate-150">R$ 1.250,00</p>
                            <div className="flex items-center justify-between mt-1">
                                <span className="text-xs text-slate-400">1 parcela em aberto</span>
                                <button onClick={() => showToast("Exibindo detalhamento de faturas.")} className="text-xs font-bold text-primary hover:underline">Ver detalhes</button>
                            </div>
                        </div>
                    </div>

                    <div className="premium-card p-4 sm:p-6 border border-slate-100 dark:border-slate-800 dark:bg-slate-900 rounded-2xl flex flex-col justify-between min-h-[8rem] sm:h-36 shadow-sm min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-3 sm:mb-4">
                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Total Pago</span>
                            <div className="w-8 h-8 rounded-lg bg-secondary/10 dark:bg-secondary/20 flex items-center justify-center">
                                <span className="material-symbols-outlined text-secondary text-xl">payments</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-lg sm:text-2xl font-headline font-extrabold text-slate-800 dark:text-slate-150">R$ 5.000,00</p>
                            <div className="flex items-center justify-between mt-1">
                                <span className="text-xs text-slate-400">Total acumulado no período</span>
                                <button onClick={() => showToast("Gerando extrato financeiro...")} className="text-xs font-bold text-primary hover:underline">Ver extrato</button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Main Action Block */}
                <section>
                    <h2 className="text-lg font-headline font-bold text-slate-800 dark:text-slate-200 mb-4">O que você deseja fazer?</h2>
                    <div className="grid grid-cols-3 gap-2 sm:gap-4">
                        <Link 
                            href={route('student.financial.installments')}
                            className="premium-card group p-5 border border-slate-100 dark:border-slate-800 dark:bg-slate-900 rounded-2xl text-left flex flex-col justify-between border-b-4 !p-3 sm:!p-5 hover:border-primary shadow-sm"
                        >
                            <div className="w-10 h-10 bg-primary/10 dark:bg-primary/20 rounded-xl flex items-center justify-center mb-4">
                                <span className="material-symbols-outlined text-primary">receipt_long</span>
                            </div>
                            <span className="text-xs sm:text-sm font-bold text-slate-750 dark:text-slate-205 flex-1 leading-tight">Mensalidades</span>
                            <span className="material-symbols-outlined text-slate-400/40 text-lg mt-2 sm:mt-4 group-hover:translate-x-1 transition-transform self-end">arrow_forward</span>
                        </Link>

                        <Link 
                            href={route('student.financial.payments')}
                            className="premium-card group p-5 border border-slate-100 dark:border-slate-800 dark:bg-slate-900 rounded-2xl text-left flex flex-col justify-between border-b-4 !p-3 sm:!p-5 hover:border-tertiary shadow-sm"
                        >
                            <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-950 rounded-xl flex items-center justify-center mb-4">
                                <span className="material-symbols-outlined text-emerald-600">check_circle</span>
                            </div>
                            <span className="text-xs sm:text-sm font-bold text-slate-750 dark:text-slate-205 flex-1 leading-tight">Pagamentos</span>
                            <span className="material-symbols-outlined text-slate-400/40 text-lg mt-2 sm:mt-4 group-hover:translate-x-1 transition-transform self-end">arrow_forward</span>
                        </Link>

                        <button 
                            onClick={() => showToast("Carregando configurações de faturamento...")}
                            className="premium-card group p-5 border border-slate-100 dark:border-slate-800 dark:bg-slate-900 rounded-2xl text-left flex flex-col justify-between border-b-4 !p-3 sm:!p-5 hover:border-cyan-500 shadow-sm"
                        >
                            <div className="w-10 h-10 bg-cyan-500/10 dark:bg-cyan-500/20 rounded-xl flex items-center justify-center mb-4">
                                <span className="material-symbols-outlined text-cyan-500">database</span>
                            </div>
                            <span className="text-xs sm:text-sm font-bold text-slate-750 dark:text-slate-205 flex-1 leading-tight">Dados Financeiros</span>
                            <span className="material-symbols-outlined text-slate-400/40 text-lg mt-2 sm:mt-4 group-hover:translate-x-1 transition-transform self-end">arrow_forward</span>
                        </button>
                    </div>
                </section>

                {/* Next Action Banner */}
                <section>
                    <div className="bg-primary/5 rounded-2xl p-8 border border-primary/10 flex flex-col lg:flex-row items-center justify-between gap-6 overflow-hidden relative">
                        {/* Visual Kinetic Element */}
                        <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
                        
                        <div className="flex-1 z-10">
                            <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-[10px] font-black tracking-widest rounded-full mb-3 uppercase">Próxima Ação</span>
                            <h3 className="text-2xl font-headline font-extrabold text-slate-800 dark:text-slate-100 mb-2">Sua próxima mensalidade vence em 6 dias</h3>
                            <div className="text-slate-500 font-semibold text-sm flex flex-wrap items-center gap-x-4 gap-y-1">
                                <span>Parcela 05/12</span>
                                <span className="w-1.5 h-1.5 bg-slate-350 dark:bg-slate-650 rounded-full"></span>
                                <span>Vencimento: 10/05/2024</span>
                                <span className="w-1.5 h-1.5 bg-slate-350 dark:bg-slate-650 rounded-full"></span>
                                <span className="text-primary font-bold">Valor: R$ 1.250,00</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 z-10 w-full lg:w-auto shrink-0">
                            <button 
                                onClick={() => showToast("Código Pix copiado para a área de transferência!")}
                                className="flex-1 lg:flex-none px-6 py-3 border-2 border-primary text-primary font-bold rounded-xl hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2 text-xs"
                            >
                                <span className="material-symbols-outlined text-lg">content_copy</span>
                                <span>Copiar PIX</span>
                            </button>
                            <button 
                                onClick={() => showToast("Processando pagamento seguro...")}
                                className="flex-1 lg:flex-none px-8 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-xs"
                            >
                                <span className="material-symbols-outlined text-lg">payments</span>
                                <span>Pagar agora</span>
                            </button>
                        </div>
                    </div>
                </section>

                {/* Lower Grid: Resume + History */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left: Resumo do Semestre */}
                    <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden flex flex-col shadow-sm">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                            <h2 className="text-lg font-headline font-bold text-slate-800 dark:text-slate-100">Resumo do Semestre</h2>
                            <p className="text-sm text-slate-400">Acompanhamento de parcelas quitadas e futuras.</p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[500px]">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-850">
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mês</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Valor</th>
                                        <th className="px-6 py-4 text-right"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {['Janeiro', 'Fevereiro', 'Março', 'Abril'].map((month, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/50 transition-colors">
                                            <td className="px-6 py-4 font-bold text-sm text-slate-700 dark:text-slate-300">{month}</td>
                                            <td className="px-6 py-4">
                                                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-full uppercase">Pago</span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">R$ 1.250,00</td>
                                            <td className="px-6 py-4 text-right">
                                                <button 
                                                    onClick={() => showToast(`Baixando comprovante de ${month}...`)}
                                                    className="p-2 text-slate-400 dark:text-slate-500 hover:text-primary transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-lg">download</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    <tr className="bg-amber-50/50 dark:bg-amber-950/20">
                                        <td className="px-6 py-4 font-bold text-sm text-amber-800 dark:text-amber-350">Maio</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 bg-amber-500/15 text-amber-600 text-[10px] font-black rounded-full uppercase">Em Aberto</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-amber-800 dark:text-amber-350">R$ 1.250,00</td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => showToast("Código Pix copiado!")}
                                                className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-amber-500 text-amber-600 text-[10px] font-bold rounded-lg hover:bg-amber-500 hover:text-white transition-all flex items-center gap-1 ml-auto"
                                            >
                                                <span className="material-symbols-outlined text-sm">content_copy</span>
                                                <span>Copiar PIX</span>
                                            </button>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-850/50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-sm text-slate-500">Junho</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 bg-slate-100 text-slate-500 text-[10px] font-black rounded-full uppercase">Futura</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-400">R$ 1.250,00</td>
                                        <td className="px-6 py-4 text-right">
                                            <button onClick={() => showToast("Mensalidade futura.")} className="text-[10px] font-bold text-primary hover:underline">Ver detalhes</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="p-6 bg-slate-50 dark:bg-slate-850/50 border-t border-slate-100 dark:border-slate-800 mt-auto space-y-4">
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-bold text-slate-500">Progresso de Quitação</span>
                                    <span className="text-xs font-black text-slate-700 dark:text-slate-300">5 de 12 parcelas quitadas (41%)</span>
                                </div>
                                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '41%' }}></div>
                                </div>
                            </div>
                            <div className="flex justify-between items-center border-t border-slate-100 dark:border-slate-800 pt-4">
                                <span className="text-xs text-slate-500 font-semibold">Total do Contrato</span>
                                <span className="text-lg font-headline font-extrabold text-slate-850 dark:text-slate-100">R$ 15.000,00</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Histórico de Pagamentos */}
                    <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex flex-col shadow-sm">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-headline font-bold text-slate-800 dark:text-slate-100">Histórico</h2>
                                <p className="text-sm text-slate-400">Atividades financeiras recentes.</p>
                            </div>
                            <button className="p-2 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-lg transition-colors">
                                <span className="material-symbols-outlined text-xl">filter_list</span>
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 relative max-h-[460px]">
                            {/* Timeline Line */}
                            <div className="absolute left-10 top-8 bottom-8 w-[2px] bg-slate-100 dark:bg-slate-800"></div>
                            
                            <div className="space-y-8 relative">
                                {/* Timeline Event 1 */}
                                <div className="flex gap-6 items-start">
                                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center z-10 ring-4 ring-white dark:ring-slate-900">
                                        <span className="material-symbols-outlined text-emerald-600 text-sm font-black">check</span>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">08 Mai, 2024</p>
                                        <h4 className="text-sm font-bold text-slate-700 dark:text-slate-205 mt-1">Parcela 04/12 quitada</h4>
                                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Pagamento realizado via PIX às 14:32</p>
                                    </div>
                                </div>
                                {/* Timeline Event 2 */}
                                <div className="flex gap-6 items-start">
                                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center z-10 ring-4 ring-white dark:ring-slate-900">
                                        <span className="material-symbols-outlined text-primary text-sm">receipt_long</span>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">10 Abr, 2024</p>
                                        <h4 className="text-sm font-bold text-slate-700 dark:text-slate-205 mt-1">Parcela 03/12 quitada</h4>
                                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Pagamento realizado via Cartão de Crédito</p>
                                    </div>
                                </div>
                                {/* Timeline Event 3 */}
                                <div className="flex gap-6 items-start">
                                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center z-10 ring-4 ring-white dark:ring-slate-900">
                                        <span className="material-symbols-outlined text-primary text-sm">receipt_long</span>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">10 Mar, 2024</p>
                                        <h4 className="text-sm font-bold text-slate-700 dark:text-slate-205 mt-1">Parcela 02/12 quitada</h4>
                                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Pagamento automático aprovado</p>
                                    </div>
                                </div>
                                {/* Timeline Event 4 */}
                                <div className="flex gap-6 items-start">
                                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center z-10 ring-4 ring-white dark:ring-slate-900">
                                        <span className="material-symbols-outlined text-primary text-sm">receipt_long</span>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">10 Fev, 2024</p>
                                        <h4 className="text-sm font-bold text-slate-700 dark:text-slate-205 mt-1">Parcela 01/12 quitada</h4>
                                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Primeira parcela do semestre liquidada</p>
                                    </div>
                                </div>
                                {/* Timeline Event 5 */}
                                <div className="flex gap-6 items-start">
                                    <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center z-10 ring-4 ring-white dark:ring-slate-900">
                                        <span className="material-symbols-outlined text-amber-600 text-sm">school</span>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">15 Jan, 2024</p>
                                        <h4 className="text-sm font-bold text-slate-700 dark:text-slate-205 mt-1">Matrícula confirmada</h4>
                                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Semestre 2024.1 - Eng. de Software</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/30 text-center">
                            <button onClick={() => showToast("Carregando histórico completo...")} className="text-xs font-bold text-primary hover:underline uppercase tracking-widest">Ver Histórico Completo</button>
                        </div>
                    </div>
                </div>

                {/* Info Footer Block */}
                <section>
                    <div className="premium-card border border-slate-100 dark:border-slate-800 dark:bg-slate-900 p-8 rounded-2xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-primary text-xl">security</span>
                            </div>
                            <div>
                                <h5 className="text-sm font-bold text-slate-800 dark:text-slate-200">Ambiente seguro</h5>
                                <p className="text-xs text-slate-400 mt-0.5">Criptografia de ponta-a-ponta em todas transações.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-primary text-xl">sync</span>
                            </div>
                            <div>
                                <h5 className="text-sm font-bold text-slate-800 dark:text-slate-200">Atualizações em tempo real</h5>
                                <p className="text-xs text-slate-400 mt-0.5">Baixa automática de pagamentos via PIX e Cartão.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-primary text-xl">history_edu</span>
                            </div>
                            <div>
                                <h5 className="text-sm font-bold text-slate-800 dark:text-slate-200">Comprovantes disponíveis</h5>
                                <p className="text-xs text-slate-400 mt-0.5">Acesse seus recibos e notas fiscais a qualquer momento.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-primary text-xl">support_agent</span>
                            </div>
                            <div>
                                <h5 className="text-sm font-bold text-slate-800 dark:text-slate-200">Suporte especializado</h5>
                                <p className="text-xs text-slate-400 mt-0.5">Canal direto com o departamento financeiro da instituição.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </StudentLayout>
    );
}
