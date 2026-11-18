import StudentLayout from '@/Layouts/StudentLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Messages() {
    const { auth } = usePage().props;
    const user = auth?.user || { name: 'Gabriel Santos', role: 'student' };

    // Search query state
    const [searchQuery, setSearchQuery] = useState('');

    // Tab filter state
    const [activeFilter, setActiveFilter] = useState('todas');

    // Compose message modal state
    const [isComposeOpen, setIsComposeOpen] = useState(false);
    const [subject, setSubject] = useState('');
    const [messageText, setMessageText] = useState('');
    const [composeSuccess, setComposeSuccess] = useState(false);
    const [department, setDepartment] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const [attachedFiles, setAttachedFiles] = useState([]);

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const files = Array.from(e.dataTransfer.files);
            setAttachedFiles(prev => [...prev, ...files]);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files);
            setAttachedFiles(prev => [...prev, ...files]);
        }
    };

    const removeFile = (index) => {
        setAttachedFiles(prev => prev.filter((_, i) => i !== index));
    };

    // Messages list state
    const [messages, setMessages] = useState([
        {
            id: 1,
            author: 'Prof. Mariana Oliveira',
            time: '14:20',
            title: 'Sobre a entrega do projeto final',
            excerpt: 'Olá Gabriel, recebi seu arquivo. Gostaria de agendar uma breve reunião para discutir os pontos do...',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2cR2vSZVfI883fo-oAttL54qTkDFUtWvxd1QGKYJ50ZhLDJ_vn7BQwz3panUGGp-dFU_vK4kbRT38STVsjtwiH61BXsIGHVBZ3BQ80W6nTqG0_6yRwbuiJoniDJPntc86a-prRvXG-8eGO7l2oceQltoV9n_u_IC67bEvnxWw47ulvAkefRQGyU8mPx35VfTawd9G7CtZ976rpNfN6LaP3DiCxthwBYQbAJ0YLQfYv7J5X1E8r7ZYbA',
            unread: true,
            starred: false,
            type: 'avatar'
        },
        {
            id: 2,
            author: 'Administrativo - Polo Central',
            time: 'Ontem',
            title: 'Confirmação de Matrícula 2024.2',
            excerpt: 'Sua matrícula para o próximo semestre foi processada com sucesso. Os boletos já estão disponíveis...',
            icon: 'apartment',
            unread: false,
            starred: false,
            type: 'icon',
            badgeColor: 'bg-secondary-container text-on-secondary-container'
        },
        {
            id: 3,
            author: 'Suporte PlayUp',
            time: '12 Jul',
            title: 'Chamado #4492 - Acesso ao Portal',
            excerpt: 'Verificamos que sua instabilidade de acesso foi resolvida. Por favor, tente realizar o login novamente...',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDzN8O1g-cAyEUa1zIOXiI4DHzKzcXQVHWtvJKhrbVG2HZzgixjxGwbi0pkxiQcJDerJTnhwgZbXLNnbhNAFkV30M0WGnhFcJIBmPRG6uUSax8t5-iyQfSOyBnUlQTmLf7_leOVyxSc8Dy7tUyaiAQI5XZty1tcL2wcGEFn6WvEHnQMvXGrIeJ1MdXXZzGGyoiCfaqW0swCqIF-hJjd5DGO2DHt2DwNmGIU02dQrqZxjOD1uezsUqbBLw',
            unread: false,
            starred: true,
            type: 'avatar'
        },
        {
            id: 4,
            author: 'Coordenação de Curso',
            time: '10 Jul',
            title: 'Alteração no Cronograma de Aulas',
            excerpt: 'Devido ao feriado municipal na próxima sexta-feira, as aulas presenciais serão suspensas e repostas...',
            icon: 'school',
            unread: false,
            starred: false,
            type: 'icon',
            badgeColor: 'bg-primary-container text-on-primary-container'
        }
    ]);

    // Star message helper
    const toggleStar = (e, id) => {
        e.stopPropagation();
        setMessages(prev => prev.map(msg => 
            msg.id === id ? { ...msg, starred: !msg.starred } : msg
        ));
    };

    // Mark message as read
    const markAsRead = (id) => {
        setMessages(prev => prev.map(msg => 
            msg.id === id ? { ...msg, unread: false } : msg
        ));
    };

    // Add new message from compose modal
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!department || !subject || !messageText.trim()) return;

        const newMsg = {
            id: Date.now(),
            author: `Setor ${department}`,
            time: '12:00',
            title: subject,
            excerpt: messageText,
            unread: true,
            starred: false,
            type: 'icon',
            icon: department === 'Financeiro' ? 'payments' : (department === 'Suporte Técnico' ? 'support_agent' : 'school'),
            badgeColor: department === 'Financeiro' ? 'bg-secondary-container text-on-secondary-container' : 'bg-primary-container text-on-primary-container'
        };

        setMessages(prev => [newMsg, ...prev]);
        setComposeSuccess(true);
        setDepartment('');
        setSubject('');
        setMessageText('');
        setAttachedFiles([]);

        setTimeout(() => {
            setComposeSuccess(false);
            setIsComposeOpen(false);
        }, 1500);
    };

    // Filter messages based on active filter & search query
    const filteredMessages = messages.filter(msg => {
        const matchesSearch = 
            msg.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
            msg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            msg.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

        if (!matchesSearch) return false;

        if (activeFilter === 'nao-lidas') return msg.unread;
        if (activeFilter === 'favoritas') return msg.starred;
        return true;
    });

    return (
        <StudentLayout>
            <Head title="PlayUp Velocity - Mensagens" />

            <style dangerouslySetInnerHTML={{ __html: `
                .kinetic-gradient {
                    background: linear-gradient(135deg, #0050d4 0%, #7b9cff 100%);
                }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #b5e3ff; border-radius: 10px; }
                .modal-enter { animation: modalFadeIn 0.3s ease-out forwards; }
                @keyframes modalFadeIn {
                    from { opacity: 0; transform: scale(0.95) translateY(20px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
            `}} />

            {/* Content Area */}
            <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 max-w-[1600px] mx-auto">
                {/* Hero/Action Section */}
                <section>
                    <div className="flex flex-col gap-1 mb-6">
                        <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-on-surface tracking-tight">Mensagens</h1>
                        <p className="text-on-surface-variant font-medium">Gerencie sua comunicação e acompanhe os avisos da plataforma.</p>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                        {/* Nova Mensagem CTA */}
                        <div 
                            className="kinetic-gradient p-4 sm:p-6 rounded-2xl flex flex-col justify-between gap-3 h-36 sm:h-40 transition-transform hover:scale-[1.02] cursor-pointer shadow-xl shadow-primary/10 group"
                            onClick={() => setIsComposeOpen(true)}
                        >
                            <div className="flex justify-between items-start">
                                <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                                    <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>add_comment</span>
                                </div>
                                <span className="material-symbols-outlined text-white/50 group-hover:text-white transition-colors">arrow_outward</span>
                            </div>
                            <span className="text-white font-headline font-bold text-base sm:text-lg">Nova Mensagem</span>
                        </div>
                        {/* Secondary Actions */}
                        <div className="bg-surface-container-lowest p-4 sm:p-6 rounded-2xl flex flex-col justify-between gap-3 h-36 sm:h-40 transition-all hover:bg-surface-container-low cursor-pointer border border-outline-variant/15">
                            <div className="bg-secondary-container p-3 rounded-xl w-fit">
                                <span className="material-symbols-outlined text-on-secondary-container">campaign</span>
                            </div>
                            <div>
                                <p className="text-on-surface font-headline font-bold text-base sm:text-lg leading-tight">Avisos da Escola</p>
                                <p className="text-on-surface-variant text-xs mt-1">4 novos avisos importantes</p>
                            </div>
                        </div>
                        <div className="bg-surface-container-lowest p-4 sm:p-6 rounded-2xl flex flex-col justify-between gap-3 h-36 sm:h-40 transition-all hover:bg-surface-container-low cursor-pointer border border-outline-variant/15">
                            <div className="bg-tertiary-container p-3 rounded-xl w-fit">
                                <span className="material-symbols-outlined text-on-tertiary-container">support_agent</span>
                            </div>
                            <div>
                                <p className="text-on-surface font-headline font-bold text-base sm:text-lg leading-tight">Central de Suporte</p>
                                <p className="text-on-surface-variant text-xs mt-1">Tempo de espera: 5 min</p>
                            </div>
                        </div>
                        <div className="bg-surface-container-lowest p-4 sm:p-6 rounded-2xl flex flex-col justify-between gap-3 h-36 sm:h-40 transition-all hover:bg-surface-container-low cursor-pointer border border-outline-variant/15">
                            <div className="bg-surface-container-highest p-3 rounded-xl w-fit">
                                <span className="material-symbols-outlined text-on-surface">notifications_active</span>
                            </div>
                            <div>
                                <p className="text-on-surface font-headline font-bold text-base sm:text-lg leading-tight">Notificações</p>
                                <p className="text-on-surface-variant text-xs mt-1">Configurações de alerta</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Main Content Area: Bento Style */}
                <div className="grid grid-cols-12 gap-6 lg:gap-8">
                    {/* Left: Message List (8/12) */}
                    <section className="col-span-12 lg:col-span-8 space-y-6 min-w-0">
                        <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm border border-outline-variant/10">
                            <div className="p-6 border-b border-outline-variant/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div className="flex gap-1 sm:gap-2 flex-wrap">
                                    <button 
                                        className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${activeFilter === 'todas' ? 'bg-primary text-on-primary shadow-lg shadow-primary/20' : 'text-on-surface-variant hover:bg-surface-container-low'}`}
                                        onClick={() => setActiveFilter('todas')}
                                    >
                                        Todas
                                    </button>
                                    <button 
                                        className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${activeFilter === 'nao-lidas' ? 'bg-primary text-on-primary shadow-lg shadow-primary/20' : 'text-on-surface-variant hover:bg-surface-container-low'}`}
                                        onClick={() => setActiveFilter('nao-lidas')}
                                    >
                                        Não lidas
                                    </button>
                                    <button 
                                        className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${activeFilter === 'favoritas' ? 'bg-primary text-on-primary shadow-lg shadow-primary/20' : 'text-on-surface-variant hover:bg-surface-container-low'}`}
                                        onClick={() => setActiveFilter('favoritas')}
                                    >
                                        Favoritas
                                    </button>
                                </div>
                                <button className="flex items-center gap-2 text-sm text-on-surface-variant font-bold hover:text-primary transition-colors">
                                    <span className="material-symbols-outlined text-base">filter_list</span>
                                    Filtrar por data
                                </button>
                            </div>
                            <div className="divide-y divide-outline-variant/10">
                                {filteredMessages.length > 0 ? (
                                    filteredMessages.map((msg) => (
                                        <div 
                                            key={msg.id} 
                                            onClick={() => markAsRead(msg.id)}
                                            className="p-4 sm:p-6 flex gap-3 sm:gap-4 hover:bg-surface-container-low/50 transition-all cursor-pointer relative group"
                                        >
                                            {msg.unread && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>}
                                            
                                            {msg.type === 'avatar' ? (
                                                <img className="w-12 h-12 rounded-full object-cover shrink-0" data-alt={msg.author} src={msg.avatar} />
                                            ) : (
                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${msg.badgeColor}`}>
                                                    <span className="material-symbols-outlined">{msg.icon}</span>
                                                </div>
                                            )}

                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h4 className={`text-on-surface truncate ${msg.unread ? 'font-bold' : 'font-medium'}`}>{msg.author}</h4>
                                                    <span className={`text-xs ${msg.unread ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>{msg.time}</span>
                                                </div>
                                                <p className={`text-sm mb-1 text-on-surface ${msg.unread ? 'font-bold' : 'font-semibold'}`}>{msg.title}</p>
                                                <p className="text-sm text-on-surface-variant line-clamp-1">{msg.excerpt}</p>
                                            </div>

                                            <div className="flex flex-col items-end gap-2 shrink-0 justify-between py-1">
                                                {msg.unread ? <span className="w-2 h-2 bg-primary rounded-full"></span> : <span />}
                                                <button 
                                                    onClick={(e) => toggleStar(e, msg.id)}
                                                    className={`material-symbols-outlined hover:scale-115 transition-transform ${msg.starred ? 'text-primary opacity-100' : 'text-on-surface-variant opacity-40 sm:opacity-0 group-hover:opacity-100'}`}
                                                    style={{ fontVariationSettings: msg.starred ? "'FILL' 1" : "'FILL' 0" }}
                                                >
                                                    star
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-sm text-on-surface-variant">
                                        Nenhuma mensagem encontrada.
                                    </div>
                                )}
                            </div>
                            <button className="w-full py-4 text-sm font-bold text-primary hover:bg-primary/5 transition-colors border-t border-outline-variant/10">
                                Carregar mais conversas
                            </button>
                        </div>
                    </section>

                    {/* Right: Shared Files (4/12) */}
                    <aside className="col-span-12 lg:col-span-4 space-y-6 min-w-0">
                        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/10 h-fit">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-headline font-bold text-on-surface">Arquivos Compartilhados</h3>
                                <span className="material-symbols-outlined text-on-surface-variant">folder_open</span>
                            </div>
                            <div className="space-y-4">
                                {/* File Item 1 */}
                                <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-container-low transition-colors cursor-pointer group">
                                    <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-red-600">picture_as_pdf</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-on-surface truncate">Plano_de_Ensino_2024.pdf</p>
                                        <p className="text-[10px] text-on-surface-variant uppercase font-bold">2.4 MB • PDF</p>
                                    </div>
                                    <button className="p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="material-symbols-outlined text-primary text-sm">download</span>
                                    </button>
                                </div>
                                {/* File Item 2 */}
                                <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-container-low transition-colors cursor-pointer group">
                                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-blue-600">description</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-on-surface truncate">Projeto_Final_V1.docx</p>
                                        <p className="text-[10px] text-on-surface-variant uppercase font-bold">15 KB • Documento</p>
                                    </div>
                                    <button className="p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="material-symbols-outlined text-primary text-sm">download</span>
                                    </button>
                                </div>
                                {/* File Item 3 */}
                                <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-container-low transition-colors cursor-pointer group">
                                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-green-600">table_chart</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-on-surface truncate">Notas_Turma_B.xlsx</p>
                                        <p className="text-[10px] text-on-surface-variant uppercase font-bold">42 KB • Planilha</p>
                                    </div>
                                    <button className="p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="material-symbols-outlined text-primary text-sm">download</span>
                                    </button>
                                </div>
                                {/* File Item 4 */}
                                <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-container-low transition-colors cursor-pointer group">
                                    <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-amber-600">image</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-on-surface truncate">Certificado_Lab.png</p>
                                        <p className="text-[10px] text-on-surface-variant uppercase font-bold">1.1 MB • Imagem</p>
                                    </div>
                                    <button className="p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="material-symbols-outlined text-primary text-sm">download</span>
                                    </button>
                                </div>
                            </div>
                            <div className="mt-8 p-4 bg-surface-container rounded-xl border border-primary/10">
                                <p className="text-xs font-bold text-primary mb-2 uppercase tracking-wider">Armazenamento</p>
                                <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden mb-2">
                                    <div className="h-full bg-primary w-[65%] rounded-full"></div>
                                </div>
                                <div className="flex justify-between items-center text-[10px] text-on-surface-variant font-bold">
                                    <span>6.5 GB em uso</span>
                                    <span>10 GB total</span>
                                </div>
                            </div>
                        </div>
                        {/* Mini Help Center Card */}
                        <div className="bg-primary p-6 rounded-2xl text-on-primary shadow-lg shadow-primary/20 relative overflow-hidden group">
                            {/* Background Pattern */}
                            <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                                <span className="material-symbols-outlined text-9xl">forum</span>
                            </div>
                            <h4 className="font-headline font-bold text-lg mb-2 relative z-10">Precisa de ajuda?</h4>
                            <p className="text-sm text-on-primary/80 mb-4 relative z-10 leading-relaxed">Nossa equipe está disponível de Seg. a Sex. para tirar suas dúvidas.</p>
                            <button type="button" className="bg-on-primary text-primary px-4 py-2 rounded-full text-xs font-black uppercase tracking-tight hover:scale-105 transition-transform relative z-10 active:scale-95">
                                Abrir Chat Online
                            </button>
                        </div>
                    </aside>
                </div>
            </div>

            {/* Compose Message Modal Dialog */}
            {isComposeOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4" id="modal-overlay">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-on-surface/20 backdrop-blur-md" onClick={() => setIsComposeOpen(false)}></div>
                    {/* Modal Container */}
                    <div className="relative w-full max-w-2xl bg-surface-container-lowest rounded-3xl shadow-2xl modal-enter overflow-hidden flex flex-col max-h-[921px] z-50">
                        {/* Modal Header */}
                        <div className="px-8 py-6 flex items-center justify-between bg-surface-container-low/50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white">
                                    <span className="material-symbols-outlined" data-icon="add_comment">add_comment</span>
                                </div>
                                <h3 className="font-headline font-bold text-2xl text-on-surface tracking-tight">Nova Mensagem</h3>
                            </div>
                            <button className="w-10 h-10 rounded-full hover:bg-surface-container-high flex items-center justify-center transition-colors" onClick={() => setIsComposeOpen(false)}>
                                <span className="material-symbols-outlined text-on-surface-variant" data-icon="close">close</span>
                            </button>
                        </div>
                        
                        {composeSuccess ? (
                            <div className="p-8 text-center space-y-3">
                                <span className="material-symbols-outlined text-5xl text-emerald-600 font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                <h4 className="font-bold text-on-surface text-lg">Mensagem Enviada!</h4>
                                <p className="text-sm text-on-surface-variant">Sua mensagem foi enviada ao departamento com sucesso.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSendMessage} className="flex flex-col overflow-hidden">
                                {/* Modal Body */}
                                <div className="p-8 space-y-6 overflow-y-auto scrollbar-hide">
                                    <div className="grid grid-cols-2 gap-4">
                                        {/* Departamento */}
                                        <div className="space-y-2">
                                            <label className="font-label text-sm font-bold text-on-surface-variant px-1">Departamento</label>
                                            <div className="relative">
                                                <select 
                                                    className="w-full bg-surface-container-low border-none rounded-2xl px-4 py-3.5 appearance-none focus:ring-2 focus:ring-primary text-on-surface font-medium transition-all"
                                                    required
                                                    value={department}
                                                    onChange={(e) => setDepartment(e.target.value)}
                                                >
                                                    <option value="" disabled>Selecione um departamento</option>
                                                    <option value="Financeiro">Financeiro</option>
                                                    <option value="Pedagógico">Pedagógico</option>
                                                    <option value="Suporte Técnico">Suporte Técnico</option>
                                                    <option value="Secretaria">Secretaria</option>
                                                </select>
                                                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant" data-icon="expand_more">expand_more</span>
                                            </div>
                                        </div>
                                        {/* Assunto */}
                                        <div className="space-y-2">
                                            <label className="font-label text-sm font-bold text-on-surface-variant px-1">Assunto</label>
                                            <div className="relative">
                                                <select 
                                                    className="w-full bg-surface-container-low border-none rounded-2xl px-4 py-3.5 appearance-none focus:ring-2 focus:ring-primary text-on-surface font-medium transition-all"
                                                    required
                                                    value={subject}
                                                    onChange={(e) => setSubject(e.target.value)}
                                                >
                                                    <option value="" disabled>Selecione o assunto</option>
                                                    <option value="Dúvida sobre mensalidade">Dúvida sobre mensalidade</option>
                                                    <option value="Problemas técnicos">Problemas técnicos</option>
                                                    <option value="Trancamento de curso">Trancamento de curso</option>
                                                    <option value="Outros assuntos">Outros assuntos</option>
                                                </select>
                                                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant" data-icon="expand_more">expand_more</span>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Message Content */}
                                    <div className="space-y-2">
                                        <label className="font-label text-sm font-bold text-on-surface-variant px-1">Sua Mensagem</label>
                                        <textarea 
                                            className="w-full bg-surface-container-low border-none rounded-3xl p-6 min-h-[180px] focus:ring-2 focus:ring-primary text-on-surface font-medium placeholder:text-on-surface-variant/40 resize-none transition-all" 
                                            placeholder="Descreva sua solicitação com detalhes..."
                                            required
                                            value={messageText}
                                            onChange={(e) => setMessageText(e.target.value)}
                                        />
                                    </div>
                                    {/* File Upload */}
                                    <div className="space-y-2">
                                        <label className="font-label text-sm font-bold text-on-surface-variant px-1">Anexar arquivos</label>
                                        <div 
                                            className="relative group cursor-pointer" 
                                            id="drop-zone"
                                            onDragOver={handleDragOver}
                                            onDragLeave={handleDragLeave}
                                            onDrop={handleDrop}
                                        >
                                            <div className={`absolute inset-0 rounded-3xl border-2 border-dashed border-outline-variant/30 group-hover:border-primary/50 group-hover:bg-primary/10 transition-all duration-300 ${isDragging ? 'border-primary bg-primary/10' : 'bg-primary/5'}`}></div>
                                            <div className="relative p-8 flex flex-col items-center justify-center text-center">
                                                <div className="w-14 h-14 bg-white rounded-full shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                                                    <span className="material-symbols-outlined text-primary text-3xl" data-icon="upload_file">upload_file</span>
                                                </div>
                                                <p className="font-bold text-on-surface mb-1">Arraste seus arquivos aqui</p>
                                                <p className="text-xs text-on-surface-variant px-12">Formatos aceitos: PDF, JPG, PNG e DOCX (Máx 10MB)</p>
                                                <button type="button" className="mt-4 px-5 py-2 bg-surface-container-high rounded-full text-xs font-bold text-primary hover:bg-primary hover:text-white transition-all">Ou selecione do computador</button>
                                            </div>
                                            <input 
                                                className="absolute inset-0 opacity-0 cursor-pointer" 
                                                type="file" 
                                                multiple
                                                onChange={handleFileChange}
                                            />
                                        </div>

                                        {attachedFiles.length > 0 && (
                                            <div className="mt-4 space-y-2 animate-fade-in">
                                                <p className="text-xs font-bold text-on-surface-variant uppercase px-1">Arquivos Anexados:</p>
                                                <div className="space-y-1">
                                                    {attachedFiles.map((file, i) => (
                                                        <div key={i} className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
                                                            <div className="flex items-center gap-2">
                                                                <span className="material-symbols-outlined text-primary text-base">insert_drive_file</span>
                                                                <span className="text-xs font-bold text-on-surface truncate max-w-xs">{file.name}</span>
                                                                <span className="text-[10px] text-slate-400">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                                                            </div>
                                                            <button type="button" onClick={() => removeFile(i)} className="text-error hover:opacity-80 p-1">
                                                                <span className="material-symbols-outlined text-sm font-black">delete</span>
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {/* Modal Footer */}
                                <div className="px-8 py-6 bg-surface-container-low/30 flex items-center justify-end gap-4 border-t border-outline-variant/5">
                                    <button type="button" className="px-6 py-3 rounded-2xl font-bold text-on-surface-variant hover:bg-surface-container-high transition-all active:scale-95" onClick={() => setIsComposeOpen(false)}>
                                        Cancelar
                                    </button>
                                    <button type="submit" className="px-8 py-3 bg-gradient-to-br from-primary to-primary-dim rounded-2xl font-bold text-white shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 active:scale-95 transition-all">
                                        Enviar Mensagem
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </StudentLayout>
    );
}
