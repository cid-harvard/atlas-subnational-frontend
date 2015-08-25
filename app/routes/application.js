import Ember from 'ember';
import ENV from '../config/environment';
import ProductSectionColor from '../fixtures/product_section_colors';
import IndustrySectionColor from '../fixtures/industry_section_colors';
const {RSVP} = Ember;
const {apiURL} = ENV;

export default Ember.Route.extend({
  model: function() {

    var products4digit = Ember.$.getJSON(apiURL+'/metadata/products?level=4digit');
    var locationsMetadata = Ember.$.getJSON(apiURL+'/metadata/locations/');
    var productsHierarchy = Ember.$.getJSON(apiURL+'/metadata/products/hierarchy?from_level=4digit&to_level=section');
    var industriesClass = Ember.$.getJSON(apiURL+'/metadata/industries');
    var industriesHierarchy = Ember.$.getJSON(apiURL+'/metadata/industries/hierarchy?from_level=4digit&to_level=section');
    var productSectionMetadata = Ember.$.getJSON(apiURL+'/metadata/products/?level=section');

    var promises = [
       products4digit,
       locationsMetadata,
       productsHierarchy,
       industriesClass,
       industriesHierarchy,
       productSectionMetadata
    ];

    return RSVP.allSettled(promises).then(function(array) {
      let productsMetadata = array[0].value.data;
      let locationsMetadata = array[1].value.data;
      let productsHierarchy = array[2].value.data;
      let industriesMetadata = array[3].value.data;
      let industriesHierarchy = array[4].value.data;
      let productSectionMetadata = array[5].value.data;

      // Finds the entity with the `1st digit` that matches
      // sets `group` to the `1st digit code`
      // `group_name` to the name of the entity

      var sectionMap = _.indexBy(productSectionMetadata, 'id');

      _.forEach(productsMetadata, function(d) {
        let sectionId= productsHierarchy[d.id];
        let section = sectionMap[sectionId];
        let color = ProductSectionColor[sectionId].color;

        d.color = color;
        d.parent_name_en = section.name_en;
        d.parent_name_es = section.name_es;
        d.group = sectionId;
      });

      _.forEach(industriesMetadata, function(d) {
        let sectionId = industriesHierarchy[d.id];
        let color = sectionId ? IndustrySectionColor[sectionId].color : '#fff';
        d.group = sectionId;
        d.color = color;
      });

      // Index metadata by entity id's
      // e.g. { 0: {id:0, name: 'Atlantico'.....}, ...}
      return {
        products: _.indexBy(productsMetadata, 'id'),
        locations: _.indexBy(locationsMetadata, 'id'),
        industries: _.indexBy(industriesMetadata, 'id')
      };
    });
  },
  actions: {
    willTransition: function(transition) {
      if(transition.targetName != 'search') {
        this.controller.set('query', null);
      }
    },
    query: function(query) {
      if(query) {
        if(query.length < 3) { return true;}
        this.transitionTo('search', { queryParams: { query: query }});
      } else {
        this.transitionTo('search', { queryParams: { query: null }});
      }
    }
  }
});
