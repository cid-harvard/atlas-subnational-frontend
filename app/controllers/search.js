import Ember from 'ember';
const {computed,  get: get} = Ember;

export default Ember.Controller.extend({
  i18n: Ember.inject.service(),
  featureToggle: Ember.inject.service(),
  needs: 'application', // inject the application controller
  queryParams: ['query','filter'],
  entity: ['product', 'industry', 'location', 'rural', 'locations_route', 'products_route'],
  query: null,
  filter: null,
  modelData: computed('model', 'filter', 'i18n.locale', function() {
    let model = get(this, 'modelCategorized');
    let filter = get(this, 'filter');
    let locale = this.get('i18n').display
    var self = this

    //console.log(filter);

    if(filter === "locations_route"){
      model = {"location": model.location}
    }

    if(filter === "product_route"){
      model = {"product": model.product}
    }


    if(model.hasOwnProperty("agproduct")){

      return Object.entries(model).map(function(models){
        var key = models[0]

        return models[1].map(function(models){

          var to_concatenate = self.get('i18n').t(`search.rural.${key}`).string

          return {id: models.id, text: models.get(`name_${locale}`) + ' - ' + to_concatenate, key: key }

        })

      }).reduce((accum, item) => accum.concat(item))

    }
    else{


      return Object.entries(model).map(function(models){

        return models[1].map(function(models){

          return {id: models.id, text: models.get(`name_short_${locale}`) + " (" + models.get('code') + ")" }
        })

      })[0]

    }

  }),
  search: computed('query', function() {
    return this.get('query');
  }),
  isRural: computed('filter', function(){
    if(this.get('filter') == 'rural'){
      return true
    }
    return false
  }),
  modelCategorized: computed('filter', 'model', function(){
    var modelCategorized = _.groupBy(this.get('model'), (x)=>x.constructor.modelName);
    //modelCategorized["locations_route"] = modelCategorized["location"];
    //modelCategorized["products_route"] = modelCategorized["product"];
    return modelCategorized;
  }),
  modelCategorizedKeys: computed('modelCategorized', function(){
    return _.keys(this.get('modelCategorized'));
  }),
  referenceKey: computed('modelCategorizedKeys', function(){
    return this.get('modelCategorizedKeys')[0];
  }),
  referenceBody: computed('modelCategorized', 'referenceKey', function(){
    return this.get(`modelCategorized.${this.get('referenceKey')}`);
  }),
  sortDefinition: ["name"],
  sortedReferenceBody: computed.sort('referenceBody', 'sortDefinition'),
  results: computed('model.[]', 'query', function() {
    if (this.get("query") === null){
      return [];
    }
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
  nonagResults: computed('results.[]', function() {
    return this.get('results').filter(function(d){
      return get(d,'constructor.modelName') === 'nonag';
    });
  }),
  livestockResults: computed('results.[]', function() {
    return this.get('results').filter(function(d){
      return get(d,'constructor.modelName') === 'livestock';
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
  subTitleText: computed('filter', function() {
    if(_.contains(this.get('entity'), this.get('filter'))){
      return `search.${this.get('filter')}.subtitle`;
    }
    return `search.subtitle`;
  }),
  titleText: computed('filter', function() {
    if(_.contains(this.get('entity'), this.get('filter'))){
      return `search.${this.get('filter')}.title`;
    }
    return `search.title`;
  }),
  bodyText: computed('filter', function() {
    if(_.contains(this.get('entity'), this.get('filter'))){
      return `search.${this.get('filter')}.body`;
    }
    return `search.body`;
  }),
  modalTitle: computed('filter', function() {
    if(_.contains(this.get('entity'), this.get('filter'))){
      return `search.modal.title.${this.get('filter')}`;
    }
    return `search.modal.title`;
  }),
  modalContent: computed('filter', function() {
    if(_.contains(this.get('entity'), this.get('filter'))){
      return `search.modal.p1.${this.get('filter')}`;
    }
    return `search.modal.p1`;
  }),
  modalLink: computed('filter', function() {
    if(_.contains(this.get('entity'), this.get('filter'))){
      return `search.modal.link.${this.get('filter')}`;
    }
    return `search.modal.link`;
  }),
  actions:{
    toggleReferenceKey(key) {
      this.set("referenceKey", key);
    },
    transitionLocation(id) {
      this.transitionToRoute('location.show', id);
    },
    transitionProduct(id) {
      this.transitionToRoute('product.show', id);
    },
    transitionLocationRoute(id) {
      this.transitionToRoute('location.route', id);
    },
    transitionIndustry(id) {
      this.transitionToRoute('industry.show', id);
    },
    transitionAgproduct(id) {
      this.transitionToRoute('agproduct.show', id);
    },
    transitionLivestock(id) {
      this.transitionToRoute('livestock.show', id);
    },
    transitionNonag(id) {
      this.transitionToRoute('nonag.show', id);
    },
    transitionLanduse(id) {
      this.transitionToRoute('landUse.show', id);
    },
  }
});

