import { setup } from '@/tests/utils';
import { beforeEach, describe, expect, it } from 'vitest';
import Header from '@/components/Header.vue';

describe('Header', () => {
  let wrapper: ReturnType<typeof setup>;

  describe('when there is description slot', () => {
    beforeEach(() => {
      wrapper = setup(Header, {
        props: {
          title: 'Header title',
          fontSize: 'title-sm',
          fontFamily: 'primary',
          icon: 'storefront',
          iconScheme: 'weni-600',
          titleWeight: 'regular',
        },

        slots: {
          description: 'Header description',
        },
      });
    });

    it('renders icon properly', () => {
      expect(wrapper.findComponent('[data-test="icon"]').props()).toEqual(
        expect.objectContaining({
          enabled: true,
          icon: 'storefront',
          size: 'sm',
          scheme: 'weni-600',
          filled: false,
        }),
      );
    });

    it('renders title', () => {
      expect(wrapper.text()).contains('Header title');
    });

    it('renders description box', () => {
      expect(
        wrapper.find('[data-test="description-box"]').exists(),
      ).toBeTruthy();
    });
  });

  describe('when there is not description slot', () => {
    beforeEach(() => {
      wrapper = setup(Header, {
        props: {
          title: 'Header title',
          fontSize: 'title-sm',
          fontFamily: 'primary',
          icon: 'storefront',
          iconScheme: 'weni-600',
          titleWeight: 'regular',
        },
      });
    });

    it('does not render description box', () => {
      expect(
        wrapper.find('[data-test="description-box"]').exists(),
      ).toBeFalsy();
    });
  });

  describe('when icon prop is null', () => {
    beforeEach(() => {
      wrapper = setup(Header, {
        props: {
          title: 'Header title',
          fontSize: 'title-sm',
          fontFamily: 'primary',
          icon: null,
          iconScheme: null,
          titleWeight: 'regular',
        },
      });
    });

    it('does not render icon component', () => {
      expect(wrapper.find('[data-test="icon"]').exists()).toBeFalsy();
    });
  });
});
