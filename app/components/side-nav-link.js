import Ember from 'ember';
import { pluralize } from 'ember-inflector';
const { computed } = Ember;

export default Ember.Component.extend({
  i18n: Ember.inject.service(),
  tagName: ['li'],
  classNames: ['sidebar__btn', 'nav__item--sub'],
  isCurrentEntity: computed('linkEntity', 'entity', function() {
    return this.get('linkEntity') === this.get('entity');
  }),
  profileLink: computed('entity', function(){
    if(this.get('entity') === 'location') { return 'location.show'; }
    if(this.get('entity') === 'product') { return 'product.show'; }
  }),
  entity_and_id: computed('entity', 'entity_id', function() {
    return `${this.get('entity')}-${this.get('entity_id')}`;
  }),
  source: computed('entity', function() {
    if(this.get('entity') === 'location') { return 'products'; }
    if(this.get('entity') === 'product') { return 'locations'; }
  }),
  linkText: computed('linkEntity','i18n.locale', function() {
    return this.get('i18n').t(`general.${pluralize(this.get('linkEntity'))}`);
  }),
  isProfileLink: computed('linkView','isCurrentEntity', function() {
    return this.get('linkView') === 'profile' && this.get('isCurrentEntity');
  }),
  isGraphBuilderLink: computed('linkView','isCurrentEntity',  function() {
    return this.get('linkView') === 'graphbuilder' && this.get('isCurrentEntity');
  })
});

