import {
    DangerButton,
    DialogShell,
    EmptyState,
    Field,
    GhostButton,
    IconButton,
    inputClass,
    PageHeader,
    StatCard,
    StatusBadge,
} from '@/Components/Platform/UI';
import PlatformLayout from '@/Layouts/PlatformLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';

const TABS = [
    { key: 'all', label: 'Todos' },
    { key: 'pending', label: 'Pendentes' },
    { key: 'active', label: 'Ativos' },
    { key: 'blocked', label: 'Bloqueados' },
    { key: 'rejected', label: 'Reprovados' },
];

const th = 'px-6 py-4 text-xs font-bold text-on-surface-variant dark:text-outline-variant uppercase tracking-widest border-b border-outline-variant/10 dark:border-slate-800';

export default function LicenseesIndex({ licensees }) {
    const [tab, setTab] = useState(licensees.some((l) => l.status === 'pending') ? 'pending' : 'all');
    const [search, setSearch] = useState('');
    const [blocking, setBlocking] = useState(null);
    const [rejecting, setRejecting] = useState(null);

    const counts = useMemo(() => {
        const c = { all: licensees.length };
        licensees.forEach((l) => (c[l.status] = (c[l.status] ?? 0) + 1));
        return c;
    }, [licensees]);

    const filtered = licensees.filter((l) => {
        if (tab !== 'all' && l.status !== tab) return false;
        const q = search.trim().toLowerCase();
        return !q || l.name.toLowerCase().includes(q) || l.email.toLowerCase().includes(q);
    });

    const post = (name, id) => router.post(route(name, id), {}, { preserveScroll: true });

    return (
        <PlatformLayout>
            <Head title="Licenciados" />

            <div className="max-w-7xl mx-auto p-8 space-y-8 animate-in fade-in duration-700">
                <PageHeader
                    breadcrumb={[{ label: 'Administração', href: route('platform.dashboard') }, { label: 'Licenciados' }]}
                    title="Licenciados"
                    subtitle="Aprove novos cadastros e controle o acesso de licenciados e de seus alunos"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard label="Aguardando aprovação" value={counts.pending ?? 0} icon="hourglass_top" tone="amber" />
                    <StatCard label="Ativos" value={counts.active ?? 0} icon="verified" tone="tertiary" />
                    <StatCard label="Bloqueados" value={counts.blocked ?? 0} icon="block" tone="error" />
                    <StatCard label="Total" value={counts.all} icon="storefront" />
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-xl border border-outline-variant/15 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-outline-variant/10 dark:border-slate-800">
                        <div className="flex items-center gap-2 flex-wrap">
                            {TABS.map((t) => (
                                <button
                                    key={t.key}
                                    onClick={() => setTab(t.key)}
                                    className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-all ${
                                        tab === t.key
                                            ? 'bg-surface-container-low dark:bg-slate-800 text-primary dark:text-[#00D1FF]'
                                            : 'text-on-surface-variant dark:text-outline-variant hover:bg-surface-container-low/50'
                                    }`}
                                >
                                    {t.label}
                                    {(counts[t.key] ?? 0) > 0 && (
                                        <span className={`px-2 rounded-full text-xs ${t.key === 'pending' ? 'bg-amber-200 text-amber-800' : 'bg-primary/10'}`}>
                                            {counts[t.key]}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                        <div className="relative w-full sm:w-72">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-base">search</span>
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-surface-container-lowest dark:bg-slate-950 border border-outline-variant/20 dark:border-slate-800 rounded-full py-2 pl-10 pr-4 text-xs text-on-surface dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-on-surface-variant/50"
                                placeholder="Pesquisar por nome ou e-mail..."
                            />
                        </div>
                    </div>

                    {filtered.length === 0 ? (
                        <EmptyState icon="storefront" title="Nenhum licenciado encontrado" description="Ajuste os filtros ou aguarde novos cadastros." />
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-separate border-spacing-0">
                                <thead>
                                    <tr className="bg-surface-container-low/30 dark:bg-slate-950/40">
                                        <th className={th}>Licenciado</th>
                                        <th className={th}>Cadastro</th>
                                        <th className={th}>Alunos</th>
                                        <th className={th}>Situação</th>
                                        <th className={`${th} text-right`}>Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-outline-variant/10 dark:divide-slate-800">
                                    {filtered.map((l) => (
                                        <tr key={l.id} className="hover:bg-surface-container-low/30 dark:hover:bg-slate-800/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary dark:text-[#00D1FF] flex items-center justify-center font-black text-sm">
                                                        {l.name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-sm text-[#003346] dark:text-white">{l.name}</p>
                                                        <p className="text-xs text-[#507c94] dark:text-[#87b3cd]">
                                                            {l.email}
                                                            {l.phone ? ` · ${l.phone}` : ''}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-xs text-[#507c94] dark:text-[#87b3cd]">
                                                {new Date(l.created_at).toLocaleDateString('pt-BR')}
                                                {l.approved_at && (
                                                    <span className="block">
                                                        Aprovado em {new Date(l.approved_at).toLocaleDateString('pt-BR')}
                                                        {l.approver ? ` por ${l.approver.name}` : ''}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-bold text-[#003346] dark:text-white">
                                                {l.students_count}
                                                {l.blocked_students_count > 0 && (
                                                    <span className="block text-[10px] font-bold text-error">{l.blocked_students_count} bloqueados em cascata</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <StatusBadge status={l.status} />
                                                {l.status === 'blocked' && (
                                                    <p className="text-[10px] text-[#507c94] mt-1 max-w-[200px]">
                                                        {l.block_extends_to_students ? 'Bloqueio estendido aos alunos' : 'Alunos mantêm acesso'}
                                                        {l.blocked_reason ? ` · ${l.blocked_reason}` : ''}
                                                    </p>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-1">
                                                    {(l.status === 'pending' || l.status === 'rejected') && (
                                                        <button
                                                            onClick={() => post('platform.licensees.approve', l.id)}
                                                            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-[#cdffd4] text-[#006a35] text-xs font-black hover:opacity-90 transition"
                                                        >
                                                            <span className="material-symbols-outlined text-base">check</span>
                                                            Aprovar
                                                        </button>
                                                    )}
                                                    {l.status === 'pending' && (
                                                        <IconButton icon="thumb_down" title="Reprovar cadastro" tone="danger" onClick={() => setRejecting(l)} />
                                                    )}
                                                    {(l.status === 'active' || l.status === 'inactive') && (
                                                        <IconButton icon="block" title="Bloquear acesso" tone="danger" onClick={() => setBlocking(l)} />
                                                    )}
                                                    {l.status === 'blocked' && (
                                                        <>
                                                            <IconButton icon="edit" title="Alterar bloqueio" onClick={() => setBlocking(l)} />
                                                            <button
                                                                onClick={() => post('platform.licensees.unblock', l.id)}
                                                                className="flex items-center gap-1 px-3 py-2 rounded-xl bg-surface-container-high text-primary text-xs font-black hover:bg-primary hover:text-white transition"
                                                            >
                                                                <span className="material-symbols-outlined text-base">lock_open</span>
                                                                Desbloquear
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            <BlockDialog licensee={blocking} onClose={() => setBlocking(null)} />
            <RejectDialog licensee={rejecting} onClose={() => setRejecting(null)} />
        </PlatformLayout>
    );
}

function BlockDialog({ licensee, onClose }) {
    const { data, setData, post, processing, reset } = useForm({ reason: '', extend_to_students: false });
    const [lastId, setLastId] = useState(null);

    if (licensee && licensee.id !== lastId) {
        setLastId(licensee.id);
        setData({ reason: licensee.blocked_reason ?? '', extend_to_students: !!licensee.block_extends_to_students });
    }

    const close = () => {
        onClose();
        reset();
        setLastId(null);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('platform.licensees.block', licensee.id), { preserveScroll: true, onSuccess: close });
    };

    return (
        <DialogShell
            show={!!licensee}
            onClose={close}
            icon="block"
            iconTone="error"
            title={`Bloquear ${licensee?.name ?? ''}`}
            description="O licenciado perde o acesso imediatamente, inclusive sessões abertas."
        >
            <form onSubmit={submit} className="space-y-5">
                <Field label="Motivo (opcional)">
                    <textarea
                        rows="3"
                        value={data.reason}
                        onChange={(e) => setData('reason', e.target.value)}
                        className={`${inputClass} resize-none`}
                        placeholder="Ex.: pendência contratual"
                    />
                </Field>

                <label className="flex items-start gap-3 p-4 rounded-2xl bg-error/5 border border-error/10 cursor-pointer select-none">
                    <input
                        type="checkbox"
                        checked={data.extend_to_students}
                        onChange={(e) => setData('extend_to_students', e.target.checked)}
                        className="mt-0.5 h-5 w-5 rounded border-outline-variant text-error focus:ring-error"
                    />
                    <span>
                        <span className="block text-sm font-bold text-[#003346] dark:text-white">Estender o bloqueio aos alunos deste licenciado</span>
                        <span className="block text-xs text-[#507c94] dark:text-[#87b3cd] mt-0.5">
                            {licensee?.students_count ?? 0} aluno(s) vinculado(s) também perderão o acesso. Ao desbloquear, o acesso deles é restaurado automaticamente.
                        </span>
                    </span>
                </label>

                <div className="flex justify-end gap-3 pt-2">
                    <GhostButton onClick={close}>Cancelar</GhostButton>
                    <DangerButton type="submit" icon="block" disabled={processing}>
                        Confirmar bloqueio
                    </DangerButton>
                </div>
            </form>
        </DialogShell>
    );
}

function RejectDialog({ licensee, onClose }) {
    const { data, setData, post, processing, reset } = useForm({ reason: '' });

    const close = () => {
        onClose();
        reset();
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('platform.licensees.reject', licensee.id), { preserveScroll: true, onSuccess: close });
    };

    return (
        <DialogShell
            show={!!licensee}
            onClose={close}
            icon="thumb_down"
            iconTone="error"
            title={`Reprovar cadastro de ${licensee?.name ?? ''}`}
            description="O cadastro fica registrado como reprovado e poderá ser aprovado depois, se necessário."
        >
            <form onSubmit={submit} className="space-y-5">
                <Field label="Motivo (opcional)">
                    <textarea rows="3" value={data.reason} onChange={(e) => setData('reason', e.target.value)} className={`${inputClass} resize-none`} />
                </Field>
                <div className="flex justify-end gap-3">
                    <GhostButton onClick={close}>Cancelar</GhostButton>
                    <DangerButton type="submit" disabled={processing}>Reprovar</DangerButton>
                </div>
            </form>
        </DialogShell>
    );
}
