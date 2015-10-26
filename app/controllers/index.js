import Ember from 'ember';

const {observer, computed, get:get} = Ember;

export default Ember.Controller.extend({
  i18n: Ember.inject.service(),

  firstYear: computed.alias('i18n.firstYear'),
  lastYear: computed.alias('i18n.lastYear'),

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
});
