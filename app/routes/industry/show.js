import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    return this.store.find('industry', params.industry_id);
  },
  afterModel: function(model) {
    var industriesMetadata = this.modelFor('application').industries;
    var classIds = _.pluck(_.filter(industriesMetadata, 'parent_id', parseInt(model.id)), 'id');
    var classIndustries  = _.filter(industriesMetadata, function(d) {
      return _.contains(classIds, d.parent_id);
    });

    model.set('classIndustries', classIndustries);
  },
  setupController(controller, model) {
    this._super(controller, model);
    this.controllerFor('application').set('entity', model.get('constructor.modelName'));
    this.controllerFor('application').set('entity_id', model.get('id'));
    window.scrollTo(0, 0);
  },
});
