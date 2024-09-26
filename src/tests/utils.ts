import { UnnnicSystem } from '@/plugins/UnnnicSystem';
import { createTestingPinia } from '@pinia/testing';
import { mount } from '@vue/test-utils';
import { vi } from 'vitest';

export const setup = (...args: Parameters<typeof mount>) => {
  const [component, options] = args;

  return mount(component, {
    props: options?.props,

    slots: { ...(options?.slots || {}) },

    global: {
      mocks: {
        $t: (key: string) => key,
        ...(options?.global?.mocks || {}),
      },

      stubs: {
        I18nT: { template: '<span><slot/></span>' },
        ...options?.global?.stubs,
      },

      plugins: [
        UnnnicSystem,
        createTestingPinia({
          createSpy: vi.fn,
        }),
        ...(options?.global?.plugins || []),
      ],
    },
  });
};
