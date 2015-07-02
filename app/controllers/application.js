import Ember from 'ember';
const {observer, computed, on, set:set} = Ember;

export default Ember.Controller.extend({
  needs: ['location/show', 'graph-builder', 'search'],
  //use entity and entity_id to build the nav links
  entity: 'location',
  entity_id: '1044',
  language: Ember.$.cookie('lang') === 'es',
  initLanguage: on('init', function(){
    var application = this.container.lookup('application:main');
    if(Ember.$.cookie('lang') === 'es'){
      set(this, 'isEnglish', false);
      set(application, 'locale', 'es');
    }else{
      set(this, 'isEnglish', true);
      set(application, 'locale', 'en');
    }
  }),
  setLanguage: observer('language',function() {
    var application = this.container.lookup('application:main');
    if(this.get('isEnglish')){
      set(application, 'locale', 'es');
      Ember.$.cookie('lang', 'es');
      set(this, 'isEnglish', false);
    }else{
      set(application, 'locale', 'en');
      Ember.$.cookie('lang', 'en');
      set(this, 'isEnglish', true);
    }
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
  profileLink: computed('entity', 'entity_id', function(){
    if(this.get('entity') === 'location') { return 'location.show'; }
  })
});
