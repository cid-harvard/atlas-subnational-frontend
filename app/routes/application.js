import Ember from 'ember';
import ENV from '../config/environment';
import ProductSectionColor from '../fixtures/product_section_colors';
import IndustrySectionColor from '../fixtures/industry_section_colors';

import numeral from 'numeral';

const {RSVP, get:get, set:set} = Ember;
const {apiURL} = ENV;

export default Ember.Route.extend({
  i18n: Ember.inject.service(),
  queryParams: {
    locale: { refreshModel: false }
  },
  beforeModel: function(transition) {
    let locale = get(transition, 'queryParams.locale');
    if(! _.contains(this.get('i18n.locales'), locale)) {
      set(transition, 'queryParams.locale', this.get('i18n.defaultLocale'));
    }
  },
  model: function() {
    var products4digit = Ember.$.getJSON(apiURL+'/metadata/products?level=4digit');
    var locationsMetadata = Ember.$.getJSON(apiURL+'/metadata/locations/');
    var productsHierarchy = Ember.$.getJSON(apiURL+'/metadata/products/hierarchy?from_level=4digit&to_level=section');
    var industriesClass = Ember.$.getJSON(apiURL+'/metadata/industries?level=class');
    var industriesHierarchy = Ember.$.getJSON(apiURL+'/metadata/industries/hierarchy?from_level=4digit&to_level=section');
    var productParentMetadata = Ember.$.getJSON(apiURL+'/metadata/products/?level=section');
    var industryParentMetadata = Ember.$.getJSON(apiURL+'/metadata/industries/?level=section');
    var occupationsMetadata = Ember.$.getJSON(apiURL+'/metadata/occupations/');

    var promises = [
      products4digit,
      locationsMetadata,
      productsHierarchy,
      industriesClass,
      industriesHierarchy,
      productParentMetadata,
      industryParentMetadata,
      occupationsMetadata,
    ];

    return RSVP.allSettled(promises).then(function(array) {
      let productsMetadata = array[0].value.data;
      let locationsMetadata = array[1].value.data;
      let productsHierarchy = array[2].value.data;
      let industriesMetadata = array[3].value.data;
      let industriesHierarchy = array[4].value.data;
      let productParentMetadata = array[5].value.data;
      let industryParentMetadata = array[6].value.data;
      let occupationsMetadata = array[7].value.data;

      // Finds the entity with the `1st digit` that matches
      // sets `group` to the `1st digit code`
      // `group_name` to the name of the entity

      var productSectionMap = _.indexBy(productParentMetadata, 'id');
      var industrySectionMap = _.indexBy(industryParentMetadata, 'id');

      var occupationMap = _.indexBy(occupationsMetadata, 'id');

      _.forEach(locationsMetadata, function(d) {
        let color = '#d7cbf2';

        d.group = d.id;
        d.color = color;
      });

      _.forEach(productsMetadata, function(d) {
        let sectionId = productsHierarchy[d.id];
        let section = productSectionMap[sectionId];
        let color = _.isUndefined(sectionId) ? '#fff' : ProductSectionColor[sectionId].color;

        d.color = color;
        d.parent_name_en = section.name_en;
        d.parent_name_es = section.name_es;
        d.group = sectionId;
      });

      _.forEach(occupationsMetadata, function(d) {
        let parent = d.parent_id ? occupationMap[d.parent_id] : d;
        let color = '#ccafaf';

        d.group = get(d,'code').split('-')[0];
        d.parent_name_en = get(parent, 'name_en');
        d.parent_name_es = get(parent, 'name_es');
        d.color = color;
      });

      _.forEach(industriesMetadata, function(d) {
        let sectionId = industriesHierarchy[d.id];
        let section = industrySectionMap[sectionId];
        let color = _.isUndefined(sectionId) ? '#fff' : IndustrySectionColor[sectionId].color ;

        d.group = sectionId;
        d.parent_name_en = section.name_en;
        d.parent_name_es = section.name_es;
        d.color = color;
      });

      // Index metadata by entity id's
      // e.g. { 0: {id:0, name: 'Atlantico'.....}, ...}
      return {
        products: _.indexBy(productsMetadata, 'id'),
        locations: _.indexBy(locationsMetadata, 'id'),
        industries: _.indexBy(industriesMetadata, 'id'),
        occupations: _.indexBy(occupationsMetadata, 'id'),
        productParents: _.indexBy(productParentMetadata, 'id'),
        industryParents: _.indexBy(industryParentMetadata, 'id')
      };
    });
  },
  setupController(controller, model) {
    this._super(controller, model);
    var localeParam = get(controller, 'locale');

    if(localeParam === controller.get('i18n.otherLocale')){
      set(controller, 'locale', get(this, 'i18n.otherLocale'));
      set(controller, 'isDefaultLocale', false);
    } else if(localeParam === 'no-copy'){
      set(this, 'i18n.locale', 'no-copy');
    } else {
      set(controller, 'locale', get(this, 'i18n.defaultLocale'));
      set(controller, 'isDefaultLocale', true);
    }

    set(this, 'i18n.locale', get(controller, 'locale'));
    set(this, 'i18n.display', get(controller, 'locale').split('-')[0]);
    numeral.language(localeParam);
  },
  actions: {
    willTransition: function(transition) {
      if(transition.targetName != 'search') {
        this.controller.set('query', null);
      }
    },
    query: function(query) {
      if(query) {
        this.transitionTo('search', { queryParams: { query: query }});
      } else {
        this.transitionTo('search', { queryParams: { query: null }});
      }
    }
  }
});
