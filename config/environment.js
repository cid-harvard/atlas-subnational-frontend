/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'atlas-colombia',
    environment: environment,
    baseURL: process.env.ROOT_URL || '/',
    locationType: 'auto',
    defaultLocale: process.env.DEFAULT_LOCALE,
    otherLocale: process.env.OTHER_LOCALE,
    downloadURL: process.env.DOWNLOAD_URL,
    mapURL: process.env.MAP_URL,
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },
    i18n: {
      defaultLocale: process.env.DEFAULT_LOCALE,
      otherLocale: process.env.OTHER_LOCALE
    },
    APP: {
      env: environment
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  ENV.apiURL = process.env.API_URL,

  ENV.contentSecurityPolicy = {
    'style-src': "'self' 'unsafe-inline' *",
    'connect-src': "'self' http://54.6.95.239 *",
    'img-src': "'self' http://placehold.it/40x40 * data:",
    'font-src': "'self' https://fonts.gstatic.com/",
    'script-src': "'self' 'unsafe-eval' 'unsafe-inline'  www.google-analytics.com"
  };

  if (environment === 'test') {
    ENV.defaultLocale = process.env.OTHER_LOCALE;
    ENV.otherLocale = process.env.DEFAULT_LOCALE;
    ENV.i18n = {
      defaultLocale: process.env.OTHER_LOCALE,
      otherLocale: process.env.DEFAULT_LOCALE
    }
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';
    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;
    ENV.APP.rootElement = '#ember-testing';
  }
  if (environment === 'production') {
    ENV.baseURL = process.env.ROOT_URL || '/';
    ENV.locationType = 'hash',
    ENV.googleAnalytics = {
      webPropertyId: process.env.GA
    };
  }

  return ENV;
};
