import Ember from 'ember';
import ENV from '../../config/environment';

const {apiURL} = ENV;
const {RSVP, computed, $, set, get:get} = Ember;

export default Ember.Route.extend({
  i18n: Ember.inject.service(),
  firstYear: computed.alias('i18n.firstYear'),
  lastYear: computed.alias('i18n.lastYear'),

  queryParams: {
    startDate: { refreshModel: false },
    endDate: { refreshModel: false },
    search: { refreshModel: false }
  },
  controllerName: 'visualization',
  renderTemplate() {
    this.render('visualization');
  },
  model(params) {
    let {location_id, visualization_type, source_type, variable} = params;
    set(this, 'location_id', location_id);
    set(this, 'source_type', source_type);
    set(this, 'visualization_type', visualization_type);
    set(this, 'variable', variable);

    return RSVP.hash(this.get(source_type)).then((hash) => {
      if(source_type === 'industries') {
        return this.industryDataMunging(hash);
      } else if (source_type === 'products') {
        return this.productsDataMunging(hash);
      } else if (source_type === 'partners') {
        return this.partnersDataMunging(hash);
      }
    });
  },
  afterModel(graphbuilderModel) {
    return graphbuilderModel.setProperties({
      entity_type:'location',
      visualization: get(this, 'visualization_type'),
      source: get(this, 'source_type'),
      metaData: this.modelFor('application'),
      variable: get(this, 'variable')
    });
  },
  industries: computed('location_id', function() {
    let id = get(this, 'location_id');
    return {
      model: this.store.find('location', id),
      industries:  $.getJSON(`${apiURL}/data/location/${id}/industries?level=class`),
      industriesComplexity: $.getJSON(`${apiURL}/data/industry?level=class`)
    };
  }),
  products: computed('location_id', function() {
    let id = get(this, 'location_id');
    return {
      model: this.store.find('location', id),
      products: $.getJSON(`${apiURL}/data/location/${id}/products?level=4digit`),
      productsComplexity: $.getJSON(`${apiURL}/data/product?level=4digit`)
    };
  }),
  partners: computed('location_id', function() {
    let id = get(this, 'location_id');
    return {
      model: this.store.find('location', id),
      partners: $.getJSON(`${apiURL}/data/location/${id}/partners/?level=country`)
    };
  }),
  partnersDataMunging(hash) {
    let {model, partners} = hash;
    let partnersMetadata = this.modelFor('application').partnerCountries;
    let data = _.map(partners.data, (d) => {
      let country = partnersMetadata[d.country_id];
      let parent = partnersMetadata[country.parent_id];
      d.parent_name_en = parent.name_en;
      d.parent_name_es = parent.name_es;
      d.group = parent.id;
      return _.merge(d, country);
    });

    return Ember.Object.create({
      entity: model,
      data: data,
    });
  },
  industryDataMunging(hash) {
    let {model, industries, industriesComplexity} = hash;
    let industriesMetadata = this.modelFor('application').industries;
    let complexityMap = _.indexBy(industriesComplexity.data, function(d){
      return d.year + '_'+ d.industry_id;
    });

    let data = _.map(industries.data, (d) => {
      let industry = industriesMetadata[d.industry_id];
      let complexity = complexityMap[ `${d.year}_${d.industry_id}`];
      d.complexity = complexity.complexity;
      return _.merge(d, industry, { avg_wage: d.wages/d.employment});
    });

    return Ember.Object.create({
      entity: model,
      data: data,
    });
  },
  productsDataMunging(hash) {
    let {model, products, productsComplexity} = hash;
    let productsMetadata = this.modelFor('application').products;
    let complexityMap = _.indexBy(productsComplexity.data, function(d){
      return `${d.year}_${d.product_id}`;
    });

    let data = _.map(products.data, (d) => {
      let product = productsMetadata[d.product_id];
      let complexity = complexityMap[ `${d.year}_${d.product_id}`];
      d.complexity = complexity.pci;
      return _.merge(d, product, { avg_wage: d.wages/d.employment});
    });

    return Ember.Object.create({
      entity: model,
      data: data,
    });
  },
  setupController(controller, model) {
    this._super(controller, model);
    controller.set('drawerChangeGraphIsOpen', false); // Turn off other drawers
    controller.set('drawerQuestionsIsOpen', false); // Turn off other drawers
    controller.set('searchText', controller.get('search'));
    window.scrollTo(0, 0);
  },
  resetController(controller, isExiting) {
    if (isExiting) {
      controller.setProperties({
        startDate: this.get('firstYear'),
        endDate: this.get('lastYear')
      });
    }
  }
});

