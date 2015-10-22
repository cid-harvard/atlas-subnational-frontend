import Ember from 'ember';
import DS from 'ember-data';
import ENV from '../config/environment';
import ModelAttribute from '../mixins/model-attribute';
import numeral from 'numeral';
const {apiURL} = ENV;
const {attr} = DS;
const {computed, $, get:get } = Ember;

export default DS.Model.extend(ModelAttribute, {
  i18n: Ember.inject.service(),
  classIndustries: attr(),
  industriesData: attr(),
  departmentsData: attr(),
  occupationsData: attr(),
  employmentGrowthCalc: function(data) {
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
    var display = numeral(datum[0].employment_growth).format('0.0%');
    return display;
  }),
  lastEmployment: computed('lastDataPoint','i18n.locale', function() {
    return numeral(this.get('lastDataPoint').employment).format('0.00a');
  }),
  lastAvgWage: computed('lastDataPoint','i18n.locale', function() {
    return numeral(this.get('lastDataPoint').avg_wage).format('$ 0.00a');
  }),
  graphbuilderDepartments: computed('id', function() {
    var defaultParams = {
      treemap: { variable: 'employment', startDate: 2013, endDate: 2013 },
      multiples: { variable: 'employment', startDate: 2008, endDate: 2013 },
      geo: { variable: 'employment', startDate: 2013, endDate: 2013 },
      scatter: { variable: null,  startDate: 2013, endDate: 2013 },
      similarty: { variable: null,  startDate: 2013, endDate: 2013 }
    };
    var baseUrl = `${apiURL}/data/industry/${this.get('id')}/participants`;
    var departmentUrl = baseUrl + '?level=department';

    return $.getJSON(departmentUrl)
      .then((response) => {
        let locationsMetadata = this.get('metaData.locations');
        let data = response.data;

        data = _.map(data, (d) => {
          let department = locationsMetadata[d.department_id];
          return _.merge(d, department);
        });
        return { entity: this, entity_type:'industry', data: data, source: 'departments', defaultParams:defaultParams };
      }, (error) => {
        return { error: error, entity: this, entity_type:'industry', data: [], source: 'departments', defaultParams:defaultParams};
      });
  }),
  graphbuilderMunicipalities: computed('id', function() {
    var defaultParams = {
      treemap: { variable: 'employment', startDate: 2013, endDate: 2013 },
      multiples: { variable: 'employment', startDate: 2008, endDate: 2013 },
      scatter: { variable: null,  startDate: 2013, endDate: 2013 },
      similarty: { variable: null,  startDate: 2013, endDate: 2013 }
    };
    var baseUrl = `${apiURL}/data/industry/${this.get('id')}/participants`;
    var municipalityiUrl = baseUrl + '?level=municipality';

    return $.getJSON(municipalityiUrl)
      .then((response) => {
        let locationsMetadata = this.get('metaData.locations');
        let data = response.data;

        data = _.map(data, (d) => {
          let municipality = locationsMetadata[d.municipality_id];
          let department = locationsMetadata[municipality.parent_id];
          d.group = department.code;
          return _.merge(d, municipality);
        });
        return { entity: this, entity_type:'industry', data: data, source: 'participants', defaultParams:defaultParams };
      });
  }),
  graphbuilderOccupations: computed('id', function() {
    var defaultParams = {
      treemap: { variable: 'num_vacancies', startDate: 2013, endDate: 2013 },
    };
    var baseUrl = `${apiURL}/data/industry/${this.get('id')}/occupations/?level=minor_group`;

    return $.getJSON(baseUrl)
      .then((response) => {
        let data = response.data;
        let occupationsMetadata = this.get('metaData.occupations');

        data = _.map(data, (d) => {
          let occupation = occupationsMetadata[d.occupation_id];
          d.year = 2013;
          d.group = occupation.code.split('-')[0];
          return _.merge(d, occupation);
        });
        return { entity: this, entity_type:'industry', data: data, source: 'occupations', defaultParams:defaultParams };
      });
  })
});

