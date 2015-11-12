import Ember from 'ember';
const {computed, get:get} = Ember;

export default Ember.Component.extend({
  parents: computed.alias('model.parents'),
  isLocation: computed.equal('model.entity', 'location'),
  isGraphbuilder: computed.equal('page', 'graphbuilder'),
  showBreadCrumb: computed.gt('model.parents.length', 0),
  breadcrumbs: computed('model', 'parents', 'showBreadCrumb', function() {
    if(this.get('showBreadCrumb')) {
      return get(this, 'parents').concat(get(this, 'model'));
    } else {
      return [];
    }
  }),
  link: computed('page','model.entity', 'isGraphbuilder', function() {
    if(get(this, 'isGraphbuilder')) {
      return 'graph_builder';
    } else {
      return `${get(this, 'model.entity')}.show`;
    }
  }),
});
