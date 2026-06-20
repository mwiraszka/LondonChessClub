import * as Sentry from '@sentry/node';
import process from 'node:process';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENVIRONMENT ?? 'development',
  enabled: !!process.env.SENTRY_DSN,
  tracesSampleRate: 0,
});
