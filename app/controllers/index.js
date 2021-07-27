import Ember from 'ember';
const {computed, get} = Ember;

export default Ember.Controller.extend({
  i18n: Ember.inject.service(),
  featureToggle: Ember.inject.service(),
  needs: ['search'],
  firstYear: computed.alias('featureToggle.first_year'),
  lastYear: computed.alias('featureToggle.last_year'),
  agcensusLastYear: computed.alias('featureToggle.year_ranges.agcensus.last_year'),

  productIds: computed.alias('featureToggle.index_products'),
  locationIds: computed.alias('featureToggle.index_locations'),
  industryIds: computed.alias('featureToggle.index_industries'),
  agproductIds: computed.alias('featureToggle.index_agproducts'),

  showIndustries: computed.notEmpty('featureToggle.index_industries'),
  showProducts: computed.notEmpty('featureToggle.index_products'),
  showLocations: computed.notEmpty('featureToggle.index_locations'),
  showFarmAndLand: computed.notEmpty('featureToggle.index_agproducts'),


  locationsData: computed('model.locations', 'i18n.locale', function() {
    let locations = get(this, 'model.locations');
    let locale = this.get('i18n').display

    return locations.map(function(location){
      return {id: location.id, text: location.get(`name_short_${locale}`) + " (" + location.get('code') + ")" }
    })
  }),

  industriesData: computed('model.industries', 'i18n.locale', function() {
    let industries = get(this, 'model.industries');
    let locale = this.get('i18n').display

    return industries.map(function(industry){
      return {id: industry.id, text: industry.get(`name_short_${locale}`) + " (" + industry.get('code') + ")" }
    })
  }),

  productsData: computed('model.products', 'i18n.locale', function() {
    let products = get(this, 'model.products');
    let locale = this.get('i18n').display

    return products.map(function(product){
      return {id: product.id, text: product.get(`name_short_${locale}`) + " (" + product.get('code') + ")" }
    })
  }),

  agproductsData: computed('model.agproducts', 'i18n.locale', function() {
    let agproducts = get(this, 'model.agproducts');
    let locale = this.get('i18n').display

    return agproducts.map(function(agproduct){
      return {id: agproduct.id, text: agproduct.get(`name_${locale}`) }
    })
  }),

  ruralData: computed('model.agproducts', 'i18n.locale', function() {
    let agproducts = get(this, 'model.agproducts');
    let nonags = get(this, 'model.nonags');
    let livestock = get(this, 'model.livestock');
    let landuses = get(this, 'model.landuses');
    let locale = this.get('i18n').display
    var self = this


    var agproducts_data = agproducts.map(function(agproduct){
      var key = "agproduct"
      var to_concatenate = self.get('i18n').t(`search.rural.${key}`).string

      return {id: agproduct.id, text: agproduct.get(`name_${locale}`) + ' - ' + to_concatenate, key: key }
    })

    var nonags_data = nonags.map(function(nonags){
      var key = "nonag"
      var to_concatenate = self.get('i18n').t(`search.rural.${key}`).string
      
      return {id: nonags.id, text: nonags.get(`name_${locale}`) + ' - ' + to_concatenate, key: key, key: key }
    })

    var livestock_data = livestock.map(function(livestock){
      var key = "livestock"
      var to_concatenate = self.get('i18n').t(`search.rural.${key}`).string

      return {id: livestock.id, text: livestock.get(`name_${locale}`) + ' - ' + to_concatenate, key: key, key: key  }
    })

    var landuses_data = landuses.map(function(landuses){
      var key = "land-use"
      var to_concatenate = self.get('i18n').t(`search.rural.${key}`).string

      return {id: landuses.id, text: landuses.get(`name_${locale}`) + ' - ' + to_concatenate, key: key, key: key  }
    })

    return agproducts_data.concat(nonags_data).concat(livestock_data).concat(landuses_data)

  }),

  products: computed.filter('model.products', function (product) {
    let id = get(this, 'productIds');
    return _.contains(`${id}`, get(product, 'id'));
  }),
  sortedProducts: computed('productIds', 'products', function() {
    let id = get(this, 'productIds');
    let products = get(this, 'products');

    return _.map(id, function(d) {
      return _.find(products, { id: `${d}` });
    });
  }),
  locations: computed.filter('model.locations', function (location) {
    let id = get(this, 'locationIds');
    return _.contains(`${id}`, get(location, 'id'));
  }),
  sortedLocations: computed('locationIds', 'locations', function() {
    let id = get(this, 'locationIds');
    let locations = get(this, 'locations');

    return _.map(id, function(d) {
      return _.find(locations, { id: `${d}` });
    });
  }),
  industries: computed.filter('model.industries', function (industry) {
    let id = get(this, 'industryIds');
    return _.contains(`${id}`, get(industry, 'id'));
  }),
  sortedIndustries: computed('industryIds', 'industries', function() {
    let id = get(this, 'industryIds');
    let industries = get(this, 'industries');

    return _.map(id, function(d) {
      return _.find(industries, { id: `${d}` });
    });
  }),
  agproducts: computed.filter('model.agproducts', function (agproduct) {
    let id = get(this, 'agproductIds');
    return _.contains(`${id}`, get(agproduct, 'id'));
  }),
  sortedAgproducts: computed('agproductIds', 'agproducts', function() {
    let id = get(this, 'agproductIds');
    let agproducts = get(this, 'agproducts');

    return _.map(id, function(d) {
      return _.find(agproducts, { id: `${d}` });
    });
  }),
  locationFirst: computed.alias('featureToggle.index_location_q1_id'),
  locationSecond: computed.alias('featureToggle.index_location_q2_id'),
  industryFirst: computed.alias('featureToggle.index_industry_q1_id'),
  industrySecond: computed.alias('featureToggle.index_industry_q2_id'),
  productFirst: computed.alias('featureToggle.index_product_q1_id'),
  productSecond: computed.alias('featureToggle.index_product_q2_id'),
  farmAndLandFirst: computed.alias('featureToggle.index_livestock_q1_id'),
  farmAndLandSecond: computed.alias('featureToggle.index_landuse_q1_id'),
  profile: computed.alias('featureToggle.index_profile_id'),
  graphbuilder: computed.alias('featureToggle.index_graphbuilder_id'),
  actions: {
    transitionLocation(id) {
      this.transitionToRoute('location.show', id);
    },
    transitionLocationSearch() {
      this.transitionToRoute('search', {queryParams: { filter: 'location' }});
    },
    transitionProduct(id) {
      this.transitionToRoute('product.show', id);
    },
    transitionIndustry(id) {
      this.transitionToRoute('industry.show', id);
    },
    transitionAgproduct(id) {
      this.transitionToRoute('agproduct.show', id);
    },
    transitionLivestock(id) {
      this.transitionToRoute('livestock.show', id);
    },
    transitionNonag(id) {
      this.transitionToRoute('nonag.show', id);
    },
    transitionLanduse(id) {
      this.transitionToRoute('landUse.show', id);
    }
  }
});
