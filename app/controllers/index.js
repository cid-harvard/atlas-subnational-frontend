import Ember from 'ember';
const {computed, observer, get} = Ember;

export default Ember.Controller.extend({
  i18n: Ember.inject.service(),

  firstYear: computed.alias('i18n.firstYear'),
  lastYear: computed.alias('i18n.lastYear'),
  products: computed.filter('model.products', (product, index, array) => {
    let id = [1143, 87];
    return _.contains(id, parseInt(get(product, 'id')));
  }),
  cities: computed.filter('model.cities', (city, index, array) => {
    let id = [41,87, 34, 40];
    return _.contains(id, parseInt(get(city, 'id')));
  }),
  industries: computed.filter('model.industries', (industry, index, array) => {
    let id = [461, 488];
    return _.contains(id, parseInt(get(industry, 'id')));
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
