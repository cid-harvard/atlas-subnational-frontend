import Ember from 'ember';
const {computed,  get: get} = Ember;

export default Ember.Controller.extend({
  i18n: Ember.inject.service(),
  needs: 'application', // inject the application controller
  queryParams: ['query'],
  query: null,

  results: computed('model.[]', 'query', function() {
    let search = _.deburr(this.get('query'));
    var regexp = new RegExp(search.replace(/(\S+)/g, function(s) { return "\\b(" + s + ")(.*)"; })
      .replace(/\s+/g, ''), "gi");
    return this.get('model').filter(function(d){
      return _.deburr(get(d,'name')).match(regexp) || get(d, 'code').match(regexp);
    });
  }),
  resultsLength: computed('results.[]', function() {
    return this.get('results').length;
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
  //TODO: is this needed?
  init: function(){
    this._super.apply(this, arguments);
    var applicationController = this.get('controllers.application');
    applicationController.set('entity', 'location');
    applicationController.set('entity_id', 3);
  }
});

