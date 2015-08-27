import productSpace from '../fixtures/product_space';
import industrySpace from '../fixtures/industry_space';
import Ember from 'ember';

const {computed, observer} = Ember;

export default Ember.Component.extend({
  i18n: Ember.inject.service(),
  tagName: 'div',
  attributeBindings: ['width','height'],
  varIndependent: ['group', 'code'],
  id: computed('elementId', function() {
    return `#${this.get('elementId')}`;
  }),
  networkData: computed('data.[]','nodes', 'dataMetadata', function() {
    let indexedData = _.indexBy(this.get('data'), 'id');
    let metadataIndex = this.get('dataMetadata');
    return _.map(this.get('nodes'), function(d) {
      let datum = indexedData[d.id] || metadataIndex[d.id];
      if(datum) {
        d.color = datum.color;
        d.name_short_en = datum.name_short_en + ` (${datum.code})`;
        d.name_short_es = datum.name_short_es + ` (${datum.code})`;
        d[this.get('varDependent')] = datum[this.get('varDependent')];
      }
      return d;
    }, this);
  }),
  dataMetadata: computed('dataType','metadata', function() {
    let type = this.get('dataType');
    return this.get(`metadata.${type}`);
  }),
  graph: computed('dataType', function() {
    let type = this.get('dataType');
    if(type === 'industries') {
      return industrySpace;
    } else if (type === 'products') {
      return productSpace;
    }
  }),
  varDependent: computed('dataType', function() {
    let type = this.get('dataType');
    if(type === 'industries') {
      return 'rca';
    } else if (type === 'products') {
      return 'export_rca';
    }
  }),
  nodes: computed('dataType', function() {
    let type = this.get('dataType');
    if(type === 'industries') {
      return _.each(this.get('graph').nodes, function(d) { d.y = this.get('height') - d.y; }, this);
    } else if (type === 'products') {
      return this.get('graph').nodes;
    }
  }),
  edges: computed('dataType', function() {
    return this.get('graph').edges;
  }),
  network: computed('data.[]', 'varDependent', 'dataType', 'vis', 'i18n.locale', function() {
    return vistk.viz().params({
      type: 'productspace',
      height: this.get('height'),
      width: this.get('width'),
      container: this.get('id'),
      margin: {top: 0, right: 0, bottom: 0, left: 0},
      nodes: this.get('nodes'),
      links: this.get('edges'),
      data: this.get('networkData'),
      var_text: `name_short_${this.get('i18n').locale}`, //TODO: update with langauge
      var_x: 'x',
      var_y: 'y',
      radius: 4,
      var_color: 'color',
      color: function(d) { return d; },
      y_invert: true,
      var_id: 'id',
      items: [{
        attr: "name",
        marks: [{
          var_mark: '__aggregated',
          type: d3.scale.ordinal().domain([true, false]).range(["text", "none"])
        }, {
          type: 'circle',
          stroke_width: (d) => {
            if(d[this.get('varDependent')] >= 1) {
              return '1.1px';
            }
          }
        }, {
          var_mark: '__highlighted',
          type: d3.scale.ordinal().domain([true, false]).range(["divtext", "none"]),
          class: function() { return 'items__mark__divtext__tooltip'; },
          text: (d) => { return d[`name_short_${this.get('i18n').locale}`]; }
        }, {
          var_mark: '__selected',
          type: d3.scale.ordinal().domain([true, false]).range(["divtext", "none"]),
          class: function() { return 'items__mark__divtext__tooltip'; },
          text: (d) => { return d[`name_short_${this.get('i18n').locale}`]; }
        }]
      }]
    });
  }),
  didInsertElement: function() {
    Ember.run.scheduleOnce('afterRender', this , function() {
      this.set('width', this.$().parent().width());
      this.set('height', this.$().parent().height());
      d3.select(this.get('id')).call(this.get('network'));
    });
  },
  willDestroyElement: function() {
    this.set('network',  null);
    this.removeObserver('i18n.locale', this, this.update);
    this.removeObserver('data.[]', this, this.update);
  },
  update: observer('data.[]', 'varDependent', 'i18n.locale', function() {
    if(!this.element){ return false; } //do not redraw if not there
    d3.select(this.get('id')).select('svg').remove();
    Ember.run.later(this , function() {
      if(this.get('network')) {
        d3.select(this.get('id'))
          .call(this.get('network'));
      }
    }, 100);
  })
});
