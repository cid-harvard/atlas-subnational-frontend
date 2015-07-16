import Ember from 'ember';
const {computed, observer} = Ember;

export default Ember.Controller.extend({
  needs: 'application',
  locale: computed.alias("controllers.application.locale"),
  queryParams: ['year'],
  departmentsData: computed.oneWay('model.departments'),
  productsData: computed.oneWay('model.productsData'),
  timeSeriesData: computed.oneWay('model.timeseries'),
  locationId: computed.readOnly('model.id'),
  year: 2013,

  setSideNav: observer('model', function() {
    var applicationController = this.get('controllers.application');
    applicationController.set('entity', 'location');
    applicationController.set('entity_id', this.get('model.id'));
    applicationController.set('entity_and_id', `location-${this.get('model.id')}`);
  }),
  productsSortedByExports: computed('productsData', function() {
    return _.slice(_.sortBy(this.get('productsData'), function(d) { return -d.export_value;}), 0, 50);
  }),
  activeStep: 0,
  stepStories: computed(function() {
    return [ { index: 0 }, { index: 1 }, { index: 2 }, { index: 3 } ];
  }),
  actions: {
    back: function() {
      if(this.get('activeStep') > 0) {
        this.decrementProperty('activeStep');
      }
    },
    forward: function() {
      if(this.get('activeStep') < this.get('stepStories').length - 1) {
        this.incrementProperty('activeStep');
      }
    }
 }
});

