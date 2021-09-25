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
    centerId: { refreshModel: true },
  },

  model(params) {
    let {product_id} = params;
    set(this, 'product_id', product_id);

    let hash = {
      model: this.store.find('product', product_id),
      products_col: $.getJSON(`${apiURL}/data/location/0/products?level=4digit`),
    }

    return RSVP.hash(hash).then((hash) => {
      return this.departmentsDataMunging(hash);
    });

    //return this.store.find('product', params.product_id);
  },
  departmentsDataMunging(hash) {
    let {model, products_col} = hash;
    let productsMetadata = this.modelFor('application').products;
    var productsDataIndex = _.indexBy(getWithDefault(products_col, 'data', []), 'product_id');

    //get products data for the department
    let products = _.reduce(products_col.data, (memo, d) => {
      let product = productsMetadata[d.product_id];
      product.complexity = _.result(_.find(product.pci_data, { year: d.year }), 'pci');
      memo.push(_.merge(d, product));
      return memo;
    }, []);

    return Ember.Object.create({
      entity: model,
      products_col: products,
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
