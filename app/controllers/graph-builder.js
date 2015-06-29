import Ember from 'ember';
const {computed, get:get } = Ember;

export default Ember.Controller.extend({
  needs: 'application',
  queryParams: ['entity', 'entity_id', 'source', 'variable', 'vis', 'search'],
  source: 'products',
  vis: 'treemap',
  variable: 'export_value',
  search: null,
  searchText: computed.oneWay('search'),
  zoom: 0, // for treemap zoom

  isEnglish: computed.alias('controllers.application.isEnglish'),

  rcaFilter: function(data) {
    return _.filter(data, (d) => {
      return get(d, this.get('rca')) <= 1;
    });
  },
  searchFilter: function(data) {
    let search = this.get('search');
    var regexp = new RegExp(search.replace(/(\S+)/g, function(s) { return "\\b(" + s + ")(.*)"; })
      .replace(/\s+/g, ''), "gi");

    return _.filter(data, function(d) {
      return get(d,'name').match(regexp) || get(d, 'code').match(regexp);
    });
  },
  immutableData: computed('source', function() {
    let source = this.get('source');
    if (source  === 'products') {
      return this.get('model.productsData');
    } else if (source === 'industries') {
      return this.get('model.industriesData');
    }
  }),
  filteredData: computed('immutableData', 'vis', 'search', function() {
    let data = this.get('immutableData');
    if (this.get('vis') === 'scatter') { data = this.rcaFilter(data); }
    if (this.get('search')){ data = this.searchFilter(data); }
    return data;
  }),
  departmentLocations: computed('locationsMetadata', function(){
    return _.filter(this.get('locationsMetadata'), 'level', 'department');
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
    if (source === 'industries') { return 'rca'; }
    return 'export_rca';
  }),
  drawerSettingsIsOpen: false,
  drawerChangeGraphIsOpen: false,
  hasMore: computed('nestedData.[]', function() {
    return this.get('nestedData').length > this.firstSlice;
  }),
  actions: {
    search: function() {
      this.set('search', this.get('searchText'));
    },
    toggleVisualization: function() {
      let id = $(event.target).attr('id');

      this.send('toggleDrawerChangeGraph');

      if (id === 'changegraph__radio--treemap') {
        this.set('vis', 'treemap');
      } else if (id === 'changegraph__radio--multiples') {
        console.log('test');
        this.set('vis', 'multiples');
      } else if (id === 'changegraph__radio--geo') {
        this.set('vis', 'geo');
      } else if (id === 'changegraph__radio--scatter') {
        this.set('vis', 'scatter');
      } else if (id === 'changegraph__radio--similarity') {
        this.set('vis', 'similarity');
      }
    },
    toggleDrawerSettings: function() {
      // Turn off other drawers
      this.set('drawerChangeGraphIsOpen', false);

      // Turn on settings drawer
      this.toggleProperty('drawerSettingsIsOpen');
    },
    toggleDrawerChangeGraph: function() {
      // Turn off other drawers
      this.set('drawerSettingsIsOpen', false);

      // Turn on settings drawer
      this.toggleProperty('drawerChangeGraphIsOpen');
    },
    zoomOut: function() {
      if (this.get('zoom') === 1) { this.decrementProperty('zoom'); }
    },
    zoomIn: function() {
      if (this.get('zoom') === 0) { this.incrementProperty('zoom'); }
    }
  }
});


