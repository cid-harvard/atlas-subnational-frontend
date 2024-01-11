import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';


moduleForComponent('zoomable-treemap', 'Integration | Component | zoomable treemap', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{zoomable-treemap}}`);

  assert.equal(this.$().text(), '');

  // Template block usage:
  this.render(hbs`
    {{#zoomable-treemap}}
      template block text
    {{/zoomable-treemap}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
