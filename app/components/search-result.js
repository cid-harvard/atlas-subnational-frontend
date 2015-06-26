import Ember from 'ember';
const {computed} = Ember;

export default Ember.Component.extend({
  breadcrumb: computed('result.level', function() {
    if(this.get('result.level')) {
      return `Colombia > ${_.capitalize(this.get('result.level'))}`;
    }
  }),
  name: computed('result.name_en', function() {
    //depend on i18n later
    return this.get('result.name_en');
  }),
  profileLink: computed('entity', function() {
    return `${this.get('entity')}.show`;
  }),
  entity: computed('result.level', function() {
    if(this.get('result.level')) {
      return 'location';
    }
  })
});
