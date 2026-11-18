import StudentLayout from '@/Layouts/StudentLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function CoursePlay() {
    const { auth } = usePage().props;
    const user = auth?.user || { name: 'Alex Santos' };

    // Tabs state
    const [activeTab, setActiveTab] = useState('conteudo');

    // Notes state
    const [notes, setNotes] = useState('');
    const [noteSaved, setNoteSaved] = useState(false);

    // Discussion comments state
    const [comments, setComments] = useState([
        {
            author: 'Mariana Costa',
            time: 'há 2 horas',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAle2jOAScRC_mYo8D24chaR5NO4vb_6HdLu_epPqMWm5C3DoBy0ZIYfC6w4I8-PU3NOCJpVWvzyYsV1VaGCBtOz02kpQf7oN8J0Gdo_Cn5sI2UBSxTl_FJeSRvgOyx5mNSaWTrlWIrs31vInO_tIRnyXRlP71bXlXKHS3iTUu9XjhBMcjilZADKVL0JqKuBJQWIKCzpKOBK5Wp-pQveniBS6fx5QJgc_t7Bt2gVr4SJKRrTBL_t153VQ',
            text: 'Excelente explicação sobre o TOFU. Ficou muito mais claro como desenhar a isca digital certa para cada público.'
        },
        {
            author: 'Bruno Silva',
            time: 'há 1 dia',
            avatar: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=280&auto=format&fit=crop',
            text: 'Professor, o sequenciamento de e-mails do desafio deve incluir ofertas diretas ou focar apenas em conteúdo de valor?'
        }
    ]);
    const [newComment, setNewComment] = useState('');

    // Course rating state
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(null);
    const [feedbackText, setFeedbackText] = useState('');
    const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

    // Accordion State
    const [expandedModules, setExpandedModules] = useState({
        modulo1: false,
        modulo2: true,
        modulo3: false
    });

    const toggleModule = (moduleName) => {
        setExpandedModules(prev => ({
            ...prev,
            [moduleName]: !prev[moduleName]
        }));
    };

    const handleSaveNotes = (e) => {
        e.preventDefault();
        setNoteSaved(true);
        setTimeout(() => setNoteSaved(false), 3000);
    };

    const handleAddComment = (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        setComments(prev => [
            ...prev,
            {
                author: user.name,
                time: 'agora mesmo',
                avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAle2jOAScRC_mYo8D24chaR5NO4vb_6HdLu_epPqMWm5C3DoBy0ZIYfC6w4I8-PU3NOCJpVWvzyYsV1VaGCBtOz02kpQf7oN8J0Gdo_Cn5sI2UBSxTl_FJeSRvgOyx5mNSaWTrlWIrs31vInO_tIRnyXRlP71bXlXKHS3iTUu9XjhBMcjilZADKVL0JqKuBJQWIKCzpKOBK5Wp-pQveniBS6fx5QJgc_t7Bt2gVr4SJKRrTBL_t153VQ',
                text: newComment
            }
        ]);
        setNewComment('');
    };

    const handleAddFeedback = (e) => {
        e.preventDefault();
        setFeedbackSubmitted(true);
        setTimeout(() => setFeedbackSubmitted(false), 3000);
    };

    return (
        <StudentLayout>
            <Head title="Ambiente de Aprendizagem | PlayUp Academy" />
            
            <style dangerouslySetInnerHTML={{ __html: `
                .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
                .glass-effect { background: rgba(239, 248, 255, 0.7); backdrop-filter: blur(24px); }
                .gradient-button { background: linear-gradient(135deg, #0050d4 0%, #7b9cff 100%); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
                .gradient-button:hover { transform: scale(1.02); opacity: 0.9; }
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}} />

            {/* Content Area */}
            <div className="p-3 sm:p-6 md:p-8 flex flex-col lg:flex-row gap-4 sm:gap-8">
                    {/* Left/Center Column (Player & Details) */}
                    <section className="flex-grow flex flex-col gap-6 lg:w-2/3">
                        {/* Video Player Container */}
                        <div className="w-full aspect-video bg-inverse-surface rounded-xl overflow-hidden shadow-xl relative group">
                            <img className="w-full h-full object-cover opacity-80" data-alt="Cinematic class banner" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfySkkoqClDIZTsvkAjQHFX1MreUHE16Eg7QLF4Mfx96NqRI_e9R7Sge8t3duoyMFp80Z_nqcmu-boLOv2kYEbWg7ruH4c6GEUgjNOBdyxaN4jq0iGC66yyEokqlMa8S-m-jWRdWa9Y0iVf9_czS3tBeXYkEAasBUkfCCNpNXpWs3sNKnNRb9RE4roMyQS6QedHL-4LzZ84ZEZyM1uRrbs8yFvPZyvefXhW2K9RsQncG4gpHlKKvR7Nw" />
                            {/* Overlay Controls */}
                            <div className="absolute inset-0 flex flex-col justify-between p-6 bg-gradient-to-t from-black/80 via-transparent to-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="flex justify-between items-start">
                                    <h2 className="text-white font-bold text-lg md:text-xl font-headline">Aula 3: Funil de Vendas - Marketing Digital</h2>
                                    <button className="bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/30 transition-colors">
                                        <span className="material-symbols-outlined" data-icon="share">share</span>
                                    </button>
                                </div>
                                <div className="flex flex-col gap-4">
                                    {/* Progress Bar */}
                                    <div className="w-full h-1.5 bg-white/30 rounded-full relative overflow-hidden">
                                        <div className="absolute top-0 left-0 h-full w-[72%] bg-primary shadow-[0_0_10px_#0050d4]"></div>
                                    </div>
                                    {/* Controls */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-6 text-white">
                                            <span className="material-symbols-outlined cursor-pointer hover:scale-110 transition-transform" data-icon="skip_previous">skip_previous</span>
                                            <span className="material-symbols-outlined text-4xl cursor-pointer hover:scale-110 transition-transform" data-icon="play_arrow" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                                            <span className="material-symbols-outlined cursor-pointer hover:scale-110 transition-transform" data-icon="skip_next">skip_next</span>
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined" data-icon="volume_up">volume_up</span>
                                                <div className="w-16 h-1 bg-white/30 rounded-full"></div>
                                            </div>
                                            <span className="text-xs font-mono">12:45 / 18:30</span>
                                        </div>
                                        <div className="flex items-center gap-4 text-white">
                                            <span className="material-symbols-outlined cursor-pointer" data-icon="subtitles">subtitles</span>
                                            <span className="material-symbols-outlined cursor-pointer" data-icon="settings">settings</span>
                                            <span className="material-symbols-outlined cursor-pointer" data-icon="fullscreen">fullscreen</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tabs System */}
                        <div className="bg-surface-container-lowest rounded-xl p-2 shadow-sm">
                            <div className="flex gap-1 border-b border-outline-variant border-opacity-10 pb-2 overflow-x-auto hide-scrollbar">
                                <button 
                                    className={`px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${activeTab === 'conteudo' ? 'bg-primary text-on-primary font-bold' : 'text-on-surface-variant hover:bg-surface-container-low'}`}
                                    onClick={() => setActiveTab('conteudo')}
                                >
                                    Conteúdo
                                </button>
                                <button 
                                    className={`px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${activeTab === 'materiais' ? 'bg-primary text-on-primary font-bold' : 'text-on-surface-variant hover:bg-surface-container-low'}`}
                                    onClick={() => setActiveTab('materiais')}
                                >
                                    Materiais
                                </button>
                                <button 
                                    className={`px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${activeTab === 'anotacoes' ? 'bg-primary text-on-primary font-bold' : 'text-on-surface-variant hover:bg-surface-container-low'}`}
                                    onClick={() => setActiveTab('anotacoes')}
                                >
                                    Anotações
                                </button>
                                <button 
                                    className={`px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${activeTab === 'discussoes' ? 'bg-primary text-on-primary font-bold' : 'text-on-surface-variant hover:bg-surface-container-low'}`}
                                    onClick={() => setActiveTab('discussoes')}
                                >
                                    Discussões
                                </button>
                                <button 
                                    className={`px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${activeTab === 'avaliacoes' ? 'bg-primary text-on-primary font-bold' : 'text-on-surface-variant hover:bg-surface-container-low'}`}
                                    onClick={() => setActiveTab('avaliacoes')}
                                >
                                    Avaliações
                                </button>
                            </div>

                            <div className="p-6">
                                {activeTab === 'conteudo' && (
                                    <div>
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="font-headline font-bold text-xl">Resumo da Aula</h3>
                                            <button className="flex items-center gap-2 text-primary font-bold text-sm hover:opacity-80">
                                                <span className="material-symbols-outlined text-sm" data-icon="download">download</span>
                                                Baixar PDF
                                            </button>
                                        </div>
                                        <article className="prose max-w-none text-on-surface-variant leading-relaxed">
                                            <p className="mb-4">Nesta aula, exploramos as estruturas fundamentais do funil de vendas moderno. O foco está na jornada do consumidor do <strong>Topo de Funil (TOFU)</strong> até a <strong>Conversão</strong>.</p>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                                                <div className="bg-surface-container-low p-4 rounded-xl border-l-4 border-primary">
                                                    <h4 className="font-bold mb-2">Key Takeaways</h4>
                                                    <ul className="list-disc pl-5 space-y-2 text-sm">
                                                        <li>Atração via Tráfego Pago vs Orgânico</li>
                                                        <li>Nutrição através de E-mail Marketing</li>
                                                        <li>Gatilhos mentais de Escassez e Prova Social</li>
                                                    </ul>
                                                </div>
                                                <div className="bg-tertiary-container/30 p-4 rounded-xl border-l-4 border-tertiary">
                                                    <h4 className="font-bold mb-2">Desafio Prático</h4>
                                                    <p className="text-sm">Desenhe o fluxo de e-mails para um produto de ticket médio ($197) considerando 5 dias de sequência.</p>
                                                </div>
                                            </div>
                                            <p>O próximo passo será a análise de métricas (CTR, CPA e ROI) para otimizar cada etapa desse funil.</p>
                                        </article>
                                    </div>
                                )}

                                {activeTab === 'materiais' && (
                                    <div>
                                        <h3 className="font-headline font-bold text-xl mb-4">Materiais Complementares</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                                                <div className="flex items-center gap-3">
                                                    <span className="material-symbols-outlined text-primary text-3xl">picture_as_pdf</span>
                                                    <div>
                                                        <h4 className="text-sm font-bold text-on-surface">Slide da Aula 3.pdf</h4>
                                                        <p className="text-[10px] text-slate-400">PDF • 4.2 MB</p>
                                                    </div>
                                                </div>
                                                <button className="p-2 text-primary hover:bg-primary-container/20 rounded-lg transition-colors">
                                                    <span className="material-symbols-outlined">download</span>
                                                </button>
                                            </div>
                                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                                                <div className="flex items-center gap-3">
                                                    <span className="material-symbols-outlined text-green-600 text-3xl">table_chart</span>
                                                    <div>
                                                        <h4 className="text-sm font-bold text-on-surface">Planilha de Métricas Funil.xlsx</h4>
                                                        <p className="text-[10px] text-slate-400">Excel • 1.1 MB</p>
                                                    </div>
                                                </div>
                                                <button className="p-2 text-primary hover:bg-primary-container/20 rounded-lg transition-colors">
                                                    <span className="material-symbols-outlined">download</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'anotacoes' && (
                                    <div>
                                        <h3 className="font-headline font-bold text-xl mb-2">Suas Anotações Pessoais</h3>
                                        <p className="text-xs text-on-surface-variant mb-4">Suas anotações são privadas e ficam salvas junto ao seu progresso na aula.</p>
                                        <form onSubmit={handleSaveNotes} className="space-y-4">
                                            <textarea 
                                                className="w-full h-36 p-4 border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent bg-slate-50/50 resize-none text-sm text-on-surface font-medium"
                                                placeholder="Escreva aqui suas observações sobre a aula..."
                                                value={notes}
                                                onChange={(e) => setNotes(e.target.value)}
                                            />
                                            <div className="flex items-center justify-between">
                                                {noteSaved ? (
                                                    <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-sm font-black">check_circle</span>
                                                        Salvo com sucesso!
                                                    </span>
                                                ) : <span />}
                                                <button type="submit" className="px-6 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:opacity-90 active:scale-95 transition-all">
                                                    Salvar Anotação
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}

                                {activeTab === 'discussoes' && (
                                    <div className="space-y-6">
                                        <h3 className="font-headline font-bold text-xl">Fórum de Dúvidas</h3>
                                        <div className="space-y-4">
                                            {comments.map((comment, index) => (
                                                <div key={index} className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                                                    <img className="w-9 h-9 rounded-full object-cover shrink-0" src={comment.avatar} alt={comment.author} />
                                                    <div className="space-y-1 flex-grow">
                                                        <div className="flex justify-between items-center">
                                                            <h4 className="text-xs font-bold text-on-surface">{comment.author}</h4>
                                                            <span className="text-[10px] text-slate-400 font-medium">{comment.time}</span>
                                                        </div>
                                                        <p className="text-xs text-on-surface-variant leading-relaxed font-medium">{comment.text}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <form onSubmit={handleAddComment} className="flex gap-4 border-t border-slate-100 pt-4">
                                            <textarea 
                                                className="flex-grow p-3 border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent bg-slate-50 resize-none text-xs text-on-surface font-medium"
                                                rows="2"
                                                placeholder="Tire suas dúvidas ou comente algo sobre esta aula..."
                                                value={newComment}
                                                onChange={(e) => setNewComment(e.target.value)}
                                            />
                                            <button type="submit" className="px-5 bg-primary text-white text-xs font-bold rounded-xl hover:opacity-90 active:scale-95 transition-all self-end h-10">
                                                Enviar
                                            </button>
                                        </form>
                                    </div>
                                )}

                                {activeTab === 'avaliacoes' && (
                                    <div className="max-w-md">
                                        <h3 className="font-headline font-bold text-xl mb-1">Avalie esta Aula</h3>
                                        <p className="text-xs text-on-surface-variant mb-4">Deixe seu feedback para que possamos sempre aprimorar nossos conteúdos.</p>
                                        
                                        {feedbackSubmitted ? (
                                            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
                                                <span className="material-symbols-outlined text-emerald-600 font-black">check_circle</span>
                                                Obrigado pela sua avaliação!
                                            </div>
                                        ) : (
                                            <form onSubmit={handleAddFeedback} className="space-y-4">
                                                <div className="flex items-center gap-2">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <button 
                                                            key={star} 
                                                            type="button"
                                                            className="text-2xl transition-colors focus:outline-none"
                                                            onClick={() => setRating(star)}
                                                            onMouseEnter={() => setHoverRating(star)}
                                                            onMouseLeave={() => setHoverRating(null)}
                                                        >
                                                            <span className="material-symbols-outlined" style={{ 
                                                                color: star <= (hoverRating || rating) ? '#0050d4' : '#cfecff',
                                                                fontVariationSettings: star <= (hoverRating || rating) ? "'FILL' 1" : "'FILL' 0"
                                                            }}>
                                                                star
                                                            </span>
                                                        </button>
                                                    ))}
                                                </div>
                                                <textarea 
                                                    className="w-full p-3 border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent bg-slate-50 resize-none text-xs text-on-surface font-medium"
                                                    rows="3"
                                                    placeholder="Deixe um comentário opcional sobre o que achou..."
                                                    value={feedbackText}
                                                    onChange={(e) => setFeedbackText(e.target.value)}
                                                />
                                                <button type="submit" className="px-6 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:opacity-90 active:scale-95 transition-all">
                                                    Enviar Avaliação
                                                </button>
                                            </form>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Right Sidebar (Study Widgets) */}
                    <aside className="w-full lg:w-1/3 flex flex-col gap-6">
                        {/* Progress Circular Widget */}
                        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant border-opacity-5">
                            <h3 className="font-headline font-bold text-on-surface mb-6">Seu Progresso</h3>
                            <div className="flex items-center justify-between">
                                <div className="relative w-24 h-24">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle className="text-surface-container" cx="48" cy="48" fill="transparent" r="40" stroke="currentColor" strokeWidth="8"></circle>
                                        <circle className="text-primary transition-all duration-1000 ease-out" cx="48" cy="48" fill="transparent" r="40" stroke="currentColor" strokeDasharray="251.2" strokeDashoffset="70.3" strokeWidth="8"></circle>
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center font-bold text-xl text-on-surface">72%</div>
                                </div>
                                <div className="flex-grow pl-6">
                                    <p className="text-sm text-on-surface-variant font-medium">18 de 25 aulas</p>
                                    <p className="text-xs text-on-surface-variant opacity-60">Faltam 4h para concluir</p>
                                    <button className="mt-4 text-xs font-bold text-primary flex items-center gap-1 group">
                                        Ver certificado
                                        <span className="material-symbols-outlined text-xs group-hover:translate-x-1 transition-transform" data-icon="chevron_right">chevron_right</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Daily Goal Widget */}
                        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant border-opacity-5">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-headline font-bold text-on-surface">Meta Diária</h3>
                                <div className="flex items-center gap-1 text-tertiary font-bold text-xs bg-tertiary-container/30 px-3 py-1 rounded-full">
                                    <span className="material-symbols-outlined text-[14px]" data-icon="check_circle" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                    Meta Atingida!
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex-grow">
                                    <div className="flex justify-between text-xs mb-2">
                                        <span className="text-on-surface-variant font-bold">45/45 min</span>
                                        <span className="text-on-surface-variant opacity-60">100%</span>
                                    </div>
                                    <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
                                        <div className="h-full w-full bg-tertiary"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Course Content Accordion */}
                        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant border-opacity-5 overflow-hidden">
                            <div className="p-6 border-b border-outline-variant border-opacity-10">
                                <h3 className="font-headline font-bold text-on-surface">Conteúdo do Curso</h3>
                            </div>
                            <div className="divide-y divide-outline-variant divide-opacity-10">
                                {/* Módulo 1 (Togglable) */}
                                <div className="bg-surface-container-low/30 cursor-pointer">
                                    <div className="p-5 flex justify-between items-center select-none" onClick={() => toggleModule('modulo1')}>
                                        <div className="flex items-center gap-3">
                                            <span className="material-symbols-outlined text-tertiary" data-icon="check_circle" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                            <div>
                                                <p className="text-sm font-bold text-on-surface">Módulo 1: Fundamentos</p>
                                                <p className="text-[10px] text-on-surface-variant">4/4 aulas concluídas</p>
                                            </div>
                                        </div>
                                        <span className="material-symbols-outlined text-on-surface-variant">
                                            {expandedModules.modulo1 ? 'expand_less' : 'expand_more'}
                                        </span>
                                    </div>
                                    {expandedModules.modulo1 && (
                                        <div className="px-2 pb-5 space-y-1 bg-white border-t border-slate-100 pt-3">
                                            <div className="flex items-center gap-4 p-3 rounded-xl bg-surface-container-low/50">
                                                <span className="material-symbols-outlined text-tertiary text-lg" data-icon="check_circle" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                                <span className="text-xs font-medium text-on-surface">Aula 1: Introdução ao Marketing Digital</span>
                                                <span className="ml-auto text-[10px] text-on-surface-variant">12 min</span>
                                            </div>
                                            <div className="flex items-center gap-4 p-3 rounded-xl bg-surface-container-low/50">
                                                <span className="material-symbols-outlined text-tertiary text-lg" data-icon="check_circle" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                                <span className="text-xs font-medium text-on-surface">Aula 2: Canais de Atração</span>
                                                <span className="ml-auto text-[10px] text-on-surface-variant">18 min</span>
                                            </div>
                                            <div className="flex items-center gap-4 p-3 rounded-xl bg-surface-container-low/50">
                                                <span className="material-symbols-outlined text-tertiary text-lg" data-icon="check_circle" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                                <span className="text-xs font-medium text-on-surface">Aula 3: Persona e Público Alvo</span>
                                                <span className="ml-auto text-[10px] text-on-surface-variant">25 min</span>
                                            </div>
                                            <div className="flex items-center gap-4 p-3 rounded-xl bg-surface-container-low/50">
                                                <span className="material-symbols-outlined text-tertiary text-lg" data-icon="check_circle" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                                <span className="text-xs font-medium text-on-surface">Aula 4: Landing Pages e Iscas</span>
                                                <span className="ml-auto text-[10px] text-on-surface-variant">20 min</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Módulo 2 (Active/Expanded/Togglable) */}
                                <div className="bg-white">
                                    <div className="p-5 flex justify-between items-center border-l-4 border-primary cursor-pointer select-none" onClick={() => toggleModule('modulo2')}>
                                        <div className="flex items-center gap-3">
                                            <span className="material-symbols-outlined text-primary" data-icon="pending" style={{ fontVariationSettings: "'FILL' 1" }}>pending</span>
                                            <div>
                                                <p className="text-sm font-bold text-on-surface">Módulo 2: Estratégias de Venda</p>
                                                <p className="text-[10px] text-on-surface-variant">2/5 aulas concluídas</p>
                                            </div>
                                        </div>
                                        <span className="material-symbols-outlined text-primary">
                                            {expandedModules.modulo2 ? 'expand_less' : 'expand_more'}
                                        </span>
                                    </div>
                                    {/* Lessons List */}
                                    {expandedModules.modulo2 && (
                                        <div className="px-2 pb-5 space-y-1">
                                            <div className="flex items-center gap-4 p-3 rounded-xl bg-surface-container-low/50">
                                                <span className="material-symbols-outlined text-tertiary text-lg" data-icon="check_circle" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                                <span className="text-xs font-medium text-on-surface">Aula 1: Psicologia do Comprador</span>
                                                <span className="ml-auto text-[10px] text-on-surface-variant">15 min</span>
                                            </div>
                                            <div className="flex items-center gap-4 p-3 rounded-xl bg-surface-container-low/50">
                                                <span className="material-symbols-outlined text-tertiary text-lg" data-icon="check_circle" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                                <span className="text-xs font-medium text-on-surface">Aula 2: Gatilhos Mentais</span>
                                                <span className="ml-auto text-[10px] text-on-surface-variant">22 min</span>
                                            </div>
                                            <div className="flex items-center gap-4 p-3 rounded-xl bg-primary-container/20 border border-primary/20">
                                                <span className="material-symbols-outlined text-primary text-lg" data-icon="play_circle" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
                                                <span className="text-xs font-bold text-primary">Aula 3: Funil de Vendas</span>
                                                <span className="ml-auto text-[10px] text-primary font-bold">Em curso</span>
                                            </div>
                                            <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-container-low transition-colors cursor-pointer">
                                                <span className="material-symbols-outlined text-on-surface-variant text-lg" data-icon="radio_button_unchecked">radio_button_unchecked</span>
                                                <span className="text-xs font-medium text-on-surface-variant">Aula 4: Tráfego e Conversão</span>
                                                <span className="ml-auto text-[10px] text-on-surface-variant">18 min</span>
                                            </div>
                                            <div className="flex items-center gap-4 p-3 rounded-xl opacity-50">
                                                <span className="material-symbols-outlined text-on-surface-variant text-lg" data-icon="lock">lock</span>
                                                <span className="text-xs font-medium text-on-surface-variant">Aula 5: Retenção Pós-Venda</span>
                                                <span className="ml-auto text-[10px] text-on-surface-variant">20 min</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Módulo 3 (Locked/Togglable) */}
                                <div className="bg-surface-container-low/30 opacity-50">
                                    <div className="p-5 flex justify-between items-center cursor-pointer select-none" onClick={() => toggleModule('modulo3')}>
                                        <div className="flex items-center gap-3">
                                            <span className="material-symbols-outlined text-on-surface-variant" data-icon="lock">lock</span>
                                            <div>
                                                <p className="text-sm font-bold text-on-surface">Módulo 3: Escala e ROI</p>
                                                <p className="text-[10px] text-on-surface-variant">Bloqueado</p>
                                            </div>
                                        </div>
                                        <span className="material-symbols-outlined text-on-surface-variant">
                                            {expandedModules.modulo3 ? 'expand_less' : 'expand_more'}
                                        </span>
                                    </div>
                                    {expandedModules.modulo3 && (
                                        <div className="px-2 pb-5 space-y-1 bg-white border-t border-slate-100 pt-3">
                                            <div className="flex items-center gap-4 p-3 rounded-xl opacity-50">
                                                <span className="material-symbols-outlined text-on-surface-variant text-lg" data-icon="lock">lock</span>
                                                <span className="text-xs font-medium text-on-surface-variant">Aula 1: Métricas de Conversão</span>
                                                <span className="ml-auto text-[10px] text-on-surface-variant">15 min</span>
                                            </div>
                                            <div className="flex items-center gap-4 p-3 rounded-xl opacity-50">
                                                <span className="material-symbols-outlined text-on-surface-variant text-lg" data-icon="lock">lock</span>
                                                <span className="text-xs font-medium text-on-surface-variant">Aula 2: Testes A/B</span>
                                                <span className="ml-auto text-[10px] text-on-surface-variant">22 min</span>
                                            </div>
                                            <div className="flex items-center gap-4 p-3 rounded-xl opacity-50">
                                                <span className="material-symbols-outlined text-on-surface-variant text-lg" data-icon="lock">lock</span>
                                                <span className="text-xs font-medium text-on-surface-variant">Aula 3: Otimização de ROI</span>
                                                <span className="ml-auto text-[10px] text-on-surface-variant">20 min</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Support CTA */}
                        <div className="bg-gradient-to-br from-primary to-primary-dim rounded-xl p-6 text-on-primary relative overflow-hidden group">
                            <div className="relative z-10">
                                <h4 className="font-headline font-bold text-lg mb-2">Dúvidas na aula?</h4>
                                <p className="text-xs opacity-90 mb-4">Nossos mentores respondem em menos de 15 minutos durante o horário comercial.</p>
                                <button className="bg-white text-primary px-4 py-2 rounded-lg font-bold text-xs hover:shadow-lg transition-shadow active:scale-95">
                                    Chamar Suporte
                                </button>
                            </div>
                            <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-9xl opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-500" data-icon="contact_support">contact_support</span>
                        </div>
                    </aside>
                </div>
            </StudentLayout>
    );
}
