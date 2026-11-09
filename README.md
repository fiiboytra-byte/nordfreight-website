# Nordfreight — Logistics Website

Professional, responsive, 5-page static website with a cold navy / ice-blue theme.
No build step, no dependencies. Open `index.html` in a browser.

## Files
| File | Purpose |
|---|---|
| index.html | Home (hero, stats, services, process, testimonial, CTA) |
| services.html | Air, ocean, road, cold chain, warehousing, customs |
| tracking.html | Shipment tracking (demo: NF + 9 digits) |
| about.html | Story, values, team, certifications |
| contact.html | Quote form with validation |
| style.css | All styling (colors are CSS variables at the top) |
| main.js | Shared header/footer, menu, animations, form + tracking logic |

## Customize
- **Brand name / contact details:** edit the header and footer templates at the top of `main.js` (one place updates every page).
- **Colors:** change the variables in `:root` at the top of `style.css`.
- **Text and images:** edit the HTML pages directly.

## Go live
1. **Quote form:** in `main.js`, replace the `TODO` in the form handler with a real `fetch()` to your backend, Formspree, or Netlify Forms.
2. **Tracking:** in `main.js`, replace the demo logic in the tracking handler with a call to your tracking API.
3. Upload the folder to any static host (Netlify, Vercel, GitHub Pages, cPanel).

## Notes
- Fonts load from Google Fonts (Inter, Space Grotesk).
- Brand, company names, phone numbers and testimonials are placeholders; replace them with the client's real details.
