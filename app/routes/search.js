import Ember from 'ember';

export default Ember.Route.extend({
  queryParams: {
    query: { refreshModel: true },
    filter: { refreshModel: true }
  },
  model(transition) {
    var locations = this.store.find('location');
    var products = this.store.find('product', { level: '4digit' });
    var industriesDivision = this.store.find('industry', { level: 'division' });
    var industriesClass = this.store.find('industry', { level: 'class' });

    var request = [industriesDivision, industriesClass, locations, products];

    if(transition.filter === 'location'){
      request = [locations]
    } else if(transition.filter === 'industry') {
      request = [industriesDivision, industriesClass,]
    } else if(transition.filter === 'product') {
      request = [products]
    }

    if(transition.query) {
      return Ember.RSVP.all(request)
        .then(function(array) {
          return _.chain(array)
            .map(function(d){ return d.content; })
            .flatten()
            .value();
        },function() {
          return [];
        });
    }
    return [];
  },
  deactivate: function() {
    this.controller.set('search', null);
  },
  actions: {
    query: function(query) {
      if(query) {
        this.transitionTo('search', { queryParams: { query: query }});
      } else {
        this.transitionTo('search', { queryParams: { query: null }});
      }
    }
  }
});

