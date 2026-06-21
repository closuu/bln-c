// ============================================================
//  allongrotta — bln-c radio widget
//  drop <script src="js/radio.js"></script> on any page.
//  requires supabase sb client already initialised.
// ============================================================

(function () {
    'use strict';

    // ── CSS ──────────────────────────────────────────────────
    const CSS = `
    #agr-fab {
        position: fixed;
        top: 14px;
        right: 18px;
        z-index: 100000;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        user-select: none;
        transition: transform 0.1s;
    }
    #agr-fab:hover { transform: scale(1.15); }
    #agr-fab:active { transform: scale(0.92); }

    #agr-fab svg { width: 22px; height: 22px; opacity: 0.6; transition: opacity 0.15s; }
    #agr-fab:hover svg { opacity: 0.9; }
    #agr-fab.playing svg { opacity: 1; }
    #agr-fab .agr-note-fill { fill: #1a1a18; }
    body.monochrome-mode #agr-fab .agr-note-fill { fill: #fff; }

    #agr-fab.playing::after {
        content: '';
        position: absolute;
        inset: -4px;
        border: 1.5px solid #1a1a18;
        animation: agr-ring 1.4s ease-in-out infinite;
    }
    body.monochrome-mode #agr-fab.playing::after { border-color: #fff; }
    @keyframes agr-ring {
        0%   { transform: scale(1);    opacity: 0.6; }
        100% { transform: scale(1.55); opacity: 0; }
    }

    /* ── widget panel ── */
    #agr-panel {
        position: fixed;
        top: 52px;
        right: 14px;
        z-index: 99999;
        width: 240px;
        background: #f0ede8;
        border: 1px solid #ccc;
        border-top: 2px solid #1a1a18;
        font-family: 'bitmap', monospace;
        font-size: 0.72em;
        letter-spacing: 1px;
        display: flex;
        flex-direction: column;
        -webkit-font-smoothing: none;
        font-smooth: never;
        opacity: 0;
        pointer-events: none;
        transform: translateY(-6px);
        transition: opacity 0.15s ease, transform 0.15s ease;
    }
    #agr-panel.open { opacity: 1; pointer-events: all; transform: translateY(0); }
    body.monochrome-mode #agr-panel {
        background: #0a0a0a;
        border-color: #222;
        border-top-color: #fff;
    }

    .agr-header {
        background: #1a1a18;
        color: #f0ede8;
        padding: 4px 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.9em;
        letter-spacing: 2px;
    }
    body.monochrome-mode .agr-header { background: #fff; color: #000; }

    .agr-close {
        cursor: pointer;
        opacity: 0.5;
        font-size: 1em;
        line-height: 1;
        padding: 0 2px;
    }
    .agr-close:hover { opacity: 1; }
    body.monochrome-mode .agr-close { color: #000; }

    /* ── ascii viz ── */
    .agr-viz {
        height: 36px;
        background: #1a1a18;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: monospace;
        font-size: 1.1em;
        letter-spacing: 6px;
        color: #f0ede8;
        user-select: none;
        white-space: nowrap;
    }
    body.monochrome-mode .agr-viz { background: #000; color: #fff; }
    #agr-ascii { display: inline-block; }

    .agr-info {
        padding: 7px 10px 5px;
        border-bottom: 1px solid #e0ddd8;
        min-height: 42px;
    }
    body.monochrome-mode .agr-info { border-color: #1a1a1a; }

    .agr-title {
        color: #1a1a18;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        letter-spacing: 1px;
        font-size: 1em;
    }
    body.monochrome-mode .agr-title { color: #fff; }

    .agr-sub {
        color: #aaa;
        font-size: 0.88em;
        margin-top: 2px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    body.monochrome-mode .agr-sub { color: #555; }

    .agr-marquee { overflow: hidden; white-space: nowrap; }
    .agr-marquee span { display: inline-block; animation: agr-scroll 12s linear infinite; }
    .agr-marquee.short span { animation: none; }
    @keyframes agr-scroll {
        0%   { transform: translateX(0); }
        30%  { transform: translateX(0); }
        80%  { transform: translateX(-60%); }
        100% { transform: translateX(0); }
    }

    .agr-controls {
        display: flex;
        align-items: center;
        border-bottom: 1px solid #e0ddd8;
    }
    body.monochrome-mode .agr-controls { border-color: #1a1a1a; }

    .agr-btn {
        flex: 1;
        background: none;
        border: none;
        border-right: 1px solid #e0ddd8;
        color: #1a1a18;
        padding: 7px 0;
        cursor: pointer;
        font-size: 0.88em;
        font-family: 'bitmap', monospace;
        letter-spacing: 1px;
        text-transform: lowercase;
        transition: background 0.08s;
        -webkit-font-smoothing: none;
    }
    .agr-btn:last-child { border-right: none; }
    .agr-btn:hover { background: #e0ddd8; }
    .agr-btn:active { background: #ccc; }
    body.monochrome-mode .agr-btn { color: #fff; border-color: #1a1a1a; }
    body.monochrome-mode .agr-btn:hover { background: #111; }
    body.monochrome-mode .agr-btn:active { background: #222; }

    .agr-vol-row {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 5px 10px;
        border-bottom: 1px solid #e0ddd8;
    }
    body.monochrome-mode .agr-vol-row { border-color: #1a1a1a; }

    .agr-vol-label { color: #aaa; font-size: 0.85em; flex-shrink: 0; }
    body.monochrome-mode .agr-vol-label { color: #555; }

    #agr-vol {
        flex: 1;
        -webkit-appearance: none;
        appearance: none;
        height: 4px;
        background: #ccc;
        outline: none;
        cursor: pointer;
    }
    #agr-vol::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 10px; height: 10px;
        background: #1a1a18;
        cursor: pointer;
        border-radius: 0;
    }
    body.monochrome-mode #agr-vol { background: #333; }
    body.monochrome-mode #agr-vol::-webkit-slider-thumb { background: #fff; }

    .agr-link-row {
        display: flex;
        padding: 5px 10px;
        gap: 5px;
        border-bottom: 1px solid #e0ddd8;
    }
    body.monochrome-mode .agr-link-row { border-color: #1a1a1a; }

    #agr-link-input {
        flex: 1;
        background: #fff;
        border: 1px solid #ccc;
        color: #1a1a18;
        font-family: 'bitmap', monospace;
        font-size: 0.82em;
        padding: 4px 6px;
        outline: none;
        min-width: 0;
    }
    #agr-link-input:focus { border-color: #1a1a18; }
    #agr-link-input::placeholder { color: #ccc; }
    body.monochrome-mode #agr-link-input { background: #111; border-color: #333; color: #fff; }
    body.monochrome-mode #agr-link-input::placeholder { color: #444; }

    .agr-link-btn {
        background: #1a1a18;
        border: none;
        color: #f0ede8;
        font-family: 'bitmap', monospace;
        font-size: 0.75em;
        padding: 4px 7px;
        cursor: pointer;
        letter-spacing: 1px;
        text-transform: lowercase;
        flex-shrink: 0;
    }
    .agr-link-btn:hover { opacity: 0.8; }
    body.monochrome-mode .agr-link-btn { background: #fff; color: #000; }

    .agr-footer {
        padding: 5px 10px;
        color: #bbb;
        font-size: 0.82em;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    body.monochrome-mode .agr-footer { color: #555; }
    .agr-listeners { color: #aaa; }
    body.monochrome-mode .agr-listeners { color: #555; }

    #agr-yt { position: absolute; width: 1px; height: 1px; opacity: 0; pointer-events: none; left: -9999px; top: -9999px; }

    @media (max-width: 600px) {
        #agr-fab   { top: auto; bottom: 18px; right: 14px; }
        #agr-panel { top: auto; bottom: 56px; right: 8px; left: 8px; width: auto; }
    }
    `;

    const styleEl = document.createElement('style');
    styleEl.textContent = CSS;
    document.head.appendChild(styleEl);

    // ── inject HTML ───────────────────────────────────────────
    document.body.insertAdjacentHTML('beforeend', `
        <div id="agr-fab" title="allongrotta radio">
            <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                <rect class="agr-note-fill" x="5" y="1" width="8" height="2"/>
                <rect class="agr-note-fill" x="11" y="1" width="2" height="5"/>
                <rect class="agr-note-fill" x="5" y="3" width="2" height="7"/>
                <rect class="agr-note-fill" x="3" y="8" width="4" height="2"/>
                <rect class="agr-note-fill" x="2" y="10" width="6" height="2"/>
                <rect class="agr-note-fill" x="3" y="12" width="4" height="2"/>
                <rect class="agr-note-fill" x="9" y="4" width="4" height="2"/>
                <rect class="agr-note-fill" x="8" y="6" width="6" height="2"/>
                <rect class="agr-note-fill" x="9" y="8" width="4" height="2"/>
            </svg>
        </div>

        <div id="agr-panel">
            <div class="agr-header">
                <span>// allongrotta</span>
                <span class="agr-close" id="agr-close">✕</span>
            </div>

            <div class="agr-viz">
                <span id="agr-ascii">alo alo alo</span>
            </div>

            <div class="agr-info">
                <div class="agr-title agr-marquee" id="agr-title"><span>no track loaded</span></div>
                <div class="agr-sub" id="agr-sub">paste a yt link below</div>
            </div>

            <div class="agr-controls">
                <button class="agr-btn" id="agr-prev">⏮</button>
                <button class="agr-btn" id="agr-play">▶ play</button>
                <button class="agr-btn" id="agr-next">⏭</button>
            </div>

            <div class="agr-vol-row">
                <span class="agr-vol-label">vol</span>
                <input type="range" id="agr-vol" min="0" max="100" value="70">
            </div>

            <div class="agr-link-row">
                <input type="text" id="agr-link-input" placeholder="yt / yt music link...">
                <button class="agr-link-btn" id="agr-link-load">load</button>
            </div>

            <div class="agr-footer">
                <span id="agr-time">0:00 / 0:00</span>
                <span class="agr-listeners" id="agr-hours"></span>
            </div>
        </div>

        <div id="agr-yt"></div>
    `);

    // ── state ─────────────────────────────────────────────────
    let ytPlayer       = null;
    let ytReady        = false;
    let isPlaying      = false;
    let vizRaf         = null;
    let listenInterval = null;
    let currentUserId  = null;
    let asciiPhase     = 0;
    let pendingLoad    = null; // {type, id} queued before player ready

    const fab       = document.getElementById('agr-fab');
    const panel     = document.getElementById('agr-panel');
    const closeBtn  = document.getElementById('agr-close');
    const playBtn   = document.getElementById('agr-play');
    const prevBtn   = document.getElementById('agr-prev');
    const nextBtn   = document.getElementById('agr-next');
    const volSlider = document.getElementById('agr-vol');
    const linkInput = document.getElementById('agr-link-input');
    const linkLoad  = document.getElementById('agr-link-load');
    const titleEl   = document.getElementById('agr-title');
    const subEl     = document.getElementById('agr-sub');
    const timeEl    = document.getElementById('agr-time');
    const hoursEl   = document.getElementById('agr-hours');
    const asciiEl   = document.getElementById('agr-ascii');

    // ── YouTube IFrame API ────────────────────────────────────
    function loadYTAPI() {
        if (window.YT && window.YT.Player) { initPlayer(); return; }
        if (document.querySelector('script[src*="youtube.com/iframe_api"]')) return;
        const tag = document.createElement('script');
        tag.src   = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(tag);
    }

    window.onYouTubeIframeAPIReady = function () { initPlayer(); };

    function initPlayer() {
        if (ytPlayer) return;
        // don't pass origin on file:// — browser rejects it as unsafe
        const isHosted = location.protocol === 'http:' || location.protocol === 'https:';
        const vars = { autoplay: 0, controls: 0 };
        if (isHosted) vars.origin = location.origin;
        ytPlayer = new YT.Player('agr-yt', {
            height: '1', width: '1',
            playerVars: vars,
            events: {
                onReady:       onPlayerReady,
                onStateChange: onPlayerState,
                onError:       onPlayerError,
            }
        });
    }

    function onPlayerReady() {
        ytReady = true;
        setVolume(parseInt(volSlider.value));
        // execute anything queued before player was ready
        if (pendingLoad) {
            const p = pendingLoad;
            pendingLoad = null;
            execLoad(p);
        }
        // restore session state if navigated from another page
        doRestorePlay();
    }

    function onPlayerState(e) {
        const S = YT.PlayerState;
        if (e.data === S.PLAYING) {
            setPlaying(true);
            updateTrackInfo();
        } else if (e.data === S.PAUSED) {
            setPlaying(false);
        } else if (e.data === S.ENDED) {
            // playlist managed by YT — it auto-advances; if single video, restart
            setTimeout(updateTrackInfo, 600);
        } else if (e.data === S.BUFFERING) {
            subEl.textContent = 'buffering...';
        }
    }

    function onPlayerError(e) {
        // only react if something was actually loaded
        if (!ytPlayer) return;
        try {
            const data = ytPlayer.getVideoData && ytPlayer.getVideoData();
            if (!data || !data.video_id) return; // nothing loaded yet
        } catch (_) { return; }
        subEl.textContent = 'skipping...';
        setTimeout(() => { try { ytPlayer.nextVideo(); } catch (_) {} }, 1200);
    }

    // ── parse URL ─────────────────────────────────────────────
    function parseYTUrl(url) {
        try {
            const u    = new URL(url.trim());
            const host = u.hostname.replace('www.', '');
            const list = u.searchParams.get('list');
            const v    = u.searchParams.get('v');

            if (host === 'youtu.be') {
                const vid = u.pathname.slice(1).split('?')[0];
                return list
                    ? { type: 'playlist', id: list, firstVideo: vid }
                    : { type: 'video',    id: vid };
            }
            if (host === 'youtube.com' || host === 'music.youtube.com') {
                if (list) return { type: 'playlist', id: list, firstVideo: v || null };
                if (v)    return { type: 'video',    id: v };
            }
        } catch (_) {}
        if (/^[A-Za-z0-9_-]{11}$/.test(url.trim()))
            return { type: 'video', id: url.trim() };
        return null;
    }

    // ── load link ─────────────────────────────────────────────
    function loadLink(url) {
        const parsed = parseYTUrl(url);
        if (!parsed) { subEl.textContent = 'invalid link'; return; }
        subEl.textContent = 'loading...';
        titleEl.querySelector('span').textContent = '...';

        if (parsed.type === 'video') {
            // single video — use JS API
            if (!ytReady || !ytPlayer) {
                pendingLoad = parsed;
                loadYTAPI();
                subEl.textContent = 'player starting...';
            } else {
                execLoad(parsed);
            }
        } else {
            // playlist — use iframe embed src directly (works for ALL list types)
            loadPlaylistEmbed(parsed.id);
        }
    }

    function loadPlaylistEmbed(listId, index = 0, startSeconds = 0) {
        try { if (ytPlayer) { ytPlayer.destroy(); } } catch (_) {}
        ytPlayer = null;
        ytReady  = false;

        const old = document.getElementById('agr-yt');
        if (old) old.remove();

        const iframe = document.createElement('iframe');
        iframe.id     = 'agr-yt';
        iframe.width  = '1';
        iframe.height = '1';
        iframe.allow  = 'autoplay';
        iframe.setAttribute('allowfullscreen', '');
        // index = which track to start at, start = seek position in seconds
        iframe.src = `https://www.youtube-nocookie.com/embed?listType=playlist&list=${listId}&autoplay=1&enablejsapi=1&playsinline=1&index=${index}&start=${Math.floor(startSeconds)}`;
        document.body.appendChild(iframe);

        iframe.onload = () => {
            try {
                ytPlayer = new YT.Player(iframe, {
                    events: {
                        onReady: (e) => {
                            ytReady = true;
                            e.target.setVolume(parseInt(volSlider.value));
                            setPlaying(true);
                            setTimeout(updateTrackInfo, 1000);
                        },
                        onStateChange: onPlayerState,
                        onError:       onPlayerError,
                    }
                });
            } catch (_) {
                setPlaying(true);
                subEl.textContent = 'playing via embed';
            }
        };

        setPlaying(true);
        subEl.textContent = 'loading playlist...';
    }

    function execLoad(parsed) {
        try {
            if (parsed.type === 'video') {
                ytPlayer.loadVideoById(parsed.id);
            } else {
                loadPlaylistEmbed(parsed.id);
            }
        } catch (err) {
            subEl.textContent = 'load failed';
            console.error('[agr] execLoad error:', err);
        }
    }

    // ── playback controls ─────────────────────────────────────
    function togglePlay() {
        if (!ytPlayer) return;
        try {
            const state = ytReady ? ytPlayer.getPlayerState() : -1;
            if (state === 1 /* PLAYING */ || isPlaying) {
                ytPlayer.pauseVideo();
                setPlaying(false);
            } else {
                ytPlayer.playVideo();
            }
        } catch (_) {
            // player not ready yet — just flip visual state
            setPlaying(!isPlaying);
        }
    }

    function setPlaying(v) {
        isPlaying = v;
        playBtn.textContent = v ? '⏸ pause' : '▶ play';
        fab.classList.toggle('playing', v);
        v ? startViz() : stopViz();
        v ? startListenTimer() : stopListenTimer();
    }

    function setVolume(v) {
        try { if (ytPlayer && ytReady) ytPlayer.setVolume(v); } catch (_) {}
    }

    function safeNext() { try { if (ytPlayer && ytReady) ytPlayer.nextVideo(); } catch (_) {} }
    function safePrev() { try { if (ytPlayer && ytReady) ytPlayer.previousVideo(); } catch (_) {} }

    // ── track info ────────────────────────────────────────────
    function updateTrackInfo() {
        try {
            if (!ytPlayer || !ytReady || !ytPlayer.getVideoData) return;
            const data  = ytPlayer.getVideoData();
            const title = (data.title || 'unknown track').toLowerCase();
            titleEl.querySelector('span').textContent = title;
            const chars = (titleEl.offsetWidth || 200) / 7;
            titleEl.classList.toggle('short', title.length < chars);
            subEl.textContent = (data.author || 'youtube').toLowerCase();
        } catch (_) {}
    }

    setInterval(() => {
        try {
            if (!ytPlayer || !ytReady || !ytPlayer.getCurrentTime) return;
            const cur = ytPlayer.getCurrentTime() || 0;
            const dur = ytPlayer.getDuration()    || 0;
            timeEl.textContent = `${fmt(cur)} / ${fmt(dur)}`;
            if (isPlaying) updateTrackInfo();
        } catch (_) {}
    }, 1000);

    function fmt(s) {
        const m = Math.floor(s / 60), sec = Math.floor(s % 60);
        return `${m}:${String(sec).padStart(2, '0')}`;
    }

    // ── ascii "alo" visualizer ────────────────────────────────
    // Single "alo" that morphs its characters — not repeated
    const A_FRAMES = ['a','a','a','@','a','a','4','a','a','α','a','a'];
    const L_FRAMES = ['l','l','|','l','l','1','l','l','ʟ','l','l','|'];
    const O_FRAMES = ['o','o','o','0','o','o','O','o','o','ο','o','ø'];

    let asciiFrame = 0;
    let asciiTimer = null;

    function renderAscii() {
        const f = asciiFrame;
        const a = A_FRAMES[f % A_FRAMES.length];
        const l = L_FRAMES[f % L_FRAMES.length];
        const o = O_FRAMES[f % O_FRAMES.length];
        asciiEl.textContent = a + l + o;
    }

    function runAscii(speed) {
        if (asciiTimer) clearTimeout(asciiTimer);
        function tick() {
            renderAscii();
            asciiFrame++;
            asciiTimer = setTimeout(tick, speed);
        }
        tick();
    }

    function startViz() { runAscii(80); }   // playing — fast glitch
    function stopViz()  { runAscii(400); }  // idle — slow drift

    // ── start idle animation immediately ─────────────────────
    stopViz();

    // ── listen time tracking ──────────────────────────────────
    async function initUser() {
        if (typeof sb === 'undefined') return;
        try {
            const { data: { session } } = await sb.auth.getSession();
            if (session) { currentUserId = session.user.id; fetchHours(); }
        } catch (_) {}
    }

    async function fetchHours() {
        if (!currentUserId || typeof sb === 'undefined') return;
        try {
            const { data } = await sb
                .from('radio_listens')
                .select('total_seconds')
                .eq('user_id', currentUserId)
                .single();
            if (data) {
                const h = Math.floor(data.total_seconds / 3600);
                const m = Math.floor((data.total_seconds % 3600) / 60);
                hoursEl.textContent = h > 0 ? `${h}h ${m}m` : m > 0 ? `${m}m` : '';
            }
        } catch (_) {}
    }

    function startListenTimer() {
        if (listenInterval) return;
        listenInterval = setInterval(async () => {
            if (!currentUserId || typeof sb === 'undefined') return;
            try {
                await sb.rpc('increment_radio_seconds', { p_user_id: currentUserId, p_seconds: 10 });
                fetchHours();
            } catch (_) {}
        }, 10000);
    }

    function stopListenTimer() {
        if (listenInterval) { clearInterval(listenInterval); listenInterval = null; }
    }

    // ── UI events ─────────────────────────────────────────────
    fab.addEventListener('click', () => {
        panel.classList.toggle('open');
        if (panel.classList.contains('open') && !ytPlayer) loadYTAPI();
    });

    closeBtn.addEventListener('click', () => panel.classList.remove('open'));
    playBtn.addEventListener('click', togglePlay);
    prevBtn.addEventListener('click', safePrev);
    nextBtn.addEventListener('click', safeNext);
    volSlider.addEventListener('input', () => setVolume(parseInt(volSlider.value)));

    linkLoad.addEventListener('click', () => {
        const v = linkInput.value.trim(); if (v) loadLink(v);
    });
    linkInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { const v = linkInput.value.trim(); if (v) loadLink(v); }
    });

    // ── session state — persist across page navigations ───────
    const SS_KEY  = 'agr_state';
    const LS_KEY  = 'agr_url';   // permanent — survives tab close
    let savedState = null;

    function saveState() {
        try {
            const state = {
                url:       linkInput.value.trim(),
                playing:   isPlaying,
                volume:    parseInt(volSlider.value),
                open:      panel.classList.contains('open'),
                timestamp: Date.now(),
            };
            if (ytPlayer && ytReady) {
                try { state.time  = ytPlayer.getCurrentTime()    || 0; } catch (_) {}
                try { state.index = ytPlayer.getPlaylistIndex()  ?? 0; } catch (_) {}
            }
            sessionStorage.setItem(SS_KEY, JSON.stringify(state));
            if (state.url) localStorage.setItem(LS_KEY, state.url);
        } catch (_) {}
    }

    function restoreState() {
        try {
            const raw = sessionStorage.getItem(SS_KEY);
            const state = raw ? JSON.parse(raw) : null;
            const withinSession = state && (Date.now() - state.timestamp) < 30000;

            // always restore the last-used url from localStorage
            const savedUrl = (withinSession && state.url) || localStorage.getItem(LS_KEY) || '';
            if (savedUrl) linkInput.value = savedUrl;

            if (withinSession) {
                savedState = state;
                if (state.volume !== undefined) volSlider.value = state.volume;
                if (state.open) panel.classList.add('open');
                if (state.url && state.playing) {
                    subEl.textContent = 'resuming...';
                    titleEl.querySelector('span').textContent = '...';
                }
            }
        } catch (_) {}
    }

    function doRestorePlay() {
        if (!savedState || !savedState.url || !savedState.playing) return;
        const state = savedState;
        savedState = null;
        const parsed = parseYTUrl(state.url);
        if (!parsed) return;
        try {
            if (parsed.type === 'video') {
                ytPlayer.loadVideoById(parsed.id, state.time || 0);
            } else {
                loadPlaylistEmbed(parsed.id, state.index || 0, state.time || 0);
            }
        } catch (_) {}
    }

    window.addEventListener('beforeunload', saveState);
    window.addEventListener('pagehide',     saveState);

    // ── init ──────────────────────────────────────────────────
    initUser();
    restoreState(); // restore UI + queue play for when player is ready
    loadYTAPI();    // preload — onPlayerReady will call doRestorePlay

})();
