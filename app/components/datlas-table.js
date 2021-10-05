import Ember from 'ember';
import TableMap from '../mixins/table-map';
import numeral from 'numeral';

const {computed, observer, get:get} = Ember;

export default Ember.Component.extend(TableMap, {
  i18n: Ember.inject.service(),
  titlesCache: null,
  transitionProduct: 'transitionProduct',
  transitionLocation: 'transitionLocation',
  transitionIndustry: 'transitionIndustry',
  transitionLocationProducts: 'transitionLocationProducts',
  transitionAgproduct: 'transitionAgproduct',
  id: computed('data.[]', 'elementId', 'search', 'startDate', function() {
    return `#${this.get('elementId')} table`;
  }),
  tableMap: computed('data.[]', 'source', 'search', 'startDate', function() {
    let entityType = this.get('entityType');
    let source = this.get('source');

    let map = this.get(`${source}Map`);

    if (entityType === "landUse"){
      map = this.get("landUseLocationsMap");
    } else if (entityType === "agproduct"){
      map = this.get("agproductLocationsMap");
    } else if (entityType === "nonag"){
      map = this.get("nonagLocationsMap");
    } else if (entityType === "livestock"){
      map = this.get("livestockLocationsMap");
    }

    _.forEach(map, (mapping) => {
      if(mapping.key === 'name' || mapping.key == 'parent') { return; }
    });
    return map;
  }),
  droppedColumns: computed('data.[]', 'search', 'startDate', function(){

    // We only need to drop columns in location sources
    var isLocation = _.contains(['cities', 'departments'], this.get('source'));
    if(!isLocation){
      return [];
    }

    return this.get('tableMap').filter((column) => {

      // Don't ever drop the "name" column
      if(column.key == "name" || column.key == "parent_name"){
        return false;
      }

      var columnData = _.pluck(this.get('data'), column.key);
      var columnEmpty = _.every(columnData, (x) => x === null || x === undefined);
      return columnEmpty;
    }).map((c) => c.key);
  }),
  columns: computed('data.[]', 'droppedColumns', 'tableMap', 'search', 'startDate', function() {

    var droppedColumns = this.get('droppedColumns');
    if (!_.isEmpty(droppedColumns)){
        Ember.Logger.log(`Dropping columns: ${droppedColumns}`);
    }

    return this.get('tableMap')
    .filter((c) => !_.contains(droppedColumns, c.key))
    .map((column) => {
      return this.generateColumnDefinition(column);
    });
  }),
  titles: computed('data.[]', 'tableMap', 'i18n.locale', 'search', 'startDate', function() {
    return this.get('tableMap').map(column => (
      {
        title: (column.hasOwnProperty("copy")) ? this.get('i18n').t(`graph_builder.table.${column.copy}`).string : this.get('i18n').t(`graph_builder.table.${column.key}`).string,
        data: column.key,
      }
    ));
  }),
  updateTitles: computed('data.[]', 'titles', 'updatedData', 'search', 'startDate', function() {
    var titles = this.get('titles');
    var updatedData = this.get('updatedData');

    var update_titles = []

    for(const [key, value] of Object.entries(titles)){

      var item_key = value.data

      if(updatedData.filter((item) => item[item_key] !== null).length > 0){
        update_titles.push(value)
      }

    }

    return update_titles;

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

    let result = "";
    if(_.include(wageVarsInThousands, key)){
      return numeral(number).divide(1000).format('0,0');
    } else if(_.include(decimalVars, key)){
      result = numeral(number).format('0.00a');
    } else if(key === 'employment'){
      result = numeral(Math.ceil(number)).format('0,0');
    } else if(key === 'num_establishments' || key === 'export_num_plants'){
      if(parseInt(number) < 6) {
        result = i18n.t('graph_builder.table.less_than_5');
      }
      result = Number(numeral(number).format('0,0'));
    } else if(_.include(percentVars, key)){
      result = numeral(number).format('0.00%');
    } else if(_.include(largeNumbers, key)) {
      result = numeral(number).format('0,0');
    } else if(_.include(moneyVars, key)) {
      result = numeral(number).format('$0.00a');
    } else {
      result = number;
    }
    return result;
  },
  updatedData: computed('data.[]', 'tableMap', 'i18n.locale', 'source', 'search', 'startDate', function() {
    var data = this.get("data");
    var tableMap = this.get('tableMap')

    if(data === undefined){
      data = [];
    }

    var columns = tableMap.map((column) => { return column.key })

    var that = this;

    function updateValue(key, value, item) {

      if(_.isNull(value)){
        return 'N/A';
      }
      else if(_.isNumber(value)){
        return that.formatNumber(value, key, that.get('i18n'));
      }
      else if(key === 'name'){
        return item[`name_short_${that.get('i18n').display}`];
      }
      else if(key === 'parent'){
        let color = item['color'];
        let testSpan = Ember.String.htmlSafe('<i class="ember-table-color-marker" style=background-color:' + color + '></i>');
        return testSpan + item[`parent_name_${that.get('i18n').display}`];
      }
      else if(key === 'parent_name'){
        if(item.hasOwnProperty(`parent_name_${that.get('i18n').display}`)){
          return item[`parent_name_${that.get('i18n').display}`];
        }
        return ""
      }
      else if(!item.hasOwnProperty(key)){
        return null;
      }
      else {
        return value;
      }
    }

    return data.map((item) => {

      var updatedItem = {}
      for(const key of columns) {
        var value_item = item[key]

        updatedItem[key] = updateValue(key, value_item, item)

      }
      return updatedItem
    })

  }),
  getLanguage: computed('data.[]', 'tableMap', 'i18n.locale', 'source', 'search', 'startDate', function(){
    if(this.get('i18n').display === 'es'){
      return {
          "processing": "Procesando...",
          "lengthMenu": "Mostrar _MENU_ registros",
          "zeroRecords": "No se encontraron resultados",
          "emptyTable": "Ningún dato disponible en esta tabla",
          "infoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
          "infoFiltered": "(filtrado de un total de _MAX_ registros)",
          "search": "Buscar:",
          "infoThousands": ",",
          "loadingRecords": "Cargando...",
          "paginate": {
              "first": "Primero",
              "last": "Último",
              "next": "Siguiente",
              "previous": "Anterior"
          },
          "aria": {
              "sortAscending": ": Activar para ordenar la columna de manera ascendente",
              "sortDescending": ": Activar para ordenar la columna de manera descendente"
          },
          "buttons": {
              "copy": "Copiar",
              "colvis": "Visibilidad",
              "collection": "Colección",
              "colvisRestore": "Restaurar visibilidad",
              "copyKeys": "Presione ctrl o u2318 + C para copiar los datos de la tabla al portapapeles del sistema. <br \/> <br \/> Para cancelar, haga clic en este mensaje o presione escape.",
              "copySuccess": {
                  "1": "Copiada 1 fila al portapapeles",
                  "_": "Copiadas %d fila al portapapeles"
              },
              "copyTitle": "Copiar al portapapeles",
              "csv": "CSV",
              "excel": "Excel",
              "pageLength": {
                  "-1": "Mostrar todas las filas",
                  "_": "Mostrar %d filas"
              },
              "pdf": "PDF",
              "print": "Imprimir"
          },
          "autoFill": {
              "cancel": "Cancelar",
              "fill": "Rellene todas las celdas con <i>%d<\/i>",
              "fillHorizontal": "Rellenar celdas horizontalmente",
              "fillVertical": "Rellenar celdas verticalmentemente"
          },
          "decimal": ",",
          "searchBuilder": {
              "add": "Añadir condición",
              "button": {
                  "0": "Constructor de búsqueda",
                  "_": "Constructor de búsqueda (%d)"
              },
              "clearAll": "Borrar todo",
              "condition": "Condición",
              "conditions": {
                  "date": {
                      "after": "Despues",
                      "before": "Antes",
                      "between": "Entre",
                      "empty": "Vacío",
                      "equals": "Igual a",
                      "notBetween": "No entre",
                      "notEmpty": "No Vacio",
                      "not": "Diferente de"
                  },
                  "number": {
                      "between": "Entre",
                      "empty": "Vacio",
                      "equals": "Igual a",
                      "gt": "Mayor a",
                      "gte": "Mayor o igual a",
                      "lt": "Menor que",
                      "lte": "Menor o igual que",
                      "notBetween": "No entre",
                      "notEmpty": "No vacío",
                      "not": "Diferente de"
                  },
                  "string": {
                      "contains": "Contiene",
                      "empty": "Vacío",
                      "endsWith": "Termina en",
                      "equals": "Igual a",
                      "notEmpty": "No Vacio",
                      "startsWith": "Empieza con",
                      "not": "Diferente de"
                  },
                  "array": {
                      "not": "Diferente de",
                      "equals": "Igual",
                      "empty": "Vacío",
                      "contains": "Contiene",
                      "notEmpty": "No Vacío",
                      "without": "Sin"
                  }
              },
              "data": "Data",
              "deleteTitle": "Eliminar regla de filtrado",
              "leftTitle": "Criterios anulados",
              "logicAnd": "Y",
              "logicOr": "O",
              "rightTitle": "Criterios de sangría",
              "title": {
                  "0": "Constructor de búsqueda",
                  "_": "Constructor de búsqueda (%d)"
              },
              "value": "Valor"
          },
          "searchPanes": {
              "clearMessage": "Borrar todo",
              "collapse": {
                  "0": "Paneles de búsqueda",
                  "_": "Paneles de búsqueda (%d)"
              },
              "count": "{total}",
              "countFiltered": "{shown} ({total})",
              "emptyPanes": "Sin paneles de búsqueda",
              "loadMessage": "Cargando paneles de búsqueda",
              "title": "Filtros Activos - %d"
          },
          "select": {
              "cells": {
                  "1": "1 celda seleccionada",
                  "_": "$d celdas seleccionadas"
              },
              "columns": {
                  "1": "1 columna seleccionada",
                  "_": "%d columnas seleccionadas"
              },
              "rows": {
                  "1": "1 fila seleccionada",
                  "_": "%d filas seleccionadas"
              }
          },
          "thousands": ".",
          "datetime": {
              "previous": "Anterior",
              "next": "Proximo",
              "hours": "Horas",
              "minutes": "Minutos",
              "seconds": "Segundos",
              "unknown": "-",
              "amPm": [
                  "AM",
                  "PM"
              ],
              "months": {
                  "0": "Enero",
                  "1": "Febrero",
                  "10": "Noviembre",
                  "11": "Diciembre",
                  "2": "Marzo",
                  "3": "Abril",
                  "4": "Mayo",
                  "5": "Junio",
                  "6": "Julio",
                  "7": "Agosto",
                  "8": "Septiembre",
                  "9": "Octubre"
              },
              "weekdays": [
                  "Dom",
                  "Lun",
                  "Mar",
                  "Mie",
                  "Jue",
                  "Vie",
                  "Sab"
              ]
          },
          "editor": {
              "close": "Cerrar",
              "create": {
                  "button": "Nuevo",
                  "title": "Crear Nuevo Registro",
                  "submit": "Crear"
              },
              "edit": {
                  "button": "Editar",
                  "title": "Editar Registro",
                  "submit": "Actualizar"
              },
              "remove": {
                  "button": "Eliminar",
                  "title": "Eliminar Registro",
                  "submit": "Eliminar",
                  "confirm": {
                      "_": "¿Está seguro que desea eliminar %d filas?",
                      "1": "¿Está seguro que desea eliminar 1 fila?"
                  }
              },
              "error": {
                  "system": "Ha ocurrido un error en el sistema (<a target=\"\\\" rel=\"\\ nofollow\" href=\"\\\">Más información&lt;\\\/a&gt;).<\/a>"
              },
              "multi": {
                  "title": "Múltiples Valores",
                  "info": "Los elementos seleccionados contienen diferentes valores para este registro. Para editar y establecer todos los elementos de este registro con el mismo valor, hacer click o tap aquí, de lo contrario conservarán sus valores individuales.",
                  "restore": "Deshacer Cambios",
                  "noMulti": "Este registro puede ser editado individualmente, pero no como parte de un grupo."
              }
          },
          "info": "Mostrando _START_ a _END_ de _TOTAL_ registros"
      }
    }
    else{
      return {}
    }
  }),
  renderTable: computed('data.[]', 'id', 'updatedData', 'titles', 'tableMap', 'droppedColumns', 'columns', 'i18n.locale', 'source', 'search', 'startDate', function() {

    var data = this.get('data');
    var title_data = this.get('title_data');
    var source_data = this.get("source_data");
    var id_element = this.get('id');
    var updatedData = this.get('updatedData');

    var columns = this.get('updateTitles');
    let source = this.get('source');
    let self = this;
    var export_data_text = this.get('i18n').t('table.export_data').string;
    var language = this.get("getLanguage");

    if(columns.length === 0){
      columns = [{"title": "", "data": ""}];
    }else{
      this.set('titlesCache', columns);
    }


    var order = [[ 0, "desc" ]];

    if(this.get("order") !== undefined){
      order = this.get("order")
    }

    if(updatedData.length === 0){
      order = [[ 0, "desc" ]];
    }

    const decimalRegex = /^[-]?\d*([.,]\d{1,2})$/;
    const numericRegex = /(\..*){1,}/;

    var table = $(id_element).DataTable({
      dom: 'Bfrtip',
      lengthChange: false,
      data: updatedData,
      columns: columns,
      retrieve: true,
      order: order,
      buttons: [
        {
          text: export_data_text,
          attr: {class: 'btn btn-outline-secondary' },
          extend: "excelHtml5",
          exportOptions: {
            format: {
              body: function ( data, row, column, node ) {

                data = String(data)

                let result = "";
                if (decimalRegex.test(data)){
                  result = data.replace(/[,]/g, '.');
                }else if (numericRegex.test(data)) {
                  result = data.replace(/[.]/g, '');
                } else {
                  result = data;
                }
                result = `${result}`.replace(/<[^>]*>/g, "");
                return result;
              }
            }
          },
          filename: function() {
            var d = new Date();
            if(title_data){
              return title_data;
            }
            return d.getDate()  + "-" + (d.getMonth()+1) + "-" + d.getFullYear() + " " + d.getHours() + "_" + d.getMinutes() + "_" + d.getSeconds();
          },
          messageBottom: source_data,
          title: title_data
        }
      ],
      language: language
    });

    $(`${id_element} tbody`).on( 'click', 'tr', function () {

      if(!$(event.target).attr('class')){

        var id = data[table.row( this ).index()].id

        if(source === 'location') {
          self.sendAction('transitionLocation', id);
        } else if (source === 'product') {
          self.sendAction('transitionProduct', id);
        } else if (source === 'industries') {
          self.sendAction('transitionIndustry', id);
        } else if (source === 'location-product') {
          self.sendAction('transitionLocationProducts', id);
        } else if (source === 'agproduct') {
          self.sendAction('transitionAgproduct', id);
        }

      }

    });
  }),
  didInsertElement: function() {
    Ember.run.scheduleOnce('afterRender', this, function() {
      this.get('renderTable');
    });
  },
  update: observer('i18n.display', 'data.[]', function() {


    var id = this.get('id');
    var datatable = new $.fn.dataTable.Api( id );

    datatable.destroy();
    $(id).empty();

    //$(id).remove();
    //$(`#${this.get('elementId')} table`).remove();
    //$(`#${this.get('elementId')}`).append('<table class="table table-striped table-hover dt-responsive nowrap text-white datlas" style="width:100%"></table>');

    this.get('renderTable');

  }),
  willDestroyElement: function() {
    this.removeObserver('i18n.locale', this, this.update);
    this.removeObserver('search', this, this.update);
    this.removeObserver('data.[]', this, this.update);
  },
});
