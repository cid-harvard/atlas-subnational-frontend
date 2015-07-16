import Ember from 'ember';
const {computed, observer, get:get } = Ember;

export default Ember.Controller.extend({
  i18n: Ember.inject.service(),
  needs: 'application', // inject the application controller
  queryParams: ['variable', 'search', 'rca', 'startDate', 'endDate'],
  search: null,
  rca: null,
  startDate: 2007,
  endDate: 2013,
  variable: null,
  searchText: computed.oneWay('search'),
  drawerSettingsIsOpen: false,
  drawerChangeGraphIsOpen: false,
  builderNavDropDown: Ember.String.htmlSafe("<i class='icon-cidcon_placeholder-1 builder__icon--placeholder'></i>"),

  immutableData: computed.alias('model.data.[]'),
  source: computed.alias('model.source'),
  visualization: computed.alias('model.visualization'),
  dateRange: computed.alias('model.dateRange'),
  name: computed.alias('model.entity.name'),
  entity_and_id: computed('model.entity.id', 'model.entity_type', function() {
    return `${this.get('model.entity_type')}-${this.get('model.entity.id')}`;
  }),
  // observer the Query Params and set the links on the side nav
  setSideNav: observer('entity_type', 'entity.id', function() {
    var applicationController = this.get('controllers.application');
    applicationController.set('entity', this.get('entity_type'));
    applicationController.set('entity_id', this.get('entity.id'));
    applicationController.set('entity_and_id', this.get('entity_and_id'));
  }),

  pageTitle: computed('model','variable','i18n.locale', function() {
    //locale file under graph_builder.page_title.<entity>.<source>.<variable>
    let i18nString = `graph_builder.page_title.${this.get('model.entity_type')}.${this.get('source')}`;
    let visualization = this.get('visualization');
    if( visualization === 'scatter' || visualization === 'similarity' ) {
      return this.get('i18n').t(`${i18nString}.${visualization}`, { name: this.get('name') });
    }
   return this.get('i18n').t(`${i18nString}.${this.get('variable')}`, { name: this.get('name'), level: this.get('model.entity._level') });
  }),
  builderModHeader: computed('model','variable','i18n.locale', function() {
    //locale file under graph_builder.builder_mod_header.<entity>.<source>.<variable>
    let i18nString = `graph_builder.builder_mod_header.${this.get('model.entity_type')}.${this.get('source')}`;
    let visualization = this.get('visualization');
    if( visualization === 'scatter' || visualization === 'similarity' ) {
      return this.get('i18n').t(`${i18nString}.${visualization}`, { name: this.get('model.entity.name') });
    }
    return this.get('i18n').t(`${i18nString}.${this.get('variable')}`, { name: this.get('model.entity.name') });
  }),
  otherPossibleGraphs: computed('model.visualization', 'model.source',  function() {
    let vis = this.get('model.visualization');
    let source = this.get('model.source');
    if(source === 'locations' && _.contains(['geo', 'treemap', 'multiples'], vis)){
      return ['geo', 'treemap', 'multiples'];
    } else if (_.contains(['treemap', 'multiples'], vis)){
      return ['treemap', 'multiples'];
    }
    return [vis];
  }),
  years: computed('startDate','endDate', function() {
    let start = this.get('startDate');
    let end = this.get('endDate'); //range is Start to End -1
    if(start === end) { return start; }
    return  `01/01/${start} - 01/01/${end}`;
  }),
  varDependent: computed('variable', 'source', function() {
    if(this.get('source') === 'products') { return 'export_value'; }
    if(this.get('source') === 'location') { return ''; }
    if(this.get('variable')) { return this.get('variable'); }
  }),
  filteredData: computed('immutableData.[]', 'search', 'startDate', 'endDate', function() {
    let data = this.get('immutableData');
    if(this.get('search')){ data = this.searchFilter(data); }
    data = this.filterToSelectedYears(data);
    return data;
  }),
  isGeo: computed('visualization', function() {
    if(this.get('visualization') === 'geo') { return true; }
    return false;
  }),
  builderNavType: computed('model.entity_type', function() {
    return`partials/${this.get('model.entity_type')}-builder-nav`;
  }),
  visualizationComponent: computed('visualization', function(){
    let visualization = this.get('visualization');
    if( visualization === 'treemap') {
      return 'd3plus-tree-map';
    } else if(visualization === 'multiples') {
      return 'multiples-graph';
    } else if(visualization === 'scatter') {
      return 'd3plus-scatter';
    } else if(visualization === 'similarity') {
      return 'd3plus-network';
    } else if (visualization === 'geo') {
      return 'geo-map';
    }
  }),
  searchFilter: function(data) {
    let search = this.get('search');
    var regexp = new RegExp(search.replace(/(\S+)/g, function(s) { return "\\b(" + s + ")(.*)"; })
      .replace(/\s+/g, ''), "gi");
    return _.filter(data, (d) => {
      return (get(d,`name_${this.get('i18n').locale}`) || '').match(regexp) || get(d, 'code').match(regexp);
    });
  },
  filterToSelectedYears: function(data) {
    let timeRange = d3.range(this.get('startDate'), this.get('endDate'));
    return _.filter(data, (d) => {
      return _.contains(timeRange, get(d, 'year'));
    });
  },
  init: function(){
    this._super(this, arguments);
    Ember.run.scheduleOnce('afterRender', this , function() {
      var applicationController = this.get('controllers.application');
      applicationController.set('entity', this.get('model.entity_type'));
      applicationController.set('entity_id', this.get('model.entity.id'));
      applicationController.set('entity_and_id', this.get('entity_and_id'));
    });
  },
  scrollTopWhenUpdate: observer('variable', function() {
    window.scrollTo(0,0);
  }),
  actions: {
    search: function() {
      this.set('search', this.get('searchText'));
    },
    toggleVisualization: function(visualization) {
      let model = this.get('model');
      let graph_builder_id = `${model.entity_type}-${model.entity.id}`;
      this.set('drawerChangeGraphIsOpen', false); // Turn off other drawers
      this.transitionToRoute('visualization', graph_builder_id, model.source, visualization, {
        queryParams: { variable: this.get('variable') }
      });
    },
    toggleDrawerSettings: function() {
      this.set('drawerChangeGraphIsOpen', false); // Turn off other drawers
      this.toggleProperty('drawerSettingsIsOpen'); // toggle on 'Settings'
    },
    toggleDrawerChangeGraph: function() {
      this.set('drawerSettingsIsOpen', false); // Turn off other drawers
      this.toggleProperty('drawerChangeGraphIsOpen'); // toggle on 'Change Graph'
    },
    zoomOut: function() {
      if(this.get('zoom') === 1) { this.decrementProperty('zoom'); }
    },
    zoomIn: function() {
      if(this.get('zoom') === 0) { this.incrementProperty('zoom'); }
    }
  }
});


