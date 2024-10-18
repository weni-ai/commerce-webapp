import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SentryInit } from '../SentryInit';

const init = vi.hoisted(() => vi.fn());

vi.mock('@sentry/vue', () => ({
  init,
  browserTracingIntegration: vi.fn(() => 'browserTracingIntegration'),
  replayIntegration: vi.fn(() => 'replayIntegration'),
}));

const app = {
  name: 'Commerce',
};

describe('SentryInit', () => {
  beforeEach(() => {
    init.mockClear();
  });

  describe('when SENTRY_DSN is defined', () => {
    it('Sentry init should be called', () => {
      window.configs = {
        SENTRY_DSN: 'sentry@dsn',
      };

      SentryInit({ app });

      expect(init).toBeCalledWith(
        expect.objectContaining({
          app,
          dsn: 'sentry@dsn',
          release: expect.stringMatching(/^commerce-webapp@\d+\.\d+\.\d+$/),
          integrations: expect.arrayContaining([
            'browserTracingIntegration',
            'replayIntegration',
          ]),
        }),
      );
    });
  });

  describe('when SENTRY_DSN is undefined', () => {
    it('Sentry init should not be called', () => {
      delete window.configs?.SENTRY_DSN;

      SentryInit({ app });

      expect(init).not.toBeCalled();
    });
  });
});
