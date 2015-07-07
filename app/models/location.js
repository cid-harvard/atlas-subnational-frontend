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
  industriesData: attr(),
  scatterPlot: attr(),

  departments: attr(),

  level: attr(),

  timeseries: attr(),
  topExports: attr(),
  currentExports: attr(),
  products: attr(),

  locale: computed('i18n.locale', function() {
    return this.get('i18n.locale');
  }),
  _level: computed('locale', 'level', function() {
    return this.get('i18n')
      .t(`location.model.${this.get('level')}`);
  }),
  name: computed('locale', 'name_en', 'name_es', function() {
    let attr = `name_${this.get('locale')}`
    return this.get(attr) || `${attr} does not exist`;
  }),
  name_short: computed('locale', 'name_short_en', 'name_short_es', function() {
    let attr = `name_${this.get('locale')}`
    return this.get(attr) || `${attr} does not exist`;
  }),
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
