import Ember from 'ember';
import ENV from '../config/environment';
const {apiURL} = ENV;
const {getWithDefault, $} = Ember;
//treemap, multiples, scatter, geo, similarity
export default Ember.Route.extend({
  queryParams: {
    variable: { refreshModel: false },
    rca: { refreshModel: false },
    startDate: { refreshModel: false },
    endDate: { refreshModel: false },
    search: { refreshModel: false }
  },
  model(params) {
    let source = Ember.Object.create(this.modelFor('source'));
    let visualization_type = params.visualization_type;
    source.set('visualization', visualization_type);
    source.set('defaultParam', source.get(`defaultParams.${visualization_type}`))
    source.set('requiredParams', _.keys(source.get('defaultParam')))
    return source;
  },
  setupController(controller, model) {
    this._super(controller, model);
    //if any  required queryParams on the controller are null
    if(_.any(controller.getProperties(model.requiredParams), null)){
      controller.setProperties(model.get('defaultParam'));
    }
    window.scrollTo(0, 0);
  },
  activate() {
    this._super();
  }
});

