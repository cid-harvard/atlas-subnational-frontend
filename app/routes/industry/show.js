import Ember from 'ember';
import ENV from '../../config/environment';
const {apiURL} = ENV;
const {computed, RSVP, getWithDefault, $} = Ember;

export default Ember.Route.extend({
  i18n: Ember.inject.service(),
  firstYear: computed.alias('i18n.firstYear'),
  lastYear: computed.alias('i18n.lastYear'),
  employmentGrowthCalc: function(data) {
    let first = _.first(data);
    let last = _.last(data);
    let difference = last.employment / first.employment;
    let power =  1/(data.length-1);
    return (Math.pow(difference, power) - 1);
  },
  model: function(params) {
    var industriesMetadata = this.modelFor('application').industries;
    var classMetadata = $.getJSON(`${apiURL}/data/industry?level=class`);
    return RSVP.hash({
      model: this.store.find('industry', params.industry_id),
      classMetadata: classMetadata
    }).then((hash) => {
      let model = hash['model'];
      if(model.get('level') === 'class') {
        this.transitionTo('visualization',
          `industry-${params.industry_id}`,
          'departments',
          'multiples',
          {queryParams: {'variable': 'employment'}}
          );
      }
      return hash;
    }).then((hash) => {
      let model = hash['model'];
      let data = _.groupBy(hash['classMetadata'].data, 'industry_id');

      var groupIds = _.pluck(_.filter(industriesMetadata, 'parent_id', parseInt(model.id)), 'id');
      var classIndustries = _.filter(industriesMetadata, function(d) {
        return _.contains(groupIds, d.id);
      });

      let classData = _.reduce(classIndustries, (memo, d) => {
        let classData = data[d.id];
        if(!classData) { return memo; }

        let lastClassData = _.last(classData);
        d.employment_growth = this.employmentGrowthCalc(classData);
        d.avg_wage = lastClassData.monthly_wages;
        memo.push(_.merge(d, lastClassData));
        return memo;
      },[]);

      model.set('classIndustries', classData);
      return model;
    });
  },
  afterModel: function(model) {

    var departments = $.getJSON(`${apiURL}/data/industry/${model.id}/participants?level=department`);
    var industries = $.getJSON(`${apiURL}/data/industry?level=division`);
    var occupations = $.getJSON(`${apiURL}/data/industry/${model.id}/occupations/?level=minor_group`);
    var industryDivisions  = Ember.$.getJSON(apiURL+'/metadata/industries?level=division');

    return RSVP.allSettled([departments, industries, occupations, industryDivisions]).then((array) => {
      var departmentsData = getWithDefault(array[0], 'value.data', []);
      var industriesData = getWithDefault(array[1], 'value.data', []);
      var occupationsData = getWithDefault(array[2], 'value.data', []);

      let locationsMetadata = this.modelFor('application').locations;
      let industryDivisions = _.indexBy(getWithDefault(array[3], 'value.data', []), 'id');
      let occupationsMetadata = this.modelFor('application').occupations;

      //get products data for the department
      let departments = _.reduce(departmentsData, (memo, d) => {
        let department  = locationsMetadata[d.department_id];
        department.parent_name_en = department.name_short_en;
        department.parent_name_es = department.name_short_es;

        department.group = department.code;
        memo.push(_.merge(d, department));
        return memo;
      },[]);

      let industries = _.map(industriesData, function(d) {
        d.avg_wage = d.monthy_wages;
        return  _.merge(d, industryDivisions[d.industry_id]);
      });

      let occupations = _.map(occupationsData, (d) => {
        let occupation = occupationsMetadata[d.occupation_id];
        d.year = this.get('lastYear');
        d.group = occupation.code.split('-')[0];
        return _.merge(d, occupation);
      });

      model.set('departmentsData', departments);
      model.set('industriesData', industries);
      model.set('occupationsData', occupations);
      return model;
    });
  },
  setupController(controller, model) {
    this._super(controller, model);
    this.controllerFor('application').set('entity', model.get('constructor.modelName'));
    this.controllerFor('application').set('entity_id', model.get('id'));
    window.scrollTo(0, 0);
  },
});

