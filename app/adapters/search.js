import ENV from '../config/environment';


export default DS.RESTAdapter.extend({
  namespace: 'data',
  host: 'http://127.0.0.1:8001/data/search/',
  //host: 'http://127.0.0.1:5000/data/search/'
});
