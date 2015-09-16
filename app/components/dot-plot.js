import Ember from 'ember';
import numeral from 'numeral';
const { computed, observer } = Ember;

export default Ember.Component.extend({
  i18n: Ember.inject.service(), //TODO: this should work, but doesn't, ODD -ql
  tagName: 'div',
  locale: computed.alias('i18n.locale'),
  classNames: ['dotplot'],
  attributeBindings: ['width','height'],
  id: computed('elementId', function() {
    return `#${this.get('elementId')}`;
  }),
  dotPlot: computed('id','data', function() {
    let varX = this.get('varX');
    let varId = this.get('varId');
    let currentSelection = +this.get('currentSelection');
    return vistk.viz()
      .params({
        type: 'dotplot',
        data: this.get('data'),
        container: this.get('id'),
        height: this.get('height'),
        width: this.get('width'),
        margin: {top: 0, right: 5, bottom: 20, left: 0},
        var_id: this.get('varId'),
        var_x: this.get('varX'),
        var_y: function() { return this.height/2; },
        var_group: this.get('varId'),
        x_text: null,
        x_ticks: 2,
        x_tickSize: 0,
        x_tickPadding: 10,
        x_format: (d) => {
          let format = function(d) { return numeral(d).format('$ 0.00a'); };
          let type = this.get('type');
          if(type === 'population') {
            format = function(d) { return numeral(d).format('0.00a'); };
          } else if(type === 'percentage') {
            format = function(d) { return numeral(d).format('0.00%'); };
          }
          return format(d);
        },
        items: [{
          marks: [{
            type: 'diamond',
            class: function(d) {
              if(d[varId] === currentSelection) {
                return 'preselected';
              }
            }
          }, {
            var_mark: '__highlighted',
            type: d3.scale.ordinal().domain([true, false]).range(['div', 'none']),
            class: function() { return 'tooltip'; },
            text: (d)  => {
              let format = function(d) { return numeral(d).format('0.00a'); };
              let type = this.get('type');
              if(type === 'population') {
                format = function(d) { return numeral(d).format('0.00a'); };
              } else if(type === 'percentage') {
                format = function(d) { return numeral(d).format('0.00%'); };
              }
              let locale = this.get('locale');
              let name = Ember.get(d, 'name_'+locale);
              return name + ' (' + format(+d[varX]) + ')';
            },
            exit: function() {}
          }]
        }],
        selection: [currentSelection]
      });
 }),
  draw: function() {
    this.set('width', this.$().parent().width());
    this.set('height', this.$().parent().height());
    d3.select(this.get('id')).call(this.get('dotPlot'));
  },
  update: observer('locale', function() {
    Ember.run.scheduleOnce('afterRender', this , function() {
      d3.select(this.get('id')).call(this.get('dotPlot'));
    });
  }),
  didInsertElement: function() {
    Ember.run.scheduleOnce('afterRender', this , function() {
      this.draw();
    });
  }
});

