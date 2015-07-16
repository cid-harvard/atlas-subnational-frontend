import DS from 'ember-data';
import Ember from 'ember';
import ENV from '../config/environment';
const {apiURL} = ENV;
const {attr} = DS;
const {computed, getWithDefault, $} = Ember;

export default DS.Model.extend({
  i18n: Ember.inject.service(),
  metaData: attr(),

  code: attr('string'),

  name_en: attr('string'),
  name_es: attr('string'),

  name_short_en: attr('string'),
  name_short_es: attr('string'),

  level: attr(),

  //data that drives the profile
  productsData: attr(),
  departments: attr(),
  timeseries: attr(),

  //following drives graphbuilder
  graphbuilderProducts: computed('id', function() {
    var products = $.getJSON(`${apiURL}/data/products?location=${this.get('id')}`);
    var productsData = $.getJSON(`${apiURL}/data/products/scatterplot?location=${this.get('id')}`);
    var defaultParams = {
      treemap: { variable: 'export_value', startDate: 2007, endDate: 2013 },
      multiples: { variable: 'export_value', startDate: 2007, endDate: 2013 },
      scatter: { variauble: null,  startDate: 2012, endDate: 2013 },
      similarty: { variauble: null,  startDate: 2012, endDate: 2013 }
    };
    return Ember.RSVP.all([products, productsData])
      .then((array) => {
        let productsMetadata = this.get('metaData.products');
        let products = getWithDefault(array[0], 'data', []);
        let productsData = getWithDefault(array[1], 'data', []);
        productsData = _.indexBy(productsData, function(d) {
          return `${d.product_id}_y${d.year}`;
        });

        _.each(products, function(d) {
          let product = productsMetadata[d.product_id];
          let productData = productsData[`${d.product_id}_y${d.year}`];
          _.extend(d, product);
          _.extend(d, productData);
        });
        return { entity: this, entity_type:'location', data: products, source: 'products', defaultParams:defaultParams };
      }, (error) => {
        return { error: error, entity: this, entity_type:'location', data: [], source: 'products', defaultParams:defaultParams};
      });
  }),
  graphbuilderIndustries: computed('id', function() {
    var industries = $.getJSON(`${apiURL}/data/industries?location=${this.get('id')}`);
    var industriesData = $.getJSON(`${apiURL}/data/industries/scatterplot?location=${this.get('id')}`);
    var defaultParams = {
      treemap: { variable: 'wages', startDate: 2007, endDate: 2013 },
      multiples: { variable: 'wages', startDate: 2007, endDate: 2013 },
      scatter: { variauble: null,  startDate: 2012, endDate: 2013 },
      similarty: { variauble: null,  startDate: 2012, endDate: 2013 }
    };
    return Ember.RSVP.all([industries, industriesData])
      .then((array) => {
        let industriesMetadata = this.get('metaData.industries');
        let industries = getWithDefault(array[0], 'data', []);
        let industriesData = getWithDefault(array[1], 'data', []);
        industriesData = _.indexBy(industriesData, function(d) {
          return `${d.industry_id}_y${d.year}`;
        });

        _.each(industries, function(d) {
          let industry = industriesMetadata[d.industry_id];
          let industryData = industriesData[`${d.industry_id}_y${d.year}`];
          _.extend(d, industry);
          _.extend(d, industryData);
        });
       return { entity: this, entity_type:'location', data: industries, source: 'industries',  defaultParams: defaultParams};
      }, (error) => {
       return { error: error, entity: this, entity_type:'location', data: [], source: 'industries', defaultParams:defaultParams};
      });
  }),
  locale: computed('i18n.locale', function() {
    return this.get('i18n.locale');
  }),
  _level: computed('locale', 'level', function() {
    return this.get('i18n')
      .t(`location.model.${this.get('level')}`);
  }),
  name: computed('locale', 'name_en', 'name_es', function() {
    let attr = `name_${this.get('locale')}`;
    return this.get(attr) || `${attr} does not exist`;
  }),
  name_short: computed('locale', 'name_short_en', 'name_short_es', function() {
    let attr = `name_${this.get('locale')}`;
    return this.get(attr) || `${attr} does not exist`;
  }),

  //TODO: redo all the stuff below
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
