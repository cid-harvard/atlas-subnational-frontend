import DS from 'ember-data';
const { attr } = DS;


export default DS.Model.extend({
  code: attr(),
  gdp: attr(),
  name: attr(),
  population: attr(),
  randomAttr: attr(),
  profileDot: attr(),
  profileSpark: attr(),
  profileExport: attr()
});
