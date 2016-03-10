import Ember from 'ember';
const { computed, get } = Ember;

export default Ember.Controller.extend({
  i18n: Ember.inject.service(),
  featureToggle: Ember.inject.service(),
  pageTitle: computed('i18n.locale', function() {
    return get(this, 'i18n').t('rankings.pagetitle');
  }),
  sectionDepartments: computed('i18n.locale', function() {
    return get(this, 'i18n').t('rankings.section.departments');
  }),
  sectionCities: computed('i18n.locale', function() {
    return get(this, 'i18n').t('rankings.section.cities');
  })
});
