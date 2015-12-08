import Ember from 'ember';
const {computed, get} = Ember;

export default Ember.Component.extend({
  i18n: Ember.inject.service(),

  type: null,
  source: null,
  variable: null,

  level: computed.alias('model.level'),

  isLocation: computed.equal('type', 'location'),
  isProduct: computed.equal('type', 'product'),
  isIndustry: computed.equal('type', 'industry'),

  firstYear: computed.alias('i18n.firstYear'),
  lastYear: computed.alias('i18n.lastYear'),

  isCountry: computed.equal('level', 'country'),
  isDepartment: computed.equal('level','department'),
  isMunicipality: computed.equal('level','municipality'),
  isMsa: computed.equal('level','msa'),

  isIndustryClass: computed.equal('level', 'class'),
  isPrescriptiveLocation: computed.or('isDepartment', 'isCountry', 'isMsa'),

  sourceDepartments: computed.equal('source', 'departments'),
  sourceOccupations: computed.equal('source', 'occupations'),
  sourceCities: computed.equal('source', 'cities'),
  sourceIndustries: computed.equal('source', 'industries'),
  sourceProducts: computed.equal('source', 'products'),
  sourcePartners: computed.equal('source', 'partners'),

  variableEmployment: computed.equal('variable', 'employment'),
  variableWages: computed.equal('variable', 'wages'),
  variableVacancies: computed.equal('variable', 'num_vacancies'),
  variableRCA: computed.equal('variable', 'rca'),
  variableOpportunity: computed.equal('variable', 'opportunity'),
  variableExports: computed.equal('variable', 'export_value'),
  variableImports: computed.equal('variable', 'import_value'),
  /*
   *Active Bindings for Industry Questions
   */
  industryDepartmentWage: computed.and('sourceDepartments', 'variableWages'),
  industryDepartmentEmployment: computed.and('sourceDepartments', 'variableEmployment'),
  industryCitiesWage: computed.and('sourceCities', 'variableWages'),
  industryCitiesEmployment: computed.and('sourceCities', 'variableEmployment'),
  industryOccupationsVacancies: computed.and('sourceOccupations', 'variableVacancies'),
  /*
   *Active Bindings for Location Questions
   */
  locationIndustryRCA: computed.and('sourceIndustries', 'variableRCA'),
  locationIndustryEmployment: computed.and('sourceIndustries', 'variableEmployment'),
  locationIndustryWages: computed.and('sourceIndustries', 'variableWages'),
  locationIndustryOpportunity: computed.and('sourceIndustries', 'variableOpportunity'),

  locationProductRCA: computed.and('sourceProducts', 'variableRCA'),
  locationProductExports: computed.and('sourceProducts', 'variableExports'),
  locationProductImports: computed.and('sourceProducts', 'variableImports'),
  locationProductOpportunity: computed.and('sourceProducts', 'variableOpportunity'),

  locationPartnersExports: computed.and('sourcePartners', 'variableExports'),
  locationPartnersImports: computed.and('sourcePartners', 'variableImports'),

  /*
   *Active Bindings for Product Questions
   */
  productCitiesExports: computed.and('sourceCities', 'variableExports'),
  productCitiesImports: computed.and('sourceCities', 'variableImports'),

  productDepartmentsExports: computed.and('sourceDepartments', 'variableExports'),
  productDepartmentsImports: computed.and('sourceDepartments', 'variableImports'),

  breadcrumbs: computed('model.parent', function() {
    let metaData = get(this, 'metaData.locations');
    let parentId = get(this, 'model.parent_id');
    let crumbs = [];
    while(!_.isNull(parentId)){
      let parent = metaData[parentId];
      crumbs.unshift(parent);
      parentId = get(parent, 'parent_id');
    }
    return crumbs;
  })
});
