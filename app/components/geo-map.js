import Ember from 'ember';
const { computed, observer } = Ember;

export default Ember.Component.extend({
  classNames: ['geo__wrap'],
  southWest: L.latLng(10.817, -140.547),
  northEast: L.latLng(36.371, -22.231),
  bounds: computed('southWest', 'northEast', function() {
    return L.latLngBounds(this.get('southWest'), this.get('northEast'));
  }),
  accessToken: 'pk.eyJ1IjoiZ3dlemVyZWsiLCJhIjoicXJkMjV6WSJ9.Iw_1c5zREHqNSfdtkjlqbA',
  baseMap: computed('elementId', 'bounds', function() {
    let map = new L.mapbox.map(this.get('elementId'), 'gwezerek.22ab4aa8,gwezerek.da867b0d', {
      accessToken: this.accessToken,
      center: [19,-99],
      zoom: 5,
      maxBounds: this.get('bounds'),
      maxZoom: 19,
      minZoom: 5,
      zoomControl: false
    });
    map.addControl(L.control.zoom({ position: 'bottomleft' })); // Customize position of map zoom
    return map;
  }),
  valueMap: computed('data.[]', 'varDependent', function() {
    let valueMap = d3.map();
    let data = this.get('data');
    let varDependent = this.get('varDependent');

    let nestByDepartmentId = d3.nest()
      .key(function(d) { return Ember.get(d,'department_id'); })
      .entries(data);

    _.forEach(nestByDepartmentId, function(department) {
      valueMap.set(parseInt(department.key), _.sum(department.values, varDependent));
    });

    return valueMap;
  }),
  maxValue: computed('data.[]', function () {
    let varDependent = this.get('varDependent');
    return d3.max(this.get('data'), function(d) { return Ember.get(d, varDependent); });
  }),
  transform: computed('baseMap', function() {
    let baseMap = this.get('baseMap');
    return d3.geo.transform({point: function (x, y) {
        let point = baseMap.latLngToLayerPoint(new L.LatLng(y, x));
        this.stream.point(point.x, point.y);
      }
    });
  }),
  path: computed('transform', function() {
    return d3.geo.path().projection(this.get('transform'));
  }),
  createDeptFeatures: function(json) {
    let valueMap = this.get('valueMap');
    let path = this.get('path');
    let quantize = d3.scale.quantize()
      .domain([0, this.get('maxValue')])
      .range(d3.range(3).map(function(i) { return 'q' + i + '-3'; }));

    let svg = d3.select( this.get('baseMap').getPanes().overlayPane).append('svg');
    let g = svg.append('g').attr('class', 'leaflet-zoom-hide');

    _.forEach(json.features, function(d) {
      d.value = valueMap.get(d.properties.cid_id) || 0;
    });

    let feature = g.selectAll('path')
        .data(json.features);

    feature.enter()
      .append('path')
      .attr('class', function(d) {
        let shadeClass = d.value === 0 ? 'q0' : quantize(d.value);
        return 'geo__department ' + shadeClass;
      });

    this.get('baseMap').on('viewreset', reset);
    reset();

    // Reposition the SVG to cover the features.
    function reset() {
      let bounds = path.bounds(json),
          topLeft = bounds[0],
          bottomRight = bounds[1];
      svg.attr('width', bottomRight[0] - topLeft[0])
          .attr('height', bottomRight[1] - topLeft[1])
          .style('left', topLeft[0] + 'px')
          .style('top', topLeft[1] + 'px');
      g.attr('transform', 'translate(' + -topLeft[0] + ',' + -topLeft[1] + ')');
      feature.attr('d', path);
    }
  },
  addLabelsPane: function() {
    let map = this.get('baseMap');
    L.mapbox.accessToken = this.accessToken;
    let topPane = map._createPane('geo__pane--labels', map.getPanes().mapPane);
    let topLayer = L.mapbox.tileLayer('gwezerek.5c56c40b').addTo(map);
    topPane.appendChild(topLayer.getContainer());
    topLayer.setZIndex(10);
  },
  didInsertElement: function() {
    Ember.run.scheduleOnce('afterRender', this , function() {
      d3.json('assets/geodata/colombia_osm_adm4.geojson', (json) => {
        this.createDeptFeatures(json);
      });
      this.addLabelsPane();
    });
  },
  update: observer('data.[]', 'varDependent', 'i18n.locale', function() {
    if(!this.element){ return false; } //do not redraw if not there
    Ember.run.later(this , function() {
      d3.select(this.get('baseMap').getPanes().overlayPane).select('svg').remove();
      d3.json('assets/geodata/colombia_osm_adm4.geojson', (json) => {
        this.createDeptFeatures(json);
      });
      this.addLabelsPane();
    }, 1000);
  })
});
