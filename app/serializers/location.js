import DS from 'ember-data';

export default DS.RESTSerializer.extend({
  normalizePayload: function(payload) {
    return { location: payload };
  }
});
