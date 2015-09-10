import Ember from 'ember';

export default Ember.Component.extend({
  attributeBindings: ['data-dateIndex'],
  didInsertElement() {
    this.set('newStartDate', this.get('startDate'));
    this.set('newEndDate', this.get('endDate'));
  },
  updateDates: Ember.observer('isOpen', function(){
    if(this.get('isOpen') === false) {
      this.set('newStartDate', this.get('startDate'));
      this.set('newEndDate', this.get('endDate'));
    }
  }),
  actions: {
    closeSettingsDrawer() {
      let content = this.get('dateRange');
      let startDate = this.$('select[data-date-index="start"]')[0];
      let endDate = this.$('select[data-date-index="end"]')[0];
      let selectedEndDateIndex = endDate.selectedIndex;
      let selectedStartDateIndex = startDate.selectedIndex;

      var newEndDate = parseInt(content[selectedEndDateIndex]);
      var newStartDate = parseInt(content[selectedStartDateIndex]);

      if(newStartDate > newEndDate){
        this.set('endDate', newStartDate);
        this.set('startDate', newEndDate);
      } else {
        this.set('startDate', newStartDate);
        this.set('endDate', newEndDate);
      }
      this.set('isOpen', false);
    }
  }
});

