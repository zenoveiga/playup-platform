export default function DadosPessoais({ data, setData, errors }) {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-outline-variant/10 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#e8f0fe] dark:bg-blue-950/40 text-primary dark:text-[#00D1FF] flex items-center justify-center">
                    <span className="material-symbols-outlined text-xl">person</span>
                </div>
                <h2 className="text-xl font-headline font-extrabold text-[#003346] dark:text-white">Dados Pessoais &amp; Cadastro</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-bold text-[#507c94] uppercase tracking-wider mb-2">Nome Completo *</label>
                    <input
                        type="text"
                        required
                        value={data.name}
                        onChange={e => setData('name', e.target.value)}
                        className="w-full bg-[#eff8ff] dark:bg-slate-950 border-none rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-primary/20 text-[#003346] dark:text-white outline-none"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                <div>
                    <label className="block text-xs font-bold text-[#507c94] uppercase tracking-wider mb-2">E-mail *</label>
                    <input
                        type="email"
                        required
                        value={data.email}
                        onChange={e => setData('email', e.target.value)}
                        className="w-full bg-[#eff8ff] dark:bg-slate-950 border-none rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-primary/20 text-[#003346] dark:text-white outline-none"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                    <label className="block text-xs font-bold text-[#507c94] uppercase tracking-wider mb-2">Telefone *</label>
                    <input
                        type="tel"
                        required
                        value={data.phone}
                        onChange={e => setData('phone', e.target.value)}
                        className="w-full bg-[#eff8ff] dark:bg-slate-950 border-none rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-primary/20 text-[#003346] dark:text-white outline-none"
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-[#507c94] uppercase tracking-wider mb-2">Data Nasc.</label>
                        <input
                            type="date"
                            value={data.birth_date}
                            onChange={e => setData('birth_date', e.target.value)}
                            className="w-full bg-[#eff8ff] dark:bg-slate-950 border-none rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-primary/20 text-[#003346] dark:text-white outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-[#507c94] uppercase tracking-wider mb-2">Gênero</label>
                        <select
                            value={data.gender}
                            onChange={e => setData('gender', e.target.value)}
                            className="w-full bg-[#eff8ff] dark:bg-slate-950 border-none rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-primary/20 text-[#003346] dark:text-white outline-none"
                        >
                            <option value="male">Masculino</option>
                            <option value="female">Feminino</option>
                            <option value="other">Outro</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-[#507c94] uppercase tracking-wider mb-2">CPF</label>
                    <input
                        type="text"
                        value={data.cpf}
                        onChange={e => setData('cpf', e.target.value)}
                        className="w-full bg-[#eff8ff] dark:bg-slate-950 border-none rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-primary/20 text-[#003346] dark:text-white outline-none"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-[#507c94] uppercase tracking-wider mb-2">RG</label>
                    <input
                        type="text"
                        value={data.rg}
                        onChange={e => setData('rg', e.target.value)}
                        className="w-full bg-[#eff8ff] dark:bg-slate-950 border-none rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-primary/20 text-[#003346] dark:text-white outline-none"
                    />
                </div>

                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-outline-variant/10">
                    <div>
                        <label className="block text-xs font-bold text-[#507c94] uppercase tracking-wider mb-2">CEP</label>
                        <input
                            type="text"
                            value={data.cep}
                            onChange={e => setData('cep', e.target.value)}
                            className="w-full bg-[#eff8ff] dark:bg-slate-950 border-none rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-primary/20 text-[#003346] dark:text-white outline-none"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-[#507c94] uppercase tracking-wider mb-2">Logradouro / Endereço</label>
                        <input
                            type="text"
                            value={data.address}
                            onChange={e => setData('address', e.target.value)}
                            className="w-full bg-[#eff8ff] dark:bg-slate-950 border-none rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-primary/20 text-[#003346] dark:text-white outline-none"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
