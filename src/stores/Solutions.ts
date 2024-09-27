import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import APISolutions from '@/api/solutions';

function makeSolutionsList({
  request,
  category,
}: {
  request: ({ category }: { category: string }) => Promise<Solution[]>;
  category: string;
}) {
  const status = ref<null | string>(null);
  const alreadyCalledLoad = ref(false);
  const data = ref<Solution[]>([]);

  const isFirstLoading = computed(
    () => !alreadyCalledLoad.value && status.value === 'loading',
  );

  async function load() {
    if (status.value !== null) {
      return;
    }

    try {
      status.value = 'loading';

      data.value = await request({ category });

      status.value = 'complete';
    } catch (error) {
      status.value = 'error';
      throw error;
    } finally {
      alreadyCalledLoad.value = true;
    }
  }

  function add(solution: Solution) {
    data.value.push(solution);
  }

  function remove(solution: Pick<Solution, 'id'>) {
    data.value.splice(
      data.value.findIndex(({ id }) => id === solution.id),
      1,
    );
  }

  return { status, isFirstLoading, data, load, add, remove };
}

export const useSolutionsStore = defineStore('solutions', () => {
  const integratedActiveNotifications = makeSolutionsList({
    request: APISolutions.listIntegratedSolutions,
    category: 'ACTIVE',
  });

  const integratedPassiveService = makeSolutionsList({
    request: APISolutions.listIntegratedSolutions,
    category: 'PASSIVE',
  });

  const integratedIds = computed(() =>
    [
      integratedActiveNotifications.data.value,
      integratedPassiveService.data.value,
    ]
      .flat()
      .map(({ id }) => id),
  );

  const activeNotifications = makeSolutionsList({
    request: APISolutions.listSolutions,
    category: 'ACTIVE',
  });

  const passiveService = makeSolutionsList({
    request: APISolutions.listSolutions,
    category: 'PASSIVE',
  });

  function findSolution({ id }: { id: string }) {
    const allSolutions = computed(() =>
      [
        activeNotifications.data.value.map((item) => ({
          ...item,
          parent: integratedActiveNotifications,
        })),

        passiveService.data.value.map((item) => ({
          ...item,
          parent: integratedPassiveService,
        })),
      ].flat(),
    );

    return allSolutions.value.find((solution) => solution.id === id);
  }

  function integrate({ id }: { id: string }) {
    const solutionToIntegrate = findSolution({ id });

    solutionToIntegrate?.parent.add({
      id: solutionToIntegrate.id,
      title: solutionToIntegrate.title,
      documentation: solutionToIntegrate.documentation,
      description: solutionToIntegrate.description,
      tip: solutionToIntegrate.tip,
      globals: solutionToIntegrate.globals,
      flows: solutionToIntegrate.flows,
      sectors: solutionToIntegrate.sectors,
    });
  }

  function disintegrate({ id }: { id: string }) {
    const solutionToDisintegrate = findSolution({ id });

    solutionToDisintegrate?.parent.remove({ id: id });
  }

  const availableActiveNotifications = computed(() =>
    activeNotifications.data.value.filter(
      (solution) => !integratedIds.value.includes(solution.id),
    ),
  );

  const availablePassiveService = computed(() =>
    passiveService.data.value.filter(
      (solution) => !integratedIds.value.includes(solution.id),
    ),
  );

  return {
    activeNotifications,
    passiveService,
    available: {
      activeNotifications: availableActiveNotifications,
      passiveService: availablePassiveService,
    },
    integrated: {
      activeNotifications: integratedActiveNotifications,
      passiveService: integratedPassiveService,
    },
    integrate,
    disintegrate,
  };
});
