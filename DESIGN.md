---
name: Vincent Vinuya, Portfolio '26
description: A grayscale art edition with a draggable lens that shows the same page as a machine reads it.
colors:
  ink: "#0b0b0b"
  paper: "#f4f3f0"
  stone: "#dcdbd6"
  mid: "#6f6d68"
  white: "#ffffff"
  rule: "rgb(11 11 11 / 0.16)"
  neon-blue: "#2b4bff"
  neon-pink: "#ff2bd6"
  neon-cyan: "#3df5ff"
  ai-void: "#05040a"
  ai-ink: "#e9f6ff"
  ai-muted: "#b9c7ff"
typography:
  display-serif:
    fontFamily: "'Bodoni Moda Variable', 'Bodoni 72', Didot, serif"
    fontSize: "clamp(96px, 21vw, 330px)"
    fontWeight: 400
    lineHeight: 0.86
    letterSpacing: "-0.035em"
    fontVariation: "'opsz' 26"
  display:
    fontFamily: "'Host Grotesk Variable', 'Helvetica Neue', Arial, sans-serif"
    fontSize: "clamp(64px, 12vw, 176px)"
    fontWeight: 650
    lineHeight: 0.8
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "'Host Grotesk Variable', 'Helvetica Neue', Arial, sans-serif"
    fontSize: "clamp(36px, 4.6vw, 68px)"
    fontWeight: 650
    lineHeight: 0.95
    letterSpacing: "-0.04em"
  title:
    fontFamily: "'Host Grotesk Variable', 'Helvetica Neue', Arial, sans-serif"
    fontSize: "34px"
    fontWeight: 650
    lineHeight: 0.92
    letterSpacing: "-0.04em"
  serif-line:
    fontFamily: "'Bodoni Moda Variable', 'Bodoni 72', Didot, serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.25
  body:
    fontFamily: "'Host Grotesk Variable', 'Helvetica Neue', Arial, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.35
  label:
    fontFamily: "'Host Grotesk Variable', 'Helvetica Neue', Arial, sans-serif"
    fontSize: "13px"
    fontWeight: 600
    lineHeight: 1.35
  numeral:
    fontFamily: "'Bodoni Moda Variable', 'Bodoni 72', Didot, serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 2
  label-mono:
    fontFamily: "ui-monospace, Menlo, Consolas, monospace"
    fontSize: "10px"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.02em"
rounded:
  none: "0px"
  pill: "999px"
  round: "50%"
spacing:
  edge: "clamp(16px, 2.2vw, 32px)"
  xs: "8px"
  sm: "12px"
  md: "18px"
  lg: "24px"
  section-top: "88px"
  section-bottom: "64px"
components:
  nav-pill:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "7px 14px"
  nav-pill-on-light:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.white}"
    rounded: "{rounded.pill}"
    padding: "7px 14px"
  pill:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "8px 16px"
  pill-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.white}"
  lens-card:
    textColor: "{colors.white}"
    typography: "{typography.title}"
    rounded: "{rounded.none}"
    padding: "14px 20px 18px"
    width: "min(300px, calc(100vw - 32px))"
  player-button:
    textColor: "{colors.white}"
    rounded: "{rounded.round}"
    size: "26px"
  player-button-active:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
  work-row-title:
    textColor: "{colors.ink}"
    typography: "{typography.headline}"
  preview-frame:
    backgroundColor: "{colors.stone}"
    rounded: "{rounded.none}"
    padding: "10px"
  video-toggle:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.white}"
    rounded: "{rounded.round}"
    size: "34px"
  detection-label:
    backgroundColor: "{colors.neon-pink}"
    textColor: "{colors.ai-void}"
    typography: "{typography.label-mono}"
    padding: "1px 5px"
---

# Design System: Vincent Vinuya, Portfolio '26

## Overview

**Creative North Star: "The Edition and Its Scan"**

The site is printed twice. The human layer is a grayscale art edition: classical paintings and a marble bust in black, white and gray, with tight modern grotesk names laid over them and Bodoni carrying the voice. Underneath, aligned to the pixel, sits the AI layer: the same DOM and the same 3D camera, redrawn the way a model would read it, in neon on near-black. The draggable name card is the only window onto that second layer. Everything the visitor sees outside the card stays monochrome; everything inside it is the machine's reading.

