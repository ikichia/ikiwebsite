import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LanguageSwitch } from "@/components/site";
import { areaGuides } from "@/lib/areas";
import { copy, isLocale } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[lang]/area-guides">): Promise<Metadata> {
  const { lang } = await params;
  return { title: isLocale(lang) ? copy[lang].guides : "Area Guides" };
}

export default async function AreaGuides({ params }: PageProps<"/[lang]/area-guides">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = copy[lang];

  return (
    <main id="main">
      <section className="listing-hero">
        <div className="shell">
          <div className="utility"><p className="eyebrow"><span />{t.location}</p><LanguageSwitch lang={lang} path="/area-guides" /></div>
          <Link className="text-link" href={`/${lang}`}>← {t.home}</Link>
          <h1>{t.guides}</h1><p>{t.guidesIntro}</p>
        </div>
      </section>
      <section className="shell section guides-grid" aria-label={t.guides}>
        {areaGuides.map((area) => (
          <article className="guide-card" key={area.slug} id={area.slug}>
            <h2>{area.name[lang]}</h2><p>{area.note[lang]}</p>
            <Link className="text-link" href={{ pathname: `/${lang}/properties`, query: { area: area.name.en } }}>{t.guideListings} ↗</Link>
          </article>
        ))}
      </section>
    </main>
  );
}
