import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    let entity_and_id = params.graph_builder_id;
    let entity = entity_and_id.split('-')[0];
    let entity_id = entity_and_id.split('-')[1];

    return this.store.find(entity, entity_id).then((model) => {
      return model.set('metaData', this.modelFor('application'));
    });
  }
});

