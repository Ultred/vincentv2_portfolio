// Build-time SEO for a client-rendered site: crawlers that don't run JavaScript (link previews, many
// AI crawlers, Google's first pass) get real content, structured data and share tags in the HTML itself.
// Nothing here changes what visitors see: the static content sits under the loader and React replaces
// it on its first render.
import fs from 'node:fs';
import path from 'node:path';
import { archive, site, work } from './src/content.js';

const URL = site.url;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Google's ProfilePage wants a full ISO 8601 date-time with a timezone, not a bare date
const BUILT_AT = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');

const TITLE = `${site.name} — Full Stack Developer`;
const DESCRIPTION = `${site.name} is a full stack developer in Pampanga, Philippines, building web apps fast with AI and finishing them by hand: Extractune, Lewis Crawl and Link.`;
const OG_IMAGE = { url: `${URL}/og.jpg`, width: 1200, height: 630, alt: `${site.name}, full stack developer. AI speed, human touch.` };

function structuredData() {
  const person = {
    '@type': 'Person',
    '@id': `${URL}/#person`,
    name: site.name,
    jobTitle: site.role,
    url: `${URL}/`,
    email: `mailto:${site.email}`,
    address: { '@type': 'PostalAddress', addressLocality: 'Pampanga', addressCountry: 'PH' },
    sameAs: site.links.map((l) => l.href),
    knowsAbout: ['Web development', 'Full stack development', 'React', 'JavaScript', 'TypeScript', 'Node.js', 'Three.js', 'AI-assisted development'],
    workExample: [...work, ...archive.items]
      .filter((w) => w.href)
      .map((w) => ({ '@type': 'CreativeWork', name: w.title, url: w.href, ...(w.line ? { description: w.line } : {}), creator: { '@id': `${URL}/#person` } })),
  };
  return {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebSite', '@id': `${URL}/#website`, url: `${URL}/`, name: site.name, inLanguage: 'en' },
      { '@type': 'ProfilePage', '@id': `${URL}/#profile`, url: `${URL}/`, name: TITLE, description: DESCRIPTION, isPartOf: { '@id': `${URL}/#website` }, mainEntity: { '@id': `${URL}/#person` }, dateModified: BUILT_AT },
      person,
    ],
  };
}

function headTags({ title, description, url, robots }) {
  return [
    `<link rel="canonical" href="${url}" />`,
    robots ? `<meta name="robots" content="${robots}" />` : '',
    `<meta name="author" content="${esc(site.name)}" />`,
    ...site.links.map((l) => `<link rel="me" href="${l.href}" />`),
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${esc(site.name)}" />`,
    `<meta property="og:locale" content="en_US" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    `<meta property="og:image" content="${OG_IMAGE.url}" />`,
    `<meta property="og:image:width" content="${OG_IMAGE.width}" />`,
    `<meta property="og:image:height" content="${OG_IMAGE.height}" />`,
    `<meta property="og:image:alt" content="${esc(OG_IMAGE.alt)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(title)}" />`,
    `<meta name="twitter:description" content="${esc(description)}" />`,
    `<meta name="twitter:image" content="${OG_IMAGE.url}" />`,
    `<meta name="twitter:image:alt" content="${esc(OG_IMAGE.alt)}" />`,
  ]
    .filter(Boolean)
    .map((t) => `    ${t}`)
    .join('\n');
}

// the page's content as plain, semantic HTML, for crawlers that read the HTML before (or without) JavaScript
function homeContent() {
  const link = (href, text) => (href ? `<a href="${href}">${esc(text)}</a>` : esc(text));
  const projects = work
    .map((w) => `<li><h3>${link(w.href, w.title)}</h3><p>${esc(w.line)}</p><p>${esc(w.kind)} · ${esc(w.status)}</p></li>`)
    .join('');
  const earlier = archive.items.map((p) => `<li>${link(p.href, p.title)} · ${esc(p.note ?? p.kind)}</li>`).join('');
  return [
    '<main>',
    `<h1>${esc(site.name)}</h1>`,
    `<p>${esc(site.role)} in Pampanga, Philippines. AI speed, human touch.</p>`,
    `<section><h2>Work</h2><ol>${projects}</ol></section>`,
    `<section><h2>Archive</h2><p>Earlier builds. <a href="${archive.href}">See the first edition</a>.</p><ul>${earlier}</ul></section>`,
    `<section><h2>Contact</h2><p>Built fast with AI, finished by hand, with love.</p><p><a href="mailto:${site.email}">${esc(site.email)}</a></p><ul>${site.links.map((l) => `<li><a href="${l.href}">${esc(l.label)}</a></li>`).join('')}</ul></section>`,
    '<p><a href="/blog">Blog</a></p>',
    '</main>',
  ].join('');
}

function blogContent() {
  return `<main><p><em>Non finito</em></p><h1>Blog</h1><p>Still writing. Michelangelo left things unfinished too; mine are coming soon.</p><p><a href="/">Back to the portfolio</a></p></main>`;
}

function page(html, { title, description, url, robots, content, jsonLd }) {
  return html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${esc(description)}" />`)
    .replace('</head>', `${headTags({ title, description, url, robots })}\n${jsonLd ? `    <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>\n` : ''}  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${content}</div>`);
}

export default function seo() {
  return {
    name: 'vincentv-seo',
    transformIndexHtml(html) {
      return page(html, { title: TITLE, description: DESCRIPTION, url: `${URL}/`, content: homeContent(), jsonLd: structuredData() });
    },
    // the blog gets its own HTML (its own title, canonical, and kept out of search until it has posts),
    // plus robots.txt and a sitemap
    writeBundle(options) {
      const out = options.dir;
      const home = fs.readFileSync(path.join(out, 'index.html'), 'utf8');
      const blogTitle = `Blog — ${site.name}`;
      const blogDescription = `The blog of ${site.name}, full stack developer. Still writing; posts are coming soon.`;
      const blog = home
        .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>\n/, '')
        .replace(/<div id="root">[\s\S]*?<\/div>/, `<div id="root">${blogContent()}</div>`)
        .replace(/\n\s*<link rel="canonical"[\s\S]*?<meta name="twitter:image:alt"[^>]*>/, `\n${headTags({ title: blogTitle, description: blogDescription, url: `${URL}/blog`, robots: 'noindex, follow' })}`)
        .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(blogTitle)}</title>`)
        .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${esc(blogDescription)}" />`);
      fs.writeFileSync(path.join(out, 'blog.html'), blog);
      fs.writeFileSync(path.join(out, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${URL}/sitemap.xml\n`);
      const today = new Date().toISOString().slice(0, 10);
      fs.writeFileSync(
        path.join(out, 'sitemap.xml'),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${URL}/</loc><lastmod>${today}</lastmod></url>\n</urlset>\n`
      );
    },
  };
}
