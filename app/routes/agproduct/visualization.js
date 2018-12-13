import Ember from 'ember';
import ENV from '../../config/environment';

const {apiURL} = ENV;
const {RSVP, computed, $, set, get, copy} = Ember;

export default Ember.Route.extend({
  i18n: Ember.inject.service(),
  featureToggle: Ember.inject.service(),

  firstYear: computed.alias('featureToggle.year_ranges.agproduct.first_year'),
  lastYear: computed.alias('featureToggle.year_ranges.agproduct.last_year'),

  queryParams: {
    startDate: { refreshModel: false },
    endDate: { refreshModel: false },
    search: { refreshModel: false }
  },
  controllerName: 'visualization',
  renderTemplate() {
    this.render('visualization');
  },
  model(params) {
    let {agproduct_id, visualization_type, source_type, variable} = params;
    set(this, 'agproduct_id', agproduct_id);
    set(this, 'source_type', source_type);
    set(this, 'visualization_type', visualization_type);
    set(this, 'variable', variable);

    return RSVP.hash(this.get(source_type)).then((hash) => {
      if(source_type === 'departments') {
        return this.departmentsDataMunging(hash);
      } else if (source_type === 'municipalities') {
        return this.municipalitiesDataMunging(hash);
      }
    });
  },
  afterModel(graphbuilderModel) {
    return graphbuilderModel.setProperties({
      visualization: get(this, 'visualization_type'),
      source: get(this, 'source_type'),
      metaData: this.modelFor('application'),
      variable: get(this, 'variable'),
      entity_type:'agproduct',
    });
  },
  departments: computed('agproduct_id', function() {
    let id = get(this, 'agproduct_id');
    return {
      model: this.store.find('agproduct', id),
      agproducts: $.getJSON(`${apiURL}/data/agproduct/${id}/locations/?level=department`)
    };
  }),
  municipalities: computed('agproduct_id', function() {
    let id = get(this, 'agproduct_id');
    return {
      model: this.store.find('agproduct', id),
      agproducts: $.getJSON(`${apiURL}/data/agproduct/${id}/locations/?level=municipality`)
    };
  }),
  departmentsDataMunging(hash) {
    let {model,agproducts} = hash;
    let locationsMetadata  = this.modelFor('application').locations;

    let data = _.map(agproducts.data, (d) => {
      return _.merge(
        copy(d),
        locationsMetadata[d.location_id],
        {
          model: 'agproduct',
          department_id: d.location_id
        }
      );
    });

    return Ember.Object.create({
      entity: model,
      data: data,
    });
  },
  municipalitiesDataMunging(hash) {
    let {model,agproducts} = hash;
    let locationsMetadata  = this.modelFor('application').locations;

    let data = _.map(agproducts.data, (d) => {
      return _.merge(
        copy(d),
        locationsMetadata[d.location_id],
        {
          model: 'agproduct',
          municipality_id: d.location_id,
          group: locationsMetadata[d.location_id].parent_id,
          parent_name_en: locationsMetadata[locationsMetadata[d.location_id].parent_id].name_en,
          parent_name_es: locationsMetadata[locationsMetadata[d.location_id].parent_id].name_es,
        }
      );
    });

    return Ember.Object.create({
      entity: model,
      data: data,
    });
  },
  setupController(controller, model) {
    this._super(controller, model);
    controller.set('drawerChangeGraphIsOpen', false); // Turn off other drawers
    controller.set('drawerQuestionsIsOpen', false); // Turn off other drawers
    controller.set('searchText', controller.get('search'));
    window.scrollTo(0, 0);
  },
  resetController(controller, isExiting) {
    controller.set('variable', null);

    if (isExiting) {
      controller.setProperties({
        variable: null,
        startDate: this.get('firstYear'),
        endDate: this.get('lastYear')
      });
    }
  }
});

