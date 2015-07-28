import DS from 'ember-data';
import Ember from 'ember';
import ENV from '../config/environment';
import numeral from 'numeral';
import ModelAttribute from '../mixins/model-attribute';
const {apiURL} = ENV;
const {attr} = DS;
const {computed, getWithDefault, $, get:get } = Ember;

export default DS.Model.extend(ModelAttribute, {
  //data that drives the profile
  productsData: attr(),
  industriesData: attr(),
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

  exportTotal: computed('productsData', function() {
    var total = _.reduce(this.get('productsData'), function(memo, data) {
      return memo + data.export_value;
    }, 0);
    return numeral(total).format('$ 0.00 a');
  }),

  yearSort: ['year'],

  //validTimeseries is array of data points where all key,value pairs are not null
  validTimeseries: computed.filter('timeseries', function(data) {
    return ! _.any(_.values(data), _.isNull);
  }),
  sortedTimeseries: computed.sort('validTimeseries','yearSort'),

  firstDataPoint: computed('validTimeseries', function() {
    return _.first(this.get('validTimeseries'));
  }),
  lastDataPoint: computed('validTimeseries', function() {
    return _.last(this.get('validTimeseries'));
  }),
  yearRange: computed('validTimeseries', function() {
    var firstYear = get(this.get('firstDataPoint'), 'year');
    var lastYear = get(this.get('lastDataPoint'), 'year');
    return `${firstYear} - ${lastYear}`;
  }),
  lastPop: computed('validTimeseries','locale', function() {
    let pop = get(this.get('lastDataPoint'), 'population');
    return numeral(pop).format('0.00 a');
   }),
  lastGdp: computed('validTimeseries','locale', function() {
    let gdp = get(this.get('lastDataPoint'), 'gdp_real');
    return numeral(gdp).format('$ 0.00 a');
   }),
  lastGdpPerCapita: computed('validTimeseries','locale', function() {
    let gdpPC = get(this.get('lastDataPoint'), 'gdp_pc_real');
    return numeral(gdpPC).format('$ 0.00 a');
   }),
  gdpGrowth:computed('validTimeseries', function() {
    var firstGdp = get(this.get('firstDataPoint'), 'gdp_real');
    var lastGdp = get(this.get('lastDataPoint'), 'gdp_real');
    var growth = (lastGdp - firstGdp) / firstGdp;
    return numeral(growth).format('0.000%');
  })
});
