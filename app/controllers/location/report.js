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


  rangeYears: computed('firstYear', 'lastYear', function(){
    var min = this.get("firstYear");
    var max = this.get("lastYear");
    return [...Array(max - min + 1).keys()].map(i => i + min);
  }),

  check1class: "",
  check2class: "",


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

  selectedDivs: function () {
    var lista = ["1", "2"];
    var self = this;
    return lista.filter(item => {
      if( self.get(`check${item}class`) !== "d-none" ){
        return true
      }
      return false
    })
  },

  classFile: "",
  lastUpdated: null,

  observerFileResumen: observer("lastUpdated", function () {
    console.log(this.selectedDivs())
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
        this.set("check1class", "");
      }
      else{
        this.set("check1class", "d-none");
      }
    },
    check2(){
      this.set("lastUpdated", new Date());
      if($("#check2").is(':checked')){
        this.set("check2class", "");
      }
      else{
        this.set("check2class", "d-none");
      }
    },
    report(){
      var data = this.selectedDivs().map(item => {
        return `#check${item}div`
      })

      console.log(data.join())

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

