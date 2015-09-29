import Ember from 'ember';
import DS from 'ember-data';
const {attr} = DS;
const {computed} = Ember;

export default Ember.Mixin.create({
  i18n: Ember.inject.service(),
  level: attr(),

  code: attr('string'),

  name_en: attr('string'),
  name_es: attr('string'),

  name_short_en: attr('string'),
  name_short_es: attr('string'),

  parent_id: attr('string'),

  locale: computed('i18n.locale', function() {
    return this.get('i18n.display');
  }),
  otherLocale: computed('i18n.locale', 'i18n.otherLocale', 'i18n.defaultLocale', function() {
    if(this.get('i18n.locale') === this.get('i18n.otherLocale')) {
      return this.get('i18n.defaultLocale');
    } else {
      return this.get('i18n.otherLocale');
    }
  }),
  _level: computed('locale', 'level', function() {
    return this.get('i18n')
      .t(`location.model.${this.get('level')}`);
  }),
  name_long: computed('locale', 'name_en', 'name_es', function() {
    return this.get(`name_${this.get('locale')}`) || this.get(`name_${this.get('otherLocale')}`);
  }),
  name_short: computed('locale', 'name_short_en', 'name_short_es', function() {
    return this.get(`name_short_${this.get('locale')}`) || this.get(`name_short_${this.get('otherLocale')}`);
  }),
  name: computed('name_short', 'name_long', function() {
    return this.get('name_short') || this.get('name_long');
  })
});
