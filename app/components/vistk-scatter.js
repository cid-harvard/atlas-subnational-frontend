import Ember from 'ember';
import numeral from 'numeral';
import ENV from '../config/environment';
const {computed, observer, $, get:get} = Ember;
const {apiURL} = ENV;

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
  scatter: computed('rcaData', 'dataType','eciValue', function() {
    return vistk.viz()
    .params({
      dev: true,
      type: 'scatterplot',
      height: this.get('height'),
      width: this.get('width'),
      container: this.get('id'),
      data: this.get('rcaData'),
      var_id: this.get('varIndependent'),
      var_group: 'continent',
      var_color: 'continent',
      var_x: 'distance',
      var_y: 'complexity',
      var_r: this.get('varSize'),
      var_text: this.get('varIndependent'),
      time: {
        var_time: "year",
        current_time: "2013",
        parse: function(d) { return d; }
      },
      items: [{
        attr: "name",
        marks: [{
          type: "circle",
          fill: (d) => { return d.color ? d.color : '#ccc1b9'; }
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
      //this.get('scatter')
      //  .x({ "value": 'distance', "label": this.get('i18n').t('graph_builder.table.distance').string })
      //  .y({ "value": 'complexity', label: this.get('i18n').t('graph_builder.table.complexity').string })
      //  .draw();
      d3.select(this.get('id')).call(this.get('scatter'));
      }
    });
  })
});

