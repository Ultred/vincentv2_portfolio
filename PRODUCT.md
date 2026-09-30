# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Vite + React + GSAP + Lenis, deployed on Vercel (fresh build in C:\portfolio).

## Users

Both recruiters/hiring managers evaluating Vincent for developer roles and freelance clients deciding whether to hire him for a build. Both arrive from a link (CV, DM, bio), skim fast, and decide in under a minute.

## Product Purpose

Personal portfolio for Vincent Vinuya, web developer. Success is a visitor opening a project and then reaching out by email.

## Positioning

A developer who builds hand in hand with AI: human taste and craft, AI speed. The work (a browser audio tool, a crowd-played word game, a hospitality hiring platform) is the proof, not the claim.

## Capabilities and Constraints

- Minimal copy: no long paragraphs anywhere. A few words per section.
- Heavy motion is wanted, but content must stay readable with reduced motion.
- Projects link out to live sites.

## Brand Commitments

- Name: Vincent Vinuya.
- User-pinned look (2026-09-30, replaces the dark After Hours version): black, white and gray only, leaning white; editorial "Renaissance Edition" style with classical paintings in grayscale and modern type over them. References: shopify.com/editions/winter2026, grids03.obys.agency, sobha-privy-collection.com.
- Home has three sections: hero, work, contact, with a slim archive strip (the v1 projects) separating work and contact, plus a /blog page marked "still writing". No About/profile section, no coffee or R&B branding, no custom cursor.
- Hero: a 3D marble bust over the fresco; the draggable name card is a lens that reveals the neon "AI view" of whatever is under it (neon is allowed only inside that lens). Screenshots under the lens show true color.
- Music: one track (Hideaway) on repeat with a single play/pause. At the owner's request it tries to start on page load; most browsers hold it until the first click, and then it starts.
- Icon (owner's pick, 2026-09-30, replacing the simple V): "Split Scan", the site's own 3D bust rendered half marble, half neon AI hologram, split by a white hairline through the nose. The tab icon is a tighter crop on the face. Cartoon and pictogram marks stay rejected.
- Highlight the human + AI blend in plain words: "AI speed, human touch." and "Built fast with AI, finished by hand, with love." (user wording, 2026-09-30).

## Evidence on Hand

- Extractune — https://www.extractune.com/ — browser tool: video to audio, song ID, lyrics, vocal split, runs on-device.
- Lewis Crawl — https://lewis-crawl.onrender.com/?demo — pixel-art typing dungeon crawl the crowd plays along with. A mobile game app version is coming soon (user-confirmed; no date).
- Link Hospitality — https://link-hospitality.com/ (app: https://app.link-hospitality.com/) — all-in-one hiring platform for restaurants and hotels.
- Screenshots captured from the live sites into public/work/.
- Archive (first portfolio, https://vincentvportfolio.vercel.app/): Order UK, Coral, TENTS, Taste Quest, Lefty. Screenshots from that site in public/past/. TENTS (tentstabulation.com) no longer resolves and Order UK's Render service is suspended, so both show as Retired with no link. HabitIQ (mobile habit app with Habi the panda; owner-supplied banner in public/past/habitiq.webp) sits last in the strip with no link yet. Tow Factory (towing service: customer booking app plus admin dispatch) follows it with no link by the owner's choice; its item opens a 64s tour (public/work/tow-factory-tour.webm) cut from the owner's screen recording, with the OBS window, browser bars, taskbar, a Messenger chat head and the Caps Lock pop-up removed.
- GitHub: https://github.com/Ultred · LinkedIn: https://www.linkedin.com/in/vincentvinuya33
- No CV on the site by user decision: the projects speak for themselves.
- Missing (placeholder, must not be faked): contact email (src/content.js). No portrait is used.
- Paintings: Michelangelo's Creation of Adam and Stubbs' Whistlejacket, both public domain (public/art). 3D: Poly Haven Marble Bust 01, CC0 (public/models/bust).
- Lewis Crawl clips recorded from the public ?demo on lewis-crawl.onrender.com (public/work/*.webm). Originally from Candaba, Pampanga (from old site).

## Product Principles

1. The work leads; words only frame it.
2. Every section has one idea and one action.
3. Motion is atmosphere, never a gate on content.
4. Show the AI blend through wit, not buzzwords.

## Search and Sharing

`seo.js` (a Vite plugin) handles everything crawlers read, with no visual change:
- It writes plain semantic content (name, role, projects, archive, contact) into `#root` at build time. The loader covers it and React replaces it on first render.
- It adds ProfilePage/Person/WebSite JSON-LD, generated from `src/content.js`.
- It adds the canonical URL (`https://www.vincentv.site/`), `rel="me"` links, and Open Graph and Twitter tags using `public/og.jpg` (1200×630).
- It emits `blog.html` (its own title and canonical, `noindex` until posts exist), `robots.txt` and `sitemap.xml`.

`vercel.json` serves `/blog` from `blog.html`. Keep `site.url` in `content.js` in sync with the live domain.

## Accessibility & Inclusion

Respect prefers-reduced-motion; keyboard reachable links; text over paintings must keep readable contrast.
