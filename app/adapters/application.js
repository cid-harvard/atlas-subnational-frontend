import DS from 'ember-data';
import ENV from '../config/environment';

export default DS.RESTAdapter.extend({
  host: ENV.apiURL,
  pathForType(type) {
    if(type === 'location') {
      return 'metadata/locations';
    } else if(type === 'product') {
      return 'metadata/products';
    } else if(type === 'industry') {
      return 'metadata/industries';
    } else if(type === 'land-use') {
      return 'metadata/land_uses';
    } else if(type === 'agproduct') {
      return 'metadata/agproducts';
    } else if(type === 'nonag') {
      return 'metadata/nonags';
    }
  }
});

