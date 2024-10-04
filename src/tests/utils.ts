import { UnnnicSystem } from '@/plugins/UnnnicSystem';
import { createTestingPinia } from '@pinia/testing';
import { mount } from '@vue/test-utils';
import { vi } from 'vitest';
import { get } from 'lodash';

export const setup = (
  ...args: [...Parameters<typeof mount>, { pinia: { stubActions: boolean } }?]
) => {
  const [component, options, config] = args;

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
          stubActions: get(config, 'pinia.stubActions'),
        }),
        ...(options?.global?.plugins || []),
      ],
    },
  });
};
