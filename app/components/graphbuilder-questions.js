import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    closeDrawer() {
      this.set('isOpen', false);
    }
  }
});

