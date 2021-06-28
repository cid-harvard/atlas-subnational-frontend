import Ember from 'ember';

const {observer, computed} = Ember;

export default Ember.Controller.extend({
  i18n: Ember.inject.service(),
  featureToggle: Ember.inject.service(),
  needs: ['search'],
  queryParams: ['locale'],
  defaultLanguage: computed('i18n.default', function() {
    return this.get('i18n.defaultLocale').substring(0,2);
  }),
  otherLanguage: computed('i18n.other', function() {
    return this.get('i18n.otherLocale').substring(0,2);
  }),
  setLanguageToggle: observer('isDefaultLocale',function() {

    if(this.get('isDefaultLocale')) {
      if(this.get('i18n.locale') === 'no-copy') { return; }
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
  isProfileRoute: computed('currentRouteName', function() {
    return this.get('currentRouteName').endsWith(".show");
  }),
  isHomePageRoute: computed.equal('currentRouteName','index'),

  isSearchRoute: computed.equal('currentRouteName','search'),

  showStreamer: computed('isHomePageRoute', function(){
    return !this.get('isHomePageRoute');
  }),
  heroImageStyle: computed(function(){
    let url = this.get('featureToggle.hero_image');
    return Ember.String.htmlSafe(`background-image: url('${url}');`);
  }),
  screenSize: computed(function(){
        var width = window.screen.width;
        var height = window.screen.height*window.devicePixelRatio;
        if (width>767){ 
        alert(width);
        return true; 
        }  
  })
 });
