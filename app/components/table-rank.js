import Ember from 'ember';
const { computed } = Ember;

export default Ember.Component.extend({
  isTop: computed('rank', function() {
    return this.get('rank') < 4;
  }),
  isEmpty: computed('rank', function(){
    return this.get('rank') === null || this.get('rank') === undefined;
  })
});
