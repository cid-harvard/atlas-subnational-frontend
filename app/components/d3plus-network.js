import productSpace from '../fixtures/product_space';
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
  networkData: computed('data.[]', function() {
    return _.reduce(this.get('data'), function(memo, d) {
      if(d.export_value){ memo.push({id: d.code, value: d.export_value}); }
      return memo;
      },[]);
  }),
  network: computed('data.[]', 'varDependent', 'dataType', 'vis', function() {
    return d3plus.viz()
      .container(this.get('id'))
      .data({ value: this.get('networkData')})
      .type("network")
      .edges({ value: productSpace.edges, color: '#FFFF'})
      .nodes({ value: productSpace.nodes })
      .color({value: function(d){
        if(d.value){ return 'black';}
        return 'lightgrey';
      }})
      .id('id')
      .height(this.get('height'))
      .width(this.get('width'))
      .format({ number: (d) => { return numeral(d).format('$ 0.0a'); }})
      .size('value')
      .timeline(false)
      .ui(false)
      .legend(false)
      .labels(false);
  }),
  didInsertElement: function() {
    Ember.run.scheduleOnce('afterRender', this , function() {
      this.set('width', this.$().parent().width());
      this.set('height', this.$().parent().height());
      this.get('network').draw();
    });
  },
  willDestroyElement: function() {
    this.removeObserver('i18n.locale', this, this.update);
    this.removeObserver('data.[]', this, this.update);
  },
  update: observer('data.[]', 'varDependent', 'i18n.locale', function() {
    if(!this.element){ return false; } //do not redraw if not there
    Ember.run.later(this , function() {
      this.set('width', this.$().parent().width());
      this.set('height', this.$().parent().height());
      this.get('network').draw();
    }, 1000);
  })
});
