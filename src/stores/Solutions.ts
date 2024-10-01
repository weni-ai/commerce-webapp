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

  function remove(solution: Pick<Solution, 'uuid'>) {
    data.value.splice(
      data.value.findIndex(({ uuid }) => uuid === solution.uuid),
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

  const integratedUuids = computed(() =>
    [
      integratedActiveNotifications.data.value,
      integratedPassiveService.data.value,
    ]
      .flat()
      .map(({ uuid }) => uuid),
  );

  const activeNotifications = makeSolutionsList({
    request: APISolutions.listSolutions,
    category: 'ACTIVE',
  });

  const passiveService = makeSolutionsList({
    request: APISolutions.listSolutions,
    category: 'PASSIVE',
  });

  function findSolution({ uuid }: Pick<Solution, 'uuid'>):
    | {
        solution: Solution;
        integrationCorrespondent: ReturnType<typeof makeSolutionsList>;
      }
    | undefined {
    const allSolutions = [
      {
        solutions: activeNotifications.data.value,
        integrationCorrespondent: integratedActiveNotifications,
      },
      {
        solutions: passiveService.data.value,
        integrationCorrespondent: integratedPassiveService,
      },
    ];

    const groupFound = allSolutions
      .map((group) => ({
        ...group,
        solution: group.solutions.find((solution) => solution.uuid === uuid),
      }))
      .find(({ solution }) => solution);

    if (groupFound?.solution) {
      return {
        solution: groupFound.solution,
        integrationCorrespondent: groupFound.integrationCorrespondent,
      };
    }

    return undefined;
  }

  async function integrate({ uuid }: Pick<Solution, 'uuid'>) {
    const search = findSolution({ uuid });

    if (search?.solution) {
      await APISolutions.integrateSolution({
        solutionUuid: search?.solution.uuid,
        sectors: {},
        globals: {},
      });

      search.integrationCorrespondent.add(search.solution);
    }
  }

  async function disintegrate({ uuid }: Pick<Solution, 'uuid'>) {
    await APISolutions.disintegrateSolution({ solutionUuid: uuid });

    [integratedActiveNotifications, integratedPassiveService]
      .find((integrated) =>
        integrated.data.value.find((solution) => solution.uuid === uuid),
      )
      ?.remove({ uuid });
  }

  const availableActiveNotifications = computed(() =>
    activeNotifications.data.value.filter(
      (solution) => !integratedUuids.value.includes(solution.uuid),
    ),
  );

  const availablePassiveService = computed(() =>
    passiveService.data.value.filter(
      (solution) => !integratedUuids.value.includes(solution.uuid),
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
