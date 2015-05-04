import Ember from 'ember';
const { computed } = Ember;


export default Ember.Component.extend({
  tagName: 'svg',
  classNames: ['something-something'],
  attributeBindings: ['width','height'],
  id: computed('elementId', function() {
    return `#${this.get('elementId')}`;
  }),
  cleanData: function(data) {
   return data.map((d) => {
      var object = { year: Date.parse(d.year)};
      object[this.get('yVar')] = d[this.get('yVar')];
      return object;
    });
  },
  sparkLine: computed('data','yVar', function() {
   let data = this.cleanData(this.get('data'));
   return vistk.viz()
    .type("sparkline")
    .container(this.get('id'))
    .height(this.get('height'))
    .width(this.get('width'))
    .data(data)
    .id("id")
    .y_var(this.get('yVar'))
    .group("category")
    .color("name")
    .title("Products")
    .group("category")
    .ui(false)
    .time({var_time: "year"})
    .text("name");
  }),
  draw: function() {
    d3.select(this.get('id'))
      .call(this.get('sparkLine'));
  },
  didInsertElement: function() {
    this.set('width', this.$().parent().width());
    this.set('height', this.$().parent().height());
    this.draw();
  }
});
