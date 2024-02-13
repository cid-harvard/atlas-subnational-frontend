import Ember from 'ember';
import ENV from '../../config/environment';
import numeral from 'numeral';

const {apiURL} = ENV;
const {RSVP, computed, getWithDefault, get, copy} = Ember;

export default Ember.Route.extend({
// `this.store.find` makes an api call for `params.location_id` and returns a promise
// in the `then` function call, another API call is made to get the topExports data
  i18n: Ember.inject.service(),
  featureToggle: Ember.inject.service(),

  firstYear: computed.alias('featureToggle.first_year'),
  lastYear: computed.alias('featureToggle.last_year'),
  censusYear: computed.alias('featureToggle.census_year'),
  agproductLastYear: computed.alias('featureToggle.year_ranges.agproduct.last_year'),

  queryParams: {
    startDate: { refreshModel: false },
    endDate: { refreshModel: false },
  },

  model: function(params) {
    return this.store.find('location', params.location_id);
  },
  afterModel: function(model) {
    let level = model.get('level');
    level = level === 'country' ? 'department' : level;

    let subregion = get(this, `featureToggle.subregions.${model.get('level')}`);

    // TODO: maybe use ember data instead of ajax calls to decorate JSON objects with model functionality?
    // extract year out later

    var industries = Ember.$.getJSON(`${apiURL}/data/location/${model.id}/industries?level=class`);

    return RSVP.allSettled([industries]).then((array) => {

      var industriesData = getWithDefault(array[0], 'value.data', []);

      var industriesDataIndex = _.indexBy(industriesData, 'industry_data');

      let industriesMetadata = this.modelFor('application').industries;


      //get products data for the department
      let industries = _.reduce(industriesData, (memo, d) => {
          let industry = industriesMetadata[d.industry_id];
          if(model.id === '0') { d.rca = 1; }
          let industryData = industriesDataIndex[d.industry_id];
          industry.complexity = _.result(_.find(industry.pci_data, { year: d.year}), 'complexity');
          memo.push(_.merge(d, industry, industryData));
          return memo;
        }, []);

      model.set('industriesData', industries);

      return model;
    });
  },
  setupController(controller, model) {
    this._super(controller, model);
    //this.controllerFor('application').set('entity', model.get('constructor.modelName'));
    //this.controllerFor('application').set('entity_id', model.get('id'));
    window.scrollTo(0, 0);
  },
});
