import Ember from 'ember';
const {RSVP} = Ember;

export default Ember.Route.extend({
// `this.store.find` makes an api call for `params.location_id` and returns a promise
// in the `then` function call, another API call is made to get the topExports data
  model: function(params) {
    return this.store.find('location', params.location_id);
  },
  afterModel: function(model) {
    if(model.get('level') === 'department') {
      var exports = Ember.$.getJSON(`data/products?location=${model.id}&year=2012`);
      var departments = Ember.$.getJSON('data/departments?year=2012');

      RSVP.allSettled([exports, departments]).then(function(array) {
        let exports = array[0].value;
        let departments = array[1].value;

        var exportData = exports.data || [];
        var departmentData = departments.data || [];

        if(exports) { model.set('productsData', exportData);}
        if(departments) { model.set('departments', departmentData);}
      });
    } else {
       model.set('productsData', []);
       model.set('departments', []);
    }
  }
});
