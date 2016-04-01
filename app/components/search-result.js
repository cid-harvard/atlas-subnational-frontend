import Ember from 'ember';
const {computed, get} = Ember;

export default Ember.Component.extend({
  i18n: Ember.inject.service(),
  breadcrumb: computed('result.level', 'entity', 'i18n.locale', function() {
    if(get(this, 'result.level')) {
      let level = get(this, 'i18n').t(`search.level.${get(this, 'result.level')}`);

      if(get(this, 'entity') === 'location') {
        return `${level}`;
      } else {
        return `${level}: ${this.get('result.code')}`;
      }
    }
  }),
  name: computed('result.name', 'result.short_name', 'result.level', function() {
    let name = get(this, 'result.short_name') || get(this, 'result.name');
    return name;
  }),
  locationBreadcrumbs: computed('result.parent', function() {
    let metaData = get(this, 'metaData.locations');
    let parentId = get(this, 'result.parent_id');
    let crumbs = [];
    while(!_.isNull(parentId)){
      let parent = metaData[parentId];
      crumbs.unshift(parent);
      parentId = get(parent, 'parent_id');
    }
    return crumbs;
  }),
  entity: computed('result', function() {
//<<<<<<< HEAD
//    return get(this, 'result.constructor.modelName');
//======= let's keep it for the time being
      // Hack to make only product
      return 'product';
    //return this.get('result.constructor.modelName');
//>>>>>>> feature/postgres-text-search
  }),
  profileLink: computed('entity', function() {
    return `${this.get('entity')}.show`;
  })
});
