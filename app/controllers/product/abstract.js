import Ember from 'ember';
const {computed} = Ember;

export default Ember.Controller.extend({
  featureToggle: Ember.inject.service(),
  queryParams: ['year'],

  startDate: null,
  endDate: null,
  rangeYears: computed('firstYear', 'lastYear', function(){

    this.set('startDate', this.get("lastYear"));
    this.set('endDate', this.get("lastYear"));

    var min = this.get("firstYear");
    var max = this.get("lastYear");
    return [...Array(max - min + 1).keys()].map(i => i + min);
  }),

  entityType: "product",
  source: "products",

  firstYear: computed.alias('featureToggle.first_year'),
  lastYear: computed.alias('featureToggle.last_year'),
  occupationsData: computed.alias('model.occupationsData'),
  modelData: computed.alias('model.entity'),
  exportDataLocations: computed('model.data', 'startDate', function (){
    return this.get("model.locationsData").filter(item => item.year === this.get("startDate"));
  }),

  filteredDataLocationsTop5Export: computed('model', 'startDate', function (){
    var products = this.get("model.locationsData")
    var filtered = products.filter(item => item.year === this.get("startDate"))
    var sorted = _.slice(_.sortBy(filtered, function(d) { return -d.export_value;}), 0, 5);
    return sorted;
  }),
  filteredDataLocationsTop5ExportOrder: computed('model', 'startDate', 'endDate', function (){
    return [[ 5, "desc" ]];
  }),

  filteredDataLocationsTop5Import: computed('model', 'startDate', function (){
    var products = this.get("model.locationsData")
    var filtered = products.filter(item => item.year === this.get("startDate"))
    var sorted = _.slice(_.sortBy(filtered, function(d) { return -d.import_value;}), 0, 5);
    return sorted;
  }),
  filteredDataLocationsTop5ImportOrder: computed('model', 'startDate', 'endDate', function (){
    return [[ 5, "desc" ]];
  }),

  exportDataCities: computed('model.data', 'startDate', function (){
    return this.get("model.citiesData").filter(item => item.year === this.get("startDate"));
  }),


  filteredDataCitiesTop5Export: computed('model.data', 'startDate', function (){
    var products = this.get("model.citiesData")
    var filtered = products.filter(item => item.year === this.get("startDate"))
    var sorted = _.slice(_.sortBy(filtered, function(d) { return -d.export_value;}), 0, 5);
    return sorted;
  }),
  filteredDataCitiesTop5ExportOrder: computed('model', 'startDate', 'endDate', function (){
    return [[ 6, "desc" ]];
  }),

  filteredDataCitiesTop5Import: computed('model.data', 'startDate', function (){
    var products = this.get("model.citiesData")
    var filtered = products.filter(item => item.year === this.get("startDate"))
    var sorted = _.slice(_.sortBy(filtered, function(d) { return -d.import_value;}), 0, 5);
    return sorted;
  }),
  filteredDataCitiesTop5ImportOrder: computed('model', 'startDate', 'endDate', function (){
    return [[ 6, "desc" ]];
  }),


  exportDataPartners: computed('model.data', 'startDate', function (){
    return this.get("model.partnersData").filter(item => item.year === this.get("startDate"));
  }),

  filteredDataPartnersTop5Export: computed('model.data', 'startDate', function (){
    var products = this.get("model.partnersData")
    var filtered = products.filter(item => item.year === this.get("startDate"))
    var sorted = _.slice(_.sortBy(filtered, function(d) { return -d.export_value;}), 0, 5);

    console.log(sorted)

    return sorted;
  }),
  filteredDataPartnersTop5ExportOrder: computed('model', 'startDate', 'endDate', function (){
    return [[ 6, "desc" ]];
  }),

  filteredDataPartnersTop5Import: computed('model.data', 'startDate', function (){
    var products = this.get("model.partnersData")
    var filtered = products.filter(item => item.year === this.get("startDate"))
    var sorted = _.slice(_.sortBy(filtered, function(d) { return -d.import_value;}), 0, 5);
    return sorted;
  }),
  filteredDataPartnersTop5ImportOrder: computed('model', 'startDate', 'endDate', function (){
    return [[ 5, "desc" ]];
  }),

  actions: {
    setStartYear(){

      var year = parseInt($("#selectYear").val());

      this.set('startDate', year);
      this.set('endDate', year);
    }
  }
});


