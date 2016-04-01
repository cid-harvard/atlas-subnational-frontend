import Ember from 'ember';
const {RSVP, getWithDefault} = Ember;

export default Ember.Route.extend({
  i18n: Ember.inject.service(),
  queryParams: {
    query: { refreshModel: true },
    filter: { refreshModel: true }
  },
  model : function (transtion){
      return this.store.find('textsearch',{filter : transtion.filter,query:transtion.query,lang:'en-col'});
  },
  model_working : function (transition){
      var lang = this.get('i18n');

      console.log(lang);
      console.log(transition);
      var promise = Ember.$.getJSON('http://127.0.0.1:8001/data/search/?query='+transition.query+'&lang='+lang.locale+'&filter='+transition.filter);
      function fullfill(r){
        //console.log(r.data[0]);
        return r;
      }
      function reject(reason){
        console.log("Could not find the results" + reason);
      }
      return promise.then(fullfill, reject);
   },
   setupController: function(controller, model) {
     this._super(controller, model);
     controller.set('metaData', this.modelFor('application'));
   },

   deactivate: function() {
     this.controller.set('textsearch', null);
 }.property('queryParams'),
 actions: {
   query: function(query) {
       console.log(query);
     if(query) {
       this.transitionTo('textsearch', { queryParams: { query: query }});
     } else {
       this.transitionTo('textsearch', { queryParams: { query: null }});
     }
   }
 }

});
