import ENV from '../config/environment';


export default DS.RESTAdapter.extend({
  namespace: 'data',
  host: 'http://127.0.0.1:8001',
  //host: 'http://127.0.0.1:5000/data/search/'
  findAll: function(store,type) {
    // Overriding default
    var promise = Ember.$.getJSON('http://127.0.0.1:8001/data/search/?query='+transition.query+'&lang='+lang.locale+'&filter='+transition.filter);
      function fullfill(r){
        return r;
      }
      function reject(reason){
        console.log("Could not find the results" + reason);
      }
    return promise.then(fullfill, reject);
  }
});
