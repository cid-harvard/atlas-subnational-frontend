import Ember from 'ember';
import ENV from '../../config/environment';
import numeral from 'numeral';

const {apiURL} = ENV;
const {RSVP, computed, getWithDefault, get, copy} = Ember;

export default Ember.Route.extend({
// `this.store.find` makes an api call for `params.location_id` and returns a promise
// in the `then` function call, another API call is made to get the topExports data
  i18n: Ember.inject.service(),
  featureToggle: Ember.inject.service(),

  firstYear: computed.alias('featureToggle.first_year'),
  lastYear: computed.alias('featureToggle.last_year'),
  censusYear: computed.alias('featureToggle.census_year'),
  agproductFirstYear: computed.alias('featureToggle.year_ranges.agproduct.first_year'),
  agproductLastYear: computed.alias('featureToggle.year_ranges.agproduct.last_year'),
  agcensusFirstYear: computed.alias('featureToggle.year_ranges.agcensus.first_year'),
  agcensusLastYear: computed.alias('featureToggle.year_ranges.agcensus.last_year'),

  model: function(params) {
    return this.store.find('location', params.location_id);
  },
  afterModel: function(model) {
    let level = model.get('level');
    level = level === 'country' ? 'department' : level;

    let subregion = get(this, `featureToggle.subregions.${model.get('level')}`);

    // TODO: maybe use ember data instead of ajax calls to decorate JSON objects with model functionality?
    // extract year out later
    var products = Ember.$.getJSON(`${apiURL}/data/location/${model.id}/products?level=4digit`);
    var industries = Ember.$.getJSON(`${apiURL}/data/location/${model.id}/industries?level=class`);

    // one of these should be removed in the future because the points should be merged in
    var dotplot = Ember.$.getJSON(`${apiURL}/data/location?level=${level}`); //dotplots

    var subregions_trade = Ember.$.getJSON(`${apiURL}/data/location/${model.id}/subregions_trade/?level=${subregion}`);

    var occupations = Ember.$.getJSON(`${apiURL}/data/occupation/?level=minor_group`);

    var agproducts = Ember.$.getJSON(`${apiURL}/data/location/${model.id}/agproducts/?level=level3`);
    var landuses = Ember.$.getJSON(`${apiURL}/data/location/${model.id}/land_uses/?level=level2`);

    var ag_farmsizes = Ember.$.getJSON(`${apiURL}/data/farmsize/1/locations/?level=${level}`);
    var nonag_farmsizes = Ember.$.getJSON(`${apiURL}/data/farmsize/2/locations/?level=${level}`);

    var partners = Ember.$.getJSON(`${apiURL}/data/location/${model.id}/partners/?level=country`);

    var farmtypes = Ember.$.getJSON(`${apiURL}/data/location/${model.id}/farmtypes/?level=level2`);

    var nonags = Ember.$.getJSON(`${apiURL}/data/location/${model.id}/nonags/?level=level3`);

    var livestock = Ember.$.getJSON(`${apiURL}/data/location/${model.id}/livestock/?level=level1`);

    return RSVP.allSettled([products, dotplot, industries, subregions_trade, occupations, agproducts, landuses, ag_farmsizes, nonag_farmsizes, partners, farmtypes, nonags, livestock]).then((array) => {
      var productsData = getWithDefault(array[0], 'value.data', []);

      var dotplotData = getWithDefault(array[1], 'value.data', []);//dotplots

      var industriesData = getWithDefault(array[2], 'value.data', []);

      var subregionsTradeData = _.filter(getWithDefault(array[3], 'value.data', []), { 'year': this.get('lastYear')});

      var occupationsData = getWithDefault(array[4], 'value.data', []);

      var agproductsData = getWithDefault(array[5], 'value.data', []);
      var landusesData = getWithDefault(array[6], 'value.data', []);

      var agFarmsizesData = getWithDefault(array[7], 'value.data', []);
      var nonagFarmsizesData = getWithDefault(array[8], 'value.data', []);

      var partnersData = getWithDefault(array[9], 'value.data', []);
      var farmtypesDataValues = getWithDefault(array[10], 'value.data', []);
      var nonagsDataValues = getWithDefault(array[11], 'value.data', []);
      var livestockDataValues = getWithDefault(array[12], 'value.data', []);

      var productsDataIndex = _.indexBy(productsData, 'product_id');
      var industriesDataIndex = _.indexBy(industriesData, 'industry_data');

      let productsMetadata = this.modelFor('application').products;
      let locationsMetadata = this.modelFor('application').locations;
      let industriesMetadata = this.modelFor('application').industries;
      let occupationsMetadata = this.modelFor('application').occupations;
      let agproductsMetadata = this.modelFor('application').agproducts;
      let landusesMetadata = this.modelFor('application').landUses;
      let partnersMetadata = this.modelFor('application').partnerCountries;
      let farmtypesMetadata = this.modelFor('application').farmtypes;
      let nonagsMetadata = this.modelFor('application').nonags;
      let livestockMetadata = this.modelFor('application').livestock;


      //get products data for the department
      let products = _.reduce(productsData, (memo, d) => {
        if(d.year != this.get('lastYear')) { return memo; }
        let product = productsMetadata[d.product_id];
        let productData = productsDataIndex[d.product_id];
        product.complexity = _.result(_.find(product.pci_data, { year: d.year }), 'pci');
        memo.push(_.merge(d, product, productData));
        return memo;
      }, []);


      //get products data for the department
      let allProducts = _.reduce(productsData, (memo, d) => {
        let product = productsMetadata[d.product_id];
        let productData = productsDataIndex[d.product_id];

        product.complexity = _.result(_.find(product.pci_data, { year: d.year }), 'pci');
        memo.push(_.merge(d, productData, {year: d.year}, product));
        return memo;
      }, []);


      let allPartners = _.map(partnersData, (d) => {

        let country = partnersMetadata[d.country_id];
        let parent = partnersMetadata[country.parent_id];
        d.parent_name_en = parent.name_en;
        d.parent_name_es = parent.name_es;
        d.group = parent.id;

        return _.merge(copy(d), country);
      });


      //get agproducts data for the department

      let agproducts = _.map(agproductsData, (d) => {
        let merged = _.merge(copy(d), agproductsMetadata[d.agproduct_id]);

        let parent = agproductsMetadata[merged.parent_id];
        let grandparent = agproductsMetadata[parent.parent_id];
        merged.parent_name_en = grandparent.name_short_en;
        merged.parent_name_es = grandparent.name_short_es;
        merged.group = grandparent.id;

        return merged;
      });

      //get agproducts data for the department

      let landuses = _.map(landusesData, (d) => {
        let merged = _.merge(copy(d), landusesMetadata[d.land_use_id]);
        merged.year = this.get('agcensusLastYear');
        merged.group = merged.code;
        return merged;
      });

      //get industry data for department
      let industries = _.reduce(industriesData, (memo, d) => {
        if(d.year != this.get('lastYear')) { return memo; }
        let industry = industriesMetadata[d.industry_id];
        if(model.id === '0') { d.rca = 1; }
        let industryData = industriesDataIndex[d.industry_id];
        industry.complexity = _.result(_.find(industry.pci_data, { year: d.year}), 'complexity');
        memo.push(_.merge(d, industry, industryData));
        return memo;
      }, []);

      let occupationVacanciesSum = 0;
      let occupations = _.map(occupationsData, (d) => {
        occupationVacanciesSum += d.num_vacancies;
        let occupation = occupationsMetadata[d.occupation_id];
        return _.merge(d, occupation);
      });

      occupations.forEach((d) => {
        d.share = d.num_vacancies/occupationVacanciesSum;
      });

      //dotplots and dotplotTimeSeries power the dotplots, rankings and etc
      var dotplot = [];
      var dotplotTimeSeries= [];

      _.each(dotplotData, (d) => {
        let id = _.get(d, 'department_id') || _.get(d, 'location_id');
        if(id == model.id) {
          dotplotTimeSeries.push(d);
        }
        if(d.year === this.get('censusYear')) {
          let id = _.get(d, 'department_id') || _.get(d, 'location_id');

          let location = _.get(locationsMetadata, id);

          let extra = {
            name: location.name_en,
            group: d.code,
            parent_name_en: location.name_en,
            parent_name_es: location.name_es,
          };

          let datum = _.merge(d, location, extra );
          dotplot.push(datum);
        }
      });

      let subregions = [];
      _.each(subregionsTradeData, (d) => {
        let id = _.get(d, 'department_id') || _.get(d, 'location_id');

        let location = _.get(locationsMetadata, id);
        let extra = {
          name: location.name_en,
          group: d.code,
          parent_name_en: location.name_en,
          parent_name_es: location.name_es,
        };

        let datum = _.merge(d, location, extra );
        subregions.push(datum);
      });

      var eciRank = 1;
      var populationRank = 1;
      var gdpRank = 1;
      var gdpPerCapitaRank = 1;

      // "Datum" contains the hash of data for the year to be displayed.
      let datum = _.chain(dotplotTimeSeries)
        .select({ year: this.get('censusYear')})
        .first()
        .value();

      if(datum) {
        _.each(dotplot, (d) => {
          if(d.eci != null && d.eci > datum.eci) { eciRank ++; }
          if(d.gdp_real != null && d.gdp_real > datum.gdp_real) { gdpRank ++; }
          if(d.population != null && d.population > datum.population ) { populationRank ++; }
          if(d.gdp_pc_real != null && d.gdp_pc_real> datum.gdp_pc_real ) { gdpPerCapitaRank++; }
        });
      }

      if(datum !== undefined && (datum.eci === undefined || datum.eci === null)){
         eciRank = null;
      }

      model.setProperties({
        eciRank: eciRank,
        gdpRank: gdpRank,
        gdpPerCapitaRank: gdpPerCapitaRank,
        populationRank: populationRank,
      });

      var agFarmsizeRank = 1;
      var agFarmsize = _.chain(agFarmsizesData).filter((d) => d.location_id == model.id).first().get("avg_farmsize").value();
      _.each(agFarmsizesData, (d) => {

        if(d.avg_farmsize != null && d.avg_farmsize > agFarmsize ) { agFarmsizeRank++; }

        d.name_en = _.get(locationsMetadata, d.location_id).name_en;
        d.name_es = _.get(locationsMetadata, d.location_id).name_es;

      });
      agFarmsize = numeral(agFarmsize).format('0.00a');

      model.setProperties({
        agFarmsize: agFarmsize,
        agFarmsizeRank: agFarmsizeRank,
      });

      var nonagFarmsizeRank = 1;
      var nonagFarmsize = _.chain(nonagFarmsizesData).filter((d) => d.location_id == model.id).first().get("avg_farmsize").value();
      _.each(nonagFarmsizesData, (d) => {

        if(d.avg_farmsize != null && d.avg_farmsize > nonagFarmsize ) { nonagFarmsizeRank++; }

        d.name_en = _.get(locationsMetadata, d.location_id).name_en;
        d.name_es = _.get(locationsMetadata, d.location_id).name_es;

      });
      nonagFarmsize = numeral(nonagFarmsize).format('0.00a');

      model.setProperties({
        nonagFarmsize: nonagFarmsize,
        nonagFarmsizeRank: nonagFarmsizeRank,
      });

      var yieldIndexRank = 1;
      var yieldIndex = _.chain(dotplotData).filter((d) => ((d.department_id == model.id || d.location_id == model.id) && d.year == this.get("agproductLastYear"))).first().get("yield_index").value();

      var yieldData = _.filter(dotplotData, (d) => d.year == this.get("agproductLastYear") );
      _.each(yieldData, (d) => {
        if(d.yield_index != null && d.yield_index > yieldIndex) { yieldIndexRank++; }
        let id = _.get(d, 'department_id') || _.get(d, 'location_id');
        d.name_en = _.get(locationsMetadata, id).name_en;
        d.name_es = _.get(locationsMetadata, id).name_es;
      });
      yieldIndex = numeral(yieldIndex).format('0.00a');

      model.setProperties({
        yieldIndex: yieldIndex,
        yieldIndexRank: yieldIndexRank,
      });

      let farmtypesData = _.map(farmtypesDataValues, (d) => {
        let merged = _.merge(copy(d), farmtypesMetadata[d.farmtype_id]);
        let parent = farmtypesMetadata[merged.parent_id];

        merged.parent_name_en = parent.name_short_en;
        merged.parent_name_es = parent.name_short_es;
        merged.year = this.get('agcensusLastYear');
        merged.group = merged.code;
        merged.same_parent = true;
        return merged;
      });

      let nonagsData = _.map(nonagsDataValues, (d) => {
        d.year = this.get('agcensusLastYear');
        let merged = _.merge(copy(d), nonagsMetadata[d.nonag_id]);
        merged.group = merged.code;
        return merged;
      });

      let livestockData = _.map(livestockDataValues, (d) => {
        d.year = this.get('agcensusLastYear');
        let merged = _.merge(copy(d), livestockMetadata[d.livestock_id]);
        merged.group = merged.code;
        return merged;
      });




      model.set('productsData', products);
      model.set('agproductsData', agproducts);
      model.set('landusesData', landuses);
      model.set('industriesData', industries);
      model.set('agFarmsizesData', agFarmsizesData);
      model.set('nonagFarmsizesData', nonagFarmsizesData);
      model.set('yieldData', yieldData);
      model.set('dotplotData', dotplot);
      model.set('occupations', occupations);
      model.set('timeseries', dotplotTimeSeries);
      model.set('metaData', this.modelFor('application'));
      model.set('subregions', subregions);
      model.set('allPartners', allPartners);
      model.set('allProducts', allProducts);
      model.set('farmtypesData', farmtypesData);
      model.set('nonagsData', nonagsData);
      model.set('livestockData', livestockData);

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
