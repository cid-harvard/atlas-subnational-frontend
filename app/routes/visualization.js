import Ember from 'ember';

export default Ember.Route.extend({
  queryParams: {
    variable: { refreshModel: true }, // The dimension of the source that the user cares about
                                      // (export_value, import_value, wages, employment, rca)
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
    source.set('metaData', this.modelFor('application'));

    return source;
  },
  setupController(controller, model) {
    this._super(controller, model);
    //if any  required queryParams on the controller are null
    var paramValues = _.values(controller.getProperties(model.requiredParams));
    if(_.any(paramValues, _.isNull)){
      controller.setProperties(model.get('defaultParam'));
    }
    this.controllerFor('application').set('entity', model.get('entity.constructor.modelName'));
    this.controllerFor('application').set('entity_id', model.get('entity.id'));

    controller.set('drawerSettingsIsOpen', false); // Turn off other drawers
    controller.set('drawerChangeGraphIsOpen', false); // Turn off other drawers
    controller.set('drawerQuestionsIsOpen', false); // Turn off other drawers
    controller.set('searchText', controller.get('search'));
    window.scrollTo(0, 0);
  },
  resetController: function (controller, isExiting) {
    controller.set('variable', null);

    if (isExiting) {
      controller.setProperties({
        variable: null,
        rca: null,
        startDate: 2007,
        endDate: 2013
      });
    }
  }
});

