import DS from 'ember-data';

export default DS.Model.extend({
  code: DS.attr(),
  gdp: DS.attr(),
  name: DS.attr(),
  population: DS.attr(),
  randomAttr: DS.attr()
});
