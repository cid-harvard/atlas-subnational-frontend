import DS from 'ember-data';
import Ember from 'ember';
import ENV from '../config/environment';
import ModelAttribute from '../mixins/model-attribute';
const {apiURL} = ENV;
const {attr} = DS;
const {computed, $} = Ember;

export default DS.Model.extend(ModelAttribute, {
  //data that drives the profile
  productsData: attr(),
  industriesData: attr(),
  departments: attr(),
  timeseries: attr(),

  //following drives graphbuilder
  graphbuilderProducts: computed('id', function() {
    var defaultParams = {
      treemap: { variable: 'export_value', startDate: 2013, endDate: 2013 },
      multiples: { variable: 'export_value', startDate: 2013, endDate: 2013 },
      scatter: { variable: null,  startDate: 2013, endDate: 2013 },
      similarity: { variable: null,  startDate: 2013, endDate: 2013 }
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
      treemap: { variable: 'wages', startDate: 2013, endDate: 2013 },
      multiples: { variable: 'wages', startDate: 2013, endDate: 2013 },
      scatter: { variable: null,  startDate: 2013, endDate: 2013 },
      similarity: { variable: 'rca',  startDate: 2013, endDate: 2013 }
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
