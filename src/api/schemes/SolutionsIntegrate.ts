import { z } from 'zod';

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
        queues: z
          .object({
            name: z.string(),
          })
          .array(),
        tags: z.string().array(),
      })
      .array(),
    user: z.string(),
  }),
});
