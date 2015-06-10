import Ember from 'ember';
const {computed} = Ember;

export default Ember.Controller.extend({
  needs: 'application',
  isEnglish: Ember.computed.alias("controllers.application.isEnglish"),
  productsMetadata: Ember.computed.alias("controllers.application.productsMetadata"),
  locationsMetadata: Ember.computed.alias("controllers.application.locationsMetadata"),
  departmentsData: computed('model.departments', function() {
    let departments = this.model.get('departments');
    let locationsMetaData = this.get('locationsMetadata');

    _.each(departments, function(d) {
      d.name = _.find(locationsMetaData, {id: d.department_id}).name_en;
    })

    return departments;
  }),
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
  productsSortedByExports: computed('productsData', function() {
    return _.slice(_.sortBy(this.get('productsData'), function(d) { return -d.export_value;}), 0, 50);
  }),
  name: computed('isEnglish',function() {
    if(!this.model.get('name_es')) { return this.model.get('name_en');};

    if(this.get('isEnglish')) {
      return this.model.get('name_en');
    } else {
      return this.model.get('name_es');
    }
  }),
  activeStep: 0,
  stepStories: computed(function() {
    return [ { index: 0 }, { index: 1 }, { index: 2 }, { index: 3 } ];
  }),
  actions: {
    back: function() {
      if(this.get('activeStep') > 0) {
        this.decrementProperty('activeStep');
      }
    },
    forward: function() {
      if(this.get('activeStep') < this.get('stepStories').length - 1) {
        this.incrementProperty('activeStep');
      }
    }
 }
});

