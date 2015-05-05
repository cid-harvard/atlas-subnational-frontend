import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

export default Router.map(function() {
  this.route('graph_builder');
  this.route('ranking');

  this.route('location', { path: 'location'}, function() {
    this.route('colombia', { path:'colombia'});
    this.route('industries', { path: ':location_id/industries'});
    this.route('products', { path: ':location_id/products'});
  });
});
