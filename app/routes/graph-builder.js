import Ember from 'ember';
import ENV from '../config/environment';
const {apiURL} = ENV;

export default Ember.Route.extend({
  queryParams: {
    entity: { refreshModel: true }, // location, product, industry
    entity_id: { refreshModel: true }, // Id of the entities
    source: { refreshModel: true }, // products, industries,
    variable: { refreshModel: true }, //export_value, import_value, wages, employment
    vis: { refreshModel: false }, // treemap, multiples, scatter
    search: { refreshModel: false }
  },
  model: function(queryParams) {
    return this.store.find(queryParams.entity, queryParams.entity_id);
  },
  afterModel: function(model, transition) {
    var data = Ember.getWithDefault(transition, 'queryParams.source', 'products');
    if(data  === 'products'){
      return this.setProducts(model);
    } if (data === 'industries') {
      return this.setIndustries(model);
    }
  },
  setProducts: function(model){
    var products = Ember.$.getJSON(`${apiURL}data/products?location=${model.id}`);
    var productsData = Ember.$.getJSON(`${apiURL}data/products/scatterplot?location=${model.id}&year=2012`);
    return Ember.RSVP.allSettled([products, productsData])
      .then((array) => {
        let products = Ember.getWithDefault(array[0], 'value.data', []);
        let productsData = Ember.getWithDefault(array[1], 'value.data', []);
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
    var industries = Ember.$.getJSON(`${apiURL}data/industries?location=${model.id}`);
    // industriesData has the RCA and Complexity
    var industriesData = Ember.$.getJSON(`${apiURL}data/industries/scatterplot?location=${model.id}&year=2012`);
    return Ember.RSVP.allSettled([industries, industriesData])
      .then((array) => {
        let industries = Ember.getWithDefault(array[0], 'value.data', []);
        let industriesData = Ember.getWithDefault(array[1], 'value.data', []);
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
   }
});

