import Ember from 'ember';
const {computed} = Ember;

export default Ember.Route.extend({
  i18n: Ember.inject.service(),
  firstYear: computed.alias('i18n.firstYear'),
  lastYear: computed.alias('i18n.lastYear'),

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
    this.controllerFor('application').set('entity_level', model.get('entity.level'));

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
        startDate: this.get('firstYear'),
        endDate: this.get('lastYear')
      });
    }
  }
});

