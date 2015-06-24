import Ember from 'ember';
import ENV from '../config/environment';
const {RSVP} = Ember;
const {apiURL} = ENV;

export default Ember.Route.extend({
  model: function() {

    var productsMetadata = Ember.$.getJSON(apiURL+'metadata/products/');
    var locationsMetadata = Ember.$.getJSON(apiURL+'metadata/locations/');
    var productsHierarchy = Ember.$.getJSON(apiURL+'metadata/products/hierarchy?from_level=4digit&to_level=section');
    var industriesMetadata = Ember.$.getJSON(apiURL+'metadata/industries');
    var industriesHierarchy = Ember.$.getJSON(apiURL+'metadata/industries/hierarchy?from_level=4digit&to_level=section');
    var promises = [productsMetadata, locationsMetadata, productsHierarchy, industriesMetadata, industriesHierarchy];

    return RSVP.allSettled(promises).then(function(array) {
      let productsMetadata = array[0].value.data;
      let locationsMetadata = array[1].value.data;
      let productMap = array[2].value.data;
      let industriesMetadata = array[3].value.data;
      let industriesMap = array[4].value.data;

      _.forEach(productsMetadata, function(d) {
        let productId = productMap[d.id];
        if(productId){
          let product = _.find(productsMetadata, function(d) {
            return d.id === productId;
          });

          d.group = productId;
          d.group_name_en = product.name_en;
        } else {
          d.group = d.id;
          d.group_name_en = d.name_en;
        }
      });

      _.forEach(industriesMetadata, function(d) {
        let industryId = industriesMap[d.id];
        if(industryId){
          let industry = _.find(industriesMetadata, function(d) {
            return d.id === industryId;
          });

          d.group = industryId;
          d.group_name_en = industry.name_en;
        } else {
          d.group = d.id;
          d.group_name_en = d.name_en;
        }
      });

      return { products: productsMetadata, locations: locationsMetadata, industries: industriesMetadata };
    });
  },
  actions: {
    rerender: function() {
      this.refresh();
    }
  }
});
