import { cache } from "react";
import { marketingImageUrl } from "./images";
import { toPublicProperty, type PropertyRecord } from "./public-model";
import { publishedPropertyQuery } from "./queries";
import { apiVersion, studioConfigured, studioDataset, studioProjectId } from "./settings";

export const readSanityListings = cache(async () => {
  if (!studioConfigured) return [];

  const endpoint = new URL(`https://${studioProjectId}.api.sanity.io/v${apiVersion}/data/query/${studioDataset}`);
  endpoint.searchParams.set("query", publishedPropertyQuery);
  endpoint.searchParams.set("perspective", "published");
  const response = await fetch(endpoint, { cache: "no-store", signal: AbortSignal.timeout(8000) });
  if (!response.ok) throw new Error(`Unable to read published Sanity listings (HTTP ${response.status}).`);

  const { result } = await response.json() as { result: PropertyRecord[] };
  return result.flatMap(record => {
    const listing = toPublicProperty(record, photo => marketingImageUrl(photo, studioProjectId, studioDataset));
    return listing ? [listing] : [];
  });
});
