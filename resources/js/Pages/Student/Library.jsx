import StudentLayout from '@/Layouts/StudentLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

export default function Library() {
    const [searchTerm, setSearchTerm] = useState('');

    const categories = [
        { name: 'Marketing', icon: 'campaign' },
        { name: 'Tecnologia', icon: 'terminal' },
        { name: 'Dev Pessoal', icon: 'psychology' },
        { name: 'Negócios', icon: 'business_center' },
        { name: 'Design', icon: 'draw' },
        { name: 'Produtividade', icon: 'timer' },
        { name: 'Liderança', icon: 'groups' },
        { name: 'IA', icon: 'precision_manufacturing' }
    ];

    const highlights = [
        {
            title: 'Hiper Foco',
            author: 'Chris Bailey',
            rating: '4.9 (12.4k)',
            price: 'R$ 59,90',
            tag: 'MAIS VENDIDO',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBv9uiS-6F-3oCaswkDBEF8n2vas5UQfsbWQiLeOLIkoidfVsWtvKXKF-NNjCjfmQtygHbtgakpn89yPCL98TehjRXI-yS3qIaIzj360qsSxvOHstAo8zvmlfqbvmB1c1SzGg8bYDXR5I-DYHREwmym_2F7T-6BosuQo5FFCZ7jSK2KQ6DYfyGDC8nu_MbPpCcLONx_DmMibbXj_TMBDN84fJi-VFcm19h6vaoVfCY6RQxFicvh4gt1lw'
        },
        {
            title: 'Arquitetura Limpa',
            author: 'Robert C. Martin',
            rating: '5.0 (8.2k)',
            price: 'R$ 84,90',
            tag: 'NOVO',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCx3XL4hfGGX09cv8XXDvsYg8x5-Emw-0NuOWyvDq4n3IZ6Re5JHrzo_7ab0qH9gKcNnya257dhz_QaU2zQVaTvHYyRyscNTLWaKl7Xmd6qe6bVtgGdxmC8EUiD-AezbrwQGmbkFhnF2TKLojB5Cc3QJhJcUeysn-GoP2VXcRoBNVgKJxpxqdsxc4BK7a9nSH_7TTSRGxStZtQptQl2fwMUAB1Wp2NW8wRFlTX-lWjv6YjHpbbjU9Ow5Q'
        },
        {
            title: 'Essencialismo',
            author: 'Greg McKeown',
            rating: '4.8 (15k)',
            price: 'R$ 49,90',
            tag: null,
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNd4iMQ-ncH2Ot4syxVFyB8bt1i5arbsrasf8avcDcOnsNsSIdX-vVHcTb9Kk2134DWmwoFUfaC1h1iwQP6mUR0MDi0aGrAfbcDSpq5BSbTmlQFukeZMtMh2Fh66gz3hbVKbgV74Q8nF4rHmO0tmSlUyQqPyBjjFIkVtE_XZZjwOzX409uIdda-xQwholnLeUkR4KqXG2lVEG55Q5ln3kvXHoMmHfLWLnfHC7M1St4Sj1lrdiiI0QXcQ'
        },
        {
            title: 'Psicologia Financeira',
            author: 'Morgan Housel',
            rating: '4.9 (10.1k)',
            price: 'R$ 54,90',
            tag: 'MAIS VENDIDO',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDuBiPypdi3X7vGo0ZKZqO2Qu2W4-1G6b0PRzVl4hiRIiKR0C6lkH0PHhdGZz_b6MH0fu09TY13kdB6PkPoC38Oo0HWm0wxU_Uba0crx0PBZ5zRqLXfmuUC65hO3vfrn3aT3j0meLx8wfxCgRhX2vfPCu_0U5KkuVu8VyGnM-TitC6vhByqjVd6WPuB0k8F19vYpjGFxy4MW8W5yKQmaaW1T4_GQ3C1WN1eWJAwhYW_2u0x4uJ0fHTUrQ'
        },
        {
            title: 'Segundo Cérebro',
            author: 'Tiago Forte',
            rating: '4.7 (5.4k)',
            price: 'R$ 67,90',
            tag: null,
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIz7YG6sk3VOjlFwBjM7s4WiMlvDJnpzLgmV6MjPUnXU8AeIwzaZlcC8YL6GwNzoWCB-XiGcja9tnSP2Kli8uwIYvmLIvIyRtKs2m0JrvtH-RiTlYnL9vkt-owdHQN5OdfSsJuXS7IlfC_v_OueYu-RQGhxGK1CMerAmC6GsMlTNtZpfK8fofSknJQEwAe3IKcuJbzIrnEJtogjIdBkFyNF2Ey7raenie5QqNjbPjJpjw4TzZmV8ku7g'
        },
        {
            title: 'Hábitos Atômicos',
            author: 'James Clear',
            rating: '5.0 (32k)',
            price: 'R$ 62,90',
            tag: 'MAIS VENDIDO',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOoojlGR11aPPzB7vK4uDpWrfTYSDK8p4sDZryTA9WI5o3N6GA_5mZyJBzRciREr52gtoyVw6P-iYo4HBmuoQ4qiKp_7lZqpPlNtJ8dZoulEfMXU4ZT79FDr6CtBRt7EZaozW7I048MHFcIYRBzhDGimSfWlMhGs71n2IPCmzx7Xp0R5oAfNEPa6Nbd1pqg9d_2U4H-2MdwoclLL4bu4ZkkNxNGb1NjRGYCruxQC1mWrDmL7LwcXkGgg'
        }
    ];

    return (
        <StudentLayout>
            <Head title="Biblioteca - PlayUp" />
            
            <div className="px-4 sm:px-6 lg:px-8 pb-12 space-y-10 pt-4">
                {/* Hero Section */}
                <section className="bg-[#f7f5ff] dark:bg-[#13112b] rounded-3xl p-8 lg:p-10 flex items-center justify-between overflow-hidden relative min-h-[340px] border border-purple-100 dark:border-purple-950/20">
                    <div className="max-w-xl z-10 space-y-6">
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-slate-900 text-primary text-xs font-extrabold shadow-sm">
                            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                            NOVIDADES SEMANAIS
                        </span>
                        <h3 className="font-headline text-3xl lg:text-4xl font-extrabold text-slate-800 dark:text-slate-100 leading-tight">
                            📚 Seu próximo conhecimento está a um clique
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 text-base lg:text-lg max-w-md">
                            Encontre as melhores referências do mercado para acelerar sua carreira e desenvolvimento pessoal.
                        </p>
                        
                        <div className="relative max-w-md group">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary">search</span>
                            <input 
                                className="w-full pl-12 pr-24 py-4 bg-white dark:bg-slate-900 rounded-2xl border-none shadow-sm focus:ring-4 focus:ring-primary/10 text-base text-slate-700 dark:text-slate-300" 
                                placeholder="O que você quer aprender hoje?" 
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary-dim text-white px-5 py-2 rounded-xl font-bold transition-all text-sm active:scale-95">
                                Buscar
                            </button>
                        </div>
                    </div>
                    
                    {/* 3D Illustration Area */}
                    <div className="relative w-[380px] h-[300px] hidden lg:block shrink-0">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
                            <div className="z-20 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                                <img 
                                    className="w-72 h-auto drop-shadow-2xl object-contain" 
                                    alt="Book stack illustration" 
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFsWrSfpc6OIqSX0OH-gBCPo3JeRj4zjvsMPAEIFkJtG9RzvSb4cx80iPLfJR4pLKTW3KoeHyJyxa_XLp175bc35JBujG8vwL4IQb_pySRWCREd8e9ziRmLhM5hOCiMhRZxJsYqZLlr1onKgoO2KOIZ5wbrgWsyuk8j4a1mUFGHCdGeiKL1LjTFgUJ3UOt6g1R_DQype3UILWEWrH99-F4N_xz_EV_2Z7NbuOlNUOeFzm0AkkvYTe0ZA"
                                />
                            </div>
                        </div>
                        {/* Floating elements */}
                        <div className="absolute top-10 right-4 bg-white dark:bg-slate-900 p-2.5 rounded-xl shadow-md animate-bounce" style={{ animationDuration: '4s' }}>
                            <div className="flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>menu_book</span>
                                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">Livros</span>
                            </div>
                        </div>
                        <div className="absolute bottom-10 -left-4 bg-white dark:bg-slate-900 p-2.5 rounded-xl shadow-md animate-bounce" style={{ animationDuration: '5s' }}>
                            <div className="flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-emerald-500 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>headphones</span>
                                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">Audiobooks</span>
                            </div>
                        </div>
                        <div className="absolute top-1/2 right-0 bg-white dark:bg-slate-900 p-2.5 rounded-xl shadow-md animate-bounce" style={{ animationDuration: '6s' }}>
                            <div className="flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-amber-500 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">Recomendados</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Sub Action Tabs */}
                <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4 hover:bg-primary/5 dark:hover:bg-slate-800/40 transition-all text-left group">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                            <span className="material-symbols-outlined text-lg">download</span>
                        </div>
                        <span className="font-bold text-sm text-slate-700 dark:text-slate-300">Livros Baixados</span>
                    </button>
                    <button className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4 hover:bg-primary/5 dark:hover:bg-slate-800/40 transition-all text-left group">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                            <span className="material-symbols-outlined text-lg">favorite</span>
                        </div>
                        <span className="font-bold text-sm text-slate-700 dark:text-slate-300">Favoritos</span>
                    </button>
                </section>

                {/* Categorias */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h4 className="font-headline text-xl font-extrabold text-slate-800 dark:text-slate-200">Explorar Categorias</h4>
                        <button className="text-primary font-bold text-sm flex items-center gap-1 hover:underline">
                            Ver todas <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </button>
                    </div>
                    <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 -mx-1 px-1">
                        {categories.map((cat, idx) => (
                            <div 
                                key={idx} 
                                className="flex-shrink-0 bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4 hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white transition-all cursor-pointer group w-48"
                            >
                                <div className="w-11 h-11 bg-primary/10 group-hover:bg-white/20 dark:bg-slate-800 rounded-xl flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-primary group-hover:text-white transition-colors">{cat.icon}</span>
                                </div>
                                <span className="font-bold text-sm text-slate-700 dark:text-slate-300 group-hover:text-white transition-colors">{cat.name}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Destaques Grid */}
                <section className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h4 className="font-headline text-2xl font-extrabold text-slate-800 dark:text-slate-200">Destaques da Temporada</h4>
                        <div className="flex gap-2">
                            <button className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center hover:bg-primary hover:text-white transition-colors active:scale-95">
                                <span className="material-symbols-outlined">chevron_left</span>
                            </button>
                            <button className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center hover:bg-primary hover:text-white transition-colors active:scale-95">
                                <span className="material-symbols-outlined">chevron_right</span>
                            </button>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                        {highlights.map((book, idx) => (
                            <div key={idx} className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden group border border-slate-100 dark:border-slate-800/80 shadow-sm flex flex-col h-full transition-transform hover:-translate-y-1">
                                <div className="relative aspect-[3/4] overflow-hidden bg-slate-100 dark:bg-slate-800">
                                    <img 
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                                        alt={book.title} 
                                        src={book.image}
                                    />
                                    {book.tag && (
                                        <div className="absolute top-3 left-3 bg-[#006a35] text-white text-[9px] font-black px-2 py-0.5 rounded-md tracking-wider">
                                            {book.tag}
                                        </div>
                                    )}
                                    <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur text-slate-700 dark:text-slate-300 flex items-center justify-center hover:text-red-500 transition-colors">
                                        <span className="material-symbols-outlined text-sm">favorite</span>
                                    </button>
                                </div>
                                <div className="p-4 flex flex-col flex-1 space-y-2">
                                    <div>
                                        <h5 className="font-bold text-sm text-slate-800 dark:text-slate-200 line-clamp-1 leading-tight group-hover:text-primary transition-colors">
                                            {book.title}
                                        </h5>
                                        <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{book.author}</p>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-amber-500 text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                        <span className="text-[9px] font-extrabold text-slate-500">{book.rating}</span>
                                    </div>
                                    <div className="mt-auto pt-2 flex items-center justify-between">
                                        <span className="font-extrabold text-sm text-primary">{book.price}</span>
                                        <button className="bg-slate-50 dark:bg-slate-800 text-primary dark:text-[#a58dff] font-bold text-[9px] px-2.5 py-1.5 rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
                                            Comprar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Duas Colunas Section */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Esquerda: Coleções Especiais */}
                    <div className="space-y-6">
                        <h4 className="font-headline text-2xl font-extrabold text-slate-800 dark:text-slate-200">Coleções Especiais</h4>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { name: 'Sucesso', icon: 'auto_graph', count: '124 Livros' },
                                { name: 'Carreira', icon: 'work', count: '86 Livros' },
                                { name: 'I. Emocional', icon: 'favorite_border', count: '52 Livros' },
                                { name: 'Empreendedorismo', icon: 'rocket_launch', count: '210 Livros' }
                            ].map((col, idx) => (
                                <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 group cursor-pointer hover:border-primary transition-all">
                                    <div className="w-12 h-12 rounded-xl bg-primary/15 dark:bg-slate-800 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-all">
                                        <span className="material-symbols-outlined">{col.icon}</span>
                                    </div>
                                    <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-1 leading-none">{col.name}</h5>
                                    <p className="text-xs text-slate-400 font-medium">{col.count} disponíveis</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Direita: Recomendados para seu momento */}
                    <div className="space-y-6">
                        <h4 className="font-headline text-2xl font-extrabold text-slate-800 dark:text-slate-200">Recomendados para seu momento</h4>
                        <div className="space-y-4">
                            {[
                                { title: 'Trabalho Focado', author: 'Cal Newport', price: 'R$ 45,90', oldPrice: 'R$ 59,90', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHsLL6mYqXOu6Uj6Z_R1zBgVEJFyjOVQmXPaGPosEvGlhZk25YKK8bNdS-S436tzYmPW2CSNFaniH-03-zpg-AiNFOlY-OMP4tRXDzg7IZz3cKrHeitu59ApVKrT3BNKNhmphWFzj9sc-y1_scNC5V1sqBkSpioXDh1Hle2I74waE0IecRcJhufHtzekJ81CvMYx-xw9XQQ0lOR2R5lQcFn4ihxznHqAREg2Yi_HwPGjwDio-frNkCSA' },
                                { title: 'Rápido e Devagar', author: 'Daniel Kahneman', price: 'R$ 68,00', oldPrice: null, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBaGCUTRim7am2Jx3T_NUtF1AzOY1NGQRxPVkNN4qoWgm1ZOSsTAfvPQzIkUCG6gNtAJWctESPfGPxOxBn-P8QoetW4_rETYMEkzexHun9qOVOtnUUGB7czT75c3_V-yYGVhfbPJI8QY3ekTo1y9i68L3KuA2boce-ZhjzjK-TUYMya1nD4ztEyp5CVZCWqTjZeLeaXirhJ4oBJHS7-xa7XhO_5KOesDlxGpewLNjPhedgBr6wTeoWtuw' },
                                { title: 'Minimalismo Digital', author: 'Cal Newport', price: 'R$ 39,90', oldPrice: null, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqwZSzOQPGdPIVOL2DhDwp5Fu4eh0VCDHAs5VxADHEulMXEzddRqCCmQk6bDzc-3rZVmQRW5NQq6bkRGkbi2SbwYqpf7mTIVLO3PLAHRgPP2Vfu4RLlYhYsqBl4DEOfZh4F1CZVmXEB6l3MSERAksnX5qVP7Mm3WwybasTrYxX9iEH4Ag8kyQVdjW3i4qScgt9ktOw6ydB7q4uQRw9yd5q4PkdTYyyF6Fzv09HZiSiI8vUFmDQ7iuMyA' }
                            ].map((book, idx) => (
                                <div key={idx} className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-5 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all">
                                    <div className="w-14 h-20 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden shrink-0">
                                        <img className="w-full h-full object-cover" alt={book.title} src={book.image} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h6 className="font-bold text-sm text-slate-800 dark:text-slate-200 mb-1 truncate">{book.title}</h6>
                                        <p className="text-[10px] text-slate-400 font-semibold mb-2">{book.author} • 4.9 <span className="text-amber-500">★</span></p>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-extrabold text-primary">{book.price}</span>
                                            {book.oldPrice && (
                                                <span className="text-[10px] line-through text-slate-400 opacity-60">{book.oldPrice}</span>
                                            )}
                                        </div>
                                    </div>
                                    <button className="bg-primary text-white w-10 h-10 rounded-xl flex items-center justify-center hover:bg-primary-dim transition-all shadow-md shadow-primary/10 shrink-0 active:scale-95">
                                        <span className="material-symbols-outlined text-sm">shopping_cart</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Benefícios */}
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { title: 'Compra Segura', desc: 'Dados 100% protegidos', icon: 'verified_user' },
                        { title: 'Acesso Imediato', desc: 'Comece a ler agora mesmo', icon: 'bolt' },
                        { title: 'Leia em qualquer lugar', desc: 'Sincronize todos seus dispositivos', icon: 'devices' },
                        { title: 'Garantia', desc: '7 dias para satisfação total', icon: 'workspace_premium' }
                    ].map((item, idx) => (
                        <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-2xl flex items-center gap-4 shadow-sm border border-slate-100 dark:border-slate-800">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
                                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
                            </div>
                            <div>
                                <h6 className="font-bold text-sm text-slate-800 dark:text-slate-200">{item.title}</h6>
                                <p className="text-[10px] text-slate-400 font-semibold leading-none mt-1">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </section>

                {/* CTA Final */}
                <section className="bg-slate-900 text-white rounded-3xl p-10 lg:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/4"></div>
                    
                    <div className="z-10 text-center md:text-left space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-primary-fixed text-xs font-bold">
                            <span className="material-symbols-outlined text-sm">gift</span>
                            PRESENTE PARA NOVOS MEMBROS
                        </div>
                        <h3 className="font-headline text-3xl font-extrabold">Clube do Conhecimento</h3>
                        <p className="text-slate-400 text-base max-w-xl">
                            Tenha acesso ilimitado a toda nossa biblioteca por um valor mensal fixo. Aprenda sem barreiras.
                        </p>
                    </div>
                    
                    <div className="z-10 shrink-0 text-center md:text-right">
                        <button className="bg-primary hover:bg-primary-dim text-white px-8 py-4 rounded-xl text-base font-bold transition-all transform hover:scale-105 shadow-lg shadow-primary/20 active:scale-95">
                            Conhecer plano
                        </button>
                        <p className="text-[10px] text-slate-500 mt-3">Cancele quando quiser. Sem fidelidade.</p>
                    </div>
                </section>
            </div>
        </StudentLayout>
    );
}
