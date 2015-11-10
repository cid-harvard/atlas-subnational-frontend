import Ember from 'ember';

export default Ember.Mixin.create({
  columnSettingsMap: [
    {
      key: 'average_wages',
      type: 'int',
      savedWidth: 270
    }, {
      key: 'avg_wage',
      type: 'int',
      savedWidth: 270
    }, {
      key: 'code',
      savedWidth: 100
    }, {
      key: 'cog' ,
      type: 'int',
      savedWidth: 200
    }, {
      key: 'complexity' ,
      type: 'int',
      savedWidth: 180
    }, {
      key: 'distance' ,
      type: 'int',
      savedWidth: 110
    }, {
      key: 'employment',
      type: 'int',
      savedWidth: 130
    }, {
      key: 'employment_growth',
      type: 'int',
      savedWidth: 280
    }, {
      key: 'export_num_plants' ,
      type: 'int',
      savedWidth: 120
    }, {
      key: 'export_rca',
      type: 'int',
      savedWidth: 280
    }, {
      key: 'export_value',
      type: 'int',
      savedWidth: 180
    }, {
      key: 'import_value',
      type: 'int',
      savedWidth: 180
    }, {
      key: 'monthly_wages',
      type: 'int',
      savedWidth: 230
    }, {
      key: 'name',
      copy: 'export',
      savedWidth: 200
    }, {
      key: 'num_establishments' ,
      type: 'int',
      savedWidth: 120
    }, {
      key: 'num_vacancies',
      type: 'int',
      savedWidth: 100
    }, {
      key: 'parent',
      savedWidth: 270
    }, {
      key: 'rca',
      type: 'int',
      savedWidth: 280
    }, {
      key: 'wages',
      type: 'int',
      savedWidth: 380
    }, {
      key: 'year' ,
      type: 'int',
      savedWidth: 80
    }
  ],
  industryClassesMap: [
    { key: 'code' },
    { key: 'name', copy: 'industry' },
    { key: 'avg_wage' },
    { key: 'wages' },
    { key: 'employment' },
    { key: 'employment_growth' },
    { key: 'num_establishments' }
  ],
  productsMap: [
    { key: 'code' },
    { key: 'name', copy: 'export' },
    { key: 'parent' },
    { key: 'year' },
    { key: 'export_value' },
    { key: 'import_value' },
    { key: 'export_rca' },
    { key: 'complexity' },
    { key: 'distance' },
    { key: 'cog' }
   ],
  locationsMap: [
    { key: 'code' },
    { key: 'name', copy: 'location' },
    { key: 'year' },
    { key: 'export_value' },
    { key: 'import_value' },
    { key: 'export_num_plants' },
    { key: 'export_rca' },
    { key: 'distance' },
    { key: 'cog' }
   ],
  citiesMap: [
    { key: 'code' },
    { key: 'name', copy: 'location' },
    { key: 'year' },
    { key: 'export_value' },
    { key: 'import_value' },
    { key: 'export_num_plants' },
    { key: 'export_rca' },
    { key: 'distance' },
    { key: 'cog' }
   ],
  industriesMap: [
    { key: 'code' },
    { key: 'name', copy: 'industry' },
    { key: 'parent' },
    { key: 'year' },
    { key: 'monthly_wages' },
    { key: 'wages' },
    { key: 'employment' },
    { key: 'num_establishments' },
    { key: 'rca' },
    { key: 'complexity' },
    { key: 'distance' }
   ],
  departmentsMap: [
    { key: 'code' },
    { key: 'name', copy: 'location' },
    { key: 'year' },
    { key: 'monthly_wages' },
    { key: 'wages' },
    { key: 'num_establishments' },
    { key: 'employment' },
    { key: 'rca' },
    { key: 'distance' },
    { key: 'cog' }
   ],
  occupationsMap: [
    { key: 'code' },
    { key: 'name', copy: 'occupation' },
    { key: 'average_wages' }
  ],
});

