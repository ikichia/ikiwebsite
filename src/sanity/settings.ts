// Public identifiers only. No tokens are needed for the Phase 1 Studio.
export const studioProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
export const studioDataset = process.env.NEXT_PUBLIC_SANITY_TEST_DATASET ?? "";
export const studioConfigured = /^[a-z0-9]+$/.test(studioProjectId) && studioDataset === "testing";
export const apiVersion = "2026-11-01";
