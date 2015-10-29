import Ember from 'ember';
import numeral from 'numeral';
const {computed, observer, get:get} = Ember;

export default Ember.Component.extend({
  i18n: Ember.inject.service(),
  classNames: ['buildermod__viz'],
  margin: { top: 20, right: 10, bottom: 30, left: 70 },
  height: 140,
  firstSlice: 48,
  varId: 'code',
  id: '#multiples',
  width: computed(function() {
    return this.$('.multiple:first').width() - this.get('margin.left') - this.get('margin.right');
  }),
  xExtent: computed('dateExtent', 'startDate', 'endDate', function() {
    return [this.get('startDate'), this.get('endDate')];
  }),
  xRange: computed('startDate', 'endDate', function() {
    return d3.range(this.get('startDate'), this.get('endDate'));
  }),
  nestedData: computed('data.[]', 'i18n.locale', function() {
    let key = this.get('varId');
    let varDependent = this.get('varDependent');

    var nest = d3.nest()
      .key(function(d) { return get(d, key); })
      .entries(this.get('data'));

    _.each(nest, (d) => {
      // terrible assumption, but assume that all value share the same name.
      d.name = get(d.values[0], `name_short_${this.get('i18n').display}`) || d.key;
      d.color = get(d.values[0], 'color') || '#00cc99';
    });
    return _.sortBy(nest, (d) => {
      return -_.sum(d.values, varDependent);
    });
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
  maxValue: computed('immutableData.[]', 'varDependent', function () {
    let varDependent = this.get('varDependent');
    return d3.max(this.get('immutableData'), function(d) { return Ember.get(d, varDependent); });
  }),
  xScale: computed('xExtent', 'width', function() {
    return d3.scale.linear()
      .domain(this.get('xExtent'))
      .range([ 0, this.get('width') ]);
  }),
  yScale: computed('maxValue', 'height', function() {
    return d3.scale.linear()
      .range([this.get('height'), 0])
      .domain([0, this.get('maxValue')]);
  }),
  yAxis: computed('yScale', 'width', 'i18n.locale', function() {
    return d3.svg.axis()
      .scale(this.get('yScale'))
      .ticks(5)
      .tickFormat((d) => { return numeral(d).format('0,0.0 a'); })
      .outerTickSize(0)
      .tickSize(-this.get('width'))
      .orient('left');
  }),
  area: computed('xScale', 'yScale', 'height',function() {
    let varDependent = this.get('varDependent');
    return d3.svg.area()
      .x((d) => { return this.get('xScale')(d.year); })
      .y((d) => { return this.get('yScale')(Ember.get(d, varDependent)); })
      .y0(this.get('height'));
  }),
  line: computed('xScale', 'yScale',function() {
    let varDependent = this.get('varDependent');
    return d3.svg.line()
      .x((d) => { return this.get('xScale')(d.year); })
      .y((d) => { return this.get('yScale')(Ember.get(d, varDependent)); });
  }),
  initCharts: function() {
    let data = this.firstSliceData(this.get('nestedData'));

    var container = d3.select("#"+this.get('elementId')).select('.multiples').selectAll('div')
      .data(data, (d,i) => { return [d.key, i, this.get('i18n').locale]; });

    var div = container.enter().append('div')
      .attr('class', 'multiple');

    //has to be retrieved after the 'multiple' div is appended.
    let w = this.get('width');
    let margin = this.get('margin');
    let x = this.get('xScale');
    let y = this.get('yScale');
    let h = this.get('height');
    let xExtent = this.get('xExtent');
    let yAxis = this.get('yAxis');
    let line = this.get('line');
    let area = this.get('area');
    let truncateYear = this.get('truncateYear');
    let varDependent = this.get('varDependent');
    let markerGroup = this.get('markerGroup');

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
      .attr('d', function(d) { return area(d.values); })
      .attr('fill', function(d) { return d.color; });

    svg.append('path')
      .attr('class', 'line')
      .attr('d', function(d) {
        return line(d.values);
      });

    svg.append('rect')
      .classed('marker', true)
      .classed(this.get('markerGroup'), true)
      .attr('width', 5)
      .attr('height', 5)
      .attr('opacity', 0);

    svg.append('text')
      .classed('caption', true)
      .classed(this.get('markerGroup'), true)
      .attr('text-anchor', 'middle')
      .attr('dy', -8);

    svg.append('text')
      .classed('year', true)
      .classed(markerGroup, true)
      .attr('text-anchor', 'middle')
      .attr('dy', 13)
      .attr('y', h);

    function expandTitle() {
      this.classList.add('chart__title--is--expanded');
    }

    function mouseover() {
      d3.selectAll('rect.marker.'+markerGroup).attr('opacity', 1);
      d3.selectAll('.static_year').classed('hidden', true);
      mousemove.call(this);
    }

    function mousemove() {
      var year = x.invert(d3.mouse(this)[0]);
      var date = Math.floor(year);
      var bisect = d3.bisector(function(d) { return d.year; }).left;
      var index = 0;

      d3.selectAll('rect.marker.'+markerGroup)
        .attr('x', x(date))
        .attr('y', function(d) {
          index = bisect(d.values, date, 0, d.values.length - 1);
          let yValue = d.values[index] ? Ember.get(d.values[index], varDependent, 0): 0;
          return y(yValue);
        })
        .attr('transform', function(d) {
          index = bisect(d.values, date, 0, d.values.length - 1);
          let yValue = d.values[index] ? Ember.get(d.values[index], varDependent, 0): 0;
          return 'translate(0, -3.54) rotate( 45 ' + x(date) + ' ' + y(yValue) + ')';
        });

      d3.selectAll('text.caption.'+markerGroup)
        .attr('x', x(date))
        .attr('y', function(d) {
          index = bisect(d.values, date, 0, d.values.length - 1);
          let yValue = d.values[index] ? Ember.get(d.values[index], varDependent, 0): 0;
          return y(yValue);
        })
        .classed(function() {
          if (date === parseInt(xExtent[0])) {
            return 'chart__tooltip--edge--start';
          } else if (date === parseInt(xExtent[1])) {
            return 'chart__tooltip--edge--end';
          }
        },true)
        .attr('dx', function() {
          if (date === parseInt(xExtent[0])) {
            return '-4';
          } else if (date === parseInt(xExtent[1])) {
            return '4';
          }
        })
        .text(function(d) {
          index = bisect(d.values, date, 0, d.values.length - 1);
          let yValue = d.values[index] ? Ember.get(d.values[index], varDependent) : 0;
          if(d.values[index].year != date){ yValue = 0; }

          if(varDependent === 'export_value') {
            return '$' + numeral(yValue).format('0.0a');
          }
          return numeral(yValue).format('0.0a');
        });


      d3.selectAll('text.year.'+markerGroup)
        .attr('x', x(date))
        .text(truncateYear(date));
    }

    function mouseout() {
      d3.selectAll('rect.marker').attr('opacity', 0);
      d3.selectAll('.static_year').classed('hidden', false);
      d3.selectAll('text.caption').text('');
      d3.selectAll('text.year').text('');
    }
    container.exit().remove();
  },
  didInsertElement: function() {
    Ember.run.later(this, function() {
      this.set('parent', this.get('parentView'));
      this.initCharts();
    }, 100);
  },
  willDestroyElement: function() {
    this.initCharts = null;
    this.removeObserver('i18n.locale', this, this.update);
    this.removeObserver('data.[]', this, this.update);
    this.removeObserver('parent.isVisible', this, this.profileTabUpdate);
  },
  profileTabUpdate: observer('parent.isVisible', function() {
    if(this.get('isInTab')) {
      Ember.run.scheduleOnce('afterRender', this , function() {
        this.set('hasMore', true);
        this.set('firstSlice', 12);
        this.initCharts();
      });
    }
  }),
  update: observer('data.[]', 'i18n.locale', function() {
    if(!this.element){ return false; } //do not redraw if not there
    Ember.run.scheduleOnce('afterRender', this , function() {
      d3.select("#"+this.get('elementId'))
        .select('.multiples')
        .selectAll('*')
        .remove(); /// TODO REMOVE THIS LATER FOR TRANSITIONS
      if(this.initCharts) { this.initCharts();}
    });
  }),
  actions: {
    showAll: function() {
      this.set('firstSlice', this.get('nestedData').length);
      this.set('hasMore', false);
      this.initCharts();
    }
  }
});

