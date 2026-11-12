import { categories, type Category, type Locale } from "./site";

type Deal = "buy" | "rent";
type Localized = Record<Locale, string>;

export interface PublicProperty {
  id: string;
  category: Category;
  deal: Deal;
  title: Localized;
  area: Localized;
  propertyType: Localized;
  price: number;
  areaSqft?: number;
  bedrooms?: number;
  bathrooms?: number;
  photo: string;
  featured: boolean;
  sourceUrl?: string;
  note?: Localized;
}

// Recovered from the original Iki Chia landing page; rechecked against the
// agent profile and all three detail pages on 2026-11-11. Manual snapshot,
// not a live NextSix integration. See docs/nextsix-recovery.md.
const publishedProperties: readonly PublicProperty[] = [
  {
    id: "6ad176a08523a37c3fc50f51", category: "residential", deal: "buy",
    title: { en: "Kensington Indahpura Kulai", zh: "Kensington Indahpura Kulai" },
    area: { en: "Kulai, Johor", zh: "古来，柔佛" },
    propertyType: { en: "2-storey terrace", zh: "双层排屋" },
    price: 888000, bedrooms: 4, bathrooms: 3,
    photo: "/nextsix/6ad176a08523a37c3fc50f51.webp", featured: true,
    sourceUrl: "https://nextsix.com/property-listing/kensington-indahpura-kulai-2-sty-terracelink-house-sale-iki-chia-6ad176a08523a37c3fc50f51",
    note: { en: "Built-up area needs confirmation.", zh: "建筑面积待确认。" },
  },
  {
    id: "6ad182718523a37c3fc67a18", category: "residential", deal: "buy",
    title: { en: "Bandar Putra Kulai", zh: "Bandar Putra Kulai" },
    area: { en: "Johor", zh: "柔佛" },
    propertyType: { en: "2-storey terrace", zh: "双层排屋" },
    price: 610000, bedrooms: 4, bathrooms: 3,
    photo: "/nextsix/6ad182718523a37c3fc67a18.webp", featured: true,
    sourceUrl: "https://nextsix.com/property-listing/bandar-putra-kulai-2-sty-terracelink-house-sale-iki-chia-6ad182718523a37c3fc67a18",
    note: { en: "Exact locality and built-up area need confirmation.", zh: "确切地区及建筑面积待确认。" },
  },
  {
    id: "6acdae78cdfeb9ee8213513d", category: "residential", deal: "rent",
    title: { en: "Bay Laurel @ Country Garden Danga Bay", zh: "Bay Laurel @ Country Garden Danga Bay" },
    area: { en: "Johor Bahru, Johor", zh: "新山，柔佛" },
    propertyType: { en: "Condominium", zh: "公寓" },
    price: 2300, bedrooms: 2, bathrooms: 2, areaSqft: 832,
    photo: "/nextsix/6acdae78cdfeb9ee8213513d.webp", featured: true,
    sourceUrl: "https://nextsix.com/property-listing/bay-laurel-country-garden-danga-bay-condominium-rent-iki-chia-6acdae78cdfeb9ee8213513d",
  },
];

export type PropertyQuery = Record<string, string | string[] | undefined>;

export function readFilters(query: PropertyQuery) {
  const deal = query.deal === "buy" || query.deal === "rent" ? query.deal : "";
  const category = categories.find((item) => item === query.category) ?? "";
  const area = typeof query.area === "string" ? query.area.trim().slice(0, 80) : "";
  const rawBudget = typeof query.budget === "string" ? query.budget.trim() : "";
  const budget = /^\d{1,12}$/.test(rawBudget) && Number(rawBudget) > 0 ? String(Number(rawBudget)) : "";
  return { deal, category, area, budget };
}

export type PropertyFilters = ReturnType<typeof readFilters>;

export function matchesFilters(property: PublicProperty, filters: PropertyFilters) {
  const area = filters.area.toLowerCase();
  return (!filters.deal || property.deal === filters.deal) &&
    (!filters.category || property.category === filters.category) &&
    (!area || [...Object.values(property.area), ...Object.values(property.title)].some((label) => label.toLowerCase().includes(area))) &&
    (!filters.budget || property.price <= Number(filters.budget));
}

// Phase two will query published records and explicitly select only these public fields.
// Do not read full addresses, unit numbers, internal notes or source details here.
async function readPublishedProperties(): Promise<readonly PublicProperty[]> {
  return publishedProperties;
}

export async function listPublicProperties(filters?: PropertyFilters): Promise<readonly PublicProperty[]> {
  const published = await readPublishedProperties();
  return filters ? published.filter((property) => matchesFilters(property, filters)) : published;
}
