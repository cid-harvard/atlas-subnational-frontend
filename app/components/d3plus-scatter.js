import Ember from 'ember';
import numeral from 'numeral';
const {computed, observer} = Ember;

export default Ember.Component.extend({
  i18n: Ember.inject.service(),
  tagName: 'div',
  varIndependent: 'code',
  id: computed('elementId', function() {
    return `#${this.get('elementId')}`;
  }),
  scatter: computed('data.[]',  'dataType',function() {
    return d3plus.viz()
      .container(this.get('id'))
      .data({value: this.get('data')})
      .type('scatter')
      .color((d) => { return d.color ? d.color : '#ccc1b9';})
      .id(this.get('varIndependent'))
      .x('distance')
      .y('complexity')
      .format({ number: function(d) { return numeral(d).format('0.0a');}})
      .text({value: (d) => {
        return Ember.get(d, `name_short_${this.get('i18n').locale}`) || d.code;
       }})
      .size(this.get('rca'))
      .timeline(false)
      .height(this.get('height'))
      .width(this.get('width'))
      .legend(false);
  }),
  rca: computed('dataType', function() {
    if(this.get('dataType') === 'products') { return 'export_rca'; }
    if(this.get('dataType') === 'industries') { return 'rca'; }
  }),
  didInsertElement: function() {
    Ember.run.scheduleOnce('afterRender', this , function() {
      this.set('width', this.$().parent().width());
      this.set('height', this.$().parent().height());
      this.get('scatter').draw();
    });
  },
  willDestroyElement: function() {
    this.set('scatter',  null);
    this.removeObserver('i18n.locale', this, this.update);
    this.removeObserver('data.[]', this, this.update);
  },
  update: observer('data.[]', 'varRca', 'i18n.locale', function() {
    if(!this.element){ return false; } //do not redraw if not there
    Ember.run.scheduleOnce('afterRender', this , function() {
      if(this.get('scatter')) { this.get('scatter').draw();}
    });
  })
});

