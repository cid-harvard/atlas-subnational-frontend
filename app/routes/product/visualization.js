import Ember from 'ember';
import ENV from '../../config/environment';

const {apiURL} = ENV;
const {RSVP, computed, $, set, get:get} = Ember;

export default Ember.Route.extend({
  i18n: Ember.inject.service(),
  firstYear: computed.alias('i18n.firstYear'),
  lastYear: computed.alias('i18n.lastYear'),

  queryParams: {
    rca: { refreshModel: false },
    startDate: { refreshModel: false },
    endDate: { refreshModel: false },
    search: { refreshModel: false }
  },
  controllerName: 'visualization',
  renderTemplate() {
    this.render('visualization');
  },
  model(params) {
    let {product_id, visualization_type, source_type, variable} = params;
    set(this, 'product_id', product_id);
    set(this, 'source_type', source_type);
    set(this, 'visualization_type', visualization_type);
    set(this, 'variable', variable);

    return RSVP.hash(this.get(source_type)).then((hash) => {
      if(source_type === 'departments') {
        return this.departmentsDataMunging(hash);
      } else if (source_type === 'cities') {
        return this.citiesDataMunging(hash);
      }
    });
  },
  afterModel(graphbuilderModel) {
    return graphbuilderModel.setProperties({
      visualization: get(this, 'visualization_type'),
      source: get(this, 'source_type'),
      metaData: this.modelFor('application'),
      variable: get(this, 'variable'),
      entity_type:'product',
    });
  },
  departments: computed('product_id', function() {
    let id = get(this, 'product_id');
    return {
      model: this.store.find('product', id),
      locations: $.getJSON(`${apiURL}/data/product/${id}/exporters?level=department`)
    };
  }),
  cities: computed('product_id', function() {
    let id = get(this, 'product_id');
    return {
      model: this.store.find('product', id),
      cities: $.getJSON(`${apiURL}/data/product/${id}/exporters?level=msa`)
    };
  }),
  departmentsDataMunging(hash) {
    let {model,locations} = hash;
    let locationsMetadata  = this.modelFor('application').locations;

    let data = _.map(locations.data, (d) => {
      let location = locationsMetadata[d.department_id];
      d.name_short_en = location.name_short_en;
      d.name_short_es = location.name_short_es;
      d.color = location.color;
      d.code = location.code;
      d.group = location.group;
      return d;
    });

    return Ember.Object.create({
      entity: model,
      data: data,
    });
  },
  citiesDataMunging(hash) {
    let {model,cities} = hash;
    let locationsMetadata  = this.modelFor('application').locations;

    let data = _.map(cities.data, (d) => {
      let city = locationsMetadata[d.msa_id];
      d.name_short_en = city.name_short_en;
      d.name_short_es = city.name_short_es;
      d.color = city.color;
      d.code = city.code;
      d.group = city.group;
      return d;
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

