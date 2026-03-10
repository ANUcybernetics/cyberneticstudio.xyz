import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const publicationSchema = z.object({
  title: z.string(),
  venue: z.string(),
  date: z.string(),
  url: z.string().url().optional(),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/index.md", base: "./src/data/projects" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      creators: z.array(z.string()).default([]),
      materials: z.string().optional(),
      date: z.coerce.date(),
      hero: image().optional(),
      heroAlt: z.string().optional(),
      url: z.string().url().optional(),
      github: z.string().url().optional(),
      publications: z.array(publicationSchema).default([]),
      relatedProjects: z.array(z.string()).default([]),
      order: z.number().int().default(999),
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
    }),
});

export const collections = { projects, news };
