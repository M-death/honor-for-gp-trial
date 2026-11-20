/* ---------- 体験版 (trial) ----------
   The trial is the main game's files plus this one. d198 (まえ): the public trial has two modes only — タイムアタック and
   6艇レース — and a short settings screen. To update the trial, copy the main game's js/ and index.html over and keep this
   file and its <script> line (and the 体験版 title). */
const TRIAL = { ver: 't171', base: 'd370' };
if ($('verTag')) $('verTag').textContent = `${TRIAL.ver}（${GAME_VER}）`;
const trialHide = el => { if (!el) return; el.hidden = true; el.style.display = 'none'; };
// modes and tools that aren't in the trial
for (const id of ['labLaunch', 'labLaunchStart', 'goDemo', 'entryBtn', 'sgBtn', 'logBtn', 'slitBtn', 'vlHold', 'devBtn',
                  'pm6', 'pmRace', 'pmTALog', 'rankReset', 'pmTenji', 'pmClock', 'pmSetsu', 'pmReplay', 'taLog', 'taSlit',
                  'pmPracticeBtn', 'pmPractice', 'pmDev', 'setTab_dev']) trialHide($(id));
// menu (d227: the menu is the first screen): タイムアタック / 6艇レース
// settings: what a player needs; the rest of the controls under 詳しい操作設定, the developer ones gone
{
  const lab = id => $(id) && $(id).closest('label');
  for (const id of ['demoCpuMode', 'tiltSel', 'fpsOn', 'wxMode', 'vlogOn', 'simSpeed']) {
    const l = lab(id); trialHide(l);
    const nx = l && l.nextElementSibling; if (nx && nx.tagName === 'P') trialHide(nx);
  }
  { const nx = lab('sens') && lab('sens').nextElementSibling; if (nx && nx.tagName === 'P') trialHide(nx); }
  const det = document.createElement('details'), sum = document.createElement('summary');
  sum.textContent = '詳しい操作設定'; sum.style.cursor = 'pointer'; det.appendChild(sum);
  const box = document.createElement('div'); box.className = 'set'; box.style.marginTop = '6px'; det.appendChild(box);
  det.dataset.tab = 'op'; $('zero').after(det);
  for (const el of [$('wheelSettings'), lab('invR'), lab('invP')]) if (el) box.appendChild(el);
}
// t164 (まえ 2026-11-19: 体験版は極力説明文を減らそう、設定も開発関係は消す): the help lines go, the labels stay
{
  const lab = id => $(id) && $(id).closest('label');
  for (const id of ['pmKeys', 'controlHelp', 'perfRow', 'gfx3dNow', 'rankNote', 'taNote']) trialHide($(id));
  for (const sm of document.querySelectorAll('#pmenu .menu-main .btn small')) trialHide(sm);
  for (const p of document.querySelectorAll('#settings p')) trialHide(p);   // every explanation under a setting
  for (const id of ['dpr2d', 'perfOn', 'perf1M']) trialHide(lab(id));
  const sa = lab('stAssistOn'); if (sa) for (const n of sa.childNodes) if (n.nodeType === 3 && /スタートアシスト/.test(n.textContent)) n.textContent = ' スタートアシスト';
  for (const p of document.querySelectorAll('p')) if (p.textContent.trim() === '相手（選ばない枠はおまかせ）') p.textContent = '相手';
}
// t143 (まえ: 6艇レース中の「練習をやめる」は消す、体験版はタイムアタックと6艇レースだけ): the top bar's 6艇デモ button
// (練習をやめる → 大時計前からの練習) is never shown in the trial
{ const _r = refreshFleetUi; refreshFleetUi = () => { _r(); trialHide($('demoBtn')); }; trialHide($('demoBtn')); }
// 設定 opens on 操作 (the 開発 tab is gone)
if (MENU.showTab && $('settings').querySelector('.set').dataset.cur === 'dev') MENU.showTab('op');
// t129 (まえ 2026-11-16: スマホにダウンロード型): the trial installs as an app (manifest.webmanifest + sw.js, made by
// game/tools/build_trial.py). The first start saves every file on the device; later starts need no network. Only where
// it is served over https (GitHub Pages) or localhost; elsewhere (an embedded page) nothing happens.
if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost') && window.top === window) {
  addEventListener('load', () => { navigator.serviceWorker.register('sw.js').catch(() => {}); });
}

/* t135 (まえ 2026-11-16: 体験版にタイトル画面 — ゲーム開始・設定・インストール). t136: まえ's art — title/chars.webp (夏水・
   遠くに瑞月・羽美, one transparent picture) and title/logo.webp (transparent logo); the buttons sit over 瑞月, as in まえ's
   mock-up. The first tap here also lets the browser start the sound and full screen. Without the pictures (not yet loaded,
   offline before the first save) the text logo shows instead. */
