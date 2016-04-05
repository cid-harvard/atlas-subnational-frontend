import Ember from 'ember';

export default Ember.Component.extend({
  activeKey: null,
  actions: {
    changeKey(key) {
      if(this.get('activeKey') === key) {
        this.set('activeKey', null);
      } else {
        this.set('activeKey', key);
      }
    }
  }
});
