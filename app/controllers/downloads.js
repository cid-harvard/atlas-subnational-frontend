import Ember from 'ember';
import ENV from '../config/environment';

const { computed } = Ember;

export default Ember.Controller.extend({
  featureToggle: Ember.inject.service(),
  downloadURL: `${ENV.downloadURL}/production`,
  mapURL: ENV.mapURL,
  firstYear: computed.alias('featureToggle.first_year'),
  lastYear: computed.alias('featureToggle.last_year'),
  yearRange: computed('firstYear', 'lastYear', function() {
    return `${this.get('firstYear')} - ${this.get('lastYear')}`;
  })
});