(() => {
  const css = document.createElement('style');
  css.textContent = `
#titleScr{position:fixed;inset:0;z-index:40;overflow:hidden;background:radial-gradient(ellipse 60% 70% at 50% 42%,#4a4a9a 0%,#2a2c66 38%,#14183e 70%,#0b0e26 100%);color:#fff;font-family:inherit;user-select:none;-webkit-user-select:none}
#titleScr .glow{position:absolute;left:0;right:0;bottom:0;height:35%;background:linear-gradient(180deg,transparent,rgba(120,90,200,.28))}
#titleScr .chars{position:absolute;left:50%;bottom:0;height:84vh;max-width:none;transform:translateX(-50%);pointer-events:none;animation:tRise 1.1s ease-out both}
@keyframes tRise{from{opacity:0;transform:translate(-50%,3vh)}to{opacity:1;transform:translate(-50%,0)}}
#titleScr .logoImg{position:absolute;left:50%;top:calc(1.5vh + var(--st,0px));height:27vh;max-width:70vw;object-fit:contain;transform:translateX(-50%);pointer-events:none;filter:drop-shadow(0 4px 18px rgba(40,120,255,.35));animation:tLogo .9s .25s ease-out both}
@keyframes tLogo{from{opacity:0;transform:translateX(-50%) scale(.92)}to{opacity:1;transform:translateX(-50%) scale(1)}}
#titleScr .logo{position:absolute;top:calc(6vh + var(--st,0px));left:0;right:0;text-align:center;text-shadow:0 2px 12px rgba(0,0,0,.55)}
#titleScr .logo h1{margin:0;font-size:clamp(30px,8vh,64px);letter-spacing:.04em;font-weight:800}
#titleScr .logo .sub{display:block;font-size:clamp(14px,3.4vh,24px);letter-spacing:.3em;margin-top:2px}
#titleScr .tag{position:absolute;right:calc(12px + var(--sr,0px));top:calc(10px + var(--st,0px));padding:2px 12px;border:1px solid rgba(255,255,255,.6);border-radius:999px;font-size:12px;background:rgba(10,12,40,.5);letter-spacing:.1em}
#titleScr.noart .tag{display:none}
#titleScr .menu{position:absolute;left:50%;transform:translateX(-50%);bottom:calc(5vh + var(--sb,0px));display:flex;flex-direction:column;gap:1.6vh;width:min(330px,32vw)}
#titleScr .menu button{font:inherit;font-size:clamp(15px,4.2vh,22px);font-weight:700;padding:1.6vh 14px;border-radius:12px;border:2px solid rgba(255,255,255,.85);background:#0b1430;color:#fff;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.35)}
#titleScr .menu button.go{background:#ffc21a;color:#111;border-color:#fff3c4}
#titleScr .menu button:focus-visible{outline:3px solid #fff;outline-offset:2px}
#titleScr .help{position:absolute;left:50%;transform:translateX(-50%);bottom:calc(5vh + var(--sb,0px));width:min(440px,86vw);background:rgba(8,12,36,.95);border:1px solid rgba(255,255,255,.45);border-radius:12px;padding:14px 16px;font-size:14px;line-height:1.6}
#titleScr .help button{margin-top:8px}
#titleScr .ver{position:absolute;right:calc(10px + var(--sr,0px));bottom:calc(6px + var(--sb,0px));font-size:11px;opacity:.7}
@media (max-width:760px) and (orientation:landscape){#titleScr .menu{width:min(280px,38vw)}}
@media (orientation:portrait){#titleScr .chars{height:auto;width:128vw;bottom:calc(4vh + 190px + var(--sb,0px))}#titleScr .glow{height:45%}#titleScr .logoImg{height:auto;width:94vw;max-width:94vw;top:calc(4vh + var(--st,0px))}#titleScr .menu{width:min(330px,72vw);bottom:calc(4vh + var(--sb,0px))}#titleScr .menu button{font-size:18px;padding:12px 14px}}
@media (prefers-reduced-motion:reduce){#titleScr .chars,#titleScr .logoImg{animation:none}}`;
  document.head.appendChild(css);
  const T = document.createElement('div'); T.id = 'titleScr'; T.setAttribute('role', 'dialog'); T.setAttribute('aria-label', 'タイトル');
  T.innerHTML = '<div class="glow"></div><img class="chars" src="title/chars.webp" alt="夏水・瑞月・羽美">'
    + '<img class="logoImg" src="title/logo.webp" alt="Honor for GP"><div class="logo" hidden><h1>Honor for GP</h1><span class="sub">波の向こうに</span></div><span class="tag">体験版</span>'
    + '<div class="menu"><button class="go" id="tGo">ゲーム開始</button><button id="tSet">設定</button><button id="tInst">インストール</button></div>'
    + `<div class="help" id="tHelp" hidden></div><div class="ver">${TRIAL.ver}（${GAME_VER}）</div>`;
  document.body.appendChild(T);
  // the pictures missing → the text logo (and no characters)
  T.querySelector('.logoImg').addEventListener('error', e => { e.target.remove(); T.querySelector('.logo').hidden = false; T.classList.add('noart'); }, { once: true });
  T.querySelector('.chars').addEventListener('error', e => e.target.remove(), { once: true });
  const menu = T.querySelector('.menu'), help = $('tHelp');
  const close = () => { T.hidden = true; T.style.display = 'none'; };
  const open = () => { T.hidden = false; T.style.display = ''; help.hidden = true; menu.hidden = false; $('tGo').focus(); };
  $('tGo').addEventListener('click', () => { close(); try { if (!isPC() || screenMode === 'full') lockLandscape(); } catch (e) {} });
  // 設定 from the title comes back to the title
  let fromTitle = false;
  $('tSet').addEventListener('click', () => { fromTitle = true; close(); $('pmSet').click(); });
  if ($('close')) $('close').addEventListener('click', () => { if (fromTitle) { fromTitle = false; open(); } });
  // インストール: Android Chrome etc. hand us the install prompt; iPhone/iPad and the rest get the steps
  // t140 (まえ: インストールしてもメニューが消えない): the manifest asks for display fullscreen, so the app runs in
  // display-mode fullscreen, not standalone. In the browser tab, an install this browser made is remembered
  // (appinstalled) and the button stays hidden until the browser offers the install again (= app removed).
  const IK = 'honorGP.trialInstalled';
  const lsGet = () => { try { return localStorage.getItem(IK) === '1'; } catch (e) { return false; } };
  const lsSet = v => { try { v ? localStorage.setItem(IK, '1') : localStorage.removeItem(IK); } catch (e) {} };
  const standalone = () => { try { return ['standalone', 'minimal-ui'].concat(document.fullscreenElement ? [] : ['fullscreen']).some(m => matchMedia('(display-mode: ' + m + ')').matches) || navigator.standalone === true; } catch (e) { return false; } };
  const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  let deferred = null;
  const instBtn = $('tInst');
  const instShow = () => { instBtn.hidden = standalone() || (lsGet() && !deferred) || window.top !== window || !(location.protocol === 'https:' || location.hostname === 'localhost'); };
  addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferred = e; lsSet(false); instShow(); });
  addEventListener('appinstalled', () => { deferred = null; lsSet(true); instShow(); });
  if (standalone()) lsSet(true);
  instShow();
  const say = html => { help.innerHTML = html + '<div><button class="btn" id="tHelpOk">OK</button></div>'; help.hidden = false; menu.hidden = true; $('tHelpOk').addEventListener('click', () => { help.hidden = true; menu.hidden = false; }); $('tHelpOk').focus(); };
  instBtn.addEventListener('click', async () => {
    if (deferred) { const d = deferred; deferred = null; try { d.prompt(); await d.userChoice; } catch (e) {} instShow(); return; }
    if (iOS) say('<b>iPhone・iPadでは</b><br>Safari の下の<b>共有ボタン</b>（四角から矢印）→<b>「ホーム画面に追加」</b>を押してください。ホーム画面のアイコンから始めると、アプリとして全画面で遊べます。');
    else say('<b>このブラウザでは</b><br>右上のメニュー（︙ や ≡）から<b>「アプリをインストール」</b>または<b>「ホーム画面に追加」</b>を選んでください。<br><small>一度インストールすると、次からは通信なしでも始められます。</small>');
  });
  // pad: A starts (the title's buttons take the focus; menu.js handles Enter/A on a focused button)
  setTimeout(() => { if (!T.hidden) $('tGo').focus(); }, 50);
  // BGM (t168): an installed app may start sound at once (the title music plays from the start); in a browser tab
  // the sound starts with the first tap (input.js resumes it)
  try { initAudio(); } catch (e) {}
})();

// t138 (まえ: インストールが終わらないと3Dにならない): the offline save no longer takes the 3D models at the first start (sw.js);
// once the 3D view is up — or after 60 s if it never is — the page asks the service worker to save the rest quietly.
if ('serviceWorker' in navigator && window.top === window) {
  const warmT0 = Date.now();
  const warm = () => {
    const sw = navigator.serviceWorker.controller;
    if (sw && ((window.View3D && window.View3D.ready) || Date.now() - warmT0 > 60000)) { sw.postMessage({ warm: true }); return; }
    setTimeout(warm, 3000);
  };
  addEventListener('load', () => setTimeout(warm, 3000));
}
