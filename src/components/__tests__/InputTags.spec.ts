import { setup } from '@/tests/utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import InputTags from '@/components/InputTags.vue';

describe('InputTags', () => {
  let wrapper: ReturnType<typeof setup>;

  const updateModelValue = vi.fn(($event) => {
    wrapper.setProps({ modelValue: $event });
  });

  beforeEach(() => {
    updateModelValue.mockClear();

    wrapper = setup(InputTags, {
      props: {
        modelValue: [],
        'onUpdate:modelValue': updateModelValue,
      },
    });
  });

  describe('when the user inserts one tag and press enter', () => {
    beforeEach(() => {
      wrapper
        .findComponent({ name: 'UnnnicInput' })
        .vm.$emit('update:modelValue', 'Tag 1');

      wrapper.findComponent({ name: 'UnnnicInput' }).trigger('keydown.enter');
    });

    it('emits update:modelValue with the correct values array', () => {
      expect(updateModelValue).toHaveBeenCalledWith(['Tag 1']);
    });

    describe('when the user inserts another tag and click on the right icon', () => {
      beforeEach(() => {
        wrapper
          .findComponent({ name: 'UnnnicInput' })
          .vm.$emit('update:modelValue', 'Tag 2');

        wrapper
          .findComponent({ name: 'UnnnicInput' })
          .vm.$emit('iconRightClick');
      });

      it('emits update:modelValue with the correct values array', () => {
        expect(updateModelValue).toHaveBeenCalledWith(['Tag 1', 'Tag 2']);
      });

      describe('when the user wants to insert the already inserted tag and press enter', () => {
        beforeEach(async () => {
          updateModelValue.mockClear();

          wrapper
            .findComponent({ name: 'UnnnicInput' })
            .vm.$emit('update:modelValue', 'Tag 1');

          await wrapper
            .findComponent({ name: 'UnnnicInput' })
            .trigger('keydown.enter');
        });

        it('does not emit update:modelValue', () => {
          expect(updateModelValue).not.toHaveBeenCalled();
        });
      });
    });
  });
});
