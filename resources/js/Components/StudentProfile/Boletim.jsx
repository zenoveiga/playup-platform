export default function Boletim({ student, data, setData, processing, handleSave, isSchoolAdmin, triggerToast }) {
    const grades = [
        { subject: 'Língua Portuguesa', b1: '8,5', b2: '9,0', b3: '8,5', b4: '-', avg: '8,7', status: 'Aprovado' },
        { subject: 'Matemática', b1: '7,0', b2: '7,5', b3: '8,0', b4: '-', avg: '7,5', status: 'Aprovado' },
        { subject: 'História', b1: '9,0', b2: '8,5', b3: '9,0', b4: '-', avg: '8,8', status: 'Aprovado' },
        { subject: 'Geografia', b1: '8,5', b2: '8,0', b3: '8,5', b4: '-', avg: '8,3', status: 'Aprovado' },
        { subject: 'Ciências', b1: '8,0', b2: '8,5', b3: '9,0', b4: '-', avg: '8,5', status: 'Aprovado' },
        { subject: 'Inglês', b1: '9,5', b2: '9,5', b3: '9,0', b4: '-', avg: '9,3', status: 'Aprovado' },
        { subject: 'Educação Física', b1: '10,0', b2: '10,0', b3: '10,0', b4: '-', avg: '10,0', status: 'Aprovado' }
    ];

    return (
        <div className="space-y-6">
            {/* Boletim Header and Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h3 className="font-headline font-bold text-lg text-[#003346] dark:text-white">
                    Boletim Escolar - 1º Semestre / 2024
                </h3>
                <div className="flex gap-2 w-full sm:w-auto">
                    <button
                        type="button"
                        onClick={() => triggerToast('Visualizando PDF do Boletim')}
                        className="flex-1 sm:flex-none border border-outline-variant/15 dark:border-slate-800 text-[#003346] dark:text-[#87b3cd] hover:bg-slate-50 dark:hover:bg-slate-850 px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all select-none active:scale-95"
                    >
                        <span className="material-symbols-outlined text-md">visibility</span>
                        <span>Visualizar PDF</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => triggerToast('Imprimindo Boletim')}
                        className="flex-1 sm:flex-none border border-outline-variant/15 dark:border-slate-800 text-[#003346] dark:text-[#87b3cd] hover:bg-slate-50 dark:hover:bg-slate-850 px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all select-none active:scale-95"
                    >
                        <span className="material-symbols-outlined text-md">print</span>
                        <span>Imprimir</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => triggerToast('Enviado ao responsável')}
                        className="flex-1 sm:flex-none bg-primary text-white hover:opacity-95 px-5 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all select-none shadow-md shadow-primary/20 active:scale-95"
                    >
                        <span className="material-symbols-outlined text-md" style={{ fontVariationSettings: "'wght' 500" }}>send</span>
                        <span>Enviar ao Responsável</span>
                    </button>
                </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-[#eff8ff]/40 dark:bg-slate-950 p-4 rounded-2xl border border-outline-variant/5 dark:border-slate-800/40 text-center flex flex-col justify-center relative">
                    <span className="material-symbols-outlined absolute top-2 right-2 text-primary dark:text-[#00D1FF] text-sm opacity-55">star</span>
                    <span className="text-[10px] text-[#507c94] dark:text-[#87b3cd] uppercase tracking-wider font-bold">Média Geral</span>
                    <span className="text-2xl font-black text-primary dark:text-[#00D1FF] font-headline mt-1">8,3</span>
                </div>
                <div className="bg-[#eff8ff]/40 dark:bg-slate-950 p-4 rounded-2xl border border-outline-variant/5 dark:border-slate-800/40 text-center flex flex-col justify-center relative">
                    <span className="material-symbols-outlined absolute top-2 right-2 text-primary dark:text-[#00D1FF] text-sm opacity-55">pie_chart</span>
                    <span className="text-[10px] text-[#507c94] dark:text-[#87b3cd] uppercase tracking-wider font-bold">Frequência Geral</span>
                    <span className="text-2xl font-black text-primary dark:text-[#00D1FF] font-headline mt-1">94%</span>
                </div>
                <div className="bg-[#eff8ff]/40 dark:bg-slate-950 p-4 rounded-2xl border border-outline-variant/5 dark:border-slate-800/40 text-center flex flex-col justify-center relative">
                    <span className="material-symbols-outlined absolute top-2 right-2 text-[#006a35] dark:text-emerald-400 text-sm opacity-55">check_circle</span>
                    <span className="text-[10px] text-[#507c94] dark:text-[#87b3cd] uppercase tracking-wider font-bold">Situação</span>
                    <span className="text-base font-black text-[#006a35] dark:text-emerald-400 font-headline mt-1.5 uppercase">Aprovado</span>
                </div>
                <div className="bg-[#eff8ff]/40 dark:bg-slate-950 p-4 rounded-2xl border border-outline-variant/5 dark:border-slate-800/40 text-center flex flex-col justify-center relative">
                    <span className="material-symbols-outlined absolute top-2 right-2 text-primary dark:text-[#00D1FF] text-sm opacity-55">group</span>
                    <span className="text-[10px] text-[#507c94] dark:text-[#87b3cd] uppercase tracking-wider font-bold">Posição na Turma</span>
                    <span className="text-xl font-black text-primary dark:text-[#00D1FF] font-headline mt-1">3º / 32</span>
                </div>
                <div className="bg-[#eff8ff]/40 dark:bg-slate-950 p-4 rounded-2xl border border-outline-variant/5 dark:border-slate-800/40 text-center col-span-2 md:col-span-1 flex flex-col justify-center relative">
                    <span className="material-symbols-outlined absolute top-2 right-2 text-[#b31b25] dark:text-red-400 text-sm opacity-55">calendar_today</span>
                    <span className="text-[10px] text-[#507c94] dark:text-[#87b3cd] uppercase tracking-wider font-bold">Faltas</span>
                    <span className="text-2xl font-black text-error dark:text-red-400 font-headline mt-1">6</span>
                </div>
            </div>

            {/* Grades Table */}
            <div className="overflow-x-auto rounded-2xl border border-outline-variant/10 dark:border-slate-850 shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[#eff8ff]/45 dark:bg-slate-950/60 border-b border-outline-variant/10 dark:border-slate-850 text-xs text-[#507c94] dark:text-[#87b3cd] font-black uppercase tracking-wider">
                            <th className="px-6 py-4 text-left w-[35%]">Disciplinas</th>
                            <th className="px-6 py-4 text-center">B1</th>
                            <th className="px-6 py-4 text-center">B2</th>
                            <th className="px-6 py-4 text-center">B3</th>
                            <th className="px-6 py-4 text-center">B4</th>
                            <th className="px-6 py-4 text-center">Média</th>
                            <th className="px-6 py-4 text-right">Situação</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/5 dark:divide-slate-850 text-sm font-semibold text-[#003346] dark:text-[#eff8ff]/95">
                        {grades.map((g, idx) => (
                            <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-850/40 transition-colors">
                                <td className="px-6 py-4 text-left font-bold">{g.subject}</td>
                                <td className="px-6 py-4 text-center text-[#507c94] dark:text-[#87b3cd]/80">{g.b1}</td>
                                <td className="px-6 py-4 text-center text-[#507c94] dark:text-[#87b3cd]/80">{g.b2}</td>
                                <td className="px-6 py-4 text-center text-[#507c94] dark:text-[#87b3cd]/80">{g.b3}</td>
                                <td className="px-6 py-4 text-center text-[#507c94] dark:text-[#87b3cd]/80">{g.b4}</td>
                                <td className="px-6 py-4 text-center font-black text-primary dark:text-[#00D1FF] text-base">{g.avg}</td>
                                <td className="px-6 py-4 text-right">
                                    <span className="text-[#006a35] dark:text-emerald-400 px-3 py-1 bg-[#e6f4ea] dark:bg-emerald-950/60 rounded-md text-xs font-black uppercase tracking-wider border border-emerald-500/10">
                                        {g.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Legenda Footer */}
            <p className="text-[10px] text-[#507c94]/70 dark:text-[#87b3cd]/70 font-bold border-t border-outline-variant/10 pt-4">
                Legenda: B1 - 1º Bimestre | B2 - 2º Bimestre | B3 - 3º Bimestre | B4 - 4º Bimestre
            </p>
        </div>
    );
}
