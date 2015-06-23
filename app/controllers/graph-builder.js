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
  data: computed('source','vis', function() {
    let source = this.get('source')
    if(source  === 'products') {
      return this.get('model.productsData');
    } else if(source === 'industries') {
      return  this.get('vis') === 'scatter' ? this.get('scatterPlot') : this.get('model.industriesData');
    }
  }),
  visualizationComponent: computed('vis', function(){
    let visualization = this.get('vis');
    if ( visualization === 'treemap') {
      return 'd3plus-tree-map';
    } else if (visualization === 'multiples') {
      return 'multiples-graph';
    } else if (visualization === 'scatter') {
      return 'd3plus-scatter';
    }
  }),
  actions: {
    toTreemap: function() {
      this.set('vis', 'treemap');
    },
    toMultiples: function() {
      this.set('vis', 'multiples');
    }
  }
});


