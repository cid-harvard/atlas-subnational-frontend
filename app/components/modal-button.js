import Ember from 'ember';

export default Ember.Component.extend({
  rcaFilterService: Ember.inject.service(),
  didInsertElement: function() {
    Ember.run.scheduleOnce('afterRender', this , function() {
      $(`#${this.get("target")}`).modal('show');
    });
  },
});
