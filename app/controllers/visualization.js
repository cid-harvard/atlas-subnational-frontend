import Ember from 'ember';
import numeral from 'numeral';
const {computed, observer, get:get } = Ember;

Ember.depricate = function() {};
Ember.warn = function() {};

export default Ember.Controller.extend({
  i18n: Ember.inject.service(),
  queryParams: ['variable', 'search', 'rca', 'startDate', 'endDate'],
  search: null,
  rca: null,
  startDate: null,
  endDate: null,
  variable: null,
  searchText: null,
  drawerSettingsIsOpen: false,
  drawerChangeGraphIsOpen: false,
  drawerQuestionsIsOpen: false,
  metadata: computed.alias('model.metaData'),
  source: computed.alias('model.source'),
  entityId: computed.alias('model.entity.id'),
  entity: computed.alias('model.entity'),
  entityType: computed.alias('model.entity_type'),
  visualization: computed.alias('model.visualization'),
  isFixedHeight: computed('model.visualization', function() {
    let vis = this.get('model.visualization');
    if (_.contains(['geo', 'treemap', 'scatter', 'similarity'], vis)) {
      return true;
    }
    return false;
  }),
  isOneYear: computed('startDate', 'endDate', function() {
    return this.get('startDate') == this.get('endDate');
  }),
  isGeo: computed('visualization', function() {
    if(this.get('visualization') === 'geo') { return true; }
    return false;
  }),
  drawerIsUnnecessary: computed('visualization','source', function() { //TODO: Depricate this out
    let visualization = this.get('visualization');
    let source = this.get('source');
    if(visualization === 'similarity' || visualization === 'scatter'){
      return true;
    }
    if(source === 'occupations') { return true; }
    return false;
  }),
  isFiltered: computed('search', function() {
    return Boolean(this.get('search'));
  }),
  isSingleYear: computed('visualization', function() {
    let visualization = this.get('visualization');
    if(visualization === 'similarity' || visualization === 'scatter'){
      return true;
    }
    return false;
  }),
  years: computed('startDate', 'endDate', function() {
    let start = parseInt(this.get('startDate'), 10);
    let end = parseInt(this.get('endDate'), 10);
    if(start === end) { return start; }
    return  `${start}–${end}`;
  }),
  dateExtent: computed('model.data.[]', function() {
    if(this.get('model.data').length) {
      return d3.extent(this.get('model.data'), function(d) { return d.year; });
    }
    return  [2008, 2013];
  }),
  dateRange: computed('dateExtent', function() {
    return d3.range(this.get('dateExtent')[0], this.get('dateExtent')[1] + 1);
  }),
  entity_and_id: computed('entityId', 'entityType', function() {
    return `${this.get('model.entity_type')}-${this.get('model.entity.id')}`;
  }),
  profileLink: computed('entityType', function() {
    return `${this.get('model.entity_type')}.show`;
  }),
  name: computed('entityType', 'model.entity.name', 'i18n.locale', function() {
    if(this.get('entityType') === 'location') {
      return this.get('model.entity.name');
    } else {
      return `${this.get('model.entity.name')} (${this.get('entity.code')})`;
    }
  }),
  i18nString: computed('entityType', 'entity', 'variable', 'i18n.locale', function() {
    let i18nString = `${this.get('entityType')}.${this.get('source')}`;
    let visualization = this.get('visualization');
    if(visualization === 'scatter' || visualization === 'similarity') {
      return `${i18nString}.${visualization}`;
    }
    return `${i18nString}.${this.get('variable')}`;
  }),
  thisLevel: computed('entity.level', 'i18n.locale', function() {
    let level = this.get('i18n').t(`location.model.${this.get('entity.level')}`);
    let thisLevel = `this ${level}`;

    if(level.string === 'Colombia') {
      thisLevel = 'Colombia';
    } else if(this.get('i18n.display') === 'es') {
      thisLevel = level.string === 'ciudad' ? `esta ${level}` :  `este ${level}`;
    }

    return thisLevel;
  }),
  pageTitle: computed('i18nString', 'thisLevel', function() {
    let i18nString = `graph_builder.page_title.${this.get('i18nString')}`;
    return this.get('i18n').t(i18nString, { thisLevel: this.get('thisLevel') });
  }),
  visualizationExplanation: computed('i18nString', function() {
    let i18nString = `graph_builder.explanation.${this.get('i18nString')}`;
    return this.get('i18n').t(i18nString);
  }),
  builderModHeader: computed('model.name','i18nString', function() {
    //locale file under graph_builder.builder_mod_header.<entity>.<source>.<variable>
    let i18nString = `graph_builder.builder_mod_header.${this.get('i18nString')}`;
    return this.get('i18n').t(i18nString, { name: this.get('model.entity.name') });
  }),
  recircCopy: computed('model','i18n.locale', 'entityType', function() {
    //locale file under graph_builder.recirc.header
    return this.get('i18n').t(`graph_builder.recirc.header.${this.get('entityType')}`);
  }),
  searchPlaceholderCopy: computed('source','i18n.locale', function() {
    return this.get('i18n').t(`graph_builder.search.placeholder.${this.get('source')}`);
  }),
  headerValue: computed('model', 'visualization','filteredData', 'variable', 'i18n.locale', function() {
    let allowedVariables = ['export_value', 'import_value', 'wages', 'employment'];
    let variable = this.get('variable');
    let data = this.get('filteredData');
    let visualization = this.get('visualization');

    if(! _.contains(allowedVariables, variable)){ return ''; }
    if(visualization === 'multiples') { return ''; }

    var sum = _.sum(data, variable);
    if(variable === 'employment') {
      return numeral(sum).format('0,00');
    }
    if(variable === 'export_value' || variable === 'import_value') {
      return '$' + numeral(sum).format('0,0') + ' USD';
    }
    return numeral(sum).format('$ 0,0');
  }),
  otherPossibleGraphs: computed('model.visualization', 'model.source',  function() {
    let vis = this.get('model.visualization');
    let source = this.get('model.source');

    if(source === 'locations' && _.contains(['geo', 'treemap', 'multiples'], vis)){
      return [
        { type: 'multiples', description: 'graph_builder.change_graph.multiples_description', available: true },
        { type: 'treemap', description: 'graph_builder.change_graph.treemap_description', available: true },
        { type: 'geo', description: 'graph_builder.change_graph.geo_description', available: true },
        { type: 'scatter', description: 'graph_builder.change_graph.scatter_description', available: false },
        { type: 'similarity', description: 'graph_builder.change_graph.similarity_description', available: false }
      ];
    } else if (source === 'occupations' && _.contains(['treemap'], vis)){
      return [
        { type: 'multiples', description: 'graph_builder.change_graph.multiples_description', available: false },
        { type: 'treemap', description: 'graph_builder.change_graph.treemap_description', available: true },
        { type: 'geo', description: 'graph_builder.change_graph.geo_description', available: false },
        { type: 'scatter', description: 'graph_builder.change_graph.scatter_description', available: false },
        { type: 'similarity', description: 'graph_builder.change_graph.similarity_description', available: false }
      ];
    } else if (vis === 'scatter'){
      return [
        { type: 'multiples', description: 'graph_builder.change_graph.multiples_description', available: false },
        { type: 'treemap', description: 'graph_builder.change_graph.treemap_description', available: false },
        { type: 'geo', description: 'graph_builder.change_graph.geo_description', available: false },
        { type: 'scatter', description: 'graph_builder.change_graph.scatter_description', available: true },
        { type: 'similarity', description: 'graph_builder.change_graph.similarity_description', available: false }
      ];
    } else if (vis === 'similarity'){
      return [
        { type: 'multiples', description: 'graph_builder.change_graph.multiples_description', available: false },
        { type: 'treemap', description: 'graph_builder.change_graph.treemap_description', available: false },
        { type: 'geo', description: 'graph_builder.change_graph.geo_description', available: false },
        { type: 'scatter', description: 'graph_builder.change_graph.scatter_description', available: false },
        { type: 'similarity', description: 'graph_builder.change_graph.similarity_description', available: true }
      ];
    } else {
      return [
        { type: 'multiples', description: 'graph_builder.change_graph.multiples_description', available: true },
        { type: 'treemap', description: 'graph_builder.change_graph.treemap_description', available: true },
        { type: 'geo', description: 'graph_builder.change_graph.geo_description', available: false },
        { type: 'scatter', description: 'graph_builder.change_graph.scatter_description', available: false },
        { type: 'similarity', description: 'graph_builder.change_graph.similarity_description', available: false }
      ];
    }
  }),
  varDependent: computed('variable', 'source', function() {
    // if variable exists, it is varDependent
    if(this.get('variable')) { return this.get('variable'); }
    let source = this.get('source');

    if(source  === 'products') {
      return 'export_value';
    } else if(source  === 'locations') {
      return '';
    } else if(source  === 'industries') {
      return 'wages';
    }
  }),
  singularEntity: computed('model.entity_type', 'i18n.locale', function() {
    let entityType = this.get('model.entity_type');
    return this.get('i18n').t(`general.${entityType}`);
  }),
  immutableData: computed('model.data.[]','endDate', 'startDate' , function() {
    return this.filterToSelectedYears(this.get('model.data'), this.get('startDate'), this.get('endDate'));
  }),
  filteredData: computed('immutableData.[]', 'search', 'startDate', 'endDate', 'filterRca', function() {
    let data = this.get('immutableData');
    if(this.get('search')){ data = this.searchFilter(data); }

    if(this.get('visualization') === 'scatter'){
      let rca = this.get('filterRca');
      return _.filter(data, function(d) { return d[rca] < 1;});
    }
    return data;
  }),
  filterRca: computed('source', function() {
    let source = this.get('source');
    if(source === 'products') {
      return 'export_rca';
    } else if( source === 'industries') {
      return 'rca';
    }
  }),
  visualizationComponent: computed('visualization', function(){
    let visualization = this.get('visualization');
    if( visualization === 'treemap') {
      return 'tree-map';
    } else if(visualization === 'multiples') {
      return 'small-multiples-set';
    } else if(visualization === 'scatter') {
      return 'd3plus-scatter';
    } else if(visualization === 'similarity') {
      return 'd3plus-network';
    } else if (visualization === 'geo') {
      return 'geo-map';
    }
  }),
  recircUrl: computed('model.entity_type', 'model.entity.code', function() {
    let entityType = this.get('model.entity_type');

    if(entityType === 'location') { return `assets/img/hero_images/${this.get('model.entity_type')}/${this.get('model.entity.code')}.jpg`; }
    if(entityType === 'product') { return 'assets/img/hero_images/product/product_1.jpg'; }
    if(entityType === 'industry') { return 'assets/img/hero_images/industry/industry_1.jpg'; }
  }),
  searchFilter: function(data) {
    let search = _.deburr(this.get('search'));
    var regexp = new RegExp(search.replace(/(\S+)/g, function(s) { return "\\b(" + s + ")(.*)"; })
      .replace(/\s+/g, ''), "gi");
    return _.filter(data, (d) => {
      let longName = get(d,`name_${this.get('i18n').display}`);
      let shortName = get(d,`name_short_${this.get('i18n').display}`);
      let code = get(d, 'code');
      return _.deburr(`${shortName} ${longName} ${code}`).match(regexp);
    });
  },
  filterToSelectedYears: function(data, start, end) {
    let  timeRange = d3.range(parseInt(start), parseInt(end) + 1); // Makes the range inclusive
    return _.filter(data, function(d) {
      return _.contains(timeRange, get(d, 'year'));
    });
  },
  scrollTopWhenUpdate: observer('variable', function() {
    window.scrollTo(0,0);
  }),
  actions: {
    resetSearch: function() {
      this.set('search', null);
      this.set('searchText', null);
    },
    search: function() {
      this.set('search', this.get('searchText'));
    },
    toggleVisualization: function(visualization) {
      let model = this.get('model');
      let graph_builder_id = `${model.entity_type}-${model.entity.id}`;
      this.set('drawerChangeGraphIsOpen', false); // Close graph change drawer
      this.set('searchText', this.get('search'));

      var startDate = 2013;
      var endDate = 2013;

      if(visualization === 'multiples') {
        startDate = 2008;
        endDate = 2013;
      }

      if(this.get('visualization') === visualization) { return; } //do nothing if currently on the same visualization
      this.transitionToRoute('visualization', graph_builder_id, model.source, visualization, {
        queryParams: { variable: this.get('variable'), startDate: startDate, endDate: endDate, search: this.get('search') }
      });
    },
    changeQuestion: function() {
      this.set('drawerQuestionsIsOpen', false); // Close question change drawer
    },
    toggleDrawerSettings: function() {
      this.set('drawerChangeGraphIsOpen', false); // Turn off other drawers
      this.set('drawerQuestionsIsOpen', false); // Turn off other drawers
      this.toggleProperty('drawerSettingsIsOpen'); // toggle on 'Settings'
    },
    toggleDrawerChangeGraph: function() {
      this.set('drawerSettingsIsOpen', false); // Turn off other drawers
      this.set('drawerQuestionsIsOpen', false); // Turn off other drawers
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


