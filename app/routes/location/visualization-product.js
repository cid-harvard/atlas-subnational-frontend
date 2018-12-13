import Ember from 'ember';
import ENV from '../../config/environment';

const {apiURL} = ENV;
const {RSVP, computed, $, set, get, copy} = Ember;

export default Ember.Route.extend({
  i18n: Ember.inject.service(),
  featureToggle: Ember.inject.service(),

  firstYear: computed.alias('featureToggle.first_year'),
  lastYear: computed.alias('featureToggle.last_year'),

  queryParams: {
    startDate: { refreshModel: false },
    endDate: { refreshModel: false },
    search: { refreshModel: false }
  },
  model(params) {
    let {location_id, visualization_type, product_id, variable} = params;
    set(this, 'location_id', location_id);
    set(this, 'source_type', 'partners');
    set(this, 'visualization_type', visualization_type);
    set(this, 'variable', variable);
    let call = {
      partners: $.getJSON(`${apiURL}/data/location/${location_id}/products/${product_id}?level=country`),
      model: this.store.find('location', location_id),
      product: this.store.find('product', product_id),
      products: this.store.findAll('product')
    };
    return RSVP.hash(call).then((hash) => {
      let {model, partners, product, products} = hash;
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
        data: Ember.A(data),
        product: product,
        products: products
      });
    });
  },
  afterModel(graphbuilderModel) {
    return graphbuilderModel.setProperties({
      visualization: get(this, 'visualization_type'),
      source: 'partners',
      metaData: this.modelFor('application'),
      variable: get(this, 'variable'),
      entity_type:'product',
    });
  }
});
