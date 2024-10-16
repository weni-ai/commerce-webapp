import { setup } from '@/tests/utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAlertStore } from '@/stores/Alert';
import { useSolutionsStore } from '@/stores/Solutions';
import DrawerSolution from '@/components/solutions/DrawerSolution.vue';

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key,
  }),
}));

const routerPushMock = vi.fn();

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: routerPushMock,
  }),
}));

const solution: Solution = {
  version: '1.0',
  uuid: '1234',
  title: 'Solution description',
  description: 'Solution description',
  documentation: 'documentation.url',
  tip: 'Tip message',
  globals: { var1: { value: 'Value 1' }, var2: { value: 'Value 2' } },
  sectors: {
    sector1: { value: ['Value 3', 'Value 4'] },
    sector2: { value: ['Value 5', 'Value 6'] },
  },
  versions: [
    {
      version: '1.0',
      globals: { var1: { value: 'Value 1' }, var2: { value: 'Value 2' } },
      sectors: {
        sector1: { value: ['Value 3', 'Value 4'] },
        sector2: { value: ['Value 5', 'Value 6'] },
      },
    },
  ],
};

describe('DrawerSolution', () => {
  let wrapper: ReturnType<typeof setup>;

  function itEmitsCloseEvent() {
    it('emits close event', async () => {
      expect(wrapper.emitted('update:isOpen')).toHaveLength(1);
      expect(wrapper.emitted('update:isOpen')).toContainEqual([false]);
    });
  }

  describe('when the solution is undefined and the drawer is open', () => {
    beforeEach(() => {
      wrapper = setup(DrawerSolution, {
        props: {
          isOpen: true,
          title: 'Title of the Solution',
          icon: 'storefront',
          iconScheme: 'weni-600',
          solution: undefined,
        },

        global: {
          stubs: {
            teleport: true,
          },
        },
      });
    });

    itEmitsCloseEvent();
  });

  describe('when the solution does not have documentation', () => {
    beforeEach(() => {
      wrapper = setup(DrawerSolution, {
        props: {
          isOpen: true,
          title: 'Title of the Solution',
          icon: 'storefront',
          iconScheme: 'weni-600',
          solution: { ...solution, documentation: undefined },
        },

        global: {
          stubs: {
            teleport: true,
          },
        },
      });
    });

    it('does not show the help box', () => {
      expect(wrapper.find('[data-test="help-box"]').exists()).toBeFalsy();
    });
  });

  describe('when the solution has documentation', () => {
    beforeEach(() => {
      vi.clearAllMocks();

      wrapper = setup(DrawerSolution, {
        props: {
          isOpen: true,
          title: 'Title of the Solution',
          icon: 'storefront',
          iconScheme: 'weni-600',
          solution: solution,
        },

        global: {
          stubs: {
            teleport: true,
          },
        },
      });
    });

    it('drawer should exists', () => {
      const drawer = wrapper.findComponent({ name: 'Drawer' });
      expect(drawer.exists()).toBeTruthy();
    });

    it('shows the help box', () => {
      expect(wrapper.vm.isOpen).toBe(true);
      expect(wrapper.find('[data-test="help-box"]').exists()).toBeTruthy();
    });

    describe('when the user changes one global and one sector', () => {
      beforeEach(() => {
        wrapper
          .findComponent('[data-test="var2"]')
          .vm.$emit('update:modelValue', 'Value 2 Changed');

        wrapper
          .findComponent('[data-test="sector2"]')
          .vm.$emit('update:modelValue', [
            'Value 5 Changed',
            'Value 6 Changed',
          ]);
      });

      describe('when the drawer closes', () => {
        beforeEach(() => {
          wrapper
            .findComponent({ name: 'Drawer' })
            .vm.$emit('update:isOpen', false);
        });

        itEmitsCloseEvent();
      });

      describe('when the user clicks on cancel button', () => {
        beforeEach(() => {
          const closeButton = wrapper.findComponent(
            '[data-test="cancel-button"]',
          );
          expect(closeButton.exists()).toBe(true);
          wrapper.find('[data-test="cancel-button"]').trigger('click');
        });

        itEmitsCloseEvent();
      });

      describe('when the user clicks on save button', () => {
        let solutionsStore: ReturnType<typeof useSolutionsStore>;

        beforeEach(() => {
          solutionsStore = useSolutionsStore();
          solutionsStore.integrateOrUpdate.mockResolvedValue({});

          wrapper.find('[data-test="save-button"]').trigger('click');
        });

        it('calls integrateOrUpdate function from solutions store', () => {
          expect(solutionsStore.integrateOrUpdate).toHaveBeenCalledWith({
            uuid: '1234',

            globals: {
              var1: {
                value: 'Value 1',
              },
              var2: {
                value: 'Value 2 Changed',
              },
            },

            sectors: {
              sector1: {
                value: ['Value 3', 'Value 4'],
              },
              sector2: {
                value: ['Value 5 Changed', 'Value 6 Changed'],
              },
            },
          });
        });

        itEmitsCloseEvent();

        it('alerts that solution has been integrated', () => {
          const alertStore = useAlertStore();

          expect(alertStore.add).toBeCalledWith({
            type: 'success',
            text: 'solutions.integrate.status.created',
          });
        });

        it('redirects to integrated-solutions page', () => {
          expect(routerPushMock).toBeCalledWith({
            name: 'integrated-solutions',
          });
        });
      });
    });
  });
});
