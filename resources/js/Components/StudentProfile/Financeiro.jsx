export default function Financeiro({ student }) {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-outline-variant/10 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#e8f0fe] dark:bg-blue-950/40 text-primary dark:text-[#00D1FF] flex items-center justify-center">
                        <span className="material-symbols-outlined text-xl">payments</span>
                    </div>
                    <h2 className="text-xl font-headline font-extrabold text-[#003346] dark:text-white">Controle Financeiro</h2>
                </div>
                <span className="bg-[#e6f4ea] dark:bg-emerald-950 text-[#137333] dark:text-[#6bfe9c] px-3 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase">
                    Adimplente
                </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-[#eff8ff]/40 dark:bg-slate-950 p-6 rounded-2xl border border-outline-variant/5">
                    <span className="text-xs text-[#507c94] font-bold block uppercase tracking-wider">Status Geral</span>
                    <span className="text-xl font-black text-[#006a35] dark:text-emerald-400 mt-2 block font-headline">Boletos 100% Pagos</span>
                </div>
                <div className="bg-[#eff8ff]/40 dark:bg-slate-950 p-6 rounded-2xl border border-outline-variant/5">
                    <span className="text-xs text-[#507c94] font-bold block uppercase tracking-wider">Próximo Vencimento</span>
                    <span className="text-xl font-black text-[#003346] dark:text-white mt-2 block font-headline">10/08/2026</span>
                </div>
                <div className="bg-[#eff8ff]/40 dark:bg-slate-950 p-6 rounded-2xl border border-outline-variant/5">
                    <span className="text-xs text-[#507c94] font-bold block uppercase tracking-wider">Valor Mensalidade</span>
                    <span className="text-xl font-black text-primary dark:text-[#00D1FF] mt-2 block font-headline">R$ 499,90</span>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="font-headline font-bold text-sm text-[#003346] dark:text-white uppercase tracking-wider">Faturas Recentes</h3>
                
                <div className="overflow-x-auto rounded-2xl border border-outline-variant/10 dark:border-slate-850 shadow-sm">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#eff8ff]/45 dark:bg-slate-950/60 border-b border-outline-variant/10 dark:border-slate-850 text-xs text-[#507c94] dark:text-[#87b3cd] font-black uppercase tracking-wider">
                                <th className="px-6 py-4 w-[40%]">Fatura / Referência</th>
                                <th className="px-6 py-4 text-center">Vencimento</th>
                                <th className="px-6 py-4 text-center">Meio de Pagamento</th>
                                <th className="px-6 py-4 text-center">Valor</th>
                                <th className="px-6 py-4 text-right">Situação</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/5 dark:divide-slate-850 text-sm font-semibold text-[#003346] dark:text-[#eff8ff]/95">
                            {[
                                { ref: 'Mensalidade Julho/2026', due: '10/07/2026', value: 'R$ 499,90', status: 'Pago', type: 'Boleto' },
                                { ref: 'Mensalidade Junho/2026', due: '10/06/2026', value: 'R$ 499,90', status: 'Pago', type: 'Boleto' },
                                { ref: 'Taxa de Matrícula 2026', due: '12/02/2026', value: 'R$ 150,00', status: 'Pago', type: 'Cartão de Crédito' }
                            ].map((fat, idx) => (
                                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-850/40 transition-colors">
                                    <td className="px-6 py-4 font-bold">{fat.ref}</td>
                                    <td className="px-6 py-4 text-center text-[#507c94] dark:text-[#87b3cd] font-medium">{fat.due}</td>
                                    <td className="px-6 py-4 text-center text-[#507c94] dark:text-[#87b3cd]/80 font-semibold">{fat.type}</td>
                                    <td className="px-6 py-4 text-center font-black text-primary dark:text-[#00D1FF] text-base">{fat.value}</td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="text-[#137333] dark:text-emerald-400 px-3 py-1 bg-[#e6f4ea] dark:bg-emerald-950/60 rounded-md text-xs font-black uppercase tracking-wider border border-emerald-500/10">
                                            {fat.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
