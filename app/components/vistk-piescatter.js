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
  id: computed('elementId', function() {
    return `#${this.get('elementId')}`;
  }),
  piescatter: computed('data.@each', 'dataType','eciValue','i18n.locale', function() {
    let eci = this.get('eciValue');
    let lang = this.get('i18n.locale') === 'en-col' ? 'en_EN': 'es_ES';
    let format = function(value) { return numeral(value).format('0.00'); };

    this.get('data').forEach(function(d) {
      d.cutoff = d.export_rca > 0.01 ? 1: 0;
      d.year = 2014;
      console.log(d)
    });

    return vistk.viz()
    .params({
      type: 'scatterplot',
      margin: {top: 10, right: 20, bottom: 30, left: 30},
      height: this.get('height'),
      width: this.get('width'),
      container: this.get('id'),
      data: this.get('data'),
      var_id: this.get('varIndependent'),
      var_x: 'distance',
      var_y: 'complexity',
      var_r: this.get('varSize'),
      radius_min: 10,
      radius_max: 50,
      var_group: 'parent_name_es',
     // x_domain: this.get('x_domain'),
     // y_domain: this.get('y_domain'),
     // r_domain: this.get('r_domain'),
      var_share: this.get('varSize'),
      var_cutoff: 'cutoff',
      var_color: 'cutoff',
      var_r: this.get('varSize'),
      x_format: format,
      y_format: format,
      duration: 0,
      var_text: this.get('varIndependent'),
      x_text_custom: this.get('i18n').t('graph_builder.table.distance').string,
      y_text_custom: this.get('i18n').t('graph_builder.table.complexity').string,
      items: [{
        marks: [{
          var_mark: '__aggregated',
          type: d3.scale.ordinal().domain([true, false]).range(["circle", "none"]),
          fill: "white"
        }, {
          var_mark: '__aggregated',
          type: d3.scale.ordinal().domain([true, false]).range(["piechart", "none"]),
          class: 'piechart'
        }, {
          var_mark: '__aggregated',
          type: d3.scale.ordinal().domain([true, false]).range(["text", "none"])
        }]
      }],
      time: {
        var_time: "year",
        current_time: 2014,
        parse: function(d) { return d; }
      },
      lang: lang,
      set: {
        __aggregated: true
      },
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
      let year = this.get('endDate');
      let data = get(response, 'data');
      let datum = _.first(_.filter(data, {'year': parseInt(year), 'department_id': parseInt(id) }));
      this.set('width', this.$().parent().width());

      if(this.get('dataType') === 'products' && datum) {
        this.set('eciValue', get(datum, 'eci'));
      }

     // this.set('x_domain', vistk.utils.extent(this.get('immutableData'), 'distance'));
     // this.set('y_domain', vistk.utils.extent(this.get('immutableData'), 'complexity'));
     // this.set('r_domain', vistk.utils.extent(this.get('immutableData'), this.get('varSize')));

      d3.select(this.get('id')).call(this.get('piescatter'));
    });
  },
  willDestroyElement: function() {
    this.set('piescatter',  null);
    this.removeObserver('i18n.locale', this, this.update);
    this.removeObserver('data.[]', this, this.update);
  },
  update: observer('data.@each', 'varRca', 'i18n.locale', 'dataType', function() {
    if(!this.element){ return ; } //do not redraw if not there
    d3.select(this.get('id')).select('svg').remove();
    Ember.run.later(this , function() {
      if(this.get('piescatter')) {
        d3.select(this.get('id')).call(this.get('piescatter'));
      }
    });
  })
});

