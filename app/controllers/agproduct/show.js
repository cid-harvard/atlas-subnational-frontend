import Ember from 'ember';
const {computed} = Ember;

export default Ember.Controller.extend({
  featureToggle: Ember.inject.service(),
  queryParams: ['year'],

  entityType: "agproduct",

  firstYear: computed.alias('featureToggle.year_ranges.agproduct.first_year'),
  lastYear: computed.alias('featureToggle.year_ranges.agproduct.last_year'),
});


