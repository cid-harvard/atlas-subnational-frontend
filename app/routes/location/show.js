import Ember from 'ember';
import ENV from '../../config/environment';
const {apiURL} = ENV;
const {RSVP, getWithDefault} = Ember;

export default Ember.Route.extend({
// `this.store.find` makes an api call for `params.location_id` and returns a promise
// in the `then` function call, another API call is made to get the topExports data
  model: function(params) {
    if(params.location_id === 'colombia'){ this.transitionTo('colombia');}
    return this.store.find('location', params.location_id);
  },
  afterModel: function(model, transition) {
    var year = Ember.getWithDefault(transition, 'queryParams.year', 2012);

    var products = Ember.$.getJSON(`${apiURL}data/products?location=${model.id}&year=${year}`);
    // one of these should be removed in the future because the points should be merged in
    var departments = Ember.$.getJSON(`${apiURL}data/departments?year=${year}`);
    var departmentsAll = Ember.$.getJSON(`${apiURL}data/departments/departmentyear/`);

    return RSVP.allSettled([products, departments, departmentsAll]).then((array) => {
      var productsData = getWithDefault(array[0], 'value.data', []);
      var departmentsData = getWithDefault(array[1], 'value.data', []);
      var departmentsDataAll = getWithDefault(array[2], 'value.data', []);

      var productsDataIndex = _.indexBy(productsData, 'product_id');

      let productsMetadata = this.modelFor('application').products;
      let locationsMetadata = this.modelFor('application').locations;

      //get products data for the department
      _.each(productsData, (d) => {
        let product = productsMetadata[d.product_id];
        let productData = productsDataIndex[d.product_id];

        d.name = product.name_en;
        _.extend(d, product);
        _.extend(d, productData);
      });

      //all department data for 2012
      _.each(departmentsData, function(d) {
        let department = _.find(departmentsDataAll, {department_id: d.department_id, year: year});
        d.name = locationsMetadata[d.department_id].name_en;
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
