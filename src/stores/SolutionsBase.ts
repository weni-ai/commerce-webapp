import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import APISolutions from '@/api/solutions';
import { cloneDeep } from 'lodash';

function SolutionsBase({
  request,
  category,
}: {
  request: ({ category }: { category: string }) => Promise<Solution[]>;
  category: string | undefined;
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

      data.value = await request({ category: category || '' });

      status.value = 'complete';
    } catch (error) {
      status.value = 'error';
      throw error;
    } finally {
      alreadyCalledLoad.value = true;
    }
  }

  async function integrate(solution: Solution) {
    const response = await APISolutions.integrateSolution({
      ...solution,
      solutionUuid: solution.uuid,
    });

    data.value.push({
      ...solution,
      sectors: response.sectors,
      globals: response.globals,
    });
  }

  async function update(
    uuid: Solution['uuid'],
    solutionNewValues: Pick<Solution, 'sectors' | 'globals'>,
  ) {
    await APISolutions.updateIntegratedSolution({
      solutionUuid: uuid,
      sectors: solutionNewValues.sectors,
      globals: solutionNewValues.globals,
    });

    const solution = data.value.find((solution) => solution.uuid === uuid);

    if (solution) {
      Object.keys(solutionNewValues).forEach((attribute) => {
        solution[attribute] = cloneDeep(solutionNewValues[attribute]);
      });
    }
  }

  async function disintegrate(solution: Pick<Solution, 'uuid'>) {
    await APISolutions.disintegrateSolution({ solutionUuid: solution.uuid });

    data.value.splice(
      data.value.findIndex(({ uuid }) => uuid === solution.uuid),
      1,
    );
  }

  return {
    status,
    isFirstLoading,
    data,
    load,
    integrate,
    update,
    disintegrate,
  };
}

export function defineSolutionsStore({
  name,
  category,
}: {
  name: string;
  category?: 'ACTIVE' | 'PASSIVE';
}) {
  return defineStore(name, () => {
    const integrateds = SolutionsBase({
      request: APISolutions.listIntegratedSolutions,
      category: category || undefined,
    });

    const all = SolutionsBase({
      request: APISolutions.listSolutions,
      category: category || undefined,
    });

    const available = computed(() =>
      all.data.value.filter(
        (solution) =>
          !integrateds.data.value
            .map(({ uuid }) => uuid)
            .includes(solution.uuid),
      ),
    );

    return {
      all,
      integrateds,
      available,
    };
  });
}
