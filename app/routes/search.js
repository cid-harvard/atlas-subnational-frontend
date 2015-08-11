import Ember from 'ember';

export default Ember.Route.extend({
  queryParams: {
    query: { refreshModel: true },
    filter: { refreshModel: true }
  },
  beforeModel: function(transition) {
    var hasQuery = transition
      .queryParams
      .hasOwnProperty('query');

    // if search is empty, redirect to route without param
    if(hasQuery && !transition.queryParams.query){
      this.transitionTo('search', 'all');
    }
  },
  model: function(transition) {
    var departments = this.store.find('location', {level: 'department'});
    var municipalities = this.store.find('location', {level: 'municipality'});
    var products = this.store.find('product', { level: '4digit' });
    var industries = this.store.find('industry', { level: 'division' });

    if(transition.query) {
      return Ember.RSVP.all([industries, departments, municipalities, products])
        .then(function(array) {
          return _.chain(array)
            .map(function(d){ return d.content; })
            .flatten()
            .value();
        }, function() {
          return [];
        });
    }
  },
  setupController(controller, model) {
    this._super(controller, model);
    this.controllerFor('application').set('entity', null);
    this.controllerFor('application').set('entity_id', null);
    window.scrollTo(0, 0);
  },
});
