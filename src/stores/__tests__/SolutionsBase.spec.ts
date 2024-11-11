import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { defineSolutionsStore } from '../SolutionsBase';

const useSolutionsActiveStore = defineSolutionsStore({
  name: 'solutionsActive',
  category: 'ACTIVE',
});

const useSolutionsPassiveStore = defineSolutionsStore({
  name: 'solutionsPassive',
  category: 'PASSIVE',
});

const uuids = {
  ACTIVE: {
    all: [
      '1d501f84-2dea-4aa8-b89b-9cfab4afba69',
      '9b3ba44e-4f61-4e92-a092-8cb6f76888a1',
      '7ec3f1ce-0e86-4371-8d60-10346fd728ab',
    ],
    integrated: ['9b3ba44e-4f61-4e92-a092-8cb6f76888a1'],
  },

  PASSIVE: {
    all: [
      '59bd9665-19e7-4686-b5ab-b1b41a6f84c9',
      'cff8bd84-064e-4339-acd7-8f602487b380',
      '0348611a-e5eb-468a-9e7c-d0e51f3df938',
    ],
    integrated: ['cff8bd84-064e-4339-acd7-8f602487b380'],
  },
};

function fakeSolutionById(uuid: string): Solution {
  return {
    uuid,
    title: `Solution Title ${uuid}`,
    description: `Solution Description ${uuid}`,
    tip: `Solution Tip ${uuid}`,
    documentation: 'https://documentation.url',
    globals: {},
    sectors: {},
  };
}

const mocks = vi.hoisted(() => {
  return {
    listIntegratedSolutions: vi.fn(
      ({ category }: { category: 'ACTIVE' | 'PASSIVE' }) =>
        new Promise((resolve) =>
          resolve(uuids[category].integrated.map(fakeSolutionById)),
        ),
    ),

    listSolutions: vi.fn(
      ({ category }: { category: 'ACTIVE' | 'PASSIVE' }) =>
        new Promise((resolve) =>
          resolve(uuids[category].all.map(fakeSolutionById)),
        ),
    ),

    integrateSolution: vi.fn(
      (solution: Solution & { solutionUuid: Solution['uuid'] }) => ({
        ...solution,
        uuid: solution.solutionUuid,
      }),
    ),

    updateIntegratedSolution: vi.fn(
      (
        _solutionUuid: Solution['uuid'],
        _toUpdate: Pick<Solution, 'globals' | 'sectors'>,
      ) => {},
    ),

    disintegrateSolution: vi.fn((_solution: Pick<Solution, 'uuid'>) => {}),
  };
});

vi.mock('@/api/solutions.ts', () => ({
  default: {
    listIntegratedSolutions: mocks.listIntegratedSolutions,
    listSolutions: mocks.listSolutions,
    integrateSolution: mocks.integrateSolution,
    updateIntegratedSolution: mocks.updateIntegratedSolution,
    disintegrateSolution: mocks.disintegrateSolution,
  },
}));

