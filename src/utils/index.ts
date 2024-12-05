import type { z } from 'zod';
import * as Sentry from '@sentry/vue';

export function checkZodScheme(scheme: z.AnyZodObject, data: unknown) {
  const { error } = scheme.safeParse(data);

  if (error) {
    Sentry.captureException(error);
    Sentry.captureMessage(
      `${error.name}\n--issues--\n${JSON.stringify(error.issues, null, 2)}\n--data--\n${JSON.stringify(data, null, 2)}`,
    );
    console.error(error);
  }
}

export function isConfigurable(solution: Solution) {
  return (
    Object.keys(solution.globals).length !== 0 ||
    Object.keys(solution.sectors).length !== 0
  );
}
