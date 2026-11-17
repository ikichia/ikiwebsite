// These two identifiers are public. Vercel supplies VERCEL_ENV separately.
export const studioProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
export const studioDataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "";
export const apiVersion = "2026-11-01";

export function validateSanityConfig(
  projectId: string | undefined,
  dataset: string | undefined,
  vercelEnvironment: string | undefined,
  onVercel?: string,
) {
  if (onVercel === "1" && !vercelEnvironment) {
    throw new Error("Sanity configuration: VERCEL_ENV is required on Vercel. Enable system environment variables.");
  }

  const environment = vercelEnvironment ?? "development";
  if (environment !== "development" && environment !== "preview" && environment !== "production") {
    throw new Error("Sanity configuration: VERCEL_ENV must be development, preview, or production.");
  }
  if (!dataset) throw new Error("Sanity configuration: NEXT_PUBLIC_SANITY_DATASET is required.");
  if (dataset !== "testing" && dataset !== "production") {
    throw new Error("Sanity configuration: NEXT_PUBLIC_SANITY_DATASET must be testing or production.");
  }

  const expectedDataset = environment === "production" ? "production" : "testing";
  if (dataset !== expectedDataset) {
    throw new Error(`Sanity configuration: ${environment} requires NEXT_PUBLIC_SANITY_DATASET=${expectedDataset}.`);
  }
  if (!projectId || !/^[a-z0-9]+$/.test(projectId)) {
    throw new Error("Sanity configuration: a valid NEXT_PUBLIC_SANITY_PROJECT_ID is required.");
  }
}
