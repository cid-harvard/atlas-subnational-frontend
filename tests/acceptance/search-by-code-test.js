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
  visit('/search?query=61&filter=industry');
  andThen(function() {
    assert.equal(find('p[data-search-result-name]:first').text(), 'Educational services');
  });

  //product
  visit('/search?query=0105&filter=product');
  andThen(function() {
    assert.equal(find('p[data-search-result-name]:first').text(), 'Fowl');
  });
});
