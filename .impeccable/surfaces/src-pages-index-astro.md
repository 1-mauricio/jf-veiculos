---
version: 1
slug: "src-pages-index-astro"
primary_target: "src/pages/index.astro"
related_targets: ["src/pages/veiculos/index.astro","src/pages/veiculos/[slug].astro","src/pages/loja.astro"]
---

# Home (src/pages/index.astro)

Mode: Persuade. Audience: local moto buyer on a phone. Action: open a WhatsApp conversation about a specific bike, or browse stock.

## Direction contract

THESIS: The site is the lot's windshield. Every bike is priced the way the store writes it on glass: big, by hand, posca yellow and white. Refuses the category default of a dark gradient hero with a rounded card grid and icon feature tiles.

OWN-WORLD: Ground is asphalt at night (#16191B) and concrete by day (#E9E7E2, --surface-page), switched by the user theme toggle; the header, hero pane, photos and footer stay asphalt/glass in both. Glass panes in slate (#2B3338) with a faint reflection, posca yellow ink (#F6E23A, the CMS accent) and posca white. Hand-lettered marker face (Permanent Marker) only for prices, model names and short shouts; Archivo for everything else in plain caps labels and sentence-case body. Square-ish 6px corners, no soft shadows, no icon tiles, no gradients beyond the glass sheen, no eyebrows.

STORY: The visitor sees a real bike with its price written on it, understands this is a real lot in Dois Carneiros, scrolls the stock written the same way, and taps the yellow WhatsApp bar.

FIRST VIEWPORT: Header bar with logo and menu. Featured bike photo as a glass pane filling the width; price hand-written large across the top-left of the photo, model and year below it in yellow marker, "REVISADA · LAUDO CAUTELAR" in white marker. Full-width yellow WhatsApp bar right under the pane. Stock begins at the fold.

FORM: Preço no Para-brisa, position 1 of my ordered list (IMPECCABLE'S PICK). seed:5333a8119f542fee

Signature interaction: the price on each card is drawn on with a short stroke-reveal when it scrolls into view (clip-path wipe, reduced-motion shows it static).

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
