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
        tags: z.string().array(),
      })
      .array(),
    user: z.string(),
  }),
});

const success: z.infer<typeof SolutionsIntegrateResponseScheme> = {
  status: 200,
  data: {
    feature_uuid: '1',
    description: 'Description 1',
    disclaimer: 'Disclaimer 1',
    documentation_url: 'Documentation URL 1',
    feature_version: '1.0.0',
    globals: [
      {
        name: 'global1',
        value: 'global value 1',
      },
      {
        name: 'global2',
        value: 'global value 2',
      },
    ],
    integrated_on: 'today',
    name: 'Name 1',
    project: '1234',
    sectors: [
      {
        name: 'sector1',
        tags: ['sector value 1', 'sector value 2'],
      },
      {
        name: 'sector2',
        tags: ['sector value 3', 'sector value 4'],
      },
    ],
    user: 'Joe',
  },
};

export const examples = {
  success,
};
