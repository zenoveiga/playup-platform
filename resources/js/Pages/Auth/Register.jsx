import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Crie sua Conta" />

            <div className="mb-6 text-center">
                <h2 className="text-2xl font-black text-on-surface font-headline tracking-tight">
                    Crie sua conta
                </h2>
                <p className="text-sm text-[#507c94] dark:text-[#b5e3ff] mt-1 font-medium">
                    Preencha os campos abaixo para iniciar sua jornada na PlayUp.
                </p>
            </div>

            <form onSubmit={submit} className="space-y-4">
                {/* Nome Field */}
                <div className="space-y-1">
                    <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-[#003346]/70 dark:text-white/75">
                        Nome Completo
                    </label>
                    <div className="relative flex items-center">
                        <span className="material-symbols-outlined absolute left-3 text-[#507c94] dark:text-[#87b3cd] text-xl pointer-events-none">
                            person
                        </span>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            value={data.name}
                            className="w-full bg-surface-container-low dark:bg-slate-900 border border-[#cfecff]/50 dark:border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-on-surface placeholder-[#507c94]/40 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 outline-none"
                            placeholder="Seu nome"
                            autoComplete="name"
                            required
                            autoFocus
                            onChange={(e) => setData('name', e.target.value)}
                        />
                    </div>
                    <InputError message={errors.name} className="mt-1" />
                </div>

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
                            onChange={(e) => setData('email', e.target.value)}
                        />
                    </div>
                    <InputError message={errors.email} className="mt-1" />
                </div>

                {/* Senha Field */}
                <div className="space-y-1">
                    <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-[#003346]/70 dark:text-white/75">
                        Senha
                    </label>
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
                            placeholder="Mínimo 8 caracteres"
                            autoComplete="new-password"
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

                {/* Confirmar Senha Field */}
                <div className="space-y-1">
                    <label htmlFor="password_confirmation" className="block text-xs font-bold uppercase tracking-wider text-[#003346]/70 dark:text-white/75">
                        Confirmar Senha
                    </label>
                    <div className="relative flex items-center">
                        <span className="material-symbols-outlined absolute left-3 text-[#507c94] dark:text-[#87b3cd] text-xl pointer-events-none">
                            lock
                        </span>
                        <input
                            id="password_confirmation"
                            type={showPasswordConfirm ? 'text' : 'password'}
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="w-full bg-surface-container-low dark:bg-slate-900 border border-[#cfecff]/50 dark:border-slate-800 rounded-xl pl-10 pr-10 py-3 text-sm text-on-surface placeholder-[#507c94]/40 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 outline-none"
                            placeholder="Repita sua senha"
                            autoComplete="new-password"
                            required
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                            className="absolute right-3 text-[#507c94] dark:text-[#87b3cd] hover:text-primary transition-colors focus:outline-none"
                        >
                            <span className="material-symbols-outlined text-xl">
                                {showPasswordConfirm ? 'visibility_off' : 'visibility'}
                            </span>
                        </button>
                    </div>
                    <InputError message={errors.password_confirmation} className="mt-1" />
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-3.5 kinetic-gradient text-white rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 font-bold hover:opacity-95 active:scale-[0.98] transition-all disabled:opacity-50 select-none"
                    >
                        {processing ? (
                            <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
                        ) : (
                            <>
                                <span>Cadastrar Conta</span>
                                <span className="material-symbols-outlined text-lg">person_add</span>
                            </>
                        )}
                    </button>
                </div>
            </form>

            {/* Login Link Footer */}
            <div className="mt-8 pt-4 border-t border-[#cfecff]/30 dark:border-slate-800 text-center text-sm font-semibold text-[#507c94] dark:text-[#b5e3ff]">
                Já tem uma conta?{' '}
                <Link
                    href={route('login')}
                    className="text-primary dark:text-[#00D1FF] hover:underline font-bold"
                >
                    Faça login
                </Link>
            </div>
        </GuestLayout>
    );
}

