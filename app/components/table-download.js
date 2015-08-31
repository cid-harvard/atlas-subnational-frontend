import Ember from 'ember';
const {computed} = Ember;

export default Ember.Component.extend({
  fileName: computed('file', function() {
    return this.get('file') + '.csv';
  }),
  dataHref: computed('csv', function() {
    var uri = encodeURIComponent(this.get('csv'));
    return "data: text/csv;charset=utf-8," + uri;
  }),
  didInsertElement: function() {
    let csv = Papa.unparse(this.get('data'));
    this.set('csv', csv);
  },
});
