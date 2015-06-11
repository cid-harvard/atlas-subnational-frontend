# Atlas-colombia

This README outlines the details of collaborating on this Ember application.
A short introduction of this app could easily go here.

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/) (with NPM)
* [Bower](http://bower.io/)
* [Ember CLI](http://www.ember-cli.com/)
* [PhantomJS](http://phantomjs.org/)

## Installation

* `git clone <repository-url>` this repository
* change into the new directory
* `npm install`
* `bower install`
* clone the Vis-toolkit repository.  `CD` into to the vis-toolkit directory and, run `bower link`
* In application directory, run `bower link vis-toolkit`

## Running / Development

* `ember server`
* Visit your app at [http://localhost:4200](http://localhost:4200).

## Running on API

* clone `https://github.com/cid-harvard/colombia`
* get correct db file from Mali
* `cd` into the the repo
* put db file in `colombia/database.db`
* run `make dummy && make dev`

*  In a seperate terminal window `cd` into the ember app
*  Run `ember s --proxy http://127.0.0.1:8001/`
### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

### Running Tests

* `ember test`
* `ember test --server`

### Building

* `ember build` (development)
* `ember build --environment production` (production)

### Deploying

Specify what it takes to deploy your app.

## Further Reading / Useful Links

* [ember.js](http://emberjs.com/)
* [ember-cli](http://www.ember-cli.com/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)

