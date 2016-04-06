import Ember from 'ember';

export default Ember.Route.extend({
  i18n: Ember.inject.service(),
  queryParams: {
    query: { refreshModel: true },
    filter: { refreshModel: true }
  },
  model: function(transtion) {
    var lang = this.get('i18n').get('locale');
    return this.store.find('textsearch',{filter : transtion.filter,query:transtion.query,lang:lang});

  },
  setupController: function(controller, model) {
    this._super(controller, model);
    controller.set('metaData', this.modelFor('application'));
  },
  deactivate: function() {
    this.controller.set('search', null);
  },
  actions: {
    query: function(query) {
      if(query) {
        this.transitionTo('search', { queryParams: { query: query }});
      } else {
          console.log(" query null");
        this.transitionTo('search', { queryParams: { query: null }});
      }
    }
  }
});
