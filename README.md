#atlas-subnational-frontend

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

## Running / Development

* `ember server` or `ember s` (these are the same)
* Visit your app at [http://localhost:4200](http://localhost:4200).

## Running on API [Depricated]
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

## Subfolder

In the `config/enviroment.js` file adjust the `baseURL` variable in the `var ENV` object for the enviroment e.g. `enviroment === 'production'`

### Building

Current ENV files
*  colombia
*  mexico
*  peru

To use a country
* run `ember build -e <enviroment>` e.g. `ember build -e colombia`

OR

* copy `.env.<country>` as `.env`


* `ember build` (development) defaults to `.env`
* `ember build --environment production` (production) defaults to `.env`

* To build the app, have the correct `.env` file in the root dir see '.env.example'
* run `ember build -e <enviroment>` e.g. `ember build -e colombia`
* By default the built app is in the `dist/` folder
* Locales follow `country-lang` syntax.  e.g. `usa-en`, `usa-es` or `mex-en`, `mex-es`
* [ember cli i18n](https://github.com/jamesarosen/ember-i18n) is used for the internalization.

* Required `ENV` vars
  * GA (for Google Analytics)
  * DEFAULT_LOCALE
  * OTHER_LOCALE
  * API_URL
  * DOWNLOAD_URL(root name for file downloads)

## Heroku deploy

* use [ember-cli-buildpack] (https://github.com/QuinnLee/heroku-buildpack-ember-cli)
* set `ENV` vars
* push to instance

## Further Reading / Useful Links

* [ember.js](http://emberjs.com/)
* [ember-cli](http://www.ember-cli.com/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)

