import Ember from 'ember';
const {RSVP} = Ember;

export default Ember.Route.extend({
  queryParams: {
    entity: { refreshModel: true },
    entity_id: { refreshModel: true }
  },
  model: function(transition) {
    return this.store.find(transition.entity, transition.entity_id);
  },
  afterModel: function(model, transition) {
    var year = Ember.get(transition,'queryParams.year');

    var productsURL = year ? `data/products?location=${model.id}&year=${year}` : `data/products?location=${model.id}`;
    var departments = Ember.$.getJSON(`data/departments?year=${year}`);
    var products = Ember.$.getJSON(productsURL);

    return RSVP.allSettled([products, departments]).then(function(array) {
      var productsData = Ember.get(array[0], 'value.data') || [];
      var departmentData = Ember.get(array[1], 'value.data') || [];
      model.set('productsData', productsData);
      model.set('departments', departmentData);
      return model;
    });
  }
});

