import Ember from 'ember';

const {computed, get:get} = Ember;

export default Ember.Controller.extend({
  i18n: Ember.inject.service(),
  featureToggle: Ember.inject.service(),
  queryParams: ['source'],
  agroUrl: computed.alias('featureToggle.agroUrl'),
});

