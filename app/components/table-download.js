import Ember from 'ember';
const {observer} = Ember;

export default Ember.Component.extend({
  fileName: 'data.csv',
  didInsertElement: function() {
    let csv = Papa.unparse(this.get('data'));
    this.set('csv', csv);

    var formBlob = new Blob([this.get('csv')], { type: 'text/csv' });
    this.set('formBlob', formBlob);
  },
  undateData: observer('data.[]', function() {
    let csv = Papa.unparse(this.get('data'));
    this.set('csv', csv);

    var formBlob = new Blob([this.get('csv')], { type: 'text/csv' });
    this.set('formBlob', formBlob);
  }),
  actions: {
    save: function() {
      saveAs(this.get('formBlob'), this.get('fileName'));
    }
  }
});
