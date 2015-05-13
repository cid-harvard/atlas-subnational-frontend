import Ember from 'ember';
const {computed} = Ember;

export default Ember.Controller.extend({
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
