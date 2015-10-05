import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'atlas-colombia/tests/helpers/start-app';

var application;

module('Acceptance | graph builder year toggle', {
  beforeEach: function() {
    application = startApp();
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('change-years', function(assert) {
  visit('/graph_builder/location-1/source/products/visualization/treemap?endDate=2013&startDate=2007&variable=export_value');

  click('button[data-settings-open]');
  click('button[data-settings-close]');

  andThen(function() {
    assert.equal(currentURL(), '/graph_builder/location-1/source/products/visualization/treemap?endDate=2013&startDate=2007&variable=export_value');
  });

  click('button[data-settings-open]');
  andThen(function() {
    find('select[data-date-index="start"]').val('2008');
  });
  click('button[data-settings-close]');

  andThen(function() {
    assert.equal(currentURL(), '/graph_builder/location-1/source/products/visualization/treemap?endDate=2013&startDate=2008&variable=export_value');
  });

  click('button[data-settings-open]');
  andThen(function() {
    find('select[data-date-index="end"]').val('2012');
  });
  click('button[data-settings-close]');

  andThen(function() {
    assert.equal(currentURL(), '/graph_builder/location-1/source/products/visualization/treemap?endDate=2012&startDate=2008&variable=export_value');
  });

  click('button[data-settings-open]');
  andThen(function() {
    find('select[data-date-index="end"]').val('2010');
    find('select[data-date-index="start"]').val('2009');
  });
  click('button[data-settings-close]');

  andThen(function() {
    assert.equal(currentURL(), '/graph_builder/location-1/source/products/visualization/treemap?endDate=2010&startDate=2009&variable=export_value');
  });

  click('button[data-settings-open]');
  andThen(function() {
    find('select[data-date-index="end"]').val('2008');
    find('select[data-date-index="start"]').val('2012');
  });
  click('button[data-settings-close]');

  andThen(function() {
    assert.equal(currentURL(), '/graph_builder/location-1/source/products/visualization/treemap?endDate=2012&startDate=2008&variable=export_value');
  });
});
