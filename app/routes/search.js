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
    var departments = Ember.$.getJSON(`${apiURL}metadata/locations/?level=department`);
    var municipalities = Ember.$.getJSON(`${apiURL}metadata/locations/?level=municipality`);
    let search = _.deburr(transition.query);
    var regexp = new RegExp(search.replace(/(\S+)/g, function(s) { return "\\b(" + s + ")(.*)"; })
      .replace(/\s+/g, ''), "gi");

    if(transition.query) {
      return Ember.RSVP.allSettled([departments, municipalities])
        .then(function(array) {
          return _.chain(array)
            .map(function(d){return d.value.data; })
            .flatten()
            .filter(function(d){ return _.deburr(get(d,'name_en')).match(regexp) || get(d, 'code').match(regexp); })
            .value();
        });
    }
  }
});
