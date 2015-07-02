import Ember from 'ember';
import numeral from 'numeral';

const {computed, observer} = Ember;

export default Ember.Component.extend({
  i18n: Ember.inject.service(),
  tagName: 'div',
  attributeBindings: ['width','height'],
  varIndependent: ['group', 'code'],
  id: computed('elementId', function() {
    return `#${this.get('elementId')}`;
  }),
  treemap: computed('data.[]', 'varDependent', 'dataType', 'vis', function() {
    return d3plus.viz()
      .container(this.get('id'))
      .data({value: this.get('data'), padding: 5})
      .type("tree_map")
      .id({value: this.get('varIndependent'), grouping: true })
      .depth(1)
      .tooltip({children: false})
      .color({value: 'grey'})
      .format({number: function(d) { return numeral(d).format('$ 0.0a');}})
      .zoom(false)
      .text({value: (d) => { return Ember.get(d, `name_${this.get('i18n').locale}`) || d.code;}})
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
  willDestroyElement: function() {
    this.removeObserver('i18n.locale', this, this.update);
  },
  update: observer('data.[]', 'vardependent', 'datatype', 'vis','i18n.locale', function() {
    Ember.run.scheduleOnce('afterRender', this , function() {
      this.set('width', this.$().parent().width());
      this.set('height', this.$().parent().height());
      this.get('treemap').draw();
    });
  })
});

