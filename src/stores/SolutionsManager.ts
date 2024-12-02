import { defineStore } from 'pinia';
import { useSolutionsActiveStore } from '@/stores/SolutionsActive';
import { useSolutionsPassiveStore } from '@/stores/SolutionsPassive';

export const useSolutionsManagerStore = defineStore('solutionsManager', () => {
  const solutionsActiveStore = useSolutionsActiveStore();
  const solutionsPassiveStore = useSolutionsPassiveStore();

  async function integrateOrUpdate(solution: Solution) {
    if (
      solutionsActiveStore.integrateds.data.some(
        (integrated) => integrated.uuid === solution.uuid,
      )
    ) {
      await solutionsActiveStore.integrateds.update(solution.uuid, {
        globals: solution.globals,
        sectors: solution.sectors,
      });
    } else if (
      solutionsPassiveStore.integrateds.data.some(
        (integrated) => integrated.uuid === solution.uuid,
      )
    ) {
      await solutionsPassiveStore.integrateds.update(solution.uuid, {
        globals: solution.globals,
        sectors: solution.sectors,
      });
    } else if (
      solutionsActiveStore.available.some(
        (available) => available.uuid === solution.uuid,
      )
    ) {
      await solutionsActiveStore.integrateds.integrate(solution);
    } else {
      await solutionsPassiveStore.integrateds.integrate(solution);
    }
  }

  async function disintegrate(solution: Pick<Solution, 'uuid'>) {
    if (
      solutionsActiveStore.integrateds.data.some(
        (integrated) => integrated.uuid === solution.uuid,
      )
    ) {
      await solutionsActiveStore.integrateds.disintegrate(solution);
    } else {
      await solutionsPassiveStore.integrateds.disintegrate(solution);
    }
  }

  return { integrateOrUpdate, disintegrate };
});
