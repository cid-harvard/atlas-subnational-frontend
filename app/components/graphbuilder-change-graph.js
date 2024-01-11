import Ember from 'ember';
const {computed, get} = Ember;

export default Ember.Component.extend({
  i18n: Ember.inject.service(),
  tagName: 'div',
  classNames: ['changegraph__icon'],
  classNameBindings: ['iconClass', 'isChecked'],
  iconClass: computed('type', function() {
    return `${get(this, 'type')}`;
  }),
  isChecked: computed('type', 'visualization', function() {
    if(get(this, 'type') === get(this, 'visualization')) {
      return 'changegraph__icon--checked';
    }
  }),
  click: function() {
    this.sendAction('toggleVisualization',  get(this, 'type'));
  },
  didInsertElement: function() {
    Ember.run.scheduleOnce('afterRender',this , function() {
      tippy('.tooltip_graph', {
        theme: 'datlas',
      });
    });
  },
});

