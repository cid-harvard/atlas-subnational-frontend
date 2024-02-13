import Ember from 'ember';

export default Ember.Service.extend({
  selected: [],
  updated: null,
  data: null,
  VCRValue: 1,
  categoriesFilter: []
});
