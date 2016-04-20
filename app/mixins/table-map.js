import Ember from 'ember';
const {computed} = Ember;

export default Ember.Mixin.create({
  featureToggle: Ember.inject.service('feature-toggle'),
  columnSettingsMap: [
    { key: 'average_wages', type: 'int', savedWidth: 290 },
    { key: 'avg_wage', type: 'int', savedWidth: 290 },
    { key: 'code', savedWidth: 100 },
    { key: 'cog' , type: 'int', savedWidth: 200 },
    { key: 'complexity' , type: 'int', savedWidth: 180 },
    { key: 'distance' , type: 'int', savedWidth: 110 },
    { key: 'employment', type: 'int', savedWidth: 130 },
    { key: 'employment_growth', type: 'int', savedWidth: 280 },
    { key: 'export_num_plants' , type: 'int', savedWidth: 200 },
    { key: 'export_rca', type: 'int', savedWidth: 280 },
    { key: 'export_value', type: 'int', savedWidth: 180 },
    { key: 'import_value', type: 'int', savedWidth: 180 },
    { key: 'monthly_wages', type: 'int', savedWidth: 290 },
    { key: 'name', copy: 'export', savedWidth: 200 },
    { key: 'num_establishments' , type: 'int', savedWidth: 200 },
    { key: 'num_vacancies', type: 'int', savedWidth: 100 },
    { key: 'parent', savedWidth: 270 },
    { key: 'rca', type: 'int', savedWidth: 280 },
    { key: 'wages', type: 'int', savedWidth: 330 },
    { key: 'year' , type: 'int', savedWidth: 80 },
    { key: 'ranking' , type: 'int', savedWidth: 80 },
    { key: 'eci' , type: 'int', savedWidth: 210 },
    { key: 'industry_eci' , type: 'int', savedWidth: 210 },
    { key: 'gdp_pc_real' , type: 'int', savedWidth: 200 },
    { key: 'gdp_real' , type: 'int', savedWidth: 190 },
    { key: 'share' , type: 'int', savedWidth: 190 },
    { key: 'population' , type: 'int', savedWidth: 180 }
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
  productsMap: computed('featureToggle.showImports', function() {
    let columns = [
      { key: 'code' },
      { key: 'name', copy: 'export' },
      { key: 'parent' },
      { key: 'year' },
      { key: 'export_value' },
      { key: 'export_rca' },
      { key: 'complexity' },
      { key: 'distance' },
      { key: 'cog' }
    ];

    if(this.get('featureToggle.showImports')) {
      return columns.concat({key: 'import_value'});
    } else {
      return columns;
    }

  }),
  citiesMap: computed('featureToggle.showImports', 'featureToggle.showIndustries', function() {
    let columns = [
      { key: 'code' },
      { key: 'name', copy: 'location' },
      { key: 'year' },
      { key: 'export_value' },
      { key: 'export_num_plants' },
      { key: 'export_rca' },
      { key: 'distance' },
     ];

    if(this.get('featureToggle.showImports')) {
      columns = columns.concat({key: 'import_value'});
    }

    if(this.get('featureToggle.showIndustries')) {
      columns = columns.concat(
        { key: 'monthly_wages' },
        { key: 'wages' },
        { key: 'employment' },
        { key: 'num_establishments' }
      );
    }

    return columns;
  }),
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
  departmentsMap: computed('featureToggle.showImports', 'featureToggle.showIndustries', function() {
    let columns = [
      { key: 'code' },
      { key: 'name', copy: 'location' },
      { key: 'year' },
      { key: 'rca' },
      { key: 'distance' },
      { key: 'export_value' },
      { key: 'export_num_plants' },
      { key: 'export_rca' },
      { key: 'cog' }
     ];

    if(this.get('featureToggle.showImports')) {
      columns = columns.concat({key: 'import_value'});
    }

    if(this.get('featureToggle.showIndustries')) {
      columns = columns.concat(
        { key: 'monthly_wages' },
        { key: 'wages' },
        { key: 'employment' },
        { key: 'num_establishments' }
      );
    }

    return columns;

  }),
  occupationsMap: [
    { key: 'code' },
    { key: 'name', copy: 'occupation' },
    { key: 'average_wages' },
    { key: 'share' }
  ],
  partnersMap: computed('featureToggle.showImports', function() {
    let columns = [
      { key: 'code' },
      { key: 'name', copy: 'country' },
      { key: 'parent', copy: 'parent.country' },
      { key: 'export_value' },
      { key: 'year' }
    ];

    if(this.get('featureToggle.showImports')) {
      return columns.concat({key: 'import_value'});
    } else {
      return columns;
    }
  }),
  rankingsMap: computed('featureToggle.showIndustries', function() {
    let columns = [
      { key: 'name' },
      { key: 'year' },
      { key: 'eci' },
      { key: 'gdp_pc_real' },
      { key: 'gdp_real' },
      { key: 'population' }
    ];

    if(this.get('featureToggle.showIndustries')) {
      columns.splice(3, 0, {key: 'industry_eci'});
    }

    return columns;
   })
});

