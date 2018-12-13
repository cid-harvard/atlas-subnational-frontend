import Ember from 'ember';
import ENV from '../config/environment';
import Variables from '../variables/data-variables';

const { get, set, computed } = Ember;

export default Ember.Service.extend({
  locale: ENV.defaultLocale,
  country: computed('locale', function() {
    return get(this, 'locale').split('-')[1];
  }),
  isColombia: computed.equal('country', 'col'),
  isMexico: computed.equal('country', 'mex'),
  isPeru: computed.equal('country', 'peru'),
  showDatlas: computed.or('isColombia'),
  showIndustries: computed.or('isMexico', 'isColombia'),
  showImports: computed.or('isMexico', 'isColombia'),
  showCities: computed.or('isMexico', 'isColombia', 'isPeru'),
  showMunis: computed.or('isMexico', 'isColombia'),
  showCustomDemographicDownloads: computed.or('isMexico'),
  showCustomDemographicDownloadsOnlyDept: computed.or('isPeru'),
  countryVariables: computed('country', function() {
    return get(Variables, get(this, 'country'));
  }),
  setVariables: function() {
    _.each(this.get('countryVariables'), (value, key) => {
      set(this, key, value);
    });
  }.on('init')
});
