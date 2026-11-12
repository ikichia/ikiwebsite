# Original NextSix listing recovery — 11 November 2026

## Evidence

- Chat: `Build Iki Chia real estate landing page`, ID `01a1aee0-b271-7e72-a1b0-fedeadcd8614`.
- Original HTML: `../../ou-are-codex-an-expert-front/outputs/index.html` (relative to project root).
- Local copy: `../outputs/github-pages/index.html`. This contains three complete cards, embedded WebP photos, prices, specifications and NextSix detail links.
- Earlier alternative layout: `../../design-premium-trustworthy-navy-warm-gold/work/template.html`, with the same three listings.
- Desktop `property-with-iki.zip` (modified 11 November 2026, 19:21 local time) already has `readPublishedProperties()` returning `[]`.
- Current repository has no commits, reflog entries, stashes or Git objects. No exact deletion commit can be identified. The available evidence indicates the old static HTML listings were not connected to the Next.js data adapter. Recent portrait work did not remove that adapter's data.

## Verification and scope

The public Iki Chia profile was opened in a browser on 11 November 2026 and showed two sale listings and eight rentals. Each of the original three listings was found on that profile and its detail page checked for Iki Chia attribution, price, type and room counts. Other agents' recommended listings were excluded.

Restored only these original records:

| ID | Title | Source price | Deal |
| --- | --- | --- | --- |
| 6ad176a08523a37c3fc50f51 | Kensington Indahpura Kulai | RM888,000 | Sale |
| 6ad182718523a37c3fc67a18 | Bandar Putra Kulai | RM610,000 | Sale |
| 6acdae78cdfeb9ee8213513d | Bay Laurel @ Country Garden Danga Bay | RM2,300/month | Rent |

Exact source URLs are stored with each record in `src/lib/properties.ts`. Photos were decoded unchanged from the original HTML's embedded WebP data, not generated or obtained from another agent. Their resolution is limited to the old embedded assets.

Both terrace pages label an area as built-up but describe that same figure as land area (1,650 and 1,540 sq ft). Those ambiguous area values are omitted. Bandar Putra's locality fields conflict; only Johor is shown, with a clarification note. Its title remains searchable for Kulai. Bay Laurel's 832 sq ft built-up figure is consistent.

This is a manually verified local snapshot, not an API, scraper, automatic sync or new listing system. Existing filters search the local selection only. The profile button remains available for the full NextSix inventory. Confirm availability with Iki; a public listing is not a guarantee that a property remains available.

No changes to Hero styling, portrait, fonts, category imagery, WhatsApp destinations, or deployments.
