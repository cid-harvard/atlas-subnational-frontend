import Ember from 'ember';
import numeral from 'numeral';
import ColumnDefinition from 'ember-table/models/column-definition';
import EmberTableComponent from 'ember-table/components/ember-table';

const { computed } = Ember;

export default EmberTableComponent.extend({
  i18n: Ember.inject.service(),
  hasFooter: false,
  rowHeight: 35,
  height: 400,
  attributeBindings: ['height'],
  selectionMode: 'none',
  productsMap: [
    { displayName: 'Name', key: 'name', expand: true },
    { displayName: 'Export', key: 'export_value', type: 'int', expand: false},
    { displayName: 'Rca', key: 'export_rca', type: 'int', expand: false},
    { displayName: 'Year', key: 'year' , expand: false, type: 'int'},
    { displayName: 'Complexity', key: 'complexity' , expand: false, type: 'int'},
    { displayName: 'Distance', key: 'distance' , expand: false, type: 'int'}
   ],
  locationsMap: [
    { displayName: 'Name', key: 'name', expand: true },
    { displayName: 'Export', key: 'export_value', type: 'int', expand: false},
    { displayName: 'Rca', key: 'export_rca', type: 'int', expand: false},
    { displayName: 'Year', key: 'year' , expand: false, type: 'int'},
   ],
  industriesMap: [
    { displayName: 'Name', key: 'name', expand: true },
    { displayName: 'Wages', key: 'wages', type: 'int', expand: false},
    { displayName: 'Employment', key: 'employment', type: 'int', expand: false},
    { displayName: 'Rca', key: 'rca', type: 'int', expand: false},
    { displayName: 'Year', key: 'year' , expand: false, type: 'int'},
    { displayName: 'Complexity', key: 'complexity' , expand: false, type: 'int'}
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
  generateColumnDefinition: function(column) {
    return ColumnDefinition.create({
      canAutoResize: column.expand,
      textAlign: column.type === 'int' ? 'text-align-right' : 'text-align-left',
      minWidth: 150,
      headerCellName: column.displayName,
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

