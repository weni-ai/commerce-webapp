import { setup } from '@/tests/utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import SolutionCard from '@/components/solutions/SolutionCard.vue';

const PopoverStub = {
  template:
    '<section><slot name="default"></slot><slot name="children"></slot></section>',
};

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key,
    te: () => false,
  }),
}));

describe('SolutionCard', () => {
  let wrapper: ReturnType<typeof setup>;

  describe('when solution is available to integrate', () => {
    beforeEach(() => {
      wrapper = setup(SolutionCard, {
        props: {
          uuid: '123',
          title: 'Solution title',
          description: 'Solution description',
        },

        global: {
          mocks: {
            Popover: PopoverStub,
          },
        },
      });
    });

    it('renders title', () => {
      expect(wrapper.text()).contains('Solution title');
    });

    it('renders description', () => {
      expect(wrapper.text()).contains('Solution description');
    });

    it('renders add button', () => {
      expect(wrapper.find('[data-test="add-button"]').exists()).toBeTruthy();
    });

    describe('when the user clicks on the add button', () => {
      it('emits add event', () => {
        wrapper.find('[data-test="add-button"]').trigger('click');

        expect(wrapper.emitted('add')).toHaveLength(1);
        expect(wrapper.emitted('add')).toContainEqual([]);
      });
    });
  });

  describe('when solution is already integrated', () => {
    const fnOption1 = vi.fn();
    const fnOption2 = vi.fn();

    beforeEach(() => {
      vi.clearAllMocks();

      wrapper = setup(SolutionCard, {
        props: {
          title: 'Solution title',
          description: 'Solution description',
          options: [
            {
              icon: 'visibility',
              title: 'Option 1',
              onClick: fnOption1,
            },
            {
              type: 'separator',
            },
            {
              icon: 'settings',
              title: 'Option 2',
              onClick: fnOption2,
            },
          ],
        },

        global: {
          mocks: {
            Popover: PopoverStub,
          },
        },
      });
    });

    it('the see options icon should have scheme "neutral-cloudy"', () => {
      expect(
        wrapper.findComponent('[data-test="see-options-icon"]').props('scheme'),
      ).toBe('neutral-cloudy');
    });

    describe('when the Popover component changed isActivatedByClick', () => {
      it('the see options icon should have scheme "neutral-darkest"', async () => {
        await wrapper
          .findComponent({ name: 'Popover' })
          .vm.$emit('update:isActivatedByClick', true);

        expect(
          wrapper
            .findComponent('[data-test="see-options-icon"]')
            .props('scheme'),
        ).toBe('neutral-darkest');
      });
    });

    it.each(['Option 1', 'Option 2'])('renders %s', (option) => {
      expect(wrapper.find(`[data-test="${option}"]`).exists()).toBeTruthy();
    });

    describe.each([
      { option: 'Option 1', fn: fnOption1 },
      { option: 'Option 2', fn: fnOption2 },
    ])('when the user clicks on $option', ({ option, fn }) => {
      it('calls the respective option funcion', () => {
        wrapper.find(`[data-test="${option}"]`).trigger('click');

        expect(fn).toHaveBeenCalled();

        expect(wrapper.find(`[data-test="${option}"]`).exists()).toBeTruthy();
      });
    });
  });
});
