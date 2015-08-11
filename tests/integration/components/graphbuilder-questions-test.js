import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';


moduleForComponent('graphbuilder-questions', 'Integration | Component | graphbuilder questions', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{graphbuilder-questions}}`);

  assert.equal(this.$().text(), '');

  // Template block usage:
  this.render(hbs`
    {{#graphbuilder-questions}}
      template block text
    {{/graphbuilder-questions}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
