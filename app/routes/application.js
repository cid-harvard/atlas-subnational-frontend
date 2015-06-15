import Ember from 'ember';
const {RSVP} = Ember;

export default Ember.Route.extend({
  model: function() {
    var productsMetadata = Ember.$.getJSON('metadata/products/');
    var locationsMetadata = Ember.$.getJSON('metadata/locations/');
    var industiesMetadata = Ember.$.getJSON('metadata/industries');
    var productsHierarchy = Ember.$.getJSON('metadata/products/hierarchy?from_level=4digit&to_level=section');
    var promises = [productsMetadata, locationsMetadata, productsHierarchy, industiesMetadata];

    return RSVP.allSettled(promises).then(function(array) {
      let productsMetadata = array[0].value.data;
      let locationsMetadata = array[1].value.data;
      let productMap = array[2].value.data;
      let industiesMetadata = array[3].value.data;

      _.forEach(productsMetadata, function(d) {
        d.group = productMap[d.product_id];
      });

      return { products: productsMetadata, locations: locationsMetadata, industries: industiesMetadata };
    });
  },
  actions: {
    rerender: function() {
      this.refresh();
    }
  }
});
