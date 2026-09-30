import { site } from './content.js';

// On the home page the links scroll; elsewhere they lead back home first.
export default function Nav({ home = true, light = false }) {
  const to = (hash) => (home ? hash : `/${hash}`);
  return (
    <header className={`nav ${light ? 'on-light' : ''}`}>
      <a href={home ? '#top' : '/'} className="nav-name">
        {site.name} <span>Portfolio ’26</span>
      </a>
      <nav aria-label="Main" className="nav-links">
        <a href={to('#work')}>Work</a>
        <a href="/blog" aria-current={home ? undefined : 'page'}>
          Blog
        </a>
        <a href={to('#contact')}>Contact</a>
      </nav>
      <a className="nav-pill" href={`mailto:${site.email}`}>
        Say hello
      </a>
    </header>
  );
}
