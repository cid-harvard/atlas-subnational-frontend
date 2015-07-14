/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'atlas-colombia',
    environment: environment,
    baseURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },
    i18n: {
      defaultLocale: 'es',
      otherLocale: 'en'
    },
    APP: {
      env: environment
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  if (environment === 'development') {
    ENV.apiURL = "http://atlas-colombia-master.cid-labs.com/api";
    ENV.contentSecurityPolicy = {
      'connect-src': "'self' 'localhost:4200' *",
      'style-src': "'self' 'unsafe-inline' *",
      'img-src': "'self' http://placehold.it/40x40 *"
    }
  }

  if (environment === 'edge') {
    ENV.apiURL = "http://ec2-54-174-138-240.compute-1.amazonaws.com/api";
    // need to fix for production mode
    ENV.contentSecurityPolicy = {
      'connect-src': "'self' 'localhost:4200' *",
      'style-src': "'self' 'unsafe-inline' *",
      'img-src': "'self' http://placehold.it/40x40 *",
      'script-src': "'self' 'localhost:4200' 'unsafe-eval'",
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
    ENV.apiURL = "api/";
    ENV.baseURL = '/';
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

  if (environment === 'colombia_june_2015') {
    ENV.apiURL = "api/";
    ENV.baseURL = '/';
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

  if (environment === 'atlas_colombia_master') {
    ENV.apiURL = "api/";
    ENV.baseURL = '/';
    ENV.locationType = 'hash',
    ENV.contentSecurityPolicy = {
      'style-src': "'self' 'unsafe-inline' *",
      'connect-src': "'self' http://54.6.95.239 *",
      'img-src': "'self' http://placehold.it/40x40 *",
      'script-src': "'self' 'unsafe-eval' 'unsafe-inline'  www.google-analytics.com"
    };
  }

  if (environment === 'colombia_june_2015') {
    ENV.apiURL = "api/";
    ENV.baseURL = '/';
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

  if (environment === 'atlas_colombia_master') {
    ENV.apiURL = "api/";
    ENV.baseURL = '/';
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
