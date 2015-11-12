import Ember from 'ember';
const { set:set, get:get } = Ember;
export default Ember.Route.extend({
  model(params) {
    let entity_and_id = params.graph_builder_id;
    let entity = entity_and_id.split('-')[0];
    let entity_id = entity_and_id.split('-')[1];

    set(this, 'entity_and_id', entity_and_id);
    set(this, 'entity', entity);
    set(this, 'entity_id', entity_id);

    return this.store.find(entity, entity_id).then((model) => {
      set(model, 'metaData', this.modelFor('application'));
      set(model, 'entity', get(this, 'entity'));
      set(model, 'graphbuilder_id', get(this, 'entity_and_id'));
      return model;
    });
  },
  setupController(controller, model) {
    set(controller, 'entity_and_id', get(this, 'entity_and_id'));
    set(controller, 'entity', get(this, 'entity'));
    set(controller, 'entity_id', get(this, 'entity_id'));

    this._super(controller, model);
  }
});