Density is low and editorial. Each section holds one idea at poster scale (the bust, the word "Work", the word "Hello.") and a few words of copy. Frames are 1px hairlines, corners are square, and the only rounded things are pills and round media controls. Depth comes from the three.js scene and painting scrims, never from drop shadows on paper. Motion is heavy but always answers the visitor: pointer drift, scroll, drag, hover with intent, a first gesture for sound.

**Key Characteristics:**
- Two layers, one layout: a monochrome human layer and a neon AI twin clipped to the card every frame.
- Twin three.js render from one camera: marble bust and grayscale fresco for people; hologram bust, pink edge-traced plinth, neon Sobel-traced fresco and a scrolling floor grid for the machine, drawn with a scissor inside the card rectangle.
- Host Grotesk semibold, tight tracking, for names and titles; Bodoni Moda for lines, Roman numerals and the italic "AI".
- 1px frames: white on dark, ink on paper. White and ink pills are the only filled controls.
- Work screenshots are grayscale for people and true colour under the lens.
- Nothing advances on a timer; reduced motion gets a complete, still page.

## Colors

A monochrome paper-and-ink edition, with a separate neon palette that exists only inside the lens.

### Primary
- **Gallery Ink** (ink): the dark ground of the hero, contact and blog, the text colour on paper, 1px frames on paper, the on-light nav pill and the video toggle. Also the renderer clear colour and the page's theme colour.

### Neutral
- **Edition Paper** (paper): the Work section ground and the body background. Leans warm-white, not pure white.
- **Pedestal Stone** (stone): the fill inside preview frames and mobile shot frames, the mat around a screenshot.
- **Plaster Mid** (mid): Roman row numbers, project meta and captions on paper. Secondary text only.
- **Frame White** (white): text and 1px frame lines over dark and painted grounds; the white pill; the soundwave bars.
- **Hairline Rule** (rule): the 16% ink divider between work rows. The heavier section rule under "Work" is full ink.

### Tertiary (AI layer only)
- **Scan Blue** (neon-blue): the 40px grid on the AI Work ground, the hologram base tone, the cool end of the fresco trace, the floor grid lines.
- **Detection Pink** (neon-pink): detection box outlines and their label chips, Roman numerals and counts in the AI view, the AI preview frame, the plinth edges, the drag glow on the card frame, the censor tag.
- **Wireframe Cyan** (neon-cyan): stroked outline type for titles and "Hello.", the AI pill ring, the bust wireframe, scan sweeps.
- **Machine Void** (ai-void): the ground of the AI layer and the machine scene; text colour on pink chips.
- **Readout White** (ai-ink): default AI-layer text.
- **Readout Lilac** (ai-muted): secondary AI-layer text (lines, meta, captions, footers).

### Named Rules
**The Two Layers Rule.** Neon (blue, pink, cyan) and the machine void appear only inside the card lens: in the `.ai-layer` twin, the machine scene, the card's own frame while dragging, and the censor tag that only shows when the lens covers it. The human layer never uses a hue.

**The True Colour Rule.** Project screenshots and video are grayscale (`grayscale(1) contrast(1.05)`) in the human layer, a little harder on intent (`contrast(1.18)`), and in full colour only under the lens. Colour is what the machine sees.

## Typography

**Display Font:** Host Grotesk Variable (with Helvetica Neue, Arial)
**Serif Font:** Bodoni Moda Variable (with Bodoni 72, Didot)
**Label/Mono Font:** ui-monospace, Menlo, Consolas (AI layer only)

**Character:** A tight, heavy modern grotesk for proper nouns set against a high-contrast Didone for everything spoken. The grotesk names things; the Bodoni talks.

### Hierarchy
- **Display Serif** (400, clamp(96px, 21vw, 330px), 0.86, optical size 26): the one giant word of a dark page, "Hello." and "Blog".
- **Display** (650, clamp(64px, 12vw, 176px), 0.8): the "Work" section title, split into masked characters on entry.
- **Headline** (650, clamp(36px, 4.6vw, 68px), 0.95): project names in work rows.
- **Title** (650, 34px, 0.92): the name on the card, the page's h1.
- **Serif Line** (400, 16px, 1.25, max 38ch in rows): one-sentence project lines, the card's role line (15px, 1.15), contact and blog lines (fluid 16-22px).
- **Body** (400, 15px, 1.35): base text; nav links at 500.
- **Label** (600, 13px): visit links, pills (14px), row meta and captions (400, 13px, mid). Card hint and player meta run at 11px.
- **Numeral** (Bodoni 400, 18px, line-height 2): Roman row numbers; the same face at 11px for card-index numerals and fluid 22-34px for the "III" work count.
- **Label Mono** (600, 10px, 0.02em): detection-box labels in the AI layer; 11px in the censor tag.

