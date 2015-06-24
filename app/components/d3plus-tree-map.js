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
    let dataType = this.get('dataType');
    if( dataType === 'products') {
      return ['group_name_en','name'];
    } else if (dataType === 'industries') {
      return ['group_name_en', 'name'];
    }
  }),
  treemap: computed('id','data',function() {
    var maxYear = d3.max(this.get('data'), function(d) {return d.year;} );
    return d3plus.viz()
    .container(this.get('id'))
    .data({value: this.get('data'), padding: 5})
    .type("tree_map")
    .id(this.get('varId'))
    .depth(1)
    .color('grey')
    .time({"value": "year", "solo": maxYear })
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

