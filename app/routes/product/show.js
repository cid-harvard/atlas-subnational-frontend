import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    return this.store.find('product', params.product_id);
  },
  setupController(controller, model) {
    this._super(controller, model);
    window.scrollTo(0, 0);
  },
});
