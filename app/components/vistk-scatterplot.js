import Ember from 'ember';
import numeral from 'numeral';
import ENV from '../config/environment';
const {computed, observer, $, get, set} = Ember;
const {apiURL} = ENV;

export default Ember.Component.extend({
  i18n: Ember.inject.service(),
  vistkScatterplotService: Ember.inject.service(),
  tagName: 'div',
  height: 500,
  varIndependent: 'code',
  categoriesFilter: null,
  VCRValue: 1,
  inmutableDataInternal: null,
  attributeBindings: ['width','height'],
  classNames: ['buildermod__viz','scatterplot'],
  id: computed('elementId', function() {
    return `#${this.get('elementId')} section`;
  }),
  eciValue: computed('endDate', function(){
      let datum = _.first(_.filter(this.get('locationData'),
                                   {'year': parseInt(this.get('endDate'))}));
      if(this.get('dataType') === 'products' && datum) {
        return get(datum, 'eci');
      } else if(this.get('dataType') === 'industries' && datum) {
        return get(datum, 'industry_eci');
      }
  }),
  scatter: computed('data.[]', 'dataType','eciValue','i18n.locale', function() {

    var categoriesFilter = this.get("categoriesFilterList");

    let eci = this.get('eciValue');
    var self = this;
    let selectedProducts = this.get('vistkScatterplotService.selected');
    let vistkLanguage = this.get('i18n.display') === 'es' ? 'es_ES': 'en_EN';
    let format = function(value) { return numeral(value).format('0.00'); };

    if(categoriesFilter == undefined){
      categoriesFilter = []
    }

    return vistk.viz()
    .params({
      type: 'scatterplot',
      margin: {top: 10, right: 20, bottom: 30, left: 30},
      height: this.get('height'),
      width: this.get('width'),
      container: this.get('id'),
      data: this.get('data'),
      var_id: this.get('varIndependent'),
      var_x: 'distance',
      var_y: 'complexity',
      var_r: this.get('varSize'),
      radius_min: 2,
      radius_max: 10,
      x_domain: this.get('x_domain'),
      y_domain: this.get('y_domain'),
      r_domain: this.get('r_domain'),
      x_format: format,
      y_format: format,
      duration: 0,
      var_text: this.get('varIndependent'),
      x_text_custom: this.get('i18n').t('graph_builder.table.distance').string,
      y_text_custom: this.get('i18n').t('graph_builder.table.complexity').string,
      items: [{
        marks: [
        {
          type: 'circle',
          fill: (d) => {

            var color = '#ccc1b9';

            if(categoriesFilter.length > 0){
              if(categoriesFilter.includes(d.parent_name_es)){
                return d.color ? d.color : '#ccc1b9';
              }
              else{
                return color
              }
            }
            else{
              return d.color ? d.color : '#ccc1b9';
            }

          },
          evt: [
            {
              type: 'selection',
              func: function(d, i, vars) {
                if(selectedProducts !== undefined){

                  if(d.__selected){
                    if(!selectedProducts.includes(d.id)){
                      selectedProducts.push(d.id)
                      d3.selectAll(`.tooltip_${d.id}`).classed("d-none", false);
                      self.set('vistkScatterplotService.updated', new Date());
                    }
                  }else{
                    if(selectedProducts.includes(d.id)){

                      const index = selectedProducts.indexOf(d.id);
                      if (index > -1) {
                        selectedProducts.splice(index, 1);
                        d3.selectAll(`.tooltip_${d.id}`).classed("d-none", true);
                        self.set('vistkScatterplotService.updated', new Date());
                      }

                    }
                  }



                }

              }
            },
          ]
        },
        {
          var_mark: '__highlighted',
          type: d3.scale.ordinal().domain([true, false]).range(['line_horizontal', 'none']),
          offset_right: function(d, i, vars) {
              return vars.x_scale[0]['func'].range()[1] - vars.x_scale[0]['func'](d[vars.var_x]) + vars.r_scale(d[vars.var_r]);
          }
        },

        {
          var_mark: '__highlighted',
          type: d3.scale.ordinal().domain([true, false]).range(['line_vertical', 'none']),
          offset_top: function(d, i, vars) {
              return vars.r_scale(d[vars.var_r]);
          }
        },

        {
          var_mark: '__highlighted',
          type: d3.scale.ordinal().domain([true, false]).range(['rect', 'none']),
          translate: function(d, i, vars) {
            return [-vars.x_scale[0]['func'](d[vars.var_x]) - 20, -10];
          },
          height: 25,
          width: 50,
          stroke: 'black',
          stroke_width: '1.5px',
          fill: function() { return 'white'; }
        },

        {
          var_mark: '__highlighted',
          type: d3.scale.ordinal().domain([true, false]).range(['text', 'none']),
          translate: function(d, i, vars) {
            return [-vars.x_scale[0]['func'](d[vars.var_x]) + 25, 0];
          },
          text_anchor: 'end',
          text: function(d, i, vars) {
            return format(d[vars.var_y]);
          }
        },

        {
          var_mark: '__highlighted',
          type: d3.scale.ordinal().domain([true, false]).range(['rect', 'none']),
          translate: function(d, i, vars) {
            return [-25, -vars.y_scale[0]['func'](d[vars.var_y]) + vars.height - vars.margin.bottom - vars.margin.top];
          },
          height: 25,
          width: 50,
          stroke: 'black',
          stroke_width: '1.5px',
          fill: function() { return 'white'; }
        },

        {
          var_mark: '__highlighted',
          type: d3.scale.ordinal().domain([true, false]).range(['text', 'none']),
          translate: function(d, i, vars) {
            return [0, -vars.y_scale[0]['func'](d[vars.var_y]) + vars.height - vars.margin.bottom - vars.margin.top + 10];
          },
          text_anchor: 'middle',
          text: function(d, i, vars) {
            return format(d[vars.var_x]);
          }
        },

        {
          var_mark: '__highlighted',
          type: d3.scale.ordinal().domain([false, true]).range(['none', 'div']),
          class: function() {
            return 'tooltip';
          },
          x: function(d, i, vars) {
            return  vars.x_scale[0]['func'](d[vars.var_x]) + vars.margin.left;
          },
          y: function(d, i, vars) {
            return vars.y_scale[0]['func'](d[vars.var_y]);
          },
          text: (d)  => {
            var data = [{
              'key': this.get('rca'),
              'value': get(d,this.get('rca'))
            },{
              'key': 'cog',
              'value':get(d,'cog')
            },{
              'key': this.get('amount'),
              'value':get(d,this.get('amount'))
            }
            ];
            var textItem = get(d, `name_short_${this.get('i18n').display}`) || d.code;
            var tooltip_text = `<span style="color:${get(d, 'color')}">${textItem} - ${get(d, 'code')}</span>`;

            data.forEach((datum) => {
              if(datum.key) {
                tooltip_text += '<br>' + this.get('i18n').t(`graph_builder.table.${get(datum,'key')}`) + ': ' + format(get(datum,'value'));
              }
            });

            return tooltip_text;
          },
          translate: [0, 0],
          width: 200,
          height: 'auto'
        },

        {
          type: 'div',
          class: function(d) {

            $( `#close_tooltip_${d.id}` ).click(function() {

              const index = selectedProducts.indexOf(d.id);
              if (index > -1) {
                selectedProducts.splice(index, 1);
                d3.selectAll(`.tooltip_${d.id}`).classed("d-none", true);
                self.set('vistkScatterplotService.updated', new Date());
              }
            });

            return `d-none tooltip_network tooltip_${d.id}`;
          },
          x: function(d, i, vars) {
            return  vars.x_scale[0]['func'](d[vars.var_x]) + vars.margin.left;
          },
          y: function(d, i, vars) {
            return vars.y_scale[0]['func'](d[vars.var_y]);
          },
          text: (d)  => {
            var data = [{
              'key': this.get('rca'),
              'value': get(d,this.get('rca'))
            },{
              'key': 'cog',
              'value':get(d,'cog')
            },{
              'key': this.get('amount'),
              'value':get(d,this.get('amount'))
            }
            ];
            var textItem = get(d, `name_short_${this.get('i18n').display}`) || d.code;
            var tooltip_text = `<a href="javascript:void(0);" id='close_tooltip_${d.id}' style="color: black; position: absolute; top:0; right:0; padding: 10px; font-size: 2rem;">x</a><span style="color:${get(d, 'color')}">${textItem} - ${get(d, 'code')}</span>`;

            data.forEach((datum) => {
              if(datum.key) {
                tooltip_text += '<br>' + this.get('i18n').t(`graph_builder.table.${get(datum,'key')}`) + ': ' + format(get(datum,'value'));
              }
            });

            return tooltip_text;
          },
          translate: [0, 0],
          width: 200,
          height: 'auto'
        },

        {
          type: 'line_horizontal',
          filter: function(d, i) {
           return typeof eci !== 'undefined' && i === 0;
          },
          offset_y: function(d, i, vars) {
            return -(vars.y_scale[0]['func'](d[vars.var_y]) - vars.y_scale[0]['func'](eci));
          }
        },

        {
          type: 'text',
          filter: function(d, i) {
           return typeof eci !== 'undefined' && i === 0;
          },
          text: function() {
            var label = vistkLanguage === 'en_EN' ? 'Average complexity': 'Complejidad media';
            return label + ': ' + format(eci);
          },
          text_anchor: 'end',
          offset_y: function(d, i, vars) {
            return -(vars.y_scale[0]['func'](d[vars.var_y]) - vars.y_scale[0]['func'](eci)) - 10;
          },
          offset_x: function(d, i, vars) {
            return vars.x_scale[0]['func'].range()[1] - vars.x_scale[0]['func'](d[vars.var_x]);
          }
        }]
      }],
      lang: vistkLanguage,
    });
  }),
  varSize: computed('dataType', function() {
    if(this.get('dataType') === 'products') { return 'cog'; }
    if(this.get('dataType') === 'industries') { return 'cog'; }
  }),
  rca: computed('dataType', function() {
    if(this.get('dataType') === 'products') { return 'export_rca'; }
    if(this.get('dataType') === 'industries') { return 'rca'; }
  }),
  amount: computed('dataType', function() {
    if(this.get('dataType') === 'products') { return 'export_value'; }
    if(this.get('dataType') === 'industries') { return 'employment'; }
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
      // TODO: Why is this code here >:| Getting location level specific data
    // definitely is not a scatterplot component concern
    this.set("inmutableDataInternal", this.get("data"));

    let id = this.get('entityId');

    let locationLevel = this.get(`metadata.locations.${id}.level`);
    // There are no country level data API (/location/0/?level=country) yet, so
    // in that case just use some defaults and don't care about ECI value.
    if (locationLevel === "country"){
      this.set('width', this.$().parent().width());
      this.set('x_domain', vistk.utils.extent(this.get('modelData'), 'distance'));
      this.set('y_domain', vistk.utils.extent(this.get('modelData'), 'complexity'));
      this.set('r_domain', vistk.utils.extent(this.get('modelData'), this.get('varSize')));
      this.get('updatedDate');
      d3.select(this.get('id')).call(this.get('scatter'));
      return;
    }
    $.getJSON(`${apiURL}/data/location?level=${locationLevel}`).then((response) => {
      let data = get(response, 'data');

      let locationIdField;
      if(locationLevel == "msa"){
        locationIdField = "location_id";
      } else {
        locationIdField = `${locationLevel}_id`;
      }

      let locationData = _.filter(data, {[locationIdField]: parseInt(id) });
      this.set('locationData', locationData);

      this.set('width', this.$().parent().width());

      this.set('x_domain', vistk.utils.extent(this.get('modelData'), 'distance'));
      this.set('y_domain', vistk.utils.extent(this.get('modelData'), 'complexity'));
      this.set('r_domain', vistk.utils.extent(this.get('modelData'), this.get('varSize')));

      this.get('updatedDate');
      d3.select(this.get('id')).call(this.get('scatter'));


    });

    Ember.run.later(this , function() {
      $('.category-button').on("mouseover", function(e) {

        $(this).find("div.tooltip").removeClass("d-none")
      })

      $('.category-button').on("mouseleave", function(e) {
          $(this).find("div.tooltip").addClass("d-none");
      })

    }, 100);
    });
  },

  willDestroyElement: function() {
    this.set('scatter',  null);
    this.removeObserver('i18n.locale', this, this.update);
    this.removeObserver('data.[]', this, this.update);
  },
  update_categories_filter: observer('categoriesFilter', function () {
    var categoriesFilter = this.get("categoriesFilter");
    this.set("vistkScatterplotService.categoriesFilter", categoriesFilter)
    //var updated = this.get("inmutableDataInternal").filter(item => categoriesFilter.includes(item.parent_name_es) )
    //this.set("data", updated)
  }),
  update_vcr_filter: observer('VCRValue', function () {
    var VCRValue = this.get("VCRValue");
    var updated = this.get("inmutableDataInternal").filter(item => item.rca >= VCRValue )
    this.set("data", updated)
  }),
  update: observer('data.[]', 'varRca', 'i18n.locale', 'dataType', function() {

    if(!this.element){ return ; } //do not redraw if not there
    d3.select(this.get('id')).select('svg').remove();
    Ember.run.later(this , function() {
      if(this.get('scatter')) {
        this.get('updatedDate');
        d3.select(this.get('id')).call(this.get('scatter'));
      }
    });
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
    //this.set("vistkScatterplotService.updated", new Date());

    //this.set("treemapService.filter_update", new Date())
    //this.set("treemapService.filter_updated_data", updatedData)
    //this.set("updatedData", updatedData);

  },
  actions: {
    check(index, attr) {
      //this.set('vistkScatterplotService.selected', []);
      this.set('vistkScatterplotService.updated', new Date());
      this.updateCategoriesObject(index, attr);
    },
    range_update(){
      this.set("VCRValue", $("#customRange1").val());
    }
  }
});

