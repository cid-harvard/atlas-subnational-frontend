import Ember from 'ember';

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
    source.set('defaultParam', source.get(`defaultParams.${visualization_type}`));
    source.set('requiredParams', _.keys(source.get('defaultParam')));
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
  resetController: function (controller, isExiting, transition) {
    if (isExiting) {
      controller.setProperties({
        variable: null,
        rca: null,
        startDate: null,
        endDate: null,
        search: null
      });
    }
  },
  activate() {
    this._super();
  }
});

