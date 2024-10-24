import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { checkZodScheme, isSolutionIntegrated } from '..';
import { useSolutionsStore } from '@/stores/Solutions';
import { z } from 'zod';

const integratedLists: { [key in 'ACTIVE' | 'PASSIVE']: Solution[] } = {
  ACTIVE: [
    {
      uuid: '4d983f31-065b-45c8-84fd-276469750c38',
      title: 'Active Solution Title',
      description: 'Active Solution Description',
      tip: 'Active Solution Tip',
      documentation: 'https://documentation.url',
      globals: {
        url_api: {
          value: 'https://api.url',
        },
      },
      sectors: {},
    },
  ],

  PASSIVE: [
    {
      uuid: 'e885f8f7-fe24-449c-8504-d481695393f3',
      title: 'Passive Solution Title',
      description: 'Passive Solution Description',
      tip: 'Passive Solution Tip',
      documentation: 'https://documentation.url',
      globals: {
        url_api: {
          value: 'https://api.url',
        },
      },
      sectors: {},
    },
  ],
};

const mocks = vi.hoisted(() => {
  return {
    listIntegratedSolutions: vi.fn(
      ({ category }: { category: 'ACTIVE' | 'PASSIVE' }) =>
        new Promise((resolve) => resolve(integratedLists[category])),
    ),

    SentryCaptureException: vi.fn(),
  };
});

vi.mock('@/api/solutions.ts', () => ({
  default: {
    listIntegratedSolutions: mocks.listIntegratedSolutions,
  },
}));

vi.mock('@sentry/vue', () => ({
  captureException: mocks.SentryCaptureException,
}));

describe('Index', () => {
  let solutionsStore: ReturnType<typeof useSolutionsStore>;

  beforeEach(async () => {
    setActivePinia(createPinia());

    solutionsStore = useSolutionsStore();

    solutionsStore.integrated.activeNotifications.load();
    solutionsStore.integrated.passiveService.load();
  });

  it.each([
    { uuid: '4d983f31-065b-45c8-84fd-276469750c38' },
    { uuid: 'e885f8f7-fe24-449c-8504-d481695393f3' },
  ])('solution $uuid should be integrated', ({ uuid }) => {
    expect(isSolutionIntegrated({ uuid })).toBeTruthy();
  });

  it.each([
    { uuid: '16230cf0-d35b-484e-ac55-c2f5544e5410' },
    { uuid: '6cbfd5df-50ff-4adb-8900-082398f75d1e' },
  ])('solution $uuid should not be integrated', ({ uuid }) => {
    expect(isSolutionIntegrated({ uuid })).toBeFalsy();
  });

  describe('checkZodScheme', () => {
    it('Sentry should capture on Zod scheme error', () => {
      vi.spyOn(console, 'error').mockImplementationOnce(() => {});

      checkZodScheme(z.object({ foo: z.number() }), { foo: 'bar' });

      expect(mocks.SentryCaptureException).toBeCalledWith(
        expect.objectContaining({
          name: 'ZodError',
          issues: [
            {
              code: 'invalid_type',
              expected: 'number',
              received: 'string',
              path: ['foo'],
              message: 'Expected number, received string',
            },
          ],
        }),
      );
    });
  });
});
