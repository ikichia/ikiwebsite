import Image from "next/image";
import Link from "next/link";
import { categories, copy, whatsappUrl, type Locale } from "@/lib/site";
import type { PropertyFilters, PublicProperty } from "@/lib/properties";

export function SearchForm({ lang, filters, home = false }: {
  lang: Locale; filters?: PropertyFilters; home?: boolean;
}) {
  const t = copy[lang];
  return (
    <form className="search-form" action={`/${lang}/properties`} method="get">
      <label>{t.deal}
        <select name="deal" defaultValue={filters?.deal ?? ""}>
          <option value="">{t.either}</option>
          <option value="buy">{t.buy}</option>
          <option value="rent">{t.rent}</option>
        </select>
      </label>
      <label>{t.area}
        <input name="area" type="search" maxLength={80} defaultValue={filters?.area} placeholder={t.areaHint} />
      </label>
      <label>{t.category}
        <select name="category" defaultValue={filters?.category ?? ""}>
          <option value="">{t.all}</option>
          {categories.map((item) => <option key={item} value={item}>{t.categories[item]}</option>)}
        </select>
      </label>
      <label>{t.budget}
        <input name="budget" type="number" inputMode="numeric" min={1} max={999999999999} step={1}
          defaultValue={filters?.budget} placeholder={t.budgetHint} />
      </label>
      <button className="button" type="submit">{home ? t.submit : t.filter} <span aria-hidden="true">↗</span></button>
    </form>
  );
}

export function PropertyGrid({ lang, items }: { lang: Locale; items: readonly PublicProperty[] }) {
  const t = copy[lang];
  const number = new Intl.NumberFormat("en-MY");
  return (
    <div className="property-grid">
      {items.map((item) => (
        <article className="property-card" key={item.id}>
          <a className="property-image" href={item.sourceUrl ?? whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label={`${item.title[lang]} — ${lang === "zh" ? "在新标签页查看" : "view in a new tab"}`}>
            <Image src={item.photo} alt={item.title[lang]} fill sizes="(max-width: 640px) 95vw, (max-width: 960px) 48vw, 370px" />
          </a>
          <div className="card-content">
            <p className="card-meta">{item.area[lang]} · {item.propertyType[lang]} · {item.deal === "buy" ? t.sale : t.rent}</p>
            <h3><a href={item.sourceUrl ?? whatsappUrl} target="_blank" rel="noopener noreferrer">{item.title[lang]}</a></h3>
            <p>{[
              item.areaSqft !== undefined ? `${number.format(item.areaSqft)} sq ft` : undefined,
              item.bedrooms !== undefined ? `${t.bedrooms}: ${item.bedrooms}` : undefined,
              item.bathrooms !== undefined ? `${t.bathrooms}: ${item.bathrooms}` : undefined,
            ].filter(Boolean).join(" · ")}</p>
            {item.note && <p>{item.note[lang]}</p>}
            <p className="price">RM {number.format(item.price)} {item.deal === "rent" && <small>{t.monthly}</small>}</p>
            <a className="button" href={whatsappUrl}>{t.enquire}</a>
            {item.sourceUrl && <a className="text-link" href={item.sourceUrl} target="_blank" rel="noopener noreferrer">{lang === "zh" ? "在 NextSix 查看详情" : "View on NextSix"} ↗</a>}
          </div>
        </article>
      ))}
    </div>
  );
}

export function CategoryGrid({ lang }: { lang: Locale }) {
  return (
    <div className="category-grid">
      {categories.map((item) => (
        <Link key={item} href={{ pathname: `/${lang}/properties`, query: { category: item } }}>
          <strong>{copy[lang].categories[item]}</strong><span aria-hidden="true">↗</span>
        </Link>
      ))}
    </div>
  );
}
