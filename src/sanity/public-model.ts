import type { PublicProperty } from "../lib/properties";

export interface MarketingPhoto {
  asset: { _ref: string; _type: "reference" };
  alt?: string;
  crop?: { top: number; bottom: number; left: number; right: number };
  hotspot?: { x: number; y: number; width: number; height: number };
}
export interface PropertyRecord {
  _id: string; referenceId: string; slug: { current: string };
  title: string; titleZh?: string; description: string; descriptionZh?: string;
  transactionType: "sale" | "rent"; currency: "MYR"; askingPrice: number;
  category: "residential" | "commercial" | "industrial" | "land";
  subtype: string; newProject?: boolean; state: string; area: string; project?: string;
  bedrooms?: number; bathrooms?: number; builtUpSqft?: number;
  landSize?: { value: number; unit: "sqft" | "sqm" | "acre" | "hectare" };
  tenure?: string; furnishing?: string; features?: string[]; photos: MarketingPhoto[];
  status: "available" | "reserved" | "sold" | "rented";
  featured?: boolean; showOnWebsite: boolean; publicApproved: boolean; lastVerifiedDate: string;
}
export interface CmsPublicProperty extends PublicProperty {
  publicId: string; slug: string; description: { en: string; zh: string };
  baseCategory: PropertyRecord["category"]; subtype: string; newProject: boolean;
  state: string; project?: string; currency: "MYR";
  landSize?: PropertyRecord["landSize"]; tenure?: string; furnishing?: string;
  features: string[]; photos: MarketingPhoto[];
  status: "available" | "reserved"; lastVerifiedDate: string;
}
const optionalNumber = (value: unknown, integer = false) => typeof value === "number" && Number.isFinite(value) && value >= 0 && (!integer || Number.isInteger(value)) ? value : undefined;

// Pure, explicit public allowlist. Never spread a CMS document into a page response.
// Shared by the public listing pages.
export function toPublicProperty(record: PropertyRecord, imageUrl: (photo: MarketingPhoto) => string): CmsPublicProperty | null {
  if (!record || !record._id || record._id.startsWith("drafts.") || record._id.startsWith("versions.") ||
      record.publicApproved !== true || record.showOnWebsite !== true ||
      !["available", "reserved"].includes(record.status) ||
      !["residential", "commercial", "industrial", "land"].includes(record.category) ||
      !["sale", "rent"].includes(record.transactionType) || record.currency !== "MYR" ||
      !record.referenceId || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(record.slug?.current ?? "") ||
      !record.title?.trim() || !record.description?.trim() || !record.area?.trim() || !record.state?.trim() ||
      !Number.isFinite(record.askingPrice) || record.askingPrice <= 0 || !record.lastVerifiedDate) return null;
  const photos = (record.photos ?? []).filter(p => /^image-[a-zA-Z0-9]+-\d+x\d+-[a-z0-9]+$/.test(p.asset?._ref ?? "")).map(p => ({
    asset: { _type: "reference" as const, _ref: p.asset._ref }, alt: p.alt,
    crop: p.crop ? { top: p.crop.top, bottom: p.crop.bottom, left: p.crop.left, right: p.crop.right } : undefined,
    hotspot: p.hotspot ? { x: p.hotspot.x, y: p.hotspot.y, width: p.hotspot.width, height: p.hotspot.height } : undefined,
  }));
  if (!photos.length) return null;
  return {
    id: "sanity:" + record.referenceId, publicId: record.referenceId, slug: record.slug.current,
    title: { en: record.title, zh: record.titleZh?.trim() || record.title },
    description: { en: record.description, zh: record.descriptionZh?.trim() || record.description },
    category: record.newProject ? "new-projects" : record.category, baseCategory: record.category,
    subtype: record.subtype, newProject: record.newProject === true,
    propertyType: { en: record.subtype, zh: record.subtype },
    area: { en: record.area, zh: record.area }, state: record.state, project: record.project,
    deal: record.transactionType === "sale" ? "buy" : "rent", price: record.askingPrice, currency: "MYR",
    bedrooms: optionalNumber(record.bedrooms, true), bathrooms: optionalNumber(record.bathrooms, true),
    areaSqft: record.builtUpSqft && record.builtUpSqft > 0 ? optionalNumber(record.builtUpSqft) : undefined,
    landSize: record.landSize && record.landSize.value > 0 && Number.isFinite(record.landSize.value) && ["sqft", "sqm", "acre", "hectare"].includes(record.landSize.unit) ? { value: record.landSize.value, unit: record.landSize.unit } : undefined,
    tenure: record.tenure, furnishing: record.furnishing, features: (record.features ?? []).filter(f => typeof f === "string"),
    photo: imageUrl(photos[0]), photos, featured: record.featured === true,
    status: record.status as "available" | "reserved", lastVerifiedDate: record.lastVerifiedDate,
  };
}
