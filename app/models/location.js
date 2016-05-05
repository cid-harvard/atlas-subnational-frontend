import DS from 'ember-data';
import Ember from 'ember';
import ModelAttribute from '../mixins/model-attribute';
import numeral from 'numeral';
const {attr} = DS;
const {computed, get:get} = Ember;

export default DS.Model.extend(ModelAttribute, {
  //data that drives the profile
  productsData: attr(),
  industriesData: attr(),
  departments: attr(),
  timeseries: attr(),
  metaData: attr(),
  yearSort: ['year'],

  sortedTimeseries: computed.sort('timeseries','yearSort'),

  firstDataPoint: computed('timeseries', function() {
    return _.first(this.get('timeseries')) || {};
  }),
  lastDataPoint: computed('timeseries', function() {
    return _.select(this.get('timeseries'), { year: this.get('lastYear')})[0] || {};
  }),
  lastEci: computed('timeseries','locale', function() {
    let eci = get(this.get('lastDataPoint'), 'eci');
    if (eci === undefined || eci === null){
       return "N/A";
    }
    return numeral(eci).format('0.00');
   }),
  firstCensusDataPoint: computed('timeseries', function() {
    return _.first(this.get('timeseries')) || {};
  }),
  lastCensusDataPoint: computed('timeseries', function() {
    return _.select(this.get('timeseries'), { year: this.get('censusYear')})[0] || {};
  }),
  lastPop: computed('timeseries','locale', function() {
    let pop = get(this.get('lastCensusDataPoint'), 'population');
    return numeral(pop).format('0.00a');
   }),
  lastGdp: computed('timeseries','locale', function() {
    let gdp = get(this.get('lastCensusDataPoint'), 'gdp_real') || get(this.get('lastCensusDataPoint'), 'gdp_nominal');
    return numeral(gdp).format('$ 0.00a');
   }),
  lastGdpPerCapita: computed('timeseries','locale', function() {
    let gdpPC = get(this.get('lastCensusDataPoint'), 'gdp_pc_real') ||  get(this.get('lastCensusDataPoint'), 'gdp_pc_nominal');
    return numeral(gdpPC).format('$ 0.00a');
   }),
  gdpGrowth:computed('timeseries','locale', function() {
    var firstGdp = get(this.get('firstCensusDataPoint'), 'gdp_real');
    var lastGdp = get(this.get('lastCensusDataPoint'), 'gdp_real');
    let difference = lastGdp / firstGdp;
    let power =  1/(this.get('timeseries.length') -1);
    if(difference && power) {
      return numeral(Math.pow(difference, power) -1).format('0.0%');
     }
    return false;
  })
});
