import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    return this.store.find('livestock', params.livestock_id);
  },
  setupController(controller, model) {
    this._super(controller, model);
    window.scrollTo(0, 0);
  },
});
