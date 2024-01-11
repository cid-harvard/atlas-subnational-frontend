import Ember from 'ember';
import numeral from 'numeral';
const {computed, get:get, observer} = Ember;

export default Ember.Controller.extend({
  i18n: Ember.inject.service(),
  featureToggle: Ember.inject.service(),
  departmentCityFilterService: Ember.inject.service(),
  queryParams: ['year', 'startDate', 'endDate'],
  firstYear: computed.alias('featureToggle.first_year'),
  lastYear: computed.alias('featureToggle.last_year'),


  modelData: computed.alias('model'),
  categoriesFilterList: [],
  VCRValue: 1,

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

  filteredDataLocationsTop5Export: computed('model', 'startDate', function (){
    var products = this.get("model.locationsData")
    var filtered = products.filter(item => item.year == this.get("startDate"))
    var sorted = _.slice(_.sortBy(filtered, function(d) { return -d.export_value;}), 0, 5);
    return sorted;
  }),
  filteredDataLocationsTop5ExportOrder: computed('model', 'startDate', 'endDate', function (){
    return [[ 5, "desc" ]];
  }),

  filteredDataCitiesTop5Export: computed('model.data', 'startDate', function (){
    var products = this.get("model.citiesData")
    var filtered = products.filter(item => item.year == this.get("startDate"))
    var sorted = _.slice(_.sortBy(filtered, function(d) { return -d.export_value;}), 0, 5);
    return sorted;
  }),
  filteredDataCitiesTop5ExportOrder: computed('model', 'startDate', 'endDate', function (){
    return [[ 6, "desc" ]];
  }),

  filteredDataPartnersTop5Export: computed('model.data', 'startDate', function (){
    var products = this.get("model.partnersData")
    var filtered = products.filter(item => item.year == this.get("startDate"))
    var sorted = _.slice(_.sortBy(filtered, function(d) { return -d.export_value;}), 0, 5);

    //console.log(sorted)

    return sorted;
  }),
  filteredDataPartnersTop5ExportOrder: computed('model', 'startDate', 'endDate', function (){
    return [[ 6, "desc" ]];
  }),
  filteredDataLocationsTop5Import: computed('model', 'startDate', function (){
    var products = this.get("model.locationsData")
    var filtered = products.filter(item => item.year == this.get("startDate"))
    var sorted = _.slice(_.sortBy(filtered, function(d) { return -d.import_value;}), 0, 5);
    return sorted;
  }),
  filteredDataLocationsTop5ImportOrder: computed('model', 'startDate', 'endDate', function (){
    return [[ 5, "desc" ]];
  }),

  filteredDataCitiesTop5Import: computed('model.data', 'startDate', function (){
    var products = this.get("model.citiesData")
    var filtered = products.filter(item => item.year == this.get("startDate"))
    var sorted = _.slice(_.sortBy(filtered, function(d) { return -d.import_value;}), 0, 5);
    return sorted;
  }),
  filteredDataCitiesTop5ImportOrder: computed('model', 'startDate', 'endDate', function (){
    return [[ 6, "desc" ]];
  }),

  filteredDataPartnersTop5Import: computed('model.data', 'startDate', function (){
    var products = this.get("model.partnersData")
    var filtered = products.filter(item => item.year == this.get("startDate"))
    var sorted = _.slice(_.sortBy(filtered, function(d) { return -d.import_value;}), 0, 5);
    return sorted;
  }),
  filteredDataPartnersTop5ImportOrder: computed('model', 'startDate', 'endDate', function (){
    return [[ 6, "desc" ]];
  }),

  location: computed("departmentCityFilterService.name", function (){
    return this.get("departmentCityFilterService.name");
  }),

  productsData: computed('model', 'endDate', 'departmentCityFilterService.data', 'VCRValue', 'categoriesFilterList', function () {

    var id = this.get("departmentCityFilterService.id");
    var startDate = this.get("startDate");
    var endDate = this.get("endDate");

    console.log(this.get("model"))

    return this.get("model.products_col").filter(item => item.year >= startDate && item.year <= endDate);

  }),

  getPrimariesSecondaries2: function (id) {

    var edges = this.get('model.metaData.productSpace').edges;
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
  selectedProducts: computed('model.[]', function () {
    return this.get("initialSelectedProducts");
  }),

  filteredDataTable: computed("model", 'vistkNetworkService.updated', 'endDate', function () {

    var selectedProducts = this.get("selectedProducts")
    var productsData = this.get("productsData")
    var result = productsData.filter(item => Object.keys(selectedProducts).includes(String(item.id)))

    return result
  }),

  filteredDataTable2: computed("model", 'vistkNetworkService.updated', 'endDate', function () {

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

  filteredDataTable3: computed("model", 'vistkNetworkService.updated', 'endDate', function () {

    var selectedProducts = this.get("selectedProducts")

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

    return result
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
      alert('Iniciando la descarga, este proceso tardará un momento.');
      var data = this.selectedDivs().map(item => {
        return `.check${item}div`
      })

      var domNodes = $(data.join());

      var clientWidth = 0
      var clientHeight = 0

      for (var domNode of domNodes) {
        if(domNode.clientWidth > clientWidth){
          clientWidth = domNode.clientWidth
        }
        if(domNode.clientHeight > clientHeight){
          clientHeight = domNode.clientHeight
        }
      }

      var PDF_Width = clientWidth * 4;
      var PDF_Height = clientHeight * 4;
      var pdf = new jsPDF('l', 'pt', [PDF_Width, PDF_Height]);
      pdf.setFillColor("#292A48");
      pdf.rect(0, 0, PDF_Width, PDF_Height, "F");

      var totalPDFPages = domNodes.length;
      var countPages = totalPDFPages;
      var d = new Date();
      var file_name = "Reporte general";

      for (var domNode of domNodes) {

        var scale_value = 4

        if(domNode.clientWidth >= domNode.clientHeight){
          scale_value = PDF_Width / domNode.clientWidth
        }
        else{
          scale_value = PDF_Height / domNode.clientHeight
        }

        var options = {
          width: domNode.clientWidth * scale_value,
          height: domNode.clientHeight * scale_value,
          style: {
            transform: 'scale(' + scale_value + ')',
            transformOrigin: 'top left',
            padding: 0,
            paddingTop: '30px',
            background: '#292A48'
          }
        };

        var HTML_Width = domNode.clientWidth * scale_value;
        var HTML_Height = domNode.clientHeight * scale_value;
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

