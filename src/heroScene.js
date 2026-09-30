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
    uniforms: { uMap: { value: map }, uTexel: { value: new THREE.Vector2(1 / 2400, 1 / 1117) }, uTime: { value: 0 }, uCensor: { value: CENSOR }, uBlue: { value: NEON_BLUE }, uPink: { value: NEON_PINK }, uCyan: { value: NEON_CYAN } },
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: `
      uniform sampler2D uMap;
      uniform vec2 uTexel;
      uniform float uTime;
      uniform vec3 uBlue, uPink, uCyan;
      uniform vec2 uCensor;
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
        gl_FragColor = vec4(col, 1.0);
      }
    `,
    toneMapped: false,
  });

function plinthParts() {
  // a squared stone pedestal: body and cap
  return [
    { geo: new RoundedBoxGeometry(1.25, 1.6, 1.1, 3, 0.025), y: -0.87 },
    { geo: new RoundedBoxGeometry(1.4, 0.12, 1.24, 3, 0.025), y: -0.03 },
  ];
}

export function createHeroScene(canvas, { reduced, onReady }) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
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

  const fresco = new THREE.TextureLoader().load('/art/creation-of-adam.webp');
  fresco.colorSpace = THREE.SRGBColorSpace;
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
      onReady?.();
    },
    undefined,
    () => onReady?.()
  );

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
    const coverW = Math.max(viewW, viewH * imgAspect) * 1.18;
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
    backdrop.position.x = (wide ? 1.1 : 0.4) - mx * 0.6;
    backdrop.position.y = 0.6 + my * 0.3;
    holo.uniforms.uTime.value = reduced ? 1.5 : t;
    neonBackdrop.material.uniforms.uTime.value = reduced ? 1.5 : t;
    neonBackdrop.position.copy(backdrop.position);
    neonBackdrop.scale.copy(backdrop.scale);
    floorGrid.position.z = reduced ? 0 : (t * 0.25) % 0.5;

    const w = canvas.clientWidth, h = canvas.clientHeight;
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
    // where the censored spot lands on the canvas, in CSS pixels
    censorPoint() {
      probe.set(
        backdrop.position.x + (CENSOR.x - 0.5) * backdrop.scale.x,
        backdrop.position.y + (CENSOR.y - 0.5) * backdrop.scale.y,
        backdrop.position.z
      ).project(camera);
      return { x: ((probe.x + 1) / 2) * canvas.clientWidth, y: ((1 - probe.y) / 2) * canvas.clientHeight };
    },
    dispose() {
      window.removeEventListener('resize', resize);
      renderer.dispose();
      pmrem.dispose();
    },
  };
}