### Named Rules
**The Grotesk Names, Bodoni Speaks Rule.** Names, titles and controls are Host Grotesk at 600-650 with -0.02em to -0.04em tracking. Sentences, numerals and the word "AI" are Bodoni. Every `em` is Bodoni italic 500 (600 on the card line); hovering a card-index entry swaps its name to Bodoni italic.

**The Roman Index Rule.** Every count and index is a Bodoni Roman numeral (I, II, III, IV): row numbers, the work count, card-index numbers, shot ticks. No Arabic step numbers.

**The Mono Is Machine Rule.** Monospace exists only as the AI layer's detection labels and censor tag. It never appears in the human layer.

## Layout

Full-bleed sections, each at least one small-viewport height (`100svh`; the hero has a 620px floor). Horizontal inset is a single fluid gutter (edge, 16-32px) shared by the nav, hero foot, work section and footers. The nav is a fixed three-column grid: name and "Portfolio '26" left, Work/Blog/Contact centred (28px gap), pill right. It is white over dark sections and swaps to ink while it sits over the paper Work section.

Work is the one paper section: 88px top and 64px bottom padding, a heading row with the title left and the Roman count right over a full ink rule, then two equal columns. The left column is the row list; the right is a sticky preview (top 88px) in a 16:10 frame. Rows use a 3.2rem numeral gutter and a 12px column gap, with the visit link indented to the title line.

The dark pages (contact, blog) centre one giant serif word over a full-bleed painting with the small line, a pill and links beneath, and a footer strip pinned 16px from the bottom.

At 820px and below: the nav drops its centre links and the "Portfolio '26" suffix; work collapses to one column; the sticky preview is replaced by an in-row horizontal strip of 86%-wide snap-scrolling shots; the numeral gutter tightens to 2.4rem; the card grows to min(340px, 88vw) and homes centred near the bottom.

## Elevation & Depth

The human layer is flat. Depth comes from the three.js scene (a shadow-casting marble bust on a stone plinth in front of a dimmed fresco plane), from painting scrims (a top-and-bottom gradient on the hero, a flat 52% on blog, 18% on contact) and from parallax (hero media drifts 18% on scroll; the contact painting eases from 1.12 to 1). No box shadows on paper.

### Shadow Vocabulary
- **Legibility halo** (`text-shadow: 0 1px 10px rgb(0 0 0 / 0.75)`): white card text over any ground the card is dragged onto.
- **Wireframe glow** (`text-shadow: 0 0 18px rgb(61 245 255 / 0.45)`): stroked cyan type in the AI layer.
- **Lens ring** (`box-shadow: inset 0 0 0 1px #3df5ff, 0 0 16px rgb(61 245 255 / 0.4)`): the pill in the AI layer.
- **Drag glow** (`box-shadow: 0 0 10px #ff2bd6, 0 0 22px rgb(61 245 255 / 0.6)`): the card frame lines while dragging.
- **Censor glow** (`box-shadow: 0 0 14px rgb(255 43 214 / 0.7)`): the censor tag.

### Named Rules
**The Glow Is Machine Rule.** Light-emitting shadow belongs to the AI layer and the lens. The human layer gets depth from the 3D scene and scrims only; its single shadow is the legibility halo on card text.

## Shapes

Square corners everywhere; frames are 1px lines, never filled boxes. White hairlines frame things on dark (the card frame at 85% white, player rules at 28%); ink hairlines frame things on paper (the preview frame, mobile shot frames, the Work rule). Only two shapes are round: full pills (999px) for the nav pill and CTA, and circles (50%) for the 26px player button and 34px video toggle. The card carries a faint 1-in-3px horizontal scanline overlay over its whole face. Media reveal through a clip-path wipe from the top (`inset(0 0 100% 0)` to `inset(0)`).

## Components

