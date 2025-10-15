// preload.js
if (process.env.SENTRY_DSN) {
  try {
    const SentryPreload = require('@sentry/electron/preload');
    SentryPreload.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV || 'development',
    });
  } catch (e) {
    console.warn('[Sentry preload] Not enabled:', e && e.message);
  }
}
