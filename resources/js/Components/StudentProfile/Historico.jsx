export default function Historico({ student, triggerToast }) {
    const historicalCourses = [
        { name: 'Língua Portuguesa - Nível 1', teacher: 'Prof. Helena Marcondes', completion: 'Dez 2023', duration: '80h', grade: '9.2', status: 'APROVADO' },
        { name: 'Matemática Avançada I', teacher: 'Prof. Carlos Eduardo', completion: 'Dez 2023', duration: '120h', grade: '8.5', status: 'APROVADO' },
        { name: 'História do Brasil', teacher: 'Prof. Pedro Sampaio', completion: 'Jul 2023', duration: '60h', grade: '9.8', status: 'APROVADO' },
        { name: 'Lógica Computacional', teacher: 'Prof. Marcos André', completion: 'Nov 2022', duration: '40h', grade: '8.7', status: 'APROVADO' }
    ];

    return (
        <div className="space-y-6">
            
            {/* Top Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {/* Card: Cursos Concluídos */}
                <div className="bg-[#eff8ff]/30 dark:bg-slate-900 rounded-[2rem] p-6 border border-outline-variant/10 shadow-sm text-center flex flex-col justify-between h-36">
                    <span className="text-[10px] text-[#507c94] dark:text-[#87b3cd] font-black uppercase tracking-wider leading-tight">
                        Cursos Concluídos
                    </span>
                    <span className="text-4xl font-headline font-black text-primary dark:text-[#00D1FF] block my-2">
                        12
                    </span>
                    <span className="text-[9px] text-[#507c94]/60 dark:text-slate-400 font-bold block">
                        No período letivo
                    </span>
                </div>

                {/* Card: Carga Horária */}
                <div className="bg-[#eff8ff]/30 dark:bg-slate-900 rounded-[2rem] p-6 border border-outline-variant/10 shadow-sm text-center flex flex-col justify-between h-36">
                    <span className="text-[10px] text-[#507c94] dark:text-[#87b3cd] font-black uppercase tracking-wider leading-tight">
                        Carga Horária
                    </span>
                    <div className="my-2">
                        <span className="text-3xl font-headline font-black text-primary dark:text-[#00D1FF] block leading-none">
                            420h
                        </span>
                        <span className="text-[9px] text-[#507c94]/80 dark:text-[#87b3cd] font-bold block mt-1 uppercase tracking-wider">
                            De 1200h
                        </span>
                    </div>
                    <span className="text-[9px] text-[#507c94]/60 dark:text-slate-400 font-bold block">
                        Horas totais cumpridas
                    </span>
                </div>

                {/* Card: Certificados */}
                <div className="bg-[#eff8ff]/30 dark:bg-slate-900 rounded-[2rem] p-6 border border-outline-variant/10 shadow-sm text-center flex flex-col justify-between h-36">
                    <span className="text-[10px] text-[#507c94] dark:text-[#87b3cd] font-black uppercase tracking-wider leading-tight">
                        Certificados
                    </span>
                    <span className="text-4xl font-headline font-black text-primary dark:text-[#00D1FF] block my-2">
                        08
                    </span>
                    <span className="text-[9px] text-[#507c94]/60 dark:text-slate-400 font-bold block">
                        Registrados no sistema
                    </span>
                </div>

                {/* Card: Média Geral */}
                <div className="bg-[#eff8ff]/30 dark:bg-slate-900 rounded-[2rem] p-6 border border-outline-variant/10 shadow-sm text-center flex flex-col justify-between h-36">
                    <span className="text-[10px] text-[#507c94] dark:text-[#87b3cd] font-black uppercase tracking-wider leading-tight">
                        Média Geral
                    </span>
                    <span className="text-4xl font-headline font-black text-primary dark:text-[#00D1FF] block my-2">
                        8.9
                    </span>
                    <span className="text-[9px] text-[#507c94]/60 dark:text-slate-400 font-bold block">
                        Desempenho histórico
                    </span>
                </div>

                {/* Card: Frequência */}
                <div className="bg-[#eff8ff]/30 dark:bg-slate-900 rounded-[2rem] p-6 border border-outline-variant/10 shadow-sm text-center flex flex-col justify-between h-36">
                    <span className="text-[10px] text-[#507c94] dark:text-[#87b3cd] font-black uppercase tracking-wider leading-tight">
                        Frequência
                    </span>
                    <span className="text-4xl font-headline font-black text-primary dark:text-[#00D1FF] block my-2">
                        96.5%
                    </span>
                    <span className="text-[9px] text-[#507c94]/60 dark:text-slate-400 font-bold block">
                        Presença em aulas
                    </span>
                </div>

                {/* Card: Instituição */}
                <div className="bg-[#eff8ff]/30 dark:bg-slate-900 rounded-[2rem] p-6 border border-outline-variant/10 shadow-sm text-center flex flex-col justify-between h-36">
                    <span className="text-[10px] text-[#507c94] dark:text-[#87b3cd] font-black uppercase tracking-wider leading-tight">
                        Instituição
                    </span>
                    <span className="text-3xl font-headline font-black text-primary dark:text-[#00D1FF] block my-2">
                        1a 4m
                    </span>
                    <span className="text-[9px] text-[#507c94]/60 dark:text-slate-400 font-bold block">
                        Tempo de vínculo
                    </span>
                </div>
            </div>

            {/* Course Transcript Table Card */}
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-outline-variant/10 dark:border-slate-800 shadow-sm space-y-6">
                
                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h3 className="font-headline font-black text-2xl text-[#003346] dark:text-white">
                        Histórico de Cursos
                    </h3>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <button
                            type="button"
                            onClick={() => triggerToast('Imprimindo Histórico Escolar')}
                            className="flex-1 sm:flex-none border border-outline-variant/15 dark:border-slate-800 bg-[#eff8ff]/40 dark:bg-slate-850 text-[#003346] dark:text-[#87b3cd] hover:bg-[#eff8ff] dark:hover:bg-slate-750 px-5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all select-none active:scale-95"
                        >
                            <span className="material-symbols-outlined text-md">print</span>
                            <span>Imprimir Completo</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => triggerToast('Fazendo download do arquivo PDF')}
                            className="flex-1 sm:flex-none bg-[#0050d4] text-white hover:opacity-95 px-5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all select-none shadow-md shadow-blue-500/10 active:scale-95"
                        >
                            <span className="material-symbols-outlined text-md">download</span>
                            <span>Baixar Histórico</span>
                        </button>
                    </div>
                </div>

                {/* Table of Historic Courses */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#eff8ff]/45 dark:bg-slate-950/60 border-b border-outline-variant/10 dark:border-slate-850 text-xs text-[#507c94] dark:text-[#87b3cd] font-black uppercase tracking-wider">
                                <th className="px-6 py-4 w-[40%]">Curso / Disciplina</th>
                                <th className="px-6 py-4 text-center">Conclusão</th>
                                <th className="px-6 py-4 text-center">Carga Horária</th>
                                <th className="px-6 py-4 text-center">Média Final</th>
                                <th className="px-6 py-4 text-right">Situação</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/5 dark:divide-slate-850 text-sm font-semibold text-[#003346] dark:text-[#eff8ff]/95">
                            {historicalCourses.map((c, idx) => (
                                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-850/40 transition-colors">
                                    <td className="px-6 py-5">
                                        <p className="font-extrabold text-[#003346] dark:text-white text-base leading-tight">{c.name}</p>
                                        <p className="text-xs text-[#507c94] dark:text-[#87b3cd]/80 font-medium mt-1">{c.teacher}</p>
                                    </td>
                                    <td className="px-6 py-5 text-center text-[#507c94] dark:text-[#87b3cd] font-medium">{c.completion}</td>
                                    <td className="px-6 py-5 text-center text-[#507c94] dark:text-[#87b3cd] font-medium">{c.duration}</td>
                                    <td className="px-6 py-5 text-center font-black text-[#0050d4] dark:text-[#00D1FF] text-lg">{c.grade}</td>
                                    <td className="px-6 py-5 text-right">
                                        <span className="text-[#137333] dark:text-emerald-400 px-3 py-1 bg-[#e6f4ea] dark:bg-emerald-950/60 rounded-md text-xs font-black uppercase tracking-wider border border-emerald-500/10">
                                            {c.status}
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
