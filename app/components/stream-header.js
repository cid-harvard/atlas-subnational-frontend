import Ember from 'ember';
const {computed} = Ember;

export default Ember.Component.extend({
  i18n: Ember.inject.service(),
  level: computed.alias('model.level'),
  isLocation: computed.equal('type', 'location'),
  isProduct: computed.equal('type', 'product'),
  isIndustry: computed.equal('type', 'industry'),

  firstYear: computed.alias('i18n.firstYear'),
  lastYear: computed.alias('i18n.lastYear'),

  isCountry: computed.equal('level', 'country'),
  isDepartment: computed.equal('level','department'),
  isMunicipality: computed.equal('level','municipality'),
  isMsa: computed.equal('level','msa'),

  isIndustryClass: computed.equal('level', 'class'),

  isPrescriptiveLocation: computed.or('isDepartment', 'isCountry', 'isMsa'),
});
