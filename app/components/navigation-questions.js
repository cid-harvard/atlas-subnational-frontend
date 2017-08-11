import Ember from 'ember';

const {computed} = Ember;

export default Ember.Component.extend({
  i18n: Ember.inject.service(),
  featureToggle: Ember.inject.service(),

  questionsPartial: computed('entityType', function() {
    return this.get('entityType') + '/questions';
  }),

});
