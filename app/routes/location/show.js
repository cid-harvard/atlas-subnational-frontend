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
    // extract year out later
    var year = getWithDefault(transition, 'queryParams.year', 2012);

    var products = Ember.$.getJSON(`${apiURL}/data/location/${model.id}/products?level=class`);
    var industries = Ember.$.getJSON(`${apiURL}/data/location/${model.id}/industries?level=class`);

    // one of these should be removed in the future because the points should be merged in
    var departments = Ember.$.getJSON(`${apiURL}/data/location?level=department`);

    return RSVP.allSettled([products, departments, industries]).then((array) => {
      var productsData = getWithDefault(array[0], 'value.data', []);
      var departmentsData = getWithDefault(array[1], 'value.data', []);
      var industriesData = getWithDefault(array[2], 'value.data', []);

      var productsDataIndex = _.indexBy(productsData, 'product_id');
      var industriesDataIndex = _.indexBy(industriesData, 'industry_data');

      let productsMetadata = this.modelFor('application').products;
      let locationsMetadata = this.modelFor('application').locations;
      let industriesMetadata = this.modelFor('application').industries;

      //get products data for the department
      let products = _.map(productsData, (d) => {
        let product = productsMetadata[d.product_id];
        let productData = productsDataIndex[d.product_id];
        return _.merge(d, product, productData);
      });

      //get industry data for department
      let industries = _.map(industriesData, (d) => {
        let industry = industriesMetadata[d.industry_id];
        let industryData = industriesDataIndex[d.industry_id];
        return _.merge(d, industry, industryData);
      });

      var departments = [];
      var departmentTimeseries = [];

      _.reduce(departmentsData, function(memo, d) {
        if(d.department_id === parseInt(model.id)) {
          departmentTimeseries.push(d);
        }
        if(d.year === year) {
          let location = locationsMetadata[d.department_id];
          departments.push(_.merge(d, location, { name: location.name_en }));
        }
        return memo;
      });

      model.set('productsData', products);
      model.set('industriesData', industries);
      model.set('departments', departments);
      model.set('timeseries', departmentTimeseries);
      return model;
    });
  },
  setupController(controller, model) {
    this._super(controller, model);
    this.controllerFor('application').set('entity', model.get('constructor.modelName'));
    this.controllerFor('application').set('entity_id', model.get('id'));
    window.scrollTo(0, 0);
  },
});
