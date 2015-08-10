import Ember from 'ember';
import numeral from 'numeral';
const {computed, observer, get:get } = Ember;

Ember.depricate = function() {};
Ember.warn = function() {};

export default Ember.Controller.extend({
  i18n: Ember.inject.service(),
  needs: 'application', // inject the application controller
  queryParams: ['variable', 'search', 'rca', 'startDate', 'endDate'],
  search: null,
  rca: null,
  startDate: null,
  endDate: null,
  variable: null,
  searchText: computed.oneWay('search'),
  drawerSettingsIsOpen: false,
  drawerChangeGraphIsOpen: false,
  builderNavDropDown: Ember.String.htmlSafe("<i class='icon-cidcon_placeholder-1 builder__icon--placeholder'></i>"),

  source: computed.alias('model.source'),
  visualization: computed.alias('model.visualization'),
  dateExtent: computed('model.data.[]', function() {
    if(this.get('model.data').length) {
      return d3.extent(this.get('model.data'), function(d) { return d.year; });
    }
    return  [2007, 2013];
  }),
  name: computed.alias('model.entity.name'),
  dateRange: computed('dateExtent', function() {
    return d3.range(this.get('dateExtent')[0], this.get('dateExtent')[1] + 1);
  }),
  entity_and_id: computed('model.entity.id', 'model.entity_type', function() {
    return `${this.get('model.entity_type')}-${this.get('model.entity.id')}`;
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
  headerValue: computed('model', 'filteredData', 'variable', function() {
    let allowedVariables = ['export_value','wages', 'employment'];
    let variable = this.get('variable');
    let data = this.get('filteredData');

    if(! _.contains(allowedVariables, variable)){ return ''; }

    var sum = _.sum(data, variable);
    if(variable === 'employment') { return numeral(sum).format('0.00 a');}
    if(variable === 'export_value' || variable === 'import_value') {
      return 'USD '+ numeral(sum).format('0.00 a');
    }
    return numeral(sum).format('$ 0.00 a');
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
  years: computed('startDate', 'endDate', function() {
    let start = parseInt(this.get('startDate'), 10);
    let end = parseInt(this.get('endDate'), 10);
    if(start === end) { return start; }
    return  `${start} - ${end}`;
  }),
  varDependent: computed('variable', 'source', function() {
    // if variable exists, it is varDependent
    if(this.get('variable')) { return this.get('variable'); }
    if(this.get('source') === 'products') { return 'export_value'; }
    if(this.get('source') === 'locations') { return ''; }
    if(this.get('source') === 'industries') { return 'wages'; }
  }),
  immutableData: computed('model.data.[]','endDate', 'startDate' , function() {
    return this.filterToSelectedYears(this.get('model.data'), this.get('startDate'), this.get('endDate'));
  }),
  filteredData: computed('immutableData.[]', 'search', 'startDate', 'endDate', function() {
    let data = this.get('immutableData');
    if(this.get('search')){ data = this.searchFilter(data); }
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
    let search = _.deburr(this.get('search'));
    var regexp = new RegExp(search.replace(/(\S+)/g, function(s) { return "\\b(" + s + ")(.*)"; })
      .replace(/\s+/g, ''), "gi");
    return _.filter(data, (d) => {
      return _.deburr(Ember.getWithDefault(d,`name_${this.get('i18n').locale}`, 'foo') || 'foo').match(regexp);
    });
  },
  filterToSelectedYears: function(data, start, end) {
    let  timeRange = d3.range(start, end + 1); // Makes the range inclusive
    return _.filter(data, function(d) {
      return _.contains(timeRange, get(d, 'year'));
    });
  },
  scrollTopWhenUpdate: observer('variable', function() {
    window.scrollTo(0,0);
  }),
  actions: {
    search: function() {
      this.set('search', this.get('searchText'));
    },
    sortColumn: function() {
      this.set('filteredData', []);
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


