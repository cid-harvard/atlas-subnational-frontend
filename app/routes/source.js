import Ember from 'ember';
import ENV from '../config/environment';
const {apiURL} = ENV;
const {getWithDefault, $} = Ember;

export default Ember.Route.extend({
  model(params) {
    let entity = this.modelFor('graph-builder');
    let source_type = params.source_type;
    return entity.get(`graphbuilder${source_type.capitalize()}`).then((model) =>{
      if(model.data.length > 0) {
        model.dateRange =  d3.extent(model.data, function(d) { return d.year; });
      } else {
        model.dateRange = [2007, 2013];
      }
      return model;
    });
  }
});
