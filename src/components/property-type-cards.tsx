import Image from "next/image";
import Link from "next/link";
import { categories, copy, type Category, type Locale } from "@/lib/site";

const icons: Record<Category, string> = {
  residential: "M2 11 12 3l10 8M5 10v10h14V10M10 20v-6h4v6",
  "room-rental": "M3 18V8m18 10v-6a2 2 0 0 0-2-2h-8v5m-8 0h18M5 11h3",
  commercial: "M4 10 6 4h12l2 6M3 10h18M5 11v9h14v-9M10 20v-5h4v5",
  industrial: "M3 20V9l6 4V8l6 4V5h4l2 15H3Zm4-3h2m4 0h2m2 0h2",
  land: "M12 21s6-6 6-12a6 6 0 0 0-12 0c0 6 6 12 6 12Zm0-9a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",
  "new-projects": "M3 21h18M5 21V8h5m0 13V3h8v18m-5-14h2m-2 4h2m-2 4h2",
};

export function PropertyTypeCards({ lang }: { lang: Locale }) {
  return (
    <ul className="property-type-grid">
      {categories.map((category) => (
        <li key={category}>
          <Link
            className="property-type-card"
            href={{ pathname: `/${lang}/properties`, query: { category } }}
          >
            <Image
              src={`/reference-categories/${category}.webp`}
              alt=""
              width={199}
              height={91}
              loading="lazy"
              unoptimized
            />
            <span className="property-type-label">
              <svg className="property-type-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d={icons[category]} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>{lang === "zh" && category === "commercial" ? "店屋及商业产业" :
                lang === "zh" && category === "industrial" ? "工厂及仓库" : copy[lang].categories[category]}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

