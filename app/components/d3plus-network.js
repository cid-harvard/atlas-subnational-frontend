import productSpace from '../fixtures/product_space';
import industrySpace from '../fixtures/industry_space';
import Ember from 'ember';
import numeral from 'numeral';

const {computed, observer} = Ember;

export default Ember.Component.extend({
  i18n: Ember.inject.service(),
  tagName: 'div',
  classNames: ['buildermod__viz--white','buildermod__viz'],
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
        d.name_short_en = datum.name_short_en + ` (${datum.code})`;
        d.name_short_es = datum.name_short_es + ` (${datum.code})`;
        d.color = datum.color;
        d[this.get('varDependent')] = datum[this.get('varDependent')];
        d[this.get('varRCA')] = datum[this.get('varRCA')];
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
  varRCA: computed('dataType', function() {
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
      var_text: `name_short_${this.get('i18n').display}`, //TODO: update with langauge
      var_x: 'x',
      var_y: 'y',
      radius: 3.5,
      var_color: 'color',
      color: (d) => { return d; },
      y_invert: true,
      var_id: 'id',
      items: [{
        attr: 'name',
        marks: [{
          type: 'circle',
          fill: (d) => {
            //show colors if all colors is enabled
            if(this.get('showAllColors')) {
              return d.color;
            }
            //if there is a search, color nodes with Truth-y
            //export_value (products)  or 'rca' (industries)
            if(this.get('search') && d[this.get('varDependent')]) {
              return d.color;
            }
            //if there is no search, color products export > 0 and rca > 1
            // industries if RCA > 1 ( varDependent for industries is also rca )
            if(d[this.get('varDependent')] && d[this.get('varRCA')] > 1){
              return d.color;
            }
          },
          class: (d) => {
            if(d[this.get('varRCA')] > 1) {
              return 'node--is--highlighted';
            }
          }
        }, {
          var_mark: '__highlighted',
          type: d3.scale.ordinal().domain([true, false]).range(['div', 'none']),
          x: function(d, i, vars) {
            return  vars.x_scale[0]["func"](d[vars.var_x]);
          },
          y: function(d, i, vars) {
            return vars.y_scale[0]["func"](d[vars.var_y]);
          },
          class: function() { return 'tooltip'; },
          text: (d) => {
            let rcaValue = d[this.get('varRCA')];
            let rcaLabel = this.get('i18n').t('graph_builder.table.rca');
            let rcaString = `${rcaLabel}: ${numeral(rcaValue).format('0.00a')}`;

            return d[`name_short_${this.get('i18n').display}`] + '</br>' + rcaString;
          },
          width: 150,
          height: 'auto',
          translate: [0, -10]
        }]
      }]
    });
  }),
  didInsertElement: function() {
    if(this.get('delay')) {
      Ember.run.later(this , function() {
        if(!this.get('width')){ this.set('width', this.$().parent().width()); }
        if(!this.get('height')){ this.set('height', this.$().parent().height()); }
        d3.select(this.get('id')).call(this.get('network'));
      }, this.get('delay'));
    } else {
      Ember.run.scheduleOnce('afterRender', this , function() {
        if(!this.get('width')){ this.set('width', this.$().parent().width()); }
        if(!this.get('height')){ this.set('height', this.$().parent().height()); }
        d3.select(this.get('id')).call(this.get('network'));
      });
    }
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
