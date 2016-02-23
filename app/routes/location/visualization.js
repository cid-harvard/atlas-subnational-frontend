import Ember from 'ember';
import ENV from '../../config/environment';

const {apiURL} = ENV;
const {RSVP, computed, $, set, get, copy} = Ember;

export default Ember.Route.extend({
  featureToggle: Ember.inject.service(),

  firstYear: computed.alias('featureToggle.first_year'),
  lastYear: computed.alias('featureToggle.last_year'),

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
      industries:  $.getJSON(`${apiURL}/data/location/${id}/industries?level=class`)
    };
  }),
  products: computed('location_id', function() {
    let id = get(this, 'location_id');
    return {
      model: this.store.find('location', id),
      products: $.getJSON(`${apiURL}/data/location/${id}/products?level=4digit`)
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
      return _.merge(copy(d), country);
    });

    return Ember.Object.create({
      entity: model,
      data: Ember.A(data)
    });
  },
  industryDataMunging(hash) {
    let { model, industries } = hash;
    let industriesMetadata = this.modelFor('application').industries;

    let data = _.map(industries.data, (d) => {
      let industry = industriesMetadata[d.industry_id];
      if(model.id === '0') { d.rca = 1; }
      industry.complexity = _.result(_.find(industry.pci_data, { year: d.year}), 'complexity');
      return _.merge(copy(d), industry, { avg_wage: d.wages/d.employment});
    });

    return Ember.Object.create({
      entity: model,
      data: Ember.A(data)
    });
  },
  productsDataMunging(hash) {
    let {model, products } = hash;
    let productsMetadata = this.modelFor('application').products;

    let data = _.map(products.data, (d) => {
      let product = productsMetadata[d.product_id];
      d.complexity = _.result(_.find(product.pci_data, { year: d.year }), 'pci');
      return _.merge(copy(d), product, { avg_wage: d.wages/d.employment});
    });

    return Ember.Object.create({
      entity: model,
      data: Ember.A(data)
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

