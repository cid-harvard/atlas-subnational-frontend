import sparkData from '../fixtures/spark';
import dotData from '../fixtures/dot';
import exportData from '../fixtures/exports';

export default {
  name: 'Atlántico',
  id: 'Atlántico',
  gdpGrowth: 'TK',
  gdp: '$8.2M',
  population: '2.4M',
  code: '42',
  randomAttr: { foo: 'bar'},
  profileSpark: sparkData.data,
  profileDot: dotData.data,
  profileExport: exportData.data
};
