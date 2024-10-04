import { setup } from '@/tests/utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ModalIntegrate from '@/components/solutions/ModalIntegrate.vue';

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key,
  }),
}));

describe('ModalIntegrate', () => {
  let wrapper: ReturnType<typeof setup>;

  describe('when the status is available', () => {
    beforeEach(() => {
      wrapper = setup(ModalIntegrate, {
        props: {
          modelValue: true,
          description: 'Solution description',
          tip: 'Solution tip',
          status: 'available',
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
          size: 'md',
          showCloseIcon: true,
          showActionsDivider: false,
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

    it('renders description', () => {
      expect(wrapper.text()).contains('Solution description');
    });

    it('renders tip box', () => {
      expect(wrapper.find('[data-test="tip-box"]').exists()).toBeTruthy();
    });

    it('renders tip text', () => {
      expect(wrapper.text()).contains('Solution tip');
    });

    it('renders integrate button', () => {
      expect(
        wrapper.find('[data-test="integrate-button"]').exists(),
      ).toBeTruthy();
    });

    describe('when the user clicks on the integrate button', () => {
      beforeEach(() => {
        wrapper.find('[data-test="integrate-button"]').trigger('click');
      });

      it('emits close event', () => {
        expect(wrapper.emitted('update:modelValue')).toHaveLength(1);
        expect(wrapper.emitted('update:modelValue')).toContainEqual([false]);
      });

      it('emits integrate event', () => {
        expect(wrapper.emitted('integrate')).toHaveLength(1);
        expect(wrapper.emitted('integrate')).toContainEqual([]);
      });
    });
  });

  describe('when the status is integrated', () => {
    beforeEach(() => {
      wrapper = setup(ModalIntegrate, {
        props: {
          modelValue: true,
          description: 'Solution description',
          tip: 'Solution tip',
          status: 'integrated',
        },
      });
    });

    it('renders edit button', () => {
      expect(wrapper.find('[data-test="edit-button"]').exists()).toBeTruthy();
    });

    describe('when the user clicks on the integrate button', () => {
      beforeEach(() => {
        wrapper.find('[data-test="edit-button"]').trigger('click');
      });

      it('emits close event', () => {
        expect(wrapper.emitted('update:modelValue')).toHaveLength(1);
        expect(wrapper.emitted('update:modelValue')).toContainEqual([false]);
      });

      it('emits edit event', () => {
        expect(wrapper.emitted('edit')).toHaveLength(1);
        expect(wrapper.emitted('edit')).toContainEqual([]);
      });
    });
  });

  describe('when the tip is not defined', () => {
    it('does not render tip', () => {
      wrapper = setup(ModalIntegrate, {
        props: {
          modelValue: true,
          description: 'Solution description',
          status: 'available',
        },
      });

      expect(wrapper.find('[data-test="tip-box"]').exists()).toBeFalsy();
    });
  });

  describe('when the status is unknown', () => {
    beforeEach(() => {
      wrapper = setup(ModalIntegrate, {
        props: {
          modelValue: true,
          description: 'Solution description',
          tip: 'Solution tip',
          status: 'unknown',
        },
      });
    });

    it('does not render integrate button', () => {
      expect(
        wrapper.find('[data-test="integrate-button"]').exists(),
      ).toBeFalsy();
    });

    it('does not render edit button', () => {
      expect(wrapper.find('[data-test="edit-button"]').exists()).toBeFalsy();
    });
  });
});
