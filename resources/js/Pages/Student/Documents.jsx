import StudentLayout from '@/Layouts/StudentLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function Documents() {
    // Search query state
    const [searchQuery, setSearchQuery] = useState('');

    // Download toast feedback state
    const [toastMessage, setToastMessage] = useState(null);
    const [downloadingId, setDownloadingId] = useState(null);

    // Mock documents list
    const [documents] = useState([
        { 
            id: 1, 
            name: 'Certificado - UI/UX Design', 
            type: 'Acadêmico', 
            typeColor: 'bg-primary/10 text-primary', 
            date: '15 Jun 2024', 
            fileIcon: 'picture_as_pdf', 
            fileColor: 'bg-red-50 text-red-500' 
        },
        { 
            id: 2, 
            name: 'Declaração de Matrícula - 2024.1', 
            type: 'Secretaria', 
            typeColor: 'bg-secondary/10 text-secondary', 
            date: '12 Jun 2024', 
            fileIcon: 'picture_as_pdf', 
            fileColor: 'bg-blue-50 text-blue-500' 
        },
        { 
            id: 3, 
            name: 'Contrato de Prestação de Serviços', 
            type: 'Legal', 
            typeColor: 'bg-tertiary/10 text-tertiary', 
            date: '05 Jan 2024', 
            fileIcon: 'description', 
            fileColor: 'bg-emerald-50 text-emerald-500' 
        },
        { 
            id: 4, 
            name: 'Comprovante - Mensalidade Junho', 
            type: 'Financeiro', 
            typeColor: 'bg-primary-container/20 text-on-primary-container', 
            date: '01 Jun 2024', 
            fileIcon: 'receipt', 
            fileColor: 'bg-amber-50 text-amber-500' 
        }
    ]);

    // Handle document download mock
    const handleDownload = (doc) => {
        setDownloadingId(doc.id);
        setToastMessage(`Iniciando download: ${doc.name}...`);
        
        setTimeout(() => {
            setToastMessage(`Download concluído: ${doc.name}`);
            setDownloadingId(null);
            
            setTimeout(() => {
                setToastMessage(null);
            }, 2500);
        }, 1500);
    };

    // Filter documents based on search query
    const filteredDocuments = documents.filter(doc => {
        return doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
               doc.type.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
        <StudentLayout>
            <Head title="Documentos | PlayUp Velocity" />

            <style dangerouslySetInnerHTML={{ __html: `
                .glass-card {
                    background: rgba(255, 255, 255, 0.8);
                    backdrop-filter: blur(12px);
                }
                .custom-row-transition {
                    transition: transform 0.2s ease-out, background-color 0.2s ease;
                }
            `}} />

            <div className="p-8 max-w-7xl mx-auto space-y-8 relative">
                {/* Notification Toast */}
                {toastMessage && (
                    <div className="fixed bottom-8 right-8 bg-[#003346] text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-50 border border-outline-variant/20 animate-fade-in">
                        <span className="material-symbols-outlined text-primary text-xl font-bold animate-spin">
                            {toastMessage.includes('concluído') ? 'check_circle' : 'sync'}
                        </span>
                        <span className="text-sm font-semibold">{toastMessage}</span>
                    </div>
                )}

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="font-headline text-4xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">Documentos Acadêmicos</h1>
                        <p className="text-slate-500 font-medium mt-1">
                            Acesse e faça o download de seus documentos acadêmicos e financeiros de forma rápida e segura.
                        </p>
                    </div>

                    <div className="relative group shrink-0">
                        <input 
                            className="pl-12 pr-6 py-2.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-primary w-64 transition-all duration-300 text-sm font-medium" 
                            placeholder="Pesquisar documentos..." 
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
                    </div>
                </div>

                {/* Quick Action Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Certificados */}
                    <div className="group p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-3xl">workspace_premium</span>
                        </div>
                        <h3 className="font-headline font-bold text-on-surface text-lg mb-2">Certificados</h3>
                        <p className="text-on-surface-variant text-sm mb-6 flex-grow leading-relaxed">Visualize e baixe seus certificados de conclusão de curso.</p>
                        <Link 
                            href={route('student.documents.certificates')}
                            className="w-full text-center py-2.5 font-bold text-sm rounded-xl transition-all bg-primary-container/20 text-primary hover:bg-primary hover:text-white"
                        >
                            Ver Certificados
                        </Link>
                    </div>

                    {/* Declarações */}
                    <div className="group p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col">
                        <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-3xl">description</span>
                        </div>
                        <h3 className="font-headline font-bold text-on-surface text-lg mb-2">Declarações</h3>
                        <p className="text-on-surface-variant text-sm mb-6 flex-grow leading-relaxed">Emita declarações de matrícula e frequência em tempo real.</p>
                        <Link 
                            href={route('student.documents.declarations')}
                            className="w-full text-center py-2.5 font-bold text-sm rounded-xl transition-all bg-secondary-container/20 text-secondary hover:bg-secondary hover:text-white"
                        >
                            Solicitar Declaração
                        </Link>
                    </div>

                    {/* Contratos */}
                    <div className="group p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col">
                        <div className="w-12 h-12 rounded-xl bg-tertiary/10 text-tertiary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-3xl">history_edu</span>
                        </div>
                        <h3 className="font-headline font-bold text-on-surface text-lg mb-2">Contratos</h3>
                        <p className="text-on-surface-variant text-sm mb-6 flex-grow leading-relaxed">Consulte os termos e condições dos seus cursos contratados.</p>
                        <Link 
                            href={route('student.documents.contracts')}
                            className="w-full text-center py-2.5 font-bold text-sm rounded-xl transition-all bg-tertiary-container/20 text-tertiary hover:bg-tertiary hover:text-white"
                        >
                            Ver Contratos
                        </Link>
                    </div>

                    {/* Comprovantes */}
                    <div className="group p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col">
                        <div className="w-12 h-12 rounded-xl bg-primary-dim/10 text-primary-dim flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-3xl">receipt_long</span>
                        </div>
                        <h3 className="font-headline font-bold text-on-surface text-lg mb-2">Comprovantes</h3>
                        <p className="text-on-surface-variant text-sm mb-6 flex-grow leading-relaxed">Acesse seus comprovantes de pagamento e notas fiscais.</p>
                        <Link 
                            href={route('student.documents.receipts')}
                            className="w-full text-center py-2.5 font-bold text-sm rounded-xl transition-all bg-primary/10 text-primary hover:bg-primary hover:text-white"
                        >
                            Ver Comprovantes
                        </Link>
                    </div>
                </div>

                {/* Recent Documents Table List */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="font-headline text-xl font-bold text-slate-800 dark:text-slate-100">Documentos Recentes</h2>
                        <button className="text-primary font-bold text-sm hover:underline flex items-center gap-1">
                            Ver todos <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </button>
                    </div>

                    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[700px]">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-850 border-b border-slate-100 dark:border-slate-800">
                                        <th className="px-6 py-4 font-headline text-xs font-bold text-slate-400 uppercase tracking-wider">Nome do Documento</th>
                                        <th className="px-6 py-4 font-headline text-xs font-bold text-slate-400 uppercase tracking-wider">Tipo</th>
                                        <th className="px-6 py-4 font-headline text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Data</th>
                                        <th className="px-6 py-4 font-headline text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Ação</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {filteredDocuments.length > 0 ? (
                                        filteredDocuments.map((doc) => (
                                            <tr key={doc.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/50 custom-row-transition hover:translate-x-1 group">
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${doc.fileColor}`}>
                                                            <span className="material-symbols-outlined">{doc.fileIcon}</span>
                                                        </div>
                                                        <span className="font-bold text-sm text-slate-700 dark:text-slate-200">{doc.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className={`px-3 py-1 text-[10px] font-extrabold rounded-full ${doc.typeColor}`}>
                                                        {doc.type}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 text-slate-400 dark:text-slate-500 text-sm font-semibold text-center">{doc.date}</td>
                                                <td className="px-6 py-5 text-right">
                                                    <button 
                                                        onClick={() => handleDownload(doc)}
                                                        disabled={downloadingId === doc.id}
                                                        className="p-2.5 rounded-xl hover:bg-primary hover:text-white text-slate-400 dark:text-slate-500 transition-all focus:outline-none"
                                                    >
                                                        <span className={`material-symbols-outlined text-lg ${downloadingId === doc.id ? 'animate-spin' : ''}`}>
                                                            {downloadingId === doc.id ? 'sync' : 'download'}
                                                        </span>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-10 text-center text-sm text-slate-400 dark:text-slate-500">
                                                Nenhum documento encontrado.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </div>
        </StudentLayout>
    );
}
