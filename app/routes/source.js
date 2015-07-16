import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    let entity = this.modelFor('graph-builder');
    let source_type = params.source_type;
    return entity.get(`graphbuilder${source_type.capitalize()}`)
  },
  afterModel(model) {
    if(Ember.get(model, 'data')) {
      model.dateRange =  d3.extent(model.data, function(d) { return d.year; });
    } else {
      model.dateRange = [2007, 2013];
    }
  }
});

