import Ember from 'ember';
import productSpace from '../fixtures/product_space';
const {computed, observer} = Ember;

export default Ember.Component.extend({
  i18n: Ember.inject.service(),
  tagName: 'div',
  attributeBindings: ['width'],
  height: 500,
  id: computed('elementId', function() {
    return `#${this.get('elementId')}`;
  }),
  productSpace: computed('data.[]',  function() {
    return vistk.viz().params({
      type: 'productspace',
      height: this.get('height'),
      width: this.get('width'),
      container: this.get('id'),
      margin: {top: 0, right: 0, bottom: 0, left: 0},
      nodes: productSpace.nodes,
      links: productSpace.edges,
      data: this.get('data'),
      var_text: `name_${this.get('i18n').locale}`, //TODO: update with langauge
      var_x: 'x',
      var_y: 'y',
      y_invert: true,
      var_id: this.get('varId'),
      items: [{
        attr: 'name',
        marks: [{
          type: 'circle',
          var_r: 'export_value'
        }, {
          var_mark: '__highlighted',
          type: d3.scale.ordinal().domain([true, false]).range(["text", "none"])
        }, {
          var_mark: '__selected',
          type: d3.scale.ordinal().domain([true, false]).range(["text", "none"])
        }]
      }],
      selection: this.get('selection'),
      highlight: this.get('highlight'),
      zoom: this.get('zoom'),
      ui: {legend: this.get('varLegend')}
    })
  }),
  zoom: computed('varActiveStep', function() {
    let step = this.get('varActiveStep');
    if(step === 0){
      return ['178'];
    } else if(step === 1) {
      return ['178', '118', '606'];
    } else if(step === 2) {
      return ['606'];
    } else {
      return [];
    }
  }),
  selection: computed('varActiveStep', function() {
    let step = this.get('varActiveStep');
    if(step === 0){
      return ['178'];
    } else if(step === 1) {
      return ['178', '118', '606'];
    } else if(step === 2) {
      return ['606'];
    } else {
      return [];
    }
  }),
  highlight: computed('varActiveStep', function() {
    let step = this.get('varActiveStep');
    if(step === 0){
      return ['178'];
    } else if(step === 1) {
      return ['178', '118', '606'];
    } else if(step === 2) {
      return ['606'];
    } else {
      return [];
    }
  }),
  draw: function() {
    d3.select(this.get('id'))
      .call(this.get('productSpace'));
  },
  redraw: observer('varActiveStep', 'i18n.locale', function() {
    Ember.run.later(this , function() {
      this.get('productSpace').params({
        zoom: this.get('zoom'),
        selection: this.get('selection'),
        highlight: this.get('highlight'),
        var_text: `name_${this.get('i18n').locale}`, //TODO: update with langauge
        refresh: true
      });
      this.draw();
    }, 100);
  }),
  didInsertElement: function() {
    Ember.run.scheduleOnce('afterRender', this , function() {
      this.set('width', this.$().parent().width());
      this.draw();
    });
  }
});
