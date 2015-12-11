import Ember from 'ember';
const {computed, get} = Ember;

export default Ember.Component.extend({
  i18n: Ember.inject.service(),
  tagName: 'i',
  classNames: ['changegraph__icon'],
  classNameBindings: ['iconClass', 'isChecked'],
  iconClass: computed('type', function() {
    return `icon-cidcon_${get(this, 'type')}`;
  }),
  isChecked: computed('type', 'visualization', function() {
    if(get(this, 'type') === get(this, 'visualization')) {
      return 'changegraph__icon--checked';
    }
  }),
  click: function() {
    this.sendAction('toggleVisualization',  get(this, 'type'));
  }
});

