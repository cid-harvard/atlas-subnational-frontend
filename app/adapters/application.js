import DS from 'ember-data';
import ENV from '../config/environment';

export default DS.RESTAdapter.extend({
  host: ENV.apiURL,
  pathForType(type) {
    if(type === 'location') {
      return 'metadata/locations';
    } else if(type === 'product') {
      return 'metadata/products';
    }
  }
});

