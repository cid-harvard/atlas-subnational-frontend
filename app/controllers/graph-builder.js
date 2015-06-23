import Ember from 'ember';
const {computed} = Ember;

export default Ember.Controller.extend({
  needs: 'application',
  queryParams: ['entity', 'entity_id', 'source', 'variable', 'vis'],
  source: 'products',
  vis: 'treemap',
  variable: 'export_value',

  isEnglish: computed.alias('controllers.application.isEnglish'),

  scatterPlot: function(data) {
    return _.filter(data, (d) => {
      return Ember.get(d, this.get('rca')) <= 1;
    });
  },
  departmentLocations: computed('locationsMetadata', function(){
    return _.filter(this.get('locationsMetadata'), 'level', 'department');
  }),
  data: computed('source','vis', function() {
    let source = this.get('source');
    let data;
    if(source  === 'products') {
      data = this.get('model.productsData');
    } else if(source === 'industries') {
      data =  this.get('model.industriesData');
    }
    if(this.get('vis') === 'scatter') { return this.scatterPlot(data); }
    return data
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
  canChangeVisualization: computed('vis', function() {
    let visualization = this.get('vis');
    if (visualization === 'scatter') { return false; }
    return true;
  }),
  rca: computed('source', function() {
    let source = this.get('source');
    if(source === 'industries') { return 'rca'; }
    return 'export_rca';
  }),
  actions: {
    toggleVisualization: function() {
      if(this.get('vis') === 'treemap') {
        this.set('vis', 'multiples');
      } else {
        this.set('vis', 'treemap');
      }
    },
    toTreemap: function() {
      this.set('vis', 'treemap');
    },
    toMultiples: function() {
      this.set('vis', 'multiples');
    }
  }
});


