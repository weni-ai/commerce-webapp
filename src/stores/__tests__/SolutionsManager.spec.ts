import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useSolutionsManagerStore } from '../SolutionsManager';
import { createPinia, setActivePinia } from 'pinia';
import { useSolutionsActiveStore } from '../SolutionsActive';
import { useSolutionsPassiveStore } from '../SolutionsPassive';

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

describe('SolutionsManager Store', () => {
  let solutionsManagerStore: ReturnType<typeof useSolutionsManagerStore>;
  let solutionsActiveStore: ReturnType<typeof useSolutionsActiveStore>;
  let solutionsPassiveStore: ReturnType<typeof useSolutionsPassiveStore>;

  beforeEach(() => {
    setActivePinia(createPinia());

    solutionsManagerStore = useSolutionsManagerStore();

    solutionsActiveStore = useSolutionsActiveStore();
    solutionsPassiveStore = useSolutionsPassiveStore();

    solutionsActiveStore.all.load();
    solutionsPassiveStore.all.load();

    solutionsActiveStore.integrateds.load();
    solutionsPassiveStore.integrateds.load();
  });

  describe.each([
    {
      uuidToIntegrate: '1d501f84-2dea-4aa8-b89b-9cfab4afba69',
      expectedGroup: 'active',
    },
    {
      uuidToIntegrate: '59bd9665-19e7-4686-b5ab-b1b41a6f84c9',
      expectedGroup: 'passive',
    },
  ])(
    'when the integrateOrUpdate is called with the uuid $uuidToIntegrate that is not integrated',
    ({ uuidToIntegrate, expectedGroup }) => {
      it(`integrate function should be called inside the ${expectedGroup} group`, () => {
        const integrate = vi.spyOn(
          expectedGroup === 'active'
            ? solutionsActiveStore.integrateds
            : solutionsPassiveStore.integrateds,
          'integrate',
        );

        const solution = {
          uuid: uuidToIntegrate,
          title: 'Solution Title',
          description: 'Solution Description',
          tip: 'Solution Tip',
          documentation: 'https://documentation.url',
          globals: {
            global1: { value: 'Global Value 1' },
            global2: { value: 'Global Value 2' },
          },
          sectors: {
            sector1: { value: ['Sector Value 1', 'Sector Value 2'] },
            sector2: { value: ['Sector Value 3', 'Sector Value 4'] },
          },
        };

        solutionsManagerStore.integrateOrUpdate(solution);

        expect(integrate).toHaveBeenCalledWith(solution);
      });
    },
  );

  describe.each([
    {
      uuidToUpdate: '9b3ba44e-4f61-4e92-a092-8cb6f76888a1',
      expectedGroup: 'active',
    },
    {
      uuidToUpdate: 'cff8bd84-064e-4339-acd7-8f602487b380',
      expectedGroup: 'passive',
    },
  ])(
    'when the integrateOrUpdate is called with the uuid $uuidToUpdate that is already integrated',
    ({ uuidToUpdate, expectedGroup }) => {
      it(`update function should be called inside the ${expectedGroup} group`, () => {
        const update = vi.spyOn(
          expectedGroup === 'active'
            ? solutionsActiveStore.integrateds
            : solutionsPassiveStore.integrateds,
          'update',
        );

        solutionsManagerStore.integrateOrUpdate({
          uuid: uuidToUpdate,
          title: 'Solution Title',
          description: 'Solution Description',
          tip: 'Solution Tip',
          documentation: 'https://documentation.url',
          globals: {
            global1: { value: 'Global Value 1' },
            global2: { value: 'Global Value 2' },
          },
          sectors: {
            sector1: { value: ['Sector Value 1', 'Sector Value 2'] },
            sector2: { value: ['Sector Value 3', 'Sector Value 4'] },
          },
        });

        expect(update).toHaveBeenCalledWith(uuidToUpdate, {
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
    },
  );

  describe.each([
    {
      uuidToDisintegrate: '9b3ba44e-4f61-4e92-a092-8cb6f76888a1',
      expectedGroup: 'active',
    },
    {
      uuidToDisintegrate: 'cff8bd84-064e-4339-acd7-8f602487b380',
      expectedGroup: 'passive',
    },
  ])(
    'when the disintegrate is called with the uuid $uuidToDisintegrate',
    ({ uuidToDisintegrate, expectedGroup }) => {
      it(`disintegrate function should be called inside the ${expectedGroup} group`, () => {
        const disintegrate = vi.spyOn(
          expectedGroup === 'active'
            ? solutionsActiveStore.integrateds
            : solutionsPassiveStore.integrateds,
          'disintegrate',
        );

        solutionsManagerStore.disintegrate({ uuid: uuidToDisintegrate });

        expect(disintegrate).toHaveBeenCalledWith({ uuid: uuidToDisintegrate });
      });
    },
  );
});
