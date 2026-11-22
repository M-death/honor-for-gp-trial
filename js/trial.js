/* ---------- 体験版 (trial) ----------
   The trial is the main game's files plus this one. d198 (まえ): the public trial has two modes only — タイムアタック and
   6艇レース — and a short settings screen. To update the trial, copy the main game's js/ and index.html over and keep this
   file and its <script> line (and the 体験版 title). */
const TRIAL = { ver: 't194', base: 'd389' };
// d384 (まえ: 体験版はその時の本編に合わせて版ごとに塗装を固定、選択なし): なにわ = キャラ模様（体験版の期間だけ。なにわの既定ではない）
if (typeof LIVERY !== 'undefined') LIVERY.fix = { suminoe: 'naniwa_cat', standard: 'practice' };
{ const r = document.getElementById('liveryRow'); if (r) r.remove(); }
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
// t173 (まえ: 本編の開発メニューで荒天を選ぶと体験版も荒れたまま？): the main game and the trial share the site's storage
// (same GitHub Pages origin), so a setting saved in the main game's 開発 tab would carry over with no way to change it here.
// The trial always runs those at their defaults — nothing is written, the main game keeps its own choice.
try { wxMode = 'auto'; if ($('wxMode')) $('wxMode').value = 'auto'; } catch (e) {}
try { FPS.on = true; fpsShow(); } catch (e) {}   // t174 (まえ: 公開版はテストも兼ねてるからfps表示): fps always shown
try { PERF.on = false; PERF.only1M = false; } catch (e) {}
try { if (DPR2D !== 2) { DPR2D = 2; resize(); } } catch (e) {}
try { vlOn = true; } catch (e) {}
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
#titleScr .wip{position:absolute;left:calc(12px + var(--sl,0px));top:calc(10px + var(--st,0px));max-width:min(300px,24vw);padding:6px 10px;border-radius:8px;background:rgba(10,12,40,.72);border:1px solid rgba(255,194,26,.7);font-size:12px;line-height:1.5;color:#fff}
#titleScr .wip b{color:#ffc21a}
#titleScr .menu{position:absolute;left:50%;transform:translateX(-50%);bottom:calc(5vh + var(--sb,0px));display:flex;flex-direction:column;gap:1.6vh;width:min(330px,32vw)}
#titleScr .menu button{font:inherit;font-size:clamp(15px,4.2vh,22px);font-weight:700;padding:1.6vh 14px;border-radius:12px;border:2px solid rgba(255,255,255,.85);background:#0b1430;color:#fff;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.35)}
#titleScr .menu button.go{background:#ffc21a;color:#111;border-color:#fff3c4}
#titleScr .menu button:focus-visible{outline:3px solid #fff;outline-offset:2px}
#titleScr .help{position:absolute;left:50%;transform:translateX(-50%);bottom:calc(5vh + var(--sb,0px));width:min(440px,86vw);background:rgba(8,12,36,.95);border:1px solid rgba(255,255,255,.45);border-radius:12px;padding:14px 16px;font-size:14px;line-height:1.6}
#titleScr .help button{margin-top:8px}
#titleScr .ver{position:absolute;right:calc(10px + var(--sr,0px));bottom:calc(6px + var(--sb,0px));font-size:11px;opacity:.7}
@media (max-width:760px) and (orientation:landscape){#titleScr .menu{width:min(280px,38vw)}}
@media (orientation:portrait){#titleScr .wip{top:auto;left:50%;transform:translateX(-50%);bottom:calc(22px + var(--sb,0px));max-width:none;width:min(330px,86vw);text-align:center;font-size:11px}#titleScr .chars{height:auto;width:128vw;bottom:calc(4vh + 190px + var(--sb,0px))}#titleScr .glow{height:45%}#titleScr .logoImg{height:auto;width:94vw;max-width:94vw;top:calc(4vh + var(--st,0px))}#titleScr .menu{width:min(330px,72vw);bottom:calc(4vh + 60px + var(--sb,0px))}#titleScr .menu button{font-size:18px;padding:12px 14px}}
@media (prefers-reduced-motion:reduce){#titleScr .chars,#titleScr .logoImg{animation:none}}`;
  document.head.appendChild(css);
  const T = document.createElement('div'); T.id = 'titleScr'; T.setAttribute('role', 'dialog'); T.setAttribute('aria-label', 'タイトル');
  T.innerHTML = '<div class="glow"></div><img class="chars" src="title/chars.webp" alt="夏水・瑞月・羽美">'
    + '<img class="logoImg" src="title/logo.webp" alt="Honor for GP"><div class="logo" hidden><h1>Honor for GP</h1><span class="sub">波の向こうに</span></div><span class="tag">体験版</span>'
    + '<div class="wip"><b>開発中の体験版です。</b>まだ未完成のため、内容は製品版と異なることがあります。</div>'
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

/* t179 ご褒美ギャラリー (まえ 2026-11-22: タイムアタックで解除、解除したら画像をダウンロードして表示、一度解除したらギャラリーで
   あとから見れる、インストール時には画像は落とさない). One set of 7 pictures per course, each unlocked by a 3-lap time under its
   limit (まえ's 解除条件一覧.csv). The pictures (gallery/<set>/NN.webp + NN_t.webp, converted from まえ's PNGs) are not in the
   install list (sw.js); they are fetched when unlocked and kept in their own cache ('hfgp-gallery'), which trial updates keep.
   What is unlocked is kept in this browser (honorGP.gallery) and is not cleared with the タイムアタック records. */
const GAL = {
  key: 'honorGP.gallery',
  sets: [
    { venue: 'suminoe', name: 'なにわ競艇場', dir: 'naniwa', items: [['01', '羽美 夕景のピット', 108], ['02', '羽美 落水後', 107], ['03', '羽美 更衣室', 106],
      ['04', '羽美と夏水 浴場', 105], ['05', '羽美と夏水 廊下', 104], ['06', '羽美 瑞月のターンを想像', 103], ['07', '謎の黒髪レーサー', 102]] },
    { venue: 'standard', name: '練習場', dir: 'practice', items: [['01', '旅立ちの日', 115], ['02', '黎明の修練', 110], ['03', '初陣', 108],
      ['04', '初勝利', 106], ['05', '湯けむりの遭遇', 104], ['06', '12R 本日のお仕事', 103], ['07', '女王の夢', 102]] }]
};
const galLoad = () => { try { return JSON.parse(localStorage.getItem(GAL.key) || '{}') || {}; } catch (e) { return {}; } };
const galSave = o => { try { localStorage.setItem(GAL.key, JSON.stringify(o)); } catch (e) {} };
const galHas = (set, no) => !!(galLoad()[set.venue] || {})[no];
const galSrc = (set, no, thumb) => `gallery/${set.dir}/${no}${thumb ? '_t' : ''}.webp`;
const galTime = s => { const m = Math.floor(s / 60), r = s - m * 60; return `${m}分${String(Math.round(r)).padStart(2, '0')}秒`; };
// fetch now (the service worker keeps it); also into the gallery cache from the page, where the page may use caches itself
async function galFetch(url) {
  try { if (window.caches && window.top === window) { const c = await caches.open('hfgp-gallery'); if (await c.match(url, { ignoreSearch: true })) return true; const r = await fetch(url); if (!r.ok) return false; await c.put(url, r); return true; } } catch (e) {}
  try { const r = await fetch(url, { cache: 'force-cache' }); return r.ok; } catch (e) { return false; }
}
(() => {
  const css = document.createElement('style');
  css.textContent = `
#galScr,#galView,#galNew{position:fixed;inset:0;z-index:60;color:#fff;font-family:inherit}
#galScr{background:#0b0e26;overflow:auto;padding:calc(10px + var(--st,0px)) calc(14px + var(--sr,0px)) calc(14px + var(--sb,0px)) calc(14px + var(--sl,0px))}
#galScr .gh{display:flex;align-items:center;gap:10px;margin-bottom:10px}
#galScr .gh h2{margin:0;font-size:20px;flex:1}
#galScr .tabs{display:flex;gap:8px;margin-bottom:12px}
#galScr .tabs button{font:inherit;padding:6px 14px;border-radius:999px;border:1px solid rgba(255,255,255,.5);background:transparent;color:#fff;cursor:pointer}
#galScr .tabs button[aria-selected="true"]{background:#ffc21a;color:#111;border-color:#ffc21a;font-weight:700}
#galScr .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:10px}
#galScr .card{font:inherit;color:#fff;text-align:left;padding:0;border:1px solid rgba(255,255,255,.25);border-radius:10px;background:#141a44;overflow:hidden;cursor:pointer;display:flex;flex-direction:column}
#galScr .card .pic{aspect-ratio:3/4;display:flex;align-items:center;justify-content:center;background:#0f1436;overflow:hidden}
#galScr .card .pic img{width:100%;height:100%;object-fit:cover}
#galScr .card .pic .q{font-size:40px;opacity:.35}
#galScr .card .cap{padding:6px 8px;font-size:12px;line-height:1.4}
#galScr .card .cap b{display:block;font-size:13px}
#galScr .card[disabled]{cursor:default;opacity:.8}
#galScr .count{font-size:13px;opacity:.8;margin:-4px 0 10px}
#galView{background:#000;display:flex;align-items:center;justify-content:center}
#galView img{max-width:100vw;max-height:100vh;object-fit:contain}
#galView .bar{position:absolute;left:0;right:0;bottom:0;display:flex;align-items:center;gap:8px;padding:8px calc(12px + var(--sr,0px)) calc(8px + var(--sb,0px)) calc(12px + var(--sl,0px));background:linear-gradient(transparent,rgba(0,0,0,.75))}
#galView .bar span{flex:1;font-size:14px;text-shadow:0 1px 4px #000}
#galView .bar button,#galScr .gh button,#galNew button{font:inherit;padding:6px 14px;border-radius:10px;border:1px solid rgba(255,255,255,.7);background:rgba(10,14,40,.8);color:#fff;cursor:pointer}
#galView .msg{position:absolute;inset:auto 0 50% 0;text-align:center;font-size:15px}
#galNew{background:rgba(5,8,25,.88);display:flex;align-items:center;justify-content:center}
#galNew .galBox{width:min(520px,92vw);max-height:92vh;overflow:auto;background:#141a44;border:2px solid #ffc21a;border-radius:14px;padding:16px;text-align:center}
#galNew h2{margin:0 0 4px;font-size:20px;color:#ffc21a}
#galNew .galList{display:flex;flex-wrap:wrap;justify-content:center;gap:10px;margin:12px 0}
#galNew .galList button{padding:0;width:120px;overflow:hidden;border-color:rgba(255,255,255,.35)}
#galNew .galList img{display:block;width:100%;aspect-ratio:3/4;object-fit:cover;background:#0f1436}
#galNew .galList span{display:block;padding:4px;font-size:12px}`;
  document.head.appendChild(css);
  let curSet = 0, back = null;
  const el = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };
  const S = el('div'); S.id = 'galScr'; S.hidden = true; S.setAttribute('role', 'dialog'); S.setAttribute('aria-label', 'ギャラリー'); document.body.appendChild(S);
  const V = el('div'); V.id = 'galView'; V.hidden = true; V.setAttribute('role', 'dialog'); document.body.appendChild(V);
  const N = el('div'); N.id = 'galNew'; N.hidden = true; N.setAttribute('role', 'dialog'); document.body.appendChild(N);
  // the picture viewer: the unlocked pictures of one set, ◀ ▶ between them
  function view(set, no, after) {
    const have = set.items.filter(it => galHas(set, it[0])); let i = Math.max(0, have.findIndex(it => it[0] === no));
    V.innerHTML = ''; const img = el('img'), msg = el('div', 'msg', '読み込み中…'), bar = el('div', 'bar'), cap = el('span');
    const prev = el('button', '', '◀'), next = el('button', '', '▶'), close = el('button', '', '閉じる');
    prev.setAttribute('aria-label', '前の絵'); next.setAttribute('aria-label', '次の絵');
    bar.append(prev, cap, next, close); V.append(msg, img, bar);
    const show = () => { const it = have[i]; cap.textContent = `No.${it[0]}　${it[1]}`; msg.textContent = '読み込み中…'; msg.hidden = false; img.alt = it[1];
      img.onload = () => { msg.hidden = true; }; img.onerror = () => { msg.textContent = '画像を読み込めませんでした。通信できるときにもう一度開いてください。'; };
      img.src = galSrc(set, it[0]); prev.disabled = next.disabled = have.length < 2; };
    prev.onclick = e => { e.stopPropagation(); i = (i + have.length - 1) % have.length; show(); };
    next.onclick = e => { e.stopPropagation(); i = (i + 1) % have.length; show(); };
    const shut = () => { V.hidden = true; V.innerHTML = ''; removeEventListener('keydown', key, true); (after || (() => {}))(); };
    const key = e => { if (V.hidden) return; if (e.key === 'Escape' || e.key === 'Backspace') { e.preventDefault(); e.stopPropagation(); shut(); } else if (e.key === 'ArrowLeft') { e.stopPropagation(); prev.click(); } else if (e.key === 'ArrowRight') { e.stopPropagation(); next.click(); } };
    close.onclick = e => { e.stopPropagation(); shut(); }; img.onclick = () => next.click();
    addEventListener('keydown', key, true);
    V.hidden = false; show(); close.focus();
  }
  // the gallery: one tab per course, 7 cards each (locked ones show the time to beat)
  function render() {
    const set = GAL.sets[curSet], got = set.items.filter(it => galHas(set, it[0])).length;
    S.innerHTML = '';
    const gh = el('div', 'gh'), close = el('button', '', '閉じる'); gh.append(el('h2', '', 'ギャラリー'), close); S.appendChild(gh);
    const tabs = el('div', 'tabs'); tabs.setAttribute('role', 'tablist');
    GAL.sets.forEach((s, k) => { const b = el('button', '', s.name); b.setAttribute('role', 'tab'); b.setAttribute('aria-selected', k === curSet); b.onclick = () => { curSet = k; render(); }; tabs.appendChild(b); });
    S.appendChild(tabs); S.appendChild(el('div', 'count', `タイムアタックで解除　${got} / ${set.items.length}`));
    const grid = el('div', 'grid');
    for (const it of set.items) {
      const ok = galHas(set, it[0]), c = el('button', 'card'), pic = el('div', 'pic'), cap = el('div', 'cap');
      if (ok) { const im = el('img'); im.loading = 'lazy'; im.alt = it[1]; im.src = galSrc(set, it[0], true); im.onerror = () => { im.replaceWith(el('span', 'q', '⌛')); }; pic.appendChild(im); cap.append(el('b', '', `No.${it[0]}`), it[1]); c.onclick = () => view(set, it[0], () => c.focus()); }
      else { pic.appendChild(el('span', 'q', '？')); cap.append(el('b', '', `No.${it[0]}`), `${set.name}で ${galTime(it[2])}を切る`); c.disabled = true; }
      c.append(pic, cap); grid.appendChild(c);
    }
    S.appendChild(grid);
    close.onclick = shut; close.focus();
  }
  const shut = () => { S.hidden = true; S.innerHTML = ''; (back || (() => {}))(); back = null; };
  addEventListener('keydown', e => { if (!S.hidden && V.hidden && e.key === 'Escape') { e.preventDefault(); shut(); } }, true);
  window.galOpen = (after, venue) => { back = after || null; const k = GAL.sets.findIndex(s => s.venue === (venue || VENUE.id)); if (k >= 0) curSet = k; S.hidden = false; render(); };
  // a new unlock at the end of a タイムアタック: download, then show the new pictures
  function announce(set, items) {
    N.innerHTML = ''; const box = el('div', 'galBox'), list = el('div', 'galList'), ok = el('button', '', 'OK'), gal = el('button', '', 'ギャラリーを開く');
    box.append(el('h2', '', 'ご褒美イラスト解除！'), el('div', '', `${set.name}　${items.length}枚`), list);
    for (const it of items) { const b = el('button'), im = el('img'); im.alt = it[1]; b.append(im, el('span', '', `No.${it[0]} ${it[1]}`)); list.appendChild(b);
      galFetch(galSrc(set, it[0], true)).then(() => { im.src = galSrc(set, it[0], true); });
      b.onclick = () => { N.hidden = true; view(set, it[0], () => { N.hidden = false; b.focus(); }); }; }
    const note = el('div', '', ''); note.style.fontSize = '12px'; note.style.opacity = '.8';
    Promise.all(items.map(it => galFetch(galSrc(set, it[0])))).then(r => { if (r.some(x => !x)) note.textContent = '画像はまだ保存できていません。通信できるときにギャラリーで開くと表示されます。'; });
    const row = el('div'); row.style.display = 'flex'; row.style.gap = '10px'; row.style.justifyContent = 'center'; row.append(gal, ok); box.append(row, note);
    ok.onclick = () => { N.hidden = true; N.innerHTML = ''; };
    gal.onclick = () => { N.hidden = true; N.innerHTML = ''; window.galOpen(null, set.venue); };
    N.appendChild(box); N.hidden = false; ok.focus();
  }
  // the hook: the run's 3-lap time against each limit of this course's set ("未満": a time equal to the limit does not unlock)
  const _finish = taFinish;
  taFinish = function (t) {
    _finish(t);
    try {
      const set = GAL.sets.find(s => s.venue === VENUE.id); if (!set || !(t > 0)) return;
      const o = galLoad(), got = o[set.venue] || (o[set.venue] = {});
      const fresh = set.items.filter(it => t < it[2] && !got[it[0]]); if (!fresh.length) return;
      for (const it of fresh) got[it[0]] = Date.now(); galSave(o);
      setTimeout(() => announce(set, fresh), 1700);   // after the result card (ta.js shows it 1.2 s after the finish)
    } catch (e) {}
  };
  // entries: the title screen and the menu
  const tb = el('button', '', 'ギャラリー'); tb.id = 'tGal';
  const tm = document.querySelector('#titleScr .menu'); if (tm) { tm.insertBefore(tb, $('tInst')); }
  tb.addEventListener('click', () => { const T = $('titleScr'); T.hidden = true; T.style.display = 'none'; window.galOpen(() => { T.hidden = false; T.style.display = ''; tb.focus(); }); });
  const pr = $('pmRank'); if (pr) { const b = pr.cloneNode(false); b.id = 'pmGal'; b.innerHTML = '<svg class="mic" viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="4.5" width="17" height="15" rx="2"/><path d="M3.5 16l5-5 4 4 3-3 5 5"/><circle cx="15.5" cy="9" r="1.6"/></svg>ギャラリー'; pr.after(b); b.addEventListener('click', () => window.galOpen(() => b.focus())); }
})();
// t193 公開版 (まえ: 公式ゴーストは無し。私が示さない方が面白い): the 公式ゴースト tab is not shown in the trial
{ const t = document.querySelector('#rankTabs [data-tab="official"]'); if (t) { t.hidden = true; t.style.display = 'none'; } }
