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
    var url = 'http://52.6.95.239/api/';
    if(transition.query) {
      return Ember.$.getJSON(url+'metadata/locations/?level=department')
        .then(function(model) { return model.data; });
    }
  }});
