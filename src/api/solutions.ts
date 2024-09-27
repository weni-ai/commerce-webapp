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

    return data.results.map((solution, index) => ({
      id: String(index),
      title: solution.name,
      description: solution.description,
      tip: solution.disclaimer,
      globals: solution.globals,
      documentation: solution.documentation_url,
      flows: solution.initial_flow,
      sectors: solution.sectors,
    }));
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

    return data.results.map((solution, index) => ({
      id: String(index),
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
