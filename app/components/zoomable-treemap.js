import Ember from 'ember';
const {computed, observer, get:get} = Ember;

export default Ember.Component.extend({
  i18n: Ember.inject.service(),
  id: computed('elementId', function() {
    return `#${this.get('elementId')}`;
  }),
  varText: computed('i18n.locale', function() {
    return `name_short_${this.get('i18n').display}`;
  }),
  updatedData: computed('data.[]', 'varDependent', 'varText', 'i18n.locale', 'search', function() {

    var key = this.get('varText');
    var dependent = this.get('varDependent');

    return this.get('data').map(item => {

      if(_.get(item, `parent_name_${this.get('i18n').display}`) === _.get(item, `name_${this.get('i18n').display}`)){
        return { key:_.get(item, key), value:_.get(item, dependent) }
      }
      else{
        return { key:_.get(item, key), value:_.get(item, dependent), group: _.get(item, `parent_name_${this.get('i18n').display}`) }
      }

    });
  }),
  nestedData: computed('updatedData', 'search', function () {
    var updatedData = this.get('updatedData');
    if(updatedData[0].hasOwnProperty("group")){
      return d3.nest().key(function(d) { return d.group; }).entries(updatedData);
    }
    else{
      return d3.nest().entries(updatedData);
    }
  }),
  getColors: computed('updatedData', 'search', 'color', function () {

    var color = this.get('color')

    if(color === 'pink'){
      return ["#880E4F", "#F06292"]
    }
    else if(color === 'green'){
      return ["#33691E", "#9CCC65"]
    }
    return ["#880E4F", "#F06292"]
  }),
  treemap: computed('data.[]', 'id', 'updatedData', 'nestedData', 'varDependent', 'i18n.locale', 'varText', 'search', function () {

    var elementId = this.get('id');
    var value_text = this.get('i18n').t(`graph_builder.table.${this.get('varDependent')}`).string

    var defaults = {
      margin: {top: 24, right: 0, bottom: 0, left: 0},
      rootname: "TOP",
      format: ",d",
      width: 1000,
      height: 500,
      value_text: value_text,
      percent_text: this.get('i18n').t(`graph_builder.table.share`).string,
      colors: this.get('getColors'),
      principal_color: "#292A48"
    };
    var o = {title: "World Population"}
    var data = {key: value_text, values: this.get("nestedData")}

    var root,
      opts = $.extend(true, {}, defaults, o),
      formatNumber = d3.format(opts.format),
      rname = opts.rootname,
      margin = opts.margin,
      theight = 36 + 16;

    var width = opts.width - margin.left - margin.right,
        height = opts.height - margin.top - margin.bottom - theight,
        transitioning;

    var color = d3.scale.linear().domain([100, 0]).interpolate(d3.interpolateHcl).range([defaults.colors[0], defaults.colors[1]]);

    var x = d3.scale.linear()
        .domain([0, width])
        .range([0, width]);

    var y = d3.scale.linear()
        .domain([0, height])
        .range([0, height]);

    var treemap = d3.layout.treemap()
        .children(function(d, depth) { return depth ? null : d._children; })
        .sort(function(a, b) { return a.value - b.value; })
        .mode('squarify')
        .round(false);

    var svg = d3.select(elementId).append("svg")
        .attr('viewBox', `0 0 ${defaults.width} ${defaults.height}`)
        .style("margin-left", -margin.left + "px")
        .style("margin-right", -margin.right + "px")
        .style("background-color", defaults.principal_color)

      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .style("shape-rendering", "crispEdges");

    var grandparent = svg.append("g")
        .attr("class", "grandparent");

    grandparent.append("rect")
        .attr("y", -margin.top)
        .attr("width", width)
        .attr("height", margin.top)
        .style("fill", "orange")
        .style("stroke", "#292A48")

    grandparent.append("text")
        .attr("x", 6)
        .attr("y", 6 - margin.top)
        .attr("dy", ".75em")
        .style("font-family", "sans-serif");

    var Tooltip = d3.select(elementId)
      .append("div")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("padding", "10px 50px")

    var mouseover = function(d) {
      Tooltip.style("visibility", "visible")
    }
    var mousemove = function(d) {
      Tooltip
        .html(`
        <p class="text-center mb-0 text_yellow">${d.key}</p>
        <p class="text-center mb-0">${defaults.value_text}: ${d.value}</p>
        <p class="text-center mb-0">${defaults.percent_text}: ${(d.area * 100).toFixed(1)} %</p>
        `)
        .style("left", function() {

          var width = this.getBoundingClientRect().width

          if(event.clientX - width > 0){
            return (event.pageX - $(elementId).offset().left ) - width + "px"
          }
          else{
            return (event.pageX - $(elementId).offset().left ) + "px"
          }

        })
        .style("top", function() {
          return (event.pageY - $(elementId).offset().top) + 10 + "px"
        })

        
    }
    var mouseleave = function(d) {
      Tooltip.style("visibility", "hidden")
    }

    if (data instanceof Array) {
      root = { key: rname, values: data };
    } else {
      root = data;
    }

    initialize(root);
    accumulate(root);
    layout(root);
    display(root);

    function initialize(root) {
    root.x = root.y = 0;
    root.dx = width;
    root.dy = height;
    root.depth = 0;
  }

    function accumulate(d) {
    return (d._children = d.values)
        ? d.value = d.values.reduce(function(p, v) { return p + accumulate(v); }, 0)
        : d.value;
  }

    function layout(d) {
    if (d._children) {
      treemap.nodes({_children: d._children});
      d._children.forEach(function(c) {
        c.x = d.x + c.x * d.dx;
        c.y = d.y + c.y * d.dy;
        c.dx *= d.dx;
        c.dy *= d.dy;
        c.parent = d;
        layout(c);
      });
    }
  }

    function display(d) {

      grandparent
          .datum(d.parent)
          .on("click", transition)
        .select("text")
          .text(name(d));

      var g1 = svg.insert("g", ".grandparent")
          .datum(d)
          .attr("class", "depth");

      var g = g1.selectAll("g")
          .data(d._children)
        .enter().append("g").on("mouseover", mouseover).on("mousemove", mousemove).on("mouseleave", mouseleave);

      g.filter(function(d) { return d._children; })
          .classed("children", true)
          .on("click", transition);

      var children = g.selectAll(".child")
          .data(function(d) { return d._children || [d]; })
        .enter().append("g");

      children.append("rect")
          .attr("class", "child")
          .call(rect)

      g.append("rect")
          .attr("class", "parent")
          .call(rect);

      var t = g.append("text")
          .attr("class", "ptext")
          .attr("dy", ".75em")

      t.append("tspan")
          .attr("class", "tspan-treemap")
          .style("fill", "white")
          .style("font-size", "1rem")
          .style("font-family", "sans-serif")
          .text(function(d) { return d.key; });
      t.append("tspan")
          .attr("class", "tspan-treemap")
          .style("fill", "white")
          .style("font-size", "1rem")
          .style("font-family", "sans-serif")
          .attr("dy", "1.2em")
          .text(function(d) {
            return (d.area * 100).toFixed(1) + "%";
          });
      t.call(text);

      g.selectAll("rect")
          .style("fill", function(d) {
            return color(d.area*100);
          })
          .style("stroke", "#292A48")

      function transition(d) {
        if (transitioning || !d) return;
        transitioning = true;

        var g2 = display(d),
            t1 = g1.transition().duration(750),
            t2 = g2.transition().duration(750);

        // Update the domain only after entering new elements.
        x.domain([d.x, d.x + d.dx]);
        y.domain([d.y, d.y + d.dy]);

        // Enable anti-aliasing during the transition.
        svg.style("shape-rendering", null);

        // Draw child nodes on top of parent nodes.
        svg.selectAll(".depth").sort(function(a, b) { return a.depth - b.depth; });

        // Fade-in entering text.
        g2.selectAll("text").style("fill-opacity", 0);

        // Transition to the new view.
        t1.selectAll(".ptext").call(text).style("fill-opacity", 0);
        t1.selectAll(".ctext").call(text2).style("fill-opacity", 0);
        t2.selectAll(".ptext").call(text).style("fill-opacity", 1);
        t2.selectAll(".ctext").call(text2).style("fill-opacity", 1);
        t1.selectAll("rect").call(rect);
        t2.selectAll("rect").call(rect);

        // Remove the old node when the transition is finished.
        t1.remove().each("end", function() {
          svg.style("shape-rendering", "crispEdges");
          transitioning = false;
        });
      }

      return g;
    }

    function text(text) {
      
      text.selectAll("tspan")
          .attr("x", function(d) { return x(d.x) + 6; })
          
      text.attr("x", function(d) { return x(d.x) + 6; })
          .attr("y", function(d) { return y(d.y) + 6; })
          .style("opacity", function(d) {

            var rect = this.getBoundingClientRect()

            if(rect.width < x(d.x + d.dx) - x(d.x)){
              if(rect.height < y(d.y + d.dy) - y(d.y)){
                return 1
              }
              else{
                return 0
              }
            }
            else{
              return 0
            }

          });
    }

    function text2(text) {
      text.attr("x", function(d) { return x(d.x + d.dx) - this.getComputedTextLength() - 6; })
          .attr("y", function(d) { return y(d.y + d.dy) - 6; })
          .style("opacity", function(d) { 

            var rect = this.getBoundingClientRect()

            if(rect.width < x(d.x + d.dx) - x(d.x)){
              if(rect.height < y(d.y + d.dy) - y(d.y)){
                return 1
              }
              else{
                return 0
              }
            }
            else{
              return 0
            }

          });
    }

    function rect(rect) {
      rect.attr("x", function(d) { return x(d.x); })
          .attr("y", function(d) { return y(d.y); })
          .attr("width", function(d) { return x(d.x + d.dx) - x(d.x); })
          .attr("height", function(d) { return y(d.y + d.dy) - y(d.y); });
    }

    function name(d) {
      return d.parent
          ? name(d.parent) + " / " + d.key
          : d.key;
    }

  }),
  didInsertElement: function() {
    Ember.run.scheduleOnce('afterRender',this , function() {

      var id = this.get('id')

      d3.select(id).selectAll('svg').remove();
      this.get('treemap');

      

    });
  },
  actions: {
    savePng() {

      var id = this.get('id')      
      var svgElement = $(`${id} svg`).get(0)
      var d = new Date();
      var file_name = d.getDate()  + "-" + (d.getMonth()+1) + "-" + d.getFullYear() + " " + d.getHours() + "_" + d.getMinutes() + "_" + d.getSeconds()

      svgElement.setAttribute("width", svgElement.getBoundingClientRect().width);
      svgElement.setAttribute("height", svgElement.getBoundingClientRect().height);
      svgElement.style.width = null;
      svgElement.style.height= null;

      html2canvas(svgElement, {
          onrendered: function(canvas) {
              var myImage = canvas.toDataURL("image/png");
              saveAs(myImage, `${file_name}.png`);
          }
      });

    },
    savePdf() {

      var id = this.get('id')      
      var svgElement = $(`${id} svg`).get(0)
      var d = new Date();
      var file_name = d.getDate()  + "-" + (d.getMonth()+1) + "-" + d.getFullYear() + " " + d.getHours() + "_" + d.getMinutes() + "_" + d.getSeconds()

      svgElement.setAttribute("width", svgElement.getBoundingClientRect().width);
      svgElement.setAttribute("height", svgElement.getBoundingClientRect().height);
      svgElement.style.width = null;
      svgElement.style.height= null;

      var HTML_Width = svgElement.getBoundingClientRect().width;
      var HTML_Height = svgElement.getBoundingClientRect().height;
      var top_left_margin = 15;
      var PDF_Width = HTML_Width + (top_left_margin * 2);
      var PDF_Height = (PDF_Width * 1.5) + (top_left_margin * 2);
      var canvas_image_width = HTML_Width;
      var canvas_image_height = HTML_Height;

      var totalPDFPages = Math.ceil(HTML_Height / PDF_Height) - 1;

      html2canvas(svgElement, {
          onrendered: function(canvas) {
              var myImage = canvas.toDataURL("image/jpeg", 1.0);
              var pdf = new jsPDF('p', 'pt', [PDF_Width, PDF_Height]);

              pdf.addImage(myImage, 'JPG', top_left_margin, top_left_margin, canvas_image_width, canvas_image_height);

              for (var i = 1; i <= totalPDFPages; i++) { 
                  pdf.addPage(PDF_Width, PDF_Height);
                  pdf.addImage(imgData, 'JPG', top_left_margin, -(PDF_Height*i)+(top_left_margin*4),canvas_image_width,canvas_image_height);
              }

              pdf.save(`${file_name}.pdf`);

              saveAs(pdf, `${file_name}.pdf`);
          }
      });

    },
  },
  update: observer('i18n.display', 'search', function() {
    d3.select(this.get('id')).selectAll('svg').remove();
    this.get('treemap');
  })
});
