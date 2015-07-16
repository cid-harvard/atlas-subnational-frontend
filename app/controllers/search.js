import Ember from 'ember';
const {computed, observer, get: get} = Ember;

export default Ember.Controller.extend({
  i18n: Ember.inject.service(),
  needs: 'application', // inject the application controller
  queryParams: ['query'],
  query: null,
  search: computed.oneWay('query'),
  clearSearchIfEmpty: observer('query', function() {
    // if query is empty, set the search to null
    // this is for route transitions that don't trigger `init`
    if(!this.get('query')){
      this.set('search', null);
    }
  }),
  filteredResults: computed('model.[]', function() {
    let search = _.deburr(this.get('search'));
    var regexp = new RegExp(search.replace(/(\S+)/g, function(s) { return "\\b(" + s + ")(.*)"; })
      .replace(/\s+/g, ''), "gi");
    return this.get('model').filter(function(d){
      return _.deburr(get(d,'name')).match(regexp) || get(d, 'code').match(regexp);
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

