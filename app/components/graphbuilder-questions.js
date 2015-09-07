import Ember from 'ember';
const {computed} = Ember;

export default Ember.Component.extend({
  i18n: Ember.inject.service(),
  level: computed('entity', 'i18n.locale', function() {
    return this.get('i18n').t(`location.model.${this.get('entity.level')}`);
  }),
  actions: {
    closeDrawer() {
      this.set('isOpen', false);
    }
  }
});

