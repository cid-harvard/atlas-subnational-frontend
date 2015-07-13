import Ember from 'ember';
const { computed } = Ember;

export default Ember.Component.extend({
  classNames: ['geo__wrap'],
  id: 'geo__wrap',
  southWest: L.latLng(-14.817, -100.547),
  northEast: L.latLng(21.371, -42.231),
  bounds: computed('southWest', 'northEast', function() {
    return L.latLngBounds(this.get('southWest'), this.get('northEast'));
  }),
  map: computed('bounds', 'id', function() {
    return new L.Map(this.get('id'), {
      center: [4.6,-74.0833333],
      zoom: 5,
      maxBounds: this.get('bounds'),
      maxZoom: 19,
      minZoom: 5
    });
  }),
  valueMap: d3.map(),
  initMap: computed('map', function() {
    this.get('map').addLayer(new L.TileLayer('https://{s}.tiles.mapbox.com/v4/gwezerek.22ab4aa8/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZ3dlemVyZWsiLCJhIjoicXJkMjV6WSJ9.Iw_1c5zREHqNSfdtkjlqbA'));
  }),
  svg: computed('map', function() {
    return d3.select( this.get('map').getPanes().overlayPane ).append('svg');
  }),
  g: computed('svg', function() {
    this.get('svg').append('g').attr('class', 'leaflet-zoom-hide');
  }),
  loadData: computed('valueMap', function() {
    let d = this.get('data');
    for (var i = d.data.length - 1; i >= 0; i--) {
      this.get('valueMap').set(d.data[i].department_id, d.data[i].export_value);
    }
  }),
  createDeptFeatures: computed('g', 'valueMap', 'map', 'svg', function() {

    d3.json('geodata/colombia_osm_adm4.geojson', function(json) {

      var transform = d3.geo.transform({point: projectPoint}),
          path = d3.geo.path().projection(transform);

      var feature = this.get('g').selectAll('path')
          .data(json.features)
        .enter().append('path')
          .attr("class", function(d) { return quantize(this.get('valueMap').get(d.properties.cid_id)); });

      this.get('map').on('viewreset', reset);
      reset();

      // Reposition the SVG to cover the features.
      function reset() {
        var bounds = path.bounds(json),
            topLeft = bounds[0],
            bottomRight = bounds[1];

        this.get('svg').attr('width', bottomRight[0] - topLeft[0])
            .attr('height', bottomRight[1] - topLeft[1])
            .style('left', topLeft[0] + 'px')
            .style('top', topLeft[1] + 'px');

        this.get('g').attr('transform', 'translate(' + -topLeft[0] + ',' + -topLeft[1] + ')');

        feature.attr('d', path);
      }

      // Use Leaflet to implement a D3 geometric transformation.
      function projectPoint(x, y) {
        var point = this.get('map').latLngToLayerPoint(new L.LatLng(y, x));
        this.stream.point(point.x, point.y);
      }

      function quantize() {
        return d3.scale.quantize()
          .domain([0, 1871659410])
          .range(d3.range(9).map(function(i) { return "q" + i + "-9"; }));
      }

    });

  }),
  didInsertElement: function() {
    Ember.run.scheduleOnce('afterRender', this , function() {
      this.get('initMap');
      // this.get('loadData');
      // this.get('createDeptFeatures');
    });
  }
});
