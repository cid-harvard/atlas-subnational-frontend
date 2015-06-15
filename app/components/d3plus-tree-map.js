import Ember from 'ember';
const {computed, observer} = Ember;

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
    if(this.get('dataType') === 'products') {
      return ['parent_name','name'];
    }
  }),
  treemap: computed('id','data',function() {
    return d3plus.viz()
    .container(this.get('id'))
    .data({value: this.get('data'), padding: 5})
    .type("tree_map")
    .id(this.get('varId'))
    .depth(1)
    .color('grey')
    .time({"value": "year", "solo": 2013})
    .timeline(false)
    .height(this.get('height'))
    .width(this.get('width'))
    .timing({transitions: 300})
    .size(this.get('varSize'));
  }),
  didInsertElement: function() {
    Ember.run.scheduleOnce('afterRender', this , function() {
      this.set('width', this.$().parent().width());
      this.set('height', this.$().parent().height());
      this.get('treemap').draw();
    });
  },
  didDataChange: observer('data', function() {
    this.rerender();
  })
});

