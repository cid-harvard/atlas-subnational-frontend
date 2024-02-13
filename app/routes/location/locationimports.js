import Ember from 'ember';
import ENV from '../../config/environment';
import numeral from 'numeral';

const {apiURL} = ENV;
const {RSVP, computed, getWithDefault, get, copy} = Ember;

export default Ember.Route.extend({
// `this.store.find` makes an api call for `params.location_id` and returns a promise
// in the `then` function call, another API call is made to get the topExports data
  i18n: Ember.inject.service(),
  featureToggle: Ember.inject.service(),

  firstYear: computed.alias('featureToggle.first_year'),
  lastYear: computed.alias('featureToggle.last_year'),
  censusYear: computed.alias('featureToggle.census_year'),
  agproductLastYear: computed.alias('featureToggle.year_ranges.agproduct.last_year'),

  queryParams: {
    startDate: { refreshModel: false },
    endDate: { refreshModel: false },
  },

  model: function(params) {
    return this.store.find('location', params.location_id);
  },
  afterModel: function(model) {
    let level = model.get('level');
    level = level === 'country' ? 'department' : level;

    let subregion = get(this, `featureToggle.subregions.${model.get('level')}`);

    // TODO: maybe use ember data instead of ajax calls to decorate JSON objects with model functionality?
    // extract year out later
    var products = Ember.$.getJSON(`${apiURL}/data/location/${model.id}/products?level=4digit`);
    var partners = Ember.$.getJSON(`${apiURL}/data/location/${model.id}/partners/?level=country`)

    return RSVP.allSettled([products, partners]).then((array) => {
      var productsData = getWithDefault(array[0], 'value.data', []);
      var partnersData = getWithDefault(array[1], 'value.data', []);

      var productsDataIndex = _.indexBy(productsData, 'product_id');

      let productsMetadata = this.modelFor('application').products;
      let partnersMetadata = this.modelFor('application').partnerCountries;


      //get products data for the department
      let products = _.reduce(productsData, (memo, d) => {
        let product = productsMetadata[d.product_id];
        product.complexity = _.result(_.find(product.pci_data, { year: d.year }), 'pci');
        memo.push(_.merge(d, product));
        return memo;
      }, []);


      let allPartners = _.map(partnersData, (d) => {

        let country = partnersMetadata[d.country_id];
        let parent = partnersMetadata[country.parent_id];
        d.parent_name_en = parent.name_en;
        d.parent_name_es = parent.name_es;
        d.group = parent.id;

        return _.merge(copy(d), country);
      });

      model.set('productsData', products);
      model.set('allPartners', allPartners);

      return model;
    });
  },
  setupController(controller, model) {
    this._super(controller, model);
    //this.controllerFor('application').set('entity', model.get('constructor.modelName'));
    //this.controllerFor('application').set('entity_id', model.get('id'));
    window.scrollTo(0, 0);
  },
});
