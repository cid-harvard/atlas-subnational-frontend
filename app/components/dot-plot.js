import Ember from 'ember';
const { computed } = Ember;

export default Ember.Component.extend({
  tagName: 'svg',
  classNames: ['scatter-plot'],
  attributeBindings: ['width','height'],
  id: computed('elementId', function() {
    return `#${this.get('elementId')}`;
  }),
  w: computed('width', function () {
    return this.get('width') - 60;
  }),
  dotPlot: computed('id','data','w', 'xVar', 'yVar', function() {
    return vistk.viz()
      .type('dotplot')
      .container(this.get('id'))
      .height(100)
      .width(this.get('w'))
      .data(this.get('data'))
      .x_var(this.get('xVar'))
      .x_scale('linear')
      .y_var(this.get('yVar'))
      .id('name')
      .group('dept_name')
      .text('dept_name')
      .connect('name')
      .focus(0)
      .time({var_time: 'year', current_time: 2013})
      .ui(false);
  }),
  draw: function() {
    d3.select(this.get('id'))
      .call(this.get('dotPlot'));
  },
  didInsertElement: function() {
    this.draw();
  }
});
