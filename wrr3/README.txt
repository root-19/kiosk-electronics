R33 Cars Kiosk (wrr3) Static UI
================================

Pages included:
- index.html (Downloads Catalogue)
- category.html (Armored Vehicles sample category)
- brand.html (Ferrari sample brand showcase)

Assets:
- assets/style.css : Core styling (no external framework needed after load).
- assets/app.js    : Search filtering + details modal logic.
- assets/images/   : Placeholder SVG icons (PDF, category, brand logo).

How to add a new month download:
1. Duplicate one <article class="download-item"> in index.html.
2. Update h3 text, data-* attributes:
   data-search (lowercase searchable text), data-title, data-size, data-month, data-desc.
3. Keep the structure (img + .info + .download-actions).
4. If it's newly released, add <span class="badge new">NEW</span> inside the <h3>.

Adding another category page:
1. Copy category.html to a new file (e.g. category-suv.html).
2. Update breadcrumb + title + description.
3. Replace <article class="category-card"> blocks with new items (each needs an <img> + .body with h3 + p + meta badges).
4. Link it from existing pages if needed.

Adding another brand page:
1. Copy brand.html (e.g. brand-lamborghini.html).
2. Swap hero logo (add a new SVG in assets/images/ if desired).
3. Change text + vehicle cards.

Images:
Use royalty-free images (Unsplash used here). Replace with client-approved photography before production.

Accessibility:
- aria-live on downloads list for dynamic filtering.
- Buttons have discernible text.
- Modal closes on ESC and backdrop click.

Customization tips:
- Adjust color variables in :root inside style.css.
- Increase/decrease border radius via --radius tokens.

Enjoy! This folder is standalone; it does not touch the main Laravel codebase.
