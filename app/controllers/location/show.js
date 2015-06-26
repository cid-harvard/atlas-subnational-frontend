import Ember from 'ember';
const {computed} = Ember;

export default Ember.Controller.extend({
  needs: 'application',
  isEnglish: computed.alias("controllers.application.isEnglish"),
  departmentsData: computed.oneWay('model.departments'),
  productsData: computed.oneWay('model.productsData'),
  timeSeriesData: computed.oneWay('model.timeseries'),

  productsSortedByExports: computed('productsData', function() {
    return _.slice(_.sortBy(this.get('productsData'), function(d) { return -d.export_value;}), 0, 50);
  }),
  name: computed('isEnglish',function() {
    if(!this.model.get('name_es')) { return this.model.get('name_en');}

    if(this.get('isEnglish')) {
      return this.model.get('name_en');
    } else {
      return this.model.get('name_es');
    }
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

