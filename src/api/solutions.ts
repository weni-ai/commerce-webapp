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
          version?: string;
          feature_uuid: string;
          description: string;
          disclaimer: string;
          documentation_url: string;
          globals?: string[];
          initial_flow?: {
            name: string;
            uuid: string;
          }[];
          name: string;
          sectors: string[];
          versions?: {
            version: string;
            globals: string[];
            sectors: string[];
          }[];
        }[];
      };
    } = await request.$http.get(
      `/v2/feature/${authStore.projectUuid}/?category=${category}`,
    );

    const mockResult = {
      results: [
        {
          name: 'feature 0001 implantation',
          description: 'implantation',
          disclaimer: 'vamo',
          documentation_url: 'weni.by.vtex',
          feature_uuid: '29c71115-c2fc-4a63-9f58-1893a73a7857',
          globals: [
            {
              nome_loje: '013 cbjr 013',
              nome_atendente: 'jackson choris',
            },
          ],
          sectors: [
            {
              name: 'loja',
              tags: ['vender'],
            },
            {
              name: 'atendimento loja',
              tags: ['SAF'],
            },
          ],
          version: '1.0',
          versions: [
            {
              version: '1.0',
              globals: [
                {
                  nome_loje: '013 cbjr 013',
                  nome_atendente: 'jackson choris',
                },
              ],
              sectors: [
                {
                  name: 'loja',
                  tags: [''],
                },
                {
                  name: 'atendimento loja',
                  tags: [''],
                },
              ],
            },
            {
              version: '2.0',
              globals: ['nome_fulana', 'nome_ciclana'],
              sectors: [
                {
                  name: 'fulana',
                  tags: [''],
                },
                {
                  name: 'ciclana',
                  tags: [''],
                },
              ],
            },
          ],
        },
        {
          name: 'feature 0003',
          description: 'feature',
          disclaimer: 'disclama',
          documentation_url: 'google.com',
          feature_uuid: '27e3434e-8c8d-4a10-a653-2a44ace5585e',
          globals: [],
          sectors: [],
          version: '1.0',
          versions: [
            {
              version: '1.0',
              globals: [
                'url_api_vtex',
                'x_vtex_api_appkey',
                'x_vtex_api_apptoken',
                'utm_compras_no_chatbot',
                'base_url_site',
                'bloqueio_para_testes',
                'chatgpt_token',
                'razao_social',
              ],
              sectors: [],
            },
            {
              version: '2.0',
              globals: ['telefone', 'email'],
              sectors: [
                {
                  name: 'inscrição',
                  tags: [''],
                },
                {
                  name: 'viagem',
                  tags: [''],
                },
              ],
            },
          ],
        },
      ],
    };

    return mockResult.results.map((solution) => ({
      version: solution.version || '',
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
      versions:
        solution.versions &&
        solution.versions.map((version) => ({
          version: version.version,
          globals: Object.keys(version.globals).reduce(
            (previous, key) => ({
              ...previous,
              [key]: { value: version.globals[key].value },
            }),
            {},
          ),
          sectors: Object.keys(version.sectors).reduce(
            (previous, key) => ({
              ...previous,
              [key]: { value: version.sectors[key].value },
            }),
            {},
          ),
        })),
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
        .reduce((previous, current) => ({ ...previous, ...current }), {}),
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
        .reduce((previous, current) => ({ ...previous, ...current }), {}),
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
      globals: (solution.globals || []).reduce(
        (previous, { name, value }) => ({ ...previous, [name]: { value } }),
        {},
      ),
      sectors: solution.sectors.reduce(
        (previous, { name, tags }) => ({
          ...previous,
          [name]: {
            value: tags.filter((tag) => tag),
          },
        }),
        {},
      ),
    }));
  },
};
