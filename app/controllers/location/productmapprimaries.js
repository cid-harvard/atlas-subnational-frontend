import Ember from 'ember';
const {computed, get, observer, RSVP} = Ember;
import ENV from '../../config/environment';

const {apiURL} = ENV;

export default Ember.Controller.extend({
  featureToggle: Ember.inject.service(),
  buildermodSearchService: Ember.inject.service(),
  locationProductsService: Ember.inject.service(),
  vistkNetworkService: Ember.inject.service(),
  queryParams: ['startDate', 'endDate'],

  categoriesFilterList: [],
  elementId: 'product_space',
  VCRValue: 1,
  entityType: "product",
  source: "products",
  visualization: "products",
  firstYear: computed.alias('featureToggle.first_year'),
  lastYear: computed.alias('featureToggle.last_year'),

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

  selectedProducts: computed.alias("locationProductsService.selected"),

  enableRingChart: "disabled",
  lastSelected: null,

  enableRingChartObserver: observer("vistkNetworkService.updated", function () {

    var selectedProducts = Object.keys(this.get("selectedProducts"));

    if (selectedProducts.length > 0){
      var lastSelected = selectedProducts[selectedProducts.length - 1]
      this.set("lastSelected", lastSelected)
      this.set("enableRingChart", "")
    }
    else {
      this.set("lastSelected", null)
      this.set("enableRingChart", "disabled")
    }

  }),

  searchFilter: observer('buildermodSearchService.search', function() {

    var data = this.get("model.metaData.products");
    var selected = this.get("selectedProducts");
    let search = _.deburr(this.get('buildermodSearchService.search'));
    var self = this;
    var elementId = this.get("elementId");

    if(search === ""){

      d3.selectAll(".tooltip_network").classed("d-none", true);

      for(let id of Object.keys(selected)){
        delete selected[id];
      }

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
        selected[String(item.id)] = this.getPrimariesSecondaries2(parseInt(item.id))
        self.set('vistkNetworkService.updated', new Date());
        d3.selectAll(`.tooltip_${item.id}_${elementId}`).classed('d-none', false);
      });
    }

  }),

  rangeYears: computed('firstYear', 'lastYear', function(){
    var min = this.get("firstYear");
    var max = this.get("lastYear");
    return [...Array(max - min + 1).keys()].map(i => i + min);
  }),


  filteredDataTable: computed("model", 'vistkNetworkService.updated', 'endDate', function () {

    var selectedProducts = this.get("selectedProducts")

    var ids = []

    for(let id of Object.keys(selectedProducts)){
      ids.push(id)

      for(let id2 of Object.keys(selectedProducts[id])){
        ids.push(id2)
      }

    }

    var productsData = this.get("productsData")
    var result = productsData.filter(item => ids.includes(String(item.id)))

    return result
  }),

  productSpace: computed.alias('model.metaData.productSpace'),
  productsData: computed('model', 'endDate', 'VCRValue', 'categoriesFilterList', function () {

    var startDate = this.get("startDate");
    var endDate = this.get("endDate");

    return this.get("model.products_col").filter(item => item.year >= startDate && item.year <= endDate);

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

  dataNull: [],


  occupationsData: computed.alias('model.occupationsData'),
  modelData: computed.alias('model.entity'),
  exportDataLocations: computed('model.data', 'startDate', function (){
    return this.get("model.locationsData").filter(item => item.year === this.get("startDate"));
  }),
});


