import Ember from 'ember';
const {computed, get, observer, RSVP, set} = Ember;
import ENV from '../../config/environment';

const {apiURL} = ENV;

export default Ember.Controller.extend({
  i18n: Ember.inject.service(),
  featureToggle: Ember.inject.service(),
  buildermodSearchService: Ember.inject.service(),
  departmentCityFilterService: Ember.inject.service(),
  vistkNetworkService: Ember.inject.service(),
  queryParams: ['startDate', 'endDate', 'centerId'],
  categoriesFilterList: [],
  elementId: 'product_space',
  VCRValue: 1,

  visualization: "products",

  isSingleYearData: computed('dateExtent', function(){
    let dateExtent = this.get('dateExtent');
    if (dateExtent){
      if (dateExtent[1] - dateExtent[0] > 0){
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }),

  refreshRing: true,
  getPrimariesSecondaries2: function (id) {

    var edges = this.get('productSpace').edges;
    var result_object = {}

     var primaries = edges.filter(function(e) {
      if(typeof e.source !== 'undefined' && typeof e.target !== 'undefined') {
        if(e.source.id === undefined){
          return e.source == id || e.target == id;
        }
        else{
          return e.source.id == id || e.target.id == id;
        }
      } else {
        return false;
      }
    })
    .map(item => {

      if(item.source.id === undefined){
        if(item.source == id){
          return item.target
        }
        else {
          return item.source
        }
      }
      else{
        if(item.source.id == id){
          return item.target.id
        }
        else {
          return item.source.id
        }
      }


    })

    for(let id2 of primaries){
      var secondaries_acumm = edges.filter(function(e) {
        if(typeof e.source !== 'undefined' && typeof e.target !== 'undefined') {

          if(e.source.id === undefined){
            return e.source == id2 || e.target == id2;
          }
          else{
            return e.source.id == id2 || e.target.id == id2;
          }
        } else {
          return false;
        }
      })
      .map(item => {

        if(item.source.id === undefined){
          if(item.source == id2){
            return item.target
          }
          else {
            return item.source
          }
        }
        else{
          if(item.source.id == id2){
            return item.target.id
          }
          else {
            return item.source.id
          }
        }


      })
      .filter(item => item != id)

      result_object[`${id2}`] = secondaries_acumm

    }

    return result_object

  },
  initialSelectedProducts: computed('model.[]', function () {
    var id = this.get("model.entity.id")
    var selected_products = {}

    selected_products[id] = this.getPrimariesSecondaries2(parseInt(id))

    return selected_products
  }),

  setSelectedProductsbyId: function (id) {

    var selected_products = {}
    selected_products[id] = this.getPrimariesSecondaries2(parseInt(id))

    //console.log(selected_products)

    this.set("selectedProducts", selected_products)
  },

  selectedProducts: computed('model.[]', function () {
    return this.get("initialSelectedProducts");
  }),
  getProduct: function (id) {
    let indexedData = _.indexBy(this.get('networkData'), 'id');
    return indexedData[id]
  },

  product_selected: computed('model', 'center', function () {
    var id = this.get("center")
    var product = this.getProduct(id)
    var product_copy = {}

    Object.assign(product_copy, product)

    return product_copy
  }),

  product_primaries: [],
  product_primaries_total: null,
  product_secondaries: [],
  product_secondaries_total: null,

  center: computed("model", function () {
    return this.get("model.entity.id");
  }),

  categoriesObject: computed('model', 'i18n.locale', function() {

    var products = this.get('model.metaData.products')
    var products_list = []
    var nested_data

    for(let id of Object.keys(products)){
      products_list.push(products[id])
    }

    var updatedData = products_list.map(item => {

      if(_.get(item, `parent_name_${this.get('i18n').display}`) === _.get(item, `name_${this.get('i18n').display}`)){
        return {
          color: _.get(item, "color"),
          icon: _.get(item, "icon"),
          item: item
        };
      }
      else{
        return {
          color: _.get(item, "color"),
          icon: _.get(item, "icon"),
          item: item,
          group: _.get(item, `parent_name_${this.get('i18n').display}`),
          parent_code: _.get(item, `parent_code`),
        };
      }

    });

    if(updatedData[0] !== undefined){
      if(updatedData[0].hasOwnProperty("group")){
        if(updatedData[0].group == undefined){
          nested_data = d3.nest().entries(updatedData);
        }
        nested_data = d3.nest().key(function(d) { return d.group; }).entries(updatedData);
      }
      else{
        nested_data = d3.nest().entries(updatedData);
      }
    }
    else{
      nested_data = []
    }


    var categories = nested_data.map(item => {

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

    //console.log(categories)

    Ember.run.later(this , function() {
      $('.category-button').on("mouseover", function(e) {

        $(this).find("div.tooltip").removeClass("d-none")
      })

      $('.category-button').on("mouseleave", function(e) {
          $(this).find("div.tooltip").addClass("d-none");
      })
    }, 100);

    return categories;




  }),

  searchFilter: observer('buildermodSearchService.search', function() {

    var data = this.get("model.metaData.products");
    var selected = this.get("selectedProducts");
    let search = _.deburr(this.get('buildermodSearchService.search'));
    var self = this;
    var elementId = this.get("elementId");
    var initialSelectedProducts = this.get("initialSelectedProducts")

    if(search === ""){

      //var id_principal = this.get("model.entity.id");


      //d3.selectAll(".tooltip_network").classed("d-none", true);
      //d3.selectAll(`.tooltip_${id_principal}_${elementId}`).classed("d-none", false);

      //this.set("selectedProducts", initialSelectedProducts);
      this.set('vistkNetworkService.updated', new Date());
    }
    else {
      var regexp = new RegExp(search.replace(/(\S+)/g, function(s) { return "\\b(" + s + ")(.*)"; })
      .replace(/\s+/g, ''), "gi");


      var result = _.filter(data, (d) => {
        let parentName = get(d,`parent_name_${this.get('i18n').display}`);
        let longName = get(d,`name_${this.get('i18n').display}`);
        let shortName = get(d,`name_short_${this.get('i18n').display}`);
        let code = get(d, 'code');

        var result_city = _.deburr(`${shortName} ${longName} ${code}`).match(regexp)

        if(result_city !== null){
          return result_city;
        }
        return _.deburr(`${parentName} ${code}`).match(regexp);
      });



      result.map(item => {
        //selected.push(String(item.id))
        self.set("center", item.id)
        self.setSelectedProductsbyId(item.id)
        //this.transitionToRoute('product.ringchart', item.id, {queryParams: { endDate: this.get("endDate"), startDate: this.get("startDate"), centerId: this.get("center") }});

        //self.set('vistkNetworkService.updated', new Date());
        //d3.selectAll(`.tooltip_${item.id}_${elementId}`).classed('d-none', false);
      });
    }

  }),
  formatNumber: (number, key, i18n) => {

    var decimalVars = [
      'export_rca',
      'eci',
      'industry_eci',
      'rca',
      'complexity',
      'distance',
      'cog',
      'coi',
      'industry_coi',
      'population',
      'yield_ratio',
      'yield_index',
      'average_livestock_load',
    ];
    var percentVars = [
      'share',
      'employment_growth'
    ];
    var wageVarsInThousands = [
      'wages',
      'avg_wages',
      'avg_wage',
    ];
    var moneyVars = [
      'gdp_pc_real',
      'gdp_real',
    ];
    var largeNumbers = [
      'export_value',
      'import_value',
      'monthly_wages',
      'average_wages',
      'area',
      'production_tons',
      'land_sown',
      'land_harvested',
      'num_farms',
      'num_livestock',
    ];

    if(_.include(wageVarsInThousands, key)){
      return numeral(number).divide(1000).format('0,0');
    } else if(_.include(decimalVars, key)){
      var result = numeral(number).format('0.00a')
      return result;
    } else if(key === 'employment'){
      return numeral(Math.ceil(number)).format('0,0');
    } else if(key === 'num_establishments' || key === 'export_num_plants'){
      if(parseInt(number) < 6) {
        return i18n.t('graph_builder.table.less_than_5');
      }
      return numeral(number).format('0,0');
    } else if(_.include(percentVars, key)){
      return numeral(number).format('0.00%');
    } else if(_.include(largeNumbers, key)) {
      return numeral(number).format('0,0');
    } else if(_.include(moneyVars, key)) {
      return numeral(number).format('$0.00a');
    } else {
      return number;
    }
  },
  observerCenter: observer("center", function () {
    var center = this.get("center")
    //this.setSelectedProductsbyId(center)
    this.set('vistkNetworkService.updated', new Date());
  }),

  filteredDataTable: computed("model", 'vistkNetworkService.updated', 'departmentCityFilterService.data', 'endDate', function () {

    var selectedProducts = this.get("selectedProducts")
    var self = this;

    var ids = []

    for(let id of Object.keys(selectedProducts)){
      ids.push(id)

      for(let id2 of Object.keys(selectedProducts[id])){
        ids.push(id2)

        for(let id3 of selectedProducts[id][id2]){
          ids.push(id3)
        }

      }

    }

    var productsData = this.get("productsData")
    var result = productsData.filter(item => ids.includes(String(item.id)))

    var indexed_result = _.indexBy(result, 'id');

    var primaries = []
    var secondaries = []

    for(let id of Object.keys(selectedProducts)){

      var product_selected_copy = {}

      Object.assign(product_selected_copy, indexed_result[id])

      product_selected_copy.export_rca = self.formatNumber(product_selected_copy.export_rca, 'export_rca', this.get("i18n"))
      product_selected_copy.export_value = self.formatNumber(product_selected_copy.export_value, 'export_value', this.get("i18n"))
      product_selected_copy.complexity = self.formatNumber(product_selected_copy.complexity, 'complexity', this.get("i18n"))

      this.set("product_selected", product_selected_copy)

      for(let id2 of Object.keys(selectedProducts[id])){
        primaries.push(indexed_result[id2])

        for(let id3 of selectedProducts[id][id2]){
          secondaries.push(indexed_result[id3])
        }

      }


      if(primaries.length > 5){
        this.set("product_primaries_count", primaries.length - 5)
      }
      else{
        this.set("product_primaries_count", 0)
      }

      this.set("product_primaries", primaries.splice(0,5))


      if(secondaries.length > 5){
        this.set("product_secondaries_count", secondaries.length - 5)
      }
      else{
        this.set("product_secondaries_count", 0)
      }

      this.set("product_secondaries", secondaries.splice(0,5))

    }

    //console.log(indexed_result)

    return result
  }),

  rangeYears: computed('firstYear', 'lastYear', function(){
    var min = this.get("firstYear");
    var max = this.get("lastYear");
    return [...Array(max - min + 1).keys()].map(i => i + min);
  }),

  entityType: "product",
  source: "products",

  location: computed("departmentCityFilterService.name", function (){
    this.get("departmentCityFilterService.data")
    this.get('buildermodSearchService.search')
    return this.get("departmentCityFilterService.name");
  }),
  locationId: computed("departmentCityFilterService.id", function (){
    return this.get("departmentCityFilterService.id");
  }),
  departmentsDataSelect: computed("model", function () {

    this.set("selectedProducts", this.get("initialSelectedProducts"))

    var all_locations = Object.values(this.get("model.metaData.locations"))

    var locations = all_locations.filter(item => item.level === "department").map( (item) => {
      var chained = all_locations.filter(item2 => item.id === item2.parent_id).map(item => ({'id': item.id, 'text': `${item.name_es} (${item.code})`}))
      return {'id': item.id, 'text': `${item.name_es} (${item.code})`, 'chained': chained}
    })
    return locations
  }),



  productSpace: computed.alias('model.metaData.productSpace'),
  productsData: computed('model', 'endDate', 'departmentCityFilterService.data', 'VCRValue', 'categoriesFilterList', function () {

    var id = this.get("departmentCityFilterService.id");
    var startDate = this.get("startDate");
    var endDate = this.get("endDate");

    if(id == 0){
      $("#spinner_complexmap").addClass("d-none")
      $("#complexmap").removeClass("d-none")
      $("#complexmaptable").removeClass("d-none")
      return this.get("model.products_col").filter(item => item.year >= startDate && item.year <= endDate);
    }

    var data = this.get("departmentCityFilterService.data");

    var data_filtered = data.filter(item => item.year >= startDate && item.year <= endDate);
    $("#spinner_complexmap").addClass("d-none")
    $("#complexmap").removeClass("d-none")
    $("#complexmaptable").removeClass("d-none")

    return data_filtered

  }),

  dateExtent: computed('model', function() {
    //this.set('startDate', this.get('lastYear'));
    //this.set('endDate', this.get('lastYear'));
    return  [this.get('firstYear'), this.get('lastYear')];
  }),

  productsDataValues: computed('model', function(){

    var locations = Object.entries(this.get('model.metaData.products'));
    var edgesSourcesProductSpace = this.get('model.metaData.productSpace.edges').map(item => {
      if(item.source.id === undefined){
        return item.source;
      }
      else{
        return item.source.id;
      }
    });

    var edgesTargetsProductSpace = this.get('model.metaData.productSpace.edges').map(item => {
      if(item.target.id === undefined){
        return item.target;
      }
      else{
        return item.target.id;
      }
    });

    const valid_ids = [...edgesSourcesProductSpace, ...edgesTargetsProductSpace];

    return locations.filter(item => item[1].level === "4digit" && valid_ids.includes(item[0])).map((item) => {

      var name = get(item[1], `name_short_${this.get('i18n').display}`)

      return {id:item[1].id, text: `${name} (${item[1].code})`}
    })
  }),

  placeHolderText: computed('i18n.locale', 'source', function(){
    return this.get('i18n').t(`visualization.source.${this.get('source')}`).string
  }),

  filteredDataAsync: observer("departmentCityFilterService.id", function () {

    var id = this.get("departmentCityFilterService.id");
    var productsMetadata = this.get("model.metaData.products")
    var self = this

    var products = $.getJSON(`${apiURL}/data/location/${id}/products?level=4digit`)

    var promises = [products]

    var result = RSVP.allSettled(promises).then((array) => {
      let productsData = array[0].value.data;

      let productsDataResponse = _.reduce(productsData, (memo, d) => {
        let product = productsMetadata[d.product_id];
        product.complexity = _.result(_.find(product.pci_data, { year: d.year }), 'pci');
        memo.push(_.merge(d, product));
        return memo;
      }, []);

      self.set("departmentCityFilterService.data", productsDataResponse)

      return productsDataResponse
    });
  }),

  filterData: computed('source', function(){
    return this.get('productsDataValues');
  }),

  firstYear: computed.alias('featureToggle.first_year'),
  lastYear: computed.alias('featureToggle.last_year'),
  occupationsData: computed.alias('model.occupationsData'),
  modelData: computed.alias('model.entity'),
  exportDataLocations: computed('model.data', 'startDate', function (){
    return this.get("model.locationsData").filter(item => item.year === this.get("startDate"));
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
        categoriesFilter = [category.color];
        break;
      }

      if(hide === false){
        categoriesFilter.push(category.color);
      }

    }
    d3.selectAll("circle").style("fill", "#fff");
    categoriesFilter.map(color => {
      d3.selectAll("circle").filter(function(d){return d.node.color === color}).style("fill", color);
    })

    //console.log(categoriesFilter)

    //this.set("categoriesFilterList", categoriesFilter);

    //this.set("treemapService.filter_update", new Date())
    //this.set("treemapService.filter_updated_data", updatedData)
    //this.set("updatedData", updatedData);

  },
  actions: {
    check(index, attr) {
      this.updateCategoriesObject(index, attr);
    },
    savePng() {
      alert('Iniciando la descarga, este proceso tardará un momento.');
      var domNode = $('#complexmap')[0];
      var d = new Date();
      var filename = this.get("filename");
      var file_name = `${this.get("endDate")} - RingChart - ${this.get("model.entity.name")} (${this.get("model.entity.code")}')`;

      if(filename){
        file_name = filename;
      }

      var options = {
        width: domNode.clientWidth * 4,
        height: domNode.clientHeight * 4,
        style: {
          transform: 'scale(' + 4 + ')',
          transformOrigin: 'top left',
          padding: 0,
          paddingTop: '30px',
          background: '#292A48'
        },
        imagePlaceholder: ""
      };
      domtoimage.toBlob(document.getElementById('complexmap'), options)
        .then(function (blob) {
          window.saveAs(blob, `${file_name}.png`);
        });
    },
    savePdf: function savePdf() {
      alert('Iniciando la descarga, este proceso tardará un momento.');
      var PDF_Width = 1024;
      var PDF_Height = 900;
      var pdf = new jsPDF('l', 'pt', [PDF_Width, PDF_Height]);
      var domNodes = $('#ringchartmap');
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
            paddingTop: '30px',
            background: '#292A48'
          }
        };

        var HTML_Width = 1024;
        var HTML_Height = 900;
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


