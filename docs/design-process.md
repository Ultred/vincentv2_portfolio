# Design process

How this portfolio got its look, built with Claude Code and the Impeccable design skill on 2026-09-30. It records the references, each direction we tried, why it changed, and the decisions that now bind future work. The current design system lives in `DESIGN.md`; product facts live in `PRODUCT.md`.

## The brief

Reskin the old portfolio (vincentvportfolio.vercel.app, a 2023 dark site with a yellow accent) into something unique and designer-made, with lots of motion and very little text. It should show the three real projects (Extractune, Lewis Crawl, Link Hospitality) and say that Vincent works as a blend of human craft and AI.

## Research that shaped it

- Recruiters decide in about 7 to 10 seconds on a homepage and about a minute overall. They look for live links, GitHub and contact first, and they dislike long loaders and scroll-jacking. So the page is short, every project links out, and contact is one click away.
- Abstract visuals, literal words. The art can be as strange as we like, but the name, role, project names and contact stay plain.
- Accessibility (WCAG 2.2.2 Pause, Stop, Hide): content that moves on its own for more than five seconds needs a real pause control, and hover alone fails keyboard and touch users. That is why nothing on the page changes on a timer.
- Performance: split heavy 3D out of the first bundle, use modern image formats, lazy-load below the fold, and only load music when it plays.

## Directions, in order

1. **After Hours (rejected).** A dark Greek, tattoo, coffee and R&B record-sleeve site: a smoke shader, a burning marble bust, projects as tracks on Side A, liner notes and a generative R&B loop. It worked technically, but Vincent found it generic.
2. **Icon attempts (rejected).** A Didot V with a flame, a coin seal, and a Spartan helmet all read as cartoonish. The standing rule became: a really simple V, and no pictorial marks.
3. **Swiss index (a stepping stone).** After Vincent shared obys Grids and Sobha Privy Collection, we moved to paper, gray and ink with a strict grid and index-style lists. It became the discipline behind the Work section.
4. **Renaissance Edition (the current direction).** After Vincent pointed to Shopify's Winter '26 Renaissance Edition (an Awwwards Site of the Day), the site became an art edition. A classical painting is the stage, with modern type set over it in a thin white frame, a Roman-numeral index, and a huge serif "Hello." over a painting on the last page. Everything is grayscale.
5. **3D hero.** A fake depth effect on the fresco looked low quality, so we moved to real CC0 3D models. A white horse statue looked out of place, so Vincent chose the marble bust from four options. It sits on a stone pedestal in front of the fresco.
6. **The AI lens.** The name card became draggable anywhere on the page. Inside it the page renders as an AI would see it: the bust as a neon wireframe face scan, the fresco as neon line work, headings as wireframe outlines, elements in labelled detection boxes, and screenshots in true colour. Both views render from the same camera and the same layout, so they line up exactly. Neon only exists inside the lens.
7. **A joke.** Drag the lens over Adam's lap and the AI view pixel-censors it with "AI safe search: on". It nods to the painter nicknamed "Il Braghettone", who covered the Sistine Chapel's nudity in 1565.

## Content and copy decisions

- Role: "Full stack developer." Tagline: "AI speed, human touch." Contact line: "Built fast with AI, finished by hand, with love." (all Vincent's wording).
- Three home sections only (hero, work, contact), plus `/blog` marked "Non finito. Still writing."
- No About/profile section, no CV link (the projects speak for themselves), no custom cursor, and no coffee or R&B branding.
- Contact: vincentvinuya33@gmail.com, GitHub Ultred, LinkedIn vincentvinuya33.
- Lewis Crawl shows two gameplay clips recorded from its public demo, and notes that a mobile app is coming soon. Extractune shows its landing page, its extract tool and its studio mixer. Link shows one screenshot.
- Music: one track, "Hideaway", on repeat with a single play/pause and a live soundwave. Browsers block autoplay, so it starts on the visitor's first click.

## Fixes that became rules

- The Work preview used to switch whenever the pointer crossed a row, so it jumped around. Now a project is chosen by click or focus, and hover only counts after the pointer rests on a row for about a third of a second.
- The docked card measured itself before it finished shrinking, so it stopped mid-screen on phones. It now waits for the transition to finish, then docks as a slim see-through player bar. Grabbing it opens the full lens again.
- Links from the blog to `/#contact` now scroll once the layout has settled.

## Performance, measured on fast 4G with a 4x slower CPU

| | Before | After |
|---|---|---|
| Largest contentful paint | 3.56 s | 2.20 s |
| Downloaded on load | 4.9 MB | 1.58 MB |
| Main JavaScript (gzip) | 285 KB | 124 KB (three.js is its own chunk) |
| Layout shift | 0 | 0 |

## Assets and licences

- Michelangelo, *The Creation of Adam*, and George Stubbs, *Whistlejacket*: public domain, via Wikimedia Commons.
- Marble Bust 01 by Rico Cilliers, Poly Haven: CC0.
- Project screenshots and clips: Vincent's own sites. Every raster carries its origin (embedded, or in a `.json` sidecar next to WebP files).
- "Hideaway": supplied by Vincent. Confirm the right to publish it before the repo goes public.

## Still open

- `DESIGN.md` records the finished system (written from the shipped code at the end of this process).
- Deploy to Vercel. `vercel.json` already routes `/blog`.
