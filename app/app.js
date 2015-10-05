import Ember from 'ember';
import Resolver from 'ember/resolver';
import loadInitializers from 'ember/load-initializers';
import config from './config/environment';

var App;

App = Ember.Application.extend({
  LOG_TRANSITIONS: true, // basic logging of successful transitions
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver: Resolver,
});

loadInitializers(App, config.modulePrefix);

export default App;
