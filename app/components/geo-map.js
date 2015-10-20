import Ember from 'ember';
import numeral from 'numeral';

const { computed, observer } = Ember;

export default Ember.Component.extend({
  i18n: Ember.inject.service(),
  classNames: ['geo__wrap'],
  southWest: L.latLng(10.817, -140.547),
  northEast: L.latLng(36.371, -22.231),
  bounds: computed('southWest', 'northEast', function() {
    return L.latLngBounds(this.get('southWest'), this.get('northEast'));
  }),
  accessToken: 'pk.eyJ1IjoiZ3dlemVyZWsiLCJhIjoicXJkMjV6WSJ9.Iw_1c5zREHqNSfdtkjlqbA',
  baseMap: computed('elementId', 'bounds', function() {
    if(!this.get('elementId')) { return false; }

    let map = new L.mapbox.map(this.get('elementId'), 'gwezerek.22ab4aa8,gwezerek.da867b0d', {
      accessToken: this.accessToken,
      center: [19,-99],
      zoom: 5,
      maxBounds: this.get('bounds'),
      maxZoom: 19,
      minZoom: 5,
      zoomControl: false,
    });
    map.addControl(L.control.zoom({ position: 'bottomleft' })); // Customize position of map zoom
    return map;
  }),
  valueMap: computed('data.[]', 'varDependent', function() {
    let valueMap = d3.map();
    let data = this.get('data');
    let varDependent = this.get('varDependent');

    let quantize = d3.scale.quantize()
      .domain([0, this.get('maxValue')])
      .range(d3.range(5).map(function(i) { return 'q' + i + '-5'; }));

    let nestByDepartmentId = d3.nest()
      .key(function(d) { return Ember.get(d,'department_id'); })
      .entries(data);

    _.forEach(nestByDepartmentId, function(location) {
      let sum = _.sum(location.values, varDependent) || 0;
      let shadeClass = sum === 0 ? 'q0' : quantize(sum);
      let params = {
        value: _.sum(location.values, varDependent),
        class: `geo__department ${shadeClass}`,
      };
      valueMap.set(parseInt(location.key), params);
    });

    return valueMap;
  }),
  numberFormat: computed('varDependent', function(key, value) {
    let variable  = this.get('varDependent');
    if('share' === variable){
      return numeral(value).divide(100).format('0.0%');
    } else if('employment' === variable) {
      return numeral(value).format('0.0a');
    } else if('num_vacancies' === variable) {
      return numeral(value).format('0,0');
    } else if('export_value' === variable) {
      return '$ ' + numeral(value).format('0,0');
    } else if('import_value' === variable) {
      return '$ ' + numeral(value).format('0,0');
    } else {
      return numeral(value).format('0.0a');
    }
  }),
  maxValue: computed('data.[]', 'varDependent', function () {
    let varDependent = this.get('varDependent');
    return d3.max(this.get('data'), function(d) { return Ember.get(d, varDependent); });
  }),
  customLayerParams: computed('data.[]', function() {
    return {
      type: 'foo',
      style: (feature) => {
        let valueMap = this.get('valueMap');
        return  {
          className: valueMap.get(_.get(feature, 'properties.cid_id')).class,
          fillOpacity: 1,
          opacity: 1
        };
      }
    };
  }),
  addLabelsPane: function() {
    let map = this.get('baseMap');
    L.mapbox.accessToken = this.accessToken;
    L.mapbox.tileLayer('gwezerek.5c56c40b').addTo(map);
  },
  didInsertElement: function() {
    Ember.run.scheduleOnce('afterRender', this , function() {
      this.addLabelsPane();
      let layer = omnivore
        .topojson(`assets/geodata/${this.get('i18n').country}.topojson`, null, L.geoJson(null, this.get('customLayerParams')))
        .on('layeradd', (e) => {
          let marker = _.get(e, 'layer');
          let location = _.get(e, 'layer.feature.properties');

          let textKey = this.get('i18n')
            .t(`graph_builder.table.${this.get('varDependent')}`);
          let textValue = this.get('valueMap').get(location.cid_id).value;
          this.set('numberFormat', textValue);
          var toolTipText = `<span> ${location.name} </span> </br> ${textKey} : ${this.get('numberFormat')}`;

          marker.bindPopup(toolTipText, {closeButton: false});
          marker.on('mouseover', function () {
            this.openPopup();
          });
          marker.on('mouseout', function () {
            if(! _.get(this,'_popupContent')) { this.closePopup(); }
          });
        });

      this.set('layer', layer);

      layer.addTo(this.get('baseMap'));
    });
  },
  update: observer('data.[]', 'varDependent', 'i18n.locale', function() {
    Ember.run.later(this , function() {
      let map =  this.get('baseMap');
      if(!map) { return; }

      map.removeLayer(this.get('layer'));

      let layer = omnivore
        .topojson(`assets/geodata/${this.get('i18n').country}.topojson`, null, L.geoJson(null, this.get('customLayerParams')))
        .on('layeradd', (e) => {
          let marker = _.get(e, 'layer');
          let location = _.get(e, 'layer.feature.properties');

          let textKey = this.get('i18n')
            .t(`graph_builder.table.${this.get('varDependent')}`);
          let textValue = this.get('valueMap').get(location.cid_id).value;
          this.set('numberFormat', textValue);
          var toolTipText = `<span> ${location.name} </span> </br> ${textKey} : ${this.get('numberFormat')}`;

          marker.bindPopup(toolTipText, {closeButton: false});
          marker.on('mouseover', function () {
            this.openPopup();
          });
          marker.on('mouseout', function () {
            if(! _.get(this,'_popupContent')) { this.closePopup(); }
          });
        });

      this.set('layer', layer);
      layer.addTo(map);
    }, 200);
  })
});
