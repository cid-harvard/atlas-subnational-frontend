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
  exportDataCities: computed('model.data', 'startDate', function (){
    return this.get("model.citiesData").filter(item => item.year === this.get("startDate"));
  }),
  exportDataPartners: computed('model.data', 'startDate', function (){
    return this.get("model.partnersData").filter(item => item.year === this.get("startDate"));
  }),
  actions: {
    setStartYear(){

      var year = parseInt($("#selectYear").val());

      this.set('startDate', year);
      this.set('endDate', year);
    }
  }
});


