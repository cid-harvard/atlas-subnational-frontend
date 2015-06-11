import Ember from 'ember';

export default Ember.Route.extend({
  queryParams: {
    query: { refreshModel: true }
  },
  beforeModel: function(transition) {
    var hasQuery = transition
      .queryParams
      .hasOwnProperty('query');

    // if search is empty, redirect to route without param
    if(hasQuery && !transition.queryParams.query){
      this.transitionTo('search');
    }
  },
  model: function(transition) {
    // hardcoded so search result is going to be Atlantico
    if(transition.query) {
      return [this.store.find('location', 930), this.store.find('location', 930)];
    }
  }
});
