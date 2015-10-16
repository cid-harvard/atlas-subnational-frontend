import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'atlas-colombia/tests/helpers/start-app';

var application;

module('Acceptance | graph builder nav', {
  beforeEach: function() {
    application = startApp();
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('search for Alantico and go to GB and Profile', function(assert) {
  visit('/search');

  //search for atlantico and click on GB page
  fillIn('input[data-search-input]', 'Atlántico');
  click('input[data-search]');
  click('a[data-search-profile]');

  andThen(function() {
    assert.equal(currentURL(), '/location/2?locale=en-col');
    assert.equal(find('h2[data-location-name]').text(), 'Atlántico');
  });

  click('a[data-side-graph-builder-link]');

  andThen(function() {
    assert.equal(currentURL(), '/graph_builder/location-2/source/products/visualization/multiples?endDate=2013&locale=en-col&startDate=2008&variable=export_value');
  });

  click("button:contains('Change question')");
  click("input[data-change-graph='treemap']");

  andThen(function() {
    assert.equal(currentURL(), '/graph_builder/location-2/source/products/visualization/treemap?endDate=2013&locale=en-col&startDate=2013&variable=export_value');
  });

  //Switch to import source
  click("button:contains('Change question')");
  click("a[data-location-product='imports']");

  andThen(function() {
    assert.equal(currentURL(), '/graph_builder/location-2/source/products/visualization/treemap?endDate=2013&locale=en-col&startDate=2013&variable=import_value');
  });

  //Go to scatter plot
  click("button:contains('Change question')");
  click("a[data-location-product='scatter']");

  andThen(function() {
    assert.equal(currentURL(), '/graph_builder/location-2/source/products/visualization/scatter?endDate=2013&locale=en-col&startDate=2013');
  });

  //Go to product space
  click("button:contains('Change question')");
  click("a[data-location-product='similarity']");

  andThen(function() {
    assert.equal(currentURL(), '/graph_builder/location-2/source/products/visualization/similarity?endDate=2013&locale=en-col&startDate=2013');
  });

  //Go to industry employment
  click("button:contains('Change question')");
  click("a[data-location-industry='employment']");

  andThen(function() {
    assert.equal(currentURL(), '/graph_builder/location-2/source/industries/visualization/treemap?endDate=2013&locale=en-col&startDate=2013&variable=employment');
  });

  //Go to industry wages
  click("button:contains('Change question')");
  click("a[data-location-industry='wages']");

  andThen(function() {
    assert.equal(currentURL(), '/graph_builder/location-2/source/industries/visualization/treemap?endDate=2013&locale=en-col&startDate=2013&variable=wages');
  });

  //Go to industry scatter
  click("button:contains('Change question')");
  click("a[data-location-industry='scatter']");

  andThen(function() {
    assert.equal(currentURL(), '/graph_builder/location-2/source/industries/visualization/scatter?endDate=2013&locale=en-col&startDate=2013');
  });

  //Go to industry simi-map
  click("button:contains('Change question')");
  click("a[data-location-industry='similarity']");

  andThen(function() {
    assert.equal(currentURL(), '/graph_builder/location-2/source/industries/visualization/similarity?endDate=2013&locale=en-col&startDate=2013&variable=rca');
  });

  //return to profile
  click('a[data-side-profile-link]');

  andThen(function() {
    assert.equal(currentURL(), '/location/2?locale=en-col');
    assert.equal(find('h2[data-location-name]').text(), 'Atlántico');
  });
});
