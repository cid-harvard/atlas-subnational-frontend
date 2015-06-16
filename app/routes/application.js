import Ember from 'ember';
const {RSVP} = Ember;

export default Ember.Route.extend({
  model: function() {
    var url = 'http://52.6.95.239/api/';

    var productsMetadata = Ember.$.getJSON(url+'metadata/products/');
    var locationsMetadata = Ember.$.getJSON(url+'metadata/locations/');
    var productsHierarchy = Ember.$.getJSON(url+'metadata/products/hierarchy?from_level=4digit&to_level=section');
    var industiesMetadata = Ember.$.getJSON(url+'metadata/industries');

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
