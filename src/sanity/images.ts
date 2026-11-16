import { createImageUrlBuilder } from "@sanity/image-url";
import type { MarketingPhoto } from "./public-model";
export function marketingImageUrl(photo: MarketingPhoto, projectId: string, dataset: string, width = 960) {
  return createImageUrlBuilder({ projectId, dataset }).image(photo)
    .width(Math.max(160, Math.min(1920, width))).fit("max").auto("format").quality(82).url();
}
