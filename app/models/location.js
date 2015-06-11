import DS from 'ember-data';
import Ember from 'ember';
const { attr } = DS;
const { computed } = Ember;

export default DS.Model.extend({
  code: attr('number', { defaultValue: 111}),

  name_en: attr('string', { defaultValue: 'atlantico in english'}),
  name_es: attr('string', { defaultValue: 'atlantico in spanish'}),

  name_short_en: attr('string', { defaultValue: 'english'}),
  name_short_es: attr('string', { defaultValue: 'spanish'}),

  population: attr('number', { defaultValue: 100000000}),
  randomAttr: attr('number', { defaultValue: 100000000}),

  productsData: attr(),
  departments: attr(),

  level: attr(),

  timeSeries: attr(),
  topExports: attr(),
  currentExports: attr(),
  products: attr(),

  sortedTimeSeries: computed('timeSeries', function() {
    return _.sortBy(this.get('timeSeries'), 'year');
  }),
  firstTimeSeries: computed(function(){
    return _.first(this.get('sortedTimeSeries'));
  }),
  lastTimeSeries: computed(function(){
    return _.last(this.get('sortedTimeSeries'));
  }),
  firstGdp: computed(function() {
    return this.get('firstTimeSeries.gdp');
  }),
  latestGdp: computed(function() {
    return this.get('lastTimeSeries.gdp');
  }),
  gdpGrowth: computed(function(){
    return (this.get('latestGdp') - this.get('firstGdp')) / this.get('latestGdp');
  }),
  latestPop: computed(function() {
    return this.get('lastTimeSeries.pop');
  }),
  firstYear: computed(function() {
    return this.get('firstTimeSeries.year');
  }),
  lastYear: computed(function() {
    return this.get('lastTimeSeries.year');
  }),
  yearRange: computed(function() {
    return `${this.get('firstYear')}–${this.get('lastYear')}`;
  })
});
