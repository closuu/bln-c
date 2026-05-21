/**
 * sounds.js — bln-c site sound effects
 * Uses capture phase + navigation delay so sounds always play before page unloads.
 */
(function () {

  /* ── AudioContext ── */
  var _ctx = null;
  var _ready = false; /* true once context has been resumed at least once */

  function ctx() {
    if (!_ctx) _ctx = new (window.AudioContext || window.webkitAudioContext)();
    return _ctx;
  }

  /* Call before playing a sound. Returns a promise that resolves when ready. */
  function resume() {
    var c = ctx();
    if (c.state !== 'suspended') { _ready = true; return Promise.resolve(); }
    return c.resume().then(function () { _ready = true; });
  }

  /* ── Synth primitives ── */
  function tone(type, freq, offset, dur, vol) {
    var c = ctx(); var t = c.currentTime + (offset || 0);
    var o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(vol || 0.18, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(c.destination);
    o.start(t); o.stop(t + dur + 0.02);
  }

  function glide(type, f0, f1, offset, dur, vol) {
    var c = ctx(), t = c.currentTime + (offset || 0);
    var o = c.createOscillator(), g = c.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f0, t);
    o.frequency.exponentialRampToValueAtTime(f1, t + dur);
    g.gain.setValueAtTime(vol || 0.18, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(c.destination);
    o.start(t); o.stop(t + dur + 0.02);
  }

  function noise(offset, dur, vol, freq) {
    var c = ctx(), t = c.currentTime + (offset || 0);
    var buf = c.createBuffer(1, Math.ceil(c.sampleRate * dur), c.sampleRate);
    var d = buf.getChannelData(0);
    for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    var src = c.createBufferSource(); src.buffer = buf;
    var flt = c.createBiquadFilter(); flt.type = 'bandpass';
    flt.frequency.value = freq || 1000; flt.Q.value = 1.2;
    var g = c.createGain();
    g.gain.setValueAtTime(vol || 0.12, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(flt); flt.connect(g); g.connect(c.destination);
    src.start(t); src.stop(t + dur + 0.02);
  }

  /* ── All sounds ── */
  var S = {
    /* Navigation */
    navHome:     function() { tone('sine',523,0,0.1,0.15); tone('sine',659,0.08,0.08,0.1); },
    navCatalogue:function() { glide('triangle',400,700,0,0.1,0.14); tone('sine',900,0.08,0.06,0.09); },
    navNotepad:  function() { tone('sine',880,0,0.05,0.12); tone('sine',660,0.04,0.07,0.09); },
    navDevlog:   function() { glide('sine',300,600,0,0.12,0.13); },
    navRate:     function() { tone('sine',440,0,0.04,0.1); tone('sine',550,0.04,0.04,0.1); tone('sine',660,0.08,0.04,0.1); },
    navWall:     function() { glide('sine',600,400,0,0.06,0.12); glide('sine',400,700,0.06,0.06,0.1); },
    navMessages: function() { tone('sine',784,0,0.06,0.14); tone('sine',987,0.06,0.08,0.1); },
    navGomoku:   function() { noise(0,0.04,0.12,800); tone('sine',660,0.03,0.08,0.12); },
    navRankings: function() { tone('sine',523,0,0.05,0.1); tone('sine',659,0.04,0.05,0.1); tone('sine',784,0.08,0.07,0.12); },
    navLogin:    function() { glide('sine',500,900,0,0.1,0.13); },
    navRegister: function() { tone('sine',600,0,0.05,0.1); tone('sine',800,0.05,0.05,0.1); tone('sine',1000,0.1,0.06,0.1); },
    navFallback: function() { glide('sine',500,750,0,0.09,0.13); },

    /* Nav toggle */
    navOpen:    function() { glide('triangle',280,580,0,0.13,0.14); tone('sine',880,0.09,0.06,0.08); },
    navClose:   function() { glide('triangle',580,280,0,0.13,0.14); },

    /* Theme */
    theme:      function() { tone('square',440,0,0.06,0.11); tone('square',880,0.06,0.06,0.09); tone('sine',1320,0.12,0.07,0.07); },

    /* Messages */
    send:       function() { glide('sine',380,1100,0,0.14,0.19); tone('sine',1500,0.11,0.09,0.11); },
    newConv:    function() { tone('sine',523,0,0.09,0.14); tone('sine',659,0.07,0.09,0.14); tone('sine',784,0.14,0.09,0.14); },
    convSelect: function() { glide('sine',460,660,0,0.08,0.13); },

    /* Kaomoji presets */
    k0: function() { glide('sawtooth',220,70,0,0.13,0.22); noise(0,0.05,0.08,400); },   // :Þ raspberry
    k1: function() { tone('sine',380,0,0.05,0.11); tone('sine',380,0.09,0.05,0.11); },   // (ㅇㅡㅇ) blink
    k2: function() { glide('sine',850,1350,0,0.07,0.13); glide('sine',1350,850,0.07,0.07,0.10); }, // (˃⤙˂) squeak
    k3: function() { glide('triangle',480,950,0,0.18,0.14); tone('sine',1050,0.16,0.05,0.07); },   // (╹-╹)? 
    k4: function() { tone('sine',523,0,0.07,0.14); tone('sine',659,0.055,0.07,0.14); tone('sine',784,0.11,0.07,0.14); tone('sine',1047,0.165,0.07,0.14); }, // happy
    k5: function() { glide('sine',180,600,0,0.05,0.24); glide('sine',600,140,0.05,0.16,0.20); tone('triangle',300,0.19,0.08,0.11); }, // boing

    /* Catalogue */
    cardHover:  function() { glide('sine',400,600,0,0.06,0.08); },
    cardView:   function() { tone('sine',660,0,0.06,0.13); glide('sine',660,1000,0,0.12,0.10); noise(0.05,0.04,0.07,1200); },
    cardGame:   function() { noise(0,0.03,0.1,600); tone('triangle',440,0.02,0.08,0.1); tone('triangle',550,0.07,0.07,0.09); },
    cardTool:   function() { tone('sine',700,0,0.05,0.1); glide('sine',700,500,0.04,0.08,0.08); },
    cardNonsense:function(){ glide('sawtooth',300,900,0,0.04,0.12); glide('sawtooth',900,200,0.04,0.1,0.1); tone('sine',1200,0.08,0.05,0.07); },

    /* Gomoku */
    stoneBlack: function() { glide('sine',210,75,0,0.15,0.32); noise(0,0.04,0.1,600); },
    stoneWhite: function() { glide('sine',420,155,0,0.12,0.27); noise(0,0.03,0.08,900); },
    win:        function() { var n=[523,659,784,1047,784,1047,1319]; for(var i=0;i<n.length;i++){tone('sine',n[i],i*0.1,0.13,0.17);} },
    resign:     function() { glide('triangle',640,200,0,0.4,0.17); tone('sine',170,0.3,0.16,0.11); },
    challenge:  function() { tone('sine',880,0,0.07,0.14); tone('sine',1100,0.08,0.07,0.11); },
    rematch:    function() { tone('triangle',392,0,0.1,0.15); tone('triangle',523,0.08,0.1,0.15); tone('triangle',659,0.16,0.1,0.15); },

    /* Tracker */
    addItem:    function() { glide('sine',580,920,0,0.08,0.17); tone('sine',1200,0.07,0.05,0.09); },
    checkOn:    function() { tone('sine',1047,0,0.06,0.13); tone('sine',1319,0.06,0.05,0.09); },
    checkOff:   function() { glide('sine',1047,580,0,0.1,0.13); },
    del:        function() { glide('sawtooth',480,160,0,0.1,0.19); },

    /* Wall */
    undo:       function() { glide('sine',680,380,0,0.1,0.17); glide('sine',680,380,0.1,0.08,0.11); },
    clear:      function() { glide('triangle',800,90,0,0.22,0.20); },
    submit:     function() { tone('sine',523,0,0.12,0.17); tone('sine',784,0.09,0.12,0.17); tone('sine',1047,0.18,0.12,0.17); },

    /* Rate My Week */
    rate:       function() { glide('sine',340,680,0,0.07,0.15); },
    reaction:   function() { tone('triangle',740,0,0.06,0.13); tone('triangle',920,0.06,0.05,0.09); },

    /* Auth */
    login:      function() { tone('sine',440,0,0.09,0.14); tone('sine',660,0.08,0.09,0.14); tone('sine',880,0.16,0.09,0.14); },

    /* Fallback */
    click:      function() { glide('sine',600,800,0,0.07,0.12); },
  };

  /* ── Nav link href → sound map ── */
  var NAV_SOUNDS = {
    'index.html':    S.navHome,
    'games.html':    S.navCatalogue,
    'tracker.html':  S.navNotepad,
    'devlog.html':   S.navDevlog,
    'rate.html':     S.navRate,
    'wall.html':     S.navWall,
    'messages.html': S.navMessages,
    'gomoku.html':   S.navGomoku,
    'rankings.html': S.navRankings,
    'login.html':    S.navLogin,
    'user.html':     S.navLogin,
    'register.html': S.navRegister,
  };

  /* ── Delayed navigation helper ── */
  function playThenGo(soundFn, href, target) {
    var noNav = !href || href === '#' || href === '' || (target === '_blank');
    resume().then(function () {
      soundFn();
      if (noNav) return;
      setTimeout(function () { window.location.href = href; }, 120);
    });
  }

  /* ── Catalogue card hover sounds ── */
  function wireCardSounds() {
    var cards = document.querySelectorAll('.game-card');
    cards.forEach(function (card) {
      /* Hover */
      card.addEventListener('mouseenter', function () { play(S.cardHover); });

      /* View button click — pick sound by card type badge */
      var viewBtn = card.querySelector('.download-btn, .action-btn');
      if (viewBtn) {
        viewBtn.addEventListener('click', function () {
          var badge = card.querySelector('.library-badge');
          var type  = badge ? badge.textContent.toLowerCase() : '';
          if (type.indexOf('game') !== -1)    play(S.cardGame);
          else if (type.indexOf('tool') !== -1) play(S.cardTool);
          else                                  play(S.cardNonsense);
        }, true);
      }
    });
  }

  /* Wire cards immediately and also after dynamic load */
  document.addEventListener('DOMContentLoaded', function () {
    wireCardSounds();

    /* Re-wire after catalogue grid populates (Supabase async load) */
    var grid = document.getElementById('catalogue-grid');
    if (grid) {
      new MutationObserver(function () { wireCardSounds(); })
        .observe(grid, { childList: true, subtree: true });
    }

    /* Gomoku win overlay */
    var winOverlay = document.getElementById('win-overlay');
    if (winOverlay) {
      new MutationObserver(function () {
        if (winOverlay.classList.contains('show')) {
          var wt = document.getElementById('win-text');
          if (wt && wt.textContent.indexOf('you win') !== -1) play(S.win);
        }
      }).observe(winOverlay, { attributes: true, attributeFilter: ['class'] });
    }
  });

  /* ── Play a regular sound (no navigation) ── */
  function play(soundFn) {
    resume().then(function () { soundFn(); });
  }

  /* ── Master click handler (capture phase) ── */
  document.addEventListener('click', function (e) {
    var el  = e.target;
    var btn = el.closest ? el.closest('button, a, input[type=checkbox], canvas') : null;
    if (!btn) return;

    var id  = btn.id  || '';
    var cls = btn.className || '';
    var oc  = btn.getAttribute('onclick') || '';
    var txt = btn.textContent.trim();
    var href= btn.getAttribute('href') || '';

    /* ── Canvas (Gomoku board) ── */
    if (btn.tagName === 'CANVAS' && id === 'gomoku-board') {
      var status = document.getElementById('board-status');
      if (status && status.textContent.indexOf('your turn') !== -1) {
        var last = btn.dataset.sfxLast || 'white';
        btn.dataset.sfxLast = last === 'black' ? 'white' : 'black';
        last === 'black' ? play(S.stoneBlack) : play(S.stoneWhite);
      }
      return;
    }

    /* ── Checkbox ── */
    if (btn.tagName === 'INPUT') {
      btn.checked ? play(S.checkOn) : play(S.checkOff);
      return;
    }

    /* ── Nav hamburger ── */
    if (id === 'nav-toggle') {
      var aside = document.querySelector('aside');
      (aside && aside.classList.contains('open')) ? play(S.navClose) : play(S.navOpen);
      return;
    }

    /* ── Nav links (inside aside) ── */
    if (btn.tagName === 'A' && btn.closest('aside')) {
      var raw      = href.split('/').pop().split('?')[0].split('#')[0];
      var soundFn  = NAV_SOUNDS[raw] || S.navFallback;
      var target   = btn.getAttribute('target') || '';
      e.preventDefault();
      playThenGo(soundFn, href, target);
      return;
    }

    /* ── Theme toggle ── */
    if (id === 'theme-toggle') { play(S.theme); return; }

    /* ── Messages ── */
    if (id === 'send-btn')    { play(S.send);      return; }
    if (id === 'new-conv-btn'){ play(S.newConv);   return; }
    if (btn.closest && btn.closest('#conv-list')) { play(S.convSelect); return; }

    /* ── Kaomoji bar ── */
    var bar = btn.closest ? btn.closest('#reaction-bar') : null;
    if (bar) {
      var allBtns = bar.querySelectorAll('button');
      var idx = -1;
      for (var i = 0; i < allBtns.length; i++) { if (allBtns[i] === btn) { idx = i; break; } }
      var kFns = [S.k0, S.k1, S.k2, S.k3, S.k4, S.k5];
      play(kFns[idx] || S.reaction);
      return;
    }

    /* ── Catalogue View buttons ── */
    if (cls.indexOf('download-btn') !== -1 || (cls.indexOf('action-btn') !== -1 && btn.closest('.game-card'))) {
      play(S.cardView); return;
    }

    /* ── Delete ── */
    if (cls.indexOf('delete-btn') !== -1 || txt === 'X' || txt === '×') { play(S.del); return; }

    /* ── Tracker ── */
    if (id === 'add-achievement') { play(S.addItem); return; }

    /* ── Wall ── */
    if (id === 'undo-btn')           { play(S.undo);   return; }
    if (id === 'clear-btn')          { play(S.clear);  return; }
    if (id === 'submit-drawing-btn') { play(S.submit); return; }

    /* ── Rate My Week ── */
    if (id === 'submit-week-btn')              { play(S.submit);   return; }
    if (cls.indexOf('rating-btn') !== -1)      { play(S.rate);     return; }
    if (oc.indexOf('toggleReaction') !== -1)   { play(S.reaction); return; }

    /* ── Gomoku ── */
    if (id === 'resign-btn')                        { play(S.resign);    return; }
    if (id === 'rematch-btn')                       { play(S.rematch);   return; }
    if (id === 'challenge-btn')                     { play(S.challenge); return; }
    if (oc.indexOf('acceptChallenge') !== -1)       { play(S.rematch);   return; }
    if (oc.indexOf('challenges-list') !== -1)       { play(S.del);       return; }

    /* ── Fallback for any other button/link ── */
    if (btn.tagName === 'BUTTON' || btn.tagName === 'A') { play(S.click); return; }

  }, true);

  /* ── Enter key ── */
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter') return;
    var a = document.activeElement;
    if (!a) return;
    if (a.id === 'msg-input') { play(S.send); return; }
    if (a.tagName === 'INPUT' && a.type === 'text') { play(S.addItem); return; }
  }, true);

  /* ── Form submits ── */
  document.addEventListener('submit', function (e) {
    var fid = e.target ? e.target.id : '';
    if (fid === 'login-form' || fid === 'register-form') play(S.login);
  }, true);

})();
