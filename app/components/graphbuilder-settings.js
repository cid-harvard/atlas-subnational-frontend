import Ember from 'ember';
const {computed} = Ember;

export default Ember.Component.extend({
  attributeBindings: ['data-dateIndex'],
  actions: {
    changeStart() {
      let selectedEl = this.$('select[data-dateIndex="start"]')[0];
      let selectedIndex = selectedEl.selectedIndex;
      let content = this.get('dateRange');
      let selectedValue = content[selectedIndex];

      this.set('startDate', selectedValue);
    },
    changeEnd() {
      let selectedEl = this.$('select[data-dateIndex="end"]')[0];
      let selectedIndex = selectedEl.selectedIndex;
      let content = this.get('dateRange');
      let selectedValue = content[selectedIndex];

      this.set('endDate', selectedValue);
    }
  }
});

