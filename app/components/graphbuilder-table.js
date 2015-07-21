import Ember from 'ember';
import numeral from 'numeral';
import ColumnDefinition from 'ember-table/models/column-definition';
import EmberTableComponent from 'ember-table/components/ember-table';
import HeaderCell from 'ember-table/views/header-cell';
import TableCell from 'ember-table/views/table-cell';

const { computed } = Ember;

var SortableTableHeaderCell = HeaderCell.extend({
  templateName: 'sortable-header-cell',
});

var SortableTableCell = TableCell.extend({
  templateName: 'sortable-cell',
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
  rowHeight: 35,
  height: 400,
  attributeBindings: ['height'],
  selectionMode: 'none',
  productsMap: [
    { key: 'name', expand: true },
    { key: 'export_value', type: 'int', expand: false},
    { key: 'export_rca', type: 'int', expand: false},
    { key: 'year' , expand: false, type: 'int'},
    { key: 'complexity' , expand: false, type: 'int'},
    { key: 'distance' , expand: false, type: 'int'}
   ],
  locationsMap: [
    { key: 'name', expand: true },
    { key: 'export_value', type: 'int', expand: false},
    { key: 'export_rca', type: 'int', expand: false},
    { key: 'year' , expand: false, type: 'int'},
   ],
  industriesMap: [
    { key: 'name', expand: true },
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
  content: computed('data', function() {
    return this.get('data');
  }),
  refreshTable: Ember.observer('locale.i18n', function() {
    this.content.clear()
  }),
  generateColumnDefinition: function(column) {
    return ColumnDefinition.create(SortableColumnMixin, {
      canAutoResize: column.expand,
      textAlign: column.type === 'int' ? 'text-align-right' : 'text-align-left',
      minWidth: 150,
      headerCellName: `graph_builder.table.${column.key}`,
      getCellContent: this.generateCellContent(column)
    });
  },
  generateCellContent: function(column) {
    return (row) => {
      if(_.isNumber(row.get(column.key))){
        let number = row.get(column.key);
        if(column.key === 'export_value') {
          return numeral(number).format('$ 0.00a');
        } else {
          return number;
        }
      } else if(column.key === 'name'){
        return row.get(`name_${this.get('i18n').locale}`) || row.get('code');
      } else {
        return 'N/A';
      }
    };
  }
});

