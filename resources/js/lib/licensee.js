import AdminLayout from '@/Layouts/AdminLayout';
import SchoolAdminLayout from '@/Layouts/SchoolAdminLayout';
import { usePage } from '@inertiajs/react';

/** Layout e rotas do painel do licenciado (grupos /admin e /school-admin). */
export function useLicensee() {
    const { auth } = usePage().props;
    const isSchoolAdmin = auth.user.role === 'school_admin';
    const prefix = isSchoolAdmin ? 'school-admin.' : 'admin.';

    return {
        Layout: isSchoolAdmin ? SchoolAdminLayout : AdminLayout,
        r: (name, params) => route(prefix + name, params),
    };
}

const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export const brl = (value) => (value === null || value === undefined || value === '' ? '—' : BRL.format(Number(value)));

export const installmentText = (price, max) =>
    max > 1 && price ? `ou ${max}x de ${brl(Number(price) / max)}` : 'à vista';

export const formatDate = (date) => (date ? new Date(`${String(date).slice(0, 10)}T00:00:00`).toLocaleDateString('pt-BR') : '');

export const CAMPAIGN_STATUS = {
    scheduled: { label: 'Agendada', className: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400' },
    active: { label: 'Em andamento', className: 'bg-[#cdffd4] text-[#006a35] dark:bg-emerald-950/70 dark:text-emerald-400' },
    ended: { label: 'Encerrada', className: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400' },
};

export const SALE_STATUS = {
    paid: { label: 'Paga', className: 'bg-[#cdffd4] text-[#006a35] dark:bg-emerald-950/70 dark:text-emerald-400' },
    pending: { label: 'Aguardando pagamento', className: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400' },
    canceled: { label: 'Cancelada', className: 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400' },
};

export const ACCESS_STATUS = {
    active: { label: 'Acesso liberado', className: 'text-tertiary' },
    scheduled: { label: 'Acesso agendado', className: 'text-amber-600' },
    expired: { label: 'Acesso encerrado', className: 'text-slate-500' },
    canceled: { label: 'Acesso revogado', className: 'text-error' },
};

/** Duração legível: 45s, 12min, 1h 05min. */
export const formatDuration = (seconds) => {
    const s = Math.max(0, Math.round(Number(seconds) || 0));
    if (s < 60) return `${s}s`;
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    return h ? `${h}h ${String(m).padStart(2, '0')}min` : `${m}min`;
};

/** Data e hora curtas (ex.: 18/11, 14:32), ou "—". */
export const formatDateTime = (value) =>
    value ? new Date(String(value).replace(' ', 'T')).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' }) : '—';

export const LESSON_TYPES = {
    video: { label: 'Vídeo', icon: 'play_circle', className: 'bg-primary/10 text-primary dark:text-[#00D1FF]' },
    application: { label: 'Aplicação', icon: 'construction', className: 'bg-amber-100 text-amber-700' },
    exercise_set: { label: 'Exercício', icon: 'quiz', className: 'bg-tertiary/10 text-tertiary' },
};
