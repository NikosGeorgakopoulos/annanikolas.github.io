# Copilot instructions for `annanikolas.github.io`

## Project shape and runtime
- This repo is a **single-page static wedding website** with no framework or bundler.
- Core files are `index.html`, `css/styles.css`, and `js/main.js`.
- Assets are loaded directly from `assets/` (`images/`, `fonts/`, `qrcodes/`) via relative paths.
- There is no npm/pip setup; changes should stay compatible with direct browser execution.

## Architecture and data flow
- `index.html` defines all sections (`.container`, `#travel`, `#rsvp`) and form fields.
- `js/main.js` binds behavior by **DOM IDs** (e.g., `#attendance`, `#attendingFields`, `#rsvpBtn`, `#countdown`).
- `css/styles.css` provides all visual behavior, including responsive-ish layout via flex wrapping in `.travel-destinations`.
- RSVP data flow: user input -> `validateForm()` -> JSON `fetch()` POST to Google Apps Script endpoint (`scriptURL`) -> success/error message in `#formMessage`.

## High-impact conventions in this repo
- Preserve ID/class contracts between HTML and JS. If you rename an element ID in `index.html`, update all selectors in `js/main.js`.
- Conditional RSVP fields are controlled with inline `style.display` toggles (`block`/`none`), not class toggling.
- User-facing copy is mostly Greek; keep existing language/tone consistent when editing form labels/messages.
- Typography depends on local font files declared with `@font-face`; keep font paths relative to `css/styles.css`.
- Keep this project dependency-free unless explicitly requested.

## Integration points and external dependencies
- RSVP submission depends on a live Google Apps Script webhook hardcoded in `js/main.js` (`scriptURL`).
- The travel section links to Google Maps URLs and uses QR images from `assets/qrcodes/`.
- Countdown is client-side only and uses a hardcoded wedding date (`2026-09-26`) in `js/main.js`.

## Editing guidance for AI agents
- For RSVP form changes, update in tandem:
  - HTML form fields in `index.html`
  - validation + payload in `validateForm()` and submit handler in `js/main.js`
  - any corresponding style rules in `css/styles.css`
- For section/navigation changes, ensure `nav` anchors (`href="#..."`) still match existing section IDs.
- When changing CTA behavior (`#rsvpBtn`), keep smooth scrolling to `#rsvp` unless asked otherwise.
- Prefer minimal, surgical edits; this site is intentionally simple and manually maintained.

## Local verification workflow
- Run locally by opening `index.html` in a browser.
- After edits, manually verify:
  - RSVP conditional field visibility logic
  - form success/error messaging and button disabled/loading state
  - countdown text rendering in `#countdown`
  - asset loading (hero image, travel images, QR codes, fonts)