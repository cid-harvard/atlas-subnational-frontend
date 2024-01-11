import Ember from 'ember';
import ENV from '../../config/environment';

const {apiURL} = ENV;

const {RSVP, computed, copy, get, $, set} = Ember;

export default Ember.Route.extend({

  i18n: Ember.inject.service(),
  featureToggle: Ember.inject.service(),
  departmentCityFilterService: Ember.inject.service(),
  firstYear: computed.alias('featureToggle.first_year'),
  lastYear: computed.alias('featureToggle.last_year'),
  product_id: null,

  model(params) {
    let {product_id} = params;
    set(this, 'product_id', product_id);

    let hash = {
      model: this.store.find('product', product_id),
      locations: $.getJSON(`${apiURL}/data/product/${product_id}/exporters?level=department`),
      cities: $.getJSON(`${apiURL}/data/product/${product_id}/exporters?level=msa`),
      partners: $.getJSON(`${apiURL}/data/product/${product_id}/partners?level=country`)
    }

    return RSVP.hash(hash).then((hash) => {
      return this.departmentsDataMunging(hash);
    });

    //return this.store.find('product', params.product_id);
  },
  departmentsDataMunging(hash) {
    let {model, locations, cities, partners} = hash;
    let locationsMetadata  = this.modelFor('application').locations;
    let partnersMetadata = this.modelFor('application').partnerCountries;
    let productsMetadata = this.modelFor('application').products;

    let locationsData = _.map(locations.data, (d) => {
      let location = locationsMetadata[d.department_id];
      let department = copy(d);
      return _.merge(department, location, {
        model: 'location',
        product_name_short_es: productsMetadata[d.product_id].name_short_es,
        product_name_short_en: productsMetadata[d.product_id].name_short_en,
        product_code: productsMetadata[d.product_id].code
      });
    });

    let citiesData = _.map(cities.data, (d) => {
      let location = locationsMetadata[d.msa_id];
      let city = copy(d);
      let result = _.merge(
        city, location,
        {
          model: 'location',
          parent_name_en: locationsMetadata[location.parent_id].name_short_en,
          parent_name_es: locationsMetadata[location.parent_id].name_short_es,
          product_name_short_es: productsMetadata[d.product_id].name_short_es,
          product_name_short_en: productsMetadata[d.product_id].name_short_en,
          product_code: productsMetadata[d.product_id].code
        }
      );
      return result;
    });

    let partnersData = _.map(partners.data, (d) => {
      let country = partnersMetadata[d.country_id];
      let parent = partnersMetadata[country.parent_id];
      let partner = copy(d);
      partner.parent_name_en = parent.name_en;
      partner.parent_name_es = parent.name_es;
      partner.group = parent.id;
      d.model = null;
      return _.merge(partner, parent, country, {
          model: 'location',
          product_name_short_es: productsMetadata[d.product_id].name_short_es,
          product_name_short_en: productsMetadata[d.product_id].name_short_en,
          product_code: productsMetadata[d.product_id].code
        });
    });

    return Ember.Object.create({
      entity: model,
      locationsData: locationsData,
      citiesData: citiesData,
      partnersData: partnersData
    });
  },
  setupController(controller, model) {
    this.set("departmentCityFilterService.id", 0);
    this.set("departmentCityFilterService.name", "Colombia");
    this._super(controller, model);
    window.scrollTo(0, 0);
  },
});
