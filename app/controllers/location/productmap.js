import Ember from 'ember';
import numeral from 'numeral';
const {computed, get:get} = Ember;

export default Ember.Controller.extend({
  i18n: Ember.inject.service(),
  featureToggle: Ember.inject.service(),
  vistkNetworkService: Ember.inject.service(),
  vistkScatterplotService: Ember.inject.service(),
  queryParams: ['year', 'startDate', 'endDate'],

  startDate: null,
  endDate: null,
  categoriesFilterList: [],
  selectedProducts: [],


  firstYear: computed.alias('featureToggle.first_year'),
  lastYear: computed.alias('featureToggle.last_year'),
  censusYear: computed.alias('featureToggle.census_year'),
  agproductFirstYear: computed.alias('featureToggle.year_ranges.agproduct.first_year'),
  agproductLastYear: computed.alias('featureToggle.year_ranges.agproduct.last_year'),
  agcensusFirstYear: computed.alias('featureToggle.year_ranges.agcensus.first_year'),
  agcensusLastYear: computed.alias('featureToggle.year_ranges.agcensus.last_year'),
  occupationLastYear: computed.alias('featureToggle.year_ranges.occupation.last_year'),

  entityType: "location",
  variable: computed.alias('model.variable'),

  visualization: "similarity",
  metadata: computed.alias('model.metaData'),

  validTimeseries: computed.alias('model.timeseries'),
  dotplotData: computed.oneWay('model.dotplotData'),
  occupationData: computed.oneWay('model.occupations'),

  elementId: 'product_space',
  entityId: computed.alias('model.entity.id'),
  modelData: computed('model.data.[]', function() {
    console.log(this.get("model"))
    return this.get('model.products_col');
  }),
  varDependent: computed('variable', 'source', function() {
    return 'export_value';
  }),
  maxValue: computed('productsData.[]', 'varDependent', function () {
    let varDependent = this.get('varDependent');
    return d3.max(this.get('productsData'), function(d) { return Ember.get(d, varDependent); });
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

  dateExtent: computed('model.products_col.[]', function() {
    if(this.get('model.products_col').length) {
      return d3.extent(this.get('model.products_col'), function(d) { return d.year; });
    }
    return  [this.get('firstYear'), this.get('lastYear')];
  }),


  productsData: computed('model', 'endDate', 'VCRValue', 'categoriesFilterList', function () {

    var startDate = this.get("startDate");
    var endDate = this.get("endDate");
    var data = this.get("model.products_col")

    console.log(this.get("model"))

    var data_filtered = data.filter(item => item.year >= startDate && item.year <= endDate);
    return data_filtered

  }),


  filteredDataTable: computed("model", 'vistkNetworkService.updated', 'endDate', function () {

    var selectedProducts = this.get("selectedProducts")

    var productsData = this.get("productsData")
    var result = productsData.filter(item => Object.keys(selectedProducts).includes(String(item.id)))

    return result
  }),


  filteredDataTable2: computed("model", 'vistkScatterplotService.updated', 'endDate', function () {

    var selectedProducts = this.get("vistkScatterplotService.selected")

    console.log(selectedProducts)

    var productsData = this.get("productsData")
    var result = productsData.filter(item => selectedProducts.includes(item.id))

    return result
  }),


  inmutableProductsData: computed.oneWay('model.productsData'),
  industriesData: computed.oneWay('model.industriesData'),

  otherPossibleGraphs: computed('model.visualization', 'model.source',  function() {
    return [
          { type: 'similarity', description: 'graph_builder.change_graph.similarity_description', available: true, name: 'Mapa de productos' },
          { type: 'scatter', description: 'graph_builder.change_graph.scatter_description', available: true, name: 'Productos con mayor potencial' },
        ];
  }),

  rangeYears: computed('firstYear', 'lastYear', function(){

    this.set('startDate', this.get("lastYear"))
    this.set('endDate', this.get("lastYear"))

    var min = this.get("firstYear")
    var max = this.get("lastYear")
    return [...Array(max - min + 1).keys()].map(i => i + min);
  }),

  filteredProductsData: computed('model', 'startDate', 'endDate', function (){
    var products = this.get("model.allProducts")

    return products.filter(item => item.year >= this.get("startDate") && item.year <= this.get("endDate"))
  }),

  filteredPartnersData: computed('model', 'startDate', 'endDate', function (){

    var partners = this.get("model.allPartners")
    return partners.filter(item => item.year >= this.get("startDate") && item.year <= this.get("endDate"))
  }),

  hasTimeseries: computed.notEmpty('model.timeseries'),
  hasOccupationData: computed.notEmpty('model.occupations'),
  hasProductsData: computed.notEmpty('model.productsData'),
  hasIndustriesData: computed.notEmpty('model.industriesData'),

  hasAgproductsData: computed.notEmpty('model.agproductsData'),
  hasLanduseData: computed.notEmpty('model.landusesData'),

  isCountry: computed.equal('model.level', 'country'),
  isDepartment: computed.equal('model.level','department'),
  isMsa: computed.equal('model.level','msa'),
  isMunicipality: computed.equal('model.level','municipality'),
  showExports: false,

  productSpace: computed.alias('model.metaData.productSpace'),
  industrySpace: computed.alias('model.metaData.industrySpace'),

  locationId: computed('model.id','model.level', function() {
    return this.get('model.id');
  }),
  imageCode: computed('model.level', 'model.code', function() {
    if(this.get('isDepartment')  || this.get('isCountry')) {
      return this.get('model.code');
    } else {
      return (this.get('model.code')).substring(0,2);
    }
  }),
  productsSortedByExports: computed('productsData', function() {
    return _.slice(_.sortBy(this.get('productsData'), function(d) { return -d.export_value;}), 0, 50);
  }),
  exportTotal: computed('productsData', function() {
    var total = _.reduce(this.get('productsData'), function(memo, data) {
      return memo + data.export_value;
    }, 0);
    return '$' + numeral(total).format('0.0a') + ' USD';
  }),
  lastIndustryData: computed.filter('industriesData', function(datum) {
    return parseInt(get(datum, 'year')) === this.get('lastYear');
  }),
  graphbuilderLink: computed('model.id', function() {
    return `location-${this.get('model.id')}`;
  }),
  description: computed('model.name', 'i18n.locale', function() {
    return this.get(`model.description_${this.get('i18n.display')}`);
  }),
  actions: {
    toggleVisualization: function(visualization) {
      this.set("visualization", visualization)
      this.set("vistkScatterplotService.selected", [])
      this.set("vistkScatterplotService.updated", new Date())
    },
    showExports(value) {
      this.set('showExports', value);
    },
    setStartYear(){

      var year = parseInt($("#selectYear").val())

      this.set('startDate', year)
      this.set('endDate', year)
    },
  }
});

