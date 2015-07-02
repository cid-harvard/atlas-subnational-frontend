import Ember from 'ember';
import numeral from 'numeral';
const {computed, observer} = Ember;

export default Ember.Component.extend({
  i18n: Ember.inject.service(),
  margin: { top: 20, right: 15, bottom: 30, left: 35 },
  height: 140,
  firstSlice: 40,
  varId: 'code',
  width: computed(function() {
    return this.$('.multiple:first').width() - this.get('margin.left') - this.get('margin.right');
  }),
  id: computed('elementId', function() {
    return '#multiples';//TODO: SMELL
  }),
  xExtent: computed('startDate', 'endDate', function() {
    return [this.get('startDate'), this.get('endDate') - 1];
  }),
  xRange: computed('startDate', 'endDate', function() {
    return d3.range(this.get('startDate'), this.get('endDate'));
  }),
  nestedData: computed('data','firstSlice','i18n.locale', function() {
    let key = this.get('varId');
    let xRange = this.get('xRange');
    let varDependent = this.get('varDependent');

    var nest = d3.nest()
      .key(function(d) { return Ember.get(d, key); })
      .entries(this.get('data'));

    _.each(nest, (d) => {
      // terrible assumption, but assume that all value share the same name.
      d.name = Ember.get(d.values[0], `name_${this.get('i18n').locale}`) || d.key;
    });

    nest = _.chain(nest)
      .toArray()
      .filter(function(d) { return d.values.length === xRange.length; })
      .value();

    return _.sortBy(nest, function(d) {
       return -Ember.get(_.last(d.values), varDependent);
    }); // last year data
  }),
  hasMore: computed('nestedData.[]', function() {
    return this.get('nestedData').length > this.firstSlice;
  }),
  firstSliceData: function(nested) {
    return nested.slice(0, this.firstSlice); //TODO SMELL fix this
  },
  truncateYear: function(year) {
    return '’' + year.toString().slice(-2);
  },
  maxValue: computed('immutableData.[]', function () {
    let varDependent = this.get('varDependent');
    return d3.max(this.get('immutableData'), function(d) { return Ember.get(d, varDependent); });
  }),
  xScale: computed('width', function() {
    return d3.scale.linear()
      .domain(this.get('xExtent'))
      .range([ 0, this.get('width') ]);
  }),
  yScale: computed('height', function() {
    return d3.scale.linear()
      .range([this.get('height'), 0])
      .domain([0, this.get('maxValue')]);
  }),
  yAxis: computed('i18n.locale', function() {
    return d3.svg.axis()
      .scale(this.get('yScale'))
      .ticks(3)
      .tickFormat((d) => { return numeral(d).format('0.0 a'); })
      .outerTickSize(0)
      .tickSize(-this.get('width'))
      .orient('left');
  }),
  area: computed(function() {
    let varDependent = this.get('varDependent');
    return d3.svg.area()
      .x((d) => { return this.get('xScale')(d.year); })
      .y((d) => { return this.get('yScale')(Ember.get(d, varDependent)); })
      .y0(this.get('height'));
  }),
  line: computed(function() {
    let varDependent = this.get('varDependent');
    return d3.svg.line()
      .x((d) => { return this.get('xScale')(d.year); })
      .y((d) => { return this.get('yScale')(Ember.get(d, varDependent)); });
  }),
  initCharts: function() {
    let data = this.firstSliceData(this.get('nestedData'));

    var container = d3.select(this.get('id')).selectAll('div')
      .data(data, (d,i) => { return [d.key, i, this.get('i18n.locale')]; });

    var div = container.enter().append('div')
      .attr('class', 'multiple');

    let margin = this.get('margin');
    let x = this.get('xScale');
    let y = this.get('yScale');
    let w = this.get('width');
    let h = this.get('height');
    let yAxis = this.get('yAxis');
    let line = this.get('line');
    let area = this.get('area');
    let truncateYear = this.get('truncateYear');
    let varDependent = this.get('varDependent');

    div.append('h3')
      .attr('class', 'chart__title')
      .on('click', expandTitle)
      .text(function(d) { return Ember.get(d, 'name'); }); // this is to get the name of the data

    var svg = div.append('svg')
      .attr('class', 'chart__wrap')
      .attr('width', w + margin.left + margin.right)
      .attr('height', h + margin.top + margin.bottom)
    .append('g')
      .attr('class', 'chart')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    svg.append('rect')
      .attr('class', 'background')
      .attr('width', w)
      .attr('height', h)
      .on('mouseover', mouseover)
      .on('mousemove', mousemove)
      .on('mouseout', mouseout);

    svg.append('text')
      .attr('class', 'static_year')
      .attr('text-anchor', 'start')
      .attr('dy', 13)
      .attr('y', h)
      .attr('x', 0)
      .text(truncateYear(this.get('xExtent')[0]));

    svg.append('text')
      .attr('class', 'static_year')
      .attr('text-anchor', 'end')
      .attr('dy', 13)
      .attr('y', h)
      .attr('x', w)
      .text(truncateYear(this.get('xExtent')[1]));

    svg.append('g')
      .attr('class', 'axis axis--y')
      .call(yAxis);

    svg.append('path')
      .attr('class', 'area')
      .attr('d', function(d) { return area(d.values); });

    svg.append('path')
      .attr('class', 'line')
      .attr('d', function(d) {
        return line(d.values);
      });

    var hoverMarker = svg.append('rect')
      .classed('marker', true)
      .attr('width', 5)
      .attr('height', 5)
      .attr('opacity', 0);

    var caption = svg.append('text')
      .attr('class', 'caption')
      .attr('text-anchor', 'middle')
      .attr('dy', -8);

    var curYear = svg.append('text')
      .attr('class', 'year')
      .attr('text-anchor', 'middle')
      .attr('dy', 13)
      .attr('y', h);

    function expandTitle() {
      this.classList.add('chart__title--is--expanded');
    }

    function mouseover() {
      hoverMarker.attr('opacity', 1);
      d3.selectAll('.static_year').classed('hidden', true);
      mousemove.call(this);
    }

    function mousemove() {
      var year = x.invert(d3.mouse(this)[0]);
      var date = Math.round(year);
      var bisect = d3.bisector(function(d) { return d.year; }).left;
      var index = 0;

      hoverMarker.attr('x', x(date))
        .attr('y', function(d) {
          index = bisect(d.values, date, 0, d.values.length - 1);

          let yValue = Ember.get(d.values[index], varDependent);
          return y(yValue);
        })
        .attr('transform', function(d) {
          let yValue = Ember.get(d.values[index], varDependent);
          return 'translate(0, -3.54) rotate( 45 ' + x(date) + ' ' + y(yValue) + ')';
        });

      caption.attr('x', x(date))
        .attr('y', function(d) {
          let yValue = Ember.get(d.values[index], varDependent);
          return y(yValue);
        })
        .text(function(d) {
          let yValue = Ember.get(d.values[index], varDependent);
          return numeral(yValue).format('$ 0.00 a');
        });

      curYear.attr('x', x(date))
        .text(truncateYear(date));
    }

    function mouseout() {
      hoverMarker.attr('opacity', 0);
      d3.selectAll('.static_year').classed('hidden', false);
      caption.text('');
      curYear.text('');
    }

    container.exit().remove();
  },
  graphIsActive: computed(function() {
    return this.get('nestedData').length > this.firstSlice;
  }),
  hasMore: computed('nestedData.[]', function() {
    return this.get('nestedData').length > this.firstSlice;
  }),
  didInsertElement: function() {
    Ember.run.scheduleOnce('afterRender', this , function() {
      this.initCharts();
    });
  },
  update: observer('data.[]', 'varDependent', 'dataType', 'vis', 'i18n.locale', function() {
    Ember.run.scheduleOnce('afterRender', this , function() {
      d3.select(this.get('id')).selectAll('*').remove(); /// TODO REMOVE THIS LATER FOR TRANSITIONS
      this.initCharts();
    });
  }),
  actions: {
    showAll: function() {
      this.set('firstSlice', this.get('nestedData').length);
      this.initCharts();
    }
  }
});

