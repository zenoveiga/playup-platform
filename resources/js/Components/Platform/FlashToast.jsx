import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

/* Aviso flutuante para mensagens de sucesso/erro enviadas pelo servidor (flash). */
export default function FlashToast() {
    const { flash } = usePage().props;
    const [toast, setToast] = useState(null);

    useEffect(() => {
        if (flash?.success) setToast({ type: 'success', message: flash.success });
        else if (flash?.error) setToast({ type: 'error', message: flash.error });
    }, [flash]);

    useEffect(() => {
        if (!toast) return;
        const t = setTimeout(() => setToast(null), 4000);
        return () => clearTimeout(t);
    }, [toast]);

    if (!toast) return null;

    const isError = toast.type === 'error';

    return (
        <div className="fixed bottom-6 right-6 z-[60] animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div
                className={`flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border ${
                    isError
                        ? 'bg-white dark:bg-slate-900 border-error/20 text-error'
                        : 'bg-white dark:bg-slate-900 border-tertiary/20 text-tertiary dark:text-[#6bfe9c]'
                }`}
            >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {isError ? 'error' : 'check_circle'}
                </span>
                <span className="text-sm font-bold text-[#003346] dark:text-white">{toast.message}</span>
                <button onClick={() => setToast(null)} className="ml-2 text-[#507c94] hover:text-primary">
                    <span className="material-symbols-outlined text-base">close</span>
                </button>
            </div>
        </div>
    );
}
