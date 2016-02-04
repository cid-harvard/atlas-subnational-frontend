import Ember from 'ember';
import numeral from 'numeral';
import ENV from '../config/environment';
const {computed, observer, $, get} = Ember;
const {apiURL} = ENV;

export default Ember.Component.extend({
  i18n: Ember.inject.service(),
  tagName: 'div',
  height: 500,
  varIndependent: 'code',
  attributeBindings: ['width','height'],
  classNames: ['buildermod__viz--white','buildermod__viz','scatterplot'],
  lastYear: computed.alias('i18n.lastYear'),
  id: computed('elementId', function() {
    return `#${this.get('elementId')}`;
  }),
  scatter: computed('data.[]', 'dataType','eciValue','i18n.locale', function() {
    let eci = this.get('eciValue');
    let lang = this.get('i18n.locale') === 'en-col' ? 'en_EN': 'es_ES';
    let format = function(value) { return numeral(value).format('0.00'); };
    return vistk.viz()
    .params({
      type: 'scatterplot',
      margin: {top: 10, right: 20, bottom: 30, left: 30},
      height: this.get('height'),
      width: this.get('width'),
      container: this.get('id'),
      data: this.get('data'),
      var_id: this.get('varIndependent'),
      var_group: 'continent',
      var_color: 'continent',
      var_x: 'distance',
      var_y: 'complexity',
      var_r: this.get('varSize'),
      radius_min: 2,
      radius_max: 10,
      x_format: format,
      y_format: format,
      duration: 0,
      var_text: this.get('varIndependent'),
      x_text_custom: this.get('i18n').t('graph_builder.table.distance').string,
      y_text_custom: this.get('i18n').t('graph_builder.table.complexity').string,
      time: {
        var_time: 'year',
        current_time: this.get('lastYear'),
        parse: function(d) { return d; }
      },
      items: [{
        marks: [{
          type: 'circle',
          fill: (d) => { return d.color ? d.color : '#ccc1b9'; }
        }, {
          var_mark: '__highlighted',
          type: d3.scale.ordinal().domain([true, false]).range(['line_horizontal', 'none']),
          offset_right: function(d, i, vars) {
              return vars.x_scale[0]['func'].range()[1] - vars.x_scale[0]['func'](d[vars.var_x]) + vars.r_scale(d[vars.var_r]);
          }
        }, {
          var_mark: '__highlighted',
          type: d3.scale.ordinal().domain([true, false]).range(['line_vertical', 'none']),
          offset_top: function(d, i, vars) {
              return vars.r_scale(d[vars.var_r]);
          }
        }, {
          var_mark: '__highlighted',
          type: d3.scale.ordinal().domain([true, false]).range(['rect', 'none']),
          translate: function(d, i, vars) {
            return [-vars.x_scale[0]['func'](d[vars.var_x]) - 20, -10];
          },
          height: 25,
          width: 50,
          stroke: 'black',
          stroke_width: '1.5px',
          fill: function() { return 'white'; }
        }, {
          var_mark: '__highlighted',
          type: d3.scale.ordinal().domain([true, false]).range(['text', 'none']),
          translate: function(d, i, vars) {
            return [-vars.x_scale[0]['func'](d[vars.var_x]) + 25, 0];
          },
          text_anchor: 'end',
          text: function(d, i, vars) {
            return format(d[vars.var_y]);
          }
        }, {
          var_mark: '__highlighted',
          type: d3.scale.ordinal().domain([true, false]).range(['rect', 'none']),
          translate: function(d, i, vars) {
            return [-25, -vars.y_scale[0]['func'](d[vars.var_y]) + vars.height - vars.margin.bottom - vars.margin.top];
          },
          height: 25,
          width: 50,
          stroke: 'black',
          stroke_width: '1.5px',
          fill: function() { return 'white'; }
        }, {
          var_mark: '__highlighted',
          type: d3.scale.ordinal().domain([true, false]).range(['text', 'none']),
          translate: function(d, i, vars) {
            return [0, -vars.y_scale[0]['func'](d[vars.var_y]) + vars.height - vars.margin.bottom - vars.margin.top + 10];
          },
          text_anchor: 'middle',
          text: function(d, i, vars) {
            return format(d[vars.var_x]);
          }
        }, {
          var_mark: '__highlighted',
          type: d3.scale.ordinal().domain([false, true]).range(['none', 'div']),
          class: function() {
            return 'tooltip';
          },
          x: function(d, i, vars) {
            return  vars.x_scale[0]['func'](d[vars.var_x]) + vars.margin.left;
          },
          y: function(d, i, vars) {
            return vars.y_scale[0]['func'](d[vars.var_y]);
          },
          text: (d)  => {
            var data = [{
              'key': 'rca',
              'value': get(d,this.get('rca'))
            },{
              'key': 'cog',
              'value':get(d,'cog')
            }];
            var textItem = get(d, `name_short_${this.get('i18n').display}`) || d.code;
            var tooltip_text = `<span style="color:${get(d, 'color')}">${textItem} - ${get(d, 'code')}</span>`;

            data.forEach((datum) => {
              if(datum.key) {
                tooltip_text += '<br>' + this.get('i18n').t(`graph_builder.table.${get(datum,'key')}`) + ': ' + format(get(datum,'value'));
              }
            });

            return tooltip_text;
          },
          translate: [0, 0],
          width: 200,
          height: 'auto'
        }, {
          type: 'line_horizontal',
          filter: function(d, i) {
           return typeof eci !== 'undefined' && i === 0;
          },
          offset_y: function(d, i, vars) {
            return -(vars.y_scale[0]['func'](d[vars.var_y]) - vars.y_scale[0]['func'](eci));
          }
        }, {
          type: 'text',
          filter: function(d, i) {
           return typeof eci !== 'undefined' && i === 0;
          },
          text: function() {
            var label = lang === 'en_EN' ? 'Average complexity': 'Complejidad media';
            return label + ': ' + format(eci);
          },
          text_anchor: 'end',
          offset_y: function(d, i, vars) {
            return -(vars.y_scale[0]['func'](d[vars.var_y]) - vars.y_scale[0]['func'](eci)) - 10;
          },
          offset_x: function(d, i, vars) {
            return vars.x_scale[0]['func'].range()[1] - vars.x_scale[0]['func'](d[vars.var_x]);
          }
        }]
      }],
      lang: lang
    });
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
    $.getJSON(`${apiURL}/data/location?level=department`).then((response) => {
      let id = this.get('entityId');
      let data = get(response, 'data');
      let datum = _.first(_.filter(data, {'year': this.get('lastYear'), 'department_id': parseInt(id) }));
      this.set('width', this.$().parent().width());

      if(this.get('dataType') === 'products' && datum) {
        this.set('eciValue', get(datum, 'eci'));
      }

      d3.select(this.get('id')).call(this.get('scatter'));
      });
  },
  willDestroyElement: function() {
    this.set('scatter',  null);
    this.removeObserver('i18n.locale', this, this.update);
    this.removeObserver('data.[]', this, this.update);
  },
  update: observer('data.[]', 'varRca', 'i18n.locale', 'dataType', function() {
    if(!this.element){ return ; } //do not redraw if not there
    Ember.run.scheduleOnce('afterRender', this , function() {
      if(this.get('scatter')) {
        d3.select(this.get('id')).select('svg').remove();
        d3.select(this.get('id')).call(this.get('scatter'));
      }
    });
  })
});

