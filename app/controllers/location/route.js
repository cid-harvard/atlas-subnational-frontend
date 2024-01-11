import Ember from 'ember';
import numeral from 'numeral';
const {computed, get:get} = Ember;

export default Ember.Controller.extend({
  i18n: Ember.inject.service(),
  featureToggle: Ember.inject.service(),
  queryParams: ['year', 'startDate', 'endDate'],

  firstYear: computed.alias('featureToggle.first_year'),
  lastYear: computed.alias('featureToggle.last_year'),
  censusYear: computed.alias('featureToggle.census_year'),
  agproductFirstYear: computed.alias('featureToggle.year_ranges.agproduct.first_year'),
  agproductLastYear: computed.alias('featureToggle.year_ranges.agproduct.last_year'),
  agcensusFirstYear: computed.alias('featureToggle.year_ranges.agcensus.first_year'),
  agcensusLastYear: computed.alias('featureToggle.year_ranges.agcensus.last_year'),
  occupationLastYear: computed.alias('featureToggle.year_ranges.occupation.last_year'),

  entityType: "location",

  productsData: computed.oneWay('model.productsData'),
  inmutableProductsData: computed.oneWay('model.productsData'),

  rangeYears: computed('firstYear', 'lastYear', function(){

    this.set('startDate', this.get("lastYear"))
    this.set('endDate', this.get("lastYear"))

    var min = this.get("firstYear")
    var max = this.get("lastYear")
    return [...Array(max - min + 1).keys()].map(i => i + min);
  }),

  filteredProductsData: computed('model', 'startDate', 'endDate', function (){
    var products = this.get("model.productsData")
    var result = products.filter(item => item.year >= parseInt(this.get("startDate")) && item.year <= parseInt(this.get("endDate")))
    return result
  }),

  filteredProductsDataTop5Export: computed('model', 'startDate', 'endDate', function (){
    var products = this.get("model.productsData")
    var filtered = products.filter(item => item.year >= this.get("startDate") && item.year <= this.get("endDate"))
    var sorted = _.slice(_.sortBy(filtered, function(d) { return -d.export_value;}), 0, 5);
    return sorted;
  }),

  filteredProductsDataTop5ExportOrder: computed('model', 'startDate', 'endDate', function (){
    return [[ 3, "desc" ]];
  }),

  filteredPartnersData: computed('model', 'startDate', 'endDate', function (){

    var partners = this.get("model.allPartners")
    return partners.filter(item => item.year >= this.get("startDate") && item.year <= this.get("endDate"))
  }),

  filteredPartnersDataTop5Export: computed('model', 'startDate', 'endDate', function (){

    var partners = this.get("model.allPartners")
    var filtered = partners.filter(item => item.year >= this.get("startDate") && item.year <= this.get("endDate"))
    var sorted = _.slice(_.sortBy(filtered, function(d) { return -d.export_value;}), 0, 5);
    return sorted;
  }),

  filteredPartnersDataTop5ExportOrder: computed('model', 'startDate', 'endDate', function (){
    return [[ 3, "desc" ]];
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

