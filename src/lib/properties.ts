import { readSanityListings } from "../sanity/public-reader";
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
  slug: string;
}

export type PropertyQuery = Record<string, string | string[] | undefined>;

export function readFilters(query: PropertyQuery) {
  const deal = query.category === "room-rental" ? "rent" : query.deal === "buy" || query.deal === "rent" ? query.deal : "";
  const category = query.category === "room-rental" ? "" : categories.find((item) => item === query.category) ?? "";
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

export async function listPublicProperties(filters?: PropertyFilters) {
  const properties = await readSanityListings();
  const ids = new Set<string>();
  const slugs = new Set<string>();
  return properties.filter(property => {
    if (ids.has(property.id) || slugs.has(property.slug)) return false;
    ids.add(property.id);
    slugs.add(property.slug);
    return !filters || matchesFilters(property, filters);
  });
}