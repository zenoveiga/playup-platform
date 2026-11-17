import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from 'react';

/*
 * Player de vídeo com controle de tempo, para as anotações.
 * Suporta arquivo enviado (HTML5), YouTube e Vimeo (via postMessage, sem scripts externos).
 * Expõe: getTime(), seek(segundos), pause(), play(), controllable.
 * Avisa o componente pai do tempo atual (onTime) e de play/pausa (onPlayState).
 */

export function parseEmbed(url) {
    if (!url) return null;
    const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/);
    if (yt) return { provider: 'youtube', id: yt[1] };
    const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (vimeo) return { provider: 'vimeo', id: vimeo[1] };
    return null;
}

const VideoPlayer = forwardRef(function VideoPlayer({ video, onTime, onPlayState }, ref) {
    const videoRef = useRef(null);
    const iframeRef = useRef(null);
    const timeRef = useRef(0);
    // Callbacks em ref para não reinstalar listeners a cada render do pai.
    const onTimeRef = useRef(onTime);
    const onPlayStateRef = useRef(onPlayState);
    onTimeRef.current = onTime;
    onPlayStateRef.current = onPlayState;
    const reportTime = (t) => {
        timeRef.current = t;
        onTimeRef.current?.(t);
    };
    const reportPaused = (paused) => onPlayStateRef.current?.(paused);
    const embed = video.file_url ? null : parseEmbed(video.url);
    const origin = typeof window !== 'undefined' ? window.location.origin : '';

    const post = useCallback((message) => {
        iframeRef.current?.contentWindow?.postMessage(typeof message === 'string' ? message : JSON.stringify(message), '*');
    }, []);

    // Acompanha o tempo atual dos players incorporados.
    useEffect(() => {
        reportTime(0);
        reportPaused(true);
        if (!embed) return undefined;

        const onMessage = (event) => {
            if (event.source !== iframeRef.current?.contentWindow) return;
            let data = event.data;
            if (typeof data === 'string') {
                try {
                    data = JSON.parse(data);
                } catch {
                    return;
                }
            }
            if (embed.provider === 'youtube' && data?.info) {
                if (typeof data.info.currentTime === 'number') reportTime(data.info.currentTime);
                // playerState: 1 = tocando, 2 = pausado, 0 = terminou
                if (typeof data.info.playerState === 'number') reportPaused(data.info.playerState !== 1 && data.info.playerState !== 3);
            }
            if (embed.provider === 'vimeo') {
                if (data?.event === 'ready') subscribeVimeo();
                if (data?.event === 'timeupdate' && data.data) reportTime(data.data.seconds);
                if (data?.event === 'play') reportPaused(false);
                if (data?.event === 'pause' || data?.event === 'ended') reportPaused(true);
            }
        };
        window.addEventListener('message', onMessage);
        return () => window.removeEventListener('message', onMessage);
    }, [embed?.provider, embed?.id, post]);

    const subscribeVimeo = () => ['timeupdate', 'play', 'pause', 'ended'].forEach((value) => post({ method: 'addEventListener', value }));

    const onIframeLoad = () => {
        if (embed?.provider === 'youtube') post({ event: 'listening', id: 'playup', channel: 'widget' });
        if (embed?.provider === 'vimeo') subscribeVimeo();
    };

    useImperativeHandle(
        ref,
        () => ({
            controllable: !!(video.file_url || embed),
            getTime: () => (videoRef.current ? videoRef.current.currentTime : timeRef.current) || 0,
            seek: (seconds) => {
                if (videoRef.current) {
                    videoRef.current.currentTime = seconds;
                    videoRef.current.play().catch(() => {});
                } else if (embed?.provider === 'youtube') {
                    post({ event: 'command', func: 'seekTo', args: [seconds, true] });
                    post({ event: 'command', func: 'playVideo', args: [] });
                } else if (embed?.provider === 'vimeo') {
                    post({ method: 'setCurrentTime', value: seconds });
                    post({ method: 'play' });
                }
                reportTime(seconds);
            },
            play: () => {
                if (videoRef.current) videoRef.current.play().catch(() => {});
                else if (embed?.provider === 'youtube') post({ event: 'command', func: 'playVideo', args: [] });
                else if (embed?.provider === 'vimeo') post({ method: 'play' });
            },
            pause: () => {
                if (videoRef.current) videoRef.current.pause();
                else if (embed?.provider === 'youtube') post({ event: 'command', func: 'pauseVideo', args: [] });
                else if (embed?.provider === 'vimeo') post({ method: 'pause' });
            },
        }),
        [video.file_url, embed?.provider, embed?.id, post],
    );

    return (
        <div className="w-full aspect-video bg-inverse-surface rounded-xl overflow-hidden shadow-xl">
            {video.file_url ? (
                <video
                    ref={videoRef}
                    key={video.id}
                    src={video.file_url}
                    controls
                    className="w-full h-full bg-black"
                    controlsList="nodownload"
                    onTimeUpdate={(e) => reportTime(e.currentTarget.currentTime)}
                    onSeeked={(e) => reportTime(e.currentTarget.currentTime)}
                    onPlay={() => reportPaused(false)}
                    onPause={() => reportPaused(true)}
                    onEnded={() => reportPaused(true)}
                />
            ) : embed ? (
                <iframe
                    ref={iframeRef}
                    key={video.id}
                    onLoad={onIframeLoad}
                    src={
                        embed.provider === 'youtube'
                            ? `https://www.youtube.com/embed/${embed.id}?enablejsapi=1&rel=0&origin=${encodeURIComponent(origin)}`
                            : `https://player.vimeo.com/video/${embed.id}?api=1`
                    }
                    title={video.title}
                    className="w-full h-full"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                />
            ) : (
                <a href={video.url} target="_blank" rel="noreferrer" className="w-full h-full flex flex-col items-center justify-center text-white gap-2">
                    <span className="material-symbols-outlined text-6xl">play_circle</span>
                    <span className="font-bold">Abrir vídeo</span>
                </a>
            )}
        </div>
    );
});

export default VideoPlayer;
