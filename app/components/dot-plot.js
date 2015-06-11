import Ember from 'ember';
const { computed } = Ember;

export default Ember.Component.extend({
  tagName: 'div',
  classNames: ['dotplot'],
  attributeBindings: ['width','height'],
  id: computed('elementId', function() {
    return `#${this.get('elementId')}`;
  }),
  dotPlot: computed('id','data', function() {
    return vistk.viz()
      .params({
        type: 'dotplot',
        data: this.get('data'),
        container: this.get('id'),
        height: this.get('height'),
        width: this.get('width'),
        margin: {top: 0, right: 10, bottom: 0, left: 10},
        var_id: this.get('varId'),
        var_text: this.get('varText'),
        var_x: this.get('varX'),
        x_type: 'linear',
        x_text: null,
        x_ticks: 2,
        x_format: function(d) { return '$' + d3.format(".1s")(d); },
        mark: { type: 'diamond', width: 10, height: 10, translate: 30 },
        tickSize: 0,
        tickPadding: 10,
        selection: ["Antioquia"],
        highlight: ["Antioquia"],
      });
 }),
  draw: function() {
    this.set('width', this.$().parent().width());
    this.set('height', this.$().parent().height());
    d3.select(this.get('id')).call(this.get('dotPlot'));
  },
  didInsertElement: function() {
    Ember.run.scheduleOnce('afterRender', this , function() {
      this.draw();
    });
  }
});

