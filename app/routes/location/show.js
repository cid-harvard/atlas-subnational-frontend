import Ember from 'ember';
import ENV from '../../config/environment';
const {apiURL} = ENV;
const {RSVP, computed, getWithDefault} = Ember;

export default Ember.Route.extend({
// `this.store.find` makes an api call for `params.location_id` and returns a promise
// in the `then` function call, another API call is made to get the topExports data
  i18n: Ember.inject.service(),
  firstYear: computed.alias('i18n.firstYear'),
  lastYear: computed.alias('i18n.lastYear'),
  censusYear: computed.alias('i18n.censusYear'),

  model: function(params) {
    return this.store.find('location', params.location_id);
  },
  afterModel: function(model) {
    let level = model.get('level');
    level = level === 'country' ? 'department' : level;

    // extract year out later
    var products = Ember.$.getJSON(`${apiURL}/data/location/${model.id}/products?level=4digit`);
    var industries = Ember.$.getJSON(`${apiURL}/data/location/${model.id}/industries?level=class`);

    // one of these should be removed in the future because the points should be merged in
    var departments = Ember.$.getJSON(`${apiURL}/data/location?level=${level}`);
    var departments_trade = Ember.$.getJSON(`${apiURL}/data/location/${model.id}/subregions_trade/?level=${level}`);

    var occupations = Ember.$.getJSON(`${apiURL}/data/occupation/?level=minor_group`);

    return RSVP.allSettled([products, departments, industries, departments_trade, occupations]).then((array) => {
      var productsData = getWithDefault(array[0], 'value.data', []);
      var departmentsData = getWithDefault(array[1], 'value.data', []);
      var industriesData = getWithDefault(array[2], 'value.data', []);
      var departmentsTradeData = _.filter(getWithDefault(array[3], 'value.data', []), { 'year': this.get('lastYear')});
      var occupationsData = getWithDefault(array[4], 'value.data', []);

      var productsDataIndex = _.indexBy(productsData, 'product_id');
      var industriesDataIndex = _.indexBy(industriesData, 'industry_data');
      var departmentsTradeDataIndex = _.indexBy(departmentsTradeData, 'location_id');

      let productsMetadata = this.modelFor('application').products;
      let locationsMetadata = this.modelFor('application').locations;
      let industriesMetadata = this.modelFor('application').industries;
      let occupationsMetadata = this.modelFor('application').occupations;

      //get products data for the department
      let products = _.reduce(productsData, (memo, d) => {
        if(d.year != this.get('lastYear')) { return memo; }
        let product = productsMetadata[d.product_id];
        let productData = productsDataIndex[d.product_id];
        product.complexity = _.result(_.find(product.pci_data, { year: d.year }), 'pci');
        memo.push(_.merge(d, product, productData));
        return memo;
      }, []);

      //get industry data for department
      let industries = _.map(industriesData, (d) => {
        let industry = industriesMetadata[d.industry_id];
        if(model.id === '0') { d.rca = 1; }
        let industryData = industriesDataIndex[d.industry_id];
        industry.complexity = _.result(_.find(industry.pci_data, { year: d.year}), 'complexity');
        return _.merge(d, industry, industryData);
      });

      let occupations = _.map(occupationsData, (d) => {
        let occupation = occupationsMetadata[d.occupation_id];
        return _.merge(d, occupation);
      });

      var departments = [];
      var departmentTimeseries = [];

      _.each(departmentsData, (d) => {
        let id = _.get(d, 'department_id') || _.get(d, 'location_id');
        if(id == model.id) {
          departmentTimeseries.push(d);
        }
        if(d.year === this.get('censusYear')) {
          let id = _.get(d, 'department_id') || _.get(d, 'location_id');

          let location = _.get(locationsMetadata, id);
          let tradeData = _.get(departmentsTradeDataIndex,id);

          let extra = {
            name: location.name_en,
            group: d.code,
            parent_name_en: location.name_en,
            parent_name_es: location.name_es,
          };

          let datum = _.merge(d, location, tradeData, extra );
          departments.push(datum);
        }
      });

      var eciRank = 1;
      var populationRank = 1;
      var gdpRank = 1;
      var gdpPerCapitaRank = 1;

      let datum = _.chain(departmentTimeseries)
        .select({ year: this.get('censusYear')})
        .first()
        .value();

      _.each(departments, (d) => {
        if(d.eci > datum.eci ) { eciRank ++; }
        if(d.gdp_real > datum.gdp_real) { gdpRank ++; }
        if(d.population > datum.population ) { populationRank ++; }
        if(d.gdp_pc_real> datum.gdp_pc_real ) { gdpPerCapitaRank++; }
      });

      model.setProperties({
        eciRank: eciRank,
        gdpRank: gdpRank,
        gdpPerCapitaRank: gdpPerCapitaRank,
        populationRank: populationRank
      });

      model.set('productsData', products);
      model.set('industriesData', industries);
      model.set('departments', departments);
      model.set('occupations', occupations);
      model.set('timeseries', departmentTimeseries);
      model.set('metaData', this.modelFor('application'));

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
