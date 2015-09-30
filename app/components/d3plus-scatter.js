import Ember from 'ember';
import numeral from 'numeral';
const {computed, observer} = Ember;

export default Ember.Component.extend({
  i18n: Ember.inject.service(),
  tagName: 'div',
  varIndependent: 'code',
  classNames: ['buildermod__viz--white','buildermod__viz'],
  id: computed('elementId', function() {
    return `#${this.get('elementId')}`;
  }),
  rcaData: computed('data.[]', 'rca', function() {
    let rca = this.get('rca');
    return _.filter(this.get('data'), function(d) { return d[rca] < 1;});
  }),
  scatter: computed('rcaData', 'dataType', function() {
    return d3plus.viz()
      .container(this.get('id'))
      .data({value: this.get('rcaData')})
      .type('scatter')
      .color((d) => { return d.color ? d.color : '#ccc1b9';})
      .id(this.get('varIndependent'))
      .x({ "value": 'distance',
           "label": { "value": this.get('i18n').t('graph_builder.table.distance').string, "padding": 10}
      })
      .y({ "value": 'complexity',
           "label": { "value": this.get('i18n').t('graph_builder.table.complexity').string, "padding": 25}
      })
      .format({ number: function(d) { return numeral(d).format('0.00a');}})
      .text({value: (d) => {
        return Ember.get(d, `name_short_${this.get('i18n').locale}`) || d.code;
       }})
      .size({value: this.get('varSize'), scale: { min: 1, max: 5 }})
      .timeline(false)
      .height(this.get('height'))
      .width(this.get('width'))
      .tooltip([this.get('rca'),'cog'])
      .legend(false);
  }),
  varSize: computed('dataType', function() {
    if(this.get('dataType') === 'products') { return 'cog'; }
    if(this.get('dataType') === 'industries') { return 'cog'; }
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
  update: observer('data.[]', 'varRca', 'i18n.locale', 'dataType', function() {
    if(!this.element){ return false; } //do not redraw if not there
    Ember.run.scheduleOnce('afterRender', this , function() {
      if(this.get('scatter')) {
      this.get('scatter')
        .x({ "value": 'distance', "label": this.get('i18n').t('graph_builder.table.distance').string })
        .y({ "value": 'complexity', label: this.get('i18n').t('graph_builder.table.complexity').string })
        .draw();
      }
    });
  })
});

