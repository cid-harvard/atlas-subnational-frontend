import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';


moduleForComponent('autocomplete-input-datlas', 'Integration | Component | autocomplete input datlas', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{autocomplete-input-datlas}}`);

  assert.equal(this.$().text(), '');

  // Template block usage:
  this.render(hbs`
    {{#autocomplete-input-datlas}}
      template block text
    {{/autocomplete-input-datlas}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
