import Ember from 'ember';
import numeral from 'numeral';

const { computed, observer } = Ember;

export default Ember.Component.extend({
  i18n: Ember.inject.service(),
  featureToggle: Ember.inject.service(),
  classNames: ['geo__wrap'],
  accessToken: 'pk.eyJ1IjoiZ3dlemVyZWsiLCJhIjoicXJkMjV6WSJ9.Iw_1c5zREHqNSfdtkjlqbA',
  baseMap: computed('elementId', function() {
    if(!this.get('elementId')) { return ; }

    let map = new L.mapbox.map(this.get('elementId'), 'gwezerek.22ab4aa8,gwezerek.da867b0d', {
      accessToken: this.accessToken,
      center: this.get('featureToggle.geo_center'),
      zoom: 5,
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
      type: 'layer--',
      style: (feature) => {
        let valueMap = this.get('valueMap');
        return  {
          className: _.get(valueMap.get(_.get(feature, 'properties.cid_id')), 'class') || 'geo__department q0',
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
      let data = this.get('data');
      let parentView = this.get('parentView');
      let layer = omnivore
        .topojson(`assets/geodata/${this.get('i18n').country}.topojson`, null, L.geoJson(null, this.get('customLayerParams')))
        .on('layeradd', (e) => {
          let marker = _.get(e, 'layer');
          let location = _.get(e, 'layer.feature.properties');

          let textKey = this.get('i18n')
            .t(`graph_builder.table.${this.get('varDependent')}`);
          let textValue = _.get(this.get('valueMap').get(location.cid_id), 'value');
          this.set('numberFormat', textValue);
          var toolTipText = `<span> ${location.name} </span> </br> ${textKey} : ${this.get('numberFormat')}`;

          // Retrieve the scatterplot's configuration object
          let elScatter = parentView.get('childViews').filter(function(d) {
            return typeof d['dotPlot'] !== 'undefined';
          })[0];

          marker.on('mouseover', function (e) {

            // Update the geo-legend configuration object (which is a dotplot btw)
            elScatter.get('dotPlot').params({
              highlight: [location.cid_id],
              refresh: true
            });

            // Refreshing the geo-legend
            d3.select(elScatter.get('id')).call(elScatter.get('dotPlot'));

           var datum = data.filter(function(d) {
            return d.department_id === +location.cid_id;
           })[0];

           // Trigger geo-legend's update to show the tooltip
           elScatter.get('dotPlot').params().evt.call('highlightOn', datum);
          });

          // Remove tooltip from geo-legend
          marker.on('mouseout', function () {
            d3.selectAll('.items__mark__div').remove();
            elScatter.get('dotPlot').params({
              highlight: [],
              refresh: true
            });
            elScatter.get('dotPlot').params().evt.call('highlightOut');
          });

        });

      this.set('layer', layer);
      layer.addTo(this.get('baseMap'));
    });
  },
  update: observer('data.[]', 'varDependent', 'i18n.locale', function() {
    if(!this.get('elementId')) { return ; }
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
          let textValue = _.get(this.get('valueMap').get(location.cid_id), 'value');
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
  }),
  willDestroyElement: function() {
    this.removeObserver('i18n.locale', this, this.update);
    this.removeObserver('data.[]', this, this.update);
    this.removeObserver('varDependent', this, this.profileTabUpdate);
  },
});
