# Dr. Firoz Alimohamed — two website concepts

**Live:** https://23f3000111.github.io/dr-firoz-alimohamed-websites/

Two complete, independent website designs for Dr. Firoz Alimohamed, consultant
gastroenterologist at The Mombasa Hospital. Both are static sites: open
`index.html` in a browser, or serve the folder (`python -m http.server`).

Each site has four pages, its own visual identity, its own typography, and its
own motion language. They are not two skins of one template.

```
site-one/          "The Continuous Line"   — light, editorial, jade & ochre
  index.html  about.html  conditions.html  appointment.html
  css/style.css  js/main.js  assets/img/

site-two/          "The Aperture"          — dark, immersive, instrument-led
  index.html  about.html  conditions.html  appointment.html
  css/style.css  js/main.js  assets/img/

index.html         landing page that links to both concepts
shared/            preview thumbnails used by the landing page
_previews/         full-page screenshots of both homepages, desktop + mobile
```

---

## Site One — "The Continuous Line"

**Idea.** The gut is one continuous passage from mouth to colon. A single drawn
line is the site's spine: on the homepage it snakes across the page and is inked
in as you scroll, with a travelling bead — the endoscope tip — and five labelled
stops (oesophagus, stomach, liver and bile ducts, small bowel, colon) that light
up as it passes.

**Palette.** Pale mineral paper `#F1F4F0`, forest ink `#0E211A`, jade `#0E6B56`,
Swahili-coast ochre `#C0761E`.

**Type.** Newsreader (editorial serif) for display, Instrument Sans for text.

**Motion.** Ink-in preloader; line-by-line masked headline reveal with a
clip-path wipe on the portrait; the scroll-drawn tract line; word-by-word
opacity reveal on the manifesto sentence; a pinned section where the five
conditions scroll horizontally as you scroll down, with a progress bar;
counters; magnetic buttons; a two-layer custom cursor; an animated film grain
over the whole page.

## Site Two — "The Aperture"

**Idea.** The view down an endoscope. The homepage hero is a live `<canvas>`
light tunnel — concentric rings receding into the dark toward a glow, drifting
toward your cursor. Dark rooms are interleaved with clinical-light rooms so the
reading sections stay easy on the eyes.

**Palette.** Abyss `#04161B`, deep teal `#072A33`, luminous mint `#6FE0C0`,
amber `#FFB45E`, clinical light `#F3F7F6`.

**Type.** Archivo (tight, engineered grotesque) for display, IBM Plex Sans for
text.

**Motion.** 0–100 counter preloader with an opening iris; canvas tunnel plus a
cursor-tracked spotlight; a pinned four-step procedure sequence where the image
cross-fades as each step becomes active; text that decodes from scrambled
characters; tabbed procedures with a sliding underline; a drag-scrollable rail
of work locations; ticker, counters, magnetic buttons, difference-blend cursor.

---

## Content

All clinical and biographical copy comes from Dr. Firoz's own about page:
education (Istanbul University → University of Nairobi → University of the
Witwatersrand), practice since 2005, advanced diagnostic and therapeutic
endoscopy, visits to all major Mombasa hospitals, consultations at the Aga Khan
Hospital, honorary lecturer on the ECSACOP postgraduate programme, the three
society memberships, the five conditions, and the Suite 5 location with 9am–5pm
hours.

Everything else — condition explanations, procedure descriptions, preparation
guides, FAQs — is standard, non-controversial clinical information written for
patients. It should still be read and approved by Dr. Firoz before going live.

**Placeholders to replace:** the telephone number (`+254 41 000 0000`) and email
(`appointments@gastrocentermombasa.com`). Both are flagged in each footer.

**Punctuation:** the copy contains no dashes of any kind. Em dashes, en
dashes and hyphens have all been rewritten out of the visible text, so sentences
use commas, colons and full stops instead.

**Deliberately omitted:** patient testimonials and treatment statistics. Both
would have had to be invented, and invented patient reviews on a medical site
are a liability. Add real ones with consent when they exist.

## Notes for build-out

- Both appointment forms are demonstrations — they validate and show a success
  message, but post nothing. Wire them to an endpoint or a form service.
- Both sites respect `prefers-reduced-motion`, keep visible keyboard focus, and
  work without JavaScript (content is all in the HTML; only the motion is lost).
- Photography is cropped from the supplied image sheets into
  `assets/img/`, sized to 1400px wide.
