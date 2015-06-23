import Ember from 'ember';
const {computed, observer} = Ember;

export default Ember.Component.extend({
  tagName: 'div',
  attributeBindings: ['width','height'],
  id: computed('elementId', function() {
    return `#${this.get('elementId')}`;
  }),
  varIndependent: computed('dataType', function() {
    // this should be based on i18n
    return ['group_name_en','name'];
  }),
  treemap: computed('data.[]', 'varDependent', 'dataType', 'vis', function() {
    var maxYear = d3.max(this.get('data'), function(d) {return d.year;} );
    return d3plus.viz()
    .container(this.get('id'))
    .data({value: this.get('data'), padding: 5})
    .type("tree_map")
    .id(this.get('varIndependent'))
    .depth(1)
    .color('grey')
    .time({"value": "year", "solo": maxYear })
    .timeline(false)
    .height(this.get('height'))
    .width(this.get('width'))
    .timing({transitions: 300})
    .size(this.get('varDependent'));
  }),
  didInsertElement: function() {
    Ember.run.scheduleOnce('afterRender', this , function() {
      this.set('width', this.$().parent().width());
      this.set('height', this.$().parent().height());
      this.get('treemap').draw();
    });
  },
  update: observer('data.[]', 'varDependent', 'dataType', 'vis', function() {
    Ember.run.scheduleOnce('afterRender', this , function() {
      this.set('width', this.$().parent().width());
      this.set('height', this.$().parent().height());
      this.get('treemap').draw();
    });
  })
});

