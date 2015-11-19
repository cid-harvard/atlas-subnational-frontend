import Ember from 'ember';
const {computed} = Ember;

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
  isGreater: computed.equal('rcaFilter', 'greater'),
  isLess: computed.equal('rcaFilter', 'less'),
  isAll: computed.equal('rcaFilter', 'all'),
  actions: {
    rcaGreater() {
      this.set('rcaFilter', 'greater');
      this.set('isOpen', false);
    },
    rcaLess() {
      this.set('rcaFilter', 'less');
      this.set('isOpen', false);
    },
    rcaAll() {
      this.set('rcaFilter', 'all');
      this.set('isOpen', false);
    },
    closeSettingsDrawer() {
      if(this.get('isSingleYear')) { this.set('isOpen', false); return; }
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

