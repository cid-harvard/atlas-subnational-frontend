import Ember from 'ember';
import ENV from '../config/environment';

const {RSVP, $, get, set} = Ember;
const {apiURL} = ENV;

export default Ember.Route.extend({
  queryParams: {
    locale: { refreshModel: false }
  },
  beforeModel: function(transition) {
    let locale = get(transition, 'queryParams.locale');
    if(locale === 'no-copy') {
      set(this, 'i18n.locale', 'no-copy');
    } else if(! _.contains(this.get('i18n.locales'), locale)) {
      set(this, 'i18n.locale', get(this,'i18n.defaultLocale'));
      set(transition, 'queryParams.locale', get(this, 'i18n.defaultLocale'));
    } else {
      set(this, 'i18n.locale', locale);
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
    var partnerCountries = $.getJSON(apiURL+'/metadata/countries/');
    var productPCI = $.getJSON(apiURL+'/data/product/?level=4digit');
    var industryPCI = $.getJSON(apiURL+'/data/industry/?level=class');

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
      industrySectionColor,
      partnerCountries,
      productPCI,
      industryPCI
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
      let partnerCountries  = array[10].value.data;
      let productPCI = array[11].value.data;
      let industryPCI = array[12].value.data;

      // Finds the entity with the `1st digit` that matches
      // sets `group` to the `1st digit code`
      // `group_name` to the name of the entity

      var productSectionMap = _.indexBy(productParentMetadata, 'id');

      var industrySectionMap = _.indexBy(industryParentMetadata, 'id');

      productPCI = _.groupBy(productPCI, 'product_id');
      industryPCI= _.groupBy(industryPCI, 'industry_id');

      _.forEach(locationsMetadata, (d) => {
        let color = '#d7cbf2';

        d.group = d.id;
        d.color = color;
      });

      _.forEach(productsMetadata, (d) => {
        let sectionId = productsHierarchy[d.id];
        let color = _.isUndefined(sectionId) ? '#fff' : get(productSectionColor, `${sectionId}.color`);

        d.color = color;

        set(productSectionMap, `${sectionId}.color`, color);

        d.pci_data = get(productPCI, `${d.id}`);
        d.parent_name_en = get(productSectionMap, `${sectionId}.name_en`);
        d.parent_name_es = get(productSectionMap, `${sectionId}.name_es`);
        d.group = get(productSectionMap, `${sectionId}.code`);

      });

      _.forEach(occupationsMetadata, (d) => {
        let color = '#ccafaf';

        d.group = get(d,'code').split('-')[0];
        d.parent_name_en = get(d, 'name_en');
        d.parent_name_es = get(d, 'name_es');
        d.color = color;
      });

      _.forEach(industriesMetadata, (d) => {
        let sectionId = industriesHierarchy[d.id];
        let color = _.isUndefined(sectionId) ? '#fff' :get(industrySectionColor, `${sectionId}.color`);

        d.pci_data = get(industryPCI, `${d.id}`);
        set(industrySectionMap, `${sectionId}.color`, color);

        d.group = get(industrySectionMap, `${sectionId}.code`);
        d.parent_name_en = get(industrySectionMap, `${sectionId}.name_en`);
        d.parent_name_es = get(industrySectionMap, `${sectionId}.name_es`);
        d.color = color;
      });

      _.forEach(partnerCountries, (d) => {
        let color = '#d7cbf2';
        d.name_short_en = d.name_en;
        d.name_short_es = d.name_es;
        d.color = color;
      });

      // Index metadata by entity id's
      // e.g. { 0: {id:0, name: 'Atlantico'.....}, ...}
      let legend = { products: productSectionMap, industries: industrySectionMap };
      return {
        products: _.indexBy(productsMetadata, 'id'),
        locations: _.indexBy(locationsMetadata, 'id'),
        industries: _.indexBy(industriesMetadata, 'id'),
        occupations: _.indexBy(occupationsMetadata, 'id'),
        productParents: _.indexBy(productParentMetadata, 'id'),
        industryParents: _.indexBy(industryParentMetadata, 'id'),
        partnerCountries: _.indexBy(partnerCountries, 'id'),
        legend: legend
      };
    });
  },
  setupController(controller, model) {
    this._super(controller, model);
    var localeParam = get(this, 'i18n.locale');
    if(localeParam === controller.get('i18n.defaultLocale')){
      set(controller, 'isDefaultLocale', true);
    } else if (localeParam === 'no-copy') {
      set(controller, 'isDefaultLocale', true);
    } else {
      set(controller, 'isDefaultLocale', false);
    }
  },
  actions: {
    willTransition(transition) {
      if(transition.targetName != 'search') {
        this.controller.set('query', null);
      }
    },
    query(query) {
      if(query) {
        this.transitionTo('search', { queryParams: { query: query, filter: null }});
      } else {
        this.transitionTo('search', { queryParams: { query: null, filter: null }});
      }
    }
  }
});
