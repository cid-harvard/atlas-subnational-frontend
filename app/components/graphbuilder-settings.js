import Ember from 'ember';

export default Ember.Component.extend({
  attributeBindings: ['data-dateIndex'],
  didInsertElement() {
    this.set('newStartDate', this.get('startDate'));
    this.set('newEndDate', this.get('endDate'));
  },
  actions: {
    changeStart() {
      let selectedEl = this.$('select[data-dateIndex="start"]')[0];
      let selectedIndex = selectedEl.selectedIndex;
      let content = this.get('dateRange');
      let selectedValue = content[selectedIndex];

      this.set('newStartDate', selectedValue);
    },
    changeEnd() {
      let selectedEl = this.$('select[data-dateIndex="end"]')[0];
      let selectedIndex = selectedEl.selectedIndex;
      let content = this.get('dateRange');
      let selectedValue = String(content[selectedIndex]);

      this.set('newEndDate', selectedValue);
    },
    closeSettingsDrawer() {
      this.set('isOpen', false);
      if(parseInt(this.get('newStartDate')) > parseInt(this.get('newEndDate'))){
        this.set('endDate', this.get('newStartDate'));
        this.set('startDate', this.get('newEndDate'));
      } else {
        this.set('startDate', this.get('newStartDate'));
        this.set('endDate', this.get('newEndDate'));
      }

      this.set('newStartDate', this.get('startDate'));
      this.set('newEndDate', this.get('endDate'));
    }
  }
});

