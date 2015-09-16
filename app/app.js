import Ember from 'ember';
import Resolver from 'ember/resolver';
import loadInitializers from 'ember/load-initializers';
import config from './config/environment';
import numeral from 'numeral';

var App;

App = Ember.Application.extend({
  LOG_TRANSITIONS: true, // basic logging of successful transitions
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver: Resolver,
  ready: function() {
    numeral.language('es', {
      currency:{ symbol: 'Col$' },
      delimiters: { thousands: '.', decimal: ',' },
      abbreviations: { thousand: 'miles', million: 'mill', billion: 'mm', trillion: 'bill' }
    });
    numeral.language('en', {
      currency:{ symbol: 'Col$' },
      delimiters: { thousands: ',', decimal: '.' },
      abbreviations: { thousand: 'K', million: 'M', billion: 'B', trillion: 'T' }
    });
  }
});

loadInitializers(App, config.modulePrefix);

export default App;
