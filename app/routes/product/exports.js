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
  product_id: null,

  queryParams: {
    startDate: { refreshModel: false },
    endDate: { refreshModel: false },
  },

  model(params) {
    let {product_id} = params;
    set(this, 'product_id', product_id);

    let hash = {
      model: this.store.find('product', product_id),
      partners: $.getJSON(`${apiURL}/data/location/${product_id}/partners/?level=country`),
    }

    return RSVP.hash(hash).then((hash) => {
      return this.departmentsDataMunging(hash);
    });

    //return this.store.find('product', params.product_id);
  },
  departmentsDataMunging(hash) {
    let {model, partners} = hash;
    let partnersMetadata = this.modelFor('application').partnerCountries;

    let allPartners = _.map(partners.data, (d) => {
      let country = partnersMetadata[d.country_id];
      let parent = partnersMetadata[country.parent_id];
      d.parent_name_en = parent.name_en;
      d.parent_name_es = parent.name_es;
      d.group = parent.id;

      return _.merge(copy(d), country);
    });

    return Ember.Object.create({
      entity: model,
      partners: allPartners,
      metaData: this.modelFor('application')
    });
  },
  setupController(controller, model) {
    //this.set('buildermodSearchService.search', null);
    this._super(controller, model);
    window.scrollTo(0, 0);
  },
  resetController(controller, isExiting) {

    if (isExiting) {
      controller.setProperties({
      });
    }
  },
  actions: {
    refreshRoute: function() {
      this.refresh();
    }
  }
});
