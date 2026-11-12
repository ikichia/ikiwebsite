# Property with Iki

Johor · Malaysia

## Local development

Use Node.js 24 and run `npm ci`, then `npm run dev`. Open http://localhost:3000.
The English and Chinese homepages are at `/en` and `/zh`. Each language has a
`/properties` page. Filters are stored in the URL and retained when switching languages.

Run `npm run lint` and `npm run build` before pushing changes.

The bilingual area guides are at `/en/area-guides` and `/zh/area-guides`.
General contact uses the official WhatsApp and Facebook links. The owner form
opens a prefilled WhatsApp draft with the business number from the previous
site. If that number changes, set `NEXT_PUBLIC_WHATSAPP_PHONE` in `.env.local`
to the country code and number, without spaces or a plus sign.

## Published listings

`src/lib/properties.ts` defines the public data shape and the read adapter.
When a database is added, the adapter should read only published records and
select only the public fields. Keep addresses, unit numbers and internal notes
and private listing sources in the private admin data. The adapter currently returns
three original Iki Chia NextSix listings, manually rechecked on 11 November 2026.
Public NextSix detail links are included on each card. This is not a live sync:
search filters apply only to the local selection. See `docs/nextsix-recovery.md`
for provenance and fields omitted because the source is inconsistent. The previous
demo assets remain on disk and are not referenced by the public pages.

The protected admin area, database, image storage and full article pages are
planned for a later phase.

## Homepage category photography

The six illustrative, cropped WebP files are in public/property-types/. Current photo authors, source links and license terms are shown in the homepage category photo credits. The homepage portrait is the supplied original JPG.
