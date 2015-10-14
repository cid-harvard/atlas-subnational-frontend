import Ember from 'ember';
import numeral from 'numeral';
const {computed, get:get} = Ember;

export default Ember.Controller.extend({
  i18n: Ember.inject.service(),
  queryParams: ['year'],
  departmentsData: computed.oneWay('model.departments'),
  productsData: computed.oneWay('model.productsData'),
  industriesData: computed.oneWay('model.industriesData'),
  year: 2013,
  isCountry: computed('model.level', function() {
    return this.get('model.level') === 'country';
  }),
  isDepartment: computed('model.level', function() {
    return this.get('model.level') === 'department';
  }),
  locationId: computed('model.id','model.level', function() {
    if(this.get('model.level') === 'department' || this.get('model.level') === 'country') {
      return this.get('model.id');
    } else {
      return this.get('model.parent_id');
    }
  }),
  imageCode: computed('model.level', 'model.code', function() {
    if(this.get('model.level') === 'department' || this.get('model.level') === 'country') {
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
    return parseInt(get(datum, 'year')) === 2013;
  }),
  graphbuilderLink: computed('model.id', function() {
    return `location-${this.get('model.id')}`;
  }),
  validTimeseries: computed.alias('model.timeseries'),
  activeStep: 1,
  stepStories: computed(function() {
    return [ { index: 1 }, { index: 2 }, { index: 3 }, { index: 4 } ];
  }),
  actions: {
    back: function() {
      if(this.get('activeStep') > 1) {
        this.decrementProperty('activeStep');
      }
    },
    forward: function() {
      if(this.get('activeStep') < this.get('stepStories').length) {
        this.incrementProperty('activeStep');
      }
    }
 }
});

