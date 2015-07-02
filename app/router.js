import Ember from 'ember';
import config from './config/environment';
import googlePageview from './mixins/google-pageview';

var Router = Ember.Router.extend(googlePageview,{
  location: config.locationType
});

export default Router.map(function() {
  this.route('search');
  this.route('graph_builder');
  this.route('ranking');
  this.route('colombia');

  this.route('location', { path: 'location'}, function() {
    this.route('show', { path: ':location_id'});
  });
});