### Buttons (pills)
Quiet, filled, pill-shaped, and the only filled controls on the page.
- **Shape:** full pill (999px).
- **Primary:** white fill, ink text, Host Grotesk 600 at 14px, 8px 16px, with a 0.75em arrow glyph drawn in SVG for outbound or mailto.
- **Hover / Focus:** fill and text invert to ink/white over 0.4s. Focus uses the global 1px currentColor outline at 4px offset.
- **Nav pill:** 7px 14px; white on dark, inverting to ink fill while the nav is over paper.
- **AI layer:** transparent with a cyan ring and glow.

### Text links
Nav links, contact links and visit links share one underline: a 1px currentColor line that draws from 0 to 100% width over 0.6s on hover (and focus for visit links). Visit links carry the diagonal arrow, which nudges 2px up-right.

### Navigation
Fixed, transparent, no bar or blur. Name in Host Grotesk 600 with the "Portfolio '26" suffix at 400. Colour transitions over 0.5s between white and ink based on the section beneath. The blog page marks Blog with `aria-current`; its links lead back home.

### Lens Card (signature)
The name card and the lens are the same object. Fixed, 300px wide, a 22% black wash with a white 1px frame drawn as four separate lines, the scanline overlay, grab cursor. Contents top to bottom: grip handle plus the hint "Drag me · see it as AI does", the two-line name, the soundwave player, then a collapsible block with the role line and a I-IV index (projects plus Contact).
- **Home:** 10% from the left, vertically centred (desktop); centred near the bottom (mobile).
- **Docked:** once the hero scrolls 55% past, the collapsible block folds closed (0.7s grid-row transition), the name hides, and the card moves to the bottom-right as a slim player bar (1s expo in-out). Scrolling back restores it.
- **Taken:** after the first real drag (5px threshold) the card stays a full lens wherever it was left and stops docking. It is clamped 8px inside the viewport on move and resize.
- **Dragging:** frame lines turn pink with the drag glow; the click that ends a mouse drag is swallowed so index links do not fire (touch drags end without a click, so no guard is left waiting to eat the next tap). The card sits above the nav (z 11) so its close button stays tappable anywhere; the censor tag sits above both (z 12).
- **Keyboard:** the grip is a button; arrow keys move the card 20px, 60px with Shift.
- **What it reveals:** every frame the AI layer is clip-pathed to the card's rectangle, and the three.js machine scene is rendered with a scissor into the same rectangle (translated into the canvas's parallaxed space). The censor tag "AI safe search: on" appears only when the card covers the fresco's censored spot.

### AI Layer (signature)
A second, inert render of the same sections (`aria-hidden`, `inert`, all controls `tabindex=-1`), stacked over the human layer and clipped to the lens. It restyles rather than relayouts: void ground, a 40px blue grid on Work, cyan stroked titles, lilac secondary text, pink numerals and frames, true-colour media, the contact painting crushed to high-contrast gray and multiplied through a blue-to-pink gradient with scanlines. Elements carrying a `data-ai` label get a 1px pink detection box at 3px offset with a mono chip reading like a classifier output ("project · 0.99", "cta · mailto", "local time"). The live preview video's twin is kept in sync within 0.25s.

### Soundwave Player
A single-track player inside the card: a 84 x 26px canvas of 26 white bars, a two-line meta block (Bodoni italic "Now playing"/"Paused" over the track title in 600), and one 26px round play/pause button. Bars follow the live frequency data when playing and rest as a low sine contour when paused. Hover or playing fills the button white with ink glyph. Separated by 28% white hairlines above and below, which drop when docked.

### Work Rows
Each row is a full-width select button (Roman numeral, project name, serif line, meta) with `aria-pressed`, plus a separate visit link beneath it. Clicking or focusing selects instantly; mouse hover selects only after resting 320ms. While the list is hovered, non-active titles dim to a lighter gray. Rows enter with a 40px rise staggered 0.1s.

### Preview Frame
A sticky 16:10 figure: stone mat, 10px inset, 1px ink border. All shots are stacked and the current one wipes in from the top (0.9s). The caption carries the Roman number, "title — kind", and shot ticks: ‹ I II III › in Bodoni at 35% opacity, the active tick at full ink with `aria-pressed`. Video shots get a 34px round ink toggle bottom-right; only the visible video plays, and only while toggled on.

