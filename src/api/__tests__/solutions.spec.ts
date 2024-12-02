import { beforeEach, describe, expect, it, vi } from 'vitest';
import solutions from '../solutions';
import { createPinia, setActivePinia } from 'pinia';
import { useAuthStore } from '@/stores/Auth';
import { examples as SolutionsListExamples } from '../schemes/SolutionsList';
import { examples as SolutionsIntegrateExamples } from '../schemes/SolutionsIntegrate';
import { examples as IntegratedSolutionsListExamples } from '../schemes/IntegratedSolutionsList';

const mocks = vi.hoisted(() => ({
  methods: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('axios', () => ({
  default: {
    get: mocks.methods.get,
    post: mocks.methods.post,
    put: mocks.methods.put,
    delete: mocks.methods.delete,

    create: vi.fn().mockReturnThis(),
  },
}));

describe('solutions API', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    setActivePinia(createPinia());

    const authStore = useAuthStore();
    authStore.setProjectUuid('1234');
  });

  it('list solutions', async () => {
    mocks.methods.get.mockResolvedValue({
      data: SolutionsListExamples.success,
    });

    const response = await solutions.listSolutions({ category: 'PASSIVE' });

    expect(mocks.methods.get).toBeCalledWith(
      '/v2/feature/1234/?category=PASSIVE',
    );

    expect(response).toEqual([
      {
        uuid: '1',
        title: 'Name 1',
        description: 'Description 1',
        tip: 'Disclaimer 1',
        documentation: 'Documentation URL 1',
        globals: { global1: { value: '' }, global2: { value: '' } },
        sectors: { sector1: { value: [] }, sector2: { value: [] } },
      },
    ]);
  });

  it('integrate solution', async () => {
    mocks.methods.post.mockResolvedValue({
      data: SolutionsIntegrateExamples.success,
    });

    const response = await solutions.integrateSolution({
      solutionUuid: '1',
      sectors: {
        sector1: {
          value: ['sector value 1', 'sector value 2'],
        },
        sector2: {
          value: ['sector value 3', 'sector value 4'],
        },
      },
      globals: {
        global1: {
          value: 'global value 1',
        },
        global2: {
          value: 'global value 2',
        },
      },
    });

    expect(mocks.methods.post).toBeCalledWith('/v2/feature/1/integrate/', {
      project_uuid: '1234',
      action_base_flow: '',
      globals_values: {
        global1: 'global value 1',
        global2: 'global value 2',
      },
      sectors: [
        {
          name: 'sector1',
          tags: ['sector value 1', 'sector value 2'],
        },
        {
          name: 'sector2',
          tags: ['sector value 3', 'sector value 4'],
        },
      ],
    });

    expect(response).toEqual({
      globals: {
        global1: { value: 'global value 1' },
        global2: { value: 'global value 2' },
      },
      sectors: {
        sector1: { value: ['sector value 1', 'sector value 2'] },
        sector2: { value: ['sector value 3', 'sector value 4'] },
      },
    });
  });

  it('disintegrate solution', async () => {
    mocks.methods.delete.mockResolvedValue({ data: {} });

    await solutions.disintegrateSolution({
      solutionUuid: '1',
    });

    expect(mocks.methods.delete).toBeCalledWith('/v2/feature/1/integrate/', {
      data: {
        project_uuid: '1234',
      },
    });
  });

  it('list integrated solutions', async () => {
    mocks.methods.get.mockResolvedValue({
      data: IntegratedSolutionsListExamples.success,
    });

    const response = await solutions.listIntegratedSolutions({
      category: 'PASSIVE',
    });

    expect(mocks.methods.get).toBeCalledWith(
      '/v2/integrated_feature/1234/?category=PASSIVE',
    );

    expect(response).toEqual([
      {
        uuid: '1',
        title: 'Integrated Solution Name 1',
        description: 'Integrated Solution Description 1',
        tip: 'Integrated Solution Disclaimer 1',
        documentation: 'Integrated Solution Documentation URL 1',
        globals: {
          global1: { value: 'global value 1' },
          global2: { value: 'global value 2' },
        },
        sectors: {
          sector1: { value: ['sector value 1 updated', 'sector value 2'] },
          sector2: { value: ['sector value 3 updated', 'sector value 4'] },
        },
      },
    ]);
  });

  it('update integrated solution', async () => {
    mocks.methods.put.mockResolvedValue({});

    await solutions.updateIntegratedSolution({
      solutionUuid: '1',
      sectors: {
        sector1: {
          value: ['sector value 1 updated', 'sector value 2'],
        },
        sector2: {
          value: ['sector value 3 updated', 'sector value 4'],
        },
      },
      globals: {
        global1: {
          value: 'global value 1 updated',
        },
        global2: {
          value: 'global value 2',
        },
      },
    });

    expect(mocks.methods.put).toBeCalledWith('/v2/feature/1/integrate/', {
      project_uuid: '1234',
      globals_values: {
        global1: 'global value 1 updated',
        global2: 'global value 2',
      },
      sectors: [
        {
          name: 'sector1',
          tags: ['sector value 1 updated', 'sector value 2'],
        },
        {
          name: 'sector2',
          tags: ['sector value 3 updated', 'sector value 4'],
        },
      ],
    });
  });
});
