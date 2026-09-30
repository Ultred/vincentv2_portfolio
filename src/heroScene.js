import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

// One bust, two renders from the same camera: marble for people, a neon scan for the machine.
const NEON_BLUE = new THREE.Color('#2b4bff');
const NEON_PINK = new THREE.Color('#ff2bd6');
const NEON_CYAN = new THREE.Color('#3df5ff');
// where Adam's modesty sits on the fresco texture (u, v from bottom-left)
const CENSOR = new THREE.Vector2(0.179, 0.25);
// the gap between the two fingertips, and God's head: two more things only the machine remarks on
const SPARK = new THREE.Vector2(0.378, 0.556);
const GOD = new THREE.Vector2(0.588, 0.8);

const hologram = () =>
  new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uBlue: { value: NEON_BLUE }, uPink: { value: NEON_PINK }, uCyan: { value: NEON_CYAN } },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vView;
      varying float vY;
      void main() {
        vec4 world = modelMatrix * vec4(position, 1.0);
        vec4 view = viewMatrix * world;
        vNormal = normalize(normalMatrix * normal);
        vView = normalize(-view.xyz);
        vY = world.y;
        gl_Position = projectionMatrix * view;
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uBlue, uPink, uCyan;
      varying vec3 vNormal;
      varying vec3 vView;
      varying float vY;
      void main() {
        float fres = pow(1.0 - abs(dot(normalize(vNormal), vView)), 2.0);
        float band = smoothstep(0.93, 1.0, fract(vY * 18.0 - uTime * 0.7));
        float sweep = exp(-abs(fract(uTime * 0.18) * 3.2 - 0.6 - vY) * 6.0);
        vec3 col = mix(uBlue, uPink, fres) * (0.18 + fres * 1.5);
        col += uCyan * (band * 0.55 + sweep * 0.7);
        gl_FragColor = vec4(col, 1.0);
      }
    `,
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: false,
  });

// the fresco's neon twin: its own brushwork traced as glowing line, same texture, same place
const neonFresco = (map) =>
  new THREE.ShaderMaterial({
    uniforms: { uMap: { value: map }, uTexel: { value: new THREE.Vector2(1 / 2400, 1 / 1117) }, uTime: { value: 0 }, uCensor: { value: CENSOR }, uSpark: { value: SPARK }, uBlue: { value: NEON_BLUE }, uPink: { value: NEON_PINK }, uCyan: { value: NEON_CYAN } },
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: `
      uniform sampler2D uMap;
      uniform vec2 uTexel;
      uniform float uTime;
      uniform vec3 uBlue, uPink, uCyan;
      uniform vec2 uCensor;
      uniform vec2 uSpark;
      varying vec2 vUv;
      float lum(vec2 o) { return dot(texture2D(uMap, vUv + o * uTexel * 1.6).rgb, vec3(0.299, 0.587, 0.114)); }
      void main() {
        float gx = -lum(vec2(-1, -1)) - 2.0 * lum(vec2(-1, 0)) - lum(vec2(-1, 1)) + lum(vec2(1, -1)) + 2.0 * lum(vec2(1, 0)) + lum(vec2(1, 1));
        float gy = -lum(vec2(-1, -1)) - 2.0 * lum(vec2(0, -1)) - lum(vec2(1, -1)) + lum(vec2(-1, 1)) + 2.0 * lum(vec2(0, 1)) + lum(vec2(1, 1));
        float edge = smoothstep(0.08, 0.45, length(vec2(gx, gy)));
        float base = lum(vec2(0.0));
        vec3 tint = mix(uBlue, uPink, smoothstep(0.2, 0.9, vUv.x * 0.7 + base * 0.5));
        float scan = exp(-abs(vUv.y - fract(1.0 - uTime * 0.06)) * 40.0);
        vec3 col = tint * edge * 1.35 + uBlue * base * 0.08 + uCyan * scan * (0.15 + edge * 0.8);
        // Adam gets the Braghettone treatment: the machine keeps safe search on
        vec2 d = (vUv - uCensor) * vec2(2.15, 1.0);
        if (length(d) < 0.028) {
          vec2 block = floor(vUv * vec2(260.0, 121.0));
          float r = fract(sin(dot(block, vec2(12.9898, 78.233))) * 43758.5453);
          col = mix(uBlue * 0.7, uPink, step(0.5, r)) * (0.6 + 0.4 * r);
        }
        // the spark between the fingertips: a white-hot core, a pink halo, and long anamorphic streaks
        vec2 s = (vUv - uSpark) * vec2(2.15, 1.0);
        float pulse = 0.85 + 0.15 * sin(uTime * 2.4);
        float d0 = length(s);
        float core = exp(-d0 * 160.0);
        float halo = exp(-d0 * 22.0);
        float streakX = exp(-abs(s.y) * 420.0) * exp(-abs(s.x) * 6.0);
        float streakY = exp(-abs(s.x) * 700.0) * exp(-abs(s.y) * 16.0);
        float diag = (exp(-abs(s.x - s.y) * 520.0) + exp(-abs(s.x + s.y) * 520.0)) * exp(-d0 * 20.0);
        col += (vec3(1.0) * core * 3.0 + uPink * halo * 1.1 + uCyan * (streakX * 1.4 + streakY * 1.0) + vec3(0.95, 0.85, 1.0) * diag * 0.8) * pulse;
        gl_FragColor = vec4(col, 1.0);
      }
    `,
    toneMapped: false,
  });

// the machine's joke on the bust: a bubble of pink gum, glossy at the rim, lit from the upper left
const gum = () =>
  new THREE.ShaderMaterial({
    uniforms: { uPink: { value: NEON_PINK }, uCyan: { value: NEON_CYAN }, uFade: { value: 1 } },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vView;
      void main() {
        vec4 view = modelViewMatrix * vec4(position, 1.0);
        vNormal = normalize(normalMatrix * normal);
        vView = normalize(-view.xyz);
        gl_Position = projectionMatrix * view;
      }
    `,
    fragmentShader: `
      uniform vec3 uPink, uCyan;
      uniform float uFade;
      varying vec3 vNormal;
      varying vec3 vView;
      void main() {
        vec3 n = normalize(vNormal);
        float fres = pow(1.0 - abs(dot(n, vView)), 2.2);
        float shine = pow(max(dot(reflect(-normalize(vec3(-0.5, 0.7, 0.6)), n), vView), 0.0), 36.0);
        vec3 gum = vec3(1.0, 0.36, 0.72);
        vec3 col = mix(gum * 0.78, uPink, fres) + vec3(1.0) * shine * 0.9;
        float alpha = clamp(0.86 + fres * 0.14 + shine, 0.0, 1.0);
        gl_FragColor = vec4(col, alpha * uFade);
      }
    `,
    transparent: true,
    depthWrite: false,
    toneMapped: false,
  });

