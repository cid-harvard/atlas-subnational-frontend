import Ember from 'ember';

export default Ember.Route.extend({
  queryParams: {
    query: { refreshModel: true }
  },
  model: function(transition) {
    if(transition.query == 'sparta') {
      return [
        { name: 'this is madness', breadcrumb: 'europe > greece > sparta' },
        { name: 'this is madness', breadcrumb: 'europe > greece > sparta' },
        { name: 'this is madness', breadcrumb: 'europe > greece > sparta' },
        { name: 'this is madness', breadcrumb: 'europe > greece > sparta' }
      ]
    } else {
      return []
    }
  }
});
