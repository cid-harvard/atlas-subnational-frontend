import Ember from 'ember';
import { translationMacro as t } from "ember-i18n";
const {computed, observer, get: get} = Ember;

export default Ember.Controller.extend({
  i18n: Ember.inject.service(),
  needs: 'application', // inject the application controller
  queryParams: ['query'],
  query: null,
  search: computed.oneWay('query'),
  placeholder: t('search.placeholder'),
  clearSearchIfEmpty: observer('query', function() {
    // if query is empty, set the search to null
    // this is for route transitions that don't trigger `init`
    if(!this.get('query')){
      this.set('search', null);
    }
  }),
  productResults: computed('model.[]', function() {
    // TODO DRY out the three results properties and remove entity hardcoding in filtering
    let search = _.deburr(this.get('search'));
    var regexp = new RegExp(search.replace(/(\S+)/g, function(s) { return "\\b(" + s + ")(.*)"; })
      .replace(/\s+/g, ''), "gi");

    return this.get('model').filter(function(d){
      return get(d,'constructor.modelName') === 'product' && _.deburr(get(d,'name')).match(regexp) || get(d, 'code').match(regexp);
    });
  }),
  locationResults: computed('model.[]', function() {
    let search = _.deburr(this.get('search'));
    var regexp = new RegExp(search.replace(/(\S+)/g, function(s) { return "\\b(" + s + ")(.*)"; })
      .replace(/\s+/g, ''), "gi");

    return this.get('model').filter(function(d){
      return get(d,'constructor.modelName') === 'location' && _.deburr(get(d,'name')).match(regexp) || get(d, 'code').match(regexp);
    });
  }),
  industryResults: computed('model.[]', function() {
    let search = _.deburr(this.get('search'));
    var regexp = new RegExp(search.replace(/(\S+)/g, function(s) { return "\\b(" + s + ")(.*)"; })
      .replace(/\s+/g, ''), "gi");

    return this.get('model').filter(function(d){
      return get(d,'constructor.modelName') === 'industry' && _.deburr(get(d,'name')).match(regexp) || get(d, 'code').match(regexp);
    });
  }),
  init: function(){
    this._super.apply(this, arguments);
    var applicationController = this.get('controllers.application');
    applicationController.set('entity', 'location');
    applicationController.set('entity_id', 1044);
  },
  actions: {
    search: function() {
      var userSearch= this.get('search');
      if(userSearch) {
        this.transitionToRoute('search', { queryParams: { query: userSearch }});
      }else{
        // if the search is empty, transition to search route will null query
        this.transitionToRoute('search', { queryParams: { query: null }});
      }
    }
  }
});

