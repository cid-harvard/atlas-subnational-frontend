import Ember from 'ember';
import ENV from '../config/environment';
const {get: get} = Ember;
const {apiURL} = ENV;

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
    let search = _.deburr(transition.query);
    var departments = this.store.find('location', {level: 'department'});
    var municipalities = this.store.find('location', {level: 'municipality'});
    var products = this.store.find('product', { level: '4digit' });

    if(transition.query) {
      return Ember.RSVP.all([departments, municipalities, products])
        .then(function(array) {
          return _.chain(array)
            .map(function(d){ return d.content; })
            .flatten()
            .value();
        }, function() {
          return [];
        });
    }
  }
});
