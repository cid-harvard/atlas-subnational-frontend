import Ember from 'ember';
import config from './config/environment';
import googlePageview from './mixins/google-pageview';

var Router = Ember.Router.extend(googlePageview,{
  location: config.locationType
});

export default Router.map(function() {
  this.route('search');
  this.route('downloads');
  this.route('colombia');

  // About
  this.resource('about', function() {
    this.route('project-description', { path: 'project-description'});
    this.route('glossary', { path: 'glossary'});
  });

  // Graph Builder
  this.resource('graph_builder', { path: 'graph_builder/:graph_builder_id' }, function() {
    this.resource('source', { path: 'source/:source_type' }, function() {
      this.resource('visualization', { path: 'visualization/:visualization_type'});
    });
  });

  // Profiles
  this.resource('product', { path: 'product'}, function() {
    this.route('show', { path: ':product_id'});
  });
  this.resource('location', { path: 'location'}, function() {
    this.route('show', { path: ':location_id'});
  });
  this.resource('industry', { path: 'industry'}, function() {
    this.route('show', { path: ':industry_id'});
  });
});
