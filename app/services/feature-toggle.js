import Ember from 'ember';
import ENV from '../config/environment';
const { get, computed } = Ember;

export default Ember.Service.extend({
  locale: ENV.defaultLocale,
  country: computed('locale', function() {
    return get(this, 'locale').split('-')[1];
  }),
  isColombia: computed.equal('country', 'col'),
  isMexico: computed.equal('country', 'mex')
});
