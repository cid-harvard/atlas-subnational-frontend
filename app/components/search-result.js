import Ember from 'ember';
const {computed} = Ember;

export default Ember.Component.extend({
  breadcrumb: computed('result.level', function() {
    if(this.get('result.level')) {
      return `${_.capitalize(this.get('entity'))} > ${_.capitalize(this.get('result.level'))}`;
    }
  }),
  name: computed('result.name', 'result.short_name', function() {
    return this.get('result.short_name') || this.get('result.name');
  }),
  entity: computed('result', function() {
    return this.get('result.constructor.modelName');
  }),
  profileLink: computed('entity', function() {
    return `${this.get('entity')}.show`;
  }),
  entity_and_id: computed('entity', 'result.id', function() {
    return `${this.get('entity')}-${this.get('result.id')}`;
  }),
  source: computed('entity', function() { //FIXME: yeah fix this later
    if(this.get('entity') === 'location') {
      return 'products';
    } else if(this.get('entity') === 'product') {
      return 'locations';
    }
  })
});

