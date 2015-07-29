import DS from 'ember-data';
import Ember from 'ember';
import ENV from '../config/environment';
import numeral from 'numeral';
import ModelAttribute from '../mixins/model-attribute';
const {apiURL} = ENV;
const {attr} = DS;
const {computed, $, get:get } = Ember;

export default DS.Model.extend(ModelAttribute, {
  //data that drives the profile
  productsData: attr(),
  industriesData: attr(),
  departments: attr(),
  timeseries: attr(),

  //following drives graphbuilder
  graphbuilderProducts: computed('id', function() {
    var defaultParams = {
      treemap: { variable: 'export_value', startDate: 2007, endDate: 2013 },
      multiples: { variable: 'export_value', startDate: 2007, endDate: 2013 },
      scatter: { variauble: null,  startDate: 2012, endDate: 2013 },
      similarty: { variauble: null,  startDate: 2012, endDate: 2013 }
    };
    return $.getJSON(`${apiURL}/data/location/${this.get('id')}/products?level=class`)
      .then((response) => {
        let productsMetadata = this.get('metaData.products');
        let data = response.data;

        data = _.map(data, (d) => {
          let product = productsMetadata[d.product_id];
          return _.merge(d, product);
        });
        return { entity: this, entity_type:'location', data: data, source: 'products', defaultParams:defaultParams };
      }, (error) => {
        return { error: error, entity: this, entity_type:'location', data: [], source: 'products', defaultParams:defaultParams};
      });
  }),
  graphbuilderIndustries: computed('id', function() {
    var defaultParams = {
      treemap: { variable: 'wages', startDate: 2007, endDate: 2013 },
      multiples: { variable: 'wages', startDate: 2007, endDate: 2013 },
      scatter: { variauble: null,  startDate: 2012, endDate: 2013 },
      similarty: { variauble: null,  startDate: 2012, endDate: 2013 }
    };
    return $.getJSON(`${apiURL}/data/location/${this.get('id')}/industries?level=class`)
      .then((response) => {
        let industriesMetadata = this.get('metaData.industries');
        let data = response.data;

        data = _.map(data, (d) => {
          let industry = industriesMetadata[d.industry_id];
          return _.merge(d, industry);
        });
       return { entity: this, entity_type:'location', data: data, source: 'industries',  defaultParams: defaultParams};
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

  //validTimeseries is array of data points where all key(expect diversity cause fucking values are null),value pairs are not null
  //TODO: fuck this shit, fucking data is invalid from the API just fucking check if gdp is fucking exists
  validTimeseries: computed.filter('timeseries', function(data) {
    return data.gdp_real;
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
