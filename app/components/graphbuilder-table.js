import Ember from 'ember';
import numeral from 'numeral';
import ColumnDefinition from 'ember-table/models/column-definition';
import EmberTableComponent from 'ember-table/components/ember-table';
import HeaderCell from 'ember-table/views/header-cell';
import TableCell from 'ember-table/views/table-cell';

const { computed, observer } = Ember;

var SortableTableHeaderCell = HeaderCell.extend({
  templateName: 'sortable-header-cell'
});

var SortableTableCell = TableCell.extend({
  templateName: 'sortable-cell'
});

var SortableColumnMixin = Ember.Object.create({
  supportSort: true,
  sorted: false,
  headerCellViewClass: SortableTableHeaderCell,
  tableCellViewClass: SortableTableCell
});

export default EmberTableComponent.extend({
  i18n: Ember.inject.service(),
  hasFooter: false,
  rowHeight: 50,
  minHeaderHeight: 50,
  height: 300,
  attributeBindings: ['height'],
  selectionMode: 'none',
  industryClassesMap: [
    { key: 'name', expand: true, savedWidth: 300 },
    { key: 'avg_wage', expand: true, savedWidth: 200 },
    { key: 'wages', expand: true, savedWidth: 200 },
    { key: 'employment', expand: true, savedWidth: 200 },
    { key: 'employment_growth', expand: true, savedWidth: 300 },
    { key: 'num_establishments', expand: true, savedWidth: 200 },
  ],
  productsMap: [
    { key: 'name', expand: true, savedWidth: 300 },
    { key: 'export_value', type: 'int', expand: false},
    { key: 'export_rca', type: 'int', expand: false},
    { key: 'year' , expand: false, type: 'int'},
    { key: 'complexity' , expand: false, type: 'int'},
    { key: 'distance' , expand: true, type: 'int'}
   ],
  locationsMap: [
    { key: 'name', expand: true, savedWidth: 300 },
    { key: 'export_value', type: 'int', expand: false},
    { key: 'export_rca', type: 'int', expand: false},
    { key: 'year' , expand: false, type: 'int'},
   ],
  industriesMap: [
    { key: 'name', expand: true, savedWidth: 300 },
    { key: 'wages', type: 'int', expand: false},
    { key: 'employment', type: 'int', expand: false},
    { key: 'rca', type: 'int', expand: false},
    { key: 'year' , expand: false, type: 'int'},
    { key: 'complexity' , expand: false, type: 'int'}
   ],
  departmentsMap: [
    { key: 'name', expand: true, savedWidth: 300 },
    { key: 'wages', type: 'int', expand: false},
    { key: 'employment', type: 'int', expand: false},
    { key: 'rca', type: 'int', expand: false},
    { key: 'year' , expand: false, type: 'int'},
    { key: 'complexity' , expand: false, type: 'int'}
   ],
  tableMap: computed('source', function() {
    let source = this.get('source');
    return this.get(`${source}Map`);
  }),
  columns: computed('tableMap', function() {
    return this.get('tableMap').map((column) => {
      return this.generateColumnDefinition(column);
    });
  }),
  content: computed('data.[]', function() {
    return this.get('data');
  }),
  refreshTable: observer('i18n.locale', function() {
    this.set('content', []);
    this.set('content', this.get('data'));
  }),
  generateColumnDefinition: function(column) {
    return ColumnDefinition.create(SortableColumnMixin, {
      canAutoResize: column.expand,
      textAlign: 'text-align-left',
      savedWidth: column.savedWidth ? column.savedWidth : 160,
      headerCellName: `graph_builder.table.${column.key}`,
      getCellContent: this.generateCellContent(column),
      key: column.key
    });
  },
  generateCellContent: function(column) {
    return (row) => {
      if(_.isNumber(row.get(column.key))){
        let number = row.get(column.key);
        return this.formatNumber(number, column.key);
      } else if(column.key === 'name'){
        return row.get(`name_short_${this.get('i18n').locale}`) || row.get('code');
      } else {
        return 'N/A';
      }
    };
  },
  formatNumber: function(number, key) {
    if(key === 'wages' || key === 'avg_wage') {
      return numeral(number).format('$ 0.00a');
    } else if(key === 'export_rca' || key === 'rca' || key === 'complexity' || key === 'distance' || key === 'employment' || key === 'population'){
      return numeral(number).format('0.00a');
    } else if(key === 'employment_growth'){
      return numeral(number).format('0.00%');
    } else if(key === 'export_value') {
      return 'USD ' + numeral(number).format('0.00a');
    } else {
      return number;
    }
  },
  actions: {
    sortByColumn: function(content){
      let key = content.key;
      this.set('content', []);
      let data;

      if(content.get('sorted')) {
        data = _.sortBy(this.get('data'), function(d) { return -d[key]});
      } else {
        data = this.get('data');
      }
      this.set('content', data);
      content.toggleProperty('sorted');
    }
 }
});

