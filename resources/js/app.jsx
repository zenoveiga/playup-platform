import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Ícones são texto ("menu", "skip_next"...) desenhado pela fonte Material Symbols.
// Se o aluno traduzir a página mesmo assim, o tradutor não deve mexer neles.
const protectIcons = (root) =>
    root.querySelectorAll?.('.material-symbols-outlined:not([translate])').forEach((el) => {
        el.setAttribute('translate', 'no');
        el.classList.add('notranslate');
    });
new MutationObserver((records) => records.forEach((r) => r.addedNodes.forEach((n) => n.nodeType === 1 && (protectIcons(n), n.matches?.('.material-symbols-outlined') && protectIcons(n.parentElement))))).observe(document.documentElement, { childList: true, subtree: true });

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});
