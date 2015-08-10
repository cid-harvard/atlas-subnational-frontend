import Ember from 'ember';
import ENV from '../config/environment';
import ProductSectionColor from '../fixtures/product_section_colors';
import IndustrySectionColor from '../fixtures/industry_section_colors';
const {RSVP} = Ember;
const {apiURL} = ENV;

export default Ember.Route.extend({
  model: function() {

    var products4digit = Ember.$.getJSON(apiURL+'/metadata/products?level=4digit');
    var productsSection= Ember.$.getJSON(apiURL+'/metadata/products?level=section');
    var locationsMetadata = Ember.$.getJSON(apiURL+'/metadata/locations/');
    var productsHierarchy = Ember.$.getJSON(apiURL+'/metadata/products/hierarchy?from_level=4digit&to_level=section');
    var industriesClass = Ember.$.getJSON(apiURL+'/metadata/industries?level=class');
    var industriesSection = Ember.$.getJSON(apiURL+'/metadata/industries?level=section');
    var industriesHierarchy = Ember.$.getJSON(apiURL+'/metadata/industries/hierarchy?from_level=4digit&to_level=section');

    var promises = [
       products4digit,
       locationsMetadata,
       productsHierarchy,
       industriesClass,
       industriesHierarchy,
       productsSection,
       industriesSection
    ];

    return RSVP.allSettled(promises).then(function(array) {
      let productsMetadata = array[0].value.data;
      let locationsMetadata = array[1].value.data;
      let productsHierarchy = array[2].value.data;
      let industriesMetadata = array[3].value.data;
      let industriesHierarchy = array[4].value.data;
      let productSection = array[5].value.data;
      let industrySection = array[6].value.data;

      // Finds the entity with the `1st digit` that matches
      // sets `group` to the `1st digit code`
      // `group_name` to the name of the entity

      _.forEach(productsMetadata, function(d) {
        let sectionId= productsHierarchy[d.id];
        let color = ProductSectionColor[sectionId].color;
        let product = _.find(productSection, {id:  sectionId});
        d.color = color;
        d.group = sectionId;
        d.group_name_en = product.name_en;
        d.group_name_es = product.name_es;
      });

      _.forEach(industriesMetadata, function(d) {
        let sectionId = industriesHierarchy[d.id];
        let color = IndustrySectionColor[sectionId].color;
        let industry = _.find(industrySection, { id: sectionId });
        d.group = sectionId;
        d.color = color;
        d.group_name_en = industry.name_en;
        d.group_name_en = industry.name_es;
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
    rerender: function() {
      this.refresh();
    }
  }
});
