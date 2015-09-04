import Ember from 'ember';
import numeral from 'numeral';

const {computed} = Ember;

export default Ember.Controller.extend({
  i18n: Ember.inject.service(),
  queryParams: ['year'],
  year: 2013,
  treemapIndependentVars: ['department_id','department_id'],
  employmentGrowthDotPlot: computed.alias('model.employmentGrowthDotPlot'),
  level: computed('model.level', function() {
    return _.capitalize(this.get('model.level'));
  }),
  averageWageDotPlot: computed('model.industriesData', 'model.id', function() {
   return _.chain(this.get('model.industriesData'))
      .filter({year: this.get('year')})
      .each(function(d) { d.avg_wage = d.monthly_wages; })
      .value();
  }),
  departmentsData: computed('model.departmentsData', function() {
    return _.each(this.get('model.departmentsData'),
      function(d) { d.avg_wage = d.monthly_wages; }
    );
  }).readOnly(),
  recentDepartmentsData: computed('departmentsData', function() {
    return _.filter(this.get('departmentsData'), { year: 2013 });
  }),
  occupationsData: computed.alias('model.occupationsData')
});

