import StudentLayout from '@/Layouts/StudentLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function Declarations() {
    // Search query state
    const [searchQuery, setSearchQuery] = useState('');

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [declarationType, setDeclarationType] = useState('');
    const [reason, setReason] = useState('');

    // Toast state
    const [toastMessage, setToastMessage] = useState(null);

    // Mock declarations list
    const [declarations, setDeclarations] = useState([
        {
            id: 1,
            title: 'Declaração de Matrícula - 2024.1',
            category: 'Secretaria',
            date: '12 Jun 2024',
            status: 'Emitido',
            statusColor: 'bg-emerald-100 text-emerald-800'
        },
        {
            id: 2,
            title: 'Declaração de Frequência Semestral',
            category: 'Secretaria',
            date: '10 Jun 2024',
            status: 'Emitido',
            statusColor: 'bg-emerald-100 text-emerald-800'
        },
        {
            id: 3,
            title: 'Histórico Escolar Parcial',
            category: 'Acadêmico',
            date: '02 Ago 2026',
            status: 'Em Análise',
            statusColor: 'bg-amber-100 text-amber-800'
        }
    ]);

    const showToast = (message) => {
        setToastMessage(message);
        setTimeout(() => {
            setToastMessage(null);
        }, 3000);
    };

    const handleRequestDeclaration = (e) => {
        e.preventDefault();
        if (!declarationType) return;

        const newDecl = {
            id: Date.now(),
            title: `Declaração de ${declarationType}`,
            category: 'Secretaria',
            date: new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' }),
            status: 'Em Análise',
            statusColor: 'bg-amber-100 text-amber-800'
        };

        setDeclarations(prev => [newDecl, ...prev]);
        setIsModalOpen(false);
        setDeclarationType('');
        setReason('');

        showToast("Solicitação de declaração enviada com sucesso!");
    };

    const filteredDeclarations = declarations.filter(decl =>
        decl.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <StudentLayout>
            <Head title="Declarações | PlayUp Velocity" />

            <div className="p-8 max-w-7xl mx-auto space-y-8 relative">
                {/* Toast Notification */}
                {toastMessage && (
                    <div className="fixed bottom-8 right-8 bg-[#003346] text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-50 border border-outline-variant/20 animate-fade-in">
                        <span className="material-symbols-outlined text-primary text-xl font-bold animate-pulse">check_circle</span>
                        <span className="text-sm font-semibold">{toastMessage}</span>
                    </div>
                )}

                {/* Back to documents */}
                <div className="flex items-center gap-2">
                    <Link href={route('student.documents')} className="flex items-center gap-1 text-xs font-bold text-on-surface-variant hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-sm">arrow_back</span>
                        Voltar para Documentos
                    </Link>
                </div>

                {/* Header Block */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 font-headline tracking-tight">Emissão de Declarações</h1>
                        <p className="text-slate-500 mt-2 max-w-2xl font-body leading-relaxed text-sm">
                            Emita declarações de matrícula, frequência ou conclusão em tempo real. As solicitações são processadas de forma ágil pela secretaria digital.
                        </p>
                    </div>
                    <div>
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 px-5 py-3 bg-secondary text-white font-bold rounded-2xl shadow-lg shadow-secondary/20 hover:scale-[1.02] active:scale-[0.98] transition-all text-xs"
                        >
                            <span className="material-symbols-outlined text-lg">add_circle</span>
                            <span>Solicitar Nova Declaração</span>
                        </button>
                    </div>
                </div>

                {/* Controls Bar */}
                <div className="flex justify-between items-center bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
                    <div className="relative w-full max-w-md">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">search</span>
                        <input 
                            className="w-full pl-10 pr-4 py-2 bg-slate-55 dark:bg-slate-950 border-none rounded-xl focus:ring-2 focus:ring-secondary/20 text-sm font-body transition-all" 
                            placeholder="Buscar declarações..." 
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Declarations Grid */}
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[700px]">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-850 border-b border-slate-100 dark:border-slate-800">
                                    <th className="px-6 py-4 font-headline text-xs font-bold text-slate-400 uppercase tracking-wider">Nome da Declaração</th>
                                    <th className="px-6 py-4 font-headline text-xs font-bold text-slate-400 uppercase tracking-wider">Setor</th>
                                    <th className="px-6 py-4 font-headline text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Data Solicitação</th>
                                    <th className="px-6 py-4 font-headline text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Status</th>
                                    <th className="px-6 py-4 font-headline text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Ação</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {filteredDeclarations.length > 0 ? (
                                    filteredDeclarations.map((decl) => (
                                        <tr key={decl.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/50 transition-colors group">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                                                        <span className="material-symbols-outlined">description</span>
                                                    </div>
                                                    <span className="font-bold text-sm text-slate-700 dark:text-slate-200">{decl.title}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="px-3 py-1 text-[10px] font-extrabold rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-350">
                                                    {decl.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-slate-400 dark:text-slate-500 text-sm font-semibold text-center">{decl.date}</td>
                                            <td className="px-6 py-5 text-center">
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${decl.statusColor}`}>
                                                    {decl.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <button 
                                                    onClick={() => showToast(`Iniciando download de ${decl.title}...`)}
                                                    disabled={decl.status !== 'Emitido'}
                                                    className="p-2.5 rounded-xl hover:bg-secondary hover:text-white text-slate-400 dark:text-slate-500 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-400 transition-all focus:outline-none"
                                                >
                                                    <span className="material-symbols-outlined text-lg">download</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-10 text-center text-sm text-slate-400 dark:text-slate-500">
                                            Nenhuma declaração encontrada.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Request Declaration Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                        <div className="absolute inset-0 bg-on-surface/20 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
                        <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden z-50 border border-outline-variant/10">
                            <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                <h3 className="font-headline font-bold text-xl text-slate-800 dark:text-slate-100">Solicitar Declaração</h3>
                                <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-slate-400">close</span>
                                </button>
                            </div>
                            <form onSubmit={handleRequestDeclaration} className="p-8 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase px-1">Tipo de Declaração</label>
                                    <select 
                                        className="w-full bg-slate-50 dark:bg-slate-950 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-secondary text-slate-800 dark:text-slate-200 font-semibold"
                                        required
                                        value={declarationType}
                                        onChange={(e) => setDeclarationType(e.target.value)}
                                    >
                                        <option value="" disabled>Selecione o tipo</option>
                                        <option value="Matrícula Ativa">Declaração de Matrícula Ativa</option>
                                        <option value="Frequência Escolar">Declaração de Frequência Escolar</option>
                                        <option value="Conclusão de Disciplina">Declaração de Conclusão de Disciplina</option>
                                        <option value="Histórico Parcial">Histórico Acadêmico Parcial</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase px-1">Motivo / Observações</label>
                                    <textarea 
                                        rows="3"
                                        placeholder="Ex: Apresentar no trabalho para fins de abono de faltas."
                                        className="w-full bg-slate-50 dark:bg-slate-950 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-secondary text-slate-800 dark:text-slate-200 font-semibold resize-none"
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                    />
                                </div>
                                <div className="flex justify-end gap-3 pt-2">
                                    <button 
                                        type="button" 
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-6 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-all text-xs"
                                    >
                                        Cancelar
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="px-6 py-2.5 bg-secondary text-white font-bold rounded-xl hover:opacity-90 transition-all text-xs"
                                    >
                                        Enviar Solicitação
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </StudentLayout>
    );
}
