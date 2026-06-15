import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Login({ status, canResetPassword }) {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Acesse sua Conta" />

            <div className="mb-6 text-center">
                <h2 className="text-2xl font-black text-on-surface font-headline tracking-tight">
                    Acesse sua conta
                </h2>
                <p className="text-sm text-[#507c94] dark:text-[#b5e3ff] mt-1 font-medium">
                    Bem-vindo de volta! Insira suas credenciais para continuar.
                </p>
            </div>

            {status && (
                <div className="mb-4 text-sm font-semibold text-tertiary bg-tertiary-container/30 px-4 py-3 rounded-xl">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                {/* E-mail Field */}
                <div className="space-y-1">
                    <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-[#003346]/70 dark:text-white/75">
                        E-mail
                    </label>
                    <div className="relative flex items-center">
                        <span className="material-symbols-outlined absolute left-3 text-[#507c94] dark:text-[#87b3cd] text-xl pointer-events-none">
                            mail
                        </span>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="w-full bg-surface-container-low dark:bg-slate-900 border border-[#cfecff]/50 dark:border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-on-surface placeholder-[#507c94]/40 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 outline-none"
                            placeholder="exemplo@playup.com"
                            autoComplete="username"
                            required
                            autoFocus
                            onChange={(e) => setData('email', e.target.value)}
                        />
                    </div>
                    <InputError message={errors.email} className="mt-1" />
                </div>

                {/* Senha Field */}
                <div className="space-y-1">
                    <div className="flex justify-between items-center">
                        <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-[#003346]/70 dark:text-white/75">
                            Senha
                        </label>
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-xs text-primary dark:text-[#00D1FF] hover:underline font-bold"
                            >
                                Esqueceu a senha?
                            </Link>
                        )}
                    </div>
                    <div className="relative flex items-center">
                        <span className="material-symbols-outlined absolute left-3 text-[#507c94] dark:text-[#87b3cd] text-xl pointer-events-none">
                            lock
                        </span>
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={data.password}
                            className="w-full bg-surface-container-low dark:bg-slate-900 border border-[#cfecff]/50 dark:border-slate-800 rounded-xl pl-10 pr-10 py-3 text-sm text-on-surface placeholder-[#507c94]/40 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 outline-none"
                            placeholder="Sua senha secreta"
                            autoComplete="current-password"
                            required
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 text-[#507c94] dark:text-[#87b3cd] hover:text-primary transition-colors focus:outline-none"
                        >
                            <span className="material-symbols-outlined text-xl">
                                {showPassword ? 'visibility_off' : 'visibility'}
                            </span>
                        </button>
                    </div>
                    <InputError message={errors.password} className="mt-1" />
                </div>

                {/* Lembrar de mim */}
                <div className="flex items-center">
                    <input
                        id="remember"
                        type="checkbox"
                        name="remember"
                        checked={data.remember}
                        className="h-4.5 w-4.5 rounded border-[#cfecff]/70 dark:border-slate-700 bg-surface-container-low text-primary focus:ring-primary focus:ring-offset-0 transition-colors cursor-pointer"
                        onChange={(e) => setData('remember', e.target.checked)}
                    />
                    <label
                        htmlFor="remember"
                        className="ms-2 text-sm font-semibold text-[#003346]/70 dark:text-white/70 cursor-pointer select-none"
                    >
                        Lembrar de mim
                    </label>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-3.5 kinetic-gradient text-white rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 font-bold hover:opacity-95 active:scale-[0.98] transition-all disabled:opacity-50 select-none"
                    >
                        {processing ? (
                            <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
                        ) : (
                            <>
                                <span>Acessar Painel</span>
                                <span className="material-symbols-outlined text-lg">login</span>
                            </>
                        )}
                    </button>
                </div>
            </form>

            {/* Cadastro Link Footer */}
            <div className="mt-8 pt-4 border-t border-[#cfecff]/30 dark:border-slate-800 text-center text-sm font-semibold text-[#507c94] dark:text-[#b5e3ff]">
                Ainda não tem uma conta?{' '}
                <Link
                    href={route('register')}
                    className="text-primary dark:text-[#00D1FF] hover:underline font-bold"
                >
                    Cadastre-se
                </Link>
            </div>
        </GuestLayout>
    );
}

