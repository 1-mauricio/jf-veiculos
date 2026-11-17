# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: local motorcycle buyers in the Recife metropolitan area (Dois Carneiros, Jaboatão and nearby) — workers and delivery riders who need a reliable bike, often financed. They arrive on a phone, usually from Instagram (@jf_veiculo_) or a shared WhatsApp link, and compare price, year, km and installments before talking to someone.

Secondary: people who want to sell or trade in their vehicle (the "Quer vender ou trocar o seu?" flow). Cars exist in the catalog but the stock is mostly motorcycles.

## Product Purpose

The catalog site of JF Veículos, a used-vehicle dealer in Recife-PE founded in 2013. It lets visitors browse stock, favorite and compare vehicles, ask an AI chat assistant about the stock, and find the store. Success is a qualified conversation started on the store's WhatsApp, where the sale actually happens.

## Positioning

A neighborhood dealer with real, inspected stock and a person on the other end of WhatsApp: every vehicle listed is physically at the store on Av. Chapada do Araripe, with a cautelar report and a 220-item inspection.

## Operating Context

- Mobile-first, often on mid-range Android phones and mobile data.
- The sale closes on WhatsApp (5581981944936) or at the store; the site never takes payments.
- Store staff edit content (vehicles, testimonials, store data, texts, theme) through Decap CMS at `/admin`, with no code; each publish is a git commit. Content lives as JSON in `src/content/`.
- Hosted on Netlify; Astro static site with a server chat endpoint (Groq-backed assistant, see `docs/chatbot.md`).

## Capabilities and Constraints

- Pages: home, vehicle listing (`/veiculos`), vehicle detail, favorites, compare, store (`/loja`), 404.
- Favorites and compare are client-side (browser storage).
- Theme colors and fonts are switchable from the CMS (`src/content/aparencia`), so design must work through tokens, not hardcoded values.
- Every content field may be edited by non-technical staff: layouts must survive long/short text and missing photos or fields.
- Portuguese (pt-BR) only.

## Brand Commitments

- Name: JF Veículos. Tagline: "realizando sonhos". Logo at `public/images/site/logo-quadrado-transparente.png`.
- Voice: direct, warm, local, no fine print ("Sem pegadinha").

## Evidence on Hand

- Confirmed: cautelar report and 220-item inspection on every vehicle.
- Real Google-style testimonials in `src/content/depoimentos/` (rating 5.0 from 10 reviews per `loja.json`).
- Store data: CNPJ, address, hours, Maps link in `src/content/loja/loja.json`.
- **Not confirmed — do not reuse in new work until the owner confirms:** "até 60x" / "menores taxas do mercado" (removed from the copy on 2026-11-17), "garantia de motor e câmbio" on every vehicle, "financiamento aprovado na hora", "1000+ vendidos".

## Product Principles

1. Every path ends in WhatsApp: the next step to talk to the store is always one tap away.
2. Price, year, km and installments first — the buyer is comparing, not browsing for fun.
3. Trust through verifiable facts (real stock, inspection, address, CNPJ), never inflated claims.
4. Built for the phone in the hand on a slow connection.
5. Staff can run it alone: everything editable in the CMS must still look right.
