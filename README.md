# Dr. Firoz Alimohamed — website design

**Live:** https://23f3000111.github.io/dr-firoz-alimohamed-websites/

Website design for Dr. Firoz Alimohamed, consultant gastroenterologist at The
Mombasa Hospital. Everything is a static site: open `index.html` in a browser,
or serve the folder (`python -m http.server`).

The client's amendments of 11 September 2026 are applied to Site One, which now
comes in two colours on the same layout. Site Two is the earlier concept,
unchanged.

```
site-one/          "The Continuous Line", green: forest, jade and ochre
site-one-blue/     the same site in blue: navy, ocean blue and amber
  index.html  about.html  services.html  conditions.html
  consultation.html  contact.html
  service-*.html     one page per service (5)
  condition-*.html   one page per common condition (5)
  css/style.css  css/theme.css  js/main.js  assets/img/

site-two/          "The Aperture", dark and instrument led, earlier concept

index.html         landing page that links to both colours
shared/            preview thumbnails used by the landing page
_previews/         full page screenshots, desktop and mobile
```

## How the two colours work

`site-one/` and `site-one-blue/` are byte for byte identical except for
`css/theme.css`, which holds every colour on the site. To change the design,
edit `site-one/`, then copy it across while keeping the blue theme:

```
cp site-one-blue/css/theme.css /tmp/theme-blue.css
cp -r site-one/. site-one-blue/
cp /tmp/theme-blue.css site-one-blue/css/theme.css
diff -rq site-one site-one-blue   # should list only css/theme.css
```

To try a different colour, change only `theme.css`. When the client chooses one
colour, keep that folder and delete the other.

---

## Site One — "The Continuous Line"

**Idea.** The gut is one continuous passage from mouth to colon. A single drawn
line is the site's spine: on the homepage it runs through four stops (oesophagus,
stomach, small bowel, colon) and is inked in as you scroll, with a travelling
bead for the endoscope tip. The liver and bile ducts leave the line as an off
shoot. Service and condition pages carry a small copy of the same line, with the
part they concern lit up.

**Palette.**

| Role | Green (`site-one/`) | Blue (`site-one-blue/`) |
|---|---|---|
| Paper | `#F1F4F0` | `#F1F5F9` |
| Ink | `#0E211A` | `#0B1E33` |
| Brand | `#0E6B56` | `#0F5C9E` |
| Deep bands | `#062B23` | `#07233D` |
| Warm accent | `#C0761E` | `#C77A17` |

**Type.** Newsreader (editorial serif) for display, Instrument Sans for text.

**Motion.** Preloader with the logo; line by line masked headline reveal with a
clip path wipe on the portrait; the scroll drawn tract line and its off shoot;
word by word reveal on the passage sentence; counters; magnetic buttons; an
animated film grain over the whole page.

**Navigation.** Services and Conditions & care are dropdowns. Each label links to
its overview page and the arrow beside it opens the list, so both work by hover,
click, touch and keyboard (Escape closes). On phones they expand inside the full
screen menu.

## Site Two — "The Aperture"

**Idea.** The view down an endoscope. The homepage hero is a live `<canvas>`
light tunnel — concentric rings receding into the dark toward a glow, drifting
toward your cursor. Dark rooms are interleaved with clinical light rooms so the
reading sections stay easy on the eyes.

**Palette.** Abyss `#04161B`, deep teal `#072A33`, luminous mint `#6FE0C0`,
amber `#FFB45E`, clinical light `#F3F7F6`.

**Type.** Archivo (tight, engineered grotesque) for display, IBM Plex Sans for
text.

**Motion.** 0–100 counter preloader with an opening iris; canvas tunnel plus a
cursor tracked spotlight; a pinned four step procedure sequence where the image
cross fades as each step becomes active; text that decodes from scrambled
characters; tabbed procedures with a sliding underline; a drag scrollable rail
of work locations; ticker, counters, magnetic buttons, difference blend cursor.

---

## Content

Clinical and biographical copy comes from Dr. Firoz's own about page: education
(Istanbul University → University of Nairobi → University of the Witwatersrand),
practice since 2005, advanced diagnostic and therapeutic endoscopy, visits to all
major Mombasa hospitals, consultations at the Aga Khan Hospital, honorary lecturer
on the ECSACOP postgraduate programme, the three society memberships, the five
conditions, and the Suite 5 location. Consulting hours are from the amendments
document: Monday to Friday, 9:00am to 5:00pm, and Saturday, 9:00am to 12:30pm.

**Needs Dr. Firoz's approval before going live:** everything else, and above all
the ten new service and condition pages. They are standard, non controversial
patient information, written for this site rather than supplied. Specific details
to check include the preparation times for capsule endoscopy, Fibroscan and
ultrasound, and the conditions each service is listed against.

**Placeholders to replace:**

- Telephone (`+254 41 000 0000`) and email
  (`appointments@gastrocentermombasa.com`). Both are flagged in each footer.
- The hero photograph, `assets/img/portrait-office.jpg`. The client asked for the
  picture to change without supplying a new one, so this is the best of the
  existing set.
- The street address on the contact page, "off Mama Ngina Drive", comes from public
  directories and matches the map pin. Confirm it with the clinic.

**Brochures.** Each condition page has a dashed "Patient brochure" slot, ready for
the PDFs when they arrive. Put the file in `assets/brochures/` and replace the
`<div class="brochure">` on that page with:

```html
<a class="brochure" href="assets/brochures/peptic-ulcers.pdf" download>
  <svg viewBox="0 0 24 30" aria-hidden="true"><path d="M3 2.5h12l6 6v19H3z"/><path d="M15 2.5v6h6M8 15h8M8 20h8"/></svg>
  <div><b>Patient brochure</b><span>Download the PDF</span></div>
</a>
```

The solid border and hover state come from `a.brochure` in the stylesheet. If a
brochure will not exist for launch, delete the slot.

**Punctuation:** the visible copy contains no dashes of any kind. Em dashes, en
dashes and hyphens have all been rewritten out, so sentences use commas, colons
and full stops instead. Keep to this in new copy.

**Deliberately omitted:** patient testimonials and treatment statistics. Both
would have had to be invented, and invented patient reviews on a medical site
are a liability. Add real ones with consent when they exist.

## Notes for build-out

- The consultation forms are demonstrations: they show a success message but post
  nothing. Wire them to an endpoint or a form service.
- The contact page embeds a Google map, which loads from Google when the map
  scrolls into view. A plain link to Google Maps sits beside it.
- The sites respect `prefers-reduced-motion` and keep visible keyboard focus.
- Photography is cropped from the supplied image sheets into `assets/img/`.
  `site-two/assets/img/portrait-corridor.jpg` still shows a coat badge reading
  "DR. M. KHAN", which has been cropped out of Site One only.
