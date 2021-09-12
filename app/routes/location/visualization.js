import Ember from 'ember';
import ENV from '../../config/environment';

const {apiURL} = ENV;
const {RSVP, computed, $, set, get, copy} = Ember;

export default Ember.Route.extend({
  featureToggle: Ember.inject.service(),

  firstYear: computed.alias('featureToggle.first_year'),
  lastYear: computed.alias('featureToggle.last_year'),
  censusYear: computed.alias('featureToggle.census_year'),
  agproductFirstYear: computed.alias('featureToggle.year_ranges.agproduct.first_year'),
  agproductLastYear: computed.alias('featureToggle.year_ranges.agproduct.last_year'),
  agcensusFirstYear: computed.alias('featureToggle.year_ranges.agcensus.first_year'),
  agcensusLastYear: computed.alias('featureToggle.year_ranges.agcensus.last_year'),

  queryParams: {
    startDate: { refreshModel: false },
    endDate: { refreshModel: false },
    search: { refreshModel: false }
  },
  controllerName: 'visualization',
  renderTemplate() {
    this.render('visualization');
  },
  model(params) {
    let {location_id, visualization_type, source_type, variable} = params;
    set(this, 'location_id', location_id);
    set(this, 'source_type', source_type);
    set(this, 'visualization_type', visualization_type);
    set(this, 'variable', variable);

    return RSVP.hash(this.get(source_type)).then((hash) => {
      if(source_type === 'industries') {
        return this.industryDataMunging(hash);
      } else if (source_type === 'products') {
        return this.productsDataMunging(hash);
      } else if (source_type === 'partners') {
        return this.partnersDataMunging(hash);
      } else if (source_type === 'livestock') {
        return this.livestockDataMunging(hash);
      } else if (source_type === 'agproducts') {
        return this.agproductsDataMunging(hash);
      } else if (source_type === 'nonags') {
        return this.nonagsDataMunging(hash);
      } else if (source_type === 'landUses') {
        return this.landUsesDataMunging(hash);
      } else if (source_type === 'farmtypes') {
        return this.farmtypesDataMunging(hash);
      }
    });
  },
  afterModel(graphbuilderModel) {
    return graphbuilderModel.setProperties({
      entity_type:'location',
      visualization: get(this, 'visualization_type'),
      source: get(this, 'source_type'),
      metaData: this.modelFor('application'),
      variable: get(this, 'variable')
    });
  },
  industries: computed('location_id', function() {
    let id = get(this, 'location_id');
    return {
      model: this.store.find('location', id),
      industries:  $.getJSON(`${apiURL}/data/location/${id}/industries?level=class`)
    };
  }),
  products: computed('location_id', function() {
    let id = get(this, 'location_id');
    return {
      model: this.store.find('location', id),
      products: $.getJSON(`${apiURL}/data/location/${id}/products?level=4digit`)
    };
  }),
  livestock: computed('location_id', function() {
    let id = get(this, 'location_id');
    return {
      model: this.store.find('location', id),
      livestock: $.getJSON(`${apiURL}/data/location/${id}/livestock/?level=level1`)
    };
  }),
  agproducts: computed('location_id', function() {
    let id = get(this, 'location_id');
    return {
      model: this.store.find('location', id),
      agproducts: $.getJSON(`${apiURL}/data/location/${id}/agproducts/?level=level3`)
    };
  }),
  nonags: computed('location_id', function() {
    let id = get(this, 'location_id');
    return {
      model: this.store.find('location', id),
      nonags: $.getJSON(`${apiURL}/data/location/${id}/nonags/?level=level3`)
    };
  }),
  landUses: computed('location_id', function() {
    let id = get(this, 'location_id');
    return {
      model: this.store.find('location', id),
      landUses: $.getJSON(`${apiURL}/data/location/${id}/land_uses/?level=level2`)
    };
  }),
  farmtypes: computed('location_id', function() {
    let id = get(this, 'location_id');
    return {
      model: this.store.find('location', id),
      farmtypes: $.getJSON(`${apiURL}/data/location/${id}/farmtypes/?level=level2`)
    };
  }),
  partners: computed('location_id', function() {
    let id = get(this, 'location_id');
    return {
      model: this.store.find('location', id),
      partners: $.getJSON(`${apiURL}/data/location/${id}/partners/?level=country`)
    };
  }),
  partnersDataMunging(hash) {
    let {model, partners} = hash;
    let partnersMetadata = this.modelFor('application').partnerCountries;
    let data = _.map(partners.data, (d) => {
      let country = partnersMetadata[d.country_id];
      let parent = partnersMetadata[country.parent_id];
      d.parent_name_en = parent.name_en;
      d.parent_name_es = parent.name_es;
      d.group = parent.id;
      return _.merge(copy(d), country);
    });

    return Ember.Object.create({
      entity: model,
      data: Ember.A(data)
    });
  },
  industryDataMunging(hash) {
    let { model, industries } = hash;
    let industriesMetadata = this.modelFor('application').industries;

    let data = _.map(industries.data, (d) => {
      let industry = industriesMetadata[d.industry_id];
      if(model.id === '0') { d.rca = 1; }
      industry.complexity = _.result(_.find(industry.pci_data, { year: d.year}), 'complexity');
      return _.merge(copy(d), industry, { avg_wage: d.wages/d.employment});
    });

    return Ember.Object.create({
      entity: model,
      data: Ember.A(data)
    });
  },
  productsDataMunging(hash) {
    let {model, products } = hash;
    let productsMetadata = this.modelFor('application').products;

    let data = _.map(products.data, (d) => {
      let product = productsMetadata[d.product_id];
      d.complexity = _.result(_.find(product.pci_data, { year: d.year }), 'pci');
      return _.merge(copy(d), product, { avg_wage: d.wages/d.employment});
    });

    return Ember.Object.create({
      entity: model,
      data: Ember.A(data)
    });
  },
  livestockDataMunging(hash) {
    let {model, livestock } = hash;
    let livestockMetadata = this.modelFor('application').livestock;

    let data = _.map(livestock.data, (d) => {
      d.year = this.get('agcensusLastYear');
      let merged = _.merge(copy(d), livestockMetadata[d.livestock_id]);
      merged.group = merged.code;
      return merged;
    });

    return Ember.Object.create({
      entity: model,
      data: Ember.A(data)
    });
  },
  agproductsDataMunging(hash) {
    let {model, agproducts } = hash;
    let agproductsMetadata = this.modelFor('application').agproducts;

    var ids = []

    let data = _.map(agproducts.data, (d) => {
      let merged = _.merge(copy(d), agproductsMetadata[d.agproduct_id]);

      let parent = agproductsMetadata[merged.parent_id];
      let grandparent = agproductsMetadata[parent.parent_id];
      merged.parent_name_en = grandparent.name_short_en;
      merged.parent_name_es = grandparent.name_short_es;
      merged.group = grandparent.id;

      return merged;
    });

    return Ember.Object.create({
      entity: model,
      data: Ember.A(data)
    });
  },
  nonagsDataMunging(hash) {
    let {model, nonags } = hash;
    let nonagsMetadata = this.modelFor('application').nonags;

    let data = _.map(nonags.data, (d) => {
      d.year = this.get('agcensusLastYear');
      let merged = _.merge(copy(d), nonagsMetadata[d.nonag_id]);
      merged.group = merged.code;
      return merged;
    });

    return Ember.Object.create({
      entity: model,
      data: Ember.A(data)
    });
  },
  landUsesDataMunging(hash) {
    let {model, landUses } = hash;
    let landUsesMetadata = this.modelFor('application').landUses;

    let data = _.map(landUses.data, (d) => {
      let merged = _.merge(copy(d), landUsesMetadata[d.land_use_id]);
      merged.year = this.get('agcensusLastYear');
      merged.group = merged.code;
      return merged;
    });

    return Ember.Object.create({
      entity: model,
      data: Ember.A(data)
    });
  },
  farmtypesDataMunging(hash) {
    let {model, farmtypes } = hash;
    let farmtypesMetadata = this.modelFor('application').farmtypes;

    let data = _.map(farmtypes.data, (d) => {
      let merged = _.merge(copy(d), farmtypesMetadata[d.farmtype_id]);
      let parent = farmtypesMetadata[merged.parent_id];

      merged.parent_name_en = parent.name_short_en;
      merged.parent_name_es = parent.name_short_es;
      merged.year = this.get('agcensusLastYear');
      merged.group = merged.code;
      merged.same_parent = true;
      return merged;
    });

    return Ember.Object.create({
      entity: model,
      data: Ember.A(data)
    });
  },
  setupController(controller, model) {
    this._super(controller, model);
    controller.set('drawerChangeGraphIsOpen', false); // Turn off other drawers
    controller.set('drawerQuestionsIsOpen', false); // Turn off other drawers
    controller.set('searchText', controller.get('search'));
    window.scrollTo(0, 0);
  },
  resetController(controller, isExiting) {
    if (isExiting) {
      controller.setProperties({
        startDate: this.get('firstYear'),
        endDate: this.get('lastYear')
      });
    }
  }
});

