import Ember from 'ember';
import ENV from '../../config/environment';

const {apiURL} = ENV;

const {RSVP, computed, copy, get, $, set, getWithDefault} = Ember;

export default Ember.Route.extend({

  i18n: Ember.inject.service(),
  featureToggle: Ember.inject.service(),
  buildermodSearchService: Ember.inject.service(),
  firstYear: computed.alias('featureToggle.first_year'),
  lastYear: computed.alias('featureToggle.last_year'),

  queryParams: {
    startDate: { refreshModel: false },
    endDate: { refreshModel: false },
  },

  model(params) {

    let hash = {
      model: this.store.find('location', params.location_id),
      industries_col: $.getJSON(`${apiURL}/data/location/${params.location_id}/industries?level=class`),
    }

    return RSVP.hash(hash).then((hash) => {
      return this.departmentsDataMunging(hash);
    });

    //return this.store.find('product', params.product_id);
  },
  departmentsDataMunging(hash) {
    let {model, industries_col} = hash;
    let industriesMetadata = this.modelFor('application').industries;
    var industriesDataIndex = _.indexBy(getWithDefault(industries_col, 'data', []), 'industry_data');

    //get products data for the department
    let industries = _.reduce(industries_col.data, (memo, d) => {
        let industry = industriesMetadata[d.industry_id];
        if(model.id === '0') { d.rca = 1; }
        let industryData = industriesDataIndex[d.industry_id];
        industry.complexity = _.result(_.find(industry.pci_data, { year: d.year}), 'complexity');
        memo.push(_.merge(d, industry, industryData));
        return memo;
      }, []);

    return Ember.Object.create({
      entity: model,
      industries_col: industries,
      metaData: this.modelFor('application')
    });
  },
  setupController(controller, model) {
    //this.set('buildermodSearchService.search', null);
    this._super(controller, model);
    startDate: this.get('firstYear')
    endDate: this.get('lastYear')
    window.scrollTo(0, 0);
  },
  resetController(controller, isExiting) {

    if (isExiting) {
      controller.setProperties({
      });
    }
  }
});
