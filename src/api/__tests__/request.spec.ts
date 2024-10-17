import { useAuthStore } from '@/stores/Auth';
import { createPinia, setActivePinia } from 'pinia';
import { beforeAll, describe, expect, it } from 'vitest';
import request from '../request';

window.configs = {
  API_BASE_URL: 'https://api.url',
};

describe('request', () => {
  let authStore: ReturnType<typeof useAuthStore>;

  beforeAll(() => {
    setActivePinia(createPinia());

    authStore = useAuthStore();
    authStore.setToken('Bearer 1234');
  });

  it('Axios defaults should be correct', () => {
    expect(request.$http.defaults).toEqual(
      expect.objectContaining({
        baseURL: 'https://api.url',
        headers: expect.objectContaining({
          Authorization: 'Bearer 1234',
        }),
      }),
    );
  });

  describe('when it is dev environment and it has an API base URL replacer', () => {
    it('API base URL should be replaced to the dev environment API replacer', () => {
      import.meta.env.DEV = true;

      localStorage.setItem('dev:replaceAPIBaseURL', 'https://api-replaced.url');

      expect(request.$http.defaults).toEqual(
        expect.objectContaining({
          baseURL: 'https://api-replaced.url',
          headers: expect.objectContaining({
            Authorization: 'Bearer 1234',
          }),
        }),
      );
    });
  });
});
