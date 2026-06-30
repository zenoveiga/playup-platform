import { useState } from 'react';

export default function Notas({ student, triggerToast }) {
    const subjects = [
        { id: 1, name: 'Língua Portuguesa', avg: '8,7', status: 'Aprovado' },
        { id: 2, name: 'Matemática', avg: '7,5', status: 'Aprovado' },
        { id: 3, name: 'História', avg: '8,8', status: 'Aprovado' },
        { id: 4, name: 'Geografia', avg: '8,3', status: 'Aprovado' },
        { id: 5, name: 'Ciências', avg: '8,5', status: 'Aprovado' },
        { id: 6, name: 'Inglês', avg: '9,3', status: 'Aprovado' },
        { id: 7, name: 'Educação Física', avg: '10,0', status: 'Aprovado' }
    ];

    const [selectedSubjectId, setSelectedSubjectId] = useState(2); // Default to Matemática

    // Mock data for individual evaluations
    const mockEvaluations = {
        1: [ // Língua Portuguesa
            { title: 'Prova Bimestral 1 (P1)', type: 'Avaliação Individual', weight: '40%', grade: '8,5', date: '20/05/2026', status: 'Lançado' },
            { title: 'Trabalho de Leitura: Dom Casmurro', type: 'Trabalho em Grupo', weight: '30%', grade: '9,0', date: '10/05/2026', status: 'Lançado' },
            { title: 'Seminário de Literatura Moderna', type: 'Apresentação Oral', weight: '20%', grade: '8,5', date: '25/04/2026', status: 'Lançado' },
            { title: 'Atividades Práticas e Participação', type: 'Participação', weight: '10%', grade: '9,5', date: 'Diário', status: 'Lançado' }
        ],
        2: [ // Matemática
            { title: 'Prova Escrita de Álgebra (P1)', type: 'Avaliação Individual', weight: '40%', grade: '7,0', date: '18/05/2026', status: 'Lançado' },
            { title: 'Exercícios Computacionais de Geometria', type: 'Atividade Prática', weight: '30%', grade: '7,5', date: '04/05/2026', status: 'Lançado' },
            { title: 'Trabalho de Estatística Aplicada', type: 'Trabalho Escrito', weight: '20%', grade: '8,0', date: '28/04/2026', status: 'Lançado' },
            { title: 'Resolução de Desafios em Sala', type: 'Participação', weight: '10%', grade: '9,0', date: 'Diário', status: 'Lançado' }
        ],
        3: [ // História
            { title: 'Prova de História Geral (P1)', type: 'Avaliação Individual', weight: '45%', grade: '9,0', date: '12/05/2026', status: 'Lançado' },
            { title: 'Resenha sobre Revolução Industrial', type: 'Resenha Crítica', weight: '35%', grade: '8,5', date: '02/05/2026', status: 'Lançado' },
            { title: 'Debate Temático: Segunda Guerra', type: 'Apresentação Oral', weight: '20%', grade: '9,0', date: '22/04/2026', status: 'Lançado' }
        ],
        4: [ // Geografia
            { title: 'Avaliação Geopolítica e Clima', type: 'Avaliação Individual', weight: '40%', grade: '8,5', date: '15/05/2026', status: 'Lançado' },
            { title: 'Maquete de Relevo e Solo', type: 'Atividade Prática', weight: '30%', grade: '8,0', date: '08/05/2026', status: 'Lançado' },
            { title: 'Estudo de Caso Hidrografia', type: 'Trabalho Escrito', weight: '30%', grade: '8,5', date: '29/04/2026', status: 'Lançado' }
        ],
        5: [ // Ciências
            { title: 'Relatório de Experimento Químico', type: 'Relatório', weight: '35%', grade: '8,0', date: '17/05/2026', status: 'Lançado' },
            { title: 'Prova Teórica de Biologia Celular', type: 'Avaliação Individual', weight: '45%', grade: '8,5', date: '05/05/2026', status: 'Lançado' },
            { title: 'Pesquisa sobre Ecossistemas', type: 'Trabalho Escrito', weight: '20%', grade: '9,0', date: '26/04/2026', status: 'Lançado' }
        ],
        6: [ // Inglês
            { title: 'Reading & Writing Assessment', type: 'Avaliação Individual', weight: '40%', grade: '9,5', date: '19/05/2026', status: 'Lançado' },
            { title: 'Oral Conversation Test', type: 'Apresentação Oral', weight: '40%', grade: '9,5', date: '07/05/2026', status: 'Lançado' },
            { title: 'Homework Logs and Vocabulary', type: 'Atividades', weight: '20%', grade: '9,0', date: 'Diário', status: 'Lançado' }
        ],
        7: [ // Educação Física
            { title: 'Avaliação Prática de Atletismo', type: 'Prática de Esporte', weight: '50%', grade: '10,0', date: '13/05/2026', status: 'Lançado' },
            { title: 'Trabalho Teórico sobre Nutrição', type: 'Trabalho Escrito', weight: '30%', grade: '10,0', date: '03/05/2026', status: 'Lançado' },
            { title: 'Frequência e Participação Prática', type: 'Participação', weight: '20%', grade: '10,0', date: 'Diário', status: 'Lançado' }
        ]
    };

    const selectedSubject = subjects.find(s => s.id === selectedSubjectId) || subjects[1];
    const evaluations = mockEvaluations[selectedSubjectId] || [];

    return (
        <div className="space-y-6">
            {/* Header and Subject Selection */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h3 className="font-headline font-bold text-lg text-[#003346] dark:text-white">
                        Detalhamento de Avaliações &amp; Notas
                    </h3>
                    <p className="text-xs text-[#507c94] dark:text-[#87b3cd] font-medium">
                        Selecione a disciplina para visualizar o histórico detalhado de avaliações lançadas.
                    </p>
                </div>
                <div className="w-full sm:w-72">
                    <select
                        value={selectedSubjectId}
                        onChange={(e) => setSelectedSubjectId(Number(e.target.value))}
                        className="w-full bg-[#eff8ff] dark:bg-slate-950 border-none rounded-xl px-4 py-3 text-xs font-bold focus:ring-2 focus:ring-primary/20 text-[#003346] dark:text-white outline-none cursor-pointer"
                    >
                        {subjects.map(s => (
                            <option key={s.id} value={s.id}>{s.name} (Média: {s.avg})</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Subject Summary Card */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-[#eff8ff]/40 dark:bg-slate-950 p-5 rounded-2xl border border-outline-variant/5">
                    <span className="text-[10px] text-[#507c94] uppercase tracking-wider font-extrabold block mb-1">Média Atual</span>
                    <span className="text-2xl font-black text-primary dark:text-[#00D1FF] font-headline">{selectedSubject.avg}</span>
                </div>
                <div className="bg-[#eff8ff]/40 dark:bg-slate-950 p-5 rounded-2xl border border-outline-variant/5">
                    <span className="text-[10px] text-[#507c94] uppercase tracking-wider font-extrabold block mb-1">Situação</span>
                    <span className="inline-flex bg-[#cdffd4] dark:bg-emerald-950/70 text-[#006a35] dark:text-emerald-400 px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wider mt-1">
                        {selectedSubject.status}
                    </span>
                </div>
                <div className="bg-[#eff8ff]/40 dark:bg-slate-950 p-5 rounded-2xl border border-outline-variant/5 md:col-span-2 flex flex-col justify-between">
                    <div>
                        <span className="text-[10px] text-[#507c94] uppercase tracking-wider font-extrabold block mb-1">Progresso de Lançamentos</span>
                        <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full mt-2 overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: '80%' }}></div>
                        </div>
                    </div>
                    <span className="text-[9px] text-[#507c94] dark:text-[#87b3cd] mt-2 block font-semibold">
                        Aproximadamente 80% das avaliações do semestre foram aplicadas e registradas.
                    </span>
                </div>
            </div>

            {/* Evaluations list */}
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-outline-variant/10 dark:border-slate-850 overflow-hidden shadow-sm">
                <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-950/40 border-b border-outline-variant/10 font-bold text-xs text-[#003346] dark:text-white uppercase tracking-wider">
                    Lista de Atividades &amp; Provas
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-outline-variant/10 dark:border-slate-800 text-[10px] text-[#507c94] dark:text-[#87b3cd] font-black uppercase tracking-wider">
                                <th className="px-6 py-3.5">Avaliação</th>
                                <th className="px-6 py-3.5">Categoria</th>
                                <th className="px-6 py-3.5 text-center">Peso</th>
                                <th className="px-6 py-3.5 text-center">Data</th>
                                <th className="px-6 py-3.5 text-center">Nota</th>
                                <th className="px-6 py-3.5 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/5 dark:divide-slate-850 text-xs font-semibold text-[#003346] dark:text-[#eff8ff]/95">
                            {evaluations.map((evalRecord, idx) => (
                                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-850/40 transition-colors">
                                    <td className="px-6 py-4 font-bold">{evalRecord.title}</td>
                                    <td className="px-6 py-4 text-[#507c94] dark:text-[#87b3cd]/80">{evalRecord.type}</td>
                                    <td className="px-6 py-4 text-center">{evalRecord.weight}</td>
                                    <td className="px-6 py-4 text-center text-[#507c94]/80 dark:text-[#87b3cd]/70">{evalRecord.date}</td>
                                    <td className="px-6 py-4 text-center font-bold text-primary dark:text-[#00D1FF]">{evalRecord.grade}</td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="text-[#006a35] dark:text-emerald-400 px-2.5 py-1 bg-[#e6f4ea] dark:bg-emerald-950/60 rounded text-[10px] font-black uppercase tracking-wider">
                                            {evalRecord.status}
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
