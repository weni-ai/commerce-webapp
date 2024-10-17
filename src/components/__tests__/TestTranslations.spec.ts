import { setup } from '@/tests/utils';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import TestTranslations from '../TestTranslations.vue';

const $i18n = {
  locale: '',
};

describe('TestTranslations', () => {
  let wrapper: ReturnType<typeof setup>;

  describe('when it is dev environment', () => {
    beforeEach(() => {
      import.meta.env.DEV = true;

      wrapper = setup(TestTranslations, {
        global: {
          mocks: {
            $i18n,
          },
        },
      });
    });

    afterEach(() => {
      wrapper.unmount();
    });

    it('should not show anything', () => {
      expect(wrapper.text()).toBe('');
    });

    describe("when the user types 'i18n'", () => {
      beforeEach(() => {
        ['i', '1', '8', 'n'].forEach((letter) =>
          document.dispatchEvent(
            new KeyboardEvent('keydown', {
              key: letter,
            }),
          ),
        );
      });

      it('should show the languages options', () => {
        expect(wrapper.findAll('button').length).toBeGreaterThan(0);
      });

      describe.each([
        { language: 'pt-br' },
        { language: 'en-us' },
        { language: 'es' },
      ])('when the user clicks on the $language language', ({ language }) => {
        it(`sets i18n locale to '${language}'`, () => {
          wrapper.find(`[data-test="${language}"]`).trigger('click');

          expect($i18n.locale).toBe(language);
        });
      });
    });
  });

  describe('when it is not dev environment', () => {
    beforeEach(() => {
      import.meta.env.DEV = false;

      wrapper = setup(TestTranslations, {
        global: {
          mocks: {
            $i18n,
          },
        },
      });
    });

    it('should not show anything', () => {
      expect(wrapper.text()).toBe('');
    });

    describe("when the user types 'i18n'", () => {
      beforeEach(() => {
        ['i', '1', '8', 'n'].forEach((letter) =>
          document.dispatchEvent(
            new KeyboardEvent('keydown', {
              key: letter,
            }),
          ),
        );
      });

      it("still doesn't show the language options", () => {
        expect(wrapper.text()).toBe('');
      });
    });
  });
});