### Archive Strip
Earlier builds (the v1 projects plus HabitIQ and Tow Factory) as a slim separator between Work and Contact, not a full section. An ink rule, then one line: Bodoni italic "Archive", a mid-gray "Earlier builds.", and a "See v1" visit link on the right. Below it, seven projects in one row, each a whole-item link when it has a live site: a small stone-matted grayscale thumbnail (true colour under the lens), a Roman numeral with the title, and the kind, or an italic note such as "Retired" in its place. Hovering one sharpens its thumbnail and dims the other titles. The row is an endless carousel (owner request, 2026-09-30): three copies of the set drift left at 36px/s on the GSAP ticker, one clock moving the human track and its AI twin together so the lens stays aligned, wrapping by one set's width with soft masked edges. The pointer or keyboard focus eases it to a stop (0.6s) so items are easy to hit; leaving eases it back (1.2s). It only runs while on screen. Copies are aria-hidden and out of the tab order. With reduced motion it holds still, shows one set, and scrolls by hand. It is not in the card index.

### Screens Viewer
An item with screens and no live link (HabitIQ, Tow Factory) is a button that opens a full-screen ink `<dialog>`: the Roman numeral, title and kind top left, a white-ringed "See it as *AI* does" pill and a close button top right, then the screens in a horizontal snap-scrolling row, each framed by a 28% white hairline with a Bodoni numeral caption. A screen can be a video (Tow Factory's tour): it keeps its own 1080:504 shape, fills the width up to the viewport height, has native controls, and autoplays muted only once the viewer is open (not with reduced motion); a single item hides the ‹ › steppers. Screens are grayscale until the pill is pressed; pressed, it fills white, reads "Back to gray", and the screens ease into true colour. The lens idea, offered as a toggle, because the lens cannot reach the dialog. A vertical wheel pages sideways, ‹ › buttons step one screen, Esc closes and returns focus to the item. Lenis ignores it (`data-lenis-prevent`), so the page behind never moves.

### Blog Placeholder
The dark-page pattern alone: dimmed fresco, the giant Bodoni "Blog", one line, a pill back to the portfolio.

## Do's and Don'ts

### Do:
- **Do** keep every hue inside the lens; the human layer is ink, paper, stone, mid and white only.
- **Do** build any new section twice, as a human section and its AI restyle in the same layout, so the lens stays pixel-aligned.
- **Do** tag AI-layer elements with `data-ai` detection labels written as classifier output (noun · confidence), in mono on pink.
- **Do** set names and titles in Host Grotesk 600-650 with -0.02em to -0.04em tracking, and sentences, numerals and "AI" in Bodoni Moda.
- **Do** number with Bodoni Roman numerals.
- **Do** frame with 1px lines: white on dark, ink on paper; square corners except pills and round media buttons.
- **Do** show screenshots grayscale outside the lens and true colour under it.
- **Do** ease with `cubic-bezier(0.16, 1, 0.3, 1)` (expo out) for CSS and `expo.out` / `expo.inOut` in GSAP.
- **Do** make every motion answer input: pointer drift, scroll scrub, drag, 320ms hover intent, a first gesture for music, an explicit toggle for video.
- **Do** give reduced motion a complete still page: no smooth scroll or intros, CSS transitions off, the card placed without tweening, shader time frozen, no pointer drift, videos paused by default.
- **Do** keep the 3D scene a lazy chunk with the static painting shown until it mounts, the renderer pixel ratio capped at 1.5, images lazy, video `preload="none"`, and the scene rendered only while the hero is on screen.
- **Do** keep every control keyboard reachable with the 1px currentColor focus outline at 4px offset, and label outbound links "(opens in a new tab)" for screen readers.

### Don't:
- **Don't** advance content on a timer: no carousels, autoplaying slides, or timed reveals. The only timers are hover intent, the minute clock, dock fallbacks, and the Archive strip's drift (owner request; it stops under pointer or focus and holds still for reduced motion).
- **Don't** start sound or video without a visitor action.
- **Don't** add box shadows, blur panels or glow to the human layer; glow is the machine's.
- **Don't** use monospace outside the AI layer.
- **Don't** add a custom cursor, skill chips, a card grid, an About/profile section or a CV.
- **Don't** put small labels above headlines; the giant word stands alone.
