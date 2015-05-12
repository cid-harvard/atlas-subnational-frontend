import Ember from 'ember';
const {computed} = Ember;

export default Ember.Component.extend({
  tagName: 'li',
  classNames: ['stepper__item'],
  classNameBindings: ['isActive:stepper__item--is--active'],
  activeStepIndex: computed('parentController.activeStep', function() {
    return this.get('parentController.activeStep');
  }),
  isActive: computed('story', 'activeStepIndex', function() {
    return this.get('story.index') === this.get('activeStepIndex');
  })
});
