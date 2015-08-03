import Ember from 'ember';
import numeral from 'numeral';
const { computed } = Ember;

export default Ember.Component.extend({
  tagName: 'div',
  classNames: ['dotplot'],
  attributeBindings: ['width','height'],
  id: computed('elementId', function() {
    return `#${this.get('elementId')}`;
  }),
  dotPlot: computed('id','data', function() {
    let varX = this.get('varX');
    return vistk.viz()
      .params({
        type: 'dotplot',
        data: this.get('data'),
        container: this.get('id'),
        height: this.get('height'),
        width: this.get('width'),
        margin: {top: 0, right: 10, bottom: 20, left: 10},
        var_id: this.get('varId'),
        var_x: this.get('varX'),
        var_y: function() { return this.height/2; },
        var_group: this.get('varId'),
        x_text: null,
        x_ticks: 2,
        x_tickSize: 0,
        x_tickPadding: 10,
        x_format: (d) => {
          let format = function(d) { return numeral(d).format('$ 0.00 a'); };
          let type = this.get('type');
          if(type === 'population') {
            format = function(d) { return numeral(d).format('0.00a'); };
          } else if(type === 'percentage') {
            format = function(d) { return numeral(d).format('0.00%'); };
          }
          return format(d);
        },
        items: [{
          marks: [{
            type: "diamond"
          }, {
            var_mark: '__highlighted',
            type: d3.scale.ordinal().domain([true, false]).range(["text", "none"]),
            rotate: "0",
            translate: [0, -15],
            text_anchor: function() {
              var parentGroup = d3.select(this.parentNode);
              var parentSVG = d3.select(this.parentNode.parentNode.parentNode);
              var parentX = d3.transform(parentGroup.attr("transform")).translate[0];
              var svgWidth = +parentSVG.attr("width");
              return parentX < svgWidth / 2 ? "start": "end";
            },
            text: (d)  => {
              let format = function(d) { return numeral(d).format('0.00 a'); };
              let type = this.get('type');
              if(type === 'population') {
                format = function(d) { return numeral(d).format('0.00a'); };
              } else if(type === 'percentage') {
                format = function(d) { return numeral(d).format('0.00%'); };
              }
              let name = Ember.get(d, 'name_en') || Ember.get(d, 'name_es');
              return name + ' (' + format(+d[varX]) + ')';
            }
          }]
        }],
        selection: [this.get('currentLocation')]
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

