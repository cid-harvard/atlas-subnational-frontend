import Ember from 'ember';
const {computed} = Ember;

export default Ember.Component.extend({
  i18n: Ember.inject.service(),
  classNames: ['changegraph__radiowrap'],
  tag: 'div',
  inputId:  computed('type', function() {
    return `changegraph__radio--${this.get('type')}`;
  }),
  iconClass: computed('type', function() {
    return `icon-cidcon_${this.get('type')} changegraph__icon`;
  }),
  text: computed('type', function() {
    return this.get('i18n')
      .t(`general.${this.get('type')}`);
  }),
  isChecked: computed('type', 'vis', function() {
    return this.get('type') === this.get('vis');
  }),
  actions: {
    toggleVisualization: function(visualization) {
      this.sendAction('toggleVisualization', visualization);
    },
  }
});

