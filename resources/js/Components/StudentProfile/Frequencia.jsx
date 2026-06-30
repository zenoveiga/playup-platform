import { useState } from 'react';

export default function Frequencia({ student, triggerToast }) {
    const courses = [
        { id: 'uiux', name: 'UI/UX Design Masterclass' },
        { id: 'ti', name: 'Técnico em TI - Módulo 2' },
        { id: 'web', name: 'Desenvolvimento Web Completo' }
    ];

    const [selectedCourse, setSelectedCourse] = useState('uiux');

    // Modules mock data
    const modules = [
        { title: 'Fundamentos do Design Visual', progress: 100, attendance: '98%', lastClass: '12/05/2024' },
        { title: 'Prototipagem de Alta Fidelidade', progress: 65, attendance: '92%', lastClass: 'Ontem' },
        { title: 'Sistemas de Design (Design Systems)', progress: 15, attendance: '85%', lastClass: '20/05/2024' }
    ];

    // Access history logs
    const accessLogs = [
        { datetime: 'Hoje, 10:45', course: 'UI/UX Design Masterclass', module: 'Prototipagem de Alta Fidelidade', location: 'São Paulo, SP (189.123.45.67)', device: 'Chrome 124 / Windows', duration: '45 min', status: 'Sucesso' },
        { datetime: 'Ontem, 14:20', course: 'UI/UX Design Masterclass', module: 'Fundamentos do Design Visual', location: 'São Paulo, SP (189.123.45.67)', device: 'Safari Mobile / iPhone', duration: '1h 15 min', status: 'Sucesso' },
        { datetime: '28/06/2026, 09:15', course: 'UI/UX Design Masterclass', module: 'Sistemas de Design (Design Systems)', location: 'São Paulo, SP (189.123.51.88)', device: 'Chrome 124 / Windows', duration: '30 min', status: 'Sucesso' },
        { datetime: '27/06/2026, 16:40', course: 'Técnico em TI - Módulo 2', module: 'Introdução ao Hardware', location: 'São Paulo, SP (189.123.51.88)', device: 'Chrome 124 / Windows', duration: '2h 10 min', status: 'Sucesso' }
    ];

    return (
        <div className="space-y-6">
            
            {/* Filter and Top Bar Card */}
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-outline-variant/10 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <span className="material-symbols-outlined text-[#003346] dark:text-[#87b3cd] text-xl">filter_list</span>
                    <span className="text-sm font-bold text-[#003346] dark:text-white uppercase tracking-wider select-none">
                        Filtrar por Curso:
                    </span>
                    <select
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                        className="bg-[#eff8ff] dark:bg-slate-950 border-none rounded-xl px-4 py-2 text-xs font-bold focus:ring-2 focus:ring-primary/20 text-[#003346] dark:text-white outline-none cursor-pointer w-full sm:w-64"
                    >
                        {courses.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>
                <button
                    type="button"
                    onClick={() => triggerToast('Fazendo download do relatório de frequência')}
                    className="w-10 h-10 bg-[#eff8ff] dark:bg-slate-850 hover:bg-[#e0f2fe] dark:hover:bg-slate-750 text-primary dark:text-[#00D1FF] rounded-xl flex items-center justify-center transition-all select-none active:scale-95 border border-primary/5"
                >
                    <span className="material-symbols-outlined text-xl">download</span>
                </button>
            </div>

            {/* Metric Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Tempo Estudado */}
                <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-outline-variant/10 shadow-sm text-center flex flex-col justify-center h-32">
                    <span className="text-[10px] text-[#507c94] dark:text-[#87b3cd] font-black uppercase tracking-wider">
                        Tempo Estudado
                    </span>
                    <span className="text-4xl font-headline font-black text-primary dark:text-[#00D1FF] mt-2 block">
                        420h
                    </span>
                </div>

                {/* Último Acesso */}
                <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-outline-variant/10 shadow-sm text-center flex flex-col justify-center h-32">
                    <span className="text-[10px] text-[#507c94] dark:text-[#87b3cd] font-black uppercase tracking-wider">
                        Último Acesso
                    </span>
                    <span className="text-2xl font-headline font-black text-[#003346] dark:text-white mt-3 block">
                        Hoje, 10:45
                    </span>
                </div>

                {/* Média Semanal */}
                <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-outline-variant/10 shadow-sm text-center flex flex-col justify-center h-32">
                    <span className="text-[10px] text-[#507c94] dark:text-[#87b3cd] font-black uppercase tracking-wider">
                        Média Semanal
                    </span>
                    <span className="text-4xl font-headline font-black text-primary dark:text-[#00D1FF] mt-2 block">
                        15h
                    </span>
                </div>
            </div>

            {/* Engagement Card */}
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-outline-variant/10 shadow-sm text-center flex flex-col items-center justify-center gap-2">
                <span className="text-[9px] text-[#507c94] uppercase tracking-wider font-extrabold">
                    Engajamento
                </span>
                <span className="bg-[#cdffd4] dark:bg-emerald-950/70 text-[#006a35] dark:text-emerald-400 px-6 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-emerald-500/10">
                    Ativo/Em dia
                </span>
            </div>

            {/* Progress and Frequency Card */}
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-0 border border-outline-variant/10 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#eff8ff]/40 dark:bg-slate-950/60 border-b border-outline-variant/10 dark:border-slate-850 text-xs text-[#507c94] dark:text-[#87b3cd] font-black uppercase tracking-wider">
                                <th className="px-8 py-4 w-[35%]">Módulo / Aula</th>
                                <th className="px-6 py-4 w-[25%]">Progresso</th>
                                <th className="px-6 py-4 text-center">Frequência</th>
                                <th className="px-6 py-4 text-center">Última Aula</th>
                                <th className="px-8 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/5 dark:divide-slate-850 text-sm font-semibold text-[#003346] dark:text-[#eff8ff]/95">
                            {modules.map((m, idx) => (
                                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-850/40 transition-colors">
                                    <td className="px-8 py-5 font-extrabold text-base leading-snug">{m.title}</td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-28 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-[#0050d4]" style={{ width: `${m.progress}%` }}></div>
                                            </div>
                                            <span className="text-xs font-black text-[#003346] dark:text-white">{m.progress}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-center text-[#003346] dark:text-white font-extrabold">{m.attendance}</td>
                                    <td className="px-6 py-5 text-center text-[#507c94] dark:text-[#87b3cd] font-medium">{m.lastClass}</td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="inline-flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => triggerToast(`Visualizando progresso do módulo: ${m.title}`)}
                                                className="w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-primary dark:text-[#00D1FF] transition-all"
                                            >
                                                <span className="material-symbols-outlined text-md">visibility</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => triggerToast(`Editando dados do módulo: ${m.title}`)}
                                                className="w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-[#507c94] dark:text-[#87b3cd] transition-all"
                                            >
                                                <span className="material-symbols-outlined text-md">edit</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => triggerToast(`Removendo registros de: ${m.title}`)}
                                                className="w-8 h-8 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center justify-center text-red-500 transition-all"
                                            >
                                                <span className="material-symbols-outlined text-md">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Access History Card */}
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-outline-variant/10 dark:border-slate-800 shadow-sm space-y-6">
                <h3 className="font-headline font-black text-2xl text-[#003346] dark:text-white">
                    Histórico de Acesso
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#eff8ff]/40 dark:bg-slate-950/60 border-b border-outline-variant/10 dark:border-slate-850 text-xs text-[#507c94] dark:text-[#87b3cd] font-black uppercase tracking-wider">
                                <th className="px-6 py-4 w-[20%]">Data / Hora</th>
                                <th className="px-6 py-4 w-[30%]">Conteúdo Acessado</th>
                                <th className="px-6 py-4">IP / Localização</th>
                                <th className="px-6 py-4">Dispositivo</th>
                                <th className="px-6 py-4 text-center">Tempo de Sessão</th>
                                <th className="px-6 py-4 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/5 dark:divide-slate-850 text-sm font-semibold text-[#003346] dark:text-[#eff8ff]/95">
                            {accessLogs.map((log, idx) => (
                                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-850/40 transition-colors">
                                    <td className="px-6 py-4 text-[#003346] dark:text-white font-extrabold">{log.datetime}</td>
                                    <td className="px-6 py-4">
                                        <p className="font-extrabold text-[#003346] dark:text-white leading-tight">{log.course}</p>
                                        <p className="text-xs text-[#507c94] dark:text-[#87b3cd]/80 font-medium mt-0.5">{log.module}</p>
                                    </td>
                                    <td className="px-6 py-4 text-[#507c94] dark:text-[#87b3cd] font-medium text-xs">{log.location}</td>
                                    <td className="px-6 py-4 text-[#507c94] dark:text-[#87b3cd]/80 text-xs font-semibold">{log.device}</td>
                                    <td className="px-6 py-4 text-center text-[#003346] dark:text-white font-bold">{log.duration}</td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="text-[#137333] dark:text-emerald-400 px-3 py-1 bg-[#e6f4ea] dark:bg-emerald-950/60 rounded-md text-xs font-black uppercase tracking-wider border border-emerald-500/10">
                                            {log.status}
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
