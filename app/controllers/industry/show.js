import Ember from 'ember';
const {computed} = Ember;

export default Ember.Controller.extend({
  featureToggle: Ember.inject.service(),
  queryParams: ['year'],

  entityType: "industry",

  firstYear: computed.alias('featureToggle.first_year'),
  lastYear: computed.alias('featureToggle.last_year'),

  yearRange: computed('firstYear', 'lastYear', function() {
    return `${this.get('firstYear')} - ${this.get('lastYear')}`;
  }),
  occupationsData: computed.alias('model.occupationsData'),
  isIndustryClass: computed.equal('model.level', 'class'),

  treemapIndependentVars: ['department_id','department_id'],
  employmentGrowthDotPlot: computed.alias('model.employmentGrowthDotPlot'),
  level: computed('model.level', function() {
    return _.capitalize(this.get('model.level'));
  }),
  averageWageDotPlot: computed('model.industriesData', 'model.id', function() {
   return _.chain(this.get('model.industriesData'))
      .filter({year: this.get('lastYear')})
      .each(function(d) { d.avg_wage = d.monthly_wages; })
      .value();
  }),
  departmentsData: computed('model.departmentsData', function() {
    return _.each(this.get('model.departmentsData'),
      function(d) { d.avg_wage = d.monthly_wages; }
    );
  }).readOnly(),
  recentDepartmentsData: computed('departmentsData', function() {
    return _.filter(this.get('departmentsData'), { year: this.get('lastYear') });
  }),
  graphbuilderLink: computed('model.id', function() {
    return `industry-${this.get('model.id')}`;
  }),
  hasAverageWage: computed('averageWageDotPlot', function() {
    return _.some(this.get('averageWageDotPlot'), 'avg_wage');
  }),
  hasChildrenIndustries: computed('model.classIndustries', function() {
    return this.get('model.classIndustries').length;
  })
});

