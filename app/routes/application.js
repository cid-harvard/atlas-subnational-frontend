import Ember from 'ember';
const {RSVP} = Ember;

export default Ember.Route.extend({
  model: function() {
    var productsMetadata = Ember.$.getJSON('metadata/products');
    var locationsMetadata = Ember.$.getJSON('metadata/locations');
    var locationsHierarchy = Ember.$.getJSON('metadata/products/hierarchy?from_level=4digit&to_level=section');

    return RSVP.allSettled([productsMetadata, locationsMetadata, locationsHierarchy]).then(function(array) {
      let productsMetadata = array[0].value.data;
      let locationsMetadata = array[1].value.data;
      let productMap = array[2].value.data;
      _.forEach(productsMetadata, function(d) {
        d.parent = d.product_id;
        d.group = productMap[d.product_id];
      });
      return { products: productsMetadata, locations: locationsMetadata };
    });
  },
  actions: {
    rerender: function() {
      this.refresh();
    }
  }
});
