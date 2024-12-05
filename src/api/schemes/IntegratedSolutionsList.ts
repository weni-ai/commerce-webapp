import { z } from 'zod';

export const IntegratedSolutionsListResponseScheme = z.object({
  results: z
    .object({
      feature_uuid: z.string(),
      name: z.string(),
      description: z.string(),
      disclaimer: z.string(),
      documentation_url: z.string().default(''),
      globals: z
        .object({
          name: z.string(),
          value: z.string(),
        })
        .array(),
      sectors: z
        .object({
          name: z.string(),
          tags: z.string().array(),
        })
        .array(),
    })
    .array(),
});

const success: z.infer<typeof IntegratedSolutionsListResponseScheme> = {
  results: [
    {
      feature_uuid: '1',
      name: 'Integrated Solution Name 1',
      description: 'Integrated Solution Description 1',
      disclaimer: 'Integrated Solution Disclaimer 1',
      documentation_url: 'Integrated Solution Documentation URL 1',
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
      sectors: [
        {
          name: 'sector1',
          tags: ['sector value 1 updated', 'sector value 2'],
        },
        {
          name: 'sector2',
          tags: ['sector value 3 updated', 'sector value 4'],
        },
      ],
    },
  ],
};

export const examples = {
  success,
};
