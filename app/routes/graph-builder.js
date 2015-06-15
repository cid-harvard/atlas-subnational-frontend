import Ember from 'ember';
const {RSVP} = Ember;


export default Ember.Route.extend({
  queryParams: {
    entity: { refreshModel: true },
    entity_id: { refreshModel: true },
    data: { refreshModel: true }
  },
  model: function(queryParams, transition) {
    return this.store.find(queryParams.entity, queryParams.entity_id)
  },
  afterModel: function(model, transition) {
    var data = Ember.getWithDefault(transition, 'queryParams.data', 'product');
    if(data  === 'product'){
      return Ember.$.getJSON(`data/products?location=${model.id}`)
        .then(function(data) { model.set('productsData', Ember.getWithDefault(data, 'data', [])); });
    }
  }
});

