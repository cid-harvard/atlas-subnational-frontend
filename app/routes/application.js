import Ember from 'ember';
import ENV from '../config/environment';

import numeral from 'numeral';

const {RSVP, $, get:get, set:set} = Ember;
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
    var products4digit = $.getJSON(apiURL+'/metadata/products?level=4digit');
    var locationsMetadata = $.getJSON(apiURL+'/metadata/locations/');
    var productsHierarchy = $.getJSON(apiURL+'/metadata/products/hierarchy?from_level=4digit&to_level=section');
    var industriesClass = $.getJSON(apiURL+'/metadata/industries?level=class');
    var industriesHierarchy = $.getJSON(apiURL+'/metadata/industries/hierarchy?from_level=4digit&to_level=section');
    var productParentMetadata = $.getJSON(apiURL+'/metadata/products/?level=section');
    var industryParentMetadata = $.getJSON(apiURL+'/metadata/industries/?level=section');
    var occupationsMetadata = $.getJSON(apiURL+'/metadata/occupations/');
    var productSectionColor = $.getJSON('assets/color_mappings/product_section_colors.json');
    var industrySectionColor = $.getJSON(`assets/color_mappings/${this.get('i18n.country')}-industry_section_colors.json`);

    var promises = [
      products4digit,
      locationsMetadata,
      productsHierarchy,
      industriesClass,
      industriesHierarchy,
      productParentMetadata,
      industryParentMetadata,
      occupationsMetadata,
      productSectionColor,
      industrySectionColor
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
      let productSectionColor = array[8].value;
      let industrySectionColor = array[9].value;

      // Finds the entity with the `1st digit` that matches
      // sets `group` to the `1st digit code`
      // `group_name` to the name of the entity

      var productSectionMap = _.indexBy(productParentMetadata, 'id');
      var industrySectionMap = _.indexBy(industryParentMetadata, 'id');

      _.forEach(locationsMetadata, function(d) {
        let color = '#d7cbf2';

        d.group = d.id;
        d.color = color;
      });

      _.forEach(productsMetadata, function(d) {
        let sectionId = productsHierarchy[d.id];
        let color = _.isUndefined(sectionId) ? '#fff' : _.get(productSectionColor, `${sectionId}.color`);

        d.color = color;
        d.parent_name_en = _.get(productSectionMap, `${sectionId}.name_en`);
        d.parent_name_es = _.get(productSectionMap, `${sectionId}.name_es`);
        d.group = sectionId;
      });

      _.forEach(occupationsMetadata, function(d) {
        let color = '#ccafaf';

        d.group = get(d,'code').split('-')[0];
        d.parent_name_en = get(d, 'name_en');
        d.parent_name_es = get(d, 'name_es');
        d.color = color;
      });

      _.forEach(industriesMetadata, function(d) {
        let sectionId = industriesHierarchy[d.id];
        let color = _.isUndefined(sectionId) ? '#fff' : _.get(industrySectionColor, `${sectionId}.color`);

        d.group = sectionId;
        d.parent_name_en = _.get(industrySectionMap, `${sectionId}.name_en`);
        d.parent_name_es = _.get(industrySectionMap, `${sectionId}.name_es`);
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
        this.transitionTo('search', { queryParams: { query: query, filter: null }});
      } else {
        this.transitionTo('search', { queryParams: { query: null, filter: null }});
      }
    }
  }
});
