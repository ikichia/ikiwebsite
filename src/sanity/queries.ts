// Only explicitly approved, visible, active listings are eligible for the website.
export const publishedPropertyQuery = `*[_type == "property" && publicApproved == true && showOnWebsite == true && status in ["available", "reserved"] && !(_id in path("drafts.**")) && !(_id in path("versions.**"))] | order(_updatedAt desc) {
  _id, referenceId, slug{current}, title, titleZh, description, descriptionZh,
  transactionType, currency, askingPrice, category, subtype, newProject,
  state, area, project, bedrooms, bathrooms, builtUpSqft, landSize{value, unit},
  tenure, furnishing, features, photos[]{asset{_type, _ref}, alt, crop{top,bottom,left,right}, hotspot{x,y,width,height}},
  status, featured, showOnWebsite, publicApproved, lastVerifiedDate
}`;
// Future readers must use perspective:"published", a fixed dataset, and this allowlist.
// Future detail pages: /{lang}/properties/{slug}; not created/linked during Phase 1.
