import Ember from 'ember';
import numeral from 'numeral';

const {observer, computed, getWithDefault} = Ember;

export default Ember.Controller.extend({
  i18n: Ember.inject.service(),
  allEntities: ['product', 'location', 'industry'],
  //use entity and entity_id to build the nav links
  entity: null,
  entity_id: null,
  visualizationType: 'treemap',
  //The language toggle is a checkbox
  //currently the way it is,
  //TRUE => 'es-' and FALSE => 'en
  init: function(){
    //refactor this later please...QL
    this._super.apply(this, arguments);
    this.set('i18n.locale', getWithDefault(Ember.$.cookie(), 'locale', 'es'));

    numeral.language(this.get('i18n.locale'));
    this.set('i18n.defaultLocale', 'es');
    this.set('i18n.otherLocale', 'en');

    this.set('i18n.localeOpposite', { en: 'es', es: 'en' } );
    this.set('isDefaultLocale', this.get('i18n.locale') === this.get('i18n.defaultLocale'));
  },
  defaultLanguage: computed('i18n.default', function() {
    return this.get('i18n.defaultLocale').substring(0,2);
  }),
  otherLanguage: computed('i18n.other', function() {
    return this.get('i18n.otherLocale').substring(0,2);
  }),
  setLanguageToggle: observer('isDefaultLocale',function() {
    if(this.get('i18n.locale') === this.get('i18n.defaultLocale')) {
      this.set('i18n.locale', this.get('i18n.otherLocale'));
      numeral.language(this.get('i18n.otherLocale'));
    } else {
      this.set('i18n.locale', this.get('i18n.defaultLocale'));
      numeral.language(this.get('i18n.defaultLocale'));
    }
  }),
  setCookie: observer('i18n.locale', function() {
    Ember.$.cookie('locale',this.get('i18n.locale'));
  }),
  productsMetadata: computed('model.products', function() {
    return this.get('model.products');
  }),
  locationsMetadata: computed('model.locations', function(){
    return this.get('model.locations');
  }),
  industriesMetadata: computed('model.industries', function() {
    return this.get('model.industries');
  })
});
