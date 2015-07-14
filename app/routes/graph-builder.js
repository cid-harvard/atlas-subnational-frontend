import Ember from 'ember';
import ENV from '../config/environment';
const {apiURL} = ENV;
const {getWithDefault, $} = Ember;
export default Ember.Route.extend({
  queryParams: {
    entity: { refreshModel: true }, // location, product, industry
    entity_id: { refreshModel: true }, // Id of the entities
    source: { refreshModel: true }, // products, industries,
    variable: { refreshModel: true }, //export_value, import_value, wages, employment
    vis: { refreshModel: true }, // treemap, multiples, scatter
    rca: { refreshModel: false },
    startDate: { refreshModel: false },
    endDate: { refreshModel: false },
    search: { refreshModel: false }
  },
  beforeModel: function(transition) {
    let queryParams = transition.queryParams;
    let controller = this.controller;
    if(!controller) { return true }

    if(queryParams.vis === 'multiples' && queryParams.source === 'industries') {
      controller.setProperties({startDate: '2008', endDate: '2013'});
    } else if(queryParams.vis === 'multiples' ) {
      controller.setProperties({startDate: '2007', endDate: '2014'});
    } else if(queryParams.vis === 'scatter' && queryParams.source === 'industries') {
      controller.setProperties({startDate: '2011', endDate: '2012'});
    } else if(queryParams.vis === 'scatter') {
      controller.setProperties({startDate: '2013', endDate: '2014'});
    } else if(queryParams.vis === 'similarity' && queryParams.source === 'industries') {
      controller.setProperties({startDate: '2011', endDate: '2012'});
    } else if(queryParams.vis === 'similarity') {
      controller.setProperties({startDate: '2013', endDate: '2014'});
    }
  },
  model: function(queryParams) {
    return this.store.find(queryParams.entity, queryParams.entity_id);
  },
  afterModel: function(model, transition) {
    var data = getWithDefault(transition, 'queryParams.source', 'products');
    if(data  === 'products'){
      return this.setProducts(model);
    } if (data === 'industries') {
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
    var products = $.getJSON(`${apiURL}/data/products?location=${model.id}`);
    var productsData = $.getJSON(`${apiURL}/data/products/scatterplot?location=${model.id}&year=2012`);

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
    var industries = $.getJSON(`${apiURL}/data/industries?location=${model.id}`);
    // industriesData has the RCA and Complexity
    var industriesData = $.getJSON(`${apiURL}/data/industries/scatterplot?location=${model.id}&year=2012`);

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
  setupController: function(controller, model, transition) {
    this._super(controller, model);
    let queryParams = transition.queryParams;
    if(queryParams.vis === 'multiples' && queryParams.source === 'industries') {
      controller.setProperties({startDate: '2008', endDate: '2013'});
    } else if(queryParams.vis === 'multiples') {
      controller.setProperties({startDate: '2007', endDate: '2014'});
    } else if(queryParams.vis === 'scatter' && queryParams.source === 'industries') {
      controller.setProperties({startDate: '2011', endDate: '2012'});
    } else if(queryParams.vis === 'scatter') {
      controller.setProperties({startDate: '2013', endDate: '2014'});
    } else if(queryParams.vis === 'similarity' && queryParams.source === 'industries') {
      controller.setProperties({startDate: '2011', endDate: '2012'});
    } else if(queryParams.vis === 'similarity') {
      controller.setProperties({startDate: '2013', endDate: '2014'});
    }
  }
});

