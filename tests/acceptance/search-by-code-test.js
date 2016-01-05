import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'atlas-colombia/tests/helpers/start-app';
import tHelper from "ember-i18n/legacy-helper";

var application;

module('Acceptance | search by code', {
  beforeEach: function() {
    application = startApp();
    visit('/');
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('search by code at Search', function(assert) {

  //Industry
  visit('/search?query=0111');
  andThen(function() {
    assert.equal(find('p[data-search-result-name]:first').text(), 'Coffee');
  });

  //product
  visit('/search?query=0105');
  andThen(function() {
    assert.equal(find('p[data-search-result-name]:first').text(), 'Fowl');
  });

  //location
  visit('/search?query=05');
  andThen(function() {
    assert.equal(find('p[data-search-result-name]:first').text(), 'Antioquia');
  });
});
