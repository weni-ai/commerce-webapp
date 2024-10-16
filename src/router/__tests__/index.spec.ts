import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import { setActivePinia } from 'pinia';
import router from '..';
import { useAuthStore } from '@/stores/Auth';
import { flushPromises } from '@vue/test-utils';
import { i18n } from '@/locales';

vi.hoisted(() => {
  [
    '@/views/HomeView.vue',
    '@/views/Discovery.vue',
    '@/views/IntegratedSolutions.vue',
  ].forEach((view) => {
    vi.mock.bind(this, view, () => ({
      default: {
        template: '<section></section>',
      },
    }))();
  });
});

describe('router', () => {
  it('when the router is changed it should emits the changePathname event to the parent window', async () => {
    const postMessage = vi.spyOn(window.parent, 'postMessage');

    router.push({ name: 'discovery' });
    await router.isReady();

    expect(postMessage).toHaveBeenCalledWith(
      {
        event: 'changePathname',
        pathname: '/discovery',
        moduleName: 'commerce',
      },
      '*',
    );
  });

  describe('when the loginexternal is called', async () => {
    let authStore: ReturnType<typeof useAuthStore>;

    beforeEach(async () => {
      const pinia = createTestingPinia({
        createSpy: vi.fn,
      });

      setActivePinia(pinia);

      router.push(
        '/loginexternal/Bearer+1234/?locale=en&project_uuid=12&next=/integrated-solutions',
      );
      await router.isReady();

      authStore = useAuthStore();

      await flushPromises();
    });

    it('should set the token', () => {
      expect(authStore.setToken).toBeCalledWith('Bearer 1234');
    });

    it('should set the projectUuid', () => {
      expect(authStore.setProjectUuid).toBeCalledWith('12');
    });

    it("route name should be as same as the 'next' query param", () => {
      expect(router.currentRoute.value.fullPath).toBe('/integrated-solutions');
    });
  });

  describe("when the loginexternal is called without the 'next' query param", async () => {
    beforeEach(async () => {
      const pinia = createTestingPinia({
        createSpy: vi.fn,
      });

      setActivePinia(pinia);

      router.push('/loginexternal/Bearer+1234/?locale=en&project_uuid=12');
      await router.isReady();

      await flushPromises();
    });

    it('fullPath should be the initial', () => {
      expect(router.currentRoute.value.fullPath).toBe('/discovery');
    });
  });

  describe("when it is DEV environment and the loginexternal is called with the 'set_api_base_url' query param", async () => {
    beforeEach(async () => {
      import.meta.env.DEV = true;

      const pinia = createTestingPinia({
        createSpy: vi.fn,
      });

      setActivePinia(pinia);

      router.push(
        '/loginexternal/Bearer+1234/?locale=en&project_uuid=12&set_api_base_url=https://api-replaced.url',
      );
      await router.isReady();

      await flushPromises();
    });

    it('dev:replaceAPIBaseURL in localStorage should be set', () => {
      expect(localStorage.getItem('dev:replaceAPIBaseURL')).toBe(
        'https://api-replaced.url',
      );
    });
  });

  describe.each([
    { externalLanguage: 'en', localLanguage: 'en-us' },
    { externalLanguage: 'pt-br', localLanguage: 'pt-br' },
    { externalLanguage: 'es', localLanguage: 'es' },
  ])(
    'when the loginexternal is called with $externalLanguage external language',
    ({ externalLanguage, localLanguage }) => {
      beforeEach(async () => {
        const pinia = createTestingPinia({
          createSpy: vi.fn,
        });

        setActivePinia(pinia);

        router.push(
          `/loginexternal/Bearer+1234/?locale=${externalLanguage}&project_uuid=12`,
        );

        await router.isReady();

        await flushPromises();
      });

      it(`should set the i18n locale to '${localLanguage}'`, () => {
        expect(i18n.global.locale).toBe(localLanguage);
      });
    },
  );
});
