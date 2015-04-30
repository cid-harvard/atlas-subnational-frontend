import Ember from 'ember';
import productSpace from '../fixtures/product_space';
const { computed } = Ember;

export default Ember.Component.extend({
  tagName: 'svg',
  attributeBindings: ['width','height'],
  id: computed('elementId', function() {
    return `#${this.get('elementId')}`;
  }),
  w: computed('width', function () {
    return this.get('width') - 60;
  }),
  h: computed('height', function () {
    return this.get('height') - 60;
  }),
  productSpace: computed('data', function() {
    return vistk.viz()
      .nodes(productSpace.nodes)
      .links(productSpace.edges)
      .data(this.get('data'))
      .height(this.get('h'))
      .width(this.get('w'))
      .type("nodelink")
      .container(this.get('id'))
      .x_var("nb_products")
      .y_var("avg_products")
      .id("product_id")
      .group("category")
      .size("value")
      .time(2012)
      .color("category")
      .title("Product space")
      .time({var_time: "year", current_time: 2008})
      .ui(false);
  }),
  draw: function() {
    d3.select(this.get('id'))
      .call(this.get('productSpace'));
  },
  didInsertElement: function() {
    this.draw();
  }
});


