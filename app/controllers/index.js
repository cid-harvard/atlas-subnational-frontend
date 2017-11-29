import Ember from 'ember';
const {computed, get} = Ember;

export default Ember.Controller.extend({
  i18n: Ember.inject.service(),
  featureToggle: Ember.inject.service(),

  firstYear: computed.alias('featureToggle.first_year'),
  lastYear: computed.alias('featureToggle.last_year'),
  productIds: computed.alias('featureToggle.index_products'),
  locationIds: computed.alias('featureToggle.index_locations'),
  industryIds: computed.alias('featureToggle.index_industries'),
  agproductIds: computed.alias('featureToggle.index_agproducts'),

  showIndustries: computed.notEmpty('featureToggle.index_industries'),
  showProducts: computed.notEmpty('featureToggle.index_products'),
  showLocations: computed.notEmpty('featureToggle.index_locations'),
  showFarmAndLand: computed.notEmpty('featureToggle.index_agproducts'),

  products: computed.filter('model.products', function (product) {
    let id = get(this, 'productIds');
    return _.contains(`${id}`, get(product, 'id'));
  }),
  sortedProducts: computed('productIds', 'products', function() {
    let id = get(this, 'productIds');
    let products = get(this, 'products');

    return _.map(id, function(d) {
      return _.find(products, { id: `${d}` });
    });
  }),
  locations: computed.filter('model.locations', function (location) {
    let id = get(this, 'locationIds');
    return _.contains(`${id}`, get(location, 'id'));
  }),
  sortedLocations: computed('locationIds', 'locations', function() {
    let id = get(this, 'locationIds');
    let locations = get(this, 'locations');

    return _.map(id, function(d) {
      return _.find(locations, { id: `${d}` });
    });
  }),
  industries: computed.filter('model.industries', function (industry) {
    let id = get(this, 'industryIds');
    return _.contains(`${id}`, get(industry, 'id'));
  }),
  sortedIndustries: computed('industryIds', 'industries', function() {
    let id = get(this, 'industryIds');
    let industries = get(this, 'industries');

    return _.map(id, function(d) {
      return _.find(industries, { id: `${d}` });
    });
  }),
  agproducts: computed.filter('model.agproducts', function (agproduct) {
    let id = get(this, 'agproductIds');
    return _.contains(`${id}`, get(agproduct, 'id'));
  }),
  sortedAgproducts: computed('agproductIds', 'agproducts', function() {
    let id = get(this, 'agproductIds');
    let agproducts = get(this, 'agproducts');

    return _.map(id, function(d) {
      return _.find(agproducts, { id: `${d}` });
    });
  }),
  locationFirst: computed.alias('featureToggle.index_location_q1_id'),
  locationSecond: computed.alias('featureToggle.index_location_q2_id'),
  industryFirst: computed.alias('featureToggle.index_industry_q1_id'),
  industrySecond: computed.alias('featureToggle.index_industry_q2_id'),
  productFirst: computed.alias('featureToggle.index_product_q1_id'),
  productSecond: computed.alias('featureToggle.index_product_q2_id'),
  farmAndLandFirst: computed.alias('featureToggle.index_livestock_q1_id'),
  farmAndLandSecond: computed.alias('featureToggle.index_landuse_q1_id'),
  profile: computed.alias('featureToggle.index_profile_id'),
  graphbuilder: computed.alias('featureToggle.index_graphbuilder_id'),
  actions: {
    transitionLocation(id) {
      this.transitionToRoute('location.show', id);
    },
    transitionProduct(id) {
      this.transitionToRoute('product.show', id);
    },
    transitionIndustry(id) {
      this.transitionToRoute('industry.show', id);
    },
    transitionAgproduct(id) {
      this.transitionToRoute('agproduct.show', id);
    },
  }
});
