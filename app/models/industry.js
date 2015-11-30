import Ember from 'ember';
import DS from 'ember-data';
import ModelAttribute from '../mixins/model-attribute';
import numeral from 'numeral';
const {attr} = DS;
const {computed, get:get } = Ember;

export default DS.Model.extend(ModelAttribute, {
  classIndustries: attr(),
  industriesData: attr(),
  departmentsData: attr(),
  occupationsData: attr(),
  employmentGrowthCalc(data) {
    let first = _.first(data);
    let last = _.last(data);
    let difference = last.employment / first.employment;
    let power =  1/(data.length-1);

    return (Math.pow(difference, power ) - 1);
  },

  timeseries: computed('industriesData','model.id', function() {
    return _.filter(this.get('industriesData'), {industry_id: parseInt(this.get('id'))});
  }),
  firstDataPoint: computed('timeseries', function() {
    return _.first(this.get('timeseries'));
  }),
  lastDataPoint: computed('timeseries', function() {
    return _.last(this.get('timeseries'));
  }),
  yearRange: computed('timeseries', function() {
    var firstYear = get(this.get('firstDataPoint'), 'year');
    var lastYear = get(this.get('lastDataPoint'), 'year');
    return `${firstYear}–${lastYear}`;
  }),
  employmentGrowthDotPlot: computed('industriesData', function() {
   return _.chain(this.get('industriesData'))
      .groupBy('industry_id')
      .reduce((memo,i) => {
        let datum = _.first(i);
        datum['employment_growth'] = this.employmentGrowthCalc(i);
        memo.push(datum);
        return memo;
      },[])
      .value();
  }),
  displayEmploymentGrowth: computed('employmentGrowthDotPlot','i18n.locale', function() {
    let datum = _.where(this.get('employmentGrowthDotPlot'),
      { industry_id: parseInt(this.get('id'))}
    );
    let number = _.get(datum[0],'employment_growth') || 0;
    return numeral(number).format('0.0%');
  }),
  lastEmployment: computed('lastDataPoint','i18n.locale', function() {
    return numeral(this.get('lastDataPoint').employment).format('0.00a');
  }),
  lastAvgWage: computed('lastDataPoint','i18n.locale', function() {
    return numeral(this.get('lastDataPoint.avg_wage')).format('$ 0.00a');
  })
});

