import Ember from 'ember';
const {RSVP} = Ember;

export default Ember.Route.extend({
// `this.store.find` makes an api call for `params.location_id` and returns a promise
// in the `then` function call, another API call is made to get the topExports data
  model: function(params) {
    var model = this.store.find('location', params.location_id);
    var exports = Ember.$.getJSON(`data/products?location=${params.location_id}&year=2012`);
    var departments = Ember.$.getJSON('data/departments?year=2012');

    return RSVP.allSettled([model, exports, departments]).then(function(array) {
      let model = array[0].value;
      let exports = array[1].value;
      let departments = array[2].value;

      if(exports) { model.set('productsData', exports.data);}
      if(departments) { model.set('departments', departments.data);}
      return model;
    });
  }
});
