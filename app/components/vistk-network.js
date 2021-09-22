import Ember from 'ember';
import numeral from 'numeral';

const {computed, observer, get, set} = Ember;

export default Ember.Component.extend({
  i18n: Ember.inject.service(),
  vistkNetworkService: Ember.inject.service(),
  tagName: 'div',
  height: 500,
  inmutableDataInternal: null,
  showPrimaries: false,
  updatedData: null,
  classNames: ['buildermod__viz'],
  attributeBindings: ['width','height'],
  varIndependent: ['group', 'code'],
  id: computed('elementId', function() {
    return `#${this.get('elementId')} section`;
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
        d[this.get('varDependent')] = datum[this.get('varDependent')];
        d[this.get('varRCA')] = datum[this.get('varRCA')];
        d[this.get('varAmount')] = datum[this.get('varAmount')];
      }
      return d;
    }, this);
    return networkData;
  }),
  dataMetadata: computed('dataType','metadata', function() {
    let type = this.get('dataType');
    return this.get(`metadata.${type}`);
  }),
  varRCA: computed('dataType', function() {
    let type = this.get('dataType');
    if(type === 'industries') {
      return 'rca';
    } else if (type === 'products') {
      return 'export_rca';
    }
  }),
  varAmount: computed('dataType', function(){
    let type = this.get('dataType');
    if(type === 'industries') {
      return 'employment';
    } else if (type === 'products') {
      return 'export_value';
    }
  }),
  nodes: computed('dataType', function() {
    return this.get('graph').nodes;
  }),
  edges: computed('dataType', function() {
    return this.get('graph').edges;
  }),
  getPrimariesSecondaries: function (id) {

    var edges = this.get('edges');
    var result_object = {}

    var primaries = edges.filter(function(e) {
      if(typeof e.source !== 'undefined' && typeof e.target !== 'undefined') {
        return e.source.id == id || e.target.id == id;
      } else {
        return false;
      }
    })
    .map(item => {
      if(item.source.id == id){
        return item.target.id
      }
      else {
        return item.source.id
      }
    })

    for(let id2 of primaries){
      var secondaries_acumm = edges.filter(function(e) {
        if(typeof e.source.id !== 'undefined' && typeof e.target.id !== 'undefined') {
          return e.source.id == id2 || e.target.id == id2;
        } else {
          return false;
        }
      })
      .map(item => {
        if(item.source.id == id2){
          return item.target.id
        }
        else {
          return item.source.id
        }
      })
      .filter(item => item != id)

      result_object[`${id2}`] = secondaries_acumm

    }

    return result_object

  },
  network: computed('data.[]', 'varDependent', 'dataType', 'vis', 'i18n.locale', 'toolTipsData', 'categoriesFilterList', 'vistkNetworkService.updated', function() {

    console.log(this.get("vistkNetworkService.updated"))

    let vistkLanguage = this.get('i18n.display') === 'es' ? 'es_ES': 'en_EN';
    var selectedProducts = this.get("selectedProducts");
    var VCRValue = this.get("VCRValue");
    var categoriesFilter = this.get("categoriesFilterList");
    var showPrimaries = this.get("showPrimaries");

    console.log(selectedProducts)

    if(categoriesFilter == undefined){
      categoriesFilter = []
    }

    if(VCRValue == undefined){
      VCRValue = 1
    }

    var tooltips = ["complexity"];
    var self = this;
    var width = self.get("width");
    var height = self.get("height");
    var elementId = this.get("elementId");


    return vistk.viz().params({
      type: 'productspace',
      lang: vistkLanguage,
      height: this.get('height'),
      width: this.get('width'),
      container: this.get('id'),
      margin: {top: 0, right: 0, bottom: 0, left: 0},
      nodes: this.get('nodes'),
      links: this.get('edges'),
      data: this.get('networkData'),
      var_text: `name_short_${this.get('i18n').display}`, //TODO: update with langauge
      var_x: 'x',
      var_y: 'y',
      radius: 5,
      var_color: 'color',
      color: (d) => { return d; },
      y_invert: true,
      var_id: 'id',
      items: [{
        attr: 'name',
        marks: [
          {
          type: 'circle',
          fill: (d) => {
            //if there is no search, color products export > 0 and rca > 1
            // industries if RCA > 1 ( varDependent for industries is also rca )
            if(d[this.get('varRCA')] >= VCRValue){
              if(categoriesFilter.length > 0){
                if(categoriesFilter.includes(d.parent_name_es)){
                  return d.color;
                }
              }
              else{
                return d.color;
              }

            }
          },
          class: (d) => {
            if(d[this.get('varRCA')] > VCRValue) {
              return 'node--is--highlighted';
            }
          },
          evt: [
            {
              type: 'selection',
              func: function(d, i, vars) {

                var primaries = vars.new_data.filter(item => item.__selected__adjacent && item.id != d.id).map(item => item.id)
                var secondaries = vars.new_data.filter(item => item.__selected__secondary).map(item => item.id).filter(item => !primaries.contains(item))


                if(selectedProducts !== undefined){
                  if(!Object.keys(selectedProducts).includes(d.id)){
                    selectedProducts[`${d.id}`] = self.getPrimariesSecondaries(`${d.id}`)
                    self.set('vistkNetworkService.updated', new Date());
                    //selectedProducts.push(d.id)
                    //self.set('vistkNetworkService.updated', new Date());
                  }
                }


                var l = vars.new_data.filter(function(d) {
                  return d.__highlighted__adjacent || d.__selected || d.__selected__secondary;
                }).map(function(d) {
                  return d.id;
                });



                //console.log(primaries)
                //console.log(secondaries)

                vars.refresh = true;
                vars.zoom = l;

                // Remove _s
                d3.select(vars.container).selectAll(".items__mark__text").remove();
                d3.select(vars.container).selectAll(".items__mark__div").remove();

                d3.select(vars.container).call(vars.this_chart);
                d3.selectAll(`.tooltip_${d.id}_${elementId}`).classed('d-none', false);
              }
            },
          ]
        },
          {
            type: 'div',
            x: function(d, i, vars) {
              var offset = 0;
              if(vars.scale > 1) {
                 offset = vars.width/2;
              }
              return (vars.x_scale[0]["func"](d[vars.var_x]) - vars.translate_x) * vars.scale + offset;
            },
            y: function(d, i, vars) {

              var offset = 0;
              if(vars.scale > 1) {
                offset = vars.height/2;
              }
              return (vars.y_scale[0]["func"](d[vars.var_y]) - vars.translate_y) * vars.scale + offset;
            },
            class: function(d) {

              if(selectedProducts !== undefined){
                 if(Object.keys(selectedProducts).contains(String(d.id))){

                    var left = parseInt($(`.tooltip_${d.id}_${elementId}`).css("left"));
                    var top = parseInt($(`.tooltip_${d.id}_${elementId}`).css("top"));
                    if(left > 0 && top > 0 && top < height && left < width){
                      d3.selectAll(`.tooltip_${d.id}_${elementId}`).classed("d-none", false);
                    }


                     if(showPrimaries){
                       for(let id of Object.keys(selectedProducts)){
                          for(let id2 of Object.keys(selectedProducts[id])){
                            setTimeout(function(){
                              d3.selectAll(`.connected_${id}_${id2}`).classed("selected", true)
                              d3.selectAll(`.connected_${id2}_${id}`).classed("selected", true)
                            }, 2000)
                          }

                       }
                     }


                  }


              }



              $( `#close_tooltip_${d.id}_${elementId}` ).click(function() {

                if(selectedProducts !== undefined){

                  if(selectedProducts[`${d.id}`]["close"] == false){
                    self.set('vistkNetworkService.updated', new Date());
                    $( `.tooltip_${d.id}_${elementId}` ).addClass("d-none");
                  }else {
                    delete selectedProducts[`${d.id}`]
                    self.set('vistkNetworkService.updated', new Date());
                    $( `.tooltip_${d.id}_${elementId}` ).addClass("d-none");
                  }

                }


              });

              if(selectedProducts !== undefined){
                 if(Object.keys(selectedProducts).contains(d.id)){
                  return `tooltip_network tooltip_${d.id}_${elementId}`;
                }
              }


              return `d-none tooltip_network tooltip_${d.id}_${elementId}`;
            },
            text: (d) => {
              var data = [{
                'key': this.get('varRCA'),
                'value': get(d,this.get('varRCA'))
              },{
                'key': this.get('varAmount'),
                'value':get(d,this.get('varAmount'))
              }
              ];

              for(let tooltip of tooltips){
                data.push({'key': tooltip, 'value': get(d,tooltip)});
              }

              var textItem = get(d, `name_short_${this.get('i18n').display}`) || d.code;

              var tooltip_text = `<a href="javascript:void(0);" id='close_tooltip_${d.id}_${elementId}' style="color: black; position: absolute; top:0; right:0; padding: 10px; font-size: 2rem;">x</a><span style="color:${get(d, 'color')}">${textItem}</span>`;

              data.forEach((datum) => {
                if(datum.key) {
                  let formattedValue = numeral(get(datum, 'value')).format('0.00a');
                  tooltip_text += '<br>' + this.get('i18n').t(`graph_builder.table.${get(datum,'key')}`) + ': ' + formattedValue;
                }
              });

              return tooltip_text;
            },
            width: 250,
            height: 'auto',
            translate: [0, -10]
          },
          {
            var_mark: '__highlighted',
            type: d3.scale.ordinal().domain([true, false]).range(['div', 'none']),
            x: function(d, i, vars) {
              var offset = 0;
              if(vars.scale > 1) {
                 offset = vars.width/2;
              }
              return (vars.x_scale[0]["func"](d[vars.var_x]) - vars.translate_x) * vars.scale + offset;
            },
            y: function(d, i, vars) {

              var offset = 0;
              if(vars.scale > 1) {
                offset = vars.height/2;
              }
              return (vars.y_scale[0]["func"](d[vars.var_y]) - vars.translate_y) * vars.scale + offset;
            },
            class: function() { return 'tooltip'; },
            text: (d) => {
              var data = [{
                'key': this.get('varRCA'),
                'value': get(d,this.get('varRCA'))
              },{
                'key': this.get('varAmount'),
                'value':get(d,this.get('varAmount'))
              }
              ];

              for(let tooltip of tooltips){
                data.push({'key': tooltip, 'value': get(d,tooltip)});
              }

              var textItem = get(d, `name_short_${this.get('i18n').display}`) || d.code;
              var tooltip_text = `<span style="color:${get(d, 'color')}">${textItem}</span>`;

              data.forEach((datum) => {
                if(datum.key) {
                  let formattedValue = numeral(get(datum, 'value')).format('0.00a');
                  tooltip_text += '<br>' + this.get('i18n').t(`graph_builder.table.${get(datum,'key')}`) + ': ' + formattedValue;
                }
              });

              return tooltip_text;
            },
            width: 250,
            height: 'auto',
            translate: [0, -10]
          },
        ]
      }]
    });
  }),
  toolTipsData: computed('toolTips', function (){
    let toolTips = this.get('toolTips');

    if(toolTips==null){
      return [];
    }
    else{
      return toolTips.split(',');
    }

  }),
  inmutableNestedData: computed('inmutableDataInternal.[]', 'varDependent', 'i18n.locale', 'toolTips', function () {
    var data = this.get('data');

    if(data.length === 0){
      data = []
    }

    var dependent = this.get('varDependent');
    var toolTipsData = this.get('toolTipsData');
    var self = this;
    var updatedData = data.map(item => {

      if(_.get(item, `parent_name_${this.get('i18n').display}`) === _.get(item, `name_${this.get('i18n').display}`)){
        return {
          color: _.get(item, "color"),
          icon: _.get(item, "icon"),
          value: _.get(item, dependent),
          item: item,
          tooltips: toolTipsData.map(varDependent => {
            return {
              "name": self.get('i18n').t(`graph_builder.table.${varDependent}`).string,
              "value": self.formatNumber(_.get(item, varDependent), varDependent, self.get('i18n'))
            };
          })
        };
      }
      else{
        return {
          color: _.get(item, "color"),
          icon: _.get(item, "icon"),
          value: _.get(item, dependent),
          item: item,
          group: _.get(item, `parent_name_${this.get('i18n').display}`),
          parent_code: _.get(item, `parent_code`),
          tooltips: toolTipsData.map(varDependent => {
            return {
              "name": self.get('i18n').t(`graph_builder.table.${varDependent}`).string,
              "value": self.formatNumber(_.get(item, varDependent), varDependent, self.get('i18n'))
            };
          })
        };
      }

    });

    if(updatedData[0] !== undefined){
      if(updatedData[0].hasOwnProperty("group")){
        if(updatedData[0].group == undefined){
          return d3.nest().entries(updatedData);
        }
        return d3.nest().key(function(d) { return d.group; }).entries(updatedData);
      }
      else{
        return d3.nest().entries(updatedData);
      }
    }
    else{
      return []
    }

  }),
  categoriesObject: computed('inmutableNestedData', 'i18n.locale', function() {
    var categories = this.get('inmutableNestedData').map(item => {

      var color = "#33691e";
      var icon = "fas fa-atom";
      var icon_color = "#FFFFFF";

      if(item.hasOwnProperty("color")){
        color = item.color;
      }
      else{
        if(item.hasOwnProperty("values")){
          if(item.values.length > 0){
            if(item.values[0].hasOwnProperty("color")){
              color = item.values[0].color;
            }
          }
        }
      }

      if(item.hasOwnProperty("icon")){
        icon = item.icon;
      }
      else{
        if(item.hasOwnProperty("values")){
          if(item.values.length > 0){
            if(item.values[0].hasOwnProperty("icon")){
              icon = item.values[0].icon;
            }
          }
        }
      }

      return {
          name: item.key,
          color: color,
          icon: icon,
          icon_color: icon_color,
          hide: false,
          isolate: false
      };
    });
    return categories;
  }),
  didInsertElement: function() {
    Ember.run.scheduleOnce('afterRender', this , function() {
      this.set("inmutableDataInternal", this.get("data"));

      var self = this;

      $(".js-range-slider").ionRangeSlider({
        skin: "sharp",
        min: 0,
        max: 10,
        grid: true,
        step: 0.5,
        from: 1,
        onFinish: function (data) {
          self.set("VCRValue", data.from);
          self.set('vistkNetworkService.updated', new Date());
        },
      });

      if(!this.get('width')){ this.set('width', this.$().parent().width()); }
      d3.select(this.get('id')).call(this.get('network'));

      Ember.run.later(this , function() {
        $('.category-button').on("mouseover", function(e) {

          $(this).find("div.tooltip").removeClass("d-none")
        })

        $('.category-button').on("mouseleave", function(e) {
            $(this).find("div.tooltip").addClass("d-none");
        })
      }, 100);

      if(this.get('showMiddle')){
        var svg = d3.select(this.get('id')).select('svg')
        var line = svg.append("g").append("line")

        line.attr("x1", parseInt(svg.style("width"), 10)/2)
        line.attr("y1", 0)
        line.attr("x2", parseInt(svg.style("width"), 10)/2)
        line.attr("y2", parseInt(svg.style("height"), 10))
        line.attr("stroke-dasharray", "15")
        line.attr("stroke", "#FFCD00")
      }

    });
  },
  willDestroyElement: function() {
    this.set('network',  null);
    this.removeObserver('i18n.locale', this, this.update);
    this.removeObserver('data.[]', this, this.update);
  },
  update_categories_filter: observer('categoriesFilter', function () {
    var categoriesFilter = this.get("categoriesFilter");
    //var updated = this.get("inmutableDataInternal").filter(item => categoriesFilter.includes(item.parent_name_es) )
    this.set("vistkNetworkService.categoriesFilter", categoriesFilter)
  }),
  update: observer('data.[]', 'varDependent', 'i18n.locale', function() {

    if(!this.element){ return false; } //do not redraw if not there

    d3.select(this.get('id')).select('svg').remove();

    if(!this.get('width')){ this.set('width', this.$().parent().width()); }
      d3.select(this.get('id')).call(this.get('network'));

    if(this.get('showMiddle')){
        var svg = d3.select(this.get('id')).select('svg')
        var line = svg.append("g").append("line")

        line.attr("x1", parseInt(svg.style("width"), 10)/2)
        line.attr("y1", 0)
        line.attr("x2", parseInt(svg.style("width"), 10)/2)
        line.attr("y2", parseInt(svg.style("height"), 10))
        line.attr("stroke-dasharray", "15")
        line.attr("stroke", "#FFCD00")
      }

  }),
  updateCategoriesObject: function (index, attr) {

    var temp = this.get('categoriesObject').objectAt(index);
    let newValue = !_.get(temp, attr);

    if(attr === "hide"){

      if(newValue === true){
        this.get('categoriesObject').map((item, index_item) =>{

          var temp = this.get('categoriesObject').objectAt(index_item);

          if(index_item === index){
            set(temp, "hide", true);
            set(temp, "isolate", false);
            set(temp, "icon_color", "#292A48");
          }
          else{
            set(temp, "isolate", false);
          }


        });

      }
      else{
        this.get('categoriesObject').map((item, index_item) =>{

          var temp = this.get('categoriesObject').objectAt(index_item);

          if(index_item === index){
            set(temp, "hide", false);
            set(temp, "isolate", false);
            set(temp, "icon_color", "#FFFFFF");
          }
          else{
            set(temp, "isolate", false);
          }

        });
      }


    }
    else if(attr === "isolate"){

      if(newValue === true){


        this.get('categoriesObject').map((item, index_item) =>{

          var temp = this.get('categoriesObject').objectAt(index_item);

          if(index_item !== index){
            set(temp, "isolate", false);
            set(temp, "hide", true);
            set(temp, "icon_color", "#292A48");
          }
          else{
            set(temp, "isolate", true);
            set(temp, "hide", false);
            set(temp, "icon_color", "#FFFFFF");
          }
        });

      }
      else{

        this.get('categoriesObject').map((item, index_item) =>{

          var temp = this.get('categoriesObject').objectAt(index_item);

          set(temp, "isolate", false);
          set(temp, "hide", false);
          set(temp, "icon_color", "#FFFFFF");

        });

      }



    }


    var categoriesFilter = [];

    for(let category of this.get('categoriesObject')) {

      var isolate = category.isolate;
      var hide = category.hide;

      if(isolate === true){
        categoriesFilter = [category.name];
        break;
      }

      if(hide === false){
        categoriesFilter.push(category.name);
      }

    }

    this.set("categoriesFilterList", categoriesFilter);

    //this.set("treemapService.filter_update", new Date())
    //this.set("treemapService.filter_updated_data", updatedData)
    //this.set("updatedData", updatedData);

  },
  actions: {
    check(index, attr) {
      this.updateCategoriesObject(index, attr);
    },
    savePng() {

    },
    savePdf() {

    },
  }
});
