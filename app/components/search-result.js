import Ember from 'ember';
const {computed, get} = Ember;

export default Ember.Component.extend({
  i18n: Ember.inject.service(),
  breadcrumb: computed('result.level', 'entity', 'i18n.locale', function() {
    if(get(this, 'result.level')) {
      let level = get(this, 'i18n').t(`search.level.${get(this, 'result.level')}`);

      if(get(this, 'levelOnly')){
        return `${level}`;
      }

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
    return get(this, 'result.constructor.modelName');
  }),
  profileLink: computed('entity', function() {
    if (this.get('entity') === "land-use"){
      return 'landUse.show';
    }
    return `${this.get('entity')}.show`;
  })
});

