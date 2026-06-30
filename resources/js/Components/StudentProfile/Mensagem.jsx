export default function Mensagem({ student, handleMessageSubmit }) {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-outline-variant/10 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#e8f0fe] dark:bg-blue-950/40 text-primary dark:text-[#00D1FF] flex items-center justify-center">
                    <span className="material-symbols-outlined text-xl">chat</span>
                </div>
                <h2 className="text-xl font-headline font-extrabold text-[#003346] dark:text-white">Enviar Mensagem Direta</h2>
            </div>

            <form onSubmit={handleMessageSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-[#507c94] uppercase tracking-wider mb-2">Canal de Envio</label>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 text-sm text-[#003346] dark:text-slate-200 cursor-pointer">
                            <input type="checkbox" defaultChecked className="rounded border-outline-variant text-primary focus:ring-0" />
                            <span>WhatsApp ({student.phone || '(S/ Contato)'})</span>
                        </label>
                        <label className="flex items-center gap-2 text-sm text-[#003346] dark:text-slate-200 cursor-pointer">
                            <input type="checkbox" defaultChecked className="rounded border-outline-variant text-primary focus:ring-0" />
                            <span>E-mail ({student.email})</span>
                        </label>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-[#507c94] uppercase tracking-wider mb-2">Template de Mensagem</label>
                    <select className="w-full bg-[#eff8ff] dark:bg-slate-950 border-none rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-primary/20 text-[#003346] dark:text-white outline-none">
                        <option>Aviso Geral de Desempenho Escolar</option>
                        <option>Lembrete de Evento Acadêmico</option>
                        <option>Cobrança de Documentação Pendente</option>
                        <option>Mensagem Personalizada</option>
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-bold text-[#507c94] uppercase tracking-wider mb-2">Mensagem</label>
                    <textarea
                        rows="5"
                        defaultValue={`Olá ${student.name}, estamos entrando em contato para informar que seu boletim escolar correspondente ao 1º semestre de 2024 já está disponível para consulta no portal. Sua média geral foi de 8,3 com 94% de presença.`}
                        className="w-full bg-[#eff8ff] dark:bg-slate-950 border-none rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary/20 text-[#003346] dark:text-white outline-none"
                    />
                </div>

                <button
                    type="submit"
                    className="bg-primary text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-primary/20 active:scale-95 transition-all text-sm flex items-center gap-2"
                >
                    <span className="material-symbols-outlined text-sm">send</span>
                    <span>Enviar Comunicado</span>
                </button>
            </form>
        </div>
    );
}
