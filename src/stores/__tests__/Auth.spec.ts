import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it } from 'vitest';
import { useAuthStore } from '../Auth';

describe('Auth Store', () => {
  let authStore: ReturnType<typeof useAuthStore>;

  beforeEach(() => {
    setActivePinia(createPinia());

    authStore = useAuthStore();
  });

  describe('when token is set', () => {
    it('token should be Token 1234', () => {
      authStore.setToken('Token 1234');
      expect(authStore.token).toBe('Token 1234');
    });
  });

  describe('when projectUuid is set', () => {
    it('projectUuid should be 1234', () => {
      authStore.setProjectUuid('1234');
      expect(authStore.projectUuid).toBe('1234');
    });
  });
});
