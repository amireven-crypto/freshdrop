/* FreshDrop cinema layer: WebGL stages (hero + spin configurator).
   Original code. Look inspired by the free GetLayers "Flow Wave" scene description
   (mint particle hills) and Textura-style 3D product configurators; nothing copied.
   three.js (MIT) is bundled in. The product model is built here from primitives. */
import {
  WebGLRenderer, Scene, PerspectiveCamera, Group, Mesh, CylinderGeometry, TorusGeometry,
  SphereGeometry, CircleGeometry, BoxGeometry, RingGeometry, MeshStandardMaterial, MeshPhysicalMaterial,
  Color, PMREMGenerator, Points, BufferGeometry, Float32BufferAttribute, ShaderMaterial,
  AdditiveBlending, NormalBlending, IcosahedronGeometry, OctahedronGeometry, TorusKnotGeometry,
  DirectionalLight, AmbientLight, SRGBColorSpace, ACESFilmicToneMapping, Vector3, Raycaster, Vector2, Plane
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export const FINISHES = {
  black:  { color: 0x23252b, metalness: 0.35, roughness: 0.42 },
  silver: { color: 0xd5d8de, metalness: 0.92, roughness: 0.24 },
  grey:   { color: 0x7a7f89, metalness: 0.55, roughness: 0.36 }
};
const easeOut = t => 1 - Math.pow(1 - t, 4);          // strong ease-out (snap together)
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

/* ---------- the product: Magnetic Dashboard Phone Mount (stylised) ---------- */
function buildMount(finish) {
  const body = new MeshStandardMaterial({ ...FINISHES[finish] });
  const ballM = new MeshStandardMaterial({ ...FINISHES[finish] });
  ballM.roughness = Math.max(0.12, ballM.roughness - 0.15);
  const pad = new MeshStandardMaterial({ color: 0x131418, roughness: 0.92, metalness: 0 });
  const ringM = new MeshStandardMaterial({ color: 0x2a2c33, roughness: 0.6, metalness: 0.2 });
  const g = new Group();
  const parts = [];
  const add = (mesh, pos, off, rot) => {
    mesh.position.copy(pos); mesh.userData.home = pos.clone(); mesh.userData.off = off;
    mesh.userData.rot = rot || 0; g.add(mesh); parts.push(mesh); return mesh;
  };
  // round weighted base (sits on the dashboard), knurl hinted by a ring of fine ribs
  const baseG = new Group();
  baseG.add(new Mesh(new CylinderGeometry(0.55, 0.58, 0.42, 72), body));
  const cap = new Mesh(new CylinderGeometry(0.5, 0.5, 0.02, 72), ballM); cap.position.y = 0.22; baseG.add(cap);
  const rib = new Mesh(new TorusGeometry(0.565, 0.012, 6, 96), ringM); rib.rotation.x = Math.PI / 2; rib.position.y = -0.1; baseG.add(rib);
  const rib2 = rib.clone(); rib2.position.y = 0.05; baseG.add(rib2);
  add(baseG, new Vector3(0, 0.21, 0), new Vector3(0, -0.75, 0.3), 0.5);
  // lower hinge + long link
  const h1 = new Mesh(new CylinderGeometry(0.13, 0.13, 0.34, 32), ballM); h1.rotation.z = Math.PI / 2;
  add(h1, new Vector3(0, 0.52, -0.05), new Vector3(0.6, -0.5, -0.2), 0.9);
  const l1 = new Mesh(new BoxGeometry(0.24, 0.86, 0.1), body); l1.rotation.x = -0.22;
  add(l1, new Vector3(0, 0.93, -0.14), new Vector3(-0.7, -0.15, -0.4), -0.5);
  // upper hinge + short link
  const h2 = new Mesh(new CylinderGeometry(0.12, 0.12, 0.32, 32), ballM); h2.rotation.z = Math.PI / 2;
  add(h2, new Vector3(0, 1.34, -0.23), new Vector3(0.7, 0.2, -0.5), -0.8);
  const l2 = new Mesh(new BoxGeometry(0.22, 0.48, 0.09), body); l2.rotation.x = 0.55;
  add(l2, new Vector3(0, 1.52, -0.1), new Vector3(-0.6, 0.35, 0.2), 0.6);
  // head collar
  const collar = new Mesh(new CylinderGeometry(0.2, 0.22, 0.16, 40), body); collar.rotation.x = Math.PI / 2;
  add(collar, new Vector3(0, 1.66, 0.06), new Vector3(0.45, 0.45, 0.7), -0.6);
  // magnetic head: back shell + rim + rubber front + magnet ring
  const head = new Group();
  const shell = new Mesh(new CylinderGeometry(0.76, 0.76, 0.13, 80), body); shell.rotation.x = Math.PI / 2; head.add(shell);
  const rim = new Mesh(new TorusGeometry(0.76, 0.055, 18, 96), body); head.add(rim);
  const front = new Mesh(new CircleGeometry(0.7, 80), pad); front.position.z = 0.067; head.add(front);
  const ring = new Mesh(new RingGeometry(0.38, 0.44, 72), ringM); ring.position.z = 0.069; head.add(ring);
  add(head, new Vector3(0, 1.72, 0.2), new Vector3(0.15, 0.55, 1.6), 1.1);
  g.userData = { parts, mats: [body, ballM] };
  return g;
}
function setFinishOn(g, finish) {
  const f = FINISHES[finish]; if (!f) return;
  g.userData.mats.forEach((m, i) => {
    m.color.setHex(f.color); m.metalness = f.metalness;
    m.roughness = i === 1 ? Math.max(0.12, f.roughness - 0.15) : f.roughness;
  });
}
function applyExplode(g, k) { // k: 0 assembled .. 1 exploded
  for (const p of g.userData.parts) {
    p.position.copy(p.userData.home).addScaledVector(p.userData.off, k);
    p.rotation.z = p.userData.rot * k;
  }
}

/* ---------- particle hills (hero ground) ---------- */
function buildWave(dense) {
  const NX = dense ? 170 : 96, NZ = dense ? 84 : 52, pos = [];
  for (let i = 0; i < NX; i++) for (let j = 0; j < NZ; j++) pos.push((i / (NX - 1) - 0.5) * 64, 0, -44 + (j / (NZ - 1)) * 52);
  const geo = new BufferGeometry(); geo.setAttribute('position', new Float32BufferAttribute(pos, 3));
  const mat = new ShaderMaterial({
    transparent: true, depthWrite: false,
    uniforms: { uTime: { value: 0 }, uSize: { value: 2.2 }, uPR: { value: 1 }, uA: { value: new Color() }, uB: { value: new Color() }, uAlpha: { value: 0.9 } },
    vertexShader: `uniform float uTime,uSize,uPR;varying float vH,vF;
      void main(){vec3 p=position;float w=sin(p.x*.32+uTime*.55)*.55+sin(p.z*.45+uTime*.4)*.42+sin((p.x+p.z)*.2+uTime*.28)*.75;
      p.y+=w;vH=w;vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;
      gl_PointSize=uSize*uPR*(9./-mv.z);vF=smoothstep(52.,7.,-mv.z)*smoothstep(1.5,7.,-mv.z);}`,
    fragmentShader: `uniform vec3 uA,uB;uniform float uAlpha;varying float vH,vF;
      void main(){vec2 c=gl_PointCoord-.5;float d=length(c);if(d>.5)discard;
      float a=smoothstep(.5,.1,d)*vF*uAlpha;gl_FragColor=vec4(mix(uA,uB,clamp(vH*.45+.5,0.,1.)),a);}`
  });
  const pts = new Points(geo, mat); pts.position.y = -2.6; return pts;
}

/* ---------- glowing translucent "portal" shapes ---------- */
function buildPortals() {
  const g = new Group();
  const mk = (geo, col, p, s) => {
    const m = new Mesh(geo, new MeshPhysicalMaterial({ color: col, emissive: col, emissiveIntensity: 0.35, roughness: 0.15,
      metalness: 0, clearcoat: 1, transparent: true, opacity: 0.55 }));
    m.position.copy(p); m.scale.setScalar(s); m.userData.base = p.clone(); m.userData.ph = Math.random() * 6; g.add(m); return m;
  };
  mk(new TorusGeometry(0.42, 0.15, 24, 64), 0xff5fa2, new Vector3(-1.05, 1.45, -1.3), 1);
  mk(new IcosahedronGeometry(0.36, 0), 0x22c7d6, new Vector3(1.45, 1.3, -1.1), 1);
  mk(new OctahedronGeometry(0.3, 0), 0xffc83d, new Vector3(1.35, -0.9, 0.3), 1);
  mk(new TorusKnotGeometry(0.18, 0.06, 80, 12), 0x8f7bff, new Vector3(-1.1, -0.95, 0.2), 1);
  return g;
}

function palette(dark) {
  return dark
    ? { a: 0x0fd6a6, b: 0x4fe3ff, alpha: 0.95, blend: AdditiveBlending, plinth: 0x173045, exposure: 1.05 }
    : { a: 0x0e9f86, b: 0xff6fa8, alpha: 0.55, blend: NormalBlending, plinth: 0xbff0e2, exposure: 1.0 };
}

/* ---------- stage factory ---------- */
export function createStage(canvas, opts) {
  const { mode, reduce, anchor } = opts;
  let dark = !!opts.dark, finish = opts.finish || 'black';
  const small = Math.min(innerWidth, innerHeight) < 600;
  const renderer = new WebGLRenderer({ canvas, antialias: !small, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, small ? 1.5 : 1.75));
  renderer.outputColorSpace = SRGBColorSpace; renderer.toneMapping = ACESFilmicToneMapping;
  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.add(new AmbientLight(0xffffff, 0.35));
  const key = new DirectionalLight(0xffffff, 1.6); key.position.set(3, 5, 6); scene.add(key);
  const rimL = new DirectionalLight(0x7fe9ff, 1.2); rimL.position.set(-5, 2, -4); scene.add(rimL);

  const cam = new PerspectiveCamera(mode === 'hero' ? 35 : 30, 1, 0.1, 120);
  const rig = new Group(); scene.add(rig);           // product rig (position/scale)
  const spin = new Group(); rig.add(spin);           // user/auto rotation
  const mount = buildMount(finish); mount.position.y = mode === 'hero' ? -1.15 : -0.62; spin.add(mount);
  let wave = null, portals = null, plinth = null;
  if (mode === 'hero') { wave = buildWave(!small); scene.add(wave); portals = buildPortals(); rig.add(portals); cam.position.set(0, 1.1, 9); cam.lookAt(0, 0, 0); }
  else {
    plinth = new Mesh(new CylinderGeometry(1.25, 1.32, 0.55, 72), new MeshStandardMaterial({ color: 0xbff0e2, roughness: 0.55, metalness: 0.05 }));
    plinth.position.y = -0.9; rig.add(plinth);
    const lip = new Mesh(new TorusGeometry(1.25, 0.03, 12, 96), new MeshStandardMaterial({ color: 0xffffff, roughness: 0.3, emissive: 0xffffff, emissiveIntensity: 0.15 }));
    lip.rotation.x = Math.PI / 2; lip.position.y = -0.62; rig.add(lip);
    cam.position.set(0, 1.5, 8.4); cam.lookAt(0, 0.3, 0);
  }
  function theme() {
    const p = palette(dark);
    if (wave) { wave.material.uniforms.uA.value.setHex(p.a); wave.material.uniforms.uB.value.setHex(p.b); wave.material.uniforms.uAlpha.value = p.alpha; wave.material.blending = p.blend; wave.material.needsUpdate = true; }
    if (plinth) plinth.material.color.setHex(p.plinth);
    renderer.toneMappingExposure = p.exposure;
  }
  theme();

  // layout: hero puts the product over the anchor element (the old hero-art column)
  const ray = new Raycaster(), plane = new Plane(new Vector3(0, 0, 1), 0), hit = new Vector3();
  let W = 1, H = 1;
  function layout() {
    const r = canvas.getBoundingClientRect(); W = Math.max(1, r.width); H = Math.max(1, r.height);
    renderer.setSize(W, H, false); cam.aspect = W / H; cam.updateProjectionMatrix();
    if (mode === 'hero' && anchor) {
      const a = anchor.getBoundingClientRect();
      const cx = (a.left + a.width / 2 - r.left) / W * 2 - 1, cy = -((a.top + a.height / 2 - r.top) / H * 2 - 1);
      ray.setFromCamera(new Vector2(cx, cy), cam); ray.ray.intersectPlane(plane, hit); rig.position.copy(hit);
      const visH = 2 * cam.position.z * Math.tan(cam.fov * Math.PI / 360);
      const s = clamp((Math.min(a.height, a.width * 1.05) / H) * visH * 0.56 / 2.6, 0.35, 1.5); rig.scale.setScalar(s);
    } else { rig.position.set(0, 0, 0); rig.scale.setScalar(cam.aspect < 0.8 ? 0.9 : 1); }
    if (wave) wave.material.uniforms.uPR.value = renderer.getPixelRatio();
    draw();
  }

  // interaction state
  let rotY = mode === 'hero' ? -0.5 : -0.6, rotX = 0.08, velY = 0, tx = 0, ty = 0, px = 0, py = 0;
  let explode = 1, explodeTarget = 0, introT = reduce ? 1 : 0, slide = mode === 'spin' && !reduce ? 1 : 0;
  let running = false, raf = 0, last = 0, t = 0, dragging = false, lx = 0, ly = 0, idle = 0;
  if (reduce) { explode = 0; }
  applyExplode(mount, explode);

  function draw() {
    spin.rotation.set(rotX, rotY, 0);
    if (mode === 'hero') { rig.rotation.set(py * 0.08, px * 0.12, 0); }
    renderer.render(scene, cam);
  }
  function tick(now) {
    raf = 0; if (!running) return;
    const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016); last = now; t += dt;
    // assemble on entry (exploded -> snapped together, strong ease-out)
    if (introT < 1) { introT = Math.min(1, introT + dt / 1.25); explode = 1 - easeOut(introT); if (introT >= 1) explode = 0; }
    else if (explode !== explodeTarget) { explode += (explodeTarget - explode) * Math.min(1, dt * 7); if (Math.abs(explode - explodeTarget) < 0.002) explode = explodeTarget; }
    applyExplode(mount, explode);
    if (slide > 0) { slide = Math.max(0, slide - dt / 0.9); const k = easeOut(1 - slide); rig.position.set((1 - k) * 2.4, (1 - k) * -1.6, 0); }
    if (!dragging) {
      idle += dt;
      if (Math.abs(velY) > 0.0005) { rotY += velY; velY *= 0.94; }
      else if (!reduce && (mode === 'hero' || idle > 2.5)) rotY += dt * 0.45;   // continuous Y spin like a floating can
      rotX += (0.08 - rotX) * Math.min(1, dt * 2);
    }
    px += (tx - px) * Math.min(1, dt * 4); py += (ty - py) * Math.min(1, dt * 4);
    if (wave) wave.material.uniforms.uTime.value = t;
    if (portals) portals.children.forEach((m, i) => { m.position.y = m.userData.base.y + Math.sin(t * 0.8 + m.userData.ph) * 0.12; m.rotation.x += dt * (0.2 + i * 0.07); m.rotation.y += dt * 0.3; });
    if (mode === 'hero') mount.position.y = -1.15 + Math.sin(t * 1.1) * 0.06;
    draw();
    raf = requestAnimationFrame(tick);
  }
  function setRunning(on) {
    if (reduce) { running = false; draw(); return; }
    if (on === running) return; running = on; last = 0;
    if (on && !raf) raf = requestAnimationFrame(tick);
  }

  // pointer: hero = parallax only; spin = drag to rotate
  const host = opts.input || canvas;
  if (mode === 'hero') {
    if (matchMedia('(hover: hover) and (pointer: fine)').matches) host.addEventListener('pointermove', e => {
      const r = host.getBoundingClientRect(); tx = (e.clientX - r.left) / r.width * 2 - 1; ty = (e.clientY - r.top) / r.height * 2 - 1;
    }, { passive: true });
  } else {
    host.addEventListener('pointerdown', e => { dragging = true; idle = 0; lx = e.clientX; ly = e.clientY; velY = 0; host.setPointerCapture && host.setPointerCapture(e.pointerId); host.classList.add('is-drag'); });
    host.addEventListener('pointermove', e => {
      if (!dragging) return; const dx = e.clientX - lx, dy = e.clientY - ly; lx = e.clientX; ly = e.clientY;
      velY = dx * 0.008; rotY += velY; rotX = clamp(rotX + dy * 0.006, -0.5, 0.6); if (reduce) draw();
    });
    const up = () => { if (!dragging) return; dragging = false; idle = 0; host.classList.remove('is-drag'); if (reduce) { velY = 0; draw(); } };
    host.addEventListener('pointerup', up); host.addEventListener('pointercancel', up);
  }
  const ro = new ResizeObserver(layout); ro.observe(canvas); if (anchor) ro.observe(anchor);
  layout();

  return {
    setFinish(f) { finish = f; setFinishOn(mount, f); draw(); },
    setExplode(on) { explodeTarget = on ? 1 : 0; introT = 1; if (reduce) { explode = explodeTarget; applyExplode(mount, explode); draw(); } else setRunning(true); },
    rotateBy(r) { rotY += r; idle = 0; draw(); },
    reset() { rotY = -0.6; rotX = 0.08; velY = 0; explodeTarget = 0; idle = 0; if (reduce) { explode = 0; applyExplode(mount, 0); } draw(); },
    setDark(d) { dark = d; theme(); draw(); },
    setRunning, layout,
    replayIntro() { if (reduce) return; introT = 0; explode = 1; if (mode === 'spin') slide = 1; setRunning(true); }
  };
}
