import Ember from 'ember';
import DS from 'ember-data';

const {attr} = DS;
const {computed} = Ember;

export default Ember.Mixin.create({
  i18n: Ember.inject.service(),
  level: attr(),
  code: attr('string'),
  group: attr(),
  entity: attr('string'),

  description_en: attr('string'),
  description_es: attr('string'),

  name_en: attr('string'),
  name_es: attr('string'),

  name_short_en: attr('string'),
  name_short_es: attr('string'),

  parent_id: attr('string'),
  color: attr('string'),
  parent_name_en: attr('string'),
  parent_name_es: attr('string'),

  locale: computed.alias('i18n.locale'),

  firstYear: computed.alias('i18n.firstYear'),
  lastYear: computed.alias('i18n.lastYear'),
  censusYear: computed.alias('i18n.censusYear'),

  entity_and_id: computed('entity', 'id', function() {
    return `${this.get('entity')}-${this.get('id')}`;
  }),
  _level: computed('locale', 'level', function() {
    return this.get('i18n')
      .t(`location.model.${this.get('level')}`);
  }),
  name_long: computed('i18n.display', 'name_en', 'name_es', function() {
    return this.get(`name_${this.get('i18n.display')}`);
  }),
  name_short: computed('i18n.display', 'name_short_en', 'name_short_es', function() {
    return this.get(`name_short_${this.get('i18n.display')}`);
  }),
  name: computed('name_short', 'name_long', function() {
    return this.get('name_short') || this.get('name_long');
  })
});
