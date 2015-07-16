import DS from 'ember-data';
import Ember from 'ember';
import ENV from '../config/environment';
const {apiURL} = ENV;
const {attr} = DS;
const {computed, getWithDefault, $} = Ember;

export default DS.Model.extend({
  i18n: Ember.inject.service(),
  code: attr('string'),

  name_en: attr('string'),
  name_es: attr('string'),

  name_short_en: attr('string'),
  name_short_es: attr('string'),

  description_en: attr('string'),
  description_es: attr('string'),

  level: attr('string'),

  parent_id: attr('string'),

  locale: computed('i18n.locale', function() {
    return this.get('i18n.locale');
  }),
  name: computed('locale', 'name_en', 'name_es', function() {
    let attr = `name_${this.get('locale')}`;
    return this.get(attr) || `${attr} does not exist`;
  }),
  name_short: computed('locale', 'name_short_en', 'name_short_es', function() {
    let attr = `name_${this.get('locale')}`;
    return this.get(attr) || `${attr} does not exist`;
  }),
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
        console.log(d)
        _.extend(d, department);
       });
       debugger
       return { entity: this,
         entity_type:'product',
         data: locations,
         source: 'locations',
         defaultParams: defaultParams
       };
      })
   })
});
