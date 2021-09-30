import Ember from 'ember';
import numeral from 'numeral';
const {computed, get:get, observer} = Ember;

export default Ember.Controller.extend({
  i18n: Ember.inject.service(),
  vistkScatterplotService: Ember.inject.service(),
  buildermodSearchService: Ember.inject.service(),
  featureToggle: Ember.inject.service(),
  queryParams: ['startDate', 'endDate'],

  search: null,
  rcaFilter: 'less',
  filterCategory: true,
  categoriesFilterList: [],

  firstYear: computed.alias('featureToggle.first_year'),
  lastYear: computed.alias('featureToggle.last_year'),
  censusYear: computed.alias('featureToggle.census_year'),

  source: "products",
  metadata: computed.alias('model.metaData'),
  entityType: computed.alias('model.entity_type'),
  entityId: computed.alias('model.entity.id'),
  variable: computed.alias('model.variable'),

  rangeYears: computed('firstYear', 'lastYear', function(){

    this.set('startDate', this.get("lastYear"))
    this.set('endDate', this.get("lastYear"))

    var min = this.get("firstYear")
    var max = this.get("lastYear")
    return [...Array(max - min + 1).keys()].map(i => i + min);
  }),

  productsDataValues: computed('model', function(){

    var locations = Object.entries(this.get('model.metaData.products'))

    return locations.filter(item => item[1].level === "4digit").map((item) => {

      var name = get(item[1], `name_short_${this.get('i18n').display}`)

      return {id:item[1].id, text: `${name} (${item[1].code})`}
    })
  }),

  filterData: computed('source', function(){
    return this.get('productsDataValues');
  }),

  placeHolderText: computed('i18n.locale', 'source', function(){
    return this.get('i18n').t(`visualization.source.${this.get('source')}`).string
  }),

  filterToSelectedYears: function(data, start, end) {
    let  timeRange = d3.range(parseInt(start), parseInt(end) + 1); // Makes the range inclusive
    return _.filter(data, function(d) {
      return _.contains(timeRange, get(d, 'year'));
    });
  },

  immutableData: computed('model.products_col.[]','endDate', 'startDate' , function() {
    return this.filterToSelectedYears(this.get('model.products_col'), this.get('startDate'), this.get('endDate'));
  }),

  filteredData: computed('model.products_col.[]','endDate', 'startDate' , 'categoriesFilterList',function() {

    let rca = this.get('rca');
    let rcaFilter = this.get('rcaFilter');
    let data = this.get('immutableData');
    var newData = data.map(a => Object.assign({}, a));

    let categoriesFilter = this.get('categoriesFilterList');

    return newData.map(item => {
      if(categoriesFilter.length > 0){
        if(categoriesFilter.includes(item.parent_name_es)){
          return item
        }
        else{
          item.color = "#ccc"
          return item
        }
      }
      else{
        return item
      }
    });

  }),

  searchFilter: observer('buildermodSearchService.search', function() {

    console.log("searchFilter")

    var data = this.get("model.metaData.products");
    var selected = this.get("vistkScatterplotService.selected");
    let search = _.deburr(this.get('buildermodSearchService.search'));
    var self = this;
    var elementId = this.get("elementId");
    var initialSelectedProducts = this.get("initialSelectedProducts")

    if(search === ""){

      //this.set("vistkScatterplotService.selected", []);
      //this.set("vistkScatterplotService.updated", new Date());
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
        if(!selected.includes(item.id)){
          selected.push(item.id);
          self.set("vistkScatterplotService.updated", new Date());
          d3.selectAll(`.tooltip_${item.id}`).classed('d-none', false);
        }
        //selected[String(item.id)] = this.getPrimariesSecondaries2(parseInt(item.id))
        //self.set('vistkNetworkService.updated', new Date());
        //d3.selectAll(`.tooltip_${item.id}_${elementId}`).classed('d-none', false);
      });
    }

  }),

   filteredDataTable: computed('immutableData' , 'vistkScatterplotService.updated',function() {

    let data = this.get('immutableData');
    var updated = this.get("vistkScatterplotService.updated");
    var selected = this.get("vistkScatterplotService.selected");

    console.log(selected)

    var result = data.filter(item => {
      if(selected.includes(item.id)){
        return true;
      }
    });

    return result

  }),

  modelData: computed('model.data.[]', function() {
    console.log(this.get("model"))
    return this.get('model.products_col');
  }),

  varDependent: computed('variable', 'source', function() {
    return 'export_value';
  }),

  maxValue: computed('filteredData.[]', 'varDependent', function () {
    let varDependent = this.get('varDependent');
    return d3.max(this.get('filteredData'), function(d) { return Ember.get(d, varDependent); });
  }),

  scale: computed('maxValue', 'varDependent', function(){
    let varDependent = this.get('varDependent');
    if(_.isUndefined(varDependent)){
      return d3.scale.quantize()
        .range(d3.range(5).map(function(i) { return 'q' + i + '-5'; }));
    }
    return d3.scale.quantize()
      .domain([0, this.get('maxValue')])
      .range(d3.range(5).map(function(i) { return 'q' + i + '-5'; }));
  }),

  dateExtent: computed('model.products_col.[]', function() {
    if(this.get('model.products_col').length) {
      return d3.extent(this.get('model.products_col'), function(d) { return d.year; });
    }
    return  [this.get('firstYear'), this.get('lastYear')];
  }),

  isFiltered: computed('search', function() {
    return Boolean(this.get('search'));
  }),

  graph: computed('model.metaData', 'source', function() {
    let source = this.get('source');
    if(source === 'industries') {
      return this.get('model.metaData.industrySpace');
    } else if (source === 'products') {
      return this.get('model.metaData.productSpace');
    }
  }),




});

