import { setup } from '@/tests/utils';
import { beforeEach, describe, expect, it } from 'vitest';
import SelectSmart from '../SelectSmart.vue';

describe('SelectSmart', () => {
  let wrapper: ReturnType<typeof setup>;

  describe('when the options is an array of strings', () => {
    beforeEach(() => {
      wrapper = setup(SelectSmart, {
        props: {
          modelValue: '',
          placeholder: 'Placeholder',
          options: ['First Option', 'Second Option', 'Third Option'],
        },
      });
    });

    it('UnnnicSelectSmart should have the correct props', () => {
      const UnnnicSelectSmart = wrapper.findComponent({
        name: 'UnnnicSelectSmart',
      });

      expect(UnnnicSelectSmart.props()).toEqual(
        expect.objectContaining({
          modelValue: [{ value: '', label: 'Placeholder' }],
          options: [
            { value: '', label: 'Placeholder' },
            { value: 'First Option', label: 'First Option' },
            { value: 'Second Option', label: 'Second Option' },
            { value: 'Third Option', label: 'Third Option' },
          ],
        }),
      );
    });

    describe('when the user changes the UnnnicSelectSmart', () => {
      it('emits update:modelValue with the corresponding value', () => {
        const UnnnicSelectSmart = wrapper.findComponent({
          name: 'UnnnicSelectSmart',
        });

        UnnnicSelectSmart.vm.$emit('update:modelValue', [
          {
            value: 'Second Option',
          },
        ]);

        expect(wrapper.emitted('update:modelValue')).toContainEqual([
          'Second Option',
        ]);
      });
    });
  });

  describe('when the options is an array of objects', () => {
    beforeEach(() => {
      wrapper = setup(SelectSmart, {
        props: {
          modelValue: '',
          placeholder: 'Placeholder',
          options: [
            { label: 'First Option', value: 'first_option' },
            { label: 'Second Option', value: 'second_option' },
            { label: 'Third Option', value: 'third_option' },
          ],
        },
      });
    });

    it('UnnnicSelectSmart should have the correct props', () => {
      const UnnnicSelectSmart = wrapper.findComponent({
        name: 'UnnnicSelectSmart',
      });

      expect(UnnnicSelectSmart.props()).toEqual(
        expect.objectContaining({
          modelValue: [{ value: '', label: 'Placeholder' }],
          options: [
            { value: '', label: 'Placeholder' },
            { value: 'first_option', label: 'First Option' },
            { value: 'second_option', label: 'Second Option' },
            { value: 'third_option', label: 'Third Option' },
          ],
        }),
      );
    });
  });

  describe('when the modelValue is not in the options values', () => {
    beforeEach(() => {
      wrapper = setup(SelectSmart, {
        props: {
          modelValue: 'not_in_the_options',
          placeholder: 'Placeholder',
          options: [
            { label: 'First Option', value: 'first_option' },
            { label: 'Second Option', value: 'second_option' },
            { label: 'Third Option', value: 'third_option' },
          ],
        },
      });
    });

    it('UnnnicSelectSmart modelValue prop should be an empty array', () => {
      const UnnnicSelectSmart = wrapper.findComponent({
        name: 'UnnnicSelectSmart',
      });

      expect(UnnnicSelectSmart.props('modelValue')).toEqual([]);
    });
  });
});
