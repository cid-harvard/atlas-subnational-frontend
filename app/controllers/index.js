import Ember from 'ember';
const {computed, get} = Ember;

export default Ember.Controller.extend({
  i18n: Ember.inject.service(),

  firstYear: computed.alias('i18n.firstYear'),
  lastYear: computed.alias('i18n.lastYear'),
  productIds: computed(function() {
    return get(this, 'i18n')
      .t('index.dropdown.products')
      .string
      .split(',');
  }),
  locationIds: computed(function() {
    return get(this, 'i18n')
      .t('index.dropdown.locations')
      .string
      .split(',');
  }),
  industryIds: computed(function() {
    return get(this, 'i18n')
      .t('index.dropdown.industries')
      .string
      .split(',');
  }),
  products: computed.filter('model.products', function (product) {
    let id = get(this, 'productIds');
    return _.contains(id, get(product, 'id'));
  }),
  sortedProducts: computed('productIds', 'products', function() {
    let id = get(this, 'productIds');
    let products = get(this, 'products');

    return _.map(id, function(d) {
      return _.find(products, { id: d });
    });
  }),
  cities: computed.filter('model.cities', function (city) {
    let id = get(this, 'locationIds');
    return _.contains(id, get(city, 'id'));
  }),
  sortedCities: computed('locationIds', 'cities', function() {
    let id = get(this, 'locationIds');
    let cities = get(this, 'cities');

    return _.map(id, function(d) {
      return _.find(cities, { id: d });
    });
  }),
  industries: computed.filter('model.industries', function (industry) {
    let id = get(this, 'industryIds');
    return _.contains(id, get(industry, 'id'));
  }),
  sortedIndustries: computed('industryIds', 'industries', function() {
    let id = get(this, 'industryIds');
    let industries = get(this, 'industries');

    return _.map(id, function(d) {
      return _.find(industries, { id: d });
    });
  }),
  locationFirst: computed('i18n', function() {
    return get(this, 'i18n').t('index.location_q1.id').string;
  }),
  locationSecond: computed('i18n', function() {
    return get(this, 'i18n').t('index.location_q2.id').string;
  }),
  industryFirst: computed('i18n', function() {
    return get(this, 'i18n').t('index.industry_q1.id').string;
  }),
  industrySecond: computed('i18n', function() {
    return get(this, 'i18n').t('index.industry_q2.id').string;
  }),
  productFirst: computed('i18n', function() {
    return get(this, 'i18n').t('index.product_q1.id').string;
  }),
  productSecond: computed('i18n', function() {
    return get(this, 'i18n').t('index.product_q2.id').string;
  }),
  profile: computed('i18n', function() {
    return get(this, 'i18n').t('index.profile.id').string;
  }),
  graphbuilder: computed('i18n', function() {
    return get(this, 'i18n').t('index.graphbuilder.id').string;
  }),
  actions: {
    transitionLocation(id) {
      this.transitionToRoute('location.show', id);
    },
    transitionProduct(id) {
      this.transitionToRoute('product.show', id);
    },
    transitionIndustry(id) {
      this.transitionToRoute('industry.show', id);
    }
  }
});
