import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';
import { archive, site, work } from './content.js';
import Nav from './Nav.jsx';
import Player from './Player.jsx';
import Gallery from './Gallery.jsx';

const ROMAN = ['I', 'II', 'III', 'IV'];

// the 3D scene is its own chunk; start fetching it the moment the app boots, not after the first render
const heroSceneModule = import('./heroScene.js');

gsap.registerPlugin(ScrollTrigger, SplitText);

const prefersReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function seenBefore() {
  try {
    const seen = sessionStorage.getItem('vv-seen') === '1';
    sessionStorage.setItem('vv-seen', '1');
    return seen;
  } catch {
    return false;
  }
}

function useManilaTime() {
  const fmt = () =>
    new Intl.DateTimeFormat('en-GB', { timeZone: site.timeZone, hour: '2-digit', minute: '2-digit' }).format(new Date());
  const [time, setTime] = useState(fmt);
  useEffect(() => {
    const id = setInterval(() => setTime(fmt()), 15000);
    return () => clearInterval(id);
  }, []);
  return time;
}

function Arrow() {
  return (
    <svg className="arrow" viewBox="0 0 12 12" aria-hidden="true">
      <path d="M2.5 9.5 9.5 2.5M4 2.5h5.5V8" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function Grip() {
  return (
    <svg className="grip" viewBox="0 0 10 14" aria-hidden="true">
      {[2, 7, 12].map((y) => [3, 7].map((x) => <circle key={`${x}${y}`} cx={x} cy={y} r="1.1" fill="currentColor" />))}
    </svg>
  );
}

// the machine has opinions about the hour in Manila
function clockNote(time) {
  const h = Number(time.slice(0, 2));
  if (h < 6) return 'local time · human probably asleep';
  if (h < 9) return 'local time · coffee not found';
  return 'local time';
}

// The page is drawn twice: the human layer everyone reads, and an AI layer the card reveals.
function Sections({ ai, openScreens, active, shot, setShot, select, intend, step, videoOn, setVideoOn, time, canvasRef }) {
  const tag = (label) => (ai ? { 'data-ai': label } : {});
  const id = (name) => (ai ? undefined : name);
  return (
    <>
      <section id={id('top')} className="hero" aria-label={ai ? undefined : 'Introduction'}>
        {!ai && (
          <div className="hero-media">
            <canvas ref={canvasRef} className="hero-canvas" />
            <img className="hero-art" src="/art/creation-of-adam.webp" alt="" />
          </div>
        )}
        <div className="hero-foot">
          <p {...tag('location · 0.99')}>{site.place}</p>
          <p {...tag(clockNote(time))}>
            Manila <time>{time}</time>
          </p>
        </div>
      </section>

      <section id={id('work')} className="work" aria-labelledby={ai ? undefined : 'work-title'}>
        <div className="work-head">
          <h2 id={id('work-title')} className="work-title" {...tag('heading · 0.99')}>
            Work
          </h2>
          <p className="work-count" aria-hidden="true" {...tag('count: 3')}>
            III
          </p>
        </div>
        <div className="work-body">
          <ol className="rows">
            {work.map((w, i) => (
              <li key={w.title} className={`row ${active === i ? 'is-active' : ''}`}>
                <button
                  type="button"
                  className="row-select"
                  aria-pressed={active === i}
                  aria-controls={ai ? undefined : 'work-preview'}
                  tabIndex={ai ? -1 : undefined}
                  onClick={ai ? undefined : () => select(i)}
                  onPointerEnter={ai ? undefined : (ev) => ev.pointerType === 'mouse' && intend(i)}
                  onPointerLeave={ai ? undefined : () => intend(null)}
                >
                  <span className="row-no">{w.no}.</span>
                  <span className="row-title" {...tag(`project · ${(0.99 - i * 0.01).toFixed(2)}`)}>
                    {w.title}
                  </span>
                  <span className="row-line">{w.line}</span>
                  <span className="row-meta">
                    {w.kind} · {w.status}
                  </span>
                </button>
                <span className="row-shots">
                  {w.shots.map((sh) =>
                    sh.video ? (
                      <video key={sh.src} className={`row-shot ${sh.fit === 'contain' ? 'is-contain' : ''}`} src={sh.video} poster={sh.src} muted loop playsInline preload="none" aria-hidden="true" />
                    ) : (
                      <img key={sh.src} className={`row-shot ${sh.fit === 'contain' ? 'is-contain' : ''}`} src={sh.src} alt="" loading="lazy" decoding="async" {...tag('screenshot')} />
                    )
                  )}
                </span>
                <a className="row-visit" href={w.href} target="_blank" rel="noreferrer" tabIndex={ai ? -1 : undefined}>
                  Visit {w.title}
                  <Arrow />
                  {!ai && <span className="sr-only"> (opens in a new tab)</span>}
                </a>
              </li>
            ))}
          </ol>
          <figure className="preview" id={id('work-preview')}>
            <div className="preview-frame" {...tag(`${work[active].shots[shot]?.video ? 'video' : 'screenshot'} · ${work[active].title.toLowerCase()}`)}>
              {work.flatMap((w, i) =>
                w.shots.map((sh, j) => {
                  const current = active === i && shot === j;
                  const cls = `${current ? 'is-current' : ''} ${sh.fit === 'contain' ? 'is-contain' : ''}`;
                  return sh.video ? (
                    <video key={sh.src} className={cls} src={sh.video} poster={sh.src} muted loop playsInline preload="none" data-live={!ai && current && videoOn ? '' : undefined} aria-hidden="true" />
                  ) : (
                    <img key={sh.src} src={sh.src} alt="" className={cls} aria-hidden="true" loading="lazy" decoding="async" />
                  );
                })
              )}
              {work[active].shots[shot]?.video && !ai && (
                <button type="button" className="video-toggle" onClick={() => setVideoOn((v) => !v)} aria-label={videoOn ? 'Pause the video' : 'Play the video'}>
                  <svg viewBox="0 0 12 12" aria-hidden="true">
                    {videoOn ? <path d="M3 2h2v8H3zM7 2h2v8H7z" /> : <path d="M3 1.8 10 6 3 10.2Z" />}
                  </svg>
                </button>
              )}
            </div>
            <figcaption>
              <span className="num">{work[active].no}</span>
              <span>
                {work[active].title} — {work[active].kind}
              </span>
              <span className="ticks">
                <button type="button" onClick={ai ? undefined : () => step(-1)} aria-label="Previous shot" tabIndex={ai ? -1 : undefined}>
                  ‹
                </button>
                {work[active].shots.map((sh, j) => (
                  <button
                    key={sh.src}
                    type="button"
                    className={shot === j ? 'is-on' : ''}
                    onClick={ai ? undefined : () => setShot(j)}
                    aria-label={`Show ${work[active].title} ${sh.video ? 'video' : 'screenshot'} ${j + 1}`}
                    aria-pressed={shot === j}
                    tabIndex={ai ? -1 : undefined}
                  >
                    {ROMAN[j]}
                  </button>
                ))}
                <button type="button" onClick={ai ? undefined : () => step(1)} aria-label="Next shot" tabIndex={ai ? -1 : undefined}>
                  ›
                </button>
              </span>
            </figcaption>
          </figure>
        </div>
      </section>

      <section id={id('archive')} className="archive" aria-labelledby={ai ? undefined : 'archive-title'}>
        <div className="archive-bar">
          <h2 id={id('archive-title')} className="archive-title" {...tag('archive · v1')}>
            Archive
          </h2>
          <p className="archive-line">Earlier builds.</p>
          <a className="row-visit" href={archive.href} target="_blank" rel="noreferrer" tabIndex={ai ? -1 : undefined}>
            See v1
            <Arrow />
            {!ai && <span className="sr-only"> (opens in a new tab)</span>}
          </a>
        </div>
        {/* one set of items, then copies, so the strip can loop without a seam even on wide screens */}
        <div className="ledger">
          <ol className="ledger-track">
            {[0, 1, 2].flatMap((set) =>
              archive.items.map((p) => {
                const copy = set > 0;
                const skip = ai || copy ? -1 : undefined;
                const inner = (
                  <>
                    <span className="entry-shot">
                      <img src={p.image} alt="" loading="lazy" decoding="async" />
                    </span>
                    <span className="entry-text">
                      <span className="entry-title">
                        <span className="entry-no">{p.no}.</span> {p.title}
                      </span>
                      <span className={`entry-kind ${p.note ? 'is-note' : ''}`}>{ai && p.note ? '404 · gone fishing' : (p.note ?? p.kind)}</span>
                    </span>
                  </>
                );
                return (
                  <li key={`${p.title}-${set}`} className={`entry ${copy ? 'is-copy' : ''}`} aria-hidden={copy || undefined}>
                    {p.href ? (
                      <a href={p.href} target="_blank" rel="noreferrer" tabIndex={skip}>
                        {inner}
                        {!ai && <span className="sr-only"> (opens in a new tab)</span>}
                      </a>
                    ) : p.screens ? (
                      <button type="button" onClick={ai ? undefined : () => openScreens(p)} tabIndex={skip} aria-haspopup="dialog">
                        {inner}
                        {!ai && <span className="sr-only"> (see the screens)</span>}
                      </button>
                    ) : (
                      <div>{inner}</div>
                    )}
                  </li>
                );
              })
            )}
          </ol>
        </div>
      </section>

      <section id={id('contact')} className="contact" aria-labelledby={ai ? undefined : 'contact-title'}>
        <div className="contact-media">
          <img className="contact-art" src="/art/whistlejacket.webp" alt="" loading="lazy" decoding="async" />
          {ai && <span className="egg-box egg-horse" data-ai="dog · 0.51" />}
        </div>
        <div className="contact-body">
          <h2 id={id('contact-title')} className="hello" {...tag('greeting · 0.99')}>
            Hello.
          </h2>
          <p className="contact-line">
            Built fast with <em>AI</em>, finished by hand, with love.
          </p>
          <a className="pill" href={`mailto:${site.email}`} {...tag('cta · mailto')}>
            {site.email}
            <Arrow />
          </a>
          <ul className="contact-links" {...tag('links · 2')}>
            {site.links.map((l) => (
              <li key={l.label}>
                <a href={l.href} target="_blank" rel="noreferrer">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <footer className="foot">
          <p>© 2026 {site.name}</p>
          <p>Paintings: Michelangelo, Stubbs · public domain</p>
        </footer>
      </section>
    </>
  );
}

export default function App() {
  const root = useRef(null);
  const card = useRef(null);
  const aiLayer = useRef(null);
  const aiWindow = useRef(null);
  const humanCanvas = useRef(null);
  const time = useManilaTime();
  const [active, setActive] = useState(0);
  const [light, setLight] = useState(false);
  const [docked, setDocked] = useState(false);
  const [shot, setShot] = useState(0);
  const [videoOn, setVideoOn] = useState(() => !prefersReduced());
  // videos hold off until the intro is under way, so on a first visit the 3D scene gets the bandwidth
  const [mediaReady, setMediaReady] = useState(false);
  const [screens, setScreens] = useState(null);
  const hoverTimer = useRef(null);

  // pick a project on click or focus; hover only counts once the pointer rests there
  const select = (i) => {
    clearTimeout(hoverTimer.current);
    setActive(i);
  };
  const intend = (i) => {
    clearTimeout(hoverTimer.current);
    if (i !== null) hoverTimer.current = setTimeout(() => setActive(i), 320);
  };
  const step = (d) => setShot((v) => (v + d + work[active].shots.length) % work[active].shots.length);
  useEffect(() => setShot(0), [active]);

  // on phones each clip plays on its own while it is on screen; a tap pauses or resumes it.
  // Its AI twin plays along whenever the lens is over it (see the frame loop).
  useEffect(() => {
    if (prefersReduced()) return;
    const vids = [...document.querySelectorAll('.human .row-shots video')];
    const play = (v) => v.play().catch(() => {});
    const pause = (v) => v.pause();
    const paused = new WeakSet();
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting && !paused.has(e.target)) play(e.target);
          else pause(e.target);
        }),
      { threshold: 0.5 }
    );
    const onTap = (e) => {
      const v = e.currentTarget;
      if (v.paused) {
        paused.delete(v);
        play(v);
      } else {
        paused.add(v);
        pause(v);
      }
    };
    vids.forEach((v) => {
      io.observe(v);
      v.addEventListener('click', onTap);
    });
    return () => {
      io.disconnect();
      vids.forEach((v) => v.removeEventListener('click', onTap));
    };
  }, []);

  // only the video on show plays: the live one, once the page has settled, and only where the preview is
  // actually displayed (phones hide it). Its AI twin is started by the lens, only when the lens is over it.
  useEffect(() => {
    document.querySelectorAll('.human .preview-frame video').forEach((v) => {
      if (mediaReady && v.hasAttribute('data-live') && v.offsetParent) v.play().catch(() => {});
      else v.pause();
    });
  });

  useEffect(() => {
    const reduced = prefersReduced();
    const quick = seenBefore();
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const el = root.current;
    const lens = card.current;
    const layer = aiLayer.current;
    const win = aiWindow.current;

    let lenis;
    if (!reduced) {
      lenis = new Lenis({ lerp: 0.1 });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    }
    const onAnchor = (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      if (lenis) lenis.scrollTo(target, { duration: 1.5 });
      else target?.scrollIntoView();
    };
    el.addEventListener('click', onAnchor);
    let landing;
    if (window.location.hash) {
      const target = document.querySelector(window.location.hash);
      landing = setTimeout(() => {
        if (!target) return;
        if (lenis) lenis.scrollTo(target, { immediate: true, force: true });
        else target.scrollIntoView();
        ScrollTrigger.refresh();
      }, 120);
    }

    // the nav turns to ink while it sits over the paper section
    const navSwap = ScrollTrigger.create({
      trigger: el.querySelector('.human .work'),
      endTrigger: el.querySelector('.human .archive'),
      start: 'top 40px',
      end: 'bottom 40px',
      onToggle: (s) => setLight(s.isActive),
    });

    // the 3D scene is its own chunk, so the page paints before three.js arrives
    let scene = null;
    let gone = false;
    // the intro waits for the scene (model loaded, shaders compiled, textures up), so none of that work
    // lands mid-animation; a slow connection gets the intro after 2.5s anyway, over the static painting
    let startIntro = () => {};
    let introStarted = false;
    let mediaTimer;
    const beginIntro = () => {
      if (introStarted) return;
      introStarted = true;
      window.__loader?.done();
      startIntro();
      mediaTimer = setTimeout(() => setMediaReady(true), 1200);
    };
    const introCap = setTimeout(beginIntro, 2500);
    // with reduced motion the page shows at once, so the loader does not hold it back
    if (reduced) window.__loader?.done();
    heroSceneModule
      .then(({ createHeroScene }) => {
        if (gone) return;
        window.__loader?.set(0.45);
        scene = createHeroScene(humanCanvas.current, {
          reduced,
          art: el.querySelector('.human .hero-art'),
          onProgress: (p) => window.__loader?.set(0.45 + p * 0.5),
          onReady: () => {
            if (gone) return;
            el.classList.add('has-gl');
            beginIntro();
          },
        });
        if (import.meta.env.DEV) window.__heroScene = scene;
      })
      .catch(() => {
        scene = null;
        beginIntro();
      });
    const intro = { v: reduced ? 1 : 0 };

    // the card: fixed, draggable anywhere, and the only window onto the AI layer
    const pos = { x: 0, y: 0 };
    let moved = false;
    let isDocked = false;
    const edge = () => (window.innerWidth < 820 ? 10 : 32);
    const home = () => {
      const r = lens.getBoundingClientRect();
      const narrow = window.innerWidth < 820;
      return {
        x: narrow ? (window.innerWidth - r.width) / 2 : Math.max(32, window.innerWidth * 0.1),
        y: narrow ? window.innerHeight - r.height - 100 : (window.innerHeight - r.height) / 2 + 20,
      };
    };
    const dockSpot = () => {
      const r = lens.getBoundingClientRect();
      const narrow = window.innerWidth < 820;
      return { x: narrow ? (window.innerWidth - r.width) / 2 : window.innerWidth - r.width - edge(), y: window.innerHeight - r.height - edge() };
    };
    const place = (p, animate) => {
      pos.x = p.x;
      pos.y = p.y;
      if (animate && !reduced)
        gsap.to(lens, {
          x: p.x,
          y: p.y,
          duration: 1,
          ease: 'expo.inOut',
          // if the card changed size on the way, settle on the right spot
          onComplete: () => {
            if (moved) return;
            const t = isDocked ? dockSpot() : home();
            if (Math.abs(t.x - pos.x) > 2 || Math.abs(t.y - pos.y) > 2) place(t, true);
          },
        });
      else gsap.set(lens, { x: p.x, y: p.y });
    };
    const clampToView = () => {
      const r = lens.getBoundingClientRect();
      place({
        x: Math.min(Math.max(pos.x, 8), window.innerWidth - r.width - 8),
        y: Math.min(Math.max(pos.y, 8), window.innerHeight - r.height - 8),
      });
    };
    place(home());

    const setDock = (on) => {
      // once the visitor has taken the card, it stays a full lens where they left it
      if (moved && on) return;
      if (on === isDocked) return;
      isDocked = on;
      setDocked(on);
      if (moved) return;
      const more = lens.querySelector('.card-more');
      let done = false;
      const go = (e) => {
        // other transitions inside the card bubble up too; only the height change counts
        if (e && (e.target !== more || e.propertyName !== 'grid-template-rows')) return;
        if (done) return;
        done = true;
        more.removeEventListener('transitionend', go);
        place(on ? dockSpot() : home(), true);
      };
      more.addEventListener('transitionend', go);
      setTimeout(go, reduced ? 0 : 800);
    };
    const dockTrigger = ScrollTrigger.create({
      trigger: el.querySelector('.human .hero'),
      start: 'top top',
      end: '55% top',
      onLeave: () => setDock(true),
      // a jump past the hero (a #work link, a reload mid-page) never "leaves" it, so check on refresh too
      onRefresh: (self) => self.progress >= 1 && setDock(true),
      onEnterBack: () => {
        lens.classList.remove('is-scanning');
        setDock(false);
      },
    });

    let drag = null;
    const onDown = (e) => {
      if (e.button !== 0) return;
      drag = { sx: e.clientX, sy: e.clientY, ox: pos.x, oy: pos.y, live: false, id: e.pointerId, touch: e.pointerType === 'touch' };
      // follow the pointer anywhere, so a quick flick off the card still drags it
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
      window.addEventListener('pointercancel', onUp);
    };
    const onMove = (e) => {
      if (!drag) return;
      const dx = e.clientX - drag.sx, dy = e.clientY - drag.sy;
      if (!drag.live && Math.hypot(dx, dy) < 5) return;
      if (!drag.live) {
        lens.setPointerCapture(drag.id);
        // desktop opens the full lens; phones keep the slim bar and just open its viewfinder
        if (isDocked && fine) {
          isDocked = false;
          setDocked(false);
        } else if (isDocked) {
          lens.classList.add('is-scanning');
        }
      }
      drag.live = true;
      moved = true;
      lens.classList.add('is-moved');
      lens.classList.add('is-dragging');
      gsap.killTweensOf(lens);
      place({ x: drag.ox + dx, y: drag.oy + dy });
      clampToView();
    };
    const onUp = () => {
      // touch drags end without a click, so only arm the guard for the others; left waiting, it would
      // eat the next real tap (on phones the close button needed two)
      if (drag?.live && !drag.touch) {
        // swallow the click that ends a drag so links in the card don't fire
        lens.addEventListener('click', (ev) => { ev.preventDefault(); ev.stopPropagation(); }, { capture: true, once: true });
      }
      drag = null;
      lens.classList.remove('is-dragging');
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
    const onKey = (e) => {
      const step = e.shiftKey ? 60 : 20;
      const d = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[e.key];
      if (!d || !e.target.closest('.card-grip')) return;
      e.preventDefault();
      moved = true;
      place({ x: pos.x + d[0], y: pos.y + d[1] });
      clampToView();
    };
    lens.addEventListener('pointerdown', onDown);
    lens.addEventListener('keydown', onKey);
    // the close button puts the card back where it lives: docked below, or home in the hero
    const closeView = () => {
      moved = false;
      lens.classList.remove('is-scanning', 'is-moved');
      // past the hero the card belongs in the docked bar, even if it was taken while undocked
      const pastHero = dockTrigger.progress >= 1;
      if (pastHero && !isDocked) setDock(true);
      else requestAnimationFrame(() => place(isDocked ? dockSpot() : home(), true));
    };
    const closeBtn = lens.querySelector('.card-close');
    closeBtn.addEventListener('click', closeView);
    const onResize = () => (moved ? clampToView() : place(isDocked ? dockSpot() : home()));
    window.addEventListener('resize', onResize);

    // the AI layer is clipped to wherever the card sits, every frame
    const human = el.querySelector('.human');
    const spotTags = [...el.querySelectorAll('.censor-tag')];
    // the horse on the Hello page gets a detection box sized to its head, placed over the cover-fit painting
    const horse = layer.querySelector('.egg-horse');
    const horseArt = layer.querySelector('.contact-art');
    const HEAD = { u: 0.73, v: 0.24, w: 0.15, h: 0.2 };
    const placeHorse = () => {
      const nw = horseArt.naturalWidth, nh = horseArt.naturalHeight;
      // the painting zooms with the scroll, so work from its rendered box, not its layout box
      const box = horseArt.getBoundingClientRect(), media = horseArt.parentElement.getBoundingClientRect();
      if (!box.width || !nw) return;
      const k = Math.max(box.width / nw, box.height / nh);
      const [px, py] = getComputedStyle(horseArt).objectPosition.split(' ').map((v) => parseFloat(v) / 100);
      const dw = nw * k, dh = nh * k;
      const ox = box.left - media.left + (box.width - dw) * px, oy = box.top - media.top + (box.height - dh) * py;
      Object.assign(horse.style, { left: `${ox + HEAD.u * dw}px`, top: `${oy + HEAD.v * dh}px`, width: `${HEAD.w * dw}px`, height: `${HEAD.h * dh}px` });
    };
    horseArt.addEventListener('load', placeHorse);
    window.addEventListener('resize', placeHorse);
    placeHorse();
    const heroEl = el.querySelector('.human .hero');
    const onPointer = (e) => {
      scene?.state.target.set((e.clientX / window.innerWidth - 0.5) * 2, (e.clientY / window.innerHeight - 0.5) * 2);
    };
    if (!reduced) window.addEventListener('pointermove', onPointer, { passive: true });
    // on touch screens the page scrolls on its own thread, so a lens cut in page space trails the finger.
    // There the AI layer sits in a fixed window cut to the card (which never moves with the scroll), and
    // slides up with the page: on the compositor through a scroll timeline where the browser has one,
    // otherwise from the scroll event.
    const touchLens = !fine;
    const scrollTimeline = touchLens && CSS.supports('animation-timeline: scroll()');
    const docEl = document.documentElement;
    let scrollMax = -1;
    let layerNudge = 0;
    const follow = () => {
      if (!scrollTimeline) layer.style.transform = `translate3d(0, ${-window.scrollY}px, 0)`;
    };
    if (touchLens) {
      el.classList.add('is-touch');
      if (scrollTimeline) el.classList.add('has-scroll-timeline');
      window.addEventListener('scroll', follow, { passive: true });
    }
    // the AI copy of the sticky work preview cannot stick inside the fixed window, so it is moved by hand
    const humanPreview = el.querySelector('.human .preview');
    const aiPreview = layer.querySelector('.preview');
    let aiPreviewShift = 0;
    const viewfinder = lens.querySelector('.card-view');
    const videoPairs = [...el.querySelectorAll('.human .preview-frame video, .human .row-shots video')]
      .map((v) => [v, layer.querySelector(`${v.closest('.row-shots') ? '.row-shots' : '.preview-frame'} video[src="${v.getAttribute('src')}"]`)])
      .filter(([, twin]) => twin);

    const frame = () => {
      // a video's AI twin only plays (and only downloads) while the lens is over it, in step with the original
      const lensBox = (viewfinder.getBoundingClientRect().height > 0 ? viewfinder : lens).getBoundingClientRect();
      for (const [human, twin] of videoPairs) {
        const t = twin.getBoundingClientRect();
        const under = !human.paused && t.width > 0 && t.right > lensBox.left && t.left < lensBox.right && t.bottom > lensBox.top && t.top < lensBox.bottom;
        if (under) {
          if (twin.paused) twin.play().catch(() => {});
          if (Math.abs(twin.currentTime - human.currentTime) > 0.25) twin.currentTime = human.currentTime;
        } else if (!twin.paused) twin.pause();
      }
      const vf = viewfinder.getBoundingClientRect();
      const r = vf.height > 0 ? vf : lens.getBoundingClientRect();
      if (horseArt.getBoundingClientRect().top < window.innerHeight) placeHorse();
      if (touchLens) {
        // the scroll range shrinks when a phone's address bar hides, so measure it against the live
        // viewport height, not the fixed one
        const max = Math.max(0, docEl.scrollHeight - window.innerHeight);
        if (max !== scrollMax) el.style.setProperty('--scroll-max', `${(scrollMax = max)}px`);
        follow();
        // and whatever is left over (the bar mid-animation, a browser's own rounding) is trued up
        // every frame, so the two layers can never drift apart
        const off = human.getBoundingClientRect().top - layer.getBoundingClientRect().top;
        if (Math.abs(off) > 0.5) layer.style.translate = `0 ${(layerNudge += off)}px`;
        win.style.clipPath = `inset(${r.top}px ${win.clientWidth - r.right}px ${win.clientHeight - r.bottom}px ${r.left}px)`;
        if (humanPreview.offsetParent) {
          const d = humanPreview.getBoundingClientRect().top - aiPreview.getBoundingClientRect().top;
          if (Math.abs(d) > 0.5) aiPreview.style.transform = `translate3d(0, ${(aiPreviewShift += d)}px, 0)`;
        }
      } else {
        const top = r.top + window.scrollY;
        const w = human.offsetWidth, h = human.offsetHeight;
        layer.style.clipPath = `inset(${top}px ${w - r.right}px ${h - (top + r.height)}px ${r.left}px)`;
      }
      const hr = heroEl.getBoundingClientRect();
      if (scene && hr.bottom > 0) {
        scene.state.scroll = Math.min(1, Math.max(0, -hr.top / hr.height));
        scene.state.intro = intro.v;
        // the canvas drifts with the parallax, so place the neon cut-out in its own space
        const cr = humanCanvas.current.getBoundingClientRect();
        scene.state.lens = { left: r.left - cr.left, top: r.top - cr.top, right: r.right - cr.left, bottom: r.bottom - cr.top, width: r.width, height: r.height };
        scene.render(performance.now());
        for (const tagEl of spotTags) {
          const c = scene.frescoPoint(scene.spots[tagEl.dataset.spot]);
          const cx = c.x + cr.left, cy = c.y + cr.top;
          const hit = cx > r.left && cx < r.right && cy > r.top && cy < r.bottom;
          tagEl.classList.toggle('is-on', hit);
          if (hit) tagEl.style.transform = `translate(${cx}px, ${cy}px)`;
        }
      } else {
        spotTags.forEach((t) => t.classList.remove('is-on'));
      }
    };
    gsap.ticker.add(frame);

    // the archive strip drifts left forever; it glides to a stop under the pointer or keyboard focus
    const ledger = el.querySelector('.human .ledger');
    const tracks = el.querySelectorAll('.ledger-track');
    const drift = { x: 0, speed: 1, visible: false, set: 0 };
    const measure = () => (drift.set = tracks[0].scrollWidth / 3);
    measure();
    const slow = (to) => gsap.to(drift, { speed: to, duration: to ? 1.2 : 0.6, ease: 'power2.out', overwrite: true });
    const onLedgerIn = () => slow(0);
    const onLedgerOut = (e) => {
      if (e.type === 'focusout' && ledger.contains(e.relatedTarget)) return;
      if (e.type === 'pointerleave' && ledger.contains(document.activeElement)) return;
      slow(1);
    };
    const moveTracks = (_t, dt) => {
      if (!drift.visible || !drift.set) return;
      drift.x -= (dt / 1000) * 36 * drift.speed;
      if (drift.x <= -drift.set) drift.x += drift.set;
      tracks.forEach((t) => (t.style.transform = `translate3d(${drift.x}px, 0, 0)`));
    };
    const seen = new IntersectionObserver(([e]) => (drift.visible = e.isIntersecting));
    if (!reduced) {
      ledger.addEventListener('pointerenter', onLedgerIn);
      ledger.addEventListener('pointerleave', onLedgerOut);
      ledger.addEventListener('focusin', onLedgerIn);
      ledger.addEventListener('focusout', onLedgerOut);
      seen.observe(ledger);
      gsap.ticker.add(moveTracks);
      window.addEventListener('resize', measure);
      // thumbnails arrive lazily, so measure again as they land
      ledger.querySelectorAll('img').forEach((img) => img.addEventListener('load', measure, { once: true }));
    }

    const ctx = gsap.context(() => {
      if (reduced) {
        el.classList.add('is-ready');
        startIntro = () => {};
        return;
      }

      // intro: the frame inks itself in, then the painting surfaces out of the dark
      const title = new SplitText('.card-title', { type: 'lines', mask: 'lines', linesClass: 'ln' });
      const speed = quick ? 0.45 : 1;
      const tl = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' }, onStart: () => el.classList.add('is-ready') });
      startIntro = () => tl.play();
      if (introStarted) tl.play();
      tl.fromTo('.frame-line', { scale: 0 }, { scale: 1, duration: 0.7 * speed, ease: 'power3.inOut', stagger: 0.18 * speed })
        .to(intro, { v: 1, duration: 2.6 * speed, ease: 'expo.out' }, 0.3 * speed)
        .fromTo('.hero-media', { opacity: 0 }, { opacity: 1, duration: 1.6 * speed, ease: 'power2.out' }, 0.3 * speed)
        .from(title.lines, { yPercent: 105, duration: 1.1, stagger: 0.08 }, 0.7 * speed)
        .from('.card-line, .card-index li, .card-hint', { y: 14, opacity: 0, duration: 0.9, stagger: 0.05 }, 0.9 * speed)
        .from('.nav > *, .human .hero-foot > *', { opacity: 0, duration: 1, stagger: 0.06 }, 1.1 * speed);

      gsap.to('.hero-media', { yPercent: 18, ease: 'none', scrollTrigger: { trigger: '.human .hero', start: 'top top', end: 'bottom top', scrub: true } });

      const workTitle = new SplitText('.work-title', { type: 'chars', mask: 'chars', charsClass: 'ch' });
      gsap.from(workTitle.chars, { yPercent: 110, duration: 1.2, ease: 'expo.out', stagger: 0.04, scrollTrigger: { trigger: '.human .work', start: 'top 70%' } });
      gsap.from('.row', { y: 40, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: 0.1, scrollTrigger: { trigger: '.human .rows', start: 'top 80%' } });
      gsap.from('.preview', { clipPath: 'inset(0 0 100% 0)', duration: 1.4, ease: 'expo.inOut', scrollTrigger: { trigger: '.human .rows', start: 'top 75%' } });

      gsap.from('.archive-bar > *, .ledger', { y: 16, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.06, scrollTrigger: { trigger: '.human .archive', start: 'top 85%' } });

      gsap.fromTo('.contact-art', { scale: 1.12 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.human .contact', start: 'top bottom', end: 'bottom bottom', scrub: true } });
      const hello = new SplitText('.hello', { type: 'chars' });
      gsap.from(hello.chars, { yPercent: 30, opacity: 0, filter: 'blur(12px)', duration: 1.6, ease: 'expo.out', stagger: 0.07, scrollTrigger: { trigger: '.human .contact', start: 'top 55%' } });
      gsap.from('.contact-line, .pill, .contact-links', { y: 16, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: '.human .contact', start: 'top 45%' } });
    }, el);

    return () => {
      navSwap.kill();
      dockTrigger.kill();
      gsap.ticker.remove(frame);
      gsap.ticker.remove(moveTracks);
      seen.disconnect();
      window.removeEventListener('resize', measure);
      ledger.removeEventListener('pointerenter', onLedgerIn);
      ledger.removeEventListener('pointerleave', onLedgerOut);
      ledger.removeEventListener('focusin', onLedgerIn);
      ledger.removeEventListener('focusout', onLedgerOut);
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('resize', onResize);
      lens.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      lens.removeEventListener('keydown', onKey);
      clearTimeout(landing);
      clearTimeout(introCap);
      clearTimeout(mediaTimer);
      closeBtn.removeEventListener('click', closeView);
      el.removeEventListener('click', onAnchor);
      gone = true;
      window.removeEventListener('scroll', follow);
      horseArt.removeEventListener('load', placeHorse);
      window.removeEventListener('resize', placeHorse);
      scene?.dispose();
      ctx.revert();
      lenis?.destroy();
    };
  }, []);

  return (
    <div ref={root} className="app">
      <Nav light={light} />

      <main className="human">
        <Sections openScreens={setScreens} active={active} shot={shot} setShot={setShot} select={select} intend={intend} step={step} videoOn={videoOn} setVideoOn={setVideoOn} time={time} canvasRef={humanCanvas} />
      </main>

      {/* on desktop this wrapper has no box; on touch screens it is the fixed window cut to the card */}
      <div ref={aiWindow} className="ai-window">
        <div ref={aiLayer} className="ai-layer" aria-hidden="true" inert>
          <Sections ai active={active} shot={shot} setShot={setShot} select={select} intend={intend} step={step} videoOn={videoOn} setVideoOn={setVideoOn} time={time} />
        </div>
      </div>

      <Gallery item={screens} onClose={() => setScreens(null)} />

      <p className="censor-tag" data-spot="censor" aria-hidden="true">
        <span>AI safe search: on</span>
      </p>
      <p className="censor-tag" data-spot="spark" aria-hidden="true">
        <span>handshake · 200 OK</span>
      </p>
      <p className="censor-tag" data-spot="god" aria-hidden="true">
        <span>admin · sudo access</span>
      </p>

      <aside ref={card} className={`card ${docked ? 'is-docked' : ''}`} aria-label={site.name}>
        <span className="frame-line top" aria-hidden="true" />
        <span className="frame-line right" aria-hidden="true" />
        <span className="frame-line bottom" aria-hidden="true" />
        <span className="frame-line left" aria-hidden="true" />
        <div className="card-view">
          <span aria-hidden="true">AI view</span>
          <button type="button" className="card-close" aria-label="Close the AI view">
            <svg viewBox="0 0 12 12" aria-hidden="true">
              <path d="M2 2l8 8M10 2l-8 8" />
            </svg>
          </button>
        </div>
        <p className="card-hint">
          <button type="button" className="card-grip" aria-label="Move the card with the arrow keys">
            <Grip />
          </button>
          Drag me · see it as <em>AI</em> does
        </p>
        <h1 className="card-title">
          Vincent
          <br />
          Vinuya
        </h1>
        <Player />
        <div className="card-more">
          <div>
            <p className="card-line">
              {site.role}.
              <br />
              <em>AI</em> speed, human touch.
            </p>
            <ol className="card-index">
              {work.map((w, i) => (
                <li key={w.title}>
                  <a href="#work" onClick={() => setActive(i)}>
                    <span>{w.title}</span>
                    <span className="num" aria-hidden="true">{w.no}</span>
                  </a>
                </li>
              ))}
              <li>
                <a href="#contact">
                  <span>Contact</span>
                  <span className="num" aria-hidden="true">IV</span>
                </a>
              </li>
            </ol>
          </div>
        </div>
      </aside>
    </div>
  );
}
