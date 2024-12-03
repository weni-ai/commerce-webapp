import getEnv from './env';
import * as Sentry from '@sentry/vue';
import type { createApp } from 'vue';

export const SentryInit = ({ app }: { app: ReturnType<typeof createApp> }) => {
  if (getEnv('SENTRY_DSN')) {
    Sentry.init({
      release: `name_sentry_test@$skjfhsdkhfkj2837462876487236432`,
      app,
      dsn: getEnv('SENTRY_DSN'),
      environment: getEnv('SENTRY_ENVIRONMENT'),
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration(),
      ],
      tracesSampleRate: 1.0,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
    });
  }
};
