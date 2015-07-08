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
    return 600;
  }),
  h: computed('height', function () {
    return 400;
  }),
  productSpace: computed('data', function() {
    return vistk.viz().params({
        type: 'productspace',
        height: this.get('h'),
        width: this.get('w'),
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
          },{
            var_mark: '__highlighted',
            type: d3.scale.ordinal().domain([true, false]).range(["text", "none"]),
            rotate: "0"
          }]
        }],
        time: {
          var_time: 'year',
          current_time: '2012',
          parse: function(d) { return d; },
          filter: '2012'
        },
        selection: this.get('selection'),
        highlight: this.get('highlight'),
        zoom: this.get('zoom'),
      });
  }),
  zoom: computed('varActiveStep', function() {
    var step = this.get('varActiveStep');

    if(step == 0)
      return [];

    if(step == 1)
      return ['178'];

    if(step == 2)
      return ['178', '118', '606'];

    if(step == 3)
      return [];

    return [];

  }),
  selection: computed('varActiveStep', function() {
    var step = this.get('varActiveStep');

    if(step == 0)
      return [];

    if(step == 1)
      return ['178'];

    if(step == 2)
      return ['178'];

    if(step == 3)
      return ['178'];

    return [];

  }),
  highlight: computed('varActiveStep', function() {
    var step = this.get('varActiveStep');

    if(step == 0)
      return [];

    if(step == 1)
      return ['178'];

    if(step == 2)
      return ['178', '118', '606'];

    if(step == 3)
      return ['178', '118', '606'];

    return [];

  }),
  draw: function() {
    d3.select(this.get('id'))
      .call(this.get('productSpace'));
  },
  redraw: observer('varActiveStep', function() {
    this.get('productSpace').params({zoom: this.get('zoom'), selection: this.get('selection'), highlight: this.get('highlight')});
    this.draw();
  }),
  didInsertElement: function() {
   //this.draw();
  }
});
