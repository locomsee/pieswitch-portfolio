# Pieswitch — Company Portfolio Website

A static, dependency-free marketing website for Pieswitch — a technology company building software, digital platforms, APIs and cloud-native solutions.

## Stack & Constraints

- HTML5, CSS3, vanilla JavaScript only — no frameworks, no build step, no backend, no database.
- Zero external network requests: no font CDN, no icon library, no analytics. All icons are inline SVG; typography uses a system-font stack.
- Fully static — works by opening `index.html` directly in a browser (`file://`) and deploys as-is to any static host.

## File Structure

```
index.html              Single-page site (all sections, inline SVG icon sprite)
css/style.css            Design tokens + all styles (mobile-first, responsive)
js/script.js              Nav, scroll reveal, smooth scroll, contact form logic
assets/icons/favicon.svg  Favicon / brand mark
assets/images/og-image.svg  Social share preview image
README.md
```

## Run Locally

Just open `index.html` in a browser — no install, no build.

Optional local server (only needed for testing things like relative-path edge cases):

```bash
python -m http.server 8000
# or
npx serve .
```

## Deployment

No build step is required for any of these — deploy the repository root as-is.

- **GitHub Pages**: Settings → Pages → Deploy from branch → root.
- **Netlify**: New site from Git, leave the build command empty, publish directory `/`.
- **Vercel**: Import the repo, framework preset "Other", no build command.
- **Cloudflare Pages**: Connect the repo, no build command, output directory `/`.

## Customization

- **Contact email**: update `hello@pieswitch.com` in `index.html` (appears in the Contact section) and remove or update the "placeholder, not actively monitored" note once a real inbox is connected.
- **Contact form**: the form validates on the frontend and shows a success message but does not send data anywhere — wire it to a form backend (e.g. Formspree, a serverless function, or your own API) by adding a real `action`/`fetch` call in `js/script.js`.
- **Social links**: no social links are included by default (to avoid implying accounts that don't exist). Add them to the footer in `index.html` once real profiles exist.
- **Design tokens**: colors, spacing, type scale, radii and shadows are all defined as CSS custom properties at the top of `css/style.css` — edit them there to re-theme the whole site.
- **OG image**: `assets/images/og-image.svg` is used for social previews. Some platforms (notably older Facebook/LinkedIn crawlers) render OG images more reliably as PNG/JPG — consider exporting a 1200×630 PNG from this SVG for maximum compatibility.

## Content Notes

- The **Products** section includes one real product (Inrema) and two cards explicitly marked "Coming Soon" — replace those only when there is a real product to describe.
- The **Selected Work** section uses clearly labeled placeholder case studies (dashed borders, "Coming Soon" status) rather than fabricated client work. Replace individual cards with real case studies as they become available for publication.
- No client names, revenue figures, headcount, awards, certifications or years-in-business are referenced anywhere on the site — keep it that way unless the claims are real and verifiable.

## Accessibility

Semantic landmarks, a skip-to-content link, visible focus states, keyboard-operable navigation (including the mobile menu), ARIA labels on icon-only controls, and full support for `prefers-reduced-motion` (all animations and smooth-scrolling are disabled when the user has requested reduced motion).
