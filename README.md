# Vishal Sarkar — GitHub Pages website

This ZIP contains the complete current website converted to a self-contained static site, including the supplied photo in all four personal portrait locations. It is ready to upload: **no npm install, framework build, server, database, API key or Sites account is required to host this package.**

## Publish on GitHub Pages

1. Extract the ZIP. Upload the **contents** of `vishal-sarkar-github-pages/` to your repository, so `index.html`, `assets/`, `.nojekyll`, `about/`, etc. are at the repository root. Do not upload only the ZIP file or add an extra containing folder.
2. In the repository, open **Settings → Pages**. Choose **Deploy from a branch**, select your publishing branch (usually `main`), select **/(root)**, and save. Ensure `.nojekyll` is included; it tells Pages to serve these ready-made static files without Jekyll processing.
3. Open the Pages address reported by GitHub after its deployment finishes. The package supports both `https://USERNAME.github.io/` and `https://USERNAME.github.io/REPOSITORY/` without changing the HTML paths.

This package does not publish anything automatically. GitHub controls the repository and Pages visibility. This exported copy does not include the previous Sites login/access gate.

Official references:
- https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages
- https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Included pages

- Home, About, Services, Projects, client project case study, Insights, Contact and Book appointment.
- All 11 current service detail pages and all 9 current articles.
- Privacy, Terms, Disclaimer and a standalone 404 page.
- 32 HTML files in total, including the 404 page.

All ordinary site links explicitly point to relative `index.html` paths, so they work under any repository name. There are no leading-slash asset paths and no references to the former private Sites address.

## Appointment form: static-host behavior

GitHub Pages cannot execute the original server/database appointment handler. This export therefore keeps the appointment interface but uses a local message-preparation flow:

1. The visitor enters their details and a future preferred date/time in IST.
2. The form validates the details and displays a message preview.
3. The visitor chooses **Send via WhatsApp**, **Send via email**, or **Copy message**.
4. They review and send the message in their own WhatsApp/email application. A meeting is confirmed separately by Vishal.

Preparing the message does not send anything, save a database record, or create a confirmed appointment. Phone, email, WhatsApp and service selections are wired to the supplied business details. The page still offers direct WhatsApp and email links if JavaScript is disabled. For very long messages or email-app URL limits, use **Copy message** and paste it into your app. The Privacy and Terms pages reflect this behavior. There are no secret credentials or customer records in this package.

## Images and first-load performance

- Your unchanged supplied photo was used to generate 480px, 800px and 1280px WebP variants. The browser selects the appropriate size using `srcset`.
- Photo placements: Home hero, Home About section, About page introduction, and Contact page.
- Portrait crops are set in CSS with `object-fit: cover` and `object-position`; the face itself has not been altered.
- The hero photo loads eagerly with high priority. Secondary photos and project screenshots load lazily. Explicit dimensions reserve layout space.
- The client project screenshot also has 640px/1280px WebP variants.
- CSS is trimmed and minified; JavaScript is a small deferred local file.
- No React/Next.js hydration, CDN fonts, icon libraries, analytics requests, remote image URLs, third-party scripts or backend fetches are needed to render or navigate the site. Icons are inline SVG; typography uses system fonts.
- External business/contact links intentionally open the corresponding external services.

## Edit the website

- Edit text directly in each page's `index.html` using a UTF-8 editor.
- `assets/css/style.min.css` and `assets/js/site.min.js` are the production files used by every page.
- `source/style.css` and `source/site.js` contain editable CSS/JavaScript. After editing, copy their contents over the matching production files; unminified CSS/JS works too. Keep the filenames unchanged to preserve all page links.
- Keep the image filenames or update **every** matching `src` and `srcset` reference when replacing images. Preserve their declared dimensions and accessible alt text.
- `source/routes.json` lists every content route.
- Do not use the old Sites ZIP or upload server-runtime files along with this package.

## Optional SEO setup after you know the final URL

The default files do not hardcode a private or guessed canonical address. The site works immediately without this step. For canonical URLs, absolute social-preview metadata, structured-data URLs and a sitemap, run:

```bash
python3 tools/configure-site.py https://USERNAME.github.io/REPOSITORY/
```

For a user site or custom domain, pass its actual HTTPS root URL instead. Then upload the updated HTML files, `sitemap.xml`, `robots.txt` and `site-url.txt`. The helper uses only Python's standard library. Run it again if the final URL changes.

## Preview locally

Opening the root `index.html` directly works for browsing. For the most accurate local test, run from the extracted folder:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000/`. This is only for local preview and is not required on GitHub Pages.

See `VALIDATION.md` for the checks performed on this export.
