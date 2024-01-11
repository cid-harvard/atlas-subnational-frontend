import Ember from 'ember';
const {computed, get, observer} = Ember;

export default Ember.Component.extend({
  buildermodSearchService: Ember.inject.service(),
  search: null,
  didInsertElement: function() {
    Ember.run.scheduleOnce('afterRender', this , function() {

      this.set("search", this.get("buildermodSearchService.search"));

    });
  },
  updateSearch: observer('buildermodSearchService.search', function() {
    this.set("search", this.get("buildermodSearchService.search"));
  })
});
