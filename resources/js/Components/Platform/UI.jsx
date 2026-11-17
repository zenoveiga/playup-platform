import Modal from '@/Components/Modal';
import { Link } from '@inertiajs/react';
import { useRef } from 'react';

/* Componentes visuais compartilhados do painel do administrador.
 * Reproduzem as classes já usadas nas telas Admin/* para manter a identidade visual. */

export const inputClass =
    'w-full bg-surface dark:bg-slate-950 border-none rounded-xl px-4 py-3 text-sm text-on-surface dark:text-white focus:ring-2 focus:ring-primary outline-none';

export function PageHeader({ breadcrumb, title, subtitle, actions }) {
    return (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
                {breadcrumb && (
                    <div className="flex items-center gap-2 text-[#507c94] dark:text-[#87b3cd] font-bold text-sm mb-2 uppercase tracking-wider font-label">
                        {breadcrumb.map((b, i) => (
                            <span key={i} className="flex items-center gap-2">
                                {i > 0 && <span className="material-symbols-outlined text-xs">chevron_right</span>}
                                {b.href ? (
                                    <Link className="hover:underline" href={b.href}>{b.label}</Link>
                                ) : (
                                    <span className="text-primary dark:text-[#00D1FF]">{b.label}</span>
                                )}
                            </span>
                        ))}
                    </div>
                )}
                <h2 className="text-4xl font-headline font-extrabold text-[#003346] dark:text-white tracking-tight leading-none mb-2">
                    {title}
                </h2>
                {subtitle && <p className="text-[#507c94] dark:text-[#87b3cd] font-medium">{subtitle}</p>}
            </div>
            {actions && <div className="flex items-center gap-3">{actions}</div>}
        </div>
    );
}

export function Card({ icon, iconTone = 'primary', title, description, actions, children, className = '' }) {
    const tones = {
        primary: 'bg-primary-container/20 text-primary dark:text-[#00D1FF]',
        tertiary: 'bg-tertiary-container/20 text-tertiary dark:text-[#6bfe9c]',
        secondary: 'bg-secondary-container/20 text-secondary dark:text-[#80deff]',
        error: 'bg-error-container/20 text-error',
    };
    return (
        <section className={`bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-outline-variant/10 dark:border-slate-800 ${className}`}>
            {(title || actions) && (
                <div className="flex items-start justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                        {icon && (
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${tones[iconTone]}`}>
                                <span className="material-symbols-outlined">{icon}</span>
                            </div>
                        )}
                        <div>
                            <h3 className="font-headline font-bold text-lg text-[#003346] dark:text-white">{title}</h3>
                            {description && <p className="text-xs text-[#507c94] dark:text-[#87b3cd] font-medium">{description}</p>}
                        </div>
                    </div>
                    {actions}
                </div>
            )}
            {children}
        </section>
    );
}

export function Field({ label, error, hint, children, className = '' }) {
    return (
        <div className={`space-y-2 ${className}`}>
            {label && (
                <label className="block text-xs font-bold text-[#507c94] dark:text-[#87b3cd] uppercase tracking-wide">{label}</label>
            )}
            {children}
            {hint && !error && <p className="text-[11px] text-[#507c94]/80 dark:text-[#87b3cd]/80">{hint}</p>}
            {error && <p className="text-xs text-error mt-1">{error}</p>}
        </div>
    );
}

export function PrimaryAction({ children, icon, as = 'button', ...props }) {
    const className =
        'group flex items-center justify-center gap-2 bg-gradient-to-br from-primary to-primary-container text-white px-6 py-3.5 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer disabled:opacity-50';
    if (as === 'link') {
        return (
            <Link className={className} {...props}>
                {icon && <span className="material-symbols-outlined text-lg">{icon}</span>}
                <span>{children}</span>
            </Link>
        );
    }
    return (
        <button className={className} {...props}>
            {icon && <span className="material-symbols-outlined text-lg">{icon}</span>}
            <span>{children}</span>
        </button>
    );
}

export function SecondaryAction({ children, icon, as = 'button', ...props }) {
    const className =
        'flex items-center justify-center gap-2 bg-surface-container-high dark:bg-slate-800 text-primary dark:text-[#00D1FF] px-6 py-3.5 rounded-xl font-bold hover:bg-primary hover:text-white dark:hover:bg-primary transition-all cursor-pointer border border-primary/5 shadow-sm disabled:opacity-50';
    if (as === 'link') {
        return (
            <Link className={className} {...props}>
                {icon && <span className="material-symbols-outlined text-lg">{icon}</span>}
                <span>{children}</span>
            </Link>
        );
    }
    return (
        <button className={className} {...props}>
            {icon && <span className="material-symbols-outlined text-lg">{icon}</span>}
            <span>{children}</span>
        </button>
    );
}

export function IconButton({ icon, title, tone = 'default', ...props }) {
    const tones = {
        default: 'text-[#507c94] hover:text-primary hover:bg-primary/10',
        danger: 'text-[#507c94] hover:text-error hover:bg-error/10',
        success: 'text-[#507c94] hover:text-tertiary hover:bg-tertiary/10',
    };
    return (
        <button type="button" title={title} className={`p-2 rounded-lg transition-colors disabled:opacity-30 ${tones[tone]}`} {...props}>
            <span className="material-symbols-outlined text-lg">{icon}</span>
        </button>
    );
}

const STATUS = {
    active: { label: 'Ativo', className: 'bg-[#cdffd4] text-[#006a35] dark:bg-emerald-950/70 dark:text-emerald-400' },
    inactive: { label: 'Inativo', className: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400' },
    pending: { label: 'Aguardando aprovação', className: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400' },
    blocked: { label: 'Bloqueado', className: 'bg-error/10 text-error' },
    rejected: { label: 'Reprovado', className: 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400' },
    published: { label: 'Publicado', className: 'bg-[#cdffd4] text-[#006a35] dark:bg-emerald-950/70 dark:text-emerald-400' },
    draft: { label: 'Rascunho', className: 'bg-surface-container-high text-[#346178] dark:bg-slate-800 dark:text-[#87b3cd]' },
};

export function StatusBadge({ status }) {
    const s = STATUS[status] ?? { label: status, className: 'bg-slate-100 text-slate-500' };
    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${s.className}`}>
            {s.label}
        </span>
    );
}

export function StatCard({ label, value, icon, tone = 'primary', hint }) {
    const tones = {
        primary: 'text-primary dark:text-[#00D1FF] bg-primary/10',
        tertiary: 'text-tertiary dark:text-[#6bfe9c] bg-tertiary/10',
        error: 'text-error bg-error/10',
        amber: 'text-amber-600 bg-amber-100 dark:bg-amber-950/50',
    };
    return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-outline-variant/10 dark:border-slate-800 space-y-2 shadow-sm">
            <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#87b3cd]">{label}</p>
                {icon && (
                    <span className={`material-symbols-outlined text-lg p-1.5 rounded-lg ${tones[tone]}`}>{icon}</span>
                )}
            </div>
            <div className="flex items-end gap-2">
                <span className="text-3xl font-extrabold text-on-surface dark:text-white">{value}</span>
                {hint && <span className="text-on-surface-variant/60 dark:text-outline-variant/60 text-xs mb-1 font-semibold">{hint}</span>}
            </div>
        </div>
    );
}

