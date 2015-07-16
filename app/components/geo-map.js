import Ember from 'ember';
const { computed } = Ember;

export default Ember.Component.extend({
  classNames: ['geo__wrap'],
  southWest: L.latLng(-14.817, -100.547),
  northEast: L.latLng(21.371, -42.231),
  bounds: computed('southWest', 'northEast', function() {
    return L.latLngBounds(this.get('southWest'), this.get('northEast'));
  }),
  accessToken: 'pk.eyJ1IjoiZ3dlemVyZWsiLCJhIjoicXJkMjV6WSJ9.Iw_1c5zREHqNSfdtkjlqbA',
  baseMap: computed('bounds', 'id', function() {
    let map = new L.mapbox.map(this.get('elementId'), 'gwezerek.22ab4aa8,gwezerek.da867b0d', {
      accessToken: this.accessToken,
      center: [4.6,-74.0833333],
      zoom: 5,
      maxBounds: this.get('bounds'),
      maxZoom: 19,
      minZoom: 5,
      zoomControl: false
    });
    map.addControl(L.control.zoom({ position: 'bottomleft' })); // Customize position of map zoom
    return map;
  }),
  valueMap: computed('data', 'varDependent', function() {
    let valueMap = d3.map();
    let data = this.get('data');
    let varDependent = this.get('varDependent');
    for (let i = data.length - 1; i >= 0; i--) {
      valueMap.set(data[i].id, data[i][varDependent]);
    }
    return valueMap;
  }),
  maxValue: computed('data.[]', function () {
    let varDependent = this.get('varDependent');
    return d3.max(this.get('data'), function(d) { return Ember.get(d, varDependent); });
  }),
  createDeptFeatures: computed('g', 'valueMap', 'baseMap', function() {
    d3.json('assets/geodata/colombia_osm_adm4.geojson', (json) => {
      let that = this;
      let transform = d3.geo.transform({point: projectPoint});
      let path = d3.geo.path().projection(transform);
      let valueMap = this.get('valueMap');
      let quantize = d3.scale.quantize()
          .domain([0, this.get('maxValue')])
          .range(d3.range(3).map(function(i) { return 'q' + i + '-3'; }));

      let svg = d3.select( this.get('baseMap').getPanes().overlayPane ).append('svg');
      let g = svg.append('g').attr('class', 'leaflet-zoom-hide');
      let feature = g.selectAll('path')
          .data(json.features)
        .enter().append('path')
          .attr('class', function(d) {
            let value = valueMap.get(d.properties.cid_id);
            let shadeClass = value === 0 ? 'q0' : quantize(value);
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

      // Use Leaflet to implement a D3 geometric transformation.
      function projectPoint(x, y) {
        let point = that.get('baseMap').latLngToLayerPoint(new L.LatLng(y, x));
        this.stream.point(point.x, point.y);
      }
    });
  }),
  addLabelsPane: computed('baseMap', function() {
    let map = this.get('baseMap');
    L.mapbox.accessToken = this.accessToken;
    let topPane = map._createPane('geo__pane--labels', map.getPanes().mapPane);
    let topLayer = L.mapbox.tileLayer('gwezerek.5c56c40b').addTo(map);
    topPane.appendChild(topLayer.getContainer());
    topLayer.setZIndex(10);
    return;
  }),
  didInsertElement: function() {
    Ember.run.scheduleOnce('afterRender', this , function() {
      this.get('baseMap');
      this.get('loadData');
      this.get('createDeptFeatures');
      this.get('addLabelsPane');
    });
  }
});
