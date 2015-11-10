import DS from 'ember-data';
import Ember from 'ember';
import ENV from '../config/environment';
import ModelAttribute from '../mixins/model-attribute';
import numeral from 'numeral';
const {apiURL} = ENV;
const {attr} = DS;
const {computed, $, get:get} = Ember;

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
    return _.select(this.get('timeseries'), { year: this.get('censusYear')})[0] || {};
  }),
  yearRange: computed('timeseries', function() {
    var firstYear = get(this.get('firstDataPoint'), 'year');
    var lastYear = get(this.get('lastDataPoint'), 'year');
    return `${firstYear}–${lastYear}`;
  }),
  lastPop: computed('timeseries','locale', function() {
    let pop = get(this.get('lastDataPoint'), 'population');
    return numeral(pop).format('0.00a');
   }),
  lastEci: computed('timeseries','locale', function() {
    let eci = get(this.get('lastDataPoint'), 'eci');
    return numeral(eci).format('0.0');
   }),
  lastGdp: computed('timeseries','locale', function() {
    let gdp = get(this.get('lastDataPoint'), 'gdp_real') || get(this.get('lastDataPoint'), 'gdp_nominal');
    return numeral(gdp).format('$ 0.00a');
   }),
  lastGdpPerCapita: computed('timeseries','locale', function() {
    let gdpPC = get(this.get('lastDataPoint'), 'gdp_pc_real') ||  get(this.get('lastDataPoint'), 'gdp_pc_nominal');
    return numeral(gdpPC).format('$ 0.00a');
   }),
  gdpGrowth:computed('timeseries','locale', function() {
    var firstGdp = get(this.get('firstDataPoint'), 'gdp_real');
    var lastGdp = get(this.get('lastDataPoint'), 'gdp_real');
    let difference = lastGdp / firstGdp;
    let power =  1/(this.get('timeseries.length') -1);
    if(difference && power) {
      return numeral(Math.pow(difference, power) -1).format('0.0%');
     }
    return false;
  }),
  //following drives graphbuilder
  graphbuilderPartners: computed('id', function() {
    var defaultParams = {
      treemap: { variable: 'export_value', startDate: this.get('lastYear'), endDate: this.get('lastYear') },
      multiples: { variable: 'export_value', startDate: this.get('firstYear'), endDate: this.get('lastYear') },
      scatter: { variable: null,  startDate: this.get('lastYear'), endDate: this.get('lastYear') },
      similarity: { variable: null,  startDate: this.get('lastYear'), endDate: this.get('lastYear') }
    };
    let partners = $.getJSON(`${apiURL}/data/location/${this.get('id')}/partners/?level=country`);

    return partners.then((response) => {
      let {data} = response;
      let partnersMetadata = this.get('metaData.partnerCountries');
      data = _.map(data, (d) => {
        let country = partnersMetadata[d.country_id];
        let parent = partnersMetadata[country.parent_id];

        d = _.merge(d, country);
        d.group = country.parent_id;
        d.parent_name_en = parent.name_en;
        d.parent_name_es = parent.name_es;
        d.name_short_en = d.name_en;
        d.name_short_es = d.name_es;
        return d;
      });
      return { entity: this, entity_type:'location', data: data, source: 'partners', defaultParams:defaultParams };
    });

  }),
  graphbuilderProducts: computed('id', function() {
    var defaultParams = {
      treemap: { variable: 'export_value', startDate: this.get('lastYear'), endDate: this.get('lastYear') },
      multiples: { variable: 'export_value', startDate: this.get('firstYear'), endDate: this.get('lastYear') },
      scatter: { variable: null,  startDate: this.get('lastYear'), endDate: this.get('lastYear') },
      similarity: { variable: null,  startDate: this.get('lastYear'), endDate: this.get('lastYear') }
    };
    let products  = $.getJSON(`${apiURL}/data/location/${this.get('id')}/products?level=4digit`);
    let productComplexity = $.getJSON(`${apiURL}/data/product?level=4digit`);
    return Ember.RSVP.all([products, productComplexity])
      .then((response) => {
        let productsMetadata = this.get('metaData.products');

        let products = response[0].data;
        let productComplexity = _.indexBy(response[1].data, function(d){ return d.year + '_'+ d.product_id; });

        let visualizationData = _.map(products, (d) => {
          let product = productsMetadata[d.product_id];
          let complexity = productComplexity[ `${d.year}_${d.product_id}`];
          if(complexity) {
            d.complexity = complexity.pci;
          }
          return _.merge(d, product);
        });
        return { entity: this, entity_type:'location', data: visualizationData, source: 'products', defaultParams:defaultParams };
      }, (error) => {
        return { error: error, entity: this, entity_type:'location', data: [], source: 'products', defaultParams:defaultParams};
      });
  }),
  graphbuilderIndustries: computed('id', function() {
    var defaultParams = {
      treemap: { variable: 'wages', startDate: this.get('lastYear'), endDate: this.get('lastYear') },
      multiples: { variable: 'wages', startDate: this.get('firstYear'), endDate: this.get('lastYear') },
      scatter: { variable: null,  startDate: this.get('lastYear'), endDate: this.get('lastYear') },
      similarity: { variable: 'rca',  startDate: this.get('lastYear'), endDate: this.get('lastYear') }
    };
    let industry = $.getJSON(`${apiURL}/data/location/${this.get('id')}/industries?level=class`);
    let industryComplexity = $.getJSON(`${apiURL}/data/industry?level=class`);
    return Ember.RSVP.all([industry, industryComplexity])
      .then((response) => {
        let industriesMetadata = this.get('metaData.industries');

        let data = response[0].data;
        let industryComplexity = _.indexBy(response[1].data, function(d){ return d.year + '_'+ d.industry_id; });

        data = _.map(data, (d) => {
          let industry = industriesMetadata[d.industry_id];
          let complexity = industryComplexity[ `${d.year}_${d.industry_id}`];
          d.complexity = complexity.complexity;
          return _.merge(d, industry, { avg_wage: d.wages/d.employment});
        });

       return { entity: this, entity_type:'location', data: data, source: 'industries',  defaultParams: defaultParams};
      }, (error) => {
       return { error: error, entity: this, entity_type:'location', data: [], source: 'industries', defaultParams:defaultParams};
      });
  })
});
