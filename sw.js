/* 体験版 service worker (written by tools/build_trial.py — edit the template, not trial/sw.js).
   First start: every file of the game is saved on the device; after that the game starts from there, with or without the
   network (no more 3D 組み立て waiting on a slow Wi-Fi). A new trial version (TRIAL.ver) is fetched quietly in the
   background and used from the next start; the old copy is then deleted. The ranking server is never cached. */
const VER = 't171', CACHE = 'hfgp-trial-' + VER;
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
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES.map(f => new Request(f, { cache: 'reload' })))).then(() => self.skipWaiting()));
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
  e.respondWith(caches.open(CACHE).then(c => c.match(r, { ignoreSearch: same }).then(hit => hit || fetch(r).then(res => {
    if (res && (res.ok || res.type === 'opaque')) c.put(r, res.clone());
    return res;
  }).catch(() => hit || (r.mode === 'navigate' ? c.match('index.html') : Response.error())))));
});
