import Ember from 'ember';
import numeral from 'numeral';
const {computed, observer, get:get } = Ember;

export default Ember.Controller.extend({
  i18n: Ember.inject.service(),
  mapService: Ember.inject.service(),
  buildermodSearchService: Ember.inject.service(),
  treemapService: Ember.inject.service(),
  featureToggle: Ember.inject.service(),
  lastDataTableUpdate: null,
  lastDataUpdate: null,
  resetFilter: null,

  queryParams: ['search', 'startDate', 'endDate', 'toolTips'],
  search: null,
  range: null,

  toolTips: null,
  rcaFilter: 'less',
  startDate: null,
  endDate: null,
  searchText: null,
  filteredMapData: null,
  drawerSettingsIsOpen: false,
  drawerChangeGraphIsOpen: false,
  drawerQuestionsIsOpen: false,

  locationsData: computed('model', function(){

    var locations = Object.entries(this.get('model.metaData.locations'))

    return locations.filter(item => item[1].level === "department").map((item) => {

      var name = get(item[1], `name_short_${this.get('i18n').display}`)

      return {id:item[1].id, text: `${name} (${item[1].code})`}
    })
  }),

  citiesData: computed('model', function(){

    var cities = Object.entries(this.get('model.metaData.locations'))

    return cities.filter(item => item[1].level === "msa" || item[1].level === "department").map((item) => {

      var name = get(item[1], `name_short_${this.get('i18n').display}`)

      return {id:item[1].id, text: `${name} (${item[1].code})`}
    })
  }),

  municipalitiesData: computed('model', function(){

    var locations = Object.entries(this.get('model.metaData.locations'))

    return locations.filter(item => item[1].level === "municipality" || item[1].level === "department").map((item) => {

      var name = get(item[1], `name_short_${this.get('i18n').display}`)

      return {id:item[1].id, text: `${name} (${item[1].code})`}
    })
  }),

  productsData: computed('model', function(){

    var locations = Object.entries(this.get('model.metaData.products'))

    return locations.filter(item => item[1].level === "4digit").map((item) => {

      var name = get(item[1], `name_short_${this.get('i18n').display}`)

      return {id:item[1].id, text: `${name} (${item[1].code})`}
    })
  }),

  landUsesData: computed('model', function(){

    var locations = Object.entries(this.get('model.metaData.landUses'))

    return locations.filter(item => item[1].level === "level2").map((item) => {

      var name = get(item[1], `name_short_${this.get('i18n').display}`)

      return {id:item[1].id, text: `${name}`}
    })
  }),

  farmtypesData: computed('model', function(){

    var locations = Object.entries(this.get('model.metaData.farmtypes'))

    return locations.filter(item => item[1].level === "level2").map((item) => {

      var name = get(item[1], `name_short_${this.get('i18n').display}`)

      return {id:item[1].id, text: `${name}`}
    })
  }),

  agproductsData: computed('model', function(){

    var locations = Object.entries(this.get('model.metaData.agproducts'))

    return locations.filter(item => item[1].level === "level3").map((item) => {

      var name = get(item[1], `name_short_${this.get('i18n').display}`)

      return {id:item[1].id, text: `${name}`}
    })
  }),

  partnersData: computed('model', function(){

    var locations = Object.entries(this.get('model.metaData.partnerCountries'))

    return locations.filter(item => item[1].level === "country").map((item) => {

      var name = get(item[1], `name_short_${this.get('i18n').display}`)

      return {id:item[1].id, text: `${name} (${item[1].code})`}
    })
  }),

  partnersDataChained: computed('model', function(){

    var locations = Object.entries(this.get('model.metaData.partnerCountries'))



    var partnerCountriesRegion = locations.filter(item => item[1].level === "region").map((item) => {

      var name = get(item[1], `name_short_${this.get('i18n').display}`)

      var chained = locations.filter(item2 => item2[1].level === "country" && item2[1].parent_id === item[1].id).map((item2) => {
        var name = get(item2[1], `name_short_${this.get('i18n').display}`)
        return {id:item2[1].id, text: `${name} (${item2[1].code})`}
      });

      return {id:item[1].id, text: `${name}`, chained: chained}
    })

    return partnerCountriesRegion

  }),

  industriesData: computed('model', function(){

    var locations = Object.entries(this.get('model.metaData.industries'))

    return locations.filter(item => item[1].level === "class").map((item) => {

      var name = get(item[1], `name_short_${this.get('i18n').display}`)

      return {id:item[1].id, text: `${name} (${item[1].code})`}
    })
  }),

  firstYear: computed('model', 'entityType', 'source', 'featureToggle', function(){
    // Handle the situation where we're not looking at a location profile but
    // at a thing-profile like livestock profile. In that case since we're only
    // looking at one data type, everything is called firstYear and lastYear so
    // we need to change those to mean the first and last year of the dataset
    // in question, not the first and last year of the product / industry
    // datasets
    let entityType = this.get("entityType");
    let source = this.get("source");
    let agCensusDatasets = this.get('featureToggle.agcensus_entities');
    let agCensusSources = this.get('featureToggle.agcensus_sources');
    var value = this.get("featureToggle.first_year");
    if (_.contains(agCensusDatasets, entityType) || (entityType === 'location' && _.contains(agCensusSources, source))){
      // If agricultural census
      value = this.get('featureToggle.year_ranges.agcensus.first_year');
    } else if (source === 'agproducts' || entityType == 'agproduct'){
      // If agproduct
      value = this.get('featureToggle.year_ranges.agproduct.first_year');
    }
    return value;
  }),
  lastYear: computed('model', 'entityType', 'source', 'featureToggle', function(){
    // See firstYear ^
    let entityType = this.get("entityType");
    let source = this.get("source");
    let agCensusDatasets = this.get('featureToggle.agcensus_entities');
    let agCensusSources = this.get('featureToggle.agcensus_sources');
    var value = this.get("featureToggle.last_year");
    if (_.contains(agCensusDatasets, entityType) || (entityType === 'location' && _.contains(agCensusSources, source))){
      // If agricultural census
      value = this.get('featureToggle.year_ranges.agcensus.last_year');
    } else if (source === 'agproducts' || entityType == 'agproduct'){
      // If agproduct
      value = this.get('featureToggle.year_ranges.agproduct.last_year');
    }
    return value;
  }),
  firstYearForMenu: computed('model', 'entityType', 'source', 'featureToggle', function(){
    let entityType = this.get("entityType");
    if(entityType == "location"){
      return this.get("featureToggle.first_year");
    } else {
      return this.get("firstYear");
    }
  }),
  lastYearForMenu: computed('model', 'entityType', 'source', 'featureToggle', function(){
    let entityType = this.get("entityType");
    if(entityType == "location"){
      return this.get("featureToggle.last_year");
    } else {
      return this.get("lastYear");
    }
  }),
  censusYear: computed.alias('featureToggle.census_year'),
  agproductFirstYear: computed.alias('featureToggle.year_ranges.agproduct.first_year'),
  agproductLastYear: computed.alias('featureToggle.year_ranges.agproduct.last_year'),
  agcensusFirstYear: computed.alias('featureToggle.year_ranges.agcensus.first_year'),
  agcensusLastYear: computed.alias('featureToggle.year_ranges.agcensus.last_year'),
  occupationLastYear: computed.alias('featureToggle.year_ranges.occupation.last_year'),

  metadata: computed.alias('model.metaData'),
  source: computed.alias('model.source'),
  entityId: computed.alias('model.entity.id'),
  entity: computed.alias('model.entity'),
  entityType: computed.alias('model.entity_type'),
  visualization: computed.alias('model.visualization'),

  variable: computed.alias('model.variable'),

  isGeo: computed.equal('visualization','geo'),
  isScatter: computed.equal('visualization','scatter'),

  filterData: computed('source', function(){

    if(this.get('source') == 'departments'){
      return this.get('locationsData')
    }
    else if(this.get('source') == 'cities'){
      return this.get('citiesData')
    }
    else if(this.get('source') == 'municipalities'){
      return this.get('municipalitiesData')
    }
    else if(this.get('source') == 'products'){
      return this.get('productsData')
    }
    else if(this.get('source') == 'partners'){
      return this.get('partnersData')
    }
    else if(this.get('source') == 'industries'){
      return this.get('industriesData')
    }
    else if(this.get('source') == 'landUses'){
      return this.get('landUsesData')
    }
    else if(this.get('source') == 'farmtypes'){
      return this.get('farmtypesData')
    }
    else if(this.get('source') == 'agproducts'){
      return this.get('agproductsData')
    }
    else{
      return []
    }
  }),
  filterDataRegion: computed('source', function(){

    if(this.get('source') == 'partners'){

      var partnersDataChained = this.get('partnersDataChained');

      return this.get('partnersDataChained');
    }
    else{
      return []
    }
  }),
  placeHolderText: computed('i18n.locale', 'source', function(){
    return this.get('i18n').t(`visualization.source.${this.get('source')}`).string
  }),

  isFixedHeight: computed('model.visualization', function() {
    let vis = this.get('model.visualization');
     return _.contains(['geo', 'treemap', 'scatter', 'similarity'], vis) ? true : false;
  }),
  isOneYear: computed('startDate', 'endDate', function() {
    return this.get('startDate') == this.get('endDate');
  }),
  isFiltered: computed('search', function() {
    return Boolean(this.get('search'));
  }),
  graph: computed('model.metaData', 'source', function() {
    let source = this.get('source');
    if(source === 'industries') {
      return this.get('model.metaData.industrySpace');
    } else if (source === 'products') {
      return this.get('model.metaData.productSpace');
    }
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
  entity_and_id: computed('entityId', 'entityType', function() {
    return `${this.get('model.entity_type')}-${this.get('model.entity.id')}`;
  }),
  profileLink: computed('entityType', function() {
    return `${this.get('model.entity_type')}.show`;
  }),
  legend: computed('source', function() {
    let legend = this.get(`metadata.legend.${this.get('source')}`);
    return _.values(legend);
  }),
  needsLegend: computed('model.visualization', function() {
    let vis = this.get('model.visualization');
    return _.contains(['scatter', 'similarity', 'geo'], vis) ? true : false;
  }),
  rca: computed('source', function() {
    let source = this.get('source');
    if(source === 'products') {
      return 'export_rca';
    } else if( source === 'industries') {
      return 'rca';
    }
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
  pageTitle: computed('i18nString','entity.level', function() {
    let i18nString = `graph_builder.page_title.${this.get('i18nString')}`;
    if(this.get('entityType') === 'location') {
      i18nString += `.${this.get('entity.level')}`;
    }
    return this.get('i18n').t(i18nString);
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
    let allowedVariables = ['export_value', 'import_value', 'wages',
      'employment', 'land_sown', 'land_harvested', 'production_tons', 'area',
      'num_farms', 'num_livestock'];
    let usdVariables = ['export_value', 'import_value'];
    let currencyVariables = ['wages'];
    let areaVariables = ['area'];
    let variable = this.get('variable');
    let data = this.get('filteredData');
    let visualization = this.get('visualization');

    if(! _.contains(allowedVariables, variable)){ return ''; }
    if(visualization === 'multiples') { return ''; }

    var sum = _.sum(data, variable);
    if(_.contains(currencyVariables, variable)) {
      return numeral(sum).format('$ 0,0');
    }
    if(_.contains(usdVariables, variable)) {
      return '$' + numeral(sum).format('0,0') + ' USD';
    }
    if(_.contains(areaVariables, variable)) {
      return numeral(sum).format('0,0') + ' ha';
    }
    return numeral(sum).format('0,00');
  }),
  otherPossibleGraphs: computed('model.visualization', 'model.source',  function() {
    let vis = this.get('model.visualization');
    let source = this.get('model.source');
    let entityType = this.get('entityType');

    if(_.contains(['landUse', 'nonag', 'livestock'], entityType)){
      if (source === "departments"){
        return [
          { type: 'multiples', description: 'graph_builder.change_graph.multiples_description', available: false },
          { type: 'treemap', description: 'graph_builder.change_graph.treemap_description', available: true },
          { type: 'geo', description: 'graph_builder.change_graph.geo_description', available: true },
          { type: 'scatter', description: 'graph_builder.change_graph.scatter_description', available: false },
          { type: 'similarity', description: 'graph_builder.change_graph.similarity_description', available: false }
        ];
      } else {
        return [
          { type: 'multiples', description: 'graph_builder.change_graph.multiples_description', available: false },
          { type: 'treemap', description: 'graph_builder.change_graph.treemap_description', available: true },
          { type: 'geo', description: 'graph_builder.change_graph.geo_description', available: false },
          { type: 'scatter', description: 'graph_builder.change_graph.scatter_description', available: false },
          { type: 'similarity', description: 'graph_builder.change_graph.similarity_description', available: false }
        ];
      }
    } else if(_.contains(['agproduct'], entityType)){
      if (this.get('variable') === 'yield_ratio'){
        return [
          { type: 'multiples', description: 'graph_builder.change_graph.multiples_description', available: true },
          { type: 'treemap', description: 'graph_builder.change_graph.treemap_description', available: false },
          { type: 'geo', description: 'graph_builder.change_graph.geo_description', available: false },
          { type: 'scatter', description: 'graph_builder.change_graph.scatter_description', available: false },
          { type: 'similarity', description: 'graph_builder.change_graph.similarity_description', available: false }
        ];
      } else if (source === "departments"){
        return [
          { type: 'multiples', description: 'graph_builder.change_graph.multiples_description', available: true },
          { type: 'treemap', description: 'graph_builder.change_graph.treemap_description', available: true },
          { type: 'geo', description: 'graph_builder.change_graph.geo_description', available: true },
          { type: 'scatter', description: 'graph_builder.change_graph.scatter_description', available: false },
          { type: 'similarity', description: 'graph_builder.change_graph.similarity_description', available: false }
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
    } else if(_.contains(['locations', 'departments'], source) && _.contains(['geo', 'treemap', 'multiples'], vis)){
      return [
        { type: 'multiples', description: 'graph_builder.change_graph.multiples_description', available: true },
        { type: 'treemap', description: 'graph_builder.change_graph.treemap_description', available: true },
        { type: 'geo', description: 'graph_builder.change_graph.geo_description', available: true },
        { type: 'scatter', description: 'graph_builder.change_graph.scatter_description', available: false },
        { type: 'similarity', description: 'graph_builder.change_graph.similarity_description', available: false }
      ];
    } else if (_.contains(['occupations', 'livestock', 'landUses', 'farmtypes', "nonags"], source)){
      return [
        { type: 'multiples', description: 'graph_builder.change_graph.multiples_description', available: false },
        { type: 'treemap', description: 'graph_builder.change_graph.treemap_description', available: true },
        { type: 'geo', description: 'graph_builder.change_graph.geo_description', available: false },
        { type: 'scatter', description: 'graph_builder.change_graph.scatter_description', available: false },
        { type: 'similarity', description: 'graph_builder.change_graph.similarity_description', available: false }
      ];
    } else if (source === "agproducts"){
      if (this.get('variable') === 'yield_ratio'){
        return [
          { type: 'multiples', description: 'graph_builder.change_graph.multiples_description', available: true },
          { type: 'treemap', description: 'graph_builder.change_graph.treemap_description', available: false },
          { type: 'geo', description: 'graph_builder.change_graph.geo_description', available: false },
          { type: 'scatter', description: 'graph_builder.change_graph.scatter_description', available: false },
          { type: 'similarity', description: 'graph_builder.change_graph.similarity_description', available: false }
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
  maxValue: computed('filteredData.[]', 'varDependent', function () {
    let varDependent = this.get('varDependent');
    return d3.max(this.get('filteredData'), function(d) { return Ember.get(d, varDependent); });
  }),
  scale: computed('maxValue', 'varDependent', function(){
    let varDependent = this.get('varDependent');
    if(_.isUndefined(varDependent)){
      return d3.scale.quantize()
        .range(d3.range(5).map(function(i) { return 'q' + i + '-5'; }));
    }
    return d3.scale.quantize()
      .domain([0, this.get('maxValue')])
      .range(d3.range(5).map(function(i) { return 'q' + i + '-5'; }));
  }),
  geoLegend: computed('scale', function(){
    let scale =  this.get('scale');
    return scale.range().map(function(t){
      let extents = scale.invertExtent(t);
      return {
        "start": numeral(extents[0]).format('0.0a'),
        "start_value": extents[0],
        "end": numeral(extents[1]).format('0.0a'),
        "end_value": extents[1],
        "class": new Ember.Handlebars.SafeString(`fa fa-circle ${scale(extents[0])}`),
        "range": `${scale(extents[0])}`
      };
    });
  }),
  singularEntity: computed('model.entity_type', 'i18n.locale', function() {
    let entityType = this.get('model.entity_type');
    return this.get('i18n').t(`general.${entityType}`);
  }),
  modelData: computed('model.data.[]', function() {
    if(this.get('source') === "departments" && this.get('visualization') === "treemap"){
      return this.get('model.cities');
    }
    return this.get('model.data');
  }),
  canUpdateBuildermodSearchService: computed('source', function(){
    if(this.get('source') === "industries"){
      return false;
    }
    return true;
  }),
  canFilterCategory: computed('source', function(){
    if(this.get('source') === "industries"){
      return true;
    }
    else if(this.get('source') === "products"){
      return true;
    }
    else if(this.get('source') === "farmtypes"){
      return true;
    }
    else if(this.get('source') === "agproducts"){
      return true;
    }
    return false;
  }),
  canFilterVcr: computed('source', 'visualization', function(){
    if(this.get('source') === "industries" && this.get('visualization') === "similarity"){
      return true;
    }
    else if(this.get('source') === "industries" && this.get('visualization') === "scatter"){
      return true;
    }
    else if(this.get('source') === "products"){
      return true;
    }
    return false;
  }),
  immutableData: computed('model.data.[]','endDate', 'startDate' , function() {
    if(this.get('source') === "departments" && this.get('visualization') === "treemap"){
      return this.filterToSelectedYears(this.get('model.cities'), this.get('startDate'), this.get('endDate'));
    }
    return this.filterToSelectedYears(this.get('model.data'), this.get('startDate'), this.get('endDate'));
  }),
  filteredData: computed('immutableData.[]', 'startDate', 'endDate', 'rcaFilter', 'buildermodSearchService.search', 'treemapService.filter_update', 'search', function() {

    if(this.get("lastDataUpdate") !== this.get("treemapService.filter_update")){

      this.set("lastDataUpdate", this.get("treemapService.filter_update"));
      var filter_updated_data = this.get("treemapService.filter_updated_data").map(item => item.item);

      return filter_updated_data;
    }

    this.set("resetFilter", new Date());

    let data = this.get('immutableData');

    this.set('search', this.get('buildermodSearchService.search'));

    //console.log(this.get('buildermodSearchService.search'));

    if(this.get('search')){ data = this.searchFilter(data, 'filteredData'); }

    if(this.get('visualization') === 'scatter'){
      let rca = this.get('rca');
      let rcaFilter = this.get('rcaFilter');
      if(rcaFilter === 'less') {
        return _.filter(data, (d) => { return _.get(d,rca) <= 1;});
      }
      if (rcaFilter === 'greater') {
        return _.filter(data, (d) => { return _.get(d,rca) > 1;});
      }
    }
    return data;
  }),
  filteredDataTable: computed('immutableData.[]', 'search', 'startDate', 'endDate', 'rcaFilter', 'mapService.range', 'treemapService.filter_update', function() {

    if(this.get("lastDataTableUpdate") !== this.get("treemapService.filter_update")){

      this.set("lastDataTableUpdate", this.get("treemapService.filter_update"));
      var filter_updated_data = this.get("treemapService.filter_updated_data").map(item => item.item);

      return filter_updated_data;
    }

    let data = this.filterToSelectedYears(this.get('model.data'), this.get('startDate'), this.get('endDate'));

    var range = this.get('mapService.range');
    var self = this;

    this.set("range", this.get("mapService.range"));

    if(range !== null){
      this.set('search', null);
      return _.filter(data, (d) => {
        let varDependent = _.get(d, self.get('varDependent'));
        return varDependent >= range[0] && varDependent <= range[1];
      });
    }

    if(this.get('search')){ data = this.searchFilter(data, 'filteredDataTable'); }

    if(this.get('visualization') === 'scatter'){
      let rca = this.get('rca');
      let rcaFilter = this.get('rcaFilter');
      if(rcaFilter === 'less') {
        return _.filter(data, (d) => { return _.get(d,rca) <= 1;});
      }
      if (rcaFilter === 'greater') {
        return _.filter(data, (d) => { return _.get(d,rca) > 1;});
      }
    }
    return data;
  }),
  visualizationComponent: computed('visualization', function(){
    this.set("range", null);
    this.set("mapService.range", null);
    let visualization = this.get('visualization');
    if(visualization === 'treemap') {
      return 'zoomable-treemap';
    } else if(visualization === 'multiples') {
      return 'small-multiples-set';
    } else if(visualization === 'scatter') {
      return 'vistk-scatterplot';
    } else if(visualization === 'similarity') {
      return 'vistk-network';
    } else if (visualization === 'geo') {
      return 'geo-map';
    }
  }),
  hideVisualization: computed('variable', 'source', function() {
    if(this.get('source') == "livestock") {
      return true;
    } else if(this.get('source') == "nonags" && this.get('variable') == "num_farms") {
      return true;
    }
    return false;
  }),
  recircUrl: computed('model.entity_type', 'model.entity.code', function() {
    let entityType = this.get('model.entity_type');

    if(entityType === 'location') { return `assets/img/hero_images/${this.get('model.entity_type')}/${this.get('model.entity.code')}.jpg`; }
    if(entityType === 'product') { return 'assets/img/hero_images/product/product_1.jpg'; }
    if(entityType === 'industry') { return 'assets/img/hero_images/industry/industry_1.jpg'; }
  }),
  searchFilter: function(data, variable) {

    let search = _.deburr(this.get('search'));

    var regexp = new RegExp(search.replace(/(\S+)/g, function(s) { return "\\b(" + s + ")(.*)"; })
      .replace(/\s+/g, ''), "gi");

    if(this.get('source') == 'departments'){

      if(variable === 'filteredData'){
        return _.filter(data, (d) => {
          let parentName = get(d,`parent_name_${this.get('i18n').display}`);
          let longName = get(d,`name_${this.get('i18n').display}`);
          let shortName = get(d,`name_short_${this.get('i18n').display}`);
          let code = get(d, 'code');

          var result_city = _.deburr(`${shortName} ${longName} ${code}`).match(regexp)

          if(result_city !== null){
            return result_city;
          }
          return _.deburr(`${parentName} ${code}`).match(regexp);
        });
      }
      else{
        return _.filter(data, (d) => {
          let longName = get(d,`name_${this.get('i18n').display}`);
          let shortName = get(d,`name_short_${this.get('i18n').display}`);
          let code = get(d, 'code');

          return _.deburr(`${shortName} ${longName} ${code}`).match(regexp);
        });
      }
    }
    else if(this.get('source') == 'cities'){

      return _.filter(data, (d) => {
        let parentName = get(d,`parent_name_${this.get('i18n').display}`);
        let longName = get(d,`name_${this.get('i18n').display}`);
        let shortName = get(d,`name_short_${this.get('i18n').display}`);
        let code = get(d, 'code');

        var result_city = _.deburr(`${shortName} ${longName} ${code}`).match(regexp)

        if(result_city !== null){
          return result_city;
        }
        return _.deburr(`${parentName} ${code}`).match(regexp);
      });
    }
    else if(this.get('source') == 'municipalities'){
      return _.filter(data, (d) => {
        let parentName = get(d,`parent_name_${this.get('i18n').display}`);
        let longName = get(d,`name_${this.get('i18n').display}`);
        let shortName = get(d,`name_short_${this.get('i18n').display}`);
        let code = get(d, 'code');

        var result_city = _.deburr(`${shortName} ${longName} ${code}`).match(regexp)

        if(result_city !== null){
          return result_city;
        }
        return _.deburr(`${parentName} ${code}`).match(regexp);
      });
    }
    else if(this.get('source') == 'industries'){

      return _.filter(data, (d) => {
        let parentName = get(d,`parent_name_${this.get('i18n').display}`);
        let longName = get(d,`name_${this.get('i18n').display}`);
        let shortName = get(d,`name_short_${this.get('i18n').display}`);
        let code = get(d, 'code');

        var result_city = _.deburr(`${shortName} ${longName} ${code}`).match(regexp)

        if(result_city !== null){
          return result_city;
        }
        return _.deburr(`${parentName} ${code}`).match(regexp);
      });
    }
    else if(this.get('source') == 'products'){
      return _.filter(data, (d) => {
        let parentName = get(d,`parent_name_${this.get('i18n').display}`);
        let longName = get(d,`name_${this.get('i18n').display}`);
        let shortName = get(d,`name_short_${this.get('i18n').display}`);
        let code = get(d, 'code');

        var result_city = _.deburr(`${shortName} ${longName} ${code}`).match(regexp)

        if(result_city !== null){
          return result_city;
        }
        return _.deburr(`${parentName} ${code}`).match(regexp);
      });
    }
    else if(this.get('source') == 'landUses'){
      return _.filter(data, (d) => {
        let parentName = get(d,`parent_name_${this.get('i18n').display}`);
        let longName = get(d,`name_${this.get('i18n').display}`);
        let shortName = get(d,`name_short_${this.get('i18n').display}`);
        let code = get(d, 'code');

        var result_city = _.deburr(`${shortName} ${longName} ${code}`).match(regexp)

        if(result_city !== null){
          return result_city;
        }
        return _.deburr(`${parentName} ${code}`).match(regexp);
      });
    }
    else if(this.get('source') == 'farmtypes'){
      return _.filter(data, (d) => {
        let parentName = get(d,`parent_name_${this.get('i18n').display}`);
        let longName = get(d,`name_${this.get('i18n').display}`);
        let shortName = get(d,`name_short_${this.get('i18n').display}`);
        let code = get(d, 'code');

        var result_city = _.deburr(`${shortName} ${longName} ${code}`).match(regexp)

        if(result_city !== null){
          return result_city;
        }
        return _.deburr(`${parentName} ${code}`).match(regexp);
      });
    }
    else if(this.get('source') == 'agproducts'){
      return _.filter(data, (d) => {
        let parentName = get(d,`parent_name_${this.get('i18n').display}`);
        let longName = get(d,`name_${this.get('i18n').display}`);
        let shortName = get(d,`name_short_${this.get('i18n').display}`);
        let code = get(d, 'code');

        var result_city = _.deburr(`${shortName} ${longName} ${code}`).match(regexp)

        if(result_city !== null){
          return result_city;
        }
        return _.deburr(`${parentName} ${code}`).match(regexp);
      });
    }
    else if(this.get('source') == 'partners'){
      var data_result = _.filter(data, (d) => {
        let parentName = get(d,`parent_name_${this.get('i18n').display}`);
        let longName = get(d,`name_${this.get('i18n').display}`);
        let shortName = get(d,`name_short_${this.get('i18n').display}`);
        let code = get(d, 'code');

        var result_city = _.deburr(`${shortName} ${longName} ${code}`).match(regexp)

        if(result_city !== null){
          return result_city;
        }
        return _.deburr(`${parentName} ${code}`).match(regexp);
      });
      return data_result
    }
    else{
      return []
    }

  },

  isCountry: computed.equal('model.entity.level', 'country'),
  isDepartment: computed.equal('model.entity.level','department'),
  isMsa: computed.equal('model.entity.level','msa'),
  isMunicipality: computed.equal('model.entity.level','municipality'),

  filterToSelectedYears: function(data, start, end) {
    let  timeRange = d3.range(parseInt(start), parseInt(end) + 1); // Makes the range inclusive
    return _.filter(data, function(d) {
      return _.contains(timeRange, get(d, 'year'));
    });
  },
  updateSearch: observer('source', 'variable', function () {
    this.set('buildermodSearchService.search', null)
  }),

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
      this.set('drawerChangeGraphIsOpen', false); // Close graph change drawer
      this.set('searchText', this.get('search'));

      var startDate = this.get('lastYear');
      var endDate = this.get('lastYear');

      // If showing over-time chart, set start date to the first available
      // year.
      if(visualization === 'multiples') {
        startDate = this.get('firstYear');
      }

      if(this.get('visualization') === visualization) { return; } //do nothing if currently on the same visualization
      this.transitionToRoute(`${model.entity_type}.visualization`, model.entity.id, model.source, visualization, this.get('variable'), {
        queryParams: {startDate: startDate, endDate: endDate, search: this.get('search') }
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