export function EmptyState({ icon, title, description, action }) {
    return (
        <div className="flex flex-col items-center justify-center text-center py-16 px-6">
            <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-3xl text-primary dark:text-[#00D1FF]">{icon}</span>
            </div>
            <h4 className="font-headline font-bold text-lg text-[#003346] dark:text-white">{title}</h4>
            {description && <p className="text-sm text-[#507c94] dark:text-[#87b3cd] mt-1 max-w-md">{description}</p>}
            {action && <div className="mt-6">{action}</div>}
        </div>
    );
}

export function DialogShell({ show, onClose, icon, iconTone = 'primary', title, description, children, footer, maxWidth = 'lg' }) {
    const tones = {
        primary: 'bg-primary/10 text-primary',
        error: 'bg-error/10 text-error',
        tertiary: 'bg-tertiary/10 text-tertiary',
    };
    return (
        <Modal show={show} onClose={onClose} maxWidth={maxWidth}>
            <div className="p-8 bg-white dark:bg-slate-900">
                <div className="flex items-start gap-4 mb-6">
                    {icon && (
                        <div className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center ${tones[iconTone]}`}>
                            <span className="material-symbols-outlined">{icon}</span>
                        </div>
                    )}
                    <div>
                        <h3 className="font-headline font-extrabold text-xl text-[#003346] dark:text-white">{title}</h3>
                        {description && <p className="text-sm text-[#507c94] dark:text-[#87b3cd] mt-1">{description}</p>}
                    </div>
                </div>
                {children}
                {footer && <div className="flex justify-end gap-3 mt-8">{footer}</div>}
            </div>
        </Modal>
    );
}

export function GhostButton({ children, ...props }) {
    return (
        <button
            type="button"
            className="px-5 py-3 rounded-xl font-bold text-sm text-[#507c94] hover:bg-surface-container-low dark:hover:bg-slate-800 transition-colors"
            {...props}
        >
            {children}
        </button>
    );
}

export function DangerButton({ children, icon, ...props }) {
    return (
        <button
            className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm bg-error text-white shadow-lg shadow-error/20 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
            {...props}
        >
            {icon && <span className="material-symbols-outlined text-lg">{icon}</span>}
            {children}
        </button>
    );
}

export function formatBytes(bytes) {
    if (!bytes) return '';
    const units = ['B', 'KB', 'MB', 'GB'];
    let i = 0;
    let n = bytes;
    while (n >= 1024 && i < units.length - 1) {
        n /= 1024;
        i++;
    }
    return `${n.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

/**
 * Seletor de arquivo no estilo "drop zone" das telas existentes.
 * Mostra o arquivo novo selecionado ou o arquivo já salvo (existing = {name, url, size}).
 */
export function FileDrop({ accept, file, existing, onChange, label = 'Selecionar arquivo', hint, icon = 'cloud_upload', compact = false }) {
    const ref = useRef(null);
    const current = file
        ? { name: file.name, size: file.size, isNew: true }
        : existing?.name
          ? { name: existing.name, size: existing.size, url: existing.url }
          : null;

    return (
        <div>
            <input
                ref={ref}
                type="file"
                accept={accept}
                className="hidden"
                onChange={(e) => onChange(e.target.files?.[0] ?? null)}
            />
            {current ? (
                <div className="flex items-center gap-3 bg-surface dark:bg-slate-950 rounded-xl px-4 py-3">
                    <span className="material-symbols-outlined text-primary dark:text-[#00D1FF]">
                        {current.isNew ? 'upload_file' : 'task'}
                    </span>
                    <div className="flex-1 min-w-0">
                        {current.url ? (
                            <a href={current.url} target="_blank" rel="noreferrer" className="block text-sm font-bold text-[#003346] dark:text-white truncate hover:underline">
                                {current.name}
                            </a>
                        ) : (
                            <p className="text-sm font-bold text-[#003346] dark:text-white truncate">{current.name}</p>
                        )}
                        <p className="text-[11px] text-[#507c94] dark:text-[#87b3cd]">
                            {formatBytes(current.size)} {current.isNew ? '· será enviado ao salvar' : '· arquivo salvo'}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => ref.current?.click()}
                        className="text-xs font-bold text-primary dark:text-[#00D1FF] hover:underline"
                    >
                        Trocar
                    </button>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={() => ref.current?.click()}
                    className={`w-full border-2 border-dashed border-outline-variant/30 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center hover:bg-surface dark:hover:bg-slate-950 transition-all ${
                        compact ? 'py-4' : 'py-8'
                    }`}
                >
                    <span className="material-symbols-outlined text-3xl text-primary dark:text-[#00D1FF] mb-1">{icon}</span>
                    <span className="text-sm font-bold text-primary dark:text-[#00D1FF]">{label}</span>
                    {hint && <span className="text-[10px] text-[#507c94] dark:text-[#87b3cd] mt-1">{hint}</span>}
                </button>
            )}
        </div>
    );
}

/** Alterna entre duas ou mais opções (segmented control). */
export function Segmented({ value, onChange, options }) {
    return (
        <div className="inline-flex bg-surface dark:bg-slate-950 rounded-xl p-1 gap-1">
            {options.map((o) => (
                <button
                    key={o.value}
                    type="button"
                    onClick={() => onChange(o.value)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        value === o.value
                            ? 'bg-white dark:bg-slate-800 text-primary dark:text-[#00D1FF] shadow-sm'
                            : 'text-[#507c94] dark:text-[#87b3cd] hover:text-primary'
                    }`}
                >
                    {o.icon && <span className="material-symbols-outlined text-sm">{o.icon}</span>}
                    {o.label}
                </button>
            ))}
        </div>
    );
}

/** Coleta erros de validação aninhados (ex.: "exercises.0.statement") para um prefixo. */
export function errorsFor(errors, prefix) {
    return Object.entries(errors)
        .filter(([k]) => k === prefix || k.startsWith(prefix + '.'))
        .map(([, v]) => v);
}

/** Campo de valor em reais. */
export function MoneyInput({ value, onChange, placeholder, className = '' }) {
    return (
        <div className={`relative ${className}`}>
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#507c94] dark:text-[#87b3cd]">R$</span>
            <input
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                value={value ?? ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={`${inputClass} pl-10 py-2.5 text-right tabular-nums`}
            />
        </div>
    );
}
