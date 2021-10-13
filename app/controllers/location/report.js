import Ember from 'ember';
import numeral from 'numeral';
const {computed, get:get, observer} = Ember;

export default Ember.Controller.extend({
  i18n: Ember.inject.service(),
  featureToggle: Ember.inject.service(),
  queryParams: ['year', 'startDate', 'endDate'],
  firstYear: computed.alias('featureToggle.first_year'),
  lastYear: computed.alias('featureToggle.last_year'),


  modelData: computed.alias('model'),
  categoriesFilterList: [],
  VCRValue: 1,
  selectedProducts1: [],
  selectedProducts2: [],

  show1: false,
  show2: false,
  show3: false,
  show4: false,
  show5: false,
  show6: false,


  rangeYears: computed('firstYear', 'lastYear', function(){
    var min = this.get("firstYear");
    var max = this.get("lastYear");
    return [...Array(max - min + 1).keys()].map(i => i + min);
  }),

  filteredProductsDataTop5Export: computed('model', 'startDate', 'endDate', function (){
    var products = this.get("model.products_col")
    var filtered = products.filter(item => item.year >= this.get("startDate") && item.year <= this.get("endDate"))
    var sorted = _.slice(_.sortBy(filtered, function(d) { return -d.export_value;}), 0, 5);
    return sorted;
  }),

  filteredProductsDataTop5ExportOrder: computed('model', 'startDate', 'endDate', function (){
    return [[ 3, "desc" ]];
  }),

  productsData: computed('model', 'endDate', function () {

    var startDate = this.get("startDate");
    var endDate = this.get("endDate");
    var data = this.get("model.products_col")

    var data_filtered = data.filter(item => item.year >= startDate && item.year <= endDate && item.export_rca >= 1);
    return data_filtered

  }),

  filteredPartnersDataTop5Export: computed('model', 'startDate', 'endDate', function (){

    var partners = this.get("model.allPartners")
    var filtered = partners.filter(item => item.year >= this.get("startDate") && item.year <= this.get("endDate"))
    var sorted = _.slice(_.sortBy(filtered, function(d) { return -d.export_value;}), 0, 5);
    return sorted;
  }),

  filteredPartnersDataTop5ExportOrder: computed('model', 'startDate', 'endDate', function (){
    return [[ 3, "desc" ]];
  }),

  filteredProductsDataTop5Import: computed('model', 'startDate', 'endDate', function (){
    var products = this.get("model.products_col")
    var filtered = products.filter(item => item.year >= this.get("startDate") && item.year <= this.get("endDate"))
    var sorted = _.slice(_.sortBy(filtered, function(d) { return -d.import_value;}), 0, 5);
    return sorted;
  }),

  filteredProductsDataTop5ImportOrder: computed('model', 'startDate', 'endDate', function (){
    return [[ 3, "desc" ]];
  }),

  filteredPartnersDataTop5Import: computed('model', 'startDate', 'endDate', function (){

    var partners = this.get("model.allPartners")
    var filtered = partners.filter(item => item.year >= this.get("startDate") && item.year <= this.get("endDate"))
    var sorted = _.slice(_.sortBy(filtered, function(d) { return -d.import_value;}), 0, 5);
    return sorted;
  }),

  filteredPartnersDataTop5ImportOrder: computed('model', 'startDate', 'endDate', function (){
    return [[ 4, "desc" ]];
  }),

  filteredIndustriesDataTop5Employment: computed('model', 'startDate', 'endDate', function (){
    var products = this.get("model.industries_col")
    var filtered = products.filter(item => item.year >= this.get("startDate") && item.year <= this.get("endDate"))
    var sorted = _.slice(_.sortBy(filtered, function(d) { return -d.employment;}), 0, 5);
    return sorted;
  }),
  filteredIndustriesDataTop5EmploymentOrder: computed('model', 'startDate', 'endDate', function (){
    return [[ 3, "desc" ]];
  }),

  filteredIndustriesDataTop5Wages: computed('model', 'startDate', 'endDate', function (){
    var products = this.get("model.industries_col")
    var filtered = products.filter(item => item.year >= this.get("startDate") && item.year <= this.get("endDate"))
    var sorted = _.slice(_.sortBy(filtered, function(d) { return -d.wages;}), 0, 5);
    return sorted;
  }),
  filteredIndustriesDataTop5WagesOrder: computed('model', 'startDate', 'endDate', function (){
    return [[ 4, "desc" ]];
  }),

  filteredDataLandUsesTop5: computed('model.[]', 'endDate', function(){
    var endDate = 2014
    var data = this.get("model.landuses");
    console.log(data)
    var dataFiltered = data.filter(item => item.year === endDate);
    var sorted = _.slice(_.sortBy(dataFiltered, function(d) { return -d.area;}), 0, 5);
    return sorted
  }),
  filteredDataLandUsesTop5Order: computed('model', 'endDate', function (){
    return [[ 3, "desc" ]];
  }),

  filteredDataFarmTypesTop5: computed('model.[]', 'endDate', function(){
    var endDate = 2014
    var data = this.get("model.farmtypesData");
    var dataFiltered = data.filter(item => item.year === endDate);
    var sorted = _.slice(_.sortBy(dataFiltered, function(d) { return -d.num_farms;}), 0, 5);
    return sorted
  }),
  filteredDataFarmTypesTop5Order: computed('model', 'endDate', function (){
    return [[ 1, "desc" ]];
  }),

  filteredDataLandSownTop5: computed('model.[]', 'endDate', function(){
    var endDate = parseInt(this.get("endDate"))
    var data = this.get("model.agproductsData");
    var dataFiltered = data.filter(item => item.year === endDate);
    var sorted = _.slice(_.sortBy(dataFiltered, function(d) { return -d.land_sown;}), 0, 5);
    return sorted
  }),
  filteredDataLandSownTop5Order: computed('model', 'endDate', function (){
    return [[ 2, "desc" ]];
  }),

  filteredDataLandHarvestedTop5: computed('model.[]', 'endDate', function(){
    var endDate = parseInt(this.get("endDate"))
    var data = this.get("model.agproductsData");
    var dataFiltered = data.filter(item => item.year === endDate);
    var sorted = _.slice(_.sortBy(dataFiltered, function(d) { return -d.land_harvested;}), 0, 5);
    return sorted
  }),
  filteredDataLandHarvestedTop5Order: computed('model', 'endDate', function (){
    return [[ 3, "desc" ]];
  }),

  filteredDataProductionTonsTop5: computed('model.[]', 'endDate', function(){
    var endDate = parseInt(this.get("endDate"))
    var data = this.get("model.agproductsData");
    var dataFiltered = data.filter(item => item.year === endDate);
    var sorted = _.slice(_.sortBy(dataFiltered, function(d) { return -d.production_tons;}), 0, 5);
    return sorted
  }),
  filteredDataProductionTonsTop5Order: computed('model', 'endDate', function (){
    return [[ 4, "desc" ]];
  }),

  filteredDataYieldRatioTop5: computed('model.[]', 'endDate', function(){
    var endDate = parseInt(this.get("endDate"))
    var data = this.get("model.agproductsData");
    var dataFiltered = data.filter(item => item.year === endDate);
    var sorted = _.slice(_.sortBy(dataFiltered, function(d) { return -d.yield_ratio;}), 0, 5);
    return sorted
  }),
  filteredDataYieldRatioTop5Order: computed('model', 'endDate', function (){
    return [[ 5, "desc" ]];
  }),

  filteredDataNonagsNumFarmsTop5: computed('model.[]', 'endDate', function(){
    var endDate = 2014
    var data = this.get("model.nonagsData");
    var dataFiltered = data.filter(item => item.year === endDate);
    var sorted = _.slice(_.sortBy(dataFiltered, function(d) { return -d.num_farms;}), 0, 5);
    return sorted
  }),
  filteredDataNonagsNumFarmsTop5Order: computed('model', 'endDate', function (){
    return [[ 1, "desc" ]];
  }),

  filteredDataLiveStockNumTop5: computed('model.[]', 'endDate', function(){
    var endDate = 2014
    var data = this.get("model.livestockData");
    var dataFiltered = data.filter(item => item.year === endDate);
    var sorted = _.slice(_.sortBy(dataFiltered, function(d) { return -d.num_livestock;}), 0, 5);
    return sorted
  }),
  filteredDataLiveStockNumTop5Order: computed('model', 'endDate', function (){
    return [[ 2, "desc" ]];
  }),

  filteredDataLiveStockNumFarmsTop5: computed('model.[]', 'endDate', function(){
    var endDate = 2014
    var data = this.get("model.livestockData");
    var dataFiltered = data.filter(item => item.year === endDate);
    var sorted = _.slice(_.sortBy(dataFiltered, function(d) { return -d.num_farms;}), 0, 5);

    return sorted
  }),
  filteredDataLiveStockNumFarmsTop5Order: computed('model', 'endDate', function (){
    return [[ 1, "desc" ]];
  }),

  filteredProductsDataTop5Rca: computed('model', 'endDate', function (){


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




    var products = this.get("model.products_col");
    var filtered = products.filter(item => item.year >= this.get("startDate") && item.year <= this.get("endDate") && valid_ids.includes(String(item.id)))
    var sorted = _.slice(_.sortBy(filtered, function(d) { return -d.export_rca;}), 0, 5);
    return sorted;
  }),
  filteredProductsDataTop5RcaOrder: computed('model', 'startDate', 'endDate', function (){
    return [[ 6, "desc" ]];
  }),


  varDependent: computed('variable', 'source', function() {
    return 'export_value';
  }),
  maxValue: computed('productsData.[]', 'varDependent', function () {
    let varDependent = this.get('varDependent');
    return d3.max(this.get('productsData'), function(d) { return Ember.get(d, varDependent); });
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


  industriesData: computed('model', 'endDate', 'VCRValue', 'rcaFilterService.updated', function () {

    var startDate = this.get("startDate");
    var endDate = this.get("endDate");
    var data = this.get("model.industries_col");

    var data_filtered = data.filter(item => item.year >= startDate && item.year <= endDate);
    return data_filtered;

  }),

  filteredIndustriesDataTop5Rca: computed('model', 'endDate', function (){

    var edgesSourcesIndustriesSpace = this.get('model.metaData.industrySpace.edges').map(item => {
      if(item.source.id === undefined){
        return item.source;
      }
      else{
        return item.source.id;
      }
    });

    var edgesTargetsIndustriesSpace = this.get('model.metaData.industrySpace.edges').map(item => {
      if(item.target.id === undefined){
        return item.target;
      }
      else{
        return item.target.id;
      }
    });

    const valid_ids = [...edgesSourcesIndustriesSpace, ...edgesTargetsIndustriesSpace];


    var industries = this.get("model.industries_col");
    var filtered = industries.filter(item => item.year >= this.get("startDate") && item.year <= this.get("endDate") && valid_ids.includes(String(item.id)))
    var sorted = _.slice(_.sortBy(filtered, function(d) { return -d.rca;}), 0, 5);
    return sorted;
  }),
  filteredIndustriesDataTop5RcaOrder: computed('model', 'startDate', 'endDate', function (){
    return [[ 8, "desc" ]];
  }),






  check1class: "d-none",
  check2class: "",
  check5class: "d-none",
  check6class: "d-none",
  check7class: "d-none",
  check8class: "d-none",
  check11class: "d-none",
  check12class: "d-none",
  check13class: "d-none",
  check14class: "d-none",
  check15class: "d-none",
  check16class: "d-none",
  check17class: "d-none",
  check18class: "d-none",
  check19class: "d-none",

  selectedDivs: function () {
    var lista = ["1", "2", "3", "4", "5", "6"];
    var self = this;
    return lista.filter(item => {
      if( self.get(`show${item}`)){
        return true
      }
      return false
    })
  },

  classFile: "",
  lastUpdated: null,

  observerFileResumen: observer("lastUpdated", function () {
    if(this.selectedDivs().length > 0){
      //this.set("classFile", "")
    }
    else{
      //this.set("classFile", "disabled")
    }
  }),


  actions: {
    setStartYear(){

      var year = parseInt($("#selectYear").val());

      this.set('startDate', year);
      this.set('endDate', year);

    },
    check1(){
      this.set("lastUpdated", new Date());
      if($("#check1").is(':checked')){
        this.set("show1", true);
      }
      else{
        this.set("show1", false);
      }
    },
    check2(){
      this.set("lastUpdated", new Date());
      if($("#check2").is(':checked')){
        this.set("show2", true);
      }
      else{
        this.set("show2", false);
      }
    },
    check3(){
      this.set("lastUpdated", new Date());
      if($("#check3").is(':checked')){
        this.set("show3", true);
      }
      else{
        this.set("show3", false);
      }
    },
    check4(){
      this.set("lastUpdated", new Date());
      if($("#check4").is(':checked')){
        this.set("show4", true);
      }
      else{
        this.set("show4", false);
      }
    },
    check5(){
      this.set("lastUpdated", new Date());
      if($("#check5").is(':checked')){
        this.set("show5", true);
      }
      else{
        this.set("show5", false);
      }
    },
    check6(){
      this.set("lastUpdated", new Date());
      if($("#check6").is(':checked')){
        this.set("show6", true);
      }
      else{
        this.set("show6", false);
      }
    },
    report(){
      var data = this.selectedDivs().map(item => {
        return `.check${item}div`
      })

      var domNodes = $(data.join());
      var PDF_Width = domNodes.get(0).clientWidth * 4;
      var PDF_Height = domNodes.get(0).clientWidth * 4;
      var pdf = new jsPDF('l', 'pt', [PDF_Width, PDF_Height]);

      var totalPDFPages = domNodes.length;
      var countPages = totalPDFPages;
      var d = new Date();
      var file_name = "Reporte general";

      for (var domNode of domNodes) {

        pdf.setFillColor("#292A48");
        pdf.rect(0, 0, PDF_Width, PDF_Height, "F");

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

        var HTML_Width = domNode.clientWidth * 4;
        var HTML_Height = domNode.clientHeight * 4;
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
              pdf.setFillColor("#292A48");
              pdf.rect(0, 0, PDF_Width, PDF_Height, "F");
            }
          })
          .catch(function (error) {
          });
      }
    }
  }
});

