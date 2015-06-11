import Ember from 'ember';
const {computed, observer} = Ember;

export default Ember.Component.extend({
  tagName: 'div',
  attributeBindings: ['width','height'],
  id: computed('elementId', function() {
    return `#${this.get('elementId')}`;
  }),
  filteredData: computed('data', function() {
    return this.get('data');
  }),
  treemap: computed('id','data',function() {
    return d3plus.viz()
    .container(this.get('id'))  // container DIV to hold the visualization
    .data({value: this.get('data'), padding: 5})  // data to use with the visualization
    .type("tree_map")   // visualization type
    .id(['parent_name','name'])         // key for which our data is unique on
    .depth(1)
    .color('grey')
    .time({"value": "year", "solo": 2013})
    .ui({padding: 20})
    .height(this.get('height'))
    .width(this.get('width'))
    .size("export_value");
  }),
  draw: function() {
    this.set('width', this.$().parent().width());
    this.set('height', this.$().parent().height());
    this.get('treemap').draw();
  },
  didInsertElement: function() {
    Ember.run.scheduleOnce('afterRender', this , function() {
      this.draw();
    });
  },
  didDataChange: observer('data', function() {
    this.rerender();
  })
});

