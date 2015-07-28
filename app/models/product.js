import DS from 'ember-data';
import Ember from 'ember';
import ENV from '../config/environment';
import ModelAttribute from '../mixins/model-attribute';
const {apiURL} = ENV;
const {computed, getWithDefault, $} = Ember;

export default DS.Model.extend(ModelAttribute, {
  graphbuilderLocations: computed('id', function() {
    var locations = $.getJSON(`${apiURL}data/locations?product=${this.get('id')}`);
    var defaultParams = {
      treemap: { variable: 'export_value', startDate: 2007, endDate: 2013 },
      multiples: { variable: 'export_value', startDate: 2007, endDate: 2013 },
      geo: { variable: 'export_value', startDate: 2013, endDate: 2014 },
      scatter: { variauble: null,  startDate: 2012, endDate: 2013 },
      similarty: { variauble: null,  startDate: 2012, endDate: 2013 }
    };
    return Ember.RSVP.all([locations])
      .then((array) => {
       let locations = getWithDefault(array[0], 'data', []);
       let locationsMetadata = this.get('metaData.locations');

       // Merge the metadata names of the locations with their ids
       _.each(locations, function(d) {
         let department = locationsMetadata[d.department_id];
         _.extend(d, department);
       });
       return { entity: this,
         entity_type:'product',
         data: locations,
         source: 'locations',
         defaultParams: defaultParams
       };
      }, function() {
       return { entity: this,
         entity_type:'product',
         data: [],
         source: 'locations',
         defaultParams: defaultParams
       };
      });
   })
});
