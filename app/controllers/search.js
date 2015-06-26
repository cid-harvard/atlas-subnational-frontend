import Ember from 'ember';
const {on, computed, observer} = Ember;

export default Ember.Controller.extend({
  queryParams: ['query'],
  query: null,
  search: computed.oneWay('query'),
  clearSearch: observer('query', function() {
    // if query is empty, set the search to null
    // this is for route transitions that don't trigger `init`
    if(!this.get('query')){
      this.set('search', null);
    }
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
