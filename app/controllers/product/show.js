import Ember from 'ember';
const {computed} = Ember;

export default Ember.Controller.extend({
  i18n: Ember.inject.service(),
  queryParams: ['year'],

  firstYear: computed.alias('i18n.firstYear'),
  lastYear: computed.alias('i18n.lastYear'),
  occupationsData: computed.alias('model.occupationsData'),
});