function plinthParts() {
  // a squared stone pedestal: body and cap
  return [
    { geo: new RoundedBoxGeometry(1.25, 1.6, 1.1, 3, 0.025), y: -0.87 },
    { geo: new RoundedBoxGeometry(1.4, 0.12, 1.24, 3, 0.025), y: -0.03 },
  ];
}

export function createHeroScene(canvas, { reduced, onReady, onProgress, art }) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.innerWidth < 820 ? 1.25 : 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.autoClear = false;

  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 60);
  const lookAt = new THREE.Vector3(0, 0.55, 0);

  // the human scene
  const human = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  human.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  human.environmentIntensity = 0.5;
  human.add(new THREE.AmbientLight(0xffffff, 0.12));
  const key = new THREE.DirectionalLight(0xffffff, 2.8);
  key.position.set(-3.2, 5, 4);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.left = -3;
  key.shadow.camera.right = 3;
  key.shadow.camera.top = 3;
  key.shadow.camera.bottom = -3;
  key.shadow.radius = 4;
  key.shadow.bias = -0.0004;
  human.add(key);
  const rim = new THREE.DirectionalLight(0xffffff, 1.7);
  rim.position.set(3.5, 2.5, -4);
  human.add(rim);

  // the painting is already on the page as an <img>; reuse it rather than fetching and decoding it again
  const fresco = new THREE.Texture();
  fresco.colorSpace = THREE.SRGBColorSpace;
  const setArt = (img) => {
    fresco.image = img;
    fresco.needsUpdate = true;
  };
  if (art?.complete && art.naturalWidth) setArt(art);
  else if (art) art.addEventListener('load', () => setArt(art), { once: true });
  else new THREE.ImageLoader().load('/art/creation-of-adam.webp', setArt);
  const backdrop = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({ map: fresco, color: 0x7a7a7a, toneMapped: false })
  );
  backdrop.position.z = -7;
  human.add(backdrop);

  const stone = new THREE.MeshStandardMaterial({ color: 0x8e8c87, roughness: 0.88, metalness: 0 });
  const humanStage = new THREE.Group();
  human.add(humanStage);

  // the machine scene
  const machine = new THREE.Scene();
  machine.background = new THREE.Color('#05040a');
  const machineStage = new THREE.Group();
  machine.add(machineStage);
  const floorGrid = new THREE.GridHelper(24, 48, NEON_PINK, NEON_BLUE);
  floorGrid.position.y = -1.1;
  floorGrid.material.transparent = true;
  floorGrid.material.opacity = 0.35;
  machine.add(floorGrid);
  const neonBackdrop = new THREE.Mesh(backdrop.geometry, neonFresco(fresco));
  machine.add(neonBackdrop);

  const holo = hologram();
  const edgeMat = new THREE.LineBasicMaterial({ color: NEON_PINK, transparent: true, opacity: 0.9 });
  for (const part of plinthParts()) {
    const m = new THREE.Mesh(part.geo, stone);
    m.position.y = part.y;
    m.castShadow = true;
    m.receiveShadow = true;
    humanStage.add(m);
    const lines = new THREE.LineSegments(new THREE.EdgesGeometry(part.geo, 30), edgeMat);
    lines.position.y = part.y;
    machineStage.add(lines);
  }

  const state = {
    mouse: new THREE.Vector2(),
    target: new THREE.Vector2(),
    scroll: 0,
    intro: reduced ? 1 : 0,
    lens: null,
  };

  // the gum bubble: only in the machine scene, anchored at the lips once the bust has loaded
  const bubbleMat = gum();
  const bubbleWire = new THREE.MeshBasicMaterial({ color: NEON_CYAN, wireframe: true, transparent: true, opacity: 0.08, blending: THREE.AdditiveBlending, depthWrite: false });
  const bubbleGeo = new THREE.SphereGeometry(1, 40, 24);
  const bubble = new THREE.Group();
  bubble.add(new THREE.Mesh(bubbleGeo, bubbleMat), new THREE.Mesh(bubbleGeo, bubbleWire));
  // always drawn over the additive hologram, so the gum stays pink instead of washing out
  bubble.children.forEach((m) => (m.renderOrder = 10));
  // a thin ring that flashes out when it pops
  const popMat = new THREE.MeshBasicMaterial({ color: NEON_PINK, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
  const pop = new THREE.Mesh(new THREE.RingGeometry(0.96, 1, 48), popMat);
  // the burst: shreds of gum that fly out, spin and fall
  const SHREDS = 26;
  const shredGeo = new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute([-0.5, -0.4, 0, 0.5, -0.3, 0, 0.05, 0.6, 0], 3));
  const shredMat = new THREE.MeshBasicMaterial({ color: NEON_PINK, transparent: true, opacity: 1, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
  const shreds = new THREE.InstancedMesh(shredGeo, shredMat, SHREDS);
  shreds.frustumCulled = false;
  // fixed, evenly spread directions so every pop looks alike
  const shredDirs = Array.from({ length: SHREDS }, (_, i) => {
    const a = i * 2.39996, z = 1 - ((i + 0.5) / SHREDS) * 2;
    const rr = Math.sqrt(1 - z * z);
    return { d: new THREE.Vector3(Math.cos(a) * rr, z, Math.sin(a) * rr), v: 0.9 + ((i * 37) % 11) / 11, spin: new THREE.Euler(i, i * 1.7, i * 0.6) };
  });
  const shredM = new THREE.Matrix4(), shredQ = new THREE.Quaternion(), shredP = new THREE.Vector3(), shredS = new THREE.Vector3(), shredE = new THREE.Euler();
  pop.renderOrder = shreds.renderOrder = 10;
  bubble.visible = pop.visible = shreds.visible = false;
  machineStage.add(bubble, pop, shreds);
  const mouth = { at: new THREE.Vector3(), out: new THREE.Vector3(0, 0, 1), ready: false };
  const BUBBLE_R = 0.16;
  // grows while the lens is over the face, strains, pops, and starts again
  const blow = { size: 0, popAt: -1, popT: 0, last: 0 };
  const popCenter = new THREE.Vector3();
  const mouthOnCanvas = new THREE.Vector3();

  // find the lips on the model: scan the front half of the head for the point that sticks out
  // furthest (the nose tip), then walk down that same line to the chin; the lips sit between
  function findMouth(model) {
    model.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(model);
    const cx = (box.min.x + box.max.x) / 2, cz = (box.min.z + box.max.z) / 2;
    const ray = new THREE.Raycaster();
    const o = new THREE.Vector3(), d = new THREE.Vector3();
    const reach = (y, a) => {
      o.set(cx + Math.sin(a) * 4, y, cz + Math.cos(a) * 4);
      d.set(-Math.sin(a), 0, -Math.cos(a));
      ray.set(o, d);
      const hit = ray.intersectObject(model, true)[0];
      return hit ? { y, a, r: Math.hypot(hit.point.x - cx, hit.point.z - cz), p: hit.point.clone() } : null;
    };
    let nose = null;
    for (let y = box.max.y - 0.55; y <= box.max.y - 0.12; y += 0.01) {
      for (let a = -Math.PI / 2; a <= Math.PI / 2; a += Math.PI / 90) {
        const h = reach(y, a);
        if (h && (!nose || h.r > nose.r)) nose = h;
      }
    }
    if (!nose) return;
    // follow that line down the face. Below the nose tip the profile dips (under the nose), rises
    // (upper lip), and dips again: that second dip is the line between the lips, where the gum comes out
    const line = [];
    for (let y = nose.y + 0.08; y >= nose.y - 0.34; y -= 0.004) {
      const h = reach(y, nose.a);
      if (h) line.push(h);
    }
    if (line.length < 10) return;
    const tipAt = line.reduce((best, h, i) => (h.r > line[best].r ? i : best), 0);
    const dips = [];
    for (let i = tipAt + 1; i < line.length - 1; i++) {
      const rest = line.slice(i + 1, i + 9).map((h) => h.r);
      if (line[i].r <= line[i - 1].r && line[i].r < line[i + 1].r && Math.max(...rest) - line[i].r > 0.004) dips.push(line[i]);
    }
    // dips closer than 3cm are one feature (the underside of the nose is a little ragged); keep the deepest
    const features = [];
    for (const dip of dips) {
      const last = features[features.length - 1];
      if (last && last.y - dip.y < 0.03) {
        if (dip.r < last.r) features[features.length - 1] = dip;
      } else features.push(dip);
    }
    const lips = features[1] ?? features[0];
    if (!lips) return;
    mouth.at.copy(lips.p);
    mouth.out.set(Math.sin(nose.a), -0.12, Math.cos(nose.a)).normalize();
    mouth.ready = true;
    state.face = { tip: line[tipAt].y.toFixed(3), dips: features.map((h) => h.y.toFixed(3)), lips: lips.y.toFixed(3) };
  }


  new GLTFLoader().load(
    '/models/bust/marble_bust_01_1k.gltf',
    (gltf) => {
      const src = gltf.scene;
      const box = new THREE.Box3().setFromObject(src);
      const size = box.getSize(new THREE.Vector3());
      const s = 1.9 / size.y;
      src.scale.setScalar(s);
      box.setFromObject(src);
      const c = box.getCenter(new THREE.Vector3());
      src.position.set(-c.x, 0.06 - box.min.y, -c.z);
      src.traverse((o) => {
        if (!o.isMesh) return;
        o.castShadow = true;
        o.receiveShadow = true;
        o.material.envMapIntensity = 0.9;
      });
      humanStage.add(src);

      // the machine copy shares the geometry, dressed in light instead of marble
      const ghost = src.clone(true);
      const wireMat = new THREE.MeshBasicMaterial({ color: NEON_CYAN, wireframe: true, transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending, depthWrite: false });
      const meshes = [];
      ghost.traverse((o) => o.isMesh && meshes.push(o));
      for (const o of meshes) {
        o.material = holo;
        o.castShadow = false;
        o.add(new THREE.Mesh(o.geometry, wireMat));
      }
      machineStage.add(ghost);
      // measure on the model's own frame, before the stage moves it
      const probeModel = src.clone(true);
      findMouth(probeModel);
      onProgress?.(0.6);
      warmUp(src);
    },
    undefined,
    () => onReady?.()
  );

  // compile every shader and upload every texture before the intro plays, so neither the first frame
  // nor the first look through the lens stalls. Where the browser can, shaders compile off the main thread.
  function warmUp(model) {
    resize();
    camera.position.set(0, 0.95, 8);
    camera.lookAt(lookAt);
    const upload = () => {
      if (fresco.image) renderer.initTexture(fresco);
      model.traverse((o) => {
        if (!o.isMesh) return;
        for (const key of ['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'aoMap']) if (o.material[key]) renderer.initTexture(o.material[key]);
      });
    };
    const scenes = [human, machine];
    const compiled = renderer.compileAsync
      ? Promise.all(scenes.map((sc) => renderer.compileAsync(sc, camera)))
      : Promise.resolve(scenes.forEach((sc) => renderer.compile(sc, camera)));
    compiled
      .then(() => onProgress?.(0.9))
      .then(upload)
      .catch(() => {})
      .finally(() => onReady?.());
  }

  let dpr = 1, wide = true;
  function resize() {
    dpr = renderer.getPixelRatio();
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    wide = camera.aspect > 1.05;
    // the backdrop always covers the frame at its depth, with room to drift
    const viewH = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * 13.2;
    const viewW = viewH * camera.aspect;
    const imgAspect = 3572 / 1663;
    // phones are tall, so the fresco needs more room above the camera
    const coverW = Math.max(viewW, viewH * imgAspect) * (wide ? 1.18 : 1.55);
    backdrop.scale.set(coverW, coverW / imgAspect, 1);
  }

  function frame(time) {
    if (renderer.domElement.width !== Math.round(canvas.clientWidth * dpr)) resize();
    const t = time / 1000;
    const k = reduced ? 1 : 0.05;
    state.mouse.lerp(state.target, k);
    const mx = state.mouse.x, my = state.mouse.y;

    // camera eases in on load and drifts with the pointer
    const intro = state.intro;
    const baseZ = wide ? 6.2 : 8.4;
    camera.position.set(mx * 0.45, 0.95 - my * 0.2 + state.scroll * 0.6, baseZ + (1 - intro) * 2.2);
    lookAt.set(0, wide ? 0.75 : 1.05, 0);
    camera.lookAt(lookAt);

    const stageX = wide ? 1.15 : 0;
    const spin = (reduced ? 0 : Math.sin(t * 0.22) * 0.1) - 0.4 + mx * 0.3 + state.scroll * 1.1;
    for (const stage of [humanStage, machineStage]) {
      stage.position.set(stageX, wide ? -0.55 : 0.2, 0);
      stage.rotation.y = spin;
    }
    // on phones the fresco sits a little right, so the spark between the fingertips stays on screen
    backdrop.position.x = (wide ? 1.1 : 1.65) - mx * 0.6;
    backdrop.position.y = (wide ? 0.6 : 1.05) + my * 0.3;
    holo.uniforms.uTime.value = reduced ? 1.5 : t;
    neonBackdrop.material.uniforms.uTime.value = reduced ? 1.5 : t;
    neonBackdrop.position.copy(backdrop.position);
    neonBackdrop.scale.copy(backdrop.scale);
    floorGrid.position.z = reduced ? 0 : (t * 0.25) % 0.5;

    const w = canvas.clientWidth, h = canvas.clientHeight;

    // blow the bubble while the lens covers the lips
    if (mouth.ready) {
      machineStage.updateMatrixWorld(true);
      mouthOnCanvas.copy(mouth.at).applyMatrix4(machineStage.matrixWorld).project(camera);
      const mxp = ((mouthOnCanvas.x + 1) / 2) * w, myp = ((1 - mouthOnCanvas.y) / 2) * h;
      state.mouthPx = { x: mxp, y: myp };
      const L = state.lens;
      const pad = 24;
      const over = !!L && mxp > L.left - pad && mxp < L.right + pad && myp > L.top - pad && myp < L.bottom + pad;
      // real time, not frames, so a slow phone blows at the same pace
      const dt = Math.min(0.1, blow.last ? t - blow.last : 0);
      blow.last = t;
      if (reduced) {
        blow.size = over ? 1 : 0;
      } else if (blow.popAt >= 0) {
        // after a pop, a short pause before the next breath
        if (t - blow.popAt > 1.3) blow.popAt = -1;
      } else if (over) {
        blow.size = Math.min(1.12, blow.size + dt * 0.8 * (1.25 - blow.size));
        if (blow.size > 1.1) {
          blow.popAt = blow.popT = t;
          popCenter.copy(mouth.at).addScaledVector(mouth.out, BUBBLE_R * blow.size * 0.8);
          blow.size = 0;
        }
      } else {
        blow.size = Math.max(0, blow.size - dt * 2.4);
      }
      // it quivers harder as it nears bursting
      const strain = Math.max(0, blow.size - 0.85) * 4;
      const wobble = reduced ? 1 : 1 + Math.sin(t * (9 + strain * 30)) * (0.02 + strain * 0.03) * blow.size;
      const rad = BUBBLE_R * blow.size;
      bubble.visible = rad > 0.004;
      bubble.scale.set(rad * wobble, rad / wobble, rad * wobble);
      bubble.position.copy(mouth.at).addScaledVector(mouth.out, rad * 0.8);

      // the pop: a flash ring and shreds that fly and fall
      const since = t - blow.popT;
      const popping = !reduced && blow.popT > 0;
      pop.visible = popping && since < 0.3;
      if (pop.visible) {
        const k = since / 0.3;
        pop.position.copy(popCenter);
        pop.lookAt(camera.position);
        pop.scale.setScalar(BUBBLE_R * (1 + k * 1.6));
        popMat.opacity = (1 - k) ** 2;
      }
      shreds.visible = popping && since < 0.8;
      if (shreds.visible) {
        const k = since / 0.8;
        for (let i = 0; i < SHREDS; i++) {
          const sd = shredDirs[i];
          shredP.copy(popCenter).addScaledVector(sd.d, BUBBLE_R * (0.9 + sd.v * since * 3.2));
          shredP.y -= 1.4 * since * since;
          shredE.set(sd.spin.x + since * 9, sd.spin.y + since * 7, sd.spin.z);
          shredQ.setFromEuler(shredE);
          shredS.setScalar(0.035 * (1 - k * 0.7));
          shreds.setMatrixAt(i, shredM.compose(shredP, shredQ, shredS));
        }
        shreds.instanceMatrix.needsUpdate = true;
        shredMat.opacity = 1 - k * k;
      }
    }

    renderer.setScissorTest(false);
    renderer.setClearColor(0x0b0b0b, 1);
    renderer.clear();
    renderer.render(human, camera);

    // the machine view only exists inside the card
    const lens = state.lens;
    if (lens && lens.right > 0 && lens.bottom > 0 && lens.left < w && lens.top < h) {
      renderer.setScissorTest(true);
      renderer.setScissor(lens.left, h - lens.bottom, lens.width, lens.height);
      renderer.setClearColor(0x05040a, 1);
      renderer.clear();
      renderer.render(machine, camera);
      renderer.setScissorTest(false);
    }
  }

  window.addEventListener('resize', resize);
  resize();

  const probe = new THREE.Vector3();
  return {
    state,
    render: frame,
    // where a spot on the fresco lands on the canvas, in CSS pixels
    frescoPoint(uv = CENSOR) {
      probe.set(
        backdrop.position.x + (uv.x - 0.5) * backdrop.scale.x,
        backdrop.position.y + (uv.y - 0.5) * backdrop.scale.y,
        backdrop.position.z
      ).project(camera);
      return { x: ((probe.x + 1) / 2) * canvas.clientWidth, y: ((1 - probe.y) / 2) * canvas.clientHeight };
    },
    spots: { censor: CENSOR, spark: SPARK, god: GOD },
    dispose() {
      window.removeEventListener('resize', resize);
      renderer.dispose();
      pmrem.dispose();
    },
  };
}
