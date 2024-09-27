import { setup } from '@/tests/utils';
import { beforeEach, describe, expect, it } from 'vitest';
import Drawer from '@/components/Drawer.vue';

describe('Drawer', () => {
  let wrapper: ReturnType<typeof setup>;

  describe('when the drawer is not open', () => {
    beforeEach(() => {
      wrapper = setup(Drawer, {
        props: {
          isOpen: false,
          title: 'Drawer title',
          icon: 'storefront',
          iconScheme: 'weni-600',
        },

        global: {
          stubs: {
            teleport: true,
          },
        },

        slots: {
          default: 'Default slot',

          footer: 'Footer slot',
        },
      });
    });

    it('does not have drawer-view class name', () => {
      expect(document.body.classList.contains('drawer-view')).toBeFalsy();
    });

    describe('when the drawer is open', () => {
      beforeEach(() => {
        wrapper.setProps({ isOpen: true });
      });

      it('has drawer-view class name', () => {
        expect(document.body.classList.contains('drawer-view')).toBeTruthy();
      });

      it('renders Header component properly', () => {
        expect(wrapper.findComponent({ name: 'Header' }).props()).toEqual(
          expect.objectContaining({
            title: 'Drawer title',
            icon: 'storefront',
            iconScheme: 'weni-600',
            fontSize: 'title-md',
            fontFamily: 'secondary',
          }),
        );
      });

      it('render default slot', () => {
        expect(wrapper.text()).contains('Default slot');
      });

      it('render footer slot', () => {
        expect(wrapper.text()).contains('Footer slot');
      });

      describe.each([
        { name: 'background', element: '[data-test="background"]' },
        { name: 'close button', element: '[data-test="close-button"]' },
      ])('when the user clicks on the $name', ({ name, element }) => {
        beforeEach(() => {
          wrapper.find(element).trigger('click');
        });

        it('emits update:isOpen with false', () => {
          expect(wrapper.emitted('update:isOpen')).toHaveLength(1);
          expect(wrapper.emitted('update:isOpen')).toContainEqual([false]);
        });

        it('does not have drawer-view class name', () => {
          expect(document.body.classList.contains('drawer-view')).toBeFalsy();
        });
      });

      describe('when the drawer is unmounted', () => {
        it('does not have drawer-view class name', () => {
          wrapper.unmount();

          expect(document.body.classList.contains('drawer-view')).toBeFalsy();
        });
      });
    });
  });
});
