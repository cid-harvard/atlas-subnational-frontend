import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    this.transitionTo('visualization', `product-${params.product_id}`, 'locations', 'multiples');
  },
  setupController(controller, model) {
    this._super(controller, model);
    this.controllerFor('application').set('entity', model.get('constructor.modelName'));
    this.controllerFor('application').set('entity_id', model.get('id'));
    window.scrollTo(0, 0);
  },
});
