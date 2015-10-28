import DS from 'ember-data';
import Ember from 'ember';
import ENV from '../config/environment';
import ModelAttribute from '../mixins/model-attribute';
const {apiURL} = ENV;
const {computed, $} = Ember;

export default DS.Model.extend(ModelAttribute, {
  graphbuilderLocations: computed('id', function() {
    var defaultParams = {
      treemap: { variable: 'export_value', startDate: this.get('lastYear'), endDate: this.get('lastYear') },
      multiples: { variable: 'export_value', startDate: this.get('firstYear'), endDate: this.get('lastYear') },
      geo: { variable: 'export_value', startDate: this.get('lastYear'), endDate: this.get('lastYear') },
      scatter: { variable: null,  startDate: this.get('lastYear'), endDate: this.get('lastYear') },
      similarty: { variable: null,  startDate: this.get('lastYear'), endDate: this.get('lastYear') }
    };
    return $.getJSON(`${apiURL}/data/product/${this.get('id')}/exporters?level=department`)
      .then((response) => {
       let data = response.data;
       let locationsMetadata = this.get('metaData.locations');

       // Merge the metadata names of the locations with their ids
       data = _.map(data, function(d) {
         let department = locationsMetadata[d.department_id];
         return _.merge(d, department);
       });
       return { entity: this, entity_type:'product', data: data, source: 'locations', defaultParams: defaultParams };
      }, function() {
       return { entity: this, entity_type:'product', data: [], source: 'locations', defaultParams: defaultParams };
      });
   }),
  graphbuilderCities: computed('id', function() {
    var defaultParams = {
      treemap: { variable: 'export_value', startDate: this.get('lastYear'), endDate: this.get('lastYear') },
      multiples: { variable: 'export_value', startDate: this.get('firstYear'), endDate: this.get('lastYear') },
      geo: { variable: 'export_value', startDate: this.get('lastYear'), endDate: this.get('lastYear') },
      scatter: { variable: null,  startDate: this.get('lastYear'), endDate: this.get('lastYear') },
      similarty: { variable: null,  startDate: this.get('lastYear'), endDate: this.get('lastYear') }
    };
    return $.getJSON(`${apiURL}/data/product/${this.get('id')}/exporters?level=msa`)
      .then((response) => {
       let data = response.data;
       let locationsMetadata = this.get('metaData.locations');

       // Merge the metadata names of the locations with their ids
       data = _.map(data, function(d) {
         let department = locationsMetadata[d.msa_id];
         return _.merge(d, department);
       });
       return { entity: this, entity_type:'product', data: data, source: 'cities', defaultParams: defaultParams };
      }, function() {
       return { entity: this, entity_type:'product', data: [], source: 'cities', defaultParams: defaultParams };
      });
   })
});

