import DS from 'ember-data';
import Ember from 'ember';
import ENV from '../config/environment';
const {apiURL} = ENV;
const {attr} = DS;
const {computed, getWithDefault, $} = Ember;

export default DS.Model.extend({
  i18n: Ember.inject.service(),
  code: attr('string'),

  name_en: attr('string'),
  name_es: attr('string'),

  name_short_en: attr('string'),
  name_short_es: attr('string'),

  description_en: attr('string'),
  description_es: attr('string'),

  level: attr('string'),

  parent_id: attr('string'),

  locale: computed('i18n.locale', function() {
    return this.get('i18n.locale');
  }),
  name: computed('locale', 'name_en', 'name_es', function() {
    let attr = `name_${this.get('locale')}`;
    return this.get(attr) || `${attr} does not exist`;
  }),
  name_short: computed('locale', 'name_short_en', 'name_short_es', function() {
    let attr = `name_${this.get('locale')}`;
    return this.get(attr) || `${attr} does not exist`;
  }),
});
