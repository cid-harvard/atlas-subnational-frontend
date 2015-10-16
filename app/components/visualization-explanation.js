import Ember from 'ember';
const {computed, set, get:get, on} = Ember;

export default Ember.Component.extend({
  text:'',
  isTextLarge: computed('text', function() {
    return get(this, 'text').length > 500;
  }),
  buttonText: computed('showAll', function() {
    if(get(this, 'showAll')) { return 'graph_builder.explanation.hide'; }
    return 'graph_builder.explanation.show';
  }),
  setShowAll: on('init', function() {
    set(this, 'showAll', !get(this, 'isTextLarge'));
  }),
  actions: {
    toggleText: function() {
      this.toggleProperty('showAll');
    }
  }
});

