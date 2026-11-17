"use client";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { property } from "./src/sanity/schema/property";
import { reviewedPublish } from "./src/sanity/actions";
import { studioDataset, studioProjectId } from "./src/sanity/settings";

export default defineConfig({
  name: "iki-properties", title: "Property with Iki — PUBLIC DATA ONLY / 仅限公开资料",
  projectId: studioProjectId, dataset: studioDataset, basePath: "/studio",
  plugins: [structureTool()], schema: { types: [property] },
  document: {
    // No quick-publish or duplicate action; native delete retains its confirmation.
    actions: (actions, context) => context.schemaType !== "property" ? actions : actions
      .filter(action => action.action !== "duplicate")
      .map(action => action.action === "publish" ? reviewedPublish(action) : action),
  },
});
