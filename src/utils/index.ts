import type { z } from 'zod';
import * as Sentry from '@sentry/vue';

export function checkZodScheme(scheme: z.AnyZodObject, data: unknown) {
  const { error } = scheme.safeParse(data);

  if (error) {
    Sentry.captureException(error);
    console.error(error);
  }
}