describe('SolutionsBase', () => {
  let solutionsActiveStore: ReturnType<typeof useSolutionsActiveStore>;
  let solutionsPassiveStore: ReturnType<typeof useSolutionsPassiveStore>;

  beforeEach(() => {
    vi.clearAllMocks();

    setActivePinia(createPinia());

    solutionsActiveStore = useSolutionsActiveStore();
    solutionsPassiveStore = useSolutionsPassiveStore();
  });

  it('initial data should be empty', () => {
    expect(solutionsActiveStore.all.data).toEqual([]);
    expect(solutionsPassiveStore.all.data).toEqual([]);
  });

  describe('when the load function is called two times at the same time', () => {
    it('listSolutions API should only be called once at a time', () => {
      const load = vi.spyOn(solutionsActiveStore.all, 'load');

      solutionsActiveStore.all.load();
      solutionsActiveStore.all.load();

      expect(load).toBeCalledTimes(2);
      expect(mocks.listSolutions).toBeCalledTimes(1);
    });
  });

  describe('when the load function is called', () => {
    it('status should be loading', () => {
      solutionsActiveStore.all.load();

      expect(solutionsActiveStore.all.status).toBe('loading');
    });

    describe('when the load function is loaded', () => {
      it('status should be complete', async () => {
        await solutionsActiveStore.all.load();

        expect(solutionsActiveStore.all.status).toBe('complete');
      });
    });

    describe('when the load function has error', () => {
      it('should be throw an error and status should be error', async () => {
        mocks.listSolutions.mockRejectedValueOnce(new Error('Async Error'));

        await expect(() =>
          solutionsActiveStore.all.load(),
        ).rejects.toThrowError();

        expect(solutionsActiveStore.all.status).toBe('error');
      });
    });
  });

  describe('when the data is loaded', () => {
    beforeEach(() => {
      solutionsActiveStore.all.load();
      solutionsPassiveStore.all.load();

      solutionsActiveStore.integrateds.load();
      solutionsPassiveStore.integrateds.load();
    });

    it('all items should correspond', () => {
      expect(solutionsActiveStore.all.data.map(({ uuid }) => uuid)).toEqual([
        '1d501f84-2dea-4aa8-b89b-9cfab4afba69',
        '9b3ba44e-4f61-4e92-a092-8cb6f76888a1',
        '7ec3f1ce-0e86-4371-8d60-10346fd728ab',
      ]);

      expect(solutionsPassiveStore.all.data.map(({ uuid }) => uuid)).toEqual([
        '59bd9665-19e7-4686-b5ab-b1b41a6f84c9',
        'cff8bd84-064e-4339-acd7-8f602487b380',
        '0348611a-e5eb-468a-9e7c-d0e51f3df938',
      ]);
    });

    it('available items should correspond', () => {
      expect(solutionsActiveStore.available.map(({ uuid }) => uuid)).toEqual([
        '1d501f84-2dea-4aa8-b89b-9cfab4afba69',
        '7ec3f1ce-0e86-4371-8d60-10346fd728ab',
      ]);

      expect(solutionsPassiveStore.available.map(({ uuid }) => uuid)).toEqual([
        '59bd9665-19e7-4686-b5ab-b1b41a6f84c9',
        '0348611a-e5eb-468a-9e7c-d0e51f3df938',
      ]);
    });

    it('integrated items should correspond', () => {
      expect(
        solutionsActiveStore.integrateds.data.map(({ uuid }) => uuid),
      ).toEqual(['9b3ba44e-4f61-4e92-a092-8cb6f76888a1']);

      expect(
        solutionsPassiveStore.integrateds.data.map(({ uuid }) => uuid),
      ).toEqual(['cff8bd84-064e-4339-acd7-8f602487b380']);
    });

    describe('when the integrate is called', () => {
      beforeEach(() => {
        solutionsActiveStore.integrateds.integrate({
          uuid: '7ec3f1ce-0e86-4371-8d60-10346fd728ab',
          title: 'Solution Title 7ec3f1ce-0e86-4371-8d60-10346fd728ab',
          description:
            'Solution Description 7ec3f1ce-0e86-4371-8d60-10346fd728ab',
          tip: 'Solution Tip 7ec3f1ce-0e86-4371-8d60-10346fd728ab',
          documentation: 'https://documentation.url',
          globals: {},
          sectors: {},
        });
      });

      it('integrate API should be called', () => {
        expect(mocks.integrateSolution).toBeCalledWith(
          expect.objectContaining({
            solutionUuid: '7ec3f1ce-0e86-4371-8d60-10346fd728ab',
            title: 'Solution Title 7ec3f1ce-0e86-4371-8d60-10346fd728ab',
            description:
              'Solution Description 7ec3f1ce-0e86-4371-8d60-10346fd728ab',
            tip: 'Solution Tip 7ec3f1ce-0e86-4371-8d60-10346fd728ab',
            documentation: 'https://documentation.url',
            globals: {},
            sectors: {},
          }),
        );
      });

      it('integrated items should be updated', () => {
        expect(
          solutionsActiveStore.integrateds.data.map(({ uuid }) => uuid),
        ).toEqual([
          '9b3ba44e-4f61-4e92-a092-8cb6f76888a1',
          '7ec3f1ce-0e86-4371-8d60-10346fd728ab',
        ]);
      });

      it('available items should be updated', () => {
        expect(solutionsActiveStore.available.map(({ uuid }) => uuid)).toEqual([
          '1d501f84-2dea-4aa8-b89b-9cfab4afba69',
        ]);
      });

      describe('when the update is called', () => {
        beforeEach(() => {
          solutionsActiveStore.integrateds.update(
            '9b3ba44e-4f61-4e92-a092-8cb6f76888a1',
            {
              globals: {
                global1: { value: 'Global Value 1' },
                global2: { value: 'Global Value 2' },
              },
              sectors: {
                sector1: { value: ['Sector Value 1', 'Sector Value 2'] },
                sector2: { value: ['Sector Value 3', 'Sector Value 4'] },
              },
            },
          );
        });

        it('update API should be called', () => {
          expect(mocks.updateIntegratedSolution).toBeCalledWith({
            solutionUuid: '9b3ba44e-4f61-4e92-a092-8cb6f76888a1',
            globals: {
              global1: { value: 'Global Value 1' },
              global2: { value: 'Global Value 2' },
            },
            sectors: {
              sector1: { value: ['Sector Value 1', 'Sector Value 2'] },
              sector2: { value: ['Sector Value 3', 'Sector Value 4'] },
            },
          });
        });

        it('integrated item should be updated', () => {
          expect(solutionsActiveStore.integrateds.data).toContainEqual(
            expect.objectContaining({
              uuid: '9b3ba44e-4f61-4e92-a092-8cb6f76888a1',
              globals: {
                global1: { value: 'Global Value 1' },
                global2: { value: 'Global Value 2' },
              },
              sectors: {
                sector1: { value: ['Sector Value 1', 'Sector Value 2'] },
                sector2: { value: ['Sector Value 3', 'Sector Value 4'] },
              },
            }),
          );
        });

        describe('when the disintegrate is called', () => {
          beforeEach(() => {
            solutionsActiveStore.integrateds.disintegrate({
              uuid: '9b3ba44e-4f61-4e92-a092-8cb6f76888a1',
            });
          });

          it('disintegrate API should be called', () => {
            expect(mocks.disintegrateSolution).toBeCalledWith({
              solutionUuid: '9b3ba44e-4f61-4e92-a092-8cb6f76888a1',
            });
          });

          it('integrated items should be updated', () => {
            expect(
              solutionsActiveStore.integrateds.data.map(({ uuid }) => uuid),
            ).toEqual(['7ec3f1ce-0e86-4371-8d60-10346fd728ab']);
          });

          it('available items should be updated', () => {
            expect(
              solutionsActiveStore.available.map(({ uuid }) => uuid),
            ).toEqual([
              '1d501f84-2dea-4aa8-b89b-9cfab4afba69',
              '9b3ba44e-4f61-4e92-a092-8cb6f76888a1',
            ]);
          });
        });
      });
    });
  });
});
