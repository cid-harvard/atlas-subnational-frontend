import Ember from 'ember';
import numeral from 'numeral';

const {computed, observer, get, set} = Ember;

export default Ember.Component.extend({
  i18n: Ember.inject.service(),
  tagName: 'div',
  height: 500,
  categoriesFilter: null,
  VCRValue: 1,
  inmutableDataInternal: null,
  classNames: ['buildermod__viz'],
  attributeBindings: ['width','height'],
  varIndependent: ['group', 'code'],
  id: computed('elementId', function() {
    return `#${this.get('elementId')} section`;
  }),
  networkData: computed('data.[]','nodes', 'dataMetadata', 'categoriesFilter', function() {

    let indexedData = _.indexBy(this.get('data'), 'id');
    let metadataIndex = this.get('dataMetadata');


    var networkData = _.map(this.get('nodes'), function(d) {
      let datum = indexedData[d.id] || metadataIndex[d.id];
      if(datum) {
        d.name_short_en = datum.name_short_en + ` (${datum.code})`;
        d.name_short_es = datum.name_short_es + ` (${datum.code})`;
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
  network: computed('data.[]', 'varDependent', 'dataType', 'vis', 'i18n.locale', 'toolTipsData', function() {
    let vistkLanguage = this.get('i18n.display') === 'es' ? 'es_ES': 'en_EN';
    var tooltips = ["complexity"];

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
        marks: [{
          type: 'circle',
          fill: (d) => {
            //if there is no search, color products export > 0 and rca > 1
            // industries if RCA > 1 ( varDependent for industries is also rca )
            if(d[this.get('varRCA')] >= 1){
              return d.color;
            }
          },
          class: (d) => {
            if(d[this.get('varRCA')] > 1) {
              return 'node--is--highlighted';
            }
          }, evt: [{
            type: 'selection',
            func: function(d, i, vars) {
              var l = vars.new_data.filter(function(d) {
                return d.__highlighted__adjacent || d.__selected;
              }).map(function(d) {
                return d.id;
              });

              vars.refresh = true;
              //vars.zoom = l;

              // Remove tooltips
              d3.select(vars.container).selectAll(".items__mark__text").remove();
              d3.select(vars.container).selectAll(".items__mark__div").remove();

              d3.select(vars.container).call(vars.this_chart);
            }
          }]
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
        }
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
    var updated = this.get("inmutableDataInternal").filter(item => categoriesFilter.includes(item.parent_name_es) )
    this.set("data", updated)
  }),
  update_vcr_filter: observer('VCRValue', function () {
    var VCRValue = this.get("VCRValue");
    var updated = this.get("inmutableDataInternal").filter(item => item.rca >= VCRValue )
    this.set("data", updated)
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

    this.set("categoriesFilter", categoriesFilter);

    //this.set("treemapService.filter_update", new Date())
    //this.set("treemapService.filter_updated_data", updatedData)
    //this.set("updatedData", updatedData);

  },
  actions: {
    check(index, attr) {
      this.updateCategoriesObject(index, attr);
    },
    range_update(){
      this.set("VCRValue", $("#customRange1").val());
    }
  }
});
