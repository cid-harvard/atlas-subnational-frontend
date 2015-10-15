import Ember from 'ember';

const {observer, computed} = Ember;

export default Ember.Controller.extend({
  i18n: Ember.inject.service(),
  queryParams: ['locale'],
  defaultLanguage: computed('i18n.default', function() {
    return this.get('i18n.defaultLocale').substring(0,2);
  }),
  otherLanguage: computed('i18n.other', function() {
    return this.get('i18n.otherLocale').substring(0,2);
  }),
  setLanguageToggle: observer('isDefaultLocale',function() {
    if(this.get('isDefaultLocale')) {
      this.set('i18n.locale', this.get('i18n.defaultLocale'));
    } else {
      this.set('i18n.locale', this.get('i18n.otherLocale'));
    }

    this.set('locale', this.get('i18n.locale'));
  }),
  productsMetadata: computed('model.products', function() {
    return this.get('model.products');
  }),
  locationsMetadata: computed('model.locations', function(){
    return this.get('model.locations');
  }),
  industriesMetadata: computed('model.industries', function() {
    return this.get('model.industries');
  }),
  isGraphBuilderRoute: computed.equal('currentRouteName','graph_builder.index'),
  isHomePageRoute: computed.equal('currentRouteName','index'),
  isSearchRoute: computed.equal('currentRouteName','search'),
  showStreamer: computed('isHomePageRoute', function(){
    return !this.get('isHomePageRoute');
  })
});
