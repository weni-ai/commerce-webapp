import { z } from 'zod';

export const SolutionsListResponseScheme = z.object({
  results: z
    .object({
      feature_uuid: z.string(),
      description: z.string(),
      disclaimer: z.string(),
      documentation_url: z.string().default(''),
      globals: z.string().array().optional(),
      name: z.string(),
      sectors: z.string().array(),
    })
    .array(),
});

const success: z.infer<typeof SolutionsListResponseScheme> = {
  results: [
    {
      feature_uuid: '1',
      name: 'Name 1',
      description: 'Description 1',
      disclaimer: 'Disclaimer 1',
      documentation_url: 'Documentation URL 1',
      globals: ['global1', 'global2'],
      sectors: ['sector1', 'sector2'],
    },
  ],
};

export const examples = {
  success,
};
