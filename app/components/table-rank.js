import Ember from 'ember';
const { computed } = Ember;

export default Ember.Component.extend({
  isTop: computed('rank', function() {
    return this.get('rank') < 4;
  })
});
