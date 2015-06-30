import Ember from 'ember';
import ENV from '../../config/environment';
const {apiURL} = ENV;
const {RSVP} = Ember;

export default Ember.Route.extend({
// `this.store.find` makes an api call for `params.location_id` and returns a promise
// in the `then` function call, another API call is made to get the topExports data
  model: function(params) {
    return this.store.find('location', params.location_id);
  },
  afterModel: function(model, transition) {
    var year = Ember.getWithDefault(transition, 'queryParams.year', 2012);

    var products = Ember.$.getJSON(`${apiURL}data/products?location=${model.id}&year=${year}`);
    // one of these should be removed in the future because the points should be merged in
    var departments = Ember.$.getJSON(`${apiURL}data/departments?year=${year}`);
    var departmentsAll = Ember.$.getJSON(`${apiURL}data/departments/departmentyear/`);

    return RSVP.allSettled([products, departments, departmentsAll]).then((array) => {
      var productsData = Ember.getWithDefault(array[0], 'value.data', []);
      var departmentsData = Ember.getWithDefault(array[1], 'value.data', []);
      var departmentsDataAll = Ember.getWithDefault(array[2], 'value.data', []);

      let productsMetadata = this.modelFor('application').products;
      let locationsMetadata = this.modelFor('application').locations;

      //get products data for the department
      _.each(productsData, function(d) {
        let product = _.find(productsMetadata, { id: d.product_id });
        let productData = _.find(productsData, { product_id: d.product_id });
        d.name = product.name_en;
        _.extend(d, product);
        _.extend(d, productData);
      });

      //all department data for 2012
      _.each(departmentsData, function(d) {
        let department = _.find(departmentsDataAll, {department_id: d.department_id, year: 2012});
        d.name = _.find(locationsMetadata, {id: d.department_id}).name_en;
        _.extend(d, department);
      });

      //all time series data for the department with id = model.id
      var departmentTimeseries = _.filter(departmentsDataAll, {department_id: parseInt(model.id)});

      model.set('productsData', productsData);
      model.set('departments', departmentsData);
      model.set('timeseries', departmentTimeseries);
      return model;
    });
  },
});
