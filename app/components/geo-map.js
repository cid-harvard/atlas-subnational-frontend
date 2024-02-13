import Ember from 'ember';
import numeral from 'numeral';

const { computed, observer } = Ember;

export default Ember.Component.extend({
  i18n: Ember.inject.service(),
  featureToggle: Ember.inject.service(),
  mapService: Ember.inject.service(),
  classNames: ['geo__wrap'],
  accessToken: 'pk.eyJ1IjoiZ3dlemVyZWsiLCJhIjoicXJkMjV6WSJ9.Iw_1c5zREHqNSfdtkjlqbA',
  baseMap: computed('elementId', function() {

    var self = this;

    if(!this.get('elementId')) { return ; }
    let map = new L.mapbox.map(this.get('elementId'), 'gwezerek.22ab4aa8,gwezerek.da867b0d', {
      accessToken: this.accessToken,
      center: this.get('featureToggle.geo_center'),
      zoom: 6,
      maxZoom: 19,
      minZoom: 5,
      zoomControl: false,
    });
    map.addControl(L.control.zoom({ position: 'bottomleft' })); // Customize position of map zoom
    var simpleMapScreenshoter = L.simpleMapScreenshoter({
      hidden: true, // hide screen btn on map
    }).addTo(map);

    document.getElementById("savepng").addEventListener('click', function () {
      simpleMapScreenshoter.takeScreen('image').then(image => {
        var svgElement = $(`.leaflet-container`).get(0);
        $(svgElement).hide();
        var img = document.createElement('img');
        img.id = "geo_img";
        img.src = image;
        var screens = document.getElementById('screens')
        screens.prepend(img);
        var d = new Date();

        var filename = self.get("filename");

        var file_name = d.getDate()  + "-" + (d.getMonth()+1) + "-" + d.getFullYear() + " " + d.getHours() + "_" + d.getMinutes() + "_" + d.getSeconds()

        if(filename){
          file_name = filename;
        }

          html2canvas($(`.visualizationComponent_div`).get(0), {
            allowTaint: true,
            onrendered: function(canvas) {
              var myImage = canvas.toDataURL("image/png");
              saveAs(myImage, `${file_name}.png`);
              screens.removeChild(document.getElementById("geo_img"));
              $(svgElement).show();
            }
          });
      }).catch(e => {
        alert(e.toString());
      });
    });

    document.getElementById("savepdf").addEventListener('click', function () {
      simpleMapScreenshoter.takeScreen('image').then(image => {
        var svgElement = $(`.leaflet-container`).get(0);
        var containerElement = $(`.visualizationComponent_div`).get(0);
        var HTML_Width = containerElement.getBoundingClientRect().width;
        var HTML_Height = containerElement.getBoundingClientRect().height;
        $(svgElement).hide();
        var img = document.createElement('img');
        img.id = "geo_img";
        img.src = image;
        var screens = document.getElementById('screens');
        screens.prepend(img);
        var top_left_margin = 15;
        var PDF_Width = HTML_Width + (top_left_margin * 2);
        var PDF_Height = HTML_Height + (top_left_margin * 2);
        var canvas_image_width = HTML_Width;
        var canvas_image_height = HTML_Height;
        var pageOrientation = HTML_Width < HTML_Height ? "portrait" : "landscape";

        var totalPDFPages = Math.ceil(HTML_Height / PDF_Height) - 1;
        var d = new Date();

        var filename = self.get("filename");

        var file_name = d.getDate()  + "-" + (d.getMonth()+1) + "-" + d.getFullYear() + " " + d.getHours() + "_" + d.getMinutes() + "_" + d.getSeconds()

        if(filename){
          file_name = filename;
        }

        html2canvas(containerElement, {
          allowTaint: true,
          onrendered: function(canvas) {
            var myImage = canvas.toDataURL("image/jpeg", 1.0);
            var pdf = new jsPDF(pageOrientation, 'pt', [PDF_Width, PDF_Height]);
            pdf.addImage(myImage, 'JPG', top_left_margin, top_left_margin, canvas_image_width, canvas_image_height);
            for (var i = 1; i <= totalPDFPages; i++) {
              pdf.addPage(PDF_Width, PDF_Height);
              pdf.addImage(imgData, 'JPG', top_left_margin, -(PDF_Height*i)+(top_left_margin*4),canvas_image_width,canvas_image_height);
            }
            screens.removeChild(document.getElementById("geo_img"))
            $(svgElement).show();
            pdf.save(`${file_name}.pdf`);
            saveAs(pdf, `${file_name}.pdf`);
          }
        });
      }).catch(e => {
        alert(e.toString());
      });
    });
    return map;
  }),
  toolTipsData: computed('toolTips', function (){
    let toolTips = this.get('toolTips');
    let varDependent = this.get('varDependent');


    if(toolTips==null){
      return [varDependent];
    }
    else{
      let tooltips = toolTips.split(',');
      tooltips.unshift(varDependent);
      return tooltips;
    }

  }),
  valueMap: computed('data.[]', 'varDependent', 'toolTips', 'range', function() {
    let valueMap = d3.map();
    let data = this.get('data');

    var range = this.get('range');

    let toolTipsData = this.get('toolTipsData');

    let quantize = this.get("scale");

    let nestByDepartmentId = d3.nest()
      .key(function(d) { return Ember.get(d,'department_id'); })
      .entries(data);
    var self = this;
    _.forEach(nestByDepartmentId, function(location) {
      let params = {};
      toolTipsData.forEach(varDependent => {
        let sum = _.sum(location.values, varDependent) || 0;
        let shadeClass = sum === 0 ? 'q0' : quantize(sum);
        let alterShadeClass = '';
        if (self.get('endDate') || self.get('startDate')){
          const date = self.get('endDate') || self.get('startDate');
          alterShadeClass = `s${date % 3}`;
        }
        if(range !== null){
          if(shadeClass !== range[2]){
            shadeClass = 'q0';
          }
        }
        params[varDependent] = {
          value: _.sum(location.values, varDependent),
          class: `geo__department ${shadeClass} ${alterShadeClass}`,
        };
      });
      valueMap.set(parseInt(location.key), params);
    });

    return valueMap;
  }),
  numberFormat: computed('varDependent', function(key, value) {
    let variable  = this.get('varDependent');
    if('share' === variable){
      return numeral(value).divide(100).format('0.0%');
    } else if('employment' === variable) {
      return numeral(value).format('0.0a');
    } else if('num_vacancies' === variable) {
      return numeral(value).format('0,0');
    } else if('export_value' === variable) {
      return '$ ' + numeral(value).format('0,0');
    } else if('import_value' === variable) {
      return '$ ' + numeral(value).format('0,0');
    } else {
      return numeral(value).format('0.0a');
    }
  }),
  customLayerParams: computed('data.[]', 'varDependent', function() {
    let variable = this.get('varDependent')
    return {
      type: 'layer--',
      style: (feature) => {
        let valueMap = this.get('valueMap');
        return  {
          className: _.get(_.get(valueMap.get(_.get(feature, 'properties.cid_id')), variable), 'class') || 'geo__department q0',
          fillOpacity: 1,
          opacity: 1
        };
      }
    };
  }),
  addLabelsPane: function() {
    let map = this.get('baseMap');
    L.mapbox.accessToken = this.accessToken;
    L.mapbox.tileLayer('gwezerek.5c56c40b').addTo(map);
  },
  didInsertElement: function() {
    Ember.run.scheduleOnce('afterRender', this , function() {
      this.addLabelsPane();
      let varDependentList = this.get('toolTipsData');
      let layer = omnivore
        .topojson(`assets/geodata/${this.get('i18n').country}.topojson`, null, L.geoJson(null, this.get('customLayerParams')))
        .on('layeradd', (e) => {
          let marker = _.get(e, 'layer');
          let location = _.get(e, 'layer.feature.properties');

          let dataTooltip = '';

          varDependentList.forEach(varDependent =>{
            let textKey = this.get('i18n')
              .t(`graph_builder.table.${varDependent}`);
            let textValue = _.get(_.get(this.get('valueMap').get(location.cid_id), varDependent), 'value');
            this.set('numberFormat', textValue);
            dataTooltip += `<span>${textKey} : ${this.get('numberFormat')} </span> </br>`;
          });

          var toolTipText = `<div class="text-center"><span class="text_yellow"> ${location.name} </span> </br>${dataTooltip}</div>`;

          marker.bindPopup(toolTipText, {closeButton: false});
          marker.on('mouseover', function () {
            this.openPopup();
          });
          marker.on('mouseout', function () {
            if(! _.get(this,'_popupContent')) { this.closePopup(); }
          });
        });

      this.set('layer', layer);

      layer.addTo(this.get('baseMap'));
    });
  },
  update: observer('data.[]', 'varDependent', 'i18n.locale', 'range', function() {



    if(!this.get('elementId')) { return ; }
    Ember.run.later(this , function() {
      let map =  this.get('baseMap');
      if(!map) { return; }

      map.removeLayer(this.get('layer'));

      let varDependentList = this.get('toolTipsData');
      let layer = omnivore
        .topojson(`assets/geodata/${this.get('i18n').country}.topojson`, null, L.geoJson(null, this.get('customLayerParams')))
        .on('layeradd', (e) => {
          let marker = _.get(e, 'layer');
          let location = _.get(e, 'layer.feature.properties');

          let dataTooltip = '';

          varDependentList.forEach(varDependent =>{
            let textKey = this.get('i18n')
              .t(`graph_builder.table.${varDependent}`);
            let textValue = _.get(_.get(this.get('valueMap').get(location.cid_id), varDependent), 'value');
            this.set('numberFormat', textValue);
            dataTooltip += `<span>${textKey} : ${this.get('numberFormat')} </span> </br>`;
          });

          var toolTipText = `<div class="text-center"><span class="text_yellow"> ${location.name} </span> </br>${dataTooltip}</div>`;

          marker.bindPopup(toolTipText, {closeButton: false});
          marker.on('mouseover', function () {
            this.openPopup();
          });
          marker.on('mouseout', function () {
            if(! _.get(this,'_popupContent')) { this.closePopup(); }
          });
        });

      this.set('layer', layer);
      layer.addTo(map);
    }, 200);
  }),
  willDestroyElement: function() {
    this.removeObserver('i18n.locale', this, this.update);
    this.removeObserver('data.[]', this, this.update);
    this.removeObserver('varDependent', this, this.profileTabUpdate);
  },
});
