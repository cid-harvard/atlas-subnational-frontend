import Ember from 'ember';
import ENV from '../config/environment';

const { computed } = Ember;

export default Ember.Controller.extend({
  i18n: Ember.inject.service(),
  featureToggle: Ember.inject.service(),
  downloadURL: `${ENV.downloadURL}/production`,
  mapURL: ENV.mapURL,
  firstYear: computed.alias('i18n.firstYear'),
  lastYear: computed.alias('i18n.lastYear'),
  yearRange: computed('firstYear', 'lastYear', function() {
    return `${this.get('firstYear')} - ${this.get('lastYear')}`;
  })
});

