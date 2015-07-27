import Ember from 'ember';
const {computed} = Ember;

export default Ember.Component.extend({
  tagName: 'li',
  classNames: ['stepper__item'],
  classNameBindings: ['isActive:stepper__item--is--active'],
  activeStepIndex: computed('parentController.activeStep', function() {
    return this.get('parentController.activeStep');
  }),
  isActive: computed('story.index', 'activeStepIndex', function() {
    return this.get('story.index') === this.get('activeStepIndex');
  }),
  i18nString: computed('story.index', function() {
    return `location.show.stepper.${this.get('story.index')}`;
  })
});
