import { useEffect, useRef, useState } from 'react';

// A project's screens in a dark viewer: grayscale for people, true colour on request.
export default function Gallery({ item, onClose }) {
  const dialog = useRef(null);
  const strip = useRef(null);
  const [colour, setColour] = useState(false);
  // the tour plays on its own once the visitor opens it, unless they asked for less motion
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    const d = dialog.current;
    if (item && !d.open) {
      d.showModal();
      strip.current.scrollLeft = 0;
    }
    if (!item && d.open) d.close();
  }, [item]);

  const step = (dir) => {
    const el = strip.current;
    const shot = el.querySelector('li');
    el.scrollBy({ left: dir * (shot ? shot.offsetWidth + 24 : el.clientWidth), behavior: 'smooth' });
  };

  // a vertical wheel pages sideways, since the viewer has nothing to scroll down
  const onWheel = (e) => {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) strip.current.scrollLeft += e.deltaY;
  };

  return (
    <dialog
      ref={dialog}
      className={`viewer ${colour ? 'is-true' : ''}`}
      aria-labelledby="viewer-title"
      onClose={() => {
        setColour(false);
        onClose();
      }}
      data-lenis-prevent
    >
      {item && (
        <>
          <header className="viewer-head">
            <p className="viewer-name">
              <span className="num">{item.no}.</span>
              <span id="viewer-title">{item.title}</span>
              <span className="viewer-kind">{item.kind}</span>
            </p>
            <button type="button" className="viewer-colour" aria-pressed={colour} onClick={() => setColour((c) => !c)}>
              {colour ? 'Back to gray' : <>See it as <em>AI</em> does</>}
            </button>
            <button type="button" className="viewer-close" onClick={() => dialog.current.close()} aria-label="Close the screens">
              <svg viewBox="0 0 12 12" aria-hidden="true">
                <path d="M2 2l8 8M10 2l-8 8" />
              </svg>
            </button>
          </header>
          <ol ref={strip} className="viewer-strip" onWheel={onWheel} tabIndex={0} aria-label={`${item.title} screens`}>
            {item.screens.map((s) => (
              <li key={s.src}>
                <figure className={s.video ? 'is-video' : undefined}>
                  {s.video ? (
                    <video src={s.video} poster={s.src} width="1080" height="504" aria-label={s.alt} controls muted loop playsInline autoPlay={!still} preload="metadata" />
                  ) : (
                    <img src={s.src} alt={s.alt} loading="lazy" decoding="async" />
                  )}
                  <figcaption>
                    <span className="num">{s.no}</span> {s.label}
                  </figcaption>
                </figure>
              </li>
            ))}
          </ol>
          <footer className="viewer-foot" hidden={item.screens.length < 2}>
            <span className="ticks">
              <button type="button" onClick={() => step(-1)} aria-label="Previous screen">
                ‹
              </button>
              <button type="button" onClick={() => step(1)} aria-label="Next screen">
                ›
              </button>
            </span>
          </footer>
        </>
      )}
    </dialog>
  );
}
