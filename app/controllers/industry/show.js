import Ember from 'ember';
const {computed} = Ember;

export default Ember.Controller.extend({
  needs: 'application',
  locale: computed.alias("controllers.application.locale"),
  queryParams: ['year'],
  year: 2012,
  treemapIndependentVars: ['parent_id','municipality_id'],
  departmentsData: computed('model.departmentsData', function() {
    return _.chain(this.get('model.departmentsData'))
      .each(function(d) { d.avg_wage = d.wages/d.employment; })
      .value();
  }).readOnly(),
});

