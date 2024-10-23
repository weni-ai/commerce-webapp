import { useSolutionsStore } from '@/stores/Solutions';
import type { z } from 'zod';
import * as Sentry from '@sentry/vue';

export function isSolutionIntegrated({ uuid }: Pick<Solution, 'uuid'>) {
  const solutionsStore = useSolutionsStore();

  const integrated = [
    solutionsStore.integrated.activeNotifications.data,
    solutionsStore.integrated.passiveService.data,
  ].flat();

  return integrated.some((integrated) => integrated.uuid === uuid);
}

export function checkZodScheme(scheme: z.AnyZodObject, data: unknown) {
  const { error } = scheme.safeParse(data);

  if (error) {
    Sentry.captureException(error);
    console.error(error);
  }
}
