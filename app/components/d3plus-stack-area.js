import Ember from 'ember';
const {computed, observer, on} = Ember;

export default Ember.Component.extend({
  tagName: 'div',
  colorScale: ['#bdbdbd', '#969696', '#737373', '#525252', '#252525'],
  attributeBindings: ['width','height'],
  id: computed('elementId', function() {
    return `#${this.get('elementId')}`;
  }),
  filteredData: computed('data', function() {
    return this.get('data');
  }),
  varId: computed('dataType', function() {
    let dataType = this.get('dataType');
    if( dataType === 'products') {
      return ['parent_name','name'];
    } else if (dataType === 'industries') {
      return ['parent_name','name'];
    }
  }),
  stackedArea: computed('id','data',function() {
    return d3plus.viz()
    .container(this.get('id'))
    .data({value: this.get('data'), padding: 5})
    .type("stacked")
    .id(this.get('varId'))
    .x(this.get('varX'))
    .y(this.get('varY'))
    .ui({padding: 20})
    .height(this.get('height'))
    .width(this.get('width'))
    .time({"value": "year"})
    .ui({padding: 20})
    .timing({transitions: 300})
    .margin(10)
    .labels({"padding": 30})
    .color({
      'scale': this.get('colorScale')
    });
  }),
  draw: on('didInsertElement', function() {
    Ember.run.later(this , function() {
      this.set('width', this.$().parent().width());
      this.set('height', this.$().parent().height());
      this.get('stackedArea').draw();
    }, 300);
  }),
  didDataChange: observer('data', function() {
    this.rerender();
  })
});

