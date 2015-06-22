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
        margin: {top: 0, right: 20, bottom: 20, left: 20},
        var_id: this.get('varId'),
        var_x: this.get('varX'),
        var_y: function() { return this.height/2; },
        x_text: null,
        x_ticks: 2,
        x_format: function(d) { return '$' + d3.format(".2s")(d); },
        items: [{
          marks: [{
            type: "diamond"
          }]
        }],
        selection: [this.get('currentLocation')],
        highlight: [this.get('currentLocation')],
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

