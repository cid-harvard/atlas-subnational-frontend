import Ember from 'ember';
const { computed } = Ember;

export default Ember.Component.extend({
  attributeBindings: ['width','height'],
  id: computed('elementId', function() {
    return `#${this.get('elementId')}`;
  }),
  w: computed('width', function () {
    return this.get('width') - 60;
  }),
  h: computed('height', function () {
    return this.get('height') - 60;
  }),
  productTable: computed('data', function() {
    return vistk.viz()
      .type('table')
      .container(this.get('id'))
      .height(this.get('h'))
      .width(this.get('w'))
      .data(this.get('data'))
      .columns(['product_id', 'export_value', 'export_rca'])
      .id('product_id')
      .title('Top Exports (2013), all')
      .ui(false);
  }),
  draw: function() {
    d3.select(this.get('id'))
      .call(this.get('productTable'));
  },
  didInsertElement: function() {
    this.draw();
  }
});
