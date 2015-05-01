/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'atlas-colombia',
    environment: environment,
    baseURL: '/atlas-colombia',
    locationType: 'hash',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      defaultLocale: 'en',
      env: environment
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  if (environment === 'development') {
    ENV.contentSecurityPolicy = {
      'connect-src': "'self' http://54.172.130.22",
      'style-src': "'self' 'unsafe-inline' *",
    }
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {
    ENV.baseURL = '/atlas-columbia';
    ENV.contentSecurityPolicy = {
      'connect-src': "'self' http://54.172.130.22",
    }
  }

  return ENV;
};
