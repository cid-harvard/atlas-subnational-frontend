import Ember from 'ember';
const {computed, observer} = Ember;

export default Ember.Controller.extend({
  needs: 'application',
  queryParams: ['entity', 'entity_id', 'source', 'variable', 'vis'],
  source: 'products',
  vis: 'treemap',
  variable: 'export_value',

  isEnglish: computed.alias('controllers.application.isEnglish'),

  scatterPlot: computed('model.industriesData', function() {
    return _.filter(this.get('model.industriesData'), function(d) { return d.rca <= 1; });
  }),
  departmentLocations: computed('locationsMetadata', function(){
    return _.filter(this.get('locationsMetadata'), 'level', 'department');
  }),
});


