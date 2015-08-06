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
      treemap: { variable: 'export_value', startDate: 2007, endDate: 2013 },
      multiples: { variable: 'export_value', startDate: 2007, endDate: 2013 },
      scatter: { variable: null,  startDate: 2013, endDate: 2013 },
      similarity: { variable: null,  startDate: 2013, endDate: 2013 }
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
      scatter: { variable: null,  startDate: 2013, endDate: 2013 },
      similarity: { variable: 'rca',  startDate: 2013, endDate: 2013 }
    };
    return $.getJSON(`${apiURL}/data/location/${this.get('id')}/industries?level=class`)
      .then((response) => {
        let industriesMetadata = this.get('metaData.industries');
        let data = response.data;

        data = _.map(data, (d) => {
          let industry = industriesMetadata[d.industry_id];
          return _.merge(d, industry, { avg_wage: d.wages/d.employment});
        });

       return { entity: this, entity_type:'location', data: data, source: 'industries',  defaultParams: defaultParams};
      }, (error) => {
       return { error: error, entity: this, entity_type:'location', data: [], source: 'industries', defaultParams:defaultParams};
      });
  })
});
