import Ember from 'ember';
const {computed, observer} = Ember;

export default Ember.Component.extend({
  // inputSetterFunction: computed('type', 'dateRange.[]', function() {
  //   let type = this.get('type');
  //   if(type === 'time') {
  //     return (values) => {
  //       let startYear = this.get('dateRange')[0];
  //       let endYear = this.get('dateRange')[1];
  //       this.set('newStartDate', startYear);
  //       this.set('newEndDate', endYear);
  //       this.set('years', `${startYear} - ${endYear}`);
  //     };
  //   } else  { //rca, similarity
  //     return (values) => {
  //       this.set('rca', parseInt(values[0]));
  //     };
  //   }
  // }),
  update: observer('startDate', 'endDate', function() {
    Ember.run.scheduleOnce('afterRender', this , function() {
      console.log('did update');
      // this.get('inputSetterFunction');
    });
  }),
  didInsertElement: function() {
    Ember.run.scheduleOnce('afterRender', this , function() {
      console.log('did insert');
      // this.get('inputSetterFunction');
    });
  }
});
