import Ember from 'ember';

const {computed, observer, get, set} = Ember;

export default Ember.Component.extend({
  i18n: Ember.inject.service(),
  featureToggle: Ember.inject.service(),

  ring: null,

  id: computed('componentId', function () {
    return `#${this.get("componentId")}`;
  }),

  centerId: computed("center", function () {
    return this.get("center").toString();
  }),

  nodes: computed('dataType', function() {
    return this.get('graph').nodes;
  }),
  edges: computed('dataType', function() {
    return this.get('graph').edges;
  }),
  dataMetadata: computed('dataType','metadata', function() {
    let type = this.get('dataType');
    return this.get(`metadata.${type}`);
  }),

  networkData: computed('data.[]','nodes', 'dataMetadata', function() {

    let indexedData = _.indexBy(this.get('data'), 'id');
    let metadataIndex = this.get('dataMetadata');

    var networkData = _.map(this.get('nodes'), function(d) {
      let datum = indexedData[d.id] || metadataIndex[d.id];
      if(datum) {
        d.name_short_en = datum.name_short_en + ` (${datum.code})`;
        d.name_short_es = datum.name_short_es + ` (${datum.code})`;
        d.parent_name_en = datum.parent_name_en;
        d.parent_name_es = datum.parent_name_es;
        d.color = datum.color;
        //d[this.get('varDependent')] = datum[this.get('varDependent')];
        //d[this.get('varRCA')] = datum[this.get('varRCA')];
        //d[this.get('varAmount')] = datum[this.get('varAmount')];
      }
      return d;
    }, this);
    return networkData;
  }),

  network: computed('data.[]', 'dataType', 'i18n.locale', 'categoriesFilterList', function() {
    var self = this;
    var ring = new d3plus.Rings()
          .links(this.get("edges"))
          .nodes(this.get("networkData"))
          .label(d => d.name_short_es)
          .color(d => d.color)
          .center(this.get("centerId"))
          .select(this.get("id"))
          .active(this.get("centerId"))
          .on("mousedown", function (d) {
            self.set("center", d.id)
          })
          .render();
    this.set("ring", ring)
  }),

  didInsertElement: function() {
    Ember.run.scheduleOnce('afterRender', this , function() {
      this.get("network");
    });
  },
  observerCenter: observer("center", function () {
    //d3.select(this.get('id')).selectAll('svg').remove();
    //console.log(this.get("center"))

    //this.get("ring")
      //.center(this.get("center"))
      //.render();

  })
});
