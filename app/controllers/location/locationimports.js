import Ember from 'ember';
import numeral from 'numeral';
const {computed, get:get} = Ember;

export default Ember.Controller.extend({
  i18n: Ember.inject.service(),
  featureToggle: Ember.inject.service(),
  queryParams: ['year', 'startDate', 'endDate'],

  startDate: null,
  endDate: null,

  firstYear: computed.alias('featureToggle.first_year'),
  lastYear: computed.alias('featureToggle.last_year'),
  censusYear: computed.alias('featureToggle.census_year'),
  agproductFirstYear: computed.alias('featureToggle.year_ranges.agproduct.first_year'),
  agproductLastYear: computed.alias('featureToggle.year_ranges.agproduct.last_year'),
  agcensusFirstYear: computed.alias('featureToggle.year_ranges.agcensus.first_year'),
  agcensusLastYear: computed.alias('featureToggle.year_ranges.agcensus.last_year'),
  occupationLastYear: computed.alias('featureToggle.year_ranges.occupation.last_year'),

  entityType: "location",

  validTimeseries: computed.alias('model.timeseries'),
  dotplotData: computed.oneWay('model.dotplotData'),
  occupationData: computed.oneWay('model.occupations'),
  productsData: computed.oneWay('model.productsData'),
  inmutableProductsData: computed.oneWay('model.productsData'),
  industriesData: computed.oneWay('model.industriesData'),

  rangeYears: computed('firstYear', 'lastYear', function(){

    this.set('startDate', this.get("lastYear"))
    this.set('endDate', this.get("lastYear"))

    var min = this.get("firstYear")
    var max = this.get("lastYear")
    return [...Array(max - min + 1).keys()].map(i => i + min);
  }),

  filteredProductsData: computed('model', 'startDate', 'endDate', function (){
    var products = this.get("model.productsData")

    return products.filter(item => item.year >= this.get("startDate") && item.year <= this.get("endDate"))
  }),

  filteredProductsDataTop5Import: computed('model', 'startDate', 'endDate', function (){
    var products = this.get("model.productsData")
    var filtered = products.filter(item => item.year >= this.get("startDate") && item.year <= this.get("endDate"))
    var sorted = _.slice(_.sortBy(filtered, function(d) { return -d.import_value;}), 0, 5);
    return sorted;
  }),

  filteredProductsDataTop5ImportOrder: computed('model', 'startDate', 'endDate', function (){
    return [[ 3, "desc" ]];
  }),

  filteredPartnersData: computed('model', 'startDate', 'endDate', function (){

    var partners = this.get("model.allPartners")
    return partners.filter(item => item.year >= this.get("startDate") && item.year <= this.get("endDate"))
  }),

  filteredPartnersDataTop5Import: computed('model', 'startDate', 'endDate', function (){

    var partners = this.get("model.allPartners")
    var filtered = partners.filter(item => item.year >= this.get("startDate") && item.year <= this.get("endDate"))
    var sorted = _.slice(_.sortBy(filtered, function(d) { return -d.import_value;}), 0, 5);
    return sorted;
  }),

  filteredPartnersDataTop5ImportOrder: computed('model', 'startDate', 'endDate', function (){
    return [[ 4, "desc" ]];
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
    showExports(value) {
      this.set('showExports', value);
    },
    setStartYear(){

      var year = parseInt($("#selectYear").val())

      this.set('startDate', year)
      this.set('endDate', year)
    }
  }
});

