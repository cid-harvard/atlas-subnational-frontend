import Ember from 'ember';
import ENV from '../config/environment';
const {apiURL} = ENV;
const {getWithDefault, $} = Ember;
export default Ember.Route.extend({
  queryParams: {
    entity: { refreshModel: true }, // What kind of entity the user searched for (location, product, industry, occupation)
    entity_id: { refreshModel: true }, // The id of the entity
    source: { refreshModel: true }, // What the rectangles in the treemap would represent (location, product, industry, occupation)
    variable: { refreshModel: true }, // The dimension of the source that the user cares about (export_value, import_value, wages, employment)
    vis: { refreshModel: false }, // The graph view (treemap, multiples, scatter)
    rca: { refreshModel: false },
    startDate: { refreshModel: false },
    endDate: { refreshModel: false },
    search: { refreshModel: false }
  },
  model: function(queryParams) {
    return this.store.find(queryParams.entity, queryParams.entity_id);
  },
  afterModel: function(model, transition) {
    var entity = Ember.getWithDefault(transition, 'queryParams.entity', 'location');
    var data = Ember.getWithDefault(transition, 'queryParams.source', 'products');

    // Special route for geomap
    // TODO: Refactor this entire file when the API is updated
    if(entity === 'product') {
      return this.setLocations(model);
    }

    // Routes for ?entity=location
    // TODO: Refactor this entire file when the API is updated
    if(data  === 'products') {
      return this.setProducts(model);
    } else if (data === 'industries') {
      return this.setIndustries(model);
    }
  },
  resetController: function(controller, isExiting) {
    if(isExiting) {
      //when exiting from route, reset params
      controller.setProperties({ source: 'products', vis: 'treemap', variable: 'export_value', search: null, startDate: '2009', endDate: '2011'});
    }
  },
  setProducts: function(model){
    var products = $.getJSON(`${apiURL}data/products?location=${model.id}`);
    var productsData = $.getJSON(`${apiURL}data/products/scatterplot?location=${model.id}&year=2012`);

    return Ember.RSVP.allSettled([products, productsData])
      .then((array) => {
        let products = getWithDefault(array[0], 'value.data', []);
        let productsData = getWithDefault(array[1], 'value.data', []);
        let productsMetadata = this.modelFor('application').products;

        //index on 'product_id'
        productsData = _.indexBy(productsData, 'product_id');

          _.each(products, function(d) {
            let product = productsMetadata[d.product_id];
            let productData = productsData[d.product_id];
            _.extend(d, product);
            _.extend(d, productData);
          });
          model.set('productsData', products);
        })
      .then(function() { window.scrollTo(0,0);});
  },
  setIndustries: function(model) {
    var industries = $.getJSON(`${apiURL}data/industries?location=${model.id}`);
    // industriesData has the RCA and Complexity
    var industriesData = $.getJSON(`${apiURL}data/industries/scatterplot?location=${model.id}&year=2012`);

    return Ember.RSVP.allSettled([industries, industriesData])
      .then((array) => {
        let industries = getWithDefault(array[0], 'value.data', []);
        let industriesData = getWithDefault(array[1], 'value.data', []);
        let industriesMetadata = this.modelFor('application').industries;

        //index on 'industry_id'
        industriesData = _.indexBy(industriesData, 'industry_id');

        _.each(industries, function(d) {
          let industry = industriesMetadata[d.industry_id];
          let industryData = industriesData[d.industry_id];
          _.extend(d, industry);
          _.extend(d, industryData);
        });

        model.set('industriesData', industries);
      })
      .then(function() { window.scrollTo(0,0);});
   },
   setLocations: function(model) {
     var locations = $.getJSON(`${apiURL}data/locations?product=${model.id}`);

     return Ember.RSVP.allSettled([locations])
       .then((array) => {
        let locations = getWithDefault(array[0], 'value.data', []);
        let locationsMetadata = this.modelFor('application').locations;

        // Merge the metadata names of the locations with their ids
        _.each(locations, function(d) {
         let department = locationsMetadata[d.department_id];
         _.extend(d, department);
        });

        model.set('locationsData', locations);
       })
       .then(function() { window.scrollTo(0,0);});
    }
});

