import Ember from 'ember';

export default Ember.Route.extend({
  i18n: Ember.inject.service(),
  queryParams: {
    query: { refreshModel: true },
    filter: { refreshModel: true }
  },
  model(transtion) {
    
/*    var country = this.store.find('location', { level: 'country' });
    var department = this.store.find('location', { level: 'department' });
    var msa = this.store.find('location', { level: 'msa' });
    var municipality = this.store.find('location', { level: 'municipality' });

    var products = this.store.find('product', { level: '4digit' });

    var industriesDivision = this.store.find('industry', { level: 'division' });
    var industriesClass = this.store.find('industry', { level: 'class' });

    var request = [];

    if(transition.filter === 'location'){
      request = [country, department, msa, municipality];
    } else if(transition.filter === 'industry') {
      request = [industriesDivision, industriesClass];
    } else if(transition.filter === 'product') {
      request = [products];
    } else {
      request = [industriesDivision, industriesClass, country, department, msa, municipality, products];
    }

    if(transition.query) {
      return Ember.RSVP.all(request)
        .then(function(array) {
          return _.chain(array)
            .map(function(d){ return d.content; })
            .flatten()
            .value();
        },function() {
          return [];
        });
    }
    return [];*/
     var lang = this.get('i18n').get('locale');
     console.log(lang);
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
        this.transitionTo('search', { queryParams: { query: null }});
      }
    }
  }
});
