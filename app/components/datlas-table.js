import Ember from 'ember';
import TableMap from '../mixins/table-map';

const {computed, observer, get:get} = Ember;

export default Ember.Component.extend(TableMap, {
  i18n: Ember.inject.service(),
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

    if(_.include(wageVarsInThousands, key)){
      return numeral(number).divide(1000).format('0,0');
    } else if(_.include(decimalVars, key)){
      return numeral(number).format('0.00a');
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
  updatedData: computed('data.[]', 'tableMap', 'i18n.locale', 'source', 'search', 'startDate', function() {
    var data = this.get("data")

    var columns = this.get('tableMap').map((column) => { return column.key })

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
        return item[`parent_name_${that.get('i18n').display}`];
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
  renderTable: computed('data.[]', 'id', 'updatedData', 'titles', 'tableMap', 'droppedColumns', 'columns', 'i18n.locale', 'source', 'search', 'startDate', function() {

    var data = this.get('data');
    var id_element = this.get('id');
    var updatedData = this.get('updatedData');

    console.log(updatedData)

    

    var columns = this.get('updateTitles');
    let source = this.get('source');
    let self = this;
    var export_data_text = this.get('i18n').t('table.export_data').string;


    if(this.get('i18n').display === 'es'){
      var url = "https://cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json"
    }
    else{
      var url = "https://cdn.datatables.net/plug-ins/1.10.16/i18n/English.json"
    }

    var table = $(id_element).DataTable({
      dom: 'Bfrtip',
      lengthChange: false,
      data: updatedData,
      columns: columns,
      buttons: [
        {
          text: export_data_text,
          attr: {class: 'btn btn-outline-secondary' },
          extend: "excelHtml5",
          filename: function() {
            var d = new Date();
            return d.getDate()  + "-" + (d.getMonth()+1) + "-" + d.getFullYear() + " " + d.getHours() + "_" + d.getMinutes() + "_" + d.getSeconds();
          },
        }
      ],
      language: {
        url: url
      },
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
  update: observer('i18n.display', 'search', 'data.[]', function() {
    console.log("update")

    var id = this.get('id');
    var updatedData = this.get('updatedData');
    var datatable = new $.fn.dataTable.Api( id );

    datatable.clear();
    datatable.rows.add(updatedData);
    datatable.draw();

  })
});
