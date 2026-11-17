import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';

/*
 * Player de vídeo com controle de tempo, para as anotações.
 * Suporta arquivo enviado (HTML5), YouTube e Vimeo (via postMessage, sem scripts externos).
 * Expõe: getTime(), seek(segundos), pause(), play(), controllable.
 * Avisa o componente pai do tempo atual (onTime) e de play/pausa (onPlayState).
 * Vídeos enviados usam uma barra de controle própria ABAIXO da imagem, para não cobrir legendas gravadas no vídeo.
 */

const SPEEDS = [0.75, 1, 1.25, 1.5, 2];

const clock = (total) => {
    const s = Math.max(0, Math.floor(total || 0));
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = String(s % 60).padStart(2, '0');
    return h ? `${h}:${String(m).padStart(2, '0')}:${sec}` : `${m}:${sec}`;
};

function BarButton({ icon, title, onClick, fill = false }) {
    return (
        <button type="button" onClick={onClick} title={title} aria-label={title} className="p-1.5 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-colors">
            <span className="material-symbols-outlined text-[22px] leading-none block" style={fill ? { fontVariationSettings: "'FILL' 1" } : undefined}>
                {icon}
            </span>
        </button>
    );
}

/** Barra de controle do vídeo enviado: fica sob a imagem, nunca sobre ela. */
function ControlBar({ videoRef, wrapperRef, state, markers = [] }) {
    const { playing, time, duration, buffered, volume, muted, rate, fullscreen } = state;
    const v = () => videoRef.current;
    const pct = (t) => (duration ? Math.min(100, (t / duration) * 100) : 0);

    const toggle = () => (v()?.paused ? v()?.play().catch(() => {}) : v()?.pause());
    const skip = (d) => v() && (v().currentTime = Math.min(Math.max(0, v().currentTime + d), duration || v().currentTime + d));
    const nextRate = () => {
        if (!v()) return;
        v().playbackRate = SPEEDS[(SPEEDS.indexOf(rate) + 1) % SPEEDS.length] ?? 1;
    };
    const toggleFullscreen = () => (document.fullscreenElement ? document.exitFullscreen() : wrapperRef.current?.requestFullscreen?.());

    return (
        <div className="bg-inverse-surface px-3 pt-2 pb-2 select-none">
            {/* Linha do tempo */}
            <div className="relative h-4 flex items-center group/timeline">
                <div className="relative w-full h-1.5 group-hover/timeline:h-2 transition-all rounded-full bg-white/20 overflow-hidden">
                    <div className="absolute inset-y-0 left-0 bg-white/30" style={{ width: `${pct(buffered)}%` }} />
                    <div className="absolute inset-y-0 left-0 bg-primary-container kinetic-gradient" style={{ width: `${pct(time)}%` }} />
                </div>
                {markers.map((m) => {
                    const at = pct(m.time);
                    // Perto das bordas o balão se alinha à borda para não ser cortado.
                    const align = at < 20 ? 'left-0' : at > 80 ? 'right-0' : 'left-1/2 -translate-x-1/2';
                    const arrow = at < 20 ? 'left-1' : at > 80 ? 'right-1' : 'left-1/2 -translate-x-1/2';
                    return (
                        <span key={m.id} className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 group/marker" style={{ left: `${at}%` }}>
                            <button
                                type="button"
                                aria-label={`Ir para a nota em ${clock(m.time)}: ${m.label}`}
                                onClick={() => v() && (v().currentTime = m.time)}
                                className="block w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-inverse-surface group-hover/marker:scale-150 focus-visible:scale-150 outline-none transition-transform"
                            />
                            <span
                                role="tooltip"
                                className={`pointer-events-none absolute bottom-full mb-3 ${align} w-max max-w-[240px] rounded-xl bg-white text-[#003346] shadow-xl px-3 py-2 opacity-0 translate-y-1 group-hover/marker:opacity-100 group-hover/marker:translate-y-0 group-focus-within/marker:opacity-100 group-focus-within/marker:translate-y-0 transition-all duration-150`}
                            >
                                <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-amber-600">
                                    <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>sticky_note_2</span>
                                    Nota · {clock(m.time)}
                                </span>
                                <span className="block mt-0.5 text-xs font-medium leading-snug line-clamp-3 whitespace-pre-line break-words">{m.label}</span>
                                <span className="block mt-1 text-[10px] text-[#507c94]">Clique para ir a este momento</span>
                                <span className={`absolute top-full ${arrow} w-0 h-0 border-x-[6px] border-x-transparent border-t-[6px] border-t-white`} />
                            </span>
                        </span>
                    );
                })}
                <span
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-white shadow pointer-events-none opacity-0 group-hover/timeline:opacity-100 transition-opacity"
                    style={{ left: `${pct(time)}%` }}
                />
                <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    step="0.1"
                    value={Math.min(time, duration || 0)}
                    onChange={(e) => v() && (v().currentTime = Number(e.target.value))}
                    aria-label="Linha do tempo"
                    className="absolute inset-0 w-full opacity-0 cursor-pointer z-10"
                />
            </div>

            <div className="flex items-center gap-1 mt-1">
                <BarButton icon={playing ? 'pause' : 'play_arrow'} title={playing ? 'Pausar' : 'Reproduzir'} onClick={toggle} fill />
                <BarButton icon="replay_10" title="Voltar 10 segundos" onClick={() => skip(-10)} />
                <BarButton icon="forward_10" title="Avançar 10 segundos" onClick={() => skip(10)} />
                <div className="flex items-center group/volume">
                    <BarButton
                        icon={muted || volume === 0 ? 'volume_off' : volume < 0.5 ? 'volume_down' : 'volume_up'}
                        title={muted ? 'Ativar som' : 'Silenciar'}
                        onClick={() => v() && (v().muted = !v().muted)}
                    />
                    <span className="w-0 overflow-hidden group-hover/volume:w-20 group-focus-within/volume:w-20 transition-all flex items-center">
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={muted ? 0 : volume}
                            onChange={(e) => {
                                if (!v()) return;
                                v().volume = Number(e.target.value);
                                v().muted = Number(e.target.value) === 0;
                            }}
                            aria-label="Volume"
                            className="w-20 accent-white cursor-pointer"
                        />
                    </span>
                </div>
                <span className="ml-2 text-xs font-bold text-white/80 tabular-nums">
                    {clock(time)} / {clock(duration)}
                </span>
                <div className="ml-auto flex items-center gap-1">
                    <button type="button" onClick={nextRate} title="Velocidade" className="px-2 py-1 rounded-lg text-xs font-black text-white/90 hover:bg-white/10 tabular-nums">
                        {rate}x
                    </button>
                    <BarButton icon={fullscreen ? 'fullscreen_exit' : 'fullscreen'} title={fullscreen ? 'Sair da tela cheia' : 'Tela cheia'} onClick={toggleFullscreen} />
                </div>
            </div>
        </div>
    );
}

