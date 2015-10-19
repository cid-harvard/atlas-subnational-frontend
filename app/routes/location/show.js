import Ember from 'ember';
import ENV from '../../config/environment';
const {apiURL} = ENV;
const {RSVP, getWithDefault} = Ember;

export default Ember.Route.extend({
// `this.store.find` makes an api call for `params.location_id` and returns a promise
// in the `then` function call, another API call is made to get the topExports data
  model: function(params) {
    return this.store.find('location', params.location_id);
  },
  afterModel: function(model, transition) {
    // extract year out later
    var year = getWithDefault(transition, 'queryParams.year', 2013);

    var products = Ember.$.getJSON(`${apiURL}/data/location/${model.id}/products?level=4digit`);
    var industries = Ember.$.getJSON(`${apiURL}/data/location/${model.id}/industries?level=class`);

    // one of these should be removed in the future because the points should be merged in
    var departments = Ember.$.getJSON(`${apiURL}/data/location?level=department`);
    //var departments_trade = Ember.$.getJSON(`${apiURL}/data/location/${model.id}/subregions_trade/?level=department`);

    return RSVP.allSettled([products, departments, industries]).then((array) => {
      var productsData = getWithDefault(array[0], 'value.data', []);
      var departmentsData = getWithDefault(array[1], 'value.data', []);
      var industriesData = getWithDefault(array[2], 'value.data', []);
      //var departmentsTradeData = _.filter(getWithDefault(array[3], 'value.data', []), { 'year': year });

      var productsDataIndex = _.indexBy(productsData, 'product_id');
      var industriesDataIndex = _.indexBy(industriesData, 'industry_data');
      //var departmentsTradeDataIndex = _.indexBy(departmentsTradeData, 'location_id');

      let productsMetadata = this.modelFor('application').products;
      let locationsMetadata = this.modelFor('application').locations;
      let industriesMetadata = this.modelFor('application').industries;

      //get products data for the department
      let products = _.reduce(productsData, (memo, d) => {
        if(d.year != 2013) { return memo; }
        let product = productsMetadata[d.product_id];
        let productData = productsDataIndex[d.product_id];
        memo.push(_.merge(d, product, productData));
        return memo;
      }, []);

      //get industry data for department
      let industries = _.map(industriesData, (d) => {
        let industry = industriesMetadata[d.industry_id];
        let industryData = industriesDataIndex[d.industry_id];
        return _.merge(d, industry, industryData);
      });

      var departments = [];
      var departmentTimeseries = [];
      var department_id = model.id;

      if(model.get('level') === 'municipality'){
        department_id = model.get('parent_id');
      }

      //dot plot and time series data
      _.reduce(departmentsData, function(memo, d) {
        if(d.department_id == department_id) {
          departmentTimeseries.push(d);
        }
        if(d.year === year) {
          let location = locationsMetadata[d.department_id];
          //let tradeData = departmentsTradeDataIndex[d.department_id];
          let extra = {
            name: location.name_en,
            group: d.code,
            parent_name_en: location.name_en,
            parent_name_es: location.name_es,
          };

          let datum = _.merge(d, location, extra );
          departments.push(datum);
        }
        return memo;
      });

      model.set('productsData', products);
      model.set('industriesData', industries);
      model.set('departments', departments);
      model.set('timeseries', departmentTimeseries);
      if(model.id == '0') { model.set('metaData', this.modelFor('application')); }
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
