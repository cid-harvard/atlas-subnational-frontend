import Ember from 'ember';
import numeral from 'numeral';
const {computed, observer, get:get} = Ember;

export default Ember.Component.extend({
  i18n: Ember.inject.service(),
  classNames: ['buildermod__viz', 'container-fluid'],
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
  max_values: function(values) {
    let varDependent = this.get('varDependent');
    let max = 0;
    let year = 0;

    values.forEach(function (o) {
      max = Math.max(max, o[varDependent]);

      if(o[varDependent] === max){
        year = o["year"];
      }

    });
    return {"x": year, "y": max};
  },
  nestedData: computed('data.[]', 'i18n.locale', function() {
    let key = this.get('varId');
    let varDependent = this.get('varDependent');

    var nest = d3.nest()
      .key(function(d) { return get(d, key); })
      .entries(this.get('data'));

    _.each(nest, (d) => {
      // terrible assumption, but assume that all value share the same name.
      d.name = get(d.values[0], `name_short_${this.get('i18n').display}`) || d.key;
      d.color = '#FFCD00';
      d.code = get(d.values[0], 'code');
      d.values = _.sortBy(d.values, "year");
      d.max_values = this.max_values(d.values);
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
      .y((d) => { return this.get('yScale')(get(d, varDependent)); })
      .y0(this.get('height'));
  }),
  line: computed('xScale', 'yScale',function() {
    let varDependent = this.get('varDependent');
    return d3.svg.line()
      .x((d) => { return this.get('xScale')(d.year); })
      .y((d) => { return this.get('yScale')(get(d, varDependent)); });
  }),
  initCharts: function() {
    let data = this.firstSliceData(this.get('nestedData'));
    let dataType = this.get('dataType');

    var container = d3.select("#"+this.get('elementId')).select('.row').selectAll('div')
      .data(data, (d,i) => { return [d.key, i, this.get('i18n').locale]; });

    var div = container.enter().append('div')
      .attr('class', 'multiple d-flex flex-row col-12 col-md-6 col-lg-3 pt-5 ' + this.get('markerGroup'))
      .style('background-color', '#292A48');

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
      .text((d) => {
        if(get(d, 'code') && !_.contains(['landUses', 'farmtypes', 'agproducts', 'nonags', 'livestock', 'locations'], this.get('dataType'))) {
          return `${get(d, 'name')} - ${get(d, 'code')}`;
        } else {
          return get(d, 'name');
        }
      });

    var svg = div.append('svg')
      .attr('class', 'chart__wrap')
      .attr('viewBox', `0 0 ${w + margin.left + margin.right} ${h + margin.top + margin.bottom}`)
    .append('g')
      .attr('class', 'chart')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    svg.append('rect')
      .attr('class', 'background')
      .attr('width', w)
      .attr('height', h);

    svg.append('rect')
      .attr('class', 'hover--svg')
      .attr('width', w + margin.right)
      .attr('height', h + margin.top + margin.bottom)
      .attr('transform', 'translate(0,' + -margin.top + ')')
      .on('mouseover', mouseover)
      .on('mousemove', mousemove)
      .on('mouseout', mouseout);

    svg.append('text')
      .attr('class', 'static_year')
      .attr('text-anchor', 'middle')
      .attr('dy', 13)
      .attr('y', h)
      .attr('x', 0)
      .text(truncateYear(this.get('xExtent')[0]));

    svg.append('text')
      .attr('class', 'static_year')
      .attr('text-anchor', 'middle')
      .attr('dy', 13)
      .attr('y', h)
      .attr('x', w)
      .text(truncateYear(this.get('xExtent')[1]));



    svg.append('path')
      .attr('class', 'area')
      .attr('d', function(d) { return area(d.values); })
      .attr('fill', function(d) { return d.color; });

    svg.append('path')
      .attr('class', 'line')
      .attr('d', function(d) {
        return line(d.values);
      });

      svg.append('g')
      .attr('class', 'axis axis--y')
      .call(yAxis);

    svg.append('rect')
      .classed('marker', true)
      .classed(this.get('markerGroup'), true)
      .attr('width', 10)
      .attr('height', 10)
      .attr('opacity', 0);


    // Max value
    svg.append('circle')
      .classed('marker_fixed', true)
      //.attr('width', 10)
      //.attr('height', 10)
      .attr('opacity', 1)
      .attr('r', 5)
      .attr('cx', function(d) {
        return x(d.max_values.x);
      })
      .attr('cy', function(d) {
        return y(d.max_values.y);
      })
      //.attr('transform', function(d) {
      //  return 'translate(0, -3.54) rotate( 45 ' + x(d.max_values.x) + ' ' + y(d.max_values.y) + ')';
      //});

    svg.append('rect')
    .classed('tooltip-max_value', true)
    .attr('width', 80)
    .attr('height', 20)
    .attr('opacity', 1)
    .attr('fill', 'white')
    .attr('rx', '5')
    .attr('ry', '5')
    .attr('x', function(d) {
      return x(d.max_values.x) - 75;
    })
    .attr('y', function(d) {
      return y(d.max_values.y) - 25;
    });

    svg.append('text')
      .classed('max_value', true)
      .classed(markerGroup, true)
      .attr('text-anchor', 'end')
      .attr('fill', 'black')
      .attr('dy', - 10)
      .attr('x', function(d) {
        return x(d.max_values.x)
      })
      .attr('y', function(d) {
        return y(d.max_values.y)
      })

    svg.append('text')
      .classed('max_value_year', true)
      .classed(markerGroup, true)
      .attr('text-anchor', 'middle')
      .attr('dy', 13)
      .attr('x', function(d) {
        return x(d.max_values.x)
      })
      .attr('y', h);

    d3.selectAll('text.max_value')
      .text(function(d) {
        return numeral(d.max_values.y).format('0.0a');
      });

    d3.selectAll('text.max_value_year')
      .text(function(d) {
        return truncateYear(d.max_values.x)
      });


      svg.append('rect')
      .classed('tooltip-value', true)
      .classed(this.get('markerGroup'), true)
      .attr('width', 80)
      .attr('height', 20)
      .attr('opacity', 0)
      .attr('fill', 'white')
      .attr('rx', '5')
      .attr('ry', '5');


    svg.append('text')
      .classed('caption', true)
      .classed(this.get('markerGroup'), true)
      .attr('text-anchor', 'end')
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
      d3.selectAll('rect.tooltip-max_value').attr('opacity', 0);
      d3.selectAll('rect.tooltip-value.'+markerGroup).attr('opacity', 1);
      d3.selectAll('text.max_value').attr('opacity', 0);
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
          return 'translate(0, -6.54) rotate( 45 ' + x(date) + ' ' + y(yValue) + ')';
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
            return '0';
          } else if (date === parseInt(xExtent[1])) {
            return '0';
          }
        })
        .attr('dy', function() {
          return '-10';
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


        d3.selectAll('rect.tooltip-value')
        .attr('x', x(date) - 75)
        .attr('y', function(d) {
          index = bisect(d.values, date, 0, d.values.length - 1);
          let yValue = d.values[index] ? Ember.get(d.values[index], varDependent, 0): 0;
          return y(yValue) - 25;
        })


      d3.selectAll('text.year.'+markerGroup)
        .attr('x', x(date))
        .text(truncateYear(date));
    }

    function mouseout() {
      d3.selectAll('rect.tooltip-max_value').attr('opacity', 1);
      d3.selectAll('rect.tooltip-value').attr('opacity', 0);
      d3.selectAll('text.max_value').attr('opacity', 1);
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
      if(this.get('parent.isVisible')) {
        this.initCharts();
      }
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
        if(this.get('parent.isVisible')) {
          this.initCharts();
        }
      });
    }
  }),
  update: observer('data.[]', 'i18n.locale', function() {
    if(!this.element){ return false; } //do not redraw if not there
    Ember.run.scheduleOnce('afterRender', this , function() {
      d3.select("#"+this.get('elementId'))
        .select('.row')
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
    },
    savePdf: function savePdf() {
      alert('Iniciando la descarga, este proceso tardara un momento.');
      var PDF_Width = 800;
      var PDF_Height = 600;
      var pdf = new jsPDF('l', 'pt', [PDF_Width, PDF_Height]);
      var domNodes = $('.multiple.' + this.get('markerGroup'));
      var totalPDFPages = domNodes.length;
      var countPages = totalPDFPages;
      var d = new Date();
      var file_name = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear() + " " + d.getHours() + "_" + d.getMinutes() + "_" + d.getSeconds();

      for (var domNode of domNodes) {
        var options = {
          width: domNode.clientWidth * 4,
          height: domNode.clientHeight * 4,
          style: {
            transform: 'scale(' + 4 + ')',
            transformOrigin: 'top left',
            padding: 0,
            paddingTop: '30px'
          }
        };

        var HTML_Width = 800;
        var HTML_Height = 600;
        var canvas_image_width = HTML_Width;
        var canvas_image_height = HTML_Height;

        domtoimage.toJpeg(domNode, options)
          .then(function (dataUrl) {
            var myImage = dataUrl;
            pdf.addImage(myImage, 'JPG', 0, 0, canvas_image_width, canvas_image_height);
            countPages--;
            if (countPages === 0) {
              pdf.save(file_name + '.pdf');
              saveAs(pdf, file_name + '.pdf');
            } else {
              pdf.addPage(PDF_Width, PDF_Height);
            }
          })
          .catch(function (error) {
          });
      }
    }
  }
});