export function parseEmbed(url) {
    if (!url) return null;
    const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/);
    if (yt) return { provider: 'youtube', id: yt[1] };
    const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (vimeo) return { provider: 'vimeo', id: vimeo[1] };
    return null;
}

const VideoPlayer = forwardRef(function VideoPlayer({ video, onTime, onPlayState, markers = [] }, ref) {
    const videoRef = useRef(null);
    const wrapperRef = useRef(null);
    const [media, setMedia] = useState({ playing: false, time: 0, duration: 0, buffered: 0, volume: 1, muted: false, rate: 1, fullscreen: false });
    const sync = (patch) => setMedia((m) => ({ ...m, ...patch }));

    // Novo vídeo: zera a barra.
    useEffect(() => sync({ playing: false, time: 0, duration: 0, buffered: 0 }), [video.id]);

    // Tela cheia inclui a barra de controle (ela continua abaixo do vídeo).
    useEffect(() => {
        const onChange = () => sync({ fullscreen: document.fullscreenElement === wrapperRef.current && !!wrapperRef.current });
        document.addEventListener('fullscreenchange', onChange);
        return () => document.removeEventListener('fullscreenchange', onChange);
    }, []);
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
        <div className={`w-full bg-inverse-surface rounded-xl overflow-hidden shadow-xl ${video.file_url ? '' : 'aspect-video'}`}>
            {video.file_url ? (
                <div ref={wrapperRef} className={`flex flex-col bg-black ${media.fullscreen ? 'h-full' : ''}`}>
                    <video
                        ref={videoRef}
                        key={video.id}
                        src={video.file_url}
                        playsInline
                        onClick={() => (videoRef.current?.paused ? videoRef.current.play().catch(() => {}) : videoRef.current?.pause())}
                        onContextMenu={(e) => e.preventDefault()}
                        className={`w-full bg-black cursor-pointer ${media.fullscreen ? 'flex-1 min-h-0' : 'aspect-video'}`}
                        onLoadedMetadata={(e) => sync({ duration: e.currentTarget.duration || 0 })}
                        onDurationChange={(e) => sync({ duration: e.currentTarget.duration || 0 })}
                        onProgress={(e) => {
                            const b = e.currentTarget.buffered;
                            if (b.length) sync({ buffered: b.end(b.length - 1) });
                        }}
                        onTimeUpdate={(e) => {
                            reportTime(e.currentTarget.currentTime);
                            sync({ time: e.currentTarget.currentTime });
                        }}
                        onSeeked={(e) => {
                            reportTime(e.currentTarget.currentTime);
                            sync({ time: e.currentTarget.currentTime });
                        }}
                        onVolumeChange={(e) => sync({ volume: e.currentTarget.volume, muted: e.currentTarget.muted })}
                        onRateChange={(e) => sync({ rate: e.currentTarget.playbackRate })}
                        onPlay={() => {
                            reportPaused(false);
                            sync({ playing: true });
                        }}
                        onPause={() => {
                            reportPaused(true);
                            sync({ playing: false });
                        }}
                        onEnded={() => {
                            reportPaused(true);
                            sync({ playing: false });
                        }}
                    />
                    <ControlBar videoRef={videoRef} wrapperRef={wrapperRef} state={media} markers={markers} />
                </div>
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
