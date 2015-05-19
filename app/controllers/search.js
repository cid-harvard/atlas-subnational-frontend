import Ember from 'ember';
const {on} = Ember;

export default Ember.Controller.extend({
  queryParams: ['query'],
  query: null,
  setSearch: on('init', function() {
    this.set('search', this.get('query'))
  }),
  actions: {
    search: function() {
      this.transitionToRoute('search', { queryParams: { query: this.get('search')}})
    }
  }
});
