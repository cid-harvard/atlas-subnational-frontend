import Ember from 'ember';
import numeral from 'numeral';
const {computed, get:get, observer} = Ember;

export default Ember.Controller.extend({
  i18n: Ember.inject.service(),
  featureToggle: Ember.inject.service(),
  queryParams: ['startDate', 'endDate', 'ruralOption'],

  classNone: "",
  tableClassNone: "",
  endDate: null,
  showGrap: true,
  showMultiples: false,
  showTable: false,
  canFilterCategory: false,
  source: null,
  variable: null,
  vizualization: null,
  Title: null,
  updatedDate: null,

  observerRuralOption: observer('updatedDate', function(){
    var rural_option = this.get('ruralOption');
    this.send("selectSourceId", String(rural_option));
    Ember.run.schedule("afterRender",this,function() {
      $("#selectType").val(String(rural_option));
    });
  }),

  firstYear: computed('featureToggle.census_year', function () {
    return this.get("featureToggle.year_ranges.agcensus.first_year");
  }),
  lastYear: computed('featureToggle.census_year', function () {
    return this.get("featureToggle.year_ranges.agcensus.last_year");
  }),
  firstYearTable: computed('featureToggle.first_year', function () {
    return this.get("featureToggle.first_year");
  }),
  lastYearTable: computed('featureToggle.last_year', function () {
    return this.get("featureToggle.last_year");
  }),
  dateValue: computed('featureToggle.census_year', function () {
    return this.get("featureToggle.year_ranges.agcensus.first_year");
  }),
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
  filteredData: computed('model.[]', 'endDate', 'source', function(){

    var source = this.get("source")
    var data = []

    if(source === "landUses"){
      data = this.get("model.landusesData");
    } else if(source === "farmtypes"){
      data = this.get("model.farmtypesData");
    } else if(source === "agproducts"){
      data = this.get("model.agproductsData");
    } else if(source === "nonags"){
      data = this.get("model.nonagsData");
    } else if(source === "livestock"){
      data = this.get("model.livestockData");
    }
    return data.filter(item => item.year >= parseInt(this.get("startDate")) && item.year <= parseInt(this.get("endDate")));
  }),
  filteredDataLandUsesTop5: computed('model.[]', 'endDate', function(){
    var endDate = parseInt(this.get("endDate"))
    var data = this.get("model.landusesData");
    var dataFiltered = data.filter(item => item.year === endDate);
    var sorted = _.slice(_.sortBy(dataFiltered, function(d) { return -d.area;}), 0, 5);
    return sorted
  }),
  filteredDataLandUsesTop5Order: computed('model', 'endDate', function (){
    return [[ 3, "desc" ]];
  }),


  filteredDataFarmTypesTop5: computed('model.[]', 'endDate', function(){
    var endDate = parseInt(this.get("endDate"))
    var data = this.get("model.farmtypesData");
    var dataFiltered = data.filter(item => item.year === endDate);
    var sorted = _.slice(_.sortBy(dataFiltered, function(d) { return -d.num_farms;}), 0, 5);
    return sorted
  }),
  filteredDataFarmTypesTop5Order: computed('model', 'endDate', function (){
    return [[ 1, "desc" ]];
  }),


  filteredDataLandSownTop5: computed('model.[]', 'endDate', function(){
    var endDate = parseInt(this.get("endDate"))
    var data = this.get("model.agproductsData");
    var dataFiltered = data.filter(item => item.year === endDate);
    var sorted = _.slice(_.sortBy(dataFiltered, function(d) { return -d.land_sown;}), 0, 5);
    return sorted
  }),
  filteredDataLandSownTop5Order: computed('model', 'endDate', function (){
    return [[ 2, "desc" ]];
  }),


  filteredDataLandHarvestedTop5: computed('model.[]', 'endDate', function(){
    var endDate = parseInt(this.get("endDate"))
    var data = this.get("model.agproductsData");
    var dataFiltered = data.filter(item => item.year === endDate);
    var sorted = _.slice(_.sortBy(dataFiltered, function(d) { return -d.land_harvested;}), 0, 5);
    return sorted
  }),
  filteredDataLandHarvestedTop5Order: computed('model', 'endDate', function (){
    return [[ 3, "desc" ]];
  }),

  filteredDataProductionTonsTop5: computed('model.[]', 'endDate', function(){
    var endDate = parseInt(this.get("endDate"))
    var data = this.get("model.agproductsData");
    var dataFiltered = data.filter(item => item.year === endDate);
    var sorted = _.slice(_.sortBy(dataFiltered, function(d) { return -d.production_tons;}), 0, 5);
    return sorted
  }),
  filteredDataProductionTonsTop5Order: computed('model', 'endDate', function (){
    return [[ 4, "desc" ]];
  }),


  filteredDataYieldRatioTop5: computed('model.[]', 'endDate', function(){
    var endDate = parseInt(this.get("endDate"))
    var data = this.get("model.agproductsData");
    var dataFiltered = data.filter(item => item.year === endDate);
    var sorted = _.slice(_.sortBy(dataFiltered, function(d) { return -d.yield_ratio;}), 0, 5);
    return sorted
  }),
  filteredDataYieldRatioTop5Order: computed('model', 'endDate', function (){
    return [[ 5, "desc" ]];
  }),


  filteredDataNonagsNumFarmsTop5: computed('model.[]', 'endDate', function(){
    var endDate = parseInt(this.get("endDate"))
    var data = this.get("model.nonagsData");
    var dataFiltered = data.filter(item => item.year === endDate);
    var sorted = _.slice(_.sortBy(dataFiltered, function(d) { return -d.num_farms;}), 0, 5);
    return sorted
  }),
  filteredDataNonagsNumFarmsTop5Order: computed('model', 'endDate', function (){
    return [[ 1, "desc" ]];
  }),


  filteredDataLiveStockNumTop5: computed('model.[]', 'endDate', function(){
    var endDate = parseInt(this.get("endDate"))
    var data = this.get("model.livestockData");
    var dataFiltered = data.filter(item => item.year === endDate);
    var sorted = _.slice(_.sortBy(dataFiltered, function(d) { return -d.num_livestock;}), 0, 5);
    return sorted
  }),
  filteredDataLiveStockNumTop5Order: computed('model', 'endDate', function (){
    return [[ 2, "desc" ]];
  }),


  filteredDataLiveStockNumFarmsTop5: computed('model.[]', 'endDate', function(){
    var endDate = parseInt(this.get("endDate"))
    var data = this.get("model.livestockData");
    var dataFiltered = data.filter(item => item.year === endDate);
    var sorted = _.slice(_.sortBy(dataFiltered, function(d) { return -d.num_farms;}), 0, 5);

    return sorted
  }),
  filteredDataLiveStockNumFarmsTop5Order: computed('model', 'endDate', function (){
    return [[ 1, "desc" ]];
  }),


  headerValue: computed('filteredData', 'variable', 'i18n.locale', function() {
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

  rangeYears: computed('firstYear', 'lastYear', 'source', 'variable', function(){

    var source = this.get("source");
    var variable = this.get("variable");

    if( source === "agproducts" && variable === "yield_ratio"){
      this.set('startDate', this.get("firstYear"))
      this.set('endDate', this.get("lastYear"))
      this.set('dateValue', `${this.get('firstYear')} - ${this.get('lastYear')}`)
    } else {
      this.set('startDate', this.get("lastYear"))
      this.set('endDate', this.get("lastYear"))
      this.set('dateValue', `${this.get('lastYear')}`)
    }

    var min = this.get("firstYear")
    var max = this.get("lastYear")
    return [...Array(max - min + 1).keys()].map(i => i + min);
  }),
  rangeYearsTable: computed('firstYearTable', 'lastYearTable', function(){

    //this.set('startDateTable', this.get("lastYearTable"))

    var min = this.get("firstYearTable")
    var max = this.get("lastYearTable")
    return [...Array(max - min + 1).keys()].map(i => i + min);
  }),

  filteredProductsData: computed('model', 'startDate', 'endDate', function (){
    var products = this.get("model.allProducts")

    return products.filter(item => item.year >= this.get("startDate") && item.year <= this.get("endDate"))
  }),

  filteredIndustriesData: computed('model', 'startDate', 'endDate', function (){
    var products = this.get("model.industriesData")

    return products.filter(item => item.year >= this.get("startDate") && item.year <= this.get("endDate"))
  }),
  filteredIndustriesDataTop5Employment: computed('model', 'startDate', 'endDate', function (){
    var products = this.get("model.industriesData")
    var filtered = products.filter(item => item.year >= this.get("startDate") && item.year <= this.get("endDate"))
    var sorted = _.slice(_.sortBy(filtered, function(d) { return -d.employment;}), 0, 5);
    return sorted;
  }),
  filteredIndustriesDataTop5EmploymentOrder: computed('model', 'startDate', 'endDate', function (){
    return [[ 3, "desc" ]];
  }),
  filteredIndustriesDataTop5Wages: computed('model', 'startDate', 'endDate', function (){
    var products = this.get("model.industriesData")
    var filtered = products.filter(item => item.year >= this.get("startDate") && item.year <= this.get("endDate"))
    var sorted = _.slice(_.sortBy(filtered, function(d) { return -d.wages;}), 0, 5);
    return sorted;
  }),
  filteredIndustriesDataTop5WagesOrder: computed('model', 'startDate', 'endDate', function (){
    return [[ 4, "desc" ]];
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
    showExports(value) {
      this.set('showExports', value);
    },
    setStartYear(){

      var year = parseInt($("#selectYear").val())

      this.set('startDate', year)
      this.set('endDate', year)
    },
    setStartYearTable(){

      var year = parseInt($("#selectYearTable").val())

      this.set('startDate', year)
      this.set('endDate', year)
    },
    selectSource(){
      var value = $("#selectType").val();

      if(value === "1"){
        this.set("source", "landUses");
        this.set("variable", "area");
        this.set("firstYear", this.get("featureToggle.year_ranges.agcensus.first_year"));
        this.set("lastYear", this.get("featureToggle.year_ranges.agcensus.first_year"));
        this.set("Title", "Área total:");
        this.set("vizualization", "treemap");
        this.set("canFilterCategory", false);
        this.set("showGrap", true);
        this.set("showMultiples", false);
        this.set("showTable", false);
        this.set("classNone", "");
        this.set("tableClassNone", "");
        this.set('startDate', this.get("lastYear"))
        this.set('endDate', this.get("lastYear"))
        //$("#pills-graphic-tab").trigger("click");
      } else if(value === "2"){
        this.set("source", "farmtypes");
        this.set("variable", "num_farms");
        this.set("firstYear", this.get("featureToggle.year_ranges.agcensus.first_year"));
        this.set("lastYear", this.get("featureToggle.year_ranges.agcensus.first_year"));
        this.set("Title", "UPAS y UPNAS:");
        this.set("vizualization", "treemap");
        this.set("canFilterCategory", true);
        this.set("showGrap", true);
        this.set("showMultiples", false);
        this.set("showTable", false);
        this.set("classNone", "");
        this.set("tableClassNone", "");
        this.set('startDate', this.get("lastYear"))
        this.set('endDate', this.get("lastYear"))
        //$("#pills-graphic-tab").trigger("click");
      } else if(value === "3"){
        this.set("source", "agproducts");
        this.set("variable", "land_sown");
        this.set("firstYear", this.get("featureToggle.year_ranges.agproduct.first_year"));
        this.set("lastYear", this.get("featureToggle.year_ranges.agproduct.last_year"));
        this.set("Title", "Área sembrada (hectáreas):");
        this.set("vizualization", "treemap");
        this.set("canFilterCategory", true);
        this.set("showGrap", true);
        this.set("showMultiples", false);
        this.set("showTable", false);
        this.set("classNone", "");
        this.set("tableClassNone", "");
        this.set('startDate', this.get("lastYear"))
        this.set('endDate', this.get("lastYear"))
        //$("#pills-graphic-tab").trigger("click");
      } else if(value === "4"){
        this.set("source", "agproducts");
        this.set("variable", "land_harvested");
        this.set("firstYear", this.get("featureToggle.year_ranges.agproduct.first_year"));
        this.set("lastYear", this.get("featureToggle.year_ranges.agproduct.last_year"));
        this.set("Title", "Área cosechada (hectáreas):");
        this.set("vizualization", "treemap");
        this.set("canFilterCategory", true)
        this.set("showGrap", true);
        this.set("showMultiples", false);
        this.set("showTable", false);
        this.set("classNone", "");
        this.set("tableClassNone", "");
        this.set('startDate', this.get("lastYear"))
        this.set('endDate', this.get("lastYear"))
        //$("#pills-graphic-tab").trigger("click");
      } else if(value === "5"){
        this.set("source", "agproducts");
        this.set("variable", "production_tons");
        this.set("firstYear", this.get("featureToggle.year_ranges.agproduct.first_year"));
        this.set("lastYear", this.get("featureToggle.year_ranges.agproduct.last_year"));
        this.set("Title", "Producción (toneladas):");
        this.set("vizualization", "treemap");
        this.set("canFilterCategory", true);
        this.set("showGrap", true);
        this.set("showMultiples", false);
        this.set("showTable", false);
        this.set("classNone", "");
        this.set("tableClassNone", "");
        this.set('startDate', this.get("lastYear"))
        this.set('endDate', this.get("lastYear"))
        //$("#pills-graphic-tab").trigger("click");
      } else if(value === "6"){
        this.set("source", "agproducts");
        this.set("variable", "yield_ratio");
        this.set("firstYear", this.get("featureToggle.year_ranges.agproduct.first_year"));
        this.set("lastYear", this.get("featureToggle.year_ranges.agproduct.last_year"));
        this.set("Title", "Rendimiento");
        this.set("vizualization", "multiples");
        this.set("canFilterCategory", false);
        this.set("showGrap", false);
        this.set("showMultiples", true);
        this.set("showTable", false);
        this.set("classNone", "d-none");
        this.set("tableClassNone", "");
        this.set('startDate', this.get("firstYear"))
        this.set('endDate', this.get("lastYear"))
        //$("#pills-graphic-tab").trigger("click");
      } else if(value === "7"){
        this.set("source", "nonags");
        this.set("variable", "num_farms");
        this.set("firstYear", this.get("featureToggle.year_ranges.agcensus.first_year"));
        this.set("lastYear", this.get("featureToggle.year_ranges.agcensus.first_year"));
        this.set("Title", "Numero unidades de producción:");
        this.set("vizualization", "treemap");
        this.set("canFilterCategory", false);
        this.set("showGrap", false);
        this.set("showMultiples", false);
        this.set("showTable", true);
        this.set("classNone", "d-none");
        this.set("tableClassNone", "d-none");
        this.set('startDate', this.get("lastYear"))
        this.set('endDate', this.get("lastYear"))
        //$("#pills-table-tab").trigger("click");
      } else if(value === "8"){
        this.set("source", "livestock");
        this.set("variable", "num_livestock");
        this.set("firstYear", this.get("featureToggle.year_ranges.agcensus.first_year"));
        this.set("lastYear", this.get("featureToggle.year_ranges.agcensus.first_year"));
        this.set("Title", "Número de animales:");
        this.set("vizualization", "treemap");
        this.set("canFilterCategory", false);
        this.set("showGrap", false);
        this.set("showMultiples", false);
        this.set("showTable", true);
        this.set("classNone", "d-none");
        this.set("tableClassNone", "d-none");
        this.set('startDate', this.get("lastYear"))
        this.set('endDate', this.get("lastYear"))
        //$("#pills-table-tab").trigger("click");
      } else if(value === "9"){
        this.set("source", "livestock");
        this.set("variable", "num_farms");
        this.set("firstYear", this.get("featureToggle.year_ranges.agcensus.first_year"));
        this.set("lastYear", this.get("featureToggle.year_ranges.agcensus.first_year"));
        this.set("Title", "Numero unidades de producción:");
        this.set("vizualization", "treemap");
        this.set("canFilterCategory", false);
        this.set("showGrap", false);
        this.set("showMultiples", false);
        this.set("showTable", true);
        this.set("classNone", "d-none");
        this.set("tableClassNone", "d-none");
        this.set('startDate', this.get("lastYear"))
        this.set('endDate', this.get("lastYear"))
        //$("#pills-table-tab").trigger("click");
      }

      this.set("ruralOption", parseInt(value))

      $("#selectYear").val(this.get("endDate"));

    },
    selectSourceId(value){

      value = String(value);

      if(value === "1"){
        this.set("source", "landUses");
        this.set("variable", "area");
        this.set("firstYear", this.get("featureToggle.year_ranges.agcensus.first_year"));
        this.set("lastYear", this.get("featureToggle.year_ranges.agcensus.first_year"));
        this.set("Title", "Área total:");
        this.set("vizualization", "treemap");
        this.set("canFilterCategory", false);
        this.set("showGrap", true);
        this.set("showMultiples", false);
        this.set("showTable", false);
        this.set("classNone", "");
        this.set("tableClassNone", "");
        this.set('startDate', this.get("lastYear"))
        this.set('endDate', this.get("lastYear"))
        //$("#pills-graphic-tab").trigger("click");
      } else if(value === "2"){
        this.set("source", "farmtypes");
        this.set("variable", "num_farms");
        this.set("firstYear", this.get("featureToggle.year_ranges.agcensus.first_year"));
        this.set("lastYear", this.get("featureToggle.year_ranges.agcensus.first_year"));
        this.set("Title", "UPAS y UPNAS:");
        this.set("vizualization", "treemap");
        this.set("canFilterCategory", true);
        this.set("showGrap", true);
        this.set("showMultiples", false);
        this.set("showTable", false);
        this.set("classNone", "");
        this.set("tableClassNone", "");
        this.set('startDate', this.get("lastYear"))
        this.set('endDate', this.get("lastYear"))
        //$("#pills-graphic-tab").trigger("click");
      } else if(value === "3"){
        this.set("source", "agproducts");
        this.set("variable", "land_sown");
        this.set("firstYear", this.get("featureToggle.year_ranges.agproduct.first_year"));
        this.set("lastYear", this.get("featureToggle.year_ranges.agproduct.last_year"));
        this.set("Title", "Área sembrada (hectáreas):");
        this.set("vizualization", "treemap");
        this.set("canFilterCategory", true);
        this.set("showGrap", true);
        this.set("showMultiples", false);
        this.set("showTable", false);
        this.set("classNone", "");
        this.set("tableClassNone", "");
        this.set('startDate', this.get("lastYear"))
        this.set('endDate', this.get("lastYear"))
        //$("#pills-graphic-tab").trigger("click");
      } else if(value === "4"){
        this.set("source", "agproducts");
        this.set("variable", "land_harvested");
        this.set("firstYear", this.get("featureToggle.year_ranges.agproduct.first_year"));
        this.set("lastYear", this.get("featureToggle.year_ranges.agproduct.last_year"));
        this.set("Title", "Área cosechada (hectáreas):");
        this.set("vizualization", "treemap");
        this.set("canFilterCategory", true)
        this.set("showGrap", true);
        this.set("showMultiples", false);
        this.set("showTable", false);
        this.set("classNone", "");
        this.set("tableClassNone", "");
        this.set('startDate', this.get("lastYear"))
        this.set('endDate', this.get("lastYear"))
        //$("#pills-graphic-tab").trigger("click");
      } else if(value === "5"){
        this.set("source", "agproducts");
        this.set("variable", "production_tons");
        this.set("firstYear", this.get("featureToggle.year_ranges.agproduct.first_year"));
        this.set("lastYear", this.get("featureToggle.year_ranges.agproduct.last_year"));
        this.set("Title", "Producción (toneladas):");
        this.set("vizualization", "treemap");
        this.set("canFilterCategory", true);
        this.set("showGrap", true);
        this.set("showMultiples", false);
        this.set("showTable", false);
        this.set("classNone", "");
        this.set("tableClassNone", "");
        this.set('startDate', this.get("lastYear"))
        this.set('endDate', this.get("lastYear"))
        //$("#pills-graphic-tab").trigger("click");
      } else if(value === "6"){
        this.set("source", "agproducts");
        this.set("variable", "yield_ratio");
        this.set("firstYear", this.get("featureToggle.year_ranges.agproduct.first_year"));
        this.set("lastYear", this.get("featureToggle.year_ranges.agproduct.last_year"));
        this.set("Title", "Rendimiento");
        this.set("vizualization", "multiples");
        this.set("canFilterCategory", false);
        this.set("showGrap", false);
        this.set("showMultiples", true);
        this.set("showTable", false);
        this.set("classNone", "d-none");
        this.set("tableClassNone", "");
        this.set('startDate', this.get("firstYear"))
        this.set('endDate', this.get("lastYear"))
        //$("#pills-graphic-tab").trigger("click");
      } else if(value === "7"){
        this.set("source", "nonags");
        this.set("variable", "num_farms");
        this.set("firstYear", this.get("featureToggle.year_ranges.agcensus.first_year"));
        this.set("lastYear", this.get("featureToggle.year_ranges.agcensus.first_year"));
        this.set("Title", "Numero unidades de producción:");
        this.set("vizualization", "treemap");
        this.set("canFilterCategory", false);
        this.set("showGrap", false);
        this.set("showMultiples", false);
        this.set("showTable", true);
        this.set("classNone", "d-none");
        this.set("tableClassNone", "d-none");
        this.set('startDate', this.get("lastYear"))
        this.set('endDate', this.get("lastYear"))
        //$("#pills-table-tab").trigger("click");
      } else if(value === "8"){
        this.set("source", "livestock");
        this.set("variable", "num_livestock");
        this.set("firstYear", this.get("featureToggle.year_ranges.agcensus.first_year"));
        this.set("lastYear", this.get("featureToggle.year_ranges.agcensus.first_year"));
        this.set("Title", "Número de animales:");
        this.set("vizualization", "treemap");
        this.set("canFilterCategory", false);
        this.set("showGrap", false);
        this.set("showMultiples", false);
        this.set("showTable", true);
        this.set("classNone", "d-none");
        this.set("tableClassNone", "d-none");
        this.set('startDate', this.get("lastYear"))
        this.set('endDate', this.get("lastYear"))
        //$("#pills-table-tab").trigger("click");
      } else if(value === "9"){
        this.set("source", "livestock");
        this.set("variable", "num_farms");
        this.set("firstYear", this.get("featureToggle.year_ranges.agcensus.first_year"));
        this.set("lastYear", this.get("featureToggle.year_ranges.agcensus.first_year"));
        this.set("Title", "Numero unidades de producción:");
        this.set("vizualization", "treemap");
        this.set("canFilterCategory", false);
        this.set("showGrap", false);
        this.set("showMultiples", false);
        this.set("showTable", true);
        this.set("classNone", "d-none");
        this.set("tableClassNone", "d-none");
        this.set('startDate', this.get("lastYear"))
        this.set('endDate', this.get("lastYear"))
        //$("#pills-table-tab").trigger("click");
      }

    }
  }
});

