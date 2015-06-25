import Ember from 'ember';
import productSpace from '../fixtures/product_space';
const { computed } = Ember;

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
        margin: {top: 0, right: 0, bottom: 30, left: 30},
        nodes: productSpace.nodes,
        links: productSpace.edges,
        data: this.get('data'),
        var_x: 'x',
        var_y: 'y',
        var_color: this.get('varColor'),
        color: d3.scale.ordinal().domain([0, 9]).range(["#3182bd", "#6baed6", "#9ecae1", "#c6dbef", "#e6550d", "#fd8d3c", "#fdae6b", "#fdd0a2", "#31a354", "#74c476", "#a1d99b", "#c7e9c0", "#756bb1", "#9e9ac8", "#bcbddc", "#dadaeb", "#636363", "#969696", "#bdbdbd", "#d9d9d9"]),
        var_group: this.get('varGroup'),
        x_axis_show: false,
        x_grid_show: false,
        y_axis_show: false,
        y_grid_show: false,
        var_id: this.get('varId'),
        items: [{
          attr: "name",
          marks: [{
            type: "circle",
            rotate: "0",
            fill: function(d) { return vars.color(vars.accessor_items(d)[vars.var_color]); },
            var_r: "export_value"
          }, {
            var_mark: '__selected',
            type: d3.scale.ordinal().domain([true, false]).range(["star", "none"]),
            rotate: "0"
          }]
        }],
        selection: ["115", "116", "117", "118", "119", "120", "121", "122", "123", "124", "125"],
        highlight: ["115"],
        time: {
          var_time: 'year', 
          current_time: 2012
        },
      })
  }),
  draw: function() {
    d3.select(this.get('id'))
      .call(this.get('productSpace'));
  },
  didInsertElement: function() {
    this.draw();
  }
});

