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

  click('li[data-location-industry="wages"]');

  andThen(function() {
    assert.equal(currentURL(), '/location/2/source/industries/visualization/treemap/wages?endDate=2013&locale=en-col&startDate=2013');
  });

  click("i.icon-cidcon_multiples");

  andThen(function() {
    assert.equal(currentURL(), '/location/2/source/industries/visualization/multiples/wages?endDate=2013&locale=en-col&startDate=2008');
  });

  //Switch to import source
  click("li[data-location-product='imports']");

  andThen(function() {
    assert.equal(currentURL(), '/location/2/source/products/visualization/treemap/import_value?endDate=2013&locale=en-col&startDate=2013');
  });

  //return to profile
  click('li[data-search-profile]');

  andThen(function() {
    assert.equal(currentURL(), '/location/2?locale=en-col');
    assert.equal(find('h2[data-location-name]').text(), 'Atlántico');
  });
});
