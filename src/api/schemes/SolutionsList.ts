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
      initial_flow: [
        { name: 'flow 1', uuid: '1' },
        { name: 'flow 2', uuid: '2' },
      ],
    },
  ],
};

export const examples = {
  success,
};
