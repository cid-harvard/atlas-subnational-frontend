import DS from 'ember-data';
import fixture from '../fixtures/atlantico';

var LocationSerializer = DS.RESTSerializer.extend({
  normalizePayload: function(payload) {
    //return { location: payload };
    return { location: this.fixture};
  }
});

LocationSerializer.reopen({
  fixture: fixture
});

export default LocationSerializer;
