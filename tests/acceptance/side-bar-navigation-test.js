import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'atlas-colombia/tests/helpers/start-app';

var application;

module('Acceptance | side bar navigation', {
  beforeEach: function() {
    application = startApp();
    visit('/');
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('visiting /side-bar-navigation', function(assert) {
  visit('/search');

  andThen(function() {
    assert.equal(currentURL(), '/search');
  });

  click('label[data-side-nav-profile]');
  click("a[data-side-search='location']");
  andThen(function() {
    assert.equal(currentURL(), '/search?filter=location');
  });


  visit('/graph_builder/location-930/source/products/visualization/treemap?endDate=2013&startDate=2007&variable=export_value');
  click('label[data-side-nav-profile]');
  click("a[data-side-profile]");

  andThen(function() {
    assert.equal(currentURL(), '/location/930');
  });

  visit('/graph_builder/location-930/source/products/visualization/treemap?endDate=2013&startDate=2007&variable=export_value');
  click('label[data-side-nav-profile]');
  click("a[data-side-search='product']");

  andThen(function() {
    assert.equal(currentURL(), '/search?filter=product');
  });

  visit('/graph_builder/location-930/source/products/visualization/treemap?endDate=2013&startDate=2007&variable=export_value');
  click('label[data-side-nav-profile]');
  click("a[data-side-search='industry']");

  andThen(function() {
    assert.equal(currentURL(), '/search?filter=industry');
  });
});

