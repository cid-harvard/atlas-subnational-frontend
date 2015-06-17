import Ember from 'ember';
import ENV from '../config/environment';
const {apiURL} = ENV;

export default Ember.Route.extend({
  queryParams: {
    entity: { refreshModel: true },
    entity_id: { refreshModel: true },
    data_source: { refreshModel: true }
  },
  model: function(queryParams) {
    return this.store.find(queryParams.entity, queryParams.entity_id);
  },
  afterModel: function(model, transition) {
    var data = Ember.getWithDefault(transition, 'queryParams.data_source', 'products');
    if(data  === 'products'){
      return Ember.$.getJSON(`${apiURL}data/products?location=${model.id}`)
        .then(function(data) { model.set('productsData', Ember.getWithDefault(data, 'data', [])); })
        .then(function() { window.scrollTo(0,0);});
    } else if (data === 'industries') {
      var industryData = Ember.$.getJSON(`${apiURL}data/industries?location=${model.id}`);
      var scatterPlot = Ember.$.getJSON(`${apiURL}data/industries/scatterplot?location=${model.id}&year=2012`);
      return Ember.RSVP.allSettled([industryData, scatterPlot]).then(function(array) {
        var data = array[0];
        var scatter = array[1];
        model.set('industriesData', Ember.getWithDefault(data, 'value.data', []));
        model.set('scatterPlot', Ember.getWithDefault(scatter, 'value.data', []));
      }).then(function() { window.scrollTo(0,0);});
    }
  }
});

