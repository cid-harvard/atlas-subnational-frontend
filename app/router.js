import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

export default Router.map(function() {
  this.route('search');
  this.route('graph_builder');
  this.route('ranking');

  this.route('location', { path: 'location'}, function() {
    this.route('colombia', { path:'colombia'});
    this.route('show', { path: ':location_id'});
  });
});
