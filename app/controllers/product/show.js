import Ember from 'ember';
const {computed} = Ember;

export default Ember.Controller.extend({
  featureToggle: Ember.inject.service(),
  queryParams: ['year'],

  firstYear: computed.alias('featureToggle.first_year'),
  lastYear: computed.alias('featureToggle.last_year'),
  occupationsData: computed.alias('model.occupationsData'),
});


