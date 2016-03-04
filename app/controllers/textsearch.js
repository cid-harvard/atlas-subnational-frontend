import Ember from 'ember';
const {computed,  get: get} = Ember;

export default Ember.Controller.extend({
  i18n: Ember.inject.service(),
  needs: 'application', // inject the application controller
  queryParams: ['query','filter'],
  entity: ['product', 'industry', 'location'],
  query : null,
  filter : null,
  testProp :  function (){
    return "testProp";
  }.property('queryParams'),
  results : function (){
     // console.log(this.get('i18n'));
    return this.get('model').textsearch;
  }.property('queryParams','model'),
  resultsLength: computed('results', function() {
    return this.get('results').length;
  })

});
