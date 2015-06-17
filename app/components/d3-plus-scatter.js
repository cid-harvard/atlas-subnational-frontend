import Ember from 'ember';
const {computed, observer} = Ember;

export default Ember.Component.extend({
  tagName: 'div',
  id: computed('elementId', function() {
    return `#${this.get('elementId')}`;
  }),
  scatter: computed('data', 'id', function() {
    var maxYear = d3.max(this.get('data'), function(d) {return d.year;} );
    return d3plus.viz()
    .container(this.get('id'))
    .data({value: this.get('data')})
    .type('scatter')
    .color('#ccc1b9')
    .id(this.get('varId'))
    .x(this.get('varX'))
    .y(this.get('varY'))
    .size(this.get('varSize'))
    .time({'value': 'year', 'solo': maxYear })
    .timeline(false)
    .height(this.get('height'))
    .width(this.get('width'));
  }),
  didInsertElement: function() {
    Ember.run.scheduleOnce('afterRender', this , function() {
      this.set('width', this.$().parent().width());
      this.set('height', this.$().parent().height());
      this.get('scatter').draw();
    });
  },
  didDataChange: observer('data', function() {
    this.rerender();
  })
});
