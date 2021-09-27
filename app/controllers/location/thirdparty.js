import Ember from 'ember';
import numeral from 'numeral';
const {computed, get:get, observer} = Ember;

export default Ember.Controller.extend({
  i18n: Ember.inject.service(),
  featureToggle: Ember.inject.service(),
  queryParams: ['year'],
  firstYear: computed.alias('featureToggle.first_year'),
  lastYear: computed.alias('featureToggle.last_year'),

  startDate: computed('featureToggle.last_year', function () {
    return this.get("featureToggle.last_year");
  }),



  linkDatlas: computed('startDate', function () {
    var startDate = this.get("startDate");
    return `https://atlas.cid.harvard.edu/explore?country=49&year=${startDate}`
  }),


  modelData: computed.alias('model'),


  rangeYears: computed('firstYear', 'lastYear', function(){
    var min = this.get("firstYear");
    var max = this.get("lastYear");
    return [...Array(max - min + 1).keys()].map(i => i + min);
  }),

  actions: {
    setStartYear(){

      var year = parseInt($("#selectYear").val());

      this.set('startDate', year);

    },
  }
});

