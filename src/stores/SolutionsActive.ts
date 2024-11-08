import { defineStore } from 'pinia';
import { SolutionsBase } from './SolutionsBase';
import APISolutions from '@/api/solutions';
import { computed } from 'vue';

export const useSolutionsActiveStore = defineStore('solutionsActive', () => {
  const integrateds = SolutionsBase({
    request: APISolutions.listIntegratedSolutions,
    category: 'ACTIVE',
  });

  const all = SolutionsBase({
    request: APISolutions.listSolutions,
    category: 'ACTIVE',
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
