import Ember from 'ember';
const {RSVP} = Ember;


export default Ember.Route.extend({
  queryParams: {
    entity: { refreshModel: true },
    entity_id: { refreshModel: true },
    data_source: { refreshModel: true }
  },
  model: function(queryParams, transition) {
    return this.store.find(queryParams.entity, queryParams.entity_id)
  },
  afterModel: function(model, transition) {
    var url = 'http://52.6.95.239/api/';
    var data = Ember.getWithDefault(transition, 'queryParams.data_source', 'products');
    if(data  === 'products'){
      return Ember.$.getJSON(`${url}data/products?location=${model.id}`)
        .then(function(data) { model.set('productsData', Ember.getWithDefault(data, 'data', [])); })
        .then(function() { window.scrollTo(0,0);})
    } else if (data == 'industries') {
      return Ember.$.getJSON(`${url}data/industries?location=${model.id}`)
        .then(function(data) { model.set('industriesData', Ember.getWithDefault(data, 'data', [])); })
        .then(function() { window.scrollTo(0,0);})
    }
  }
});

