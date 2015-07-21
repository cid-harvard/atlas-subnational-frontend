import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'atlas-colombia/tests/helpers/start-app';

var application;

module('Acceptance | search', {
  beforeEach: function() {
    application = startApp();
    visit('/');
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('visiting /search', function(assert) {
  visit('/search');
  andThen(function() {
    assert.equal(currentURL(), '/search');
  });

  fillIn('input[data-search-input]', 'Atlantico');
  click('input[data-search]');
  andThen(function() {
    assert.equal(find('p[data-search-result-name]:first').text(), 'Atlántico');
  });

  fillIn('input[data-search-input]', 'gold');
  click('input[data-search]');
  andThen(function() {
    assert.equal(find('p[data-search-result-name]:first').text(), 'Gold content');
  });
});
