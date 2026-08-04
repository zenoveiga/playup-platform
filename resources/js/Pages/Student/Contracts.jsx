import StudentLayout from '@/Layouts/StudentLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function Contracts() {
    // Search query state
    const [searchQuery, setSearchQuery] = useState('');

    // Toast state
    const [toastMessage, setToastMessage] = useState(null);

    // Mock contracts list
    const [contracts] = useState([
        {
            id: 1,
            title: 'Contrato de Prestação de Serviços Acadêmicos',
            category: 'Legal',
            date: '05 Jan 2024',
            status: 'Assinado',
            statusColor: 'bg-emerald-100 text-emerald-800'
        },
        {
            id: 2,
            title: 'Termo de Adesão e Uso da Plataforma',
            category: 'Legal',
            date: '05 Jan 2024',
            status: 'Assinado',
            statusColor: 'bg-emerald-100 text-emerald-800'
        },
        {
            id: 3,
            title: 'Termo Aditivo - Programa de Apoio Financeiro',
            category: 'Finanças',
            date: '10 Jan 2024',
            status: 'Assinado',
            statusColor: 'bg-emerald-100 text-emerald-800'
        }
    ]);

    const showToast = (message) => {
        setToastMessage(message);
        setTimeout(() => {
            setToastMessage(null);
        }, 3000);
    };

    const filteredContracts = contracts.filter(contract =>
        contract.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <StudentLayout>
            <Head title="Contratos | PlayUp Velocity" />

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
                        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 font-headline tracking-tight">Meus Contratos</h1>
                        <p className="text-slate-500 mt-2 max-w-2xl font-body leading-relaxed text-sm">
                            Consulte os termos contratuais e políticas vigentes aplicáveis ao seu vínculo com a nossa instituição.
                        </p>
                    </div>
                </div>

                {/* Controls Bar */}
                <div className="flex justify-between items-center bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
                    <div className="relative w-full max-w-md">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">search</span>
                        <input 
                            className="w-full pl-10 pr-4 py-2 bg-slate-55 dark:bg-slate-950 border-none rounded-xl focus:ring-2 focus:ring-tertiary/20 text-sm font-body transition-all" 
                            placeholder="Buscar contratos..." 
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Contracts List Table */}
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[700px]">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-850 border-b border-slate-100 dark:border-slate-800">
                                    <th className="px-6 py-4 font-headline text-xs font-bold text-slate-400 uppercase tracking-wider">Nome do Contrato</th>
                                    <th className="px-6 py-4 font-headline text-xs font-bold text-slate-400 uppercase tracking-wider">Setor</th>
                                    <th className="px-6 py-4 font-headline text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Data Assinatura</th>
                                    <th className="px-6 py-4 font-headline text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Status</th>
                                    <th className="px-6 py-4 font-headline text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Ação</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {filteredContracts.length > 0 ? (
                                    filteredContracts.map((contract) => (
                                        <tr key={contract.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/50 transition-colors group">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-505 flex items-center justify-center shrink-0">
                                                        <span className="material-symbols-outlined text-emerald-600">history_edu</span>
                                                    </div>
                                                    <span className="font-bold text-sm text-slate-700 dark:text-slate-200">{contract.title}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="px-3 py-1 text-[10px] font-extrabold rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-350">
                                                    {contract.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-slate-400 dark:text-slate-500 text-sm font-semibold text-center">{contract.date}</td>
                                            <td className="px-6 py-5 text-center">
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${contract.statusColor}`}>
                                                    {contract.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <button 
                                                    onClick={() => showToast(`Iniciando download de ${contract.title}...`)}
                                                    className="p-2.5 rounded-xl hover:bg-tertiary hover:text-white text-slate-400 dark:text-slate-500 transition-all focus:outline-none"
                                                >
                                                    <span className="material-symbols-outlined text-lg">download</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-10 text-center text-sm text-slate-400 dark:text-slate-500">
                                            Nenhum contrato encontrado.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
}
