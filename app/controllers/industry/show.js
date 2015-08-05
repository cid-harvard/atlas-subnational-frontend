import Ember from 'ember';
import numeral from 'numeral';

const {computed} = Ember;

export default Ember.Controller.extend({
  needs: 'application',
  locale: computed.alias("controllers.application.locale"),
  queryParams: ['year'],
  year: 2013,
  treemapIndependentVars: ['department_id','department_id'],
  employmentGrowthCalc: function(data) {
    let first = _.first(data);
    let last = _.last(data);
    let difference = last.employment / first.employment;
    let power =  1/(data.length-1);

    return (Math.pow(difference, power ) - 1);
  },
  level: computed('model.level', function() {
    return _.capitalize(this.get('model.level'));
  }),
  employmentGrowthDotPlot: computed('model.industriesData', function() {
   return _.chain(this.get('model.industriesData'))
      .groupBy('id')
      .reduce((memo,i) => {
        let datum = _.first(i);
        datum['employment_growth'] = this.employmentGrowthCalc(i);
        memo.push(datum);
        return memo;
      },[])
      .value();
  }),
  displayEmploymentGrowth: computed('employmentGrowthDotPlot', function() {
    let datum = _.where(this.get('employmentGrowthDotPlot'),
      { id: parseInt(this.get('model.id'))}
    );
    return numeral(datum[0].employment_growth).format('0.00 %');
  }),
  averageWageDotPlot: computed('model.industriesData', 'model.id', function() {
   return _.chain(this.get('model.industriesData'))
      .filter({year: this.get('year')})
      .each(function(d) { d.avg_wage = d.wages/d.employment; })
      .value();
  }),
  departmentsData: computed('model.departmentsData', function() {
    return _.each(this.get('model.departmentsData'),
      function(d) { d.avg_wage = d.wages/d.employment; }
    );
  }).readOnly(),
});

