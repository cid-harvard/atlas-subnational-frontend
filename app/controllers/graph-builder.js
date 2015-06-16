import Ember from 'ember';
const {computed, observer} = Ember;

export default Ember.Controller.extend({
  needs: 'application',
  queryParams: ['entity', 'entity_id', 'data_source'],
  data_source: 'products',

  isEnglish: computed.alias('controllers.application.isEnglish'),
  productsMetadata: computed.alias('controllers.application.productsMetadata'),
  locationsMetadata: computed.alias('controllers.application.locationsMetadata'),
  industriesMetadata: computed.alias('controllers.application.industriesMetadata'),

  isProducts: computed('data_source', function() {
    return this.get('data_source') === 'products';
  }),
  isIndustries: computed('data_source', function() {
    return this.get('data_source') === 'industries';
  }),
  productsData: computed('model.productsData', function() {
    let products = this.get('model.productsData');
    let productsMetadata = this.get('productsMetadata');
    _.each(products, function(d) {
      let product = _.find(productsMetadata, { id: d.product_id});
      let parentProduct =  _.find(productsMetadata, { id: product.parent_id });
      d.name = product.name_en;
      d.level = product.level;
      d.code = product.code;
      d.parent_id = parentProduct.id;
      d.parent_name = parentProduct.name_en;
      d.parent_code = parentProduct.code;
    });
    return products;
  }),
  industriesData: computed('model.industriesData', function() {
    let industries = this.get('model.industriesData');
    let industriesMetadata = this.get('industriesMetadata');
    _.each(industries, function(d) {
      let industry = _.find(industriesMetadata, { id: d.industry_id });
      let parentIndustry =  _.find(industriesMetadata, { id: industry.parent_id});
      d.name = industry.name_en;
      d.code = industry.code;
      d.level = industry.level;
      d.parent_id = parentIndustry.id;
      d.parent_name = parentIndustry.name_en;
      d.parent_code = parentIndustry.code;
    });
    return industries;
  }),
  scatterPlot: computed('model.scatterPlot', function() {
    let industries = _.filter(this.get('industriesData'), {year: 2012});
    let scatterPlot = this.get('model.scatterPlot');
    _.each(scatterPlot, function(d) {
      let industry = _.find(industries, { industry_id: d.industry_id });
      d.name = industry.name;
      d.rca = industry.rca;
    });
    return scatterPlot;
  }),
  departmentLocations: computed('locationsMetadata', function(){
    return _.filter(this.get('locationsMetadata'), 'level', 'department');
  }),
  scrollTop: observer('data', function() {
    window.scrollTo(0,0);
  })
});


