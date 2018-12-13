# Subnational Atlas Frontend Code

This README outlines the details of collaborating on this Ember application.
A short introduction of this app could easily go here.

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/) (6.x with NPM -- we used 6.13.1)
* [Bower](http://bower.io/) with `npm install -g bower`
* [Ember CLI](http://www.ember-cli.com/)
* [PhantomJS](http://phantomjs.org/)

## Installation

* Get this repository on to your computer with `git clone <repository-url>` -
  if you already have it then skip this step.
* Go to the terminal and move to this the new directory.
* Run `npm install`
* Run `bower install`

## Running / Development

* Run `ember server` or `ember s` (these are the same)
* Visit your app at [http://localhost:4200](http://localhost:4200).

## Directory Structure

- `app.js` is the entry point for the application.
- `config/environment.js` is the main Ember configuration file for the
  frontend. However for the most part you won't have to touch this file.
- In many cases, this file reads a hidden file in the main directory called
  `.env` that contains the most common options, like the translation files to
  use (`DEFAULT_LOCALE` and `OTHER_LOCALE`) and the address where the API will
  be (`API_URL`) and the downloads files will be (`DOWNLOAD_URL`).
- `/app/locales` contains all of the translation keys.
- `/app/variables/data-variables.js` contains most of the configuration related
  to website data, e.g. which products to show on the homepage dropdown, how
  many years of trade data there are, what logos to show on the homepage, what
  paths under `DOWNLOAD_URL` to find each download file etc. This is read by
  `services/feature-toggle.js`.
- `instance-initializers/locale-setter.js` handles the locale / translation
  settings.
- `mixins/table-map.js` includes many table related settings, including the
  widths of each column and what columns to show in what page.
- The main application logic is contained in the `routes/` `controllers/` and
  `templates/`. The routes determine what data to fetch and how, the
  controllers handle display-related logic (and user events like clicks) and
  the templates handle the actual HTML structure that ends up on the page. Read
  the ember.js documentation for more on this.
- `router.js` has the mapping from URLs to files in `routes/blah.js`.

### Building

Current `.env` files
*  `colombia.env`
*  `mexico.env`
*  `peru.env`

To use a country
* run `ember build -e <enviroment>` e.g. `ember build -e colombia`

OR

* copy `.env.<country>` as `.env`

To add a country env.

* Create `.env.<country>`
* Add to `Brocfile.js` dotEnv path to country

SUB-FOLDERS
* Set `ROOT_URL` to what the sub dir should be in the correct `.env` file before building

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
