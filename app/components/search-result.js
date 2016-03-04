import Ember from 'ember';
const {computed} = Ember;

export default Ember.Component.extend({
  i18n: Ember.inject.service(),
  breadcrumb: computed('result.level', 'entity', 'i18n.locale', function() {
    if(this.get('result.level')) {
      let level = this.get('i18n').t(`search.level.${this.get('result.level')}`);

      if(this.get('entity') === 'location') {
        return `${level}`;
      } else {
        return `${level}: ${this.get('result.code')}`;
      }
    }
  }),
  hasProfile: computed('entity', 'result.level', function() {
    let entity = this.get('entity');
    let level = this.get('result.level');
    if(entity === 'product') { return false; }
    if(entity === 'industry' && level === 'class') { return false; }
    return true;
  }),
  name: computed('result.name', 'result.short_name', function() {
    return this.get('result.short_name') || this.get('result.name');
  }),
  entity: computed('result', function() {
      // Hack to make only product
      return 'product';
    //return this.get('result.constructor.modelName');
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
    } else if(this.get('entity') === 'industry') {
      return 'departments';
    }
  })
});
