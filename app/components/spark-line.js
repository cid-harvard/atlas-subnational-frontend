import Ember from 'ember';
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
  sparkLine: computed('data','yVar', function() {
   let data = this.cleanData(this.get('data'));
   return vistk.viz()
    .params({
      type: 'sparkline',
      container: this.get('id'),
      width: this.get('width') - 60,
      height: this.get('height'),
      margin: {top: 10, right: 10, bottom: 10, left: 10},
      data: data,
      var_y: this.get('yVar'),
      var_x: 'year',
      var_id: 'department_id',
      var_group: this.get('varId'),
      time: {
        var_time: 'year',
        parse: d3.time.format("%Y").parse,
        current_time: '2012'
      },
      items: [{
        attr: 'name',
        marks: [{
          type: 'diamond',
          width: 10,
          height: 10
        }]
      }],
      var_text: 'department_id',
      selection: [this.get('currentLocation')],
      highlight: [this.get('currentLocation')]
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
