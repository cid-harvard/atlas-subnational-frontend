import Ember from 'ember';
import numeral from 'numeral';
import ColumnDefinition from 'ember-table/models/column-definition';
import EmberTableComponent from 'ember-table/components/ember-table';
import HeaderCell from 'ember-table/views/header-cell';
import TableCell from 'ember-table/views/table-cell';
import TableMap from '../mixins/table-map';

const {
  computed,
  observer
} = Ember;

var SortableTableHeaderCell = HeaderCell.extend({
  templateName: 'sortable-header-cell',

   // `event` here is a jQuery event
  onColumnResize: function(event, ui) {
    var newWidth = Math.round(ui.size.width);
    if (this.get('tableComponent.columnMode') === 'standard') {
      this.get('column').resize(newWidth);
      this.set('tableComponent.columnsFillTable', false);
    } else {
      var diff = this.get('width') - newWidth;
      this.get('column').resize(newWidth);
      this.get('nextResizableColumn').resize(this.get('nextResizableColumn.width') + diff);
    }

    this.elementSizeDidChange();

    // Trigger the table resize (and redraw of layout) when resizing is done
    if (event.type === 'resizestop') {
      this.get('tableComponent').elementSizeDidChange();
    }

    this.get('tableComponent').sendAction('onColumnResized', this.get('column'), newWidth);
  }

});

var SortableTableCell = TableCell.extend({
  i18n: Ember.inject.service(),
  templateName: 'sortable-cell',
  rowContent: computed.alias('row.content'),
  isModel: computed.alias('row.content.model'),
  model: computed.alias('row.content.model'),
  id: computed.alias('row.content.id'),
  profileRoute: computed('model', 'controller.source', function() {
    // Link to the profile of the model type (e.g. agproduct profile if viewing
    // agproducts) unless we're looking at a location variable (e.g. where is
    // this agproduct harvested), in which case link to locations.
    var sourceIsLocation = _.contains(['cities', 'departments', 'municipalities'], this.get('controller.source'));
    if (sourceIsLocation){
      return 'location.show';
    } else {
      return `${this.get('model')}.show`;
    }
  })
});

var SortableColumnMixin = Ember.Object.create({
  i18n: Ember.inject.service(),
  supportSort: true,
  sorted: 0,
  isAscending: false,
  isDescending: false,
  headerCellViewClass: SortableTableHeaderCell,
  tableCellViewClass: SortableTableCell
});

export default EmberTableComponent.extend(TableMap, {
  i18n: Ember.inject.service(),
  hasFooter: false,
  rowHeight: 50,
  minHeaderHeight: 50,
  height: 420,
  attributeBindings: ['height'],
  selectionMode: 'mutiple',
  tableMap: computed('source', function() {
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
  // Drop fully empty columns in graph builders where the data is locations.
  // Workaround for COL-958
  droppedColumns: computed('data.[]', function(){

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
  columns: computed('droppedColumns', 'tableMap', function() {

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
  content: computed('data.[]', function() {
    return this.get('data');
  }),
  refreshTable: observer('i18n.locale','source','search', function() {
    Ember.run.once(this, function(){
      this.set('content', []);
      this.set('content', this.get('data'));
    });
  }),
  generateColumnDefinition: function(column) {
    let colSettings = _.find(this.columnSettingsMap, { 'key': column.key });
    return ColumnDefinition.create(SortableColumnMixin, {
      canAutoResize: false,
      textAlign: colSettings.type === 'int' ? 'text-align-right' : 'text-align-left',
      headerCellName: column.copy ? `graph_builder.table.${column.copy}`: `graph_builder.table.${column.key}`,
      getCellContent: this.generateCellContent(column),
      isResizable: true,
      savedWidth: colSettings.savedWidth ? colSettings.savedWidth : 160,
      key: column.key
    });
  },
  generateCellContent: function(column) {
    return (row) => {
      if(_.isNull(row.get(column.key))){
        return 'N/A';
      }
      if(_.isNumber(row.get(column.key))){
        let number = row.get(column.key);
        return this.formatNumber(number, column.key, this.get('i18n'));
      } else if(column.key === 'name'){
        return row.get(`name_short_${this.get('i18n').display}`);
      } else if(column.key === 'parent'){
        let color = row.get('color');
        let testSpan = Ember.String.htmlSafe('<i class="ember-table-color-marker" style=background-color:' + color + '></i>');
        return testSpan + row.get(`parent_name_${this.get('i18n').display}`);
      } else if(column.key === 'parent_name'){
        return row.get(`parent_name_${this.get('i18n').display}`);
      } else if(column.key === 'code'){
        return row.get('code');
      } else {
        return row.get(column.key);
      }
    };
  },
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
  didInsertElement: function() {
    this._super();
    //FIXME: FLEXBOX!
    this.set('_height', this.get('height'));
  },
  clearSorting: function() {
    let cols = this.get('columns');
    cols.forEach(function(col) {
      col.set('isAscending', false);
      col.set('isDescending', false);
    });
  },
  actions: {
    sortByColumn: function(content){
      let key = content.key;
      this.set('content', []);
      let data;
      if(key === 'name') {
        key = `name_short_${this.get('i18n').display}`;
      } else if (key === 'parent') {
        key = `parent_name_${this.get('i18n').display}`;
      }
      var sortFunction = function(d) {
        if(_.isString(d[key])) { return d[key].toLowerCase(); }
        return d[key];
      };

      //  0 unsorted
      //  1 sorted desc
      // -1 sorted asc

      this.clearSorting();

      if(content.get('sorted') === -1) {
        data = _.sortBy(this.get('data'), sortFunction).reverse();
        content.set('isAscending', false);
        content.set('isDescending', true);
        content.set('sorted', 1);
      } else {
        data = _.sortBy(this.get('data'), sortFunction);
        content.set('isAscending', true);
        content.set('isDescending', false);
        content.set('sorted', -1);
      }

      this.set('content', data);
    }
 }
});

