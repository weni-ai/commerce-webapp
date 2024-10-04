import { useSolutionsStore } from '@/stores/Solutions';

export function isSolutionIntegrated({ uuid }: Pick<Solution, 'uuid'>) {
  const solutionsStore = useSolutionsStore();

  const integrated = [
    solutionsStore.integrated.activeNotifications.data,
    solutionsStore.integrated.passiveService.data,
  ].flat();

  return integrated.some((integrated) => integrated.uuid === uuid);
}
