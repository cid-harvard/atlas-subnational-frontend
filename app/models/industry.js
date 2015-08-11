import Ember from 'ember';
import DS from 'ember-data';
import ENV from '../config/environment';
import ModelAttribute from '../mixins/model-attribute';
import numeral from 'numeral';
const {apiURL} = ENV;
const {attr} = DS;
const {computed, $, get:get } = Ember;

export default DS.Model.extend(ModelAttribute, {
  classIndustries: attr(),
  industriesData: attr(),
  departmentsData: attr(),

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
    return `${firstYear} - ${lastYear}`;
  }),
  lastEmployment: computed('lastDataPoint', function() {
    return numeral(this.get('lastDataPoint').employment).format('0.00 a');
  }),
  lastAvgWage: computed('lastDataPoint', function() {
    return numeral(this.get('lastDataPoint').avg_wage).format('$ 0.00 a');
  }),
  graphbuilderDepartments: computed('id', function() {
    var defaultParams = {
      treemap: { variable: 'employment', startDate: 2012, endDate: 2013 },
      multiples: { variable: 'employment', startDate: 2008, endDate: 2013 },
      scatter: { variauble: null,  startDate: 2012, endDate: 2013 },
      similarty: { variauble: null,  startDate: 2012, endDate: 2013 }
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
        return { entity: this, entity_type:'industry', data: data, source: 'locations', defaultParams:defaultParams };
      }, (error) => {
        return { error: error, entity: this, entity_type:'industry', data: [], source: 'locations', defaultParams:defaultParams};
      });
  }),
  graphbuilderMunicipalities: computed('id', function() {
    var defaultParams = {
      treemap: { variable: 'employment', startDate: 2012, endDate: 2013 },
      multiples: { variable: 'employment', startDate: 2012, endDate: 2013 },
      scatter: { variauble: null,  startDate: 2012, endDate: 2013 },
      similarty: { variauble: null,  startDate: 2012, endDate: 2013 }
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
  })
});

