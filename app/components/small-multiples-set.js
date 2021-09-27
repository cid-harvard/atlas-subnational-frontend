import Ember from 'ember';
const {computed} = Ember;

export default Ember.Component.extend({
  i18n: Ember.inject.service(),
  classNames: ['buildermod__viz'],
  result: computed('data.[]', function(){
    return _.first(this.get('data'));
  }),
  showParent: computed('dataType', function() {
    let dataType = this.get('dataType');
    if(dataType === 'industries') { return true; }
    if(dataType === 'products') { return true; }
    if(dataType === 'partners') { return true; }
    return false;
  }),
  showParentHeader: computed('dataType', function() {
    return true;
  }),
  showChildHeader: computed('dataType', function() {
    let dataType = this.get('dataType');
    if(dataType === 'agproducts') { return false; }
    return true;
  }),
  showTotal: computed('varDependent', function() {
    let varDependent = this.get('varDependent');
    if(varDependent === 'yield_ratio') { return false; }
    return true;
  }),
  parentBreadcrumb: computed('result.level', 'i18n.locale', function() {
    if(this.get('result.level')) {
      let level = this.get('i18n').t(`search.level.parent.${this.get('result.level')}`);
      return `${level}`;
    }
  }),
  childBreadcrumb: computed('result.level', 'i18n.locale', function() {
    if(this.get('result.level')) {
      let level = this.get('i18n').t(`search.level.${this.get('result.level')}`);
      return `${level}`;
    }
  }),
  setTitle: computed('entityType','variable','i18n.locale', function() {
    let i18nString = `graph_builder.builder_mod_header.${this.get('entityType')}.${this.get('dataType')}`;
    return this.get('i18n').t(`${i18nString}.${this.get('variable')}`);
  }),
  dataSet: computed('parentSet.[]', 'data.[]', function() {
    let data = this.get('data');
    let parents = this.get('parentSet');
    return [parents, data];
  }),
  totalSet: computed('immutableData.[]', function() {
    let data = this.get('immutableData');
    return  _.chain(data)
      .groupBy(function(d) {return d.year;})
      .values()
      .reduce((memo, d) => {
        let firstDatum = _.first(d);

        let value = {
          name_short_es: 'Totales',
          name_short_en: 'Total',
          code: '',
          year: firstDatum.year
        };

        let sum = _.sum(d, this.get('varDependent'));
        value[this.get('varDependent')] = sum;
        memo.push(value);
        return memo;
      }, [])
      .value();
  }),
  parentSet: computed('data.[]', function() {
    let data = this.get('data');

    return _.chain(data)
      .groupBy(function(d) {return d.group +'/'+ d.year;})
      .values()
      .reduce((memo, d) => {
        let firstDatum = _.first(d);

        let value = {
          name_short_es: firstDatum.parent_name_es,
          name_short_en: firstDatum.parent_name_en,
          code: firstDatum.group,
          year: firstDatum.year,
          color: firstDatum.color
        };

        let sum = _.sum(d, this.get('varDependent'));
        value[this.get('varDependent')] = sum;
        memo.push(value);
        return memo;
      }, [])
      .sortBy('year')
      .value();
  }),
  actions: {
    savePdf: function savePdf() {
      alert('La descarga tardara un momento. Por favor espere...');
      var title = this.get("title");
      var PDF_Width = 800;
      var PDF_Height = 600;
      var pdf = new jsPDF('l', 'pt', [PDF_Width, PDF_Height]);
      var domNodes = $('.multiple');
      var totalPDFPages = domNodes.length;
      var countPages = totalPDFPages;
      var d = new Date();
      var file_name = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear() + " " + d.getHours() + "_" + d.getMinutes() + "_" + d.getSeconds();

      if(title){
        file_name = title;
      }

      for (var domNode of domNodes) {
        var options = {
          width: domNode.clientWidth * 4,
          height: domNode.clientHeight * 4,
          style: {
            transform: 'scale(' + 4 + ')',
            transformOrigin: 'top left'
          }
        };

        var HTML_Width = 800;
        var HTML_Height = 600;
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
