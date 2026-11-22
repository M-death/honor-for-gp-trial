/* 体験版 service worker (written by tools/build_trial.py — edit the template, not trial/sw.js).
   First start: every file of the game is saved on the device; after that the game starts from there, with or without the
   network (no more 3D 組み立て waiting on a slow Wi-Fi). A new trial version (TRIAL.ver) is fetched quietly in the
   background and used from the next start; the old copy is then deleted. The ranking server is never cached. */
const VER = 't193', CACHE = 'hfgp-trial-' + VER, GALLERY = 'hfgp-gallery';
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
 "manga/extra.webp",
 "manga/p1.webp",
 "manga/p2.webp",
 "manga/p3.webp",
 "manga/p4.webp",
 "manga/p5.webp",
 "manga/p6.webp",
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
const HASH = {"./": "ad5b7160a993", "bgm/bgm.json": "8790932b39a5", "bgm/menu.mp3": "018b2874b159", "bgm/race.mp3": "69b000bc3b54", "bgm/ta.mp3": "32840b3b1887", "bgm/title.mp3": "7a01f374b045", "bgm/tut.mp3": "36ed54cc45d8", "hfgp3d/runtime/boat_actor.js": "236ae803e95c", "hfgp3d/runtime/racer_pose.js": "97e39e99a027", "hfgp3d/runtime/rig_rest.json": "217984860517", "hfgp3d/viewer/vendor/BufferGeometryUtils.js": "8b5e5e7acf0a", "hfgp3d/viewer/vendor/GLTFLoader.js": "295969b33293", "hfgp3d/viewer/vendor/SkeletonUtils.js": "08b140281861", "hfgp3d/viewer/vendor/THREE_LICENSE.txt": "d0c607a5dd11", "hfgp3d/viewer/vendor/three.core.min.js": "f5156dd8e42f", "hfgp3d/viewer/vendor/three.module.js": "55ff257d7d6f", "icons/apple-touch-icon.png": "3d4e46f123ae", "icons/icon-192.png": "66bb282ee510", "icons/icon-512.png": "366130a3578a", "icons/maskable-192.png": "c69a9f477ba7", "icons/maskable-512.png": "5221f539497b", "index.html": "ad5b7160a993", "js/ashi.js": "2be4ad1d1524", "js/boat-model-data.js": "a81de8416732", "js/boat3d.js": "ffdecb2e467e", "js/boat3dx.js": "77338cfb9e65", "js/core.js": "18f268edfcf5", "js/data.js": "5817b24e555b", "js/hfgp3d-glb-pc.js": "92ab40317ea2", "js/hfgp3d-glb-venue.js": "e2f4919a3a09", "js/hfgp3d-glb.js": "50912358d7b2", "js/input.js": "5204779ed20f", "js/lab.js": "daa4a056ef68", "js/main.js": "baa11b7f95ac", "js/menu.js": "607456b2cb20", "js/net.js": "0f50224c9147", "js/perflog.js": "8e9e7ba6433b", "js/physics.js": "7df51e752df7", "js/play3d.js": "15ee23a6e58c", "js/player.js": "43b975444fbe", "js/race.js": "6b6b53d82729", "js/rec.js": "f08c470ea503", "js/replay.js": "d9aff4808c0a", "js/setsu.js": "0e6f5b0ebdca", "js/ta.js": "c689773febaa", "js/trial.js": "fe1b9828bea5", "js/tutorial.js": "a129baa0c695", "js/venue3d.js": "dae627621f40", "js/view.js": "a162b234cec3", "js/vlog.js": "4cd69b4a144a", "manga/extra.webp": "00b57ad9e794", "manga/p1.webp": "4cefda853047", "manga/p2.webp": "7a2900fbcce3", "manga/p3.webp": "28d3d6a700e1", "manga/p4.webp": "6bdb72be2ebf", "manga/p5.webp": "36da280dd8fe", "manga/p6.webp": "e58d4515c604", "manga/umi_face.webp": "b2fab83561da", "manifest.webmanifest": "ef4dca99875a", "manual.html": "a08d4327408a", "title/chars.webp": "aa00de6d888d", "title/logo.webp": "0b176e49f711"}, HKEY = '__hfgp_hash__';
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
