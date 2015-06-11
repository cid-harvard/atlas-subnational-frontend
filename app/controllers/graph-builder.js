import Ember from 'ember';
const {computed} = Ember;

export default Ember.Controller.extend({
  needs: 'application',
  queryParams: ['entity', 'entity_id'],
  isEnglish: Ember.computed.alias("controllers.application.isEnglish"),
  productsMetadata: Ember.computed.alias("controllers.application.productsMetadata"),
  locationsMetadata: Ember.computed.alias("controllers.application.locationsMetadata"),
  productsData: computed('model.productsData', function() {
    let products = this.get('model.productsData');
    let productsMetadata = this.get('productsMetadata');

    _.each(products, function(d) {
      let product = _.find(productsMetadata, { id: d.product_id});
      let parentProduct =  _.find(productsMetadata, { id: product.parent_id });
      d.name = product.name_en;
      d.level = product.level;
      d.parent_id = parentProduct.id;
      d.parent_name = parentProduct.name_en;
      d.parent_code = parentProduct.code;
      d.code = product.code;
    });
    return products;
  }),
  foo: Ember.observer('queryParams.entity_id', function() {
         console.log(this.get('queryParams.entity_id'));
       }),
  departmentLocations: computed('locationsMetadata', function(){
    return _.filter(this.get('locationsMetadata'), 'level', 'department');
  })
});

