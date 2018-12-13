import Ember from 'ember';
const {computed} = Ember;

export default Ember.Controller.extend({
  featureToggle: Ember.inject.service(),
  queryParams: ['year'],

  entityType: "livestock",

  firstYear: computed.alias('featureToggle.year_ranges.agcensus.first_year'),
  lastYear: computed.alias('featureToggle.year_ranges.agcensus.last_year'),
});


