import Ember from 'ember';
import numeral from 'numeral';
const { computed } = Ember;


export default Ember.Component.extend({
  tagName: 'div',
  classNames: ['sparkline'],
  attributeBindings: ['width','height'],
  id: computed('elementId', function() {
    return `#${this.get('elementId')}`;
  }),
  cleanData: function(data) {
   return data.map((d) => {
      var object = { year: d.year};
      object[this.get('yVar')] = d[this.get('yVar')];
      object['department_id'] = this.get('currentLocation');
      return object;
    });
  },
  sparkLine: computed('data','yVar','type', function() {
   let data = this.cleanData(this.get('data'));
   let yVar = this.get('yVar');
   let currentLocationName = this.get('currentLocationName');
   return vistk.viz()
    .params({
      type: 'sparkline',
      container: this.get('id'),
      width: this.get('width') - 60,
      height: this.get('height'),
      margin: {top: 15, right: 10, bottom: 0, left: 15},
      data: data,
      var_y: this.get('yVar'),
      var_x: 'year',
      var_id: this.get('varId'),
      var_text: 'department_id',
      var_group: this.get('varId'),
      time: {
        var_time: 'year',
        parse: d3.time.format("%Y").parse,
        current_time: '2012',
        filter_interval: ['2000', '2012']
      },
      items: [{
        attr: 'name',
        marks: [{
          type: 'diamond'
        }, {
          var_mark: '__highlighted',
          type: d3.scale.ordinal().domain([true, false]).range(['text', 'none']),
          translate: [0, -15],
          text_anchor: function() {
            var parentGroup = d3.select(this.parentNode);
            var parentSVG = d3.select(this.parentNode.parentNode.parentNode);
            var parentX = d3.transform(parentGroup.attr('transform')).translate[0];
            var svgWidth = +parentSVG.attr('width');
            return parentX < svgWidth/2 ? 'start': 'end';
          },
          text: (d) => {
            let format = function(d) { return numeral(d).format('$ 0.00 a'); };
            if(this.get('type') === 'population') {
              format = function(d) { return numeral(d).format('0,00'); };
            }
            return currentLocationName + ' (' + format(+d[yVar]) + ')';
          }
        }]
      }],
      selection: [this.get('currentLocation')]
    });
  }),
  draw: function() {
    this.set('width', this.$().parent().width());
    this.set('height', this.$().parent().height());
    d3.select(this.get('id'))
      .call(this.get('sparkLine'));
  },
  didInsertElement: function() {
    Ember.run.scheduleOnce('afterRender', this , function() {
      this.draw();
    });
  }
});
