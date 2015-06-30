import Ember from 'ember';
const {computed, on, observer} = Ember;

export default Ember.Controller.extend({
  needs: 'application', // inject the application controller
  queryParams: ['query'],
  query: null,
  search: computed.oneWay('query'),
  isEnglish: computed.alias('controllers.application.isEnglish'),
  clearSearch: observer('query', function() {
    // if query is empty, set the search to null
    // this is for route transitions that don't trigger `init`
    if(!this.get('query')){
      this.set('search', null);
    }
  }),
  // observer the Query Params and set the links on the side nav
  setSideNav: observer('model.[]', function() {
    var applicationController = this.get('controllers.application');
    applicationController.set('entity', 'location');
    applicationController.set('entity_id', 'colombia');
  }),
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
