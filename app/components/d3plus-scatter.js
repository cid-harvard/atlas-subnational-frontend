import Ember from 'ember';
const {computed, observer} = Ember;

export default Ember.Component.extend({
  tagName: 'div',
  id: computed('elementId', function() {
    return `#${this.get('elementId')}`;
  }),
  varIndependent: computed('dataType', function() {
    // this should be based on i18n
    if(this.get('dataType') === 'industries') {
      return 'name'
    }
  }),
  scatter: computed('data.[]', 'dataType',function() {
    var maxYear = d3.max(this.get('data'), function(d) {return d.year;} );
    console.log(this.get('data'));
    return d3plus.viz()
      .container(this.get('id'))
      .data({value: this.get('data')})
      .type('scatter')
      .color('#ccc1b9')
      .id(this.get('varIndependent'))
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
  update: observer('data.[]', 'dataType',  function() {
    Ember.run.scheduleOnce('afterRender', this , function() {
      this.set('width', this.$().parent().width());
      this.set('height', this.$().parent().height());
      this.get('scatter').draw();
    });
  })
});

