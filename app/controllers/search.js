import Ember from 'ember';
const {computed,  get: get} = Ember;

export default Ember.Controller.extend({
  i18n: Ember.inject.service(),
  featureToggle: Ember.inject.service(),
  needs: 'application', // inject the application controller
  queryParams: ['query','filter'],
  entity: ['product', 'industry', 'location', 'rural'],
  query: null,
  filter: null,
  search: computed('query', function() {
    return this.get('query');
  }),
  results: computed('model.[]', 'query', function() {
    let search = _.deburr(this.get('query'));
    var regexp = new RegExp(search.replace(/(\S+)/g, function(s) { return "\\b(" + s + ")(.*)"; })
      .replace(/\s+/g, ''), "gi");
    return this.get('model').filter((d) => {
      let longName = get(d, 'name_long');
      let shortName = get(d,'name_short');
      let code = get(d, 'code');

      //Custom code to remove Bogota muni,  this is bad and should be removed
      if(d.get('name') === "Bogotá, D.C." && d.get('level') === 'municipality'){
        return false;
      }
      return _.deburr(`${shortName} ${longName} ${code}`).match(regexp);
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
  agproductResults: computed('results.[]', function() {
    return this.get('results').filter(function(d){
      return get(d,'constructor.modelName') === 'agproduct';
    });
  }),
  landuseResults: computed('results.[]', function() {
    return this.get('results').filter(function(d){
      return get(d,'constructor.modelName') === 'land-use';
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

