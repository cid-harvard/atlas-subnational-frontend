import Ember from 'ember';
import numeral from 'numeral';
const {computed, observer, get:get } = Ember;

export default Ember.Controller.extend({
  i18n: Ember.inject.service(),
  featureToggle: Ember.inject.service(),
  queryParams: ['search', 'startDate', 'endDate'],
  search: null,
  rcaFilter: 'less',
  startDate: null,
  endDate: null,
  searchText: null,

  firstYear: computed.alias('featureToggle.first_year'),
  lastYear: computed.alias('featureToggle.last_year'),

  metadata: computed.alias('model.metaData'),
  source: computed.alias('model.source'), //partners
  entityId: computed.alias('model.entity.id'), //location_id
  entity: computed.alias('model.entity'), //location
  entityType: computed.alias('model.entity_type'), //location
  visualization: computed.alias('model.visualization'), //treemap or multiples
  variable: computed.alias('model.variable'), //export_value or import_value

  products: computed.alias('model.products'),
  product: computed.alias('model.product'),

  isFixedHeight: computed('model.visualization', function() {
    let vis = this.get('model.visualization');
     return _.contains(['geo', 'treemap', 'scatter', 'similarity', 'piescatter'], vis) ? true : false;
  }),
  isOneYear: computed('startDate', 'endDate', function() {
    return this.get('startDate') == this.get('endDate');
  }),
  isFiltered: computed('search', function() {
    return Boolean(this.get('search'));
  }),
  canYearToggle: computed('visualization', function() {
    let visualization = this.get('visualization');
    return visualization != 'multiples';
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
    return  [this.get('firstYear'), this.get('lastYear')];
  }),
  dateRange: computed('dateExtent', function() {
    return d3.range(this.get('dateExtent')[0], this.get('dateExtent')[1] + 1);
  }),
  legend: computed('source', function() {
    let legend = this.get(`metadata.legend.${this.get('source')}`);
    return _.values(legend);
  }),
  needsLegend: computed('model.visualization', function() {
    let vis = this.get('model.visualization');
    return _.contains(['scatter', 'similarity', 'piescatter'], vis) ? true : false;
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
    if(visualization === 'scatter' || visualization === 'similarity' || visualization === 'piescatter') {
      return `${i18nString}.${visualization}`;
    }
    return `${i18nString}.${this.get('variable')}`;
  }),
  pageTitle: computed('i18nString','entity.level', 'entity', 'product', function() {
    let i18nString = `graph_builder.page_title.${this.get('i18nString')}`;
    let variable = this.get('variable');

    if(variable == 'export_value') {
      i18nString += '.destination';
    } else if (variable == 'import_value') {
      i18nString += '.origin';
    }
    //return `where does this the 3rd moon of Alderaan, ${this.get('model.entity.name_short')}, get ${this.get('product.name_short')}`;
    return this.get('i18n').t(i18nString, {location: this.get('entity.name'), product: this.get('product.name')});
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
    let data = this.get('filteredData');
    let variable = this.get('variable');
    var sum = _.sum(data, variable);
    return '$' + numeral(sum).format('0,0') + ' USD';
  }),
  otherPossibleGraphs: computed('model.visualization', 'model.source',  function() {
    return [
      { type: 'multiples', description: 'graph_builder.change_graph.multiples_description', available: true },
      { type: 'treemap', description: 'graph_builder.change_graph.treemap_description', available: true },
      { type: 'geo', description: 'graph_builder.change_graph.geo_description', available: false },
      { type: 'scatter', description: 'graph_builder.change_graph.scatter_description', available: false },
      { type: 'similarity', description: 'graph_builder.change_graph.similarity_description', available: false },
      { type: 'piescatter', description: 'graph_builder.change_graph.scatter_description', available: false }
    ];
  }),
  varDependent: computed.alias('variable'),
  singularEntity: computed('model.entity_type', 'i18n.locale', function() {
    let entityType = this.get('model.entity_type');
    return this.get('i18n').t(`general.${entityType}`);
  }),
  immutableData: computed('model.data.[]', 'endDate', 'startDate', function() {
    return this.filterToSelectedYears(this.get('model.data'), this.get('startDate'), this.get('endDate'));
  }),
  filteredData: computed('immutableData.[]', 'search', function() {
    let data = this.get('immutableData');
    if(this.get('search')){ data = this.searchFilter(data); }
    return data;
  }),
  visualizationComponent: computed('visualization', function(){
    let visualization = this.get('visualization');
    if(visualization === 'treemap') {
      return 'vistk-treemap';
    } else if(visualization === 'multiples') {
      return 'small-multiples-set';
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
    transitionLocationProducts: function(productId) {
      let modelId = this.get('model.entity.id');
      let visualization = this.get('visualization');
      var startDate = this.get('lastYear');
      var endDate = this.get('lastYear');

      if(visualization === 'multiples') {
        startDate = this.get('firstYear');
      }

      this.set('searchText', this.get('search'));
      this.transitionToRoute(`location.visualization-product`, modelId, productId, visualization, this.get('variable'), {
        queryParams: {startDate: startDate, endDate: endDate, search: this.get('search') }
      });
    },
    toggleVisualization: function(visualization) {
      let modelId = this.get('model.entity.id');
      let productId = this.get('product.id');
      this.set('searchText', this.get('search'));

      var startDate = this.get('lastYear');
      var endDate = this.get('lastYear');

      if(visualization === 'multiples') {
        startDate = this.get('firstYear');
      }

      if(this.get('visualization') === visualization) { return; } //do nothing if currently on the same visualization
      this.transitionToRoute(`location.visualization-product`, modelId, productId, visualization, this.get('variable'), {
        queryParams: {startDate: startDate, endDate: endDate, search: this.get('search') }
      });
    }
  }
});
