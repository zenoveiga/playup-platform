export default function ControleMatricula({ data, setData, triggerToast }) {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-outline-variant/10 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#e8f0fe] dark:bg-blue-950/40 text-primary dark:text-[#00D1FF] flex items-center justify-center">
                    <span className="material-symbols-outlined text-xl">assignment_turned_in</span>
                </div>
                <h2 className="text-xl font-headline font-extrabold text-[#003346] dark:text-white">Controle de Matrícula</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-4">
                    <label className="block text-xs font-bold text-[#507c94] uppercase tracking-wider mb-2.5">Situação da Matrícula</label>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => setData('status', 'active')}
                            className={`px-4 py-2 text-xs font-bold rounded-lg select-none border transition-all ${data.status === 'active'
                                    ? 'bg-[#e6f4ea] dark:bg-emerald-950/60 text-[#137333] dark:text-emerald-400 border-emerald-500/40 shadow-sm'
                                    : 'bg-[#eff8ff] dark:bg-slate-950 text-[#507c94] border-transparent hover:border-[#507c94]/20'
                                }`}
                        >
                            Ativo
                        </button>
                        <button
                            type="button"
                            onClick={() => triggerToast('Matrícula trancada simulação')}
                            className="px-4 py-2 text-xs font-bold rounded-lg select-none bg-[#eff8ff] dark:bg-slate-950 text-[#507c94] border border-transparent hover:border-[#507c94]/20 transition-all"
                        >
                            Trancado
                        </button>
                        <button
                            type="button"
                            onClick={() => setData('status', 'inactive')}
                            className={`px-4 py-2 text-xs font-bold rounded-lg select-none border transition-all ${data.status === 'inactive'
                                    ? 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-500/20'
                                    : 'bg-[#eff8ff] dark:bg-slate-950 text-[#507c94] border-transparent hover:border-[#507c94]/20'
                                }`}
                        >
                            Inativo
                        </button>
                    </div>
                </div>

                <div className="md:col-span-3">
                    <label className="block text-xs font-bold text-[#507c94] uppercase tracking-wider mb-2">Data da Matrícula</label>
                    <input
                        type="date"
                        value={data.data_matricula}
                        onChange={e => setData('data_matricula', e.target.value)}
                        className="w-full bg-[#eff8ff] dark:bg-slate-950 border-none rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-primary/20 text-[#003346] dark:text-white outline-none"
                    />
                </div>

                <div className="md:col-span-5">
                    <label className="block text-xs font-bold text-[#507c94] uppercase tracking-wider mb-2">Follow-up (Notas de Acompanhamento)</label>
                    <textarea
                        value={data.follow_up}
                        onChange={e => setData('follow_up', e.target.value)}
                        placeholder="Insira observações sobre o progresso, necessidades especiais ou histórico do aluno..."
                        className="w-full h-12 bg-[#eff8ff] dark:bg-slate-950 border-none rounded-xl px-4 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-primary/20 text-[#003346] dark:text-white outline-none placeholder:text-[#507c94]/40"
                    />
                </div>
            </div>
        </div>
    );
}
