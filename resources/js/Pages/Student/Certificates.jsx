import StudentLayout from '@/Layouts/StudentLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function Certificates() {
    // Search filter state
    const [searchQuery, setSearchQuery] = useState('');

    // Toast state
    const [toastMessage, setToastMessage] = useState(null);

    const showToast = (message) => {
        setToastMessage(message);
        setTimeout(() => {
            setToastMessage(null);
        }, 3000);
    };

    // Mock certificates list
    const [certificates] = useState([
        {
            id: 1,
            title: 'UI/UX Design Avançado',
            date: '12 Mai 2024',
            hours: '120 Horas',
            grade: '9.8/10.0',
            regId: 'PX-99238-A',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxYcN0n7ORxtMhXvZ8bNy6GbFlerN_B5Qi867t11BPobZrhGhNc9zTLmLhLRyt4V3VB2O5nwBwgGspQHcqiUf5FKOfY0IlcTjLbrFSoOMwDdOXh4nODx94SH7p64Yx_zqCFNgilUK2atyI9uiTV1PwNQiKFbJVAAQx3tyverGxBAZEu1sraa_Omi5R5y77KfRTGoAEIbzAzD_Td2tAVBtDw2y13br9rT8vcm6P2JpKNCS6T72XTUZwUw'
        },
        {
            id: 2,
            title: 'React Mastery 2024',
            date: '28 Fev 2024',
            hours: '85 Horas',
            grade: '10.0/10.0',
            regId: 'RM-44210-B',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANTIwrcpHxZUMP33xXgDvAUGZM2a8XL3I58z2CMB2sblkOwkSyo_tfnVprNFDJP1JMTd5fyLzi48Mec3wsx70QcPu9BbJsQX86HCIuJjHK-WOA3FaDqVtx5vSlivinKxvU33DzemaR44H375CBmS0vCjSClLNtclON-bMz9WTgQNjz-vDttn3T-j8RTHo8MJkO0QHlN3QhqfwhIOYUMnzW0MzrEkvchRgB2M75sJLZCQ5x_NDiBLeXpw'
        },
        {
            id: 3,
            title: 'Arquitetura de Sistemas',
            date: '15 Jan 2024',
            hours: '150 Horas',
            grade: '9.2/10.0',
            regId: 'AS-11005-C',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCb0Ng6yW8fwwBR12-THxxsVLBZWKo8nvw-IxCiE9uVJ2J3p_pXS0I_RXrm9Q060jIZHObAzf30_TO3xXtlKbNhi4MubhMQ3ONzOapeq9-5SUds9LDDfYPd4tF2rqKFQc0opCGgw6pW8AE9RwmRl8W2Hev8WmpkfHPDipdJxuLUJ_51mww1L75TZbvsWEXGr9IRRwoXU5YwoNRT1YfyxGAjRvph6q6jMyF3PGB5NXdiDZuFtN1dGwtNNg'
        }
    ]);

    const filteredCertificates = certificates.filter(cert => 
        cert.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <StudentLayout>
            <Head title="Certificados | PlayUp Velocity" />

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
                        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 font-headline tracking-tight">Meus Certificados</h1>
                        <p className="text-slate-500 mt-2 max-w-2xl font-body leading-relaxed text-sm">
                            Visualize e baixe suas conquistas acadêmicas. Todos os seus certificados são validados digitalmente e prontos para o mercado.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button 
                            onClick={() => showToast("Link do Portfólio copiado para a área de transferência!")}
                            className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-900 text-primary font-bold rounded-2xl shadow-sm hover:shadow-md transition-all border border-outline-variant/10 text-xs"
                        >
                            <span className="material-symbols-outlined text-lg">share</span>
                            <span>Compartilhar Portfólio</span>
                        </button>
                        <button 
                            onClick={() => showToast("LinkedIn sincronizado com sucesso!")}
                            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all text-xs"
                        >
                            <span className="material-symbols-outlined text-lg">sync</span>
                            <span>Sincronizar LinkedIn</span>
                        </button>
                    </div>
                </div>

                {/* Controls Bar */}
                <div className="flex justify-between items-center bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
                    <div className="relative w-full max-w-md">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">search</span>
                        <input 
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-sm font-body transition-all" 
                            placeholder="Buscar certificados..." 
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Certificates Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredCertificates.length > 0 ? (
                        filteredCertificates.map((cert) => (
                            <div key={cert.id} className="group bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:border-primary/10">
                                <div className="relative rounded-2xl overflow-hidden mb-5 h-44 bg-slate-50 group-hover:scale-[1.01] transition-transform duration-500">
                                    <img className="w-full h-full object-cover" alt={cert.title} src={cert.image} />
                                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer">
                                        <span className="material-symbols-outlined text-white text-5xl">visibility</span>
                                    </div>
                                    <div className="absolute top-3 right-3 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-1 rounded-full uppercase tracking-tighter">
                                        Validado
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 font-headline leading-tight mb-4">{cert.title}</h3>
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Conclusão</span>
                                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-350">{cert.date}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Carga Horária</span>
                                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-350">{cert.hours}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Nota Final</span>
                                            <span className="text-sm font-semibold text-emerald-600">{cert.grade}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">ID Registro</span>
                                            <span className="text-sm font-mono text-[11px] text-slate-500">{cert.regId}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                                        <button 
                                            onClick={() => showToast(`Baixando PDF de ${cert.title}...`)}
                                            className="flex-1 bg-slate-50 hover:bg-primary hover:text-white text-primary dark:bg-slate-950 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                                        >
                                            <span className="material-symbols-outlined text-base">download</span>
                                            <span>Baixar PDF</span>
                                        </button>
                                        <button 
                                            onClick={() => showToast("Preparando impressão...")}
                                            className="p-2.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 text-slate-500 rounded-xl transition-all" 
                                            title="Imprimir"
                                        >
                                            <span className="material-symbols-outlined text-lg">print</span>
                                        </button>
                                        <button 
                                            onClick={() => showToast("Link de compartilhamento copiado!")}
                                            className="p-2.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 text-slate-500 rounded-xl transition-all" 
                                            title="Compartilhar"
                                        >
                                            <span className="material-symbols-outlined text-lg">share</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-3 text-center py-12 text-slate-450 text-sm">
                            Nenhum certificado encontrado.
                        </div>
                    )}
                </div>

                {/* Verification & Support Info */}
                <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                    <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-3xl p-8 flex items-center gap-6 relative overflow-hidden">
                        <div className="w-16 h-16 bg-white dark:bg-slate-950 rounded-2xl flex items-center justify-center shrink-0 shadow-sm relative z-10">
                            <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                        </div>
                        <div className="relative z-10">
                            <h4 className="text-lg font-bold font-headline mb-1 text-slate-800 dark:text-slate-150">Validação de Certificados</h4>
                            <p className="text-sm text-slate-500 leading-relaxed">
                                Todas as suas certificações PlayUp incluem um código hash exclusivo e um QR Code para verificação instantânea por recrutadores através do nosso portal de autenticidade.
                            </p>
                        </div>
                        <span className="material-symbols-outlined absolute -right-6 -top-6 text-primary/5 text-9xl">security</span>
                    </div>
                    <div className="bg-gradient-to-br from-primary to-primary-dim rounded-3xl p-8 text-white flex flex-col justify-between md:flex-row items-center gap-6">
                        <div>
                            <h4 className="text-lg font-bold font-headline mb-1">Precisa de uma via física?</h4>
                            <p className="text-sm opacity-80 leading-relaxed mb-4">
                                Você pode solicitar a impressão e envio por correio do seu certificado em papel especial com selo holográfico PlayUp.
                            </p>
                            <button 
                                onClick={() => showToast("Solicitação de via física registrada!")}
                                className="bg-white text-primary px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-100 transition-colors"
                            >
                                Solicitar via impressa
                            </button>
                        </div>
                        <div className="hidden sm:block shrink-0">
                            <span className="material-symbols-outlined text-7xl opacity-40">local_shipping</span>
                        </div>
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
}
