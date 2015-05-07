import Ember from 'ember';
const {computed} = Ember;

export default Ember.Controller.extend({
  activeStep: 3,
  stepStories: computed(function() {
    return [
      { index: 1 , text: this.t('stepper.0')},
      { index: 2 , text: this.t('stepper.1')},
      { index: 3 , text: this.t('stepper.2', this.get('model.name'), this.get('model.name'))},
      { index: 4 , text: this.t('stepper.0', this.get('model.name'))}
    ]
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
