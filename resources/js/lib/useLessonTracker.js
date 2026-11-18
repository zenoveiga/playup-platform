import { useCallback, useEffect, useRef } from 'react';

/*
 * Mede o engajamento do aluno na aula aberta e envia ao servidor:
 * - tempo ativo: só conta com a aba visível e o aluno interagindo (ou com o vídeo tocando);
 * - vídeo assistido: segundos reproduzidos de fato (pulos para frente não contam).
 * Envia a cada 15 s, ao trocar de aula e ao sair/esconder a página (keepalive).
 */

const FLUSH_EVERY = 15; // segundos
const IDLE_AFTER = 5 * 60 * 1000; // sem interação por 5 min = ausente

const xsrf = () => decodeURIComponent(document.cookie.split('; ').find((c) => c.startsWith('XSRF-TOKEN='))?.split('=')[1] ?? '');

export function postProgress(courseSlug, payload, { keepalive = false } = {}) {
    return fetch(route('student.progress.track', courseSlug), {
        method: 'POST',
        keepalive,
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-XSRF-TOKEN': xsrf(),
        },
        body: JSON.stringify(payload),
    })
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null);
}

/**
 * @param {string} courseSlug
 * @param {{type: string, id: number} | null} track  aula atual
 * @param {(result: object) => void} onResult  resposta do servidor (ex.: aula concluída)
 */
export default function useLessonTracker(courseSlug, track, onResult) {
    const acc = useRef({ seconds: 0, watched: 0 });
    const media = useRef({ time: null, duration: null, playing: false });
    const lastActivity = useRef(Date.now());
    const current = useRef(null);
    const onResultRef = useRef(onResult);
    onResultRef.current = onResult;

    const flush = useCallback(
        (extra = {}, keepalive = false) => {
            const t = current.current;
            if (!t) return;
            const seconds = Math.round(acc.current.seconds);
            const watched = Math.round(acc.current.watched);
            if (!seconds && !watched && !extra.open && !extra.complete) return;
            acc.current = { seconds: 0, watched: 0 };
            const { time, duration } = media.current;
            postProgress(
                courseSlug,
                {
                    lesson_type: t.type,
                    lesson_id: t.id,
                    seconds,
                    watched,
                    ...(t.type === 'video' && duration ? { duration, position: time ?? 0 } : {}),
                    ...extra,
                },
                { keepalive },
            ).then((data) => data && onResultRef.current?.(data));
        },
        [courseSlug],
    );

    // Troca de aula: fecha a anterior e registra a abertura da nova.
    const key = track ? `${track.type}:${track.id}` : null;
    useEffect(() => {
        current.current = track;
        acc.current = { seconds: 0, watched: 0 };
        media.current = { time: null, duration: null, playing: false };
        if (track) flush({ open: true });
        return () => flush({}, true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key, flush]);

    // Relógio do tempo ativo + envios periódicos.
    useEffect(() => {
        const touch = () => (lastActivity.current = Date.now());
        const events = ['mousemove', 'keydown', 'scroll', 'click', 'touchstart'];
        events.forEach((e) => window.addEventListener(e, touch, { passive: true }));

        let ticks = 0;
        const timer = setInterval(() => {
            const visible = document.visibilityState === 'visible';
            const active = media.current.playing || Date.now() - lastActivity.current < IDLE_AFTER;
            if (visible && active && current.current) acc.current.seconds += 1;
            if (++ticks % FLUSH_EVERY === 0) flush();
        }, 1000);

        const onHide = () => document.visibilityState === 'hidden' && flush({}, true);
        const onLeave = () => flush({}, true);
        document.addEventListener('visibilitychange', onHide);
        window.addEventListener('pagehide', onLeave);

        return () => {
            clearInterval(timer);
            events.forEach((e) => window.removeEventListener(e, touch));
            document.removeEventListener('visibilitychange', onHide);
            window.removeEventListener('pagehide', onLeave);
        };
    }, [flush]);

    /** Tempo atual do vídeo: acumula só avanços contínuos (reprodução), não pulos. */
    const onMediaTime = useCallback((time, duration) => {
        const m = media.current;
        if (duration) m.duration = duration;
        if (m.playing && m.time !== null) {
            const delta = time - m.time;
            if (delta > 0 && delta < 3) acc.current.watched += delta;
        }
        m.time = time;
    }, []);

    const onPlayState = useCallback((paused) => {
        media.current.playing = !paused;
        if (!paused) lastActivity.current = Date.now();
    }, []);

    const complete = useCallback(() => flush({ complete: true }), [flush]);

    return { onMediaTime, onPlayState, complete };
}
