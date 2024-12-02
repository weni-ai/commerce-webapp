import { describe, it, expect, beforeEach, vi } from 'vitest';

import ModalDisintegrate from '@/components/solutions/ModalDisintegrate.vue';
import { useSolutionsManagerStore } from '@/stores/SolutionsManager';
import { setup } from '@/tests/utils';

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key,
  }),
}));

describe('ModalDisintegrate', () => {
  let wrapper: ReturnType<typeof setup>;

  beforeEach(() => {
    wrapper = setup(ModalDisintegrate, {
      props: {
        modelValue: true,
        solution: {
          uuid: '1234',
          title: 'Title of the Solution',
        },
      },
    });
  });

  it('passes the correct props to UnnnicModalDialog', () => {
    expect(
      wrapper.findComponent({ name: 'UnnnicModalDialog' }).props(),
    ).toEqual(
      expect.objectContaining({
        modelValue: true,
        persistent: false,
        type: 'warning',
        size: 'md',
        title: 'solutions.disable.confirmation.title',
        showCloseIcon: true,
        showActionsDivider: true,
        primaryButtonProps: expect.objectContaining({ text: 'common.confirm' }),
        secondaryButtonProps: expect.objectContaining({
          text: 'common.cancel',
        }),
      }),
    );
  });

  describe('when the UnnnicModalDialog emits close event', () => {
    it('emits close event', () => {
      wrapper
        .findComponent({ name: 'UnnnicModalDialog' })
        .vm.$emit('update:modelValue', false);

      expect(wrapper.emitted('update:modelValue')).toHaveLength(1);
      expect(wrapper.emitted('update:modelValue')).toContainEqual([false]);
    });
  });

  describe('when the user clicks on cancel button', () => {
    it('emits close event', () => {
      wrapper.find('[data-test="cancel-button"]').trigger('click');

      expect(wrapper.emitted('update:modelValue')).toHaveLength(1);
      expect(wrapper.emitted('update:modelValue')).toContainEqual([false]);
    });
  });

  describe('when the user clicks on confirm button', () => {
    let solutionsManagerStore: ReturnType<typeof useSolutionsManagerStore>;

    beforeEach(() => {
      solutionsManagerStore = useSolutionsManagerStore();

      solutionsManagerStore.disintegrate.mockResolvedValue({});

      wrapper.find('[data-test="confirm-button"]').trigger('click');
    });

    it('calls disintegrate function from solutions store', () => {
      expect(solutionsManagerStore.disintegrate).toHaveBeenCalledWith({
        uuid: '1234',
      });
    });

    it('emits close event', () => {
      expect(wrapper.emitted('update:modelValue')).toHaveLength(1);
      expect(wrapper.emitted('update:modelValue')).toContainEqual([false]);
    });
  });
});
