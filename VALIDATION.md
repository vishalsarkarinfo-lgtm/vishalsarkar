# Static export validation

Validated locally on 22 September 2026 using Chromium and an ordinary static HTTP server. No site was deployed and no messages were sent.

## Pages and paths

- 31 content pages plus the standalone 404 page are included.
- All 31 content pages were rendered at 1440px, 768px, 390px and 320px widths: 124 responsive page checks, with no horizontal overflow.
- The site was served under `/vishal-portfolio/` to check GitHub Pages project-style subpaths. Root hosting and directly opening `index.html` were also checked.
- All 1,711 local HTML asset/link references resolve to files in the package. No root-relative asset paths are required.
- Page titles, one main heading per content page, and parseable structured data were checked.
- No references to the former private Sites address, React hydration, framework runtime or appointment API remain.

## Interactions and appearance

- Desktop service navigation opens, lists 11 service links, and closes on outside click or Escape. Escape restores focus.
- Mobile navigation opens, closes on Escape, and follows page links.
- Service FAQ sections open and close using native HTML controls.
- All four supplied-photo placements decode successfully: Home hero, Home About section, About introduction, and Contact.
- Desktop and mobile home views, footer, mobile menu and appointment preview were visually reviewed.
- Footer spacing reserves room for the fixed WhatsApp button.

## Appointment requests

- Service preselection from the query string works.
- Required fields, invalid phone numbers, past dates and valid future requests were checked.
- Preview text and encoded WhatsApp/email payloads contain the expected details and the supplied contact destinations.
- Editing a field hides an outdated preview. The copy-message control provides success or selection feedback.
- Preparing a request does not issue a POST, call an API, send a message or save data to a database.
- The site needs no externally hosted script, font, stylesheet or image to render. No JavaScript errors or failed HTTP responses were observed in the final interaction run. Lazy image requests interrupted by moving to another page were excluded from failure counts; photo loading was checked separately.

## Asset sizes

Sizes below are the raw file sizes, before any compression supplied by the host.

| Asset | Approximate size |
| --- | ---: |
| Minified CSS | 42.5 KB |
| Minified JavaScript | 4.6 KB |
| Personal photo, 480px WebP | 24.9 KB |
| Personal photo, 800px WebP | 47.0 KB |
| Personal photo, 1280px WebP | 83.0 KB |
| Home HTML | 40.3 KB |

CSS was reduced from about 180 KB by removing unused rules and minifying. The browser selects responsive image variants; secondary images load lazily. These are measured file sizes, not a hosted performance score.

## Optional URL configuration

`tools/configure-site.py` was tested in a separate copy with both a repository URL and a custom-domain URL. It generated 31 sitemap entries, one canonical URL per content page, absolute social images and valid JSON-LD. Running it again updated the previously configured base URL correctly.

## Scope

The export has been checked locally, not on a deployed GitHub Pages account. It contains no backend appointment database or Sites authentication gate. GitHub determines the published site's access. External social websites and delivery through visitors' WhatsApp/email applications are outside these local checks.
