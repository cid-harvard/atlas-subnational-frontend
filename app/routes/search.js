import Ember from 'ember';

export default Ember.Route.extend({
  queryParams: {
    query: { refreshModel: false },
    filter: { refreshModel: true }
  },
  model(transition) {
    var country = this.store.find('location', { level: 'country' });
    var department = this.store.find('location', { level: 'department' });
    var msa = this.store.find('location', { level: 'msa' });
    var municipality = this.store.find('location', { level: 'municipality' });

    var products = this.store.find('product', { level: '4digit' });

    var agproducts = this.store.find('agproduct', { level: 'level3' });
    var nonags = this.store.find('nonag', { level: 'level3' });
    var landuses = this.store.find('land-use', { level: 'level2' });

    var industriesDivision = this.store.find('industry', { level: 'division' });
    var industriesClass = this.store.find('industry', { level: 'class' });

    var request = [];

    if(transition.filter === 'location'){
      request = [country, department, msa, municipality];
    } else if(transition.filter === 'industry') {
      request = [industriesDivision, industriesClass];
    } else if(transition.filter === 'product') {
      request = [products];
    } else if(transition.filter === 'rural') {
      request = [agproducts, landuses, nonags];
    } else {
      request = [industriesDivision, industriesClass, country, department, msa, municipality, products];
    }

    return Ember.RSVP.all(request)
      .then(function(array) {
        return _.chain(array)
          .map(function(d){ return d.content; })
          .flatten()
          .value();
      },function() {
        return [];
      });
  },
  setupController: function(controller, model) {
    this._super(controller, model);
    controller.set('metaData', this.modelFor('application'));
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

