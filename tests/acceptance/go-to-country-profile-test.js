import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'atlas-colombia/tests/helpers/start-app';

var application;

module('Acceptance | go to country profile', {
  beforeEach: function() {
    application = startApp();
    visit('/');
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('visiting Country profile', function(assert) {
  visit('/location/0?locale=en');

  andThen(function() {
    assert.equal(currentURL(), '/location/0?locale=en');
  });
});
