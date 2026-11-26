/*⁠​‌​​‌​​​​‌‌​‌‌‌‌​‌‌​‌‌‌​​‌‌​‌‌‌‌​‌‌‌​​‌​​​‌​​​​​​‌‌​​‌‌​​‌‌​‌‌‌‌​‌‌‌​​‌​​​‌​​​​​​‌​​​‌‌‌​‌​‌​​​​​​‌​​​​​‌‌‌​​‌‌​‌​‌‌​​‌‌‌​‌​​​‌​‌‌‌​​​‌‌‌​​​​​​‌‌​‌​‌‌‌​‌‌‌​​‌​‌‌​​‌​​​​‌​​‌​​​‌‌‌‌​​​‌‌‌​​​​​​‌‌​​‌​​‌‌‌‌‌​​​‌‌‌​​​​​​‌‌​​​​‌‌​‌‌‌​​​‌‌‌​​​​​​‌‌​‌​‌​‌‌​​‌​​​​​​​‌​‌‌‌‌​​‌​​​​​​​‌​‌​​​​‌‌​​​‌‌​​‌​‌​​‌​​‌​​​​​​​‌‌​​‌​​​‌‌​​​​​​‌‌​​‌​​​‌‌​‌‌​​​‌​​​​​‌‌‌​​​‌‌‌​​​​​‌​‌​‌​‌​​​‌‌‌​​​‌‌‌​​​​​‌‌‌​‌​​​​​‌‌‌​​​‌‌‌​​​​​‌‌‌​​​​‌‌‌‌‌‌​​​‌‌‌​​​​​‌​‌​‌‌‌​​‌​​‌​​​​​​​‌​‌​​​​‌​​‌‌​‌​​‌​‌‌​‌​‌​​​‌​​​‌‌​​‌​‌​‌‌​​​​‌​‌‌‌​‌​​​‌‌​‌​​​​​‌​‌​​‌​​‌​​​​​​​‌​‌‌‌‌​​‌​​​​​​‌‌​‌‌‌‌​‌‌‌​​‌​​‌‌​‌​​‌​‌‌​​‌‌‌​‌‌​‌​​‌​‌‌​‌‌‌​​‌‌​​​​‌​‌‌​‌‌​​​​‌​​​​​​‌‌​​​‌‌​‌‌​‌‌‌‌​‌‌​​‌​​​‌‌​​‌​‌​​‌​‌‌​​​​‌​​​​​​‌‌​​​​‌​‌‌​‌‌​​​‌‌​‌‌​​​​‌​​​​​​‌‌‌​​‌​​‌‌​‌​​‌​‌‌​​‌‌‌​‌‌​‌​​​​‌‌‌​‌​​​‌‌‌​​‌‌​​‌​​​​​​‌‌‌​​‌​​‌‌​​‌​‌​‌‌‌​​‌‌​‌‌​​‌​‌​‌‌‌​​‌​​‌‌‌​‌‌​​‌‌​​‌​‌​‌‌​​‌​​​​‌​​​​​​​‌​‌‌‌‌​​‌​​​​​​‌​​‌​​​​‌​​​‌‌​​‌​​​‌‌‌​‌​‌​​​​​​‌​‌‌​‌​‌​‌​​‌‌​‌​​‌​​‌​‌​​​‌‌‌​​‌​‌‌​‌​​‌‌​​​‌⁠ 体験版 service worker (written by tools/build_trial.py — edit the template, not trial/sw.js).
   First start: every file of the game is saved on the device; after that the game starts from there, with or without the
   network (no more 3D 組み立て waiting on a slow Wi-Fi). A new trial version (TRIAL.ver) is fetched quietly in the
   background and used from the next start; the old copy is then deleted. The ranking server is never cached. */
