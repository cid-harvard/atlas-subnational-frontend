import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'atlas-colombia/tests/helpers/start-app';

var application;

module('Acceptance | redirect', {
  beforeEach: function() {
    application = startApp();
    visit('/');
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('redirect profile to gb', function(assert) {
  visit('/product/262');
  andThen(function() {
    assert.equal(currentURL(), '/graph_builder/product-262/source/locations/visualization/multiples?endDate=2013&startDate=2008&variable=export_value');
  });

  //this is a class industry
  visit('/industry/389');
  andThen(function() {
    assert.equal(currentURL(), '/graph_builder/industry-389/source/departments/visualization/multiples?endDate=2013&startDate=2008&variable=employment');
  });

  visit('/industry/496');
  andThen(function() {
    assert.equal(currentURL(), '/industry/496');
  });
});
