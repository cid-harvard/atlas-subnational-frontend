import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    let entity = this.modelFor('graph-builder');
    let source_type = params.source_type;
    return entity.get(`graphbuilder${source_type.capitalize()}`);
  }
});

