import Ember from 'ember';

export default Ember.Component.extend({
  attributeBindings: ['data-dateIndex'],
  actions: {
    changeStart() {
      // TODO: DRY this out & move the date picker into its own component so many can exist on one page
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
      let selectedValue = String(content[selectedIndex]);

      this.set('endDate', selectedValue);
    },
    closeSettingsDrawer() {
      // I suspect this sort of bottom-up setting is a smell
      this.set('parentController.drawerSettingsIsOpen', false);
    }
  }
});

