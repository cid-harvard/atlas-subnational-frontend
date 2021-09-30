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
    this.route('header-menu', { path: 'header-menu'});
    this.route('stylesheet', { path: 'stylesheet'});
  });

  // Graph Builder

  // Profiles
  this.resource('product', { path: 'product'}, function() {
    this.route('show', { path: ':product_id'});
    this.route('abstract', { path: ':product_id/abstract/'});
    this.route('complexmap', { path: ':product_id/complexmap/'});
    this.route('complexmapprimaries', { path: ':product_id/complexmap/primaries/'});
    this.route('complexmapsecondaries', { path: ':product_id/complexmap/secondaries/'});
    this.route('ringchart', { path: ':product_id/ringchart/'});
    this.route('exports', { path: ':product_id/exports/'});

    this.route('visualization', { path: ':product_id/source/:source_type/visualization/:visualization_type/:variable'});
  });
  this.resource('location', { path: 'location'}, function() {
    this.route('show', {path: ':location_id'});
    this.route('abstract', {path: ':location_id/abstract/'});
    this.route('route', {path: ':location_id/route/'});




    this.route('productmap', {path: ':location_id/route/product_map/'});
    this.route('productmappotential', {path: ':location_id/route/product_map/potential/'});





    this.route('productmapdetail', {path: ':location_id/route/product_map/detail/'});
    this.route('productmapprimaries', {path: ':location_id/route/product_map/primaries/'});
    this.route('productmapsecondaries', {path: ':location_id/route/product_map/secondaries/'});

    this.route('ringchart', {path: ':location_id/route/ringchart/'});

    this.route('locationimports', {path: ':location_id/route/imports/'});
    this.route('locationwages', {path: ':location_id/route/wages/'});




    this.route('complexsectors', {path: ':location_id/route/complex_sectors/'});





    this.route('potential', {path: ':location_id/route/potential/'});

    this.route('complexsectorsdetail', {path: ':location_id/route/complex_sectors/detail/'});
    this.route('complexsectorsprimaries', {path: ':location_id/route/complex_sectors/primaries/'});
    //this.route('complexsectorssecondaries', {path: ':location_id/route/complex_sectors/secondaries/'});

    this.route('ruralactivities', {path: ':location_id/route/rural_activities/'});
    this.route('thirdparty', {path: ':location_id/route/thirdparty/'});


    //this.route('productmapdecentralized', {path: ':location_id/route/product_map/decentralized/'});

    this.route('visualization', { path: ':location_id/source/:source_type/visualization/:visualization_type/:variable'});
    this.route('visualization-product', { path: ':location_id/product/:product_id/visualization/:visualization_type/:variable'});
  });
  this.resource('industry', { path: 'industry'}, function() {
    this.route('show', { path: ':industry_id'});
    this.route('visualization', { path: ':industry_id/source/:source_type/visualization/:visualization_type/:variable'});
  });
  this.resource('landUse', { path: 'landUse'}, function() {
    this.route('show', { path: ':landUse_id'});
    this.route('visualization', { path: ':landUse_id/source/:source_type/visualization/:visualization_type/:variable'});
  });
  this.resource('agproduct', { path: 'agproduct'}, function() {
    this.route('show', { path: ':agproduct_id'});
    this.route('visualization', { path: ':agproduct_id/source/:source_type/visualization/:visualization_type/:variable'});
  });
  this.resource('nonag', { path: 'nonag'}, function() {
    this.route('show', { path: ':nonag_id'});
    this.route('visualization', { path: ':nonag_id/source/:source_type/visualization/:visualization_type/:variable'});
  });
  this.resource('livestock', { path: 'livestock'}, function() {
    this.route('show', { path: ':livestock_id'});
    this.route('visualization', { path: ':livestock_id/source/:source_type/visualization/:visualization_type/:variable'});
  });
  this.route('rankings');
});
