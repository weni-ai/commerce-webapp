import { i18n } from '@/locales';

function sleep(timeInMs: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeInMs);
  });
}

import request from './request';
import { useAuthStore } from '@/stores/Auth';

const integrated_resource: string = '/v2/integrated_feature/';

export default {
  async listSolutions({ category }: { category: string }): Promise<any> {
    const authStore = useAuthStore();

    const { data } = await request.$http.get(
      `/v2/feature/${authStore.projectUuid}/?category=${category}`,
    );

    return data.results.map((solution, index) => ({
      id: String(index),
      title: solution.name,
      description: solution.description,
      tip: solution.disclaimer || undefined,
      globals: solution.globals,
      documentation: solution.documentation_url,
      flows: solution.initial_flow, // { uuid, name }
      sectors: solution.sectors,
    }));
  },

  async listIntegratedByCategory({
    category,
  }: {
    category: string;
  }): Promise<Solution[]> {
    await sleep(500);

    return [];
  },
};
