/* global require, module */

var EmberApp = require('ember-cli/lib/broccoli/ember-app');

var HtmlbarsCompiler = require('ember-cli-htmlbars');

var templateTree = new HtmlbarsCompiler('app/templates', {
  isHTMLBars: true,
  templateCompiler: require('./bower_components/ember/ember-template-compiler')
});

var app = new EmberApp({
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
app.import("bower_components/font-awesome/css/font-awesome.css");
app.import("bower_components/font-awesome/fonts/fontawesome-webfont.eot", { destDir: "fonts" });
app.import("bower_components/font-awesome/fonts/fontawesome-webfont.svg", { destDir: "fonts" });
app.import("bower_components/font-awesome/fonts/fontawesome-webfont.ttf", { destDir: "fonts" });
app.import("bower_components/font-awesome/fonts/fontawesome-webfont.woff", { destDir: "fonts" });
app.import("bower_components/font-awesome/fonts/fontawesome-webfont.woff2", { destDir: "fonts" });
app.import("bower_components/font-awesome/fonts/FontAwesome.otf", { destDir: "fonts" });


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
