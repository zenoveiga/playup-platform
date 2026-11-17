import { IconButton } from '@/Components/Platform/UI';
import { orderByOutline } from '@/lib/outline';
import { useState } from 'react';

/*
 * Define a sequência em que o aluno vê vídeos, aplicação, materiais e exercícios.
 * items: [{ token, icon, label, sub }]; order: tokens na ordem escolhida.
 * Arraste as linhas ou use as setas.
 */
const TONES = {
    video: 'bg-primary/10 text-primary dark:text-[#00D1FF]',
    material: 'bg-primary/10 text-primary dark:text-[#00D1FF]',
    set: 'bg-tertiary/10 text-tertiary',
    application: 'bg-amber-100 text-amber-700',
    support: 'bg-secondary/10 text-secondary',
};

export default function LessonOrder({ items, order, onChange }) {
    const ordered = orderByOutline(items, order);
    const [dragging, setDragging] = useState(null);
    const [over, setOver] = useState(null);

    const commit = (list) => onChange(list.map((i) => i.token));
    const move = (from, to) => {
        if (to < 0 || to >= ordered.length || from === to) return;
        const copy = [...ordered];
        const [item] = copy.splice(from, 1);
        copy.splice(to, 0, item);
        commit(copy);
    };

    if (!ordered.length) {
        return <p className="text-sm text-[#507c94] dark:text-[#87b3cd] text-center py-4">Adicione vídeos, materiais ou exercícios para definir a ordem das aulas.</p>;
    }

    return (
        <div className="space-y-3">
            <ol className="space-y-2">
                {ordered.map((item, i) => {
                    const type = item.token.split(':')[0];
                    return (
                        <li
                            key={item.token}
                            draggable
                            onDragStart={(e) => {
                                setDragging(i);
                                e.dataTransfer.effectAllowed = 'move';
                            }}
                            onDragOver={(e) => {
                                e.preventDefault();
                                setOver(i);
                            }}
                            onDragLeave={() => setOver((o) => (o === i ? null : o))}
                            onDrop={(e) => {
                                e.preventDefault();
                                if (dragging !== null) move(dragging, i);
                                setDragging(null);
                                setOver(null);
                            }}
                            onDragEnd={() => {
                                setDragging(null);
                                setOver(null);
                            }}
                            className={`flex items-center gap-3 rounded-2xl bg-surface/60 dark:bg-slate-950/60 px-3 py-2.5 border-2 transition-all ${
                                over === i && dragging !== i ? 'border-primary/50' : 'border-transparent'
                            } ${dragging === i ? 'opacity-40' : ''}`}
                        >
                            <span className="material-symbols-outlined text-[#507c94] cursor-grab active:cursor-grabbing" title="Arraste para reordenar">drag_indicator</span>
                            <span className="w-6 text-xs font-black text-[#507c94] tabular-nums">{i + 1}</span>
                            <span className={`w-9 h-9 shrink-0 rounded-xl flex items-center justify-center ${TONES[type] ?? TONES.video}`}>
                                <span className="material-symbols-outlined text-lg">{item.icon}</span>
                            </span>
                            <span className="flex-1 min-w-0">
                                <span className="block text-sm font-bold text-[#003346] dark:text-white truncate">{item.label}</span>
                                {item.sub && <span className="block text-[11px] text-[#507c94] truncate">{item.sub}</span>}
                            </span>
                            <IconButton icon="arrow_upward" title="Subir" onClick={() => move(i, i - 1)} disabled={i === 0} />
                            <IconButton icon="arrow_downward" title="Descer" onClick={() => move(i, i + 1)} disabled={i === ordered.length - 1} />
                        </li>
                    );
                })}
            </ol>
            <p className="text-[11px] text-[#507c94] dark:text-[#87b3cd]">Arraste as linhas ou use as setas. É nesta sequência que o aluno verá as aulas.</p>
        </div>
    );
}
