import {
    DangerButton,
    DialogShell,
    Field,
    GhostButton,
    IconButton,
    inputClass,
    PageHeader,
    PrimaryAction,
    StatusBadge,
} from '@/Components/Platform/UI';
import PlatformLayout from '@/Layouts/PlatformLayout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

const th = 'px-6 py-4 text-xs font-bold text-on-surface-variant dark:text-outline-variant uppercase tracking-widest border-b border-outline-variant/10 dark:border-slate-800';

export default function UsersIndex({ users }) {
    const { auth } = usePage().props;
    const [editing, setEditing] = useState(null); // null = fechado, {} = novo, user = edição
    const [confirm, setConfirm] = useState(null); // {user, action}

    return (
        <PlatformLayout>
            <Head title="Usuários do Painel Admin" />

            <div className="max-w-6xl mx-auto p-8 space-y-8 animate-in fade-in duration-700">
                <PageHeader
                    breadcrumb={[{ label: 'Administração', href: route('platform.dashboard') }, { label: 'Usuários Admin' }]}
                    title="Usuários do Painel Admin"
                    subtitle="Gerencie quem tem acesso à administração da plataforma"
                    actions={
                        <PrimaryAction icon="person_add" onClick={() => setEditing({})}>
                            Adicionar administrador
                        </PrimaryAction>
                    }
                />

                <div className="bg-white dark:bg-slate-900 rounded-xl border border-outline-variant/15 dark:border-slate-800 shadow-sm overflow-hidden">
                    <table className="w-full text-left border-separate border-spacing-0">
                        <thead>
                            <tr className="bg-surface-container-low/30 dark:bg-slate-950/40">
                                <th className={th}>Nome</th>
                                <th className={th}>Telefone</th>
                                <th className={th}>Desde</th>
                                <th className={th}>Situação</th>
                                <th className={`${th} text-right`}>Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/10 dark:divide-slate-800">
                            {users.map((u) => {
                                const isSelf = u.id === auth.user.id;
                                return (
                                    <tr key={u.id} className="hover:bg-surface-container-low/30 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl kinetic-gradient text-white flex items-center justify-center font-black text-sm">
                                                    {u.name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm text-[#003346] dark:text-white">
                                                        {u.name} {isSelf && <span className="text-[10px] text-primary font-black uppercase ml-1">(você)</span>}
                                                    </p>
                                                    <p className="text-xs text-[#507c94] dark:text-[#87b3cd]">{u.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-[#507c94] dark:text-[#87b3cd]">{u.phone || '—'}</td>
                                        <td className="px-6 py-4 text-sm text-[#507c94] dark:text-[#87b3cd]">{new Date(u.created_at).toLocaleDateString('pt-BR')}</td>
                                        <td className="px-6 py-4"><StatusBadge status={u.status} /></td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-1">
                                                <IconButton icon="edit" title="Editar" onClick={() => setEditing(u)} />
                                                {u.status === 'blocked' ? (
                                                    <IconButton
                                                        icon="lock_open"
                                                        title="Desbloquear"
                                                        tone="success"
                                                        onClick={() => router.post(route('platform.users.unblock', u.id), {}, { preserveScroll: true })}
                                                    />
                                                ) : (
                                                    <IconButton icon="block" title="Bloquear" tone="danger" disabled={isSelf} onClick={() => setConfirm({ user: u, action: 'block' })} />
                                                )}
                                                <IconButton icon="delete" title="Remover" tone="danger" disabled={isSelf} onClick={() => setConfirm({ user: u, action: 'delete' })} />
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <UserDialog user={editing} onClose={() => setEditing(null)} />

            <DialogShell
                show={!!confirm}
                onClose={() => setConfirm(null)}
                icon={confirm?.action === 'delete' ? 'delete' : 'block'}
                iconTone="error"
                title={confirm?.action === 'delete' ? `Remover ${confirm?.user.name}?` : `Bloquear ${confirm?.user.name}?`}
                description={
                    confirm?.action === 'delete'
                        ? 'O usuário perde o acesso e é removido permanentemente.'
                        : 'O usuário perde o acesso ao painel até ser desbloqueado.'
                }
                footer={
                    <>
                        <GhostButton onClick={() => setConfirm(null)}>Cancelar</GhostButton>
                        <DangerButton
                            onClick={() => {
                                const { user, action } = confirm;
                                const opts = { preserveScroll: true, onFinish: () => setConfirm(null) };
                                action === 'delete'
                                    ? router.delete(route('platform.users.destroy', user.id), opts)
                                    : router.post(route('platform.users.block', user.id), {}, opts);
                            }}
                        >
                            Confirmar
                        </DangerButton>
                    </>
                }
            />
        </PlatformLayout>
    );
}

function UserDialog({ user, onClose }) {
    const isEdit = !!user?.id;
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
    });
    const [loadedFor, setLoadedFor] = useState(undefined);

    if (user && loadedFor !== (user.id ?? 'new')) {
        setLoadedFor(user.id ?? 'new');
        setData({ name: user.name ?? '', email: user.email ?? '', phone: user.phone ?? '', password: '', password_confirmation: '' });
        clearErrors();
    }

    const close = () => {
        onClose();
        reset();
        setLoadedFor(undefined);
    };

    const submit = (e) => {
        e.preventDefault();
        const opts = { preserveScroll: true, onSuccess: close };
        isEdit ? put(route('platform.users.update', user.id), opts) : post(route('platform.users.store'), opts);
    };

    return (
        <DialogShell
            show={!!user}
            onClose={close}
            icon={isEdit ? 'manage_accounts' : 'person_add'}
            title={isEdit ? 'Editar administrador' : 'Adicionar administrador'}
            description={isEdit ? 'Deixe a senha em branco para mantê-la.' : 'O novo usuário poderá entrar em /administrador/login.'}
        >
            <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field label="Nome *" error={errors.name} className="md:col-span-2">
                    <input className={inputClass} value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                </Field>
                <Field label="E-mail *" error={errors.email}>
                    <input type="email" className={inputClass} value={data.email} onChange={(e) => setData('email', e.target.value)} required />
                </Field>
                <Field label="Telefone" error={errors.phone}>
                    <input className={inputClass} value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
                </Field>
                <Field label={isEdit ? 'Nova senha' : 'Senha *'} error={errors.password}>
                    <input type="password" className={inputClass} value={data.password} onChange={(e) => setData('password', e.target.value)} required={!isEdit} autoComplete="new-password" />
                </Field>
                <Field label="Confirmar senha" error={errors.password_confirmation}>
                    <input type="password" className={inputClass} value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} required={!isEdit} autoComplete="new-password" />
                </Field>
                <div className="md:col-span-2 flex justify-end gap-3 pt-2">
                    <GhostButton onClick={close}>Cancelar</GhostButton>
                    <PrimaryAction type="submit" icon="save" disabled={processing}>
                        Salvar
                    </PrimaryAction>
                </div>
            </form>
        </DialogShell>
    );
}
