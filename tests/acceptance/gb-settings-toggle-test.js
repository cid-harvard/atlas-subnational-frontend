import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'atlas-colombia/tests/helpers/start-app';

var application;

module('Acceptance | gb settings toggle', {
  beforeEach: function() {
    application = startApp();
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('visiting /gb-settings-toggle', function(assert) {
  visit('location/5/source/industries/visualization/similarity/rca?endDate=2013&startDate=2013');

  andThen(function() {
    assert.equal(_.trim(find('span[data-year-display]').text()), '2013');
    assert.equal((find('button[data-next-year]').is(':disabled')), true);
    assert.equal((find('button[data-prev-year]').is(':disabled')), false);
  });

  click('button[data-prev-year]');

  andThen(function() {
    assert.equal(_.trim(find('span[data-year-display]').text()), '2012');
    assert.equal((find('button[data-next-year]').is(':disabled')), false);
    assert.equal((find('button[data-prev-year]').is(':disabled')), false);
  });

  visit('location/5/source/industries/visualization/similarity/rca?endDate=2008&startDate=2008');

  andThen(function() {
    assert.equal(_.trim(find('span[data-year-display]').text()), '2008');
    assert.equal((find('button[data-next-year]').is(':disabled')), false);
    assert.equal((find('button[data-prev-year]').is(':disabled')), true);
  });

  click('button[data-next-year]');

  andThen(function() {
    assert.equal(_.trim(find('span[data-year-display]').text()), '2009');
    assert.equal((find('button[data-next-year]').is(':disabled')), false);
    assert.equal((find('button[data-prev-year]').is(':disabled')), false);
  });
});
