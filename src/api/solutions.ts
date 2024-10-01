import request from './request';
import { useAuthStore } from '@/stores/Auth';

export default {
  async listSolutions({ category }: { category: string }): Promise<Solution[]> {
    const authStore = useAuthStore();

    const {
      data,
    }: {
      data: {
        results: {
          uuid: string;
          description: string;
          disclaimer: string;
          documentation_url: string;
          globals: string[];
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
      uuid: solution.uuid,
      title: solution.name,
      description: solution.description,
      tip: solution.disclaimer,
      globals: solution.globals,
      documentation: solution.documentation_url,
      flows: solution.initial_flow,
      sectors: solution.sectors,
    }));
  },

  async integrateSolution({
    solutionUuid,
    sectors,
    globals,
  }: {
    solutionUuid: string;
    sectors: { [key: string]: string[] };
    globals: { [key: string]: string[] };
  }) {
    const authStore = useAuthStore();

    await request.$http.post(`/v2/feature/${solutionUuid}/integrate/`, {
      project_uuid: authStore.projectUuid,
      action_base_flow: '',
      sectors: Object.keys(sectors).map((sectorName) => ({
        name: sectorName,
        tags: sectors[sectorName],
      })),
      globals_values: globals,
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
          uuid: string;
          name: string;
          description: string;
          disclaimer: string;
          documentation_url: string;
          globals: {
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
      uuid: solution.uuid,
      title: solution.name,
      description: solution.description,
      tip: solution.disclaimer,
      documentation: solution.documentation_url,
      globals: Object.keys(
        solution.globals.reduce(
          (previous, { name, value }) => ({ ...previous, [name]: value }),
          {},
        ),
      ),
      flows: solution.initial_flow,
      sectors: solution.sectors,
    }));
  },
};
