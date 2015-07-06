/* global require, module */

var EmberApp = require('ember-cli/lib/broccoli/ember-app');

var HtmlbarsCompiler = require('ember-cli-htmlbars');

var templateTree = new HtmlbarsCompiler('app/templates', {
  isHTMLBars: true,
  templateCompiler: require('./bower_components/ember/ember-template-compiler')
});

var app = new EmberApp({
  dotEnv: {
    clientAllowedKeys: ['GA'],
    path: {
      colombia_june_2015: '.env.colombia_june_2015',
      atlas_colombia_master: '.env.atlas_colombia_master'
    }
  },
  minifyCSS: {
    enabled: false
  },
  minifyJS: {
    enabled: false
  },
  emberCliFontAwesome: {
    includeFontAwesomeAssets: false
  }
});

app.import('bower_components/d3/d3.min.js');
app.import('bower_components/lodash/lodash.js');
app.import('bower_components/vis-toolkit/build/vistk.js');
app.import('bower_components/d3plus/d3plus.js');

// Font Awesome
// The npm package readme mentions refactoring this as a Broccoli tree, so consider that a TODO
app.import('bower_components/font-awesome/fonts/fontawesome-webfont.eot', { destDir: 'fonts' });
app.import('bower_components/font-awesome/fonts/fontawesome-webfont.svg', { destDir: 'fonts' });
app.import('bower_components/font-awesome/fonts/fontawesome-webfont.ttf', { destDir: 'fonts' });
app.import('bower_components/font-awesome/fonts/fontawesome-webfont.woff', { destDir: 'fonts' });
app.import('bower_components/font-awesome/fonts/fontawesome-webfont.woff2', { destDir: 'fonts' });
app.import('bower_components/font-awesome/fonts/FontAwesome.otf', { destDir: 'fonts' });

// CIDcons
app.import('bower_components/cidcons/css/cidcons-codes.css');
app.import('bower_components/cidcons/font/cidcons.woff', { destDir: 'fonts' });

// Platform
app.import('vendor/fonts/platform/Platform-Bold-Web.eot', { destDir: 'fonts' });
app.import('vendor/fonts/platform/Platform-Bold-Web.ttf', { destDir: 'fonts' });
app.import('vendor/fonts/platform/Platform-Bold-Web.woff', { destDir: 'fonts' });

// Circular
app.import('vendor/fonts/circular/circular-light.woff2', { destDir: 'fonts' });
app.import('vendor/fonts/circular/circular-light.woff', { destDir: 'fonts' });
app.import('vendor/fonts/circular/circular-book.woff2', { destDir: 'fonts' });
app.import('vendor/fonts/circular/circular-book.woff', { destDir: 'fonts' });
app.import('vendor/fonts/circular/circular-medium.woff2', { destDir: 'fonts' });
app.import('vendor/fonts/circular/circular-medium.woff', { destDir: 'fonts' });
app.import('vendor/fonts/circular/circular-bold.woff2', { destDir: 'fonts' });
app.import('vendor/fonts/circular/circular-bold.woff', { destDir: 'fonts' });

// Use `app.import` to add additional libraries to the generated
// output files.
//
// If you need to use different assets in different
// environments, specify an object as the first parameter. That
// object's keys should be the environment name and the values
// should be the asset to use in that environment.
//
// If the library that you are including contains AMD or ES6
// modules that you would like to import into your application
// please specify an object with the list of modules as keys
// along with the exports of each module as its value.

module.exports = app.toTree();
