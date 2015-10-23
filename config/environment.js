/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'atlas-colombia',
    environment: environment,
    baseURL: '/',
    locationType: 'auto',
    defaultLocale: process.env.DEFAULT_LOCALE,
    otherLocale: process.env.OTHER_LOCALE,
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

  if (environment === 'development') {
    ENV.apiURL = process.env.API_URL,
    ENV.contentSecurityPolicy = {
      'connect-src': "'self' *",
      'style-src': "'self' 'unsafe-inline' *",
      'img-src': "'self' http://placehold.it/40x40 *"
    }
  }
  if (environment === 'test') {
    ENV.apiURL = "http://atlas-colombia-beta.cid-labs.com/api";
    ENV.defaultLocale = 'en-col';
    ENV.otherLocale = 'es-col';
    ENV.i18n = {
      defaultLocale: 'en-col',
      otherLocale: 'es-col'
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
    ENV.apiURL = process.env.API_URL,
    ENV.baseURL = process.env.ROOT_URL || '/';
    ENV.locationType = 'hash',
    ENV.contentSecurityPolicy = {
      'style-src': "'self' 'unsafe-inline' *",
      'connect-src': "'self' http://54.6.95.239 *",
      'img-src': "'self' http://placehold.it/40x40 *",
      'script-src': "'self' 'unsafe-eval' 'unsafe-inline'  www.google-analytics.com"
    };
    ENV.googleAnalytics = {
      webPropertyId: process.env.GA
    };
  }

  return ENV;
};
