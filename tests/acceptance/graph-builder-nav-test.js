import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'atlas-colombia/tests/helpers/start-app';

var application;

module('Acceptance | graph builder nav', {
  beforeEach: function() {
    application = startApp();
    application.$.cookie('locale', 'en');
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
    assert.equal(currentURL(), '/location/930');
    assert.equal(find('h2[data-location-name]').text(), 'Atlántico');
  });

  click('a[data-side-graph-builder-link]');

  andThen(function() {
    assert.equal(currentURL(), '/graph_builder/location-930/source/products/visualization/treemap?endDate=2013&startDate=2007&variable=export_value');
  });

  //Go to multiples
  click("button:contains('Change Graph')");
  click("input[data-change-graph='multiples']");

  andThen(function() {
    assert.equal(currentURL(), '/graph_builder/location-930/source/products/visualization/multiples?endDate=2013&startDate=2007&variable=export_value');
  });

  //Switch to import source
  click("a:contains('Exports and Imports')");
  click("a:contains('What products does Atlántico import?')");

  andThen(function() {
    assert.equal(currentURL(), '/graph_builder/location-930/source/products/visualization/treemap?endDate=2013&startDate=2007&variable=import_value');
  });

  //Go to scatter plot
  click("a:contains('Exports and Imports')");
  click("a:contains('What products have the best combination of complexity and opportunity for Atlántico?')");

  andThen(function() {
    assert.equal(currentURL(), '/graph_builder/location-930/source/products/visualization/scatter?endDate=2014&startDate=2013');
  });

  //Go to product space
  click("a:contains('Exports and Imports')");
  click("a:contains('What does the product map look like for Atlántico?')");

  andThen(function() {
    assert.equal(currentURL(), '/graph_builder/location-930/source/products/visualization/similarity?endDate=2014&startDate=2013');
  });

  //Go to industry employment
  click("a:contains('Industries')");
  click("a:contains('What industries in Atlántico employ the most people?')");

  andThen(function() {
    assert.equal(currentURL(), '/graph_builder/location-930/source/industries/visualization/treemap?endDate=2013&startDate=2007&variable=employment');
  });

  //Go to industry wages
  click("a:contains('Industries')");
  click("a:contains('What industries in Atlántico are the largest by total wages?')");

  andThen(function() {
    assert.equal(currentURL(), '/graph_builder/location-930/source/industries/visualization/treemap?endDate=2013&startDate=2007&variable=wages');
  });

  //Go to industry scatter
  click("a:contains('Industries')");
  click("a:contains('What industries have the best combination of complexity and opportunity for Atlántico?')");

  andThen(function() {
    assert.equal(currentURL(), '/graph_builder/location-930/source/industries/visualization/scatter?endDate=2014&startDate=2013');
  });

  //Go to industry simi-map
  click("a:contains('Industries')");
  click("a:contains('What does the industry map look like for Atlántico?')");

  andThen(function() {
    assert.equal(currentURL(), '/graph_builder/location-930/source/industries/visualization/similarity?endDate=2014&startDate=2013&variable=rca');
  });

  //return to profile
  click('a[data-side-profile-link]');

  andThen(function() {
    assert.equal(currentURL(), '/location/930');
    assert.equal(find('h2[data-location-name]').text(), 'Atlántico');
  });
});
