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
    return this.get('model');
  }.property('queryParams','model'),
  resultsLength: computed('results', function() {
    return this.get('results').get('length');
  }),
  productResults: computed('results.[]', function() {
    return this.get('results').filter(function(d){
      return get(d,'constructor.modelName') === 'product';
    });
  }),
  locationResults: computed('results.[]', function() {
    return this.get('results').filter(function(d){
      return get(d,'constructor.modelName') === 'location';
    });
  }),
  industryResults: computed('results.[]', function() {
    return this.get('results').filter(function(d){
      return get(d,'constructor.modelName') === 'industry';
    });
  }),
  placeHolderText: computed('filter', function() {
    if(_.contains(this.get('entity'), this.get('filter'))){
      return `pageheader.search_placeholder.${this.get('filter')}`;
    }
    return `pageheader.search_placeholder`;
  })

});
