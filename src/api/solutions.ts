import request from './request';
import { useAuthStore } from '@/stores/Auth';
import * as Sentry from '@sentry/vue';
import { z } from 'zod';
import {
  SolutionsListResponseScheme,
  SolutionsIntegrateResponseScheme,
} from './schemes/SolutionsIntegrate';

function checkZodScheme(scheme: z.AnyZodObject, data: unknown) {
  const { error } = scheme.safeParse(data);

  if (error) {
    Sentry.captureException(error);
    console.error(error);
  }
}

const transform = {
  globals: {
    from: (
      globals: {
        name: string;
        value: string;
      }[],
    ): Solution['globals'] => {
      return (globals || []).reduce(
        (previous, { name, value }) => ({ ...previous, [name]: { value } }),
        {},
      );
    },

    to: (
      globals: Solution['globals'],
    ): {
      [key: string]: string;
    } => {
      return Object.keys(globals)
        .map((globalName) => ({ [globalName]: globals[globalName].value }))
        .reduce((previous, current) => ({ ...previous, ...current }), {});
    },
  },

  sectors: {
    from: (
      sectors: {
        name: string;
        tags: string[];
        queues?: {
          name: string;
        }[];
      }[],
    ): Solution['sectors'] => {
      return (sectors || []).reduce(
        (previous, { name, tags }) => ({
          ...previous,
          [name]: {
            value: tags.filter((tag) => tag),
          },
        }),
        {},
      );
    },

    to: (sectors: Solution['sectors']): { name: string; tags: string[] }[] => {
      return Object.keys(sectors).map((sectorName) => ({
        name: sectorName,
        tags: sectors[sectorName].value,
      }));
    },
  },
};

export default {
  async listSolutions({ category }: { category: string }): Promise<Solution[]> {
    const authStore = useAuthStore();

    const { data } = await request.$http.get<
      z.infer<typeof SolutionsListResponseScheme>
    >(`/v2/feature/${authStore.projectUuid}/?category=${category}`);

    checkZodScheme(SolutionsListResponseScheme, data);

    return data.results.map((solution) => ({
      uuid: solution.feature_uuid,
      title: solution.name,
      description: solution.description,
      tip: solution.disclaimer,
      documentation: solution.documentation_url,
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

    const { data } = await request.$http.post<
      z.infer<typeof SolutionsIntegrateResponseScheme>
    >(`/v2/feature/${solutionUuid}/integrate/`, {
      project_uuid: authStore.projectUuid,
      action_base_flow: '',
      sectors: transform.sectors.to(sectors),
      globals_values: transform.globals.to(globals),
    });

    checkZodScheme(SolutionsIntegrateResponseScheme, data);

    return {
      globals: transform.globals.from(data.data.globals),
      sectors: transform.sectors.from(data.data.sectors),
    };
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
      sectors: transform.sectors.to(sectors),
      globals_values: transform.globals.to(globals),
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
          globals: {
            name: string;
            value: string;
          }[];
          sectors: {
            name: string;
            tags: string[];
          }[];
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
      uuid: solution.feature_uuid,
      title: solution.name,
      description: solution.description,
      tip: solution.disclaimer,
      documentation: solution.documentation_url,
      globals: transform.globals.from(solution.globals),
      sectors: transform.sectors.from(solution.sectors),
    }));
  },
};
