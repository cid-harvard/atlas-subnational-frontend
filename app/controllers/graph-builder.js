import Ember from 'ember';
const {computed} = Ember;

export default Ember.Controller.extend({
  i18n: Ember.inject.service(),
  needs: ['application'],
  firstYear: computed.alias('i18n.firstYear'),
  lastYear: computed.alias('i18n.lastYear'),

  entityId: computed.alias('entity_id'),
  name: computed('entity', 'model.name', 'i18n.locale', function() {
    if(this.get('entity') === 'location') {
      return this.get('model.name');
    } else {
      return `${this.get('model.name')} (${this.get('model.code')})`;
    }
  }),
  hasProfile: computed('entity', 'model.level', function() {
    let entity = this.get('entity');
    let level = this.get('model.level');
    if(entity === 'product') { return false; }
    if(entity === 'industry' && level === 'class') { return false; }
    return true;
  }),
  isPrescriptive: computed('model.level', function() {
    if(this.get('model.level') === 'municipality') { return false; }
    if(this.get('model.level') === 'class') { return false; }
    return true;
  }),
  builderNavType: computed('entity', function() {
    return `partials/builder-questions-${this.get('entity')}`;
  }),
  level: computed('model.level', 'i18n.locale', function() {
    return this.get('i18n').t(`location.model.${this.get('model.level')}`);
  }),
  isCountry: computed('model', function() {
    if(this.get('model.level') === 'country') { return true; }
    return false;
  }),
  thisLevel: computed('model.level', 'i18n.locale', function() {
    let level = this.get('i18n').t(`location.model.${this.get('model.level')}`);
    let thisLevel = `this ${level}`;

    if(this.get('model.level') === 'country') {
      thisLevel = level;
    } else if(this.get('i18n.display') === 'es') {
      if(level.string === 'ciudad' || level.string === 'entidad'){
        thisLevel = `esta ${level}`;
      } else {
        thisLevel = `este ${level}`;
      }
    }

    return thisLevel;
  }),
  profileLink: computed('entity', function() {
    return `${this.get('entity')}.show`;
  }),
  isGraphBuilderRoute: computed.alias('controllers.application.isGraphBuilderRoute')
});