const VER = 't208', CACHE = 'hfgp-trial-' + VER, GALLERY = 'hfgp-gallery';
const FILES = [
 "./",
 "index.html",
 "manual.html",
 "manifest.webmanifest",
 "bgm/bgm.json",
 "js/ashi.js",
 "js/boat-model-data.js",
 "js/boat3d.js",
 "js/boat3dx.js",
 "js/core.js",
 "js/data.js",
 "js/input.js",
 "js/lab.js",
 "js/main.js",
 "js/menu.js",
 "js/net.js",
 "js/perflog.js",
 "js/physics.js",
 "js/play3d.js",
 "js/player.js",
 "js/race.js",
 "js/rec.js",
 "js/replay.js",
 "js/setsu.js",
 "js/ta.js",
 "js/trial.js",
 "js/tutorial.js",
 "js/venue3d.js",
 "js/view.js",
 "js/vlog.js",
 "hfgp3d/runtime/boat_actor.js",
 "hfgp3d/runtime/racer_pose.js",
 "hfgp3d/runtime/rig_rest.json",
 "hfgp3d/viewer/vendor/BufferGeometryUtils.js",
 "hfgp3d/viewer/vendor/GLTFLoader.js",
 "hfgp3d/viewer/vendor/SkeletonUtils.js",
 "hfgp3d/viewer/vendor/THREE_LICENSE.txt",
 "hfgp3d/viewer/vendor/three.core.min.js",
 "hfgp3d/viewer/vendor/three.module.js",
 "icons/apple-touch-icon.png",
 "icons/icon-192.png",
 "icons/icon-512.png",
 "icons/maskable-192.png",
 "icons/maskable-512.png",
 "manga/add1.webp",
 "manga/add2.webp",
 "manga/extra.webp",
 "manga/p1.webp",
 "manga/p2.webp",
 "manga/p3.webp",
 "manga/p4.webp",
 "manga/p5.webp",
 "manga/p6.webp",
 "manga/race.webp",
 "manga/ta.webp",
 "manga/umi_face.webp",
 "title/chars.webp",
 "title/logo.webp"
];
// t138 (まえ: インストールが終わらないと3Dにならない): the first start saved every file at once — 5.4 MB of PC and venue models
// raced the page's own 3D download on a slow line. Now the install saves only the game itself; the 3D models are saved as the
// page loads them (fetch below), and the rest (LATER) only when the page says the 3D view is up (message 'warm').
const LATER = ["js/hfgp3d-glb-venue.js", "js/hfgp3d-glb.js", "js/hfgp3d-glb-pc.js"];
// t193 公開版 (まえ 2026-11-17: 更新のたびに約14MBを落とし直さない): each file's content hash from the build. A new version copies
// every file whose hash is unchanged from the previous version's cache (no download) and fetches only the changed ones.
// The previous cache keeps its own hash list under HKEY; a cache without one (before t193) is fetched in full once.
const HASH = {"./": "d2abd34b2067", "bgm/bgm.json": "d75793abc713", "bgm/menu.mp3": "e7d3f4bc7125", "bgm/race.mp3": "528cd4ca2bea", "bgm/ta.mp3": "4c1c56d04d11", "bgm/title.mp3": "f55d1be13802", "bgm/tut.mp3": "637ee2a79b7e", "hfgp3d/runtime/boat_actor.js": "18637d7c6a8c", "hfgp3d/runtime/racer_pose.js": "228e896ad52a", "hfgp3d/runtime/rig_rest.json": "0176faa7e205", "hfgp3d/viewer/vendor/BufferGeometryUtils.js": "18e94b7ffb5e", "hfgp3d/viewer/vendor/GLTFLoader.js": "e99c52ac7964", "hfgp3d/viewer/vendor/SkeletonUtils.js": "e56c9c3ab675", "hfgp3d/viewer/vendor/THREE_LICENSE.txt": "710028d82dc9", "hfgp3d/viewer/vendor/three.core.min.js": "6e7b12ea3658", "hfgp3d/viewer/vendor/three.module.js": "ffa353a25d46", "icons/apple-touch-icon.png": "1689bd9e7b2c", "icons/icon-192.png": "ae9a8148f38d", "icons/icon-512.png": "8f967199b21d", "icons/maskable-192.png": "cd35da77eab3", "icons/maskable-512.png": "9b644429b9e8", "index.html": "d2abd34b2067", "js/ashi.js": "c46f44e0dbb3", "js/boat-model-data.js": "893b334b1742", "js/boat3d.js": "8d6c51291558", "js/boat3dx.js": "0e306e1945c1", "js/core.js": "bdf236a79b08", "js/data.js": "7d7ea5afa39b", "js/hfgp3d-glb-pc.js": "c8cd7016ca89", "js/hfgp3d-glb-venue.js": "15a496682826", "js/hfgp3d-glb.js": "e255b37c1e2f", "js/input.js": "a0b301acc29d", "js/lab.js": "e72329c3435e", "js/main.js": "4113ce6564f5", "js/menu.js": "36dde5264308", "js/net.js": "0a3b810bf37f", "js/perflog.js": "6979a88fb251", "js/physics.js": "3aa9e0d61a4d", "js/play3d.js": "0df3788d0b75", "js/player.js": "6b01990cf684", "js/race.js": "e5a5b27ccf3d", "js/rec.js": "6e956715e73d", "js/replay.js": "a45b4e8b9fb6", "js/setsu.js": "82c19da5befe", "js/ta.js": "ce277e4fbc5b", "js/trial.js": "287dc8fe5d33", "js/tutorial.js": "d1b25032149d", "js/venue3d.js": "b93156b9c842", "js/view.js": "740be83217d3", "js/vlog.js": "742266254e15", "manga/add1.webp": "51fb7b969ba8", "manga/add2.webp": "3bcf2b85aa2e", "manga/extra.webp": "cedb421a5796", "manga/p1.webp": "e0eeffd3c56f", "manga/p2.webp": "2f0ab1680122", "manga/p3.webp": "94c40d8bc076", "manga/p4.webp": "daba938f35c9", "manga/p5.webp": "8ddb5e1da37e", "manga/p6.webp": "033c40ce499b", "manga/race.webp": "c3866590b84b", "manga/ta.webp": "677dc4880a20", "manga/umi_face.webp": "fbf2217729aa", "manifest.webmanifest": "ef1c8e85e1eb", "manual.html": "f3cae257a4a9", "title/chars.webp": "23cf6c95221e", "title/logo.webp": "8c7bdb53233b"}, HKEY = '__hfgp_hash__';
async function prevCache() {
  const ks = (await caches.keys()).filter(k => k.startsWith('hfgp-trial-') && k !== CACHE);
  for (const k of ks.reverse()) { const c = await caches.open(k), m = await c.match(HKEY); if (m) { try { return { c, h: await m.json() }; } catch (x) {} } }
  return null;
}
self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE), old = await prevCache(), need = [];
    for (const f of FILES.concat(LATER)) {
      if (old && HASH[f] && old.h[f] === HASH[f]) { const r = await old.c.match(f, { ignoreSearch: true }); if (r) { await c.put(f, r); continue; } }
      if (FILES.includes(f)) need.push(f);   // (a LATER file not carried over is saved after the 3D view is up, as before)
    }
    // files the page saved on its own (BGM, models fetched on the way…): carried over too when unchanged
    if (old) { const base = self.registration.scope;
      for (const q of await old.c.keys()) { const f = q.url.startsWith(base) ? q.url.slice(base.length).split('?')[0] : null;
        if (f && HASH[f] && old.h[f] === HASH[f] && !FILES.includes(f) && !LATER.includes(f)) { const r = await old.c.match(q); if (r) await c.put(f, r); }
        else if (/^https:\/\/fonts\.(googleapis|gstatic)\.com\//.test(q.url)) { const r = await old.c.match(q); if (r) await c.put(q, r); } } }   // fonts: the same address is the same file
    await c.addAll(need.map(f => new Request(f, { cache: 'reload' })));
    await c.put(HKEY, new Response(JSON.stringify(HASH), { headers: { 'content-type': 'application/json' } }));
    await self.skipWaiting();
  })());
});
self.addEventListener('message', e => {
  if (!e.data || e.data.warm !== true) return;
  e.waitUntil(caches.open(CACHE).then(async c => { for (const f of LATER) { try { if (!(await c.match(f, { ignoreSearch: true }))) { const r = await fetch(f); if (r.ok) await c.put(f, r); } } catch (x) {} } }));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('hfgp-trial-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
const FONT = /^https:\/\/fonts\.(googleapis|gstatic)\.com\//;
self.addEventListener('fetch', e => {
  const r = e.request; if (r.method !== 'GET') return;
  const u = new URL(r.url), same = u.origin === self.location.origin;
  if (!same && !FONT.test(r.url)) return;   // (ranking server and the rest: straight to the network)
  // t179 ご褒美ギャラリー (まえ: インストール時には画像は落とさない): the pictures are fetched only once unlocked and kept in their
  // own cache, which a new trial version does not delete (only 'hfgp-trial-*' caches are)
  if (same && u.pathname.includes('/gallery/')) {
    e.respondWith(caches.open(GALLERY).then(c => c.match(r, { ignoreSearch: true }).then(hit => hit || fetch(r).then(res => { if (res && res.ok) c.put(r, res.clone()); return res; }))));
    return;
  }
  e.respondWith(caches.open(CACHE).then(c => c.match(r, { ignoreSearch: same }).then(hit => hit || fetch(r).then(res => {
    if (res && (res.ok || res.type === 'opaque')) c.put(r, res.clone());
    return res;
  }).catch(() => hit || (r.mode === 'navigate' ? c.match('index.html') : Response.error())))));
});
