import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const projects = defineCollection({
  loader: glob({ pattern: "**/index.md", base: "./src/data/projects" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      hero: image().optional(),
      heroAlt: z.string().optional(),
      tags: z.array(z.string()).default([]),
      url: z.string().url().optional(),
      featured: z.boolean().default(false),
      layout: z.enum(["standard", "standalone"]).default("standard"),
    }),
});

const news = defineCollection({
  loader: glob({ pattern: "**/index.md", base: "./src/data/news" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      hero: image().optional(),
      heroAlt: z.string().optional(),
      tags: z.array(z.string()).default([]),
    }),
});

export const collections = { projects, news };
