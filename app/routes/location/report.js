import Ember from 'ember';
import ENV from '../../config/environment';

const {apiURL} = ENV;

const {RSVP, computed, copy, get, $, set, getWithDefault} = Ember;

export default Ember.Route.extend({

  i18n: Ember.inject.service(),
  featureToggle: Ember.inject.service(),
  buildermodSearchService: Ember.inject.service(),
  firstYear: computed.alias('featureToggle.first_year'),
  lastYear: computed.alias('featureToggle.last_year'),
  agcensusLastYear: computed.alias('featureToggle.year_ranges.agcensus.last_year'),

  queryParams: {
    startDate: { refreshModel: false },
    endDate: { refreshModel: false },
  },

  model(params) {

    let hash = {
      model: this.store.find('location', params.location_id),
      industries_col: $.getJSON(`${apiURL}/data/location/${params.location_id}/industries?level=class`),
      products_col: $.getJSON(`${apiURL}/data/location/${params.location_id}/products?level=4digit`),
      partners: $.getJSON(`${apiURL}/data/location/${params.location_id}/partners?level=country`),
      land_uses: $.getJSON(`${apiURL}/data/location/${params.location_id}/land_uses/?level=level2`),
      farmtypes: $.getJSON(`${apiURL}/data/location/${params.location_id}/farmtypes/?level=level2`),
      agproducts: $.getJSON(`${apiURL}/data/location/${params.location_id}/agproducts/?level=level3`),
      nonags: $.getJSON(`${apiURL}/data/location/${params.location_id}/nonags/?level=level3`),
      livestock: $.getJSON(`${apiURL}/data/location/${params.location_id}/livestock/?level=level1`),
    }

    return RSVP.hash(hash).then((hash) => {
      return this.departmentsDataMunging(hash);
    });

    //return this.store.find('product', params.product_id);
  },
  departmentsDataMunging(hash) {
    let {model, industries_col, products_col, partners, land_uses, farmtypes, agproducts, nonags, livestock} = hash;
    let industriesMetadata = this.modelFor('application').industries;
    let productsMetadata = this.modelFor('application').products;
    let partnersMetadata = this.modelFor('application').partnerCountries;
    let landusesMetadata = this.modelFor('application').landUses;
    let farmtypesMetadata = this.modelFor('application').farmtypes;
    let agproductsMetadata = this.modelFor('application').agproducts;
    let nonagsMetadata = this.modelFor('application').nonags;
    let livestockMetadata = this.modelFor('application').livestock;

    let industries = _.map(industries_col.data, (d) => {
      let industry = industriesMetadata[d.industry_id];
      if(model.id === '0') { d.rca = 1; }
      industry.complexity = _.result(_.find(industry.pci_data, { year: d.year}), 'complexity');
      return _.merge(copy(d), industry, { avg_wage: d.wages/d.employment});
    });

    //get products data for the department
    let products = _.reduce(products_col.data, (memo, d) => {
      let product = productsMetadata[d.product_id];
      product.complexity = _.result(_.find(product.pci_data, { year: d.year }), 'pci');
      memo.push(_.merge(d, product));
      return memo;
    }, []);

    let allPartners = _.map(partners.data, (d) => {
      let country = partnersMetadata[d.country_id];
      let parent = partnersMetadata[country.parent_id];
      d.parent_name_en = parent.name_en;
      d.parent_name_es = parent.name_es;
      d.group = parent.id;

      return _.merge(copy(d), country);
    });

    //get agproducts data for the department

    let landuses = _.map(land_uses.data, (d) => {
      console.log(landusesMetadata)
      let merged = _.merge(copy(d), landusesMetadata[d.land_use_id]);
      merged.year = this.get('agcensusLastYear');
      merged.group = merged.code;
      return merged;
    });


    let farmtypesData = _.map(farmtypes.data, (d) => {
      let merged = _.merge(copy(d), farmtypesMetadata[d.farmtype_id]);
      let parent = farmtypesMetadata[merged.parent_id];

      merged.parent_name_en = parent.name_short_en;
      merged.parent_name_es = parent.name_short_es;
      merged.year = this.get('agcensusLastYear');
      merged.group = merged.code;
      merged.same_parent = true;
      return merged;
    });

    let agproductsData = _.map(agproducts.data, (d) => {
      let merged = _.merge(copy(d), agproductsMetadata[d.agproduct_id]);

      let parent = agproductsMetadata[merged.parent_id];
      let grandparent = agproductsMetadata[parent.parent_id];
      merged.parent_name_en = grandparent.name_short_en;
      merged.parent_name_es = grandparent.name_short_es;
      merged.group = grandparent.id;

      return merged;
    });

    let nonagsData = _.map(nonags.data, (d) => {
      d.year = this.get('agcensusLastYear');
      let merged = _.merge(copy(d), nonagsMetadata[d.nonag_id]);
      merged.group = merged.code;
      return merged;
    });

    let livestockData = _.map(livestock.data, (d) => {
        d.year = this.get('agcensusLastYear');
        let merged = _.merge(copy(d), livestockMetadata[d.livestock_id]);
        merged.group = merged.code;
        return merged;
      });





    return Ember.Object.create({
      entity: model,
      industries_col: industries,
      products_col: products,
      allPartners: allPartners,
      landuses: landuses,
      farmtypesData: farmtypesData,
      agproductsData: agproductsData,
      nonagsData: nonagsData,
      livestockData: livestockData,
      metaData: this.modelFor('application')
    });
  },
  setupController(controller, model) {
    //this.set('buildermodSearchService.search', null);
    this._super(controller, model);
    controller.set("startDate", this.get("lastYear"))
    controller.set("endDate", this.get("lastYear"))
    controller.set("show1", false)
    controller.set("show2", false)
    controller.set("show3", false)
    controller.set("show4", false)
    controller.set("show5", false)
    controller.set("show6", false)
    controller.set("selectedProducts1", [])
    controller.set("selectedProducts2", [])
    window.scrollTo(0, 0);
  },
  resetController(controller, isExiting) {

    if (isExiting) {
      controller.setProperties({
      });
    }
  }
});
