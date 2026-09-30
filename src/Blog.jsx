import { useEffect } from 'react';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import Nav from './Nav.jsx';

gsap.registerPlugin(SplitText);

export default function Blog() {
  useEffect(() => {
    document.title = 'Blog — Vincent Vinuya';
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      const word = new SplitText('.blog-word', { type: 'chars' });
      gsap.fromTo('.blog-art', { scale: 1.12, opacity: 0 }, { scale: 1, opacity: 1, duration: 2.4, ease: 'expo.out' });
      gsap.from(word.chars, { yPercent: 30, opacity: 0, filter: 'blur(12px)', duration: 1.6, ease: 'expo.out', stagger: 0.08, delay: 0.3 });
      gsap.from('.blog-line, .blog-body .pill', { y: 16, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.1, delay: 0.8 });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="app blog-page">
      <Nav home={false} />
      <main className="blog" aria-labelledby="blog-title">
        <div className="blog-media" aria-hidden="true">
          <img className="blog-art" src="/art/creation-of-adam.webp" alt="" />
        </div>
        <div className="blog-body">
          <p className="blog-tag">
            <em>Non finito</em>
          </p>
          <h1 id="blog-title" className="blog-word">
            Blog
          </h1>
          <p className="blog-line">Still writing. Michelangelo left things unfinished too; mine are coming soon.</p>
          <a className="pill" href="/">
            Back to the portfolio
          </a>
        </div>
      </main>
    </div>
  );
}
