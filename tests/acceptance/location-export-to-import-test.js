import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'atlas-colombia/tests/helpers/start-app';

var application;

module('Acceptance | location export to import', {
  beforeEach: function() {
    application = startApp();
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('Location export to import', function(assert) {
  visit('/search?query=Antioquia');
  click('a[data-search-graph-builder]:first');

  andThen(function() {
    assert.equal(currentURL(), '/graph_builder/location-1/source/products/visualization/multiples?endDate=2013&startDate=2008&variable=export_value');
  });

  click('button[data-change-question]');
  click('a[data-location-product="imports"]');

  andThen(function() {
    assert.equal(currentURL(), '/graph_builder/location-1/source/products/visualization/treemap?endDate=2013&startDate=2013&variable=import_value');
  });
});
