import Ember from 'ember';
const {RSVP} = Ember;

export default Ember.Route.extend({
// `this.store.find` makes an api call for `params.location_id` and returns a promise
// in the `then` function call, another API call is made to get the topExports data
  model: function(params) {
    return this.store.find('location', params.location_id);
  },
  afterModel: function(model, transition) {
    var year = Ember.get(transition,'queryParams.year') || 2012;

    var products = Ember.$.getJSON(`data/products?location=${model.id}&year=${year}`);
    var departments = Ember.$.getJSON(`data/departments?year=${year}`);

    return RSVP.allSettled([products, departments]).then(function(array) {
      var productsData = Ember.get(array[0], 'value.data') || [];
      var departmentData = Ember.get(array[1], 'value.data') || [];
      model.set('productsData', productsData);
      model.set('departments', departmentData);
      return model;
    });
  }
});
