import Ember from 'ember';

export default Ember.Route.extend({
  queryParams: {
    query: { refreshModel: true }
  },
  model: function(transition) {
    var locations= this.store.find('location');
    var products = this.store.find('product', { level: '4digit' });
    var industriesDivision = this.store.find('industry', { level: 'division' });
    var industriesClass = this.store.find('industry', { level: 'class' });

    if(transition.query) {
      return Ember.RSVP.all([industriesDivision, industriesClass, locations, products])
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
});

