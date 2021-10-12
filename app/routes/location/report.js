import Ember from 'ember';
import ENV from '../../config/environment';

const {apiURL} = ENV;

const {RSVP, computed, copy, get, $, set, getWithDefault} = Ember;

export default Ember.Route.extend({

  i18n: Ember.inject.service(),
  featureToggle: Ember.inject.service(),
  buildermodSearchService: Ember.inject.service(),
  firstYear: computed.alias('featureToggle.first_year'),
  lastYear: computed.alias('featureToggle.last_year'),

  queryParams: {
    startDate: { refreshModel: false },
    endDate: { refreshModel: false },
  },

  model(params) {

    let hash = {
      model: this.store.find('location', params.location_id),
      industries_col: $.getJSON(`${apiURL}/data/location/${params.location_id}/industries?level=class`),
      products_col: $.getJSON(`${apiURL}/data/location/${params.location_id}/products?level=4digit`),
      partners: $.getJSON(`${apiURL}/data/location/${params.location_id}/partners?level=country`),
    }

    return RSVP.hash(hash).then((hash) => {
      return this.departmentsDataMunging(hash);
    });

    //return this.store.find('product', params.product_id);
  },
  departmentsDataMunging(hash) {
    let {model, industries_col, products_col, partners} = hash;
    let industriesMetadata = this.modelFor('application').industries;
    let productsMetadata = this.modelFor('application').products;
    let partnersMetadata = this.modelFor('application').partnerCountries;

    let industries = _.map(industries_col.data, (d) => {
      let industry = industriesMetadata[d.industry_id];
      if(model.id === '0') { d.rca = 1; }
      industry.complexity = _.result(_.find(industry.pci_data, { year: d.year}), 'complexity');
      return _.merge(copy(d), industry, { avg_wage: d.wages/d.employment});
    });

    //get products data for the department
    let products = _.reduce(products_col.data, (memo, d) => {
      let product = productsMetadata[d.product_id];
      product.complexity = _.result(_.find(product.pci_data, { year: d.year }), 'pci');
      memo.push(_.merge(d, product));
      return memo;
    }, []);

    let allPartners = _.map(partners.data, (d) => {
      let country = partnersMetadata[d.country_id];
      let parent = partnersMetadata[country.parent_id];
      d.parent_name_en = parent.name_en;
      d.parent_name_es = parent.name_es;
      d.group = parent.id;

      return _.merge(copy(d), country);
    });

    return Ember.Object.create({
      entity: model,
      industries_col: industries,
      products_col: products,
      allPartners: allPartners,
      metaData: this.modelFor('application')
    });
  },
  setupController(controller, model) {
    //this.set('buildermodSearchService.search', null);
    this._super(controller, model);
    controller.set("startDate", this.get("lastYear"))
    controller.set("endDate", this.get("lastYear"))
    window.scrollTo(0, 0);
  },
  resetController(controller, isExiting) {

    if (isExiting) {
      controller.setProperties({
      });
    }
  }
});
