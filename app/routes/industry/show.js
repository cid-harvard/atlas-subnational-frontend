import Ember from 'ember';
import ENV from '../../config/environment';
const {apiURL} = ENV;
const {RSVP, getWithDefault, $} = Ember;

export default Ember.Route.extend({
  model: function(params) {
    var industriesMetadata = this.modelFor('application').industries;
    return this.store.find('industry', params.industry_id)
      .then((model) => {
        var classIds = _.pluck(_.filter(industriesMetadata, 'parent_id', parseInt(model.id)), 'id');
        var classIndustries  = _.filter(industriesMetadata, function(d) {
          return _.contains(classIds, d.parent_id);
        });
        return model.set('classIndustries', classIndustries);
      });
  },
  afterModel: function(model, transition) {
    var year = getWithDefault(transition, 'queryParams.year', 2012);

    var departments = $.getJSON(`${apiURL}/data/industry/${model.id}/participants?level=municipality`);
    return RSVP.allSettled([departments]).then((array) => {
      var departmentsData = getWithDefault(array[0], 'value.data', []);

      let locationsMetadata = this.modelFor('application').locations;

      //get products data for the department
      let departments = _.reduce(departmentsData, (memo, d) => {
        if(getWithDefault(d, 'year', 0) === year){
          let department  = locationsMetadata[d.municipality_id];
          memo.push(_.merge(d, department))
        }
        return memo;
      },[]);

      model.set('departmentsData', departments);
      return model;
    });
  },
  setupController(controller, model) {
    this._super(controller, model);
    this.controllerFor('application').set('entity', model.get('constructor.modelName'));
    this.controllerFor('application').set('entity_id', model.get('id'));
    window.scrollTo(0, 0);
  },
});

