import { z } from 'zod';

export const SolutionsListResponseScheme = z.object({
  results: z
    .object({
      feature_uuid: z.string(),
      description: z.string(),
      disclaimer: z.string(),
      documentation_url: z.string().default(''),
      globals: z.string().array().optional(),
      initial_flow: z
        .object({
          name: z.string(),
          uuid: z.string(),
        })
        .array(),
      name: z.string(),
      sectors: z.string().array(),
    })
    .array(),
});

export const SolutionsIntegrateResponseScheme = z.object({
  status: z.number(),
  data: z.object({
    description: z.string(),
    disclaimer: z.string(),
    documentation_url: z.string(),
    feature_uuid: z.string(),
    feature_version: z.string(),
    globals: z
      .object({
        name: z.string(),
        value: z.string(),
      })
      .array(),
    integrated_on: z.string(),
    name: z.string(),
    project: z.string(),
    sectors: z
      .object({
        name: z.string(),
        tags: z.string().array(),
      })
      .array(),
    user: z.string(),
  }),
});
