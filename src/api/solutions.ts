import request from './request';
import { useAuthStore } from '@/stores/Auth';

function generateUuid() {
  return String(Math.floor(Math.random() * 10000));
}

export default {
  async listSolutions({ category }: { category: string }): Promise<Solution[]> {
    const authStore = useAuthStore();

    const {
      data,
    }: {
      data: {
        results: {
          feature_uuid: string;
          description: string;
          disclaimer: string;
          documentation_url: string;
          globals?: string[];
          initial_flow: {
            name: string;
            uuid: string;
          }[];
          name: string;
          sectors: string[];
        }[];
      };
    } = await request.$http.get(
      `/v2/feature/${authStore.projectUuid}/?category=${category}`,
    );

    return data.results.map((solution) => ({
      uuid: solution.feature_uuid || generateUuid(),
      title: solution.name,
      description: solution.description,
      tip: solution.disclaimer,
      documentation: solution.documentation_url,
      flows: solution.initial_flow,
      globals: (solution.globals || []).reduce(
        (previous, current) => ({
          ...previous,
          [current]: { value: '' },
        }),
        {},
      ),
      sectors: solution.sectors.reduce(
        (previous, sectorName) => ({
          ...previous,
          [sectorName]: {
            value: [],
          },
        }),
        {},
      ),
    }));
  },

  async integrateSolution({
    solutionUuid,
    sectors,
    globals,
  }: {
    solutionUuid: string;
  } & Pick<Solution, 'sectors' | 'globals'>) {
    const authStore = useAuthStore();

    await request.$http.post(`/v2/feature/${solutionUuid}/integrate/`, {
      project_uuid: authStore.projectUuid,
      action_base_flow: '',
      sectors: Object.keys(sectors).map((sectorName) => ({
        name: sectorName,
        tags: sectors[sectorName].value,
      })),
      globals_values: Object.keys(globals)
        .map((globalName) => ({ [globalName]: globals[globalName].value }))
        .reduce((previous, current) => ({ ...previous, ...current })),
    });
  },

  async disintegrateSolution({ solutionUuid }: { solutionUuid: string }) {
    const authStore = useAuthStore();

    await request.$http.delete(`/v2/feature/${solutionUuid}/integrate/`, {
      data: {
        project_uuid: authStore.projectUuid,
      },
    });
  },

  async updateIntegratedSolution({
    solutionUuid,
    sectors,
    globals,
  }: { solutionUuid: string } & Pick<Solution, 'sectors' | 'globals'>) {
    const authStore = useAuthStore();

    await request.$http.put(`/v2/feature/${solutionUuid}/integrate/`, {
      project_uuid: authStore.projectUuid,
      sectors: Object.keys(sectors).map((sectorName) => ({
        name: sectorName,
        tags: sectors[sectorName].value,
      })),
      globals_values: Object.keys(globals)
        .map((globalName) => ({ [globalName]: globals[globalName].value }))
        .reduce((previous, current) => ({ ...previous, ...current })),
    });
  },

  async listIntegratedSolutions({
    category,
  }: {
    category: string;
  }): Promise<Solution[]> {
    const authStore = useAuthStore();

    const {
      data,
    }: {
      data: {
        results: {
          feature_uuid: string;
          name: string;
          description: string;
          disclaimer: string;
          documentation_url: string;
          globals?: {
            name: string;
            value: string;
          }[];
          sectors: string[];
          initial_flow: {
            uuid: string;
            name: string;
            is_base_flow: boolean;
          }[];
        }[];
      };
    } = await request.$http.get(
      `/v2/integrated_feature/${authStore.projectUuid}/?category=${category}`,
    );

    return data.results.map((solution) => ({
      uuid: solution.feature_uuid || generateUuid(),
      title: solution.name,
      description: solution.description,
      tip: solution.disclaimer,
      documentation: solution.documentation_url,
      flows: solution.initial_flow,
      globals: (solution.globals || []).reduce(
        (previous, { name, value }) => ({ ...previous, [name]: { value } }),
        {},
      ),
      sectors: solution.sectors.reduce(
        (previous, sectorName) => ({
          ...previous,
          [sectorName]: {
            value: [],
          },
        }),
        {},
      ),
    }));
  },
};
