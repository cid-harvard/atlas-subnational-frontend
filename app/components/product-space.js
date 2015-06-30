import Ember from 'ember';
import productSpace from '../fixtures/product_space';
const {computed, observer} = Ember;

export default Ember.Component.extend({
  tagName: 'div',
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
  productSpace: computed('data', function() {
    return vistk.viz().params({
        type: 'productspace',
        height: 300, 
        width: 500,
        container: this.get('id'),
        margin: {top: 0, right: 0, bottom: 0, left: 0},
        nodes: productSpace.nodes,
        links: productSpace.edges,
        data: this.get('data'),
        var_x: 'x',
        var_y: 'y',
        var_id: this.get('varId'),
        items: [{
          attr: 'name',
          marks: [{
            type: 'circle',
            var_r: 'export_value'
          }]
        }],
        time: {
          var_time: 'year', 
          current_time: '2012',
          parse: function(d) { return d; },
          filter: '2012'
        },
        selection: ['115', '116', '117', '118', '119', '120', '121', '122', '123', '124', '125'],
        highlight: ['115', '201', '202', '203', '204', '205', '206', '207', '208', '161'],
        zoom: this.get('zoom'),
      })
  }),
  zoom: computed('varActiveStep', function() {
    var step = this.get('varActiveStep');

    if(step == 0)
      return [];

    if(step == 1)
      return [];

    if(step == 2)
      return [];

    if(step == 3)
      return [];

  }),
  draw: function() {
    d3.select(this.get('id'))
      .call(this.get('productSpace'));
  },
  redraw: observer('varActiveStep', function() {
    this.get('productSpace').params({zoom: this.get('zoom')});
    this.draw();
  }),
  didInsertElement: function() {
    this.draw();
  }
});
