import Ember from 'ember';
import numeral from 'numeral';
import ENV from '../config/environment';
const {computed, observer, $, get:get} = Ember;
const {apiURL} = ENV;

export default Ember.Component.extend({
  i18n: Ember.inject.service(),
  tagName: 'div',
  varIndependent: 'code',
  classNames: ['buildermod__viz--white','buildermod__viz','scatterplot'],
  id: computed('elementId', function() {
    return `#${this.get('elementId')}`;
  }),
  rcaData: computed('data.[]', 'rca', function() {
    let rca = this.get('rca');
    return _.filter(this.get('data'), function(d) { return d[rca] < 1;});
  }),
  scatter: computed('rcaData', 'dataType','eciValue', function() {
    return vistk.viz()
    .params({
      type: 'scatterplot',
      margin: {top: 10, right: 20, bottom: 30, left: 30},
      height: this.get('height'),
      width: this.get('width'),
      container: this.get('id'),
      data: this.get('rcaData'),
      var_id: this.get('varIndependent'),
      var_group: 'continent',
      var_color: 'continent',
      var_x: 'distance',
      var_y: 'complexity',
      radius_min: 1,
      radius_max: 10,
      x_format: function(d) { return numeral(d).format('0.00a'); },
      y_format: function(d) { return numeral(d).format('0.00a'); },
      duration: 0,
      var_text: this.get('varIndependent'),
      x_text_custom: this.get('i18n').t('graph_builder.table.distance').string,
      y_text_custom: this.get('i18n').t('graph_builder.table.complexity').string,
      time: {
        var_time: 'year',
        current_time: '2013',
        parse: function(d) { return d; }
      },
      items: [{
        marks: [{
          type: "circle",
          var_r: this.get('varSize'),
          fill: (d) => { return d.color ? d.color : '#ccc1b9'; }
        }, {
          var_mark: '__highlighted',
          type: d3.scale.ordinal().domain([false, true]).range(['none', 'div']),
          class: function() {
            return 'tooltip';
          },
          x: function(d, i, vars) {
            return  vars.x_scale[0]["func"](d[vars.var_x]) + vars.margin.left;
          },
          y: function(d, i, vars) {
            return vars.y_scale[0]["func"](d[vars.var_y]);
          },
          text: (d, i, vars)  => {
            var data = [{
              'key': 'rca',
              'value': this.get('rca')
            },{
              'key': 'cog',
              'value': d['cog']
            }];
            function format(key, value) {
              return numeral(value).format('$ 0.0a');
            }
            var textItem = Ember.get(d, `name_short_${this.get('i18n').display}`) || d.code;
            var tooltip_text = '<span style="color: ' +  d.color + '">' + textItem + '</span>';
            data.forEach((d) => {
               tooltip_text += '<br>' +
                 this.get('i18n').t(`graph_builder.table.${d.key}`)
                 + ': '
                 + format(d.key, d.value);
             });
            return tooltip_text;
          },
          translate: [0, 0],
          width: 200,
          height: 'auto',
        }]
      }]
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
      return _.first(_.filter(data, {'year': 2013, 'department_id': parseInt(id) }));
      }).then((datum) => {
        this.set('width', this.$().parent().width());
        this.set('height', this.$().parent().height());
        if(this.get('dataType') === 'products') {
          this.set('eciValue', get(datum, 'eci'));
        }
        //this.get('scatter').draw();
        d3.select(this.get('id')).call(this.get('scatter'));
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
        d3.select(this.get('id')).select('svg').remove();
        d3.select(this.get('id')).call(this.get('scatter'));
      }
    });
  })
});

