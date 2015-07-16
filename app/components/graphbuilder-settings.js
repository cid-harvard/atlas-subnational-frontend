import Ember from 'ember';

export default Ember.Component.extend({
  newStartDate: null,
  newEndDate: null,
  updateSettings: Ember.observer('isOpen', function() {
    if(!this.get('isOpen')) { // trigger when is closing
      let startDate = this.get('newStartDate') || this.get('startDate');
      let endDate = this.get('newEndDate') || this.get('endDate');
      console.log('update settings');
      this.setProperties({
        startDate: startDate,
        endDate: endDate
      });
    }
  })
});

