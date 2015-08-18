import Ember from 'ember';
import numeral from 'numeral';
const {computed, get:get } = Ember;

export default Ember.Controller.extend({
  needs: 'application',
  locale: computed.alias("controllers.application.locale"),
  queryParams: ['year'],
  departmentsData: computed.oneWay('model.departments'),
  productsData: computed.oneWay('model.productsData'),
  industriesData: computed.oneWay('model.industriesData'),
  timeSeriesData: computed.oneWay('model.timeseries'),
  year: 2013,
  isDepartment: computed('model.level', function() {
    return this.get('model.level') === 'department';
  }),
  locationId: computed('model.id','model.level', function() {
    if(this.get('model.level') === 'department' || this.get('model.level') === 'country') {
      return this.get('model.id');
    } else {
      return this.get('model.parent_id');
    }
  }),
  imageCode: computed('model.level', 'model.code', function() {
    if(this.get('model.level') === 'department' || this.get('model.level') === 'country') {
      return this.get('model.code');
    } else {
      return (this.get('model.code')).substring(0,2);
    }
  }),
  productsSortedByExports: computed('productsData', function() {
    return _.slice(_.sortBy(this.get('productsData'), function(d) { return -d.export_value;}), 0, 50);
  }),
  exportTotal: computed('productsData', function() {
    var total = _.reduce(this.get('productsData'), function(memo, data) {
      return memo + data.export_value;
    }, 0);
    return '$' + numeral(total).format('0.0a') + ' USD';
  }),

  yearSort: ['year'],

  //validTimeseries is array of data points where all key(expect diversity cause fucking values are null),value pairs are not null
  validTimeseries: computed.alias('model.timeseries'),
  sortedTimeseries: computed.sort('validTimeseries','yearSort'),

  firstDataPoint: computed('validTimeseries', function() {
    return _.first(this.get('validTimeseries')) || {};
  }),
  lastDataPoint: computed('validTimeseries', function() {
    return _.last(this.get('validTimeseries')) || {};
  }),
  yearRange: computed('validTimeseries', function() {
    var firstYear = get(this.get('firstDataPoint'), 'year');
    var lastYear = get(this.get('lastDataPoint'), 'year');
    return `${firstYear}–${lastYear}`;
  }),
  lastPop: computed('validTimeseries','locale', function() {
    let pop = get(this.get('lastDataPoint'), 'population');
    return numeral(pop).format('0.0a');
   }),
  lastGdp: computed('validTimeseries','locale', function() {
    let gdp = get(this.get('lastDataPoint'), 'gdp_nominal');
    return numeral(gdp).format('$ 0.0a');
   }),
  lastGdpPerCapita: computed('validTimeseries','locale', function() {
    let gdpPC = get(this.get('lastDataPoint'), 'gdp_pc_nominal');
    return numeral(gdpPC).format('$ 0.0a');
   }),
  gdpGrowth:computed('validTimeseries', function() {
    var firstGdp = get(this.get('firstDataPoint'), 'gdp_nominal');
    var lastGdp = get(this.get('lastDataPoint'), 'gdp_nominal');
    let difference = lastGdp / firstGdp;
    let power =  1/(this.get('validTimeseries.length') -1);
    return numeral(Math.pow(difference, power) -1).format('0.0%');
  }),
  activeStep: 1,
  stepStories: computed(function() {
    return [ { index: 1 }, { index: 2 }, { index: 3 }, { index: 4 } ];
  }),
  actions: {
    back: function() {
      if(this.get('activeStep') > 1) {
        this.decrementProperty('activeStep');
      }
    },
    forward: function() {
      if(this.get('activeStep') < this.get('stepStories').length) {
        this.incrementProperty('activeStep');
      }
    }
 }
});

