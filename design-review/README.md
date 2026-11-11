# University Signature Studio: Design exploration

11 November 2026 | Design review, not a production release

This branch records the approved starting point for a design-led redesign of the existing SPSS Signature Builder. It deliberately does not change the working `index.html`, `app.js` or `config.js` on `main`.

## Current implementation

The existing application is a GitHub Pages-hosted HTML/CSS/JavaScript interface, with configuration in `config.js` and Outlook output logic in `app.js`. This architecture is suitable for the redesign without a framework migration. The browser inspection found a working two-column layout and accessible central functions, with several opportunities to improve clarity: lengthy settings column, small field text, duplicated policy notices, under-emphasised preview and insufficient indication of a simple completion journey.

## Three design directions

- **A / Editorial Signature Studio**: expressive University-red typography, precise grid and generous whitespace; strong institutional identity, but the large hero makes the first interaction less immediate.
- **B / Guided Signature Journey**: three clear stages (your details, personalise, ready to copy) with immediate feedback and a persistent desktop preview; the recommended direction.
- **C / Professional Creative Workspace**: a focused editor with central signature canvas, compact inspector and navigation rail; attractive for power users but more complex for occasional staff use.

Provisional weighted scores / 5, following the Newell Website Design Field Guide:

| Criterion | Weight | A | B | C |
|---|---:|---:|---:|---:|
| Task clarity | 25% | 4.3 | 4.9 | 4.1 |
| Audience fit | 20% | 4.4 | 4.9 | 4.0 |
| Professional credibility | 15% | 4.7 | 4.6 | 4.5 |
| Accessibility | 15% | 4.4 | 4.7 | 4.1 |
| Distinctiveness | 10% | 4.8 | 4.3 | 4.5 |
| Maintainability | 10% | 4.6 | 4.7 | 4.2 |
| Performance | 5% | 4.6 | 4.6 | 4.2 |
| **Total** | **100%** | **4.49** | **4.73** | **4.20** |

These are provisional design assessments, not measurements from staff testing.

## Recommended decision

Choose **Concept B, with editorial typography and preview styling informed by A**. Deliver this as a view-layer redesign while preserving the existing validated HTML email renderer.

### Non-negotiable output features

- Correct University, School and Faculty identity; official high-resolution University logo.
- All nine mandatory support contacts in both standard and compact reply signatures.
- ORCID green mark and linked identifier; Staff Weblink labels full profile URLs.
- Existing eligible affiliation logos, up to four per row, with restrictions clearly conveyed. Do not reintroduce the outdated BASES laboratory logo.
- Up to three accurate, discipline-specific marketing claims, with source/year.
- Outlook-compatible tables, inline email CSS, functional copy/download fallback.
- Client-side handling of staff details.

## Before implementation

1. Confirm the selected concept or provide design amendments.
2. Record baseline screenshots and mark up final desktop/mobile layout, token scale, controls and reduced-motion behaviour.
3. Build only on a development branch, leaving production unaffected.
4. Compare new output to existing Outlook HTML; test keyboard, responsive views, browser copy and Outlook versions.
5. Submit for Head of School pilot review before a production merge.

### Concept assets

The three standalone responsive interactive design mockups, desktop/mobile screenshots, scorecard and QA results are supplied as a downloadable design-review pack in the ChatGPT conversation. They are **visual prototypes only**; their Outlook copy buttons are intentionally disabled and no message is sent.

Review package: `SPSS_Signature_Studio_Design_Review.zip` (conversation artifact)

Live site remains: https://mikelnewell.github.io/SPSS-Signature-Builder-/
