export default function DadosAcademicos({ data, setData }) {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-outline-variant/10 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#e8f0fe] dark:bg-blue-950/40 text-primary dark:text-[#00D1FF] flex items-center justify-center">
                    <span className="material-symbols-outlined text-xl">school</span>
                </div>
                <h2 className="text-xl font-headline font-extrabold text-[#003346] dark:text-white">Dados Acadêmicos</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                    <label className="block text-xs font-bold text-[#507c94] uppercase tracking-wider mb-2">Curso / Pacote</label>
                    <select
                        value={data.curso}
                        onChange={e => setData('curso', e.target.value)}
                        className="w-full bg-[#eff8ff] dark:bg-slate-950 border-none rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-primary/20 text-[#003346] dark:text-white outline-none select-none"
                    >
                        <option value="Ensino Fundamental">Ensino Fundamental</option>
                        <option value="Ensino Médio">Ensino Médio</option>
                        <option value="Técnico em TI">Técnico em TI</option>
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-bold text-[#507c94] uppercase tracking-wider mb-2">Unidade (Polo)</label>
                    <select
                        value={data.polo}
                        onChange={e => setData('polo', e.target.value)}
                        className="w-full bg-[#eff8ff] dark:bg-slate-950 border-none rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-primary/20 text-[#003346] dark:text-white outline-none select-none"
                    >
                        <option value="Polo Centro">Polo Centro</option>
                        <option value="Polo Sul">Polo Sul</option>
                        <option value="Polo Norte">Polo Norte</option>
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-bold text-[#507c94] uppercase tracking-wider mb-2">Turma</label>
                    <input
                        type="text"
                        value={data.turma}
                        onChange={e => setData('turma', e.target.value)}
                        className="w-full bg-[#eff8ff] dark:bg-slate-950 border-none rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-primary/20 text-[#003346] dark:text-white outline-none"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-[#507c94] uppercase tracking-wider mb-2">Professor Responsável</label>
                    <input
                        type="text"
                        value={data.professor}
                        onChange={e => setData('professor', e.target.value)}
                        className="w-full bg-[#eff8ff] dark:bg-slate-950 border-none rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-primary/20 text-[#003346] dark:text-white outline-none"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-[#507c94] uppercase tracking-wider mb-2">Nº da Matrícula</label>
                    <input
                        type="text"
                        readOnly
                        value={data.matricula}
                        className="w-full bg-[#eff8ff] dark:bg-slate-950/50 border-none rounded-xl px-4 py-3 text-sm font-semibold text-[#507c94]/70 dark:text-slate-400 outline-none cursor-not-allowed"
                    />
                    <span className="text-[10px] text-[#507c94]/60 dark:text-[#87b3cd]/60 mt-1 block">Gerado automaticamente pelo sistema.</span>
                </div>

                <div>
                    <label className="block text-xs font-bold text-[#507c94] uppercase tracking-wider mb-2">Data da Matrícula</label>
                    <div className="relative">
                        <input
                            type="date"
                            value={data.data_matricula}
                            onChange={e => setData('data_matricula', e.target.value)}
                            className="w-full bg-[#eff8ff] dark:bg-slate-950 border-none rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-primary/20 text-[#003346] dark:text-white outline-none"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-[#507c94] uppercase tracking-wider mb-2">Período Letivo</label>
                    <input
                        type="text"
                        value={data.periodo_letivo}
                        onChange={e => setData('periodo_letivo', e.target.value)}
                        className="w-full bg-[#eff8ff] dark:bg-slate-950 border-none rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-primary/20 text-[#003346] dark:text-white outline-none"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-[#507c94] uppercase tracking-wider mb-2">Situação</label>
                    <div className="inline-flex items-center bg-[#e6f4ea] dark:bg-emerald-950 text-[#137333] dark:text-emerald-400 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider select-none border border-emerald-500/10 mt-1">
                        <span>Ativo</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
