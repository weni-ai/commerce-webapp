import { defineStore } from 'pinia';
import { SolutionsBase } from './SolutionsBase';
import APISolutions from '@/api/solutions';
import { computed } from 'vue';

export const useSolutionsPassiveStore = defineStore('solutionsPassive', () => {
  const integrateds = SolutionsBase({
    request: APISolutions.listIntegratedSolutions,
    category: 'PASSIVE',
  });

  const all = SolutionsBase({
    request: APISolutions.listSolutions,
    category: 'PASSIVE',
  });

  const available = computed(() =>
    all.data.value.filter(
      (solution) =>
        !integrateds.data.value.map(({ uuid }) => uuid).includes(solution.uuid),
    ),
  );

  return {
    all,
    integrateds,
    available,
  };
});
