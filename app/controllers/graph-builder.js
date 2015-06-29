import Ember from 'ember';
const {computed, observer, get:get } = Ember;

export default Ember.Controller.extend({
  needs: 'application', // inject the application controller
  queryParams: ['entity', 'entity_id', 'source', 'variable', 'vis', 'search'],
  source: 'products',
  vis: 'treemap',
  variable: 'export_value',
  search: null,
  searchText: computed.oneWay('search'),

  isEnglish: computed.alias('controllers.application.isEnglish'),

  // observer the Query Params and set the links on the side nav
  setSideNav: observer('entity', 'entity_id', function() {
    var applicationController = this.get('controllers.application');
    applicationController.set('entity', this.get('entity'));
    applicationController.set('entity_id', this.get('entity_id'));
  }),

  // push to i18n later sorry :(
  pageTitle: computed('variable','vis', function() {
    let variable = this.get('variable');
    let vis = this.get('vis');
    let name = this.get('model.name_en');
    if(variable === 'export_value' && vis === 'scatter') {
      return `What products have the best combination of complexity and opportunity for ${name}`;
    } else if(variable === 'export_value') {
      return `What products does ${name} export?`;
    } else if(variable === 'import_value') {
      return `What products does ${name} import?`;
    } else if(variable === 'employment') {
      return `What industries in ${name} employ the most people?`;
    } else if(variable === 'wages' && vis === 'scatter') {
      return `What industries have the best combination of complexity and opportunity for ${name}?`;
    } else if(variable === 'wages') {
      return `What industries are in ${name}?`;
    }
  }),
  // push to i18n later sorry :(
  builderModHeader: computed('variable','vis', function() {
    let variable = this.get('variable');
    if(this.get('vis') === 'scatter') { return 'Complexity and Opportunity'; }
    if(variable === 'export_value') {
      return 'Total Exports';
    } else if(variable === 'import_value') {
      return 'Total Imports';
    } else if(variable === 'employment') {
      return 'Total Employment';
    } else if(variable === 'wages') {
      return 'Total Wages';
    }
  }),

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
  immutableData: computed('source','entity', 'entity_id',function() {
    let source = this.get('source');
    if(source  === 'products') {
      return this.get('model.productsData');
    } else if(source === 'industries') {
      return this.get('model.industriesData');
    }
  }),
  filteredData: computed('immutableData.[]', 'vis', 'search', function() {
    let data = this.get('immutableData');
    if(this.get('vis') === 'scatter') { data = this.rcaFilter(data); }
    if(this.get('search')){ data = this.searchFilter(data); }
    return data;
  }),
  departmentLocations: computed('locationsMetadata', function(){
    return _.filter(this.get('locationsMetadata'), 'level', 'department');
  }),
  visualizationComponent: computed('vis', function(){
    let visualization = this.get('vis');
    if( visualization === 'treemap') {
      return 'd3plus-tree-map';
    } else if(visualization === 'multiples') {
      return 'multiples-graph';
    } else if(visualization === 'scatter') {
      return 'd3plus-scatter';
    }
  }),
  canChangeVisualization: computed('vis', function() {
    let visualization = this.get('vis');
    if(visualization === 'scatter') { return false; }
    return true;
  }),
  rca: computed('source', function() {
    let source = this.get('source');
    if(source === 'industries') { return 'rca'; }
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
    toggleVisualization: function(visualization) {
      this.send('toggleDrawerChangeGraph');
      this.set('vis', visualization);
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
      if(this.get('zoom') === 1) { this.decrementProperty('zoom'); }
    },
    zoomIn: function() {
      if(this.get('zoom') === 0) { this.incrementProperty('zoom'); }
    }
  }
});


