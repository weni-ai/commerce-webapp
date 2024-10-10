import { setup } from '@/tests/utils';
import { flushPromises } from '@vue/test-utils';
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type MockInstance,
} from 'vitest';
import HomeView from '../HomeView.vue';
import { createRouter, createWebHistory } from 'vue-router';

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
    listIntegratedSolutions: vi.fn(),
  };
});

vi.mock('@/api/solutions.ts', () => ({
  default: {
    listIntegratedSolutions: mocks.listIntegratedSolutions,
  },
}));

const components = {
  tabs: '[data-test="tabs"]',
};

describe('HomeView', () => {
  let router;

  let routerPushMock: MockInstance;
  let wrapper: ReturnType<typeof setup>;

  async function commonSetup(): Promise<ReturnType<typeof setup>> {
    router = createRouter({
      history: createWebHistory(),
      routes: [
        {
          path: '/discovery',
          name: 'discovery',
          component: {
            template: '<section>discovery</section>',
          },
        },
        {
          path: '/integrated-solutions',
          name: 'integrated-solutions',
          component: {
            template: '<section>integrated-solutions</section>',
          },
        },
      ],
    });

    router.push('/discovery');
    await router.isReady();

    routerPushMock = vi.spyOn(router, 'push');

    return setup(HomeView, {
      global: {
        plugins: [router],

        stubs: {
          RouterView: false,
        },
      },
    });
  }

  describe('when there is not integrated solutions', () => {
    beforeEach(async () => {
      mocks.listIntegratedSolutions.mockImplementation(
        () => new Promise((resolve) => resolve([])),
      );

      wrapper = await commonSetup();
    });

    it('renders Tabs component properly', () => {
      expect(wrapper.findComponent(components.tabs).props()).toEqual(
        expect.objectContaining({
          activeTab: 'discovery',
          tabs: ['discovery'],
        }),
      );
    });
  });

  describe('when there is integrated solutions', () => {
    beforeEach(async () => {
      mocks.listIntegratedSolutions.mockImplementation(
        ({ category }: { category: 'ACTIVE' | 'PASSIVE' }) =>
          new Promise((resolve) => resolve(integratedLists[category])),
      );

      wrapper = await commonSetup();
    });

    it('renders Tabs component properly', () => {
      expect(wrapper.findComponent(components.tabs).props()).toEqual(
        expect.objectContaining({
          activeTab: 'discovery',
          tabs: ['discovery', 'integrated-solutions'],
        }),
      );
    });

    describe('when the Tabs component emits change event', () => {
      beforeEach(async () => {
        wrapper
          .findComponent(components.tabs)
          .vm.$emit('change', 'integrated-solutions');

        await flushPromises();
      });

      it('router.push should be called for the corresponding route', () => {
        expect(routerPushMock).toBeCalledWith({ name: 'integrated-solutions' });
      });

      it('activeTab prop from Tabs should change to integrated-solutions', async () => {
        expect(
          wrapper.findComponent(components.tabs).props('activeTab'),
        ).toEqual('integrated-solutions');
      });
    });
  });
});
