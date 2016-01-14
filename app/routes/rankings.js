import Ember from 'ember';
import ENV from '../config/environment';
const {apiURL} = ENV;
const {RSVP, get, computed} = Ember;

export default Ember.Route.extend({
  i18n: Ember.inject.service(),
  firstYear: computed.alias('i18n.firstYear'),
  lastYear: computed.alias('i18n.lastYear'),
  censusYear: computed.alias('i18n.censusYear'),

  model() {

    var data = {
      department: Ember.$.getJSON(`${apiURL}/data/location?level=department`),
      msa: Ember.$.getJSON(`${apiURL}/data/location?level=msa`)
    };
    return RSVP.hash(data).then((model) => {
      let departmentRanking = get(model, 'department.data')
      let msaRanking = get(model, 'msa.data')
      let latestYear = get(this, 'lastYear');
      let locationsMetadata = this.modelFor('application').locations;

      departmentRanking = _.chain(departmentRanking)
        .filter({year: latestYear})
        .each((d) => {
          let locationName = get(locationsMetadata, `${d.department_id}.name_en`);
          d.name_short_en = locationName;
          d.name_short_es = locationName;
        })
        .sortBy('eci')
        .reverse()
        .value();

      msaRanking = _.chain(msaRanking)
        .filter({year: latestYear})
        .each((d) => {
          let locationName = get(locationsMetadata, `${d.location_id}.name_en`);
          d.name_short_en = locationName;
          d.name_short_es = locationName;
        })
        .sortBy('eci')
        .reverse()
        .value();

     return { msa: msaRanking, department: departmentRanking };
    });
  }
});
