import Ember from 'ember';
const {computed, get} = Ember;

export default Ember.Component.extend({
  color: computed.alias('key.color'),
  code: computed.alias('key.code'),
  name: computed('key', 'i18n.locale', function(){
    let locale = get(this, 'i18n.display');
    return get(this, `key.name_${locale}`);
  }),
  myStyle: computed('color', function() {
    var color = this.get('color');
    return new Ember.Handlebars.SafeString("color: " + color);
  }),
  classNameBindings: ['isActive'],
  active: false,
  isActive: computed('active', function() {
    return this.get('code') === this.get('active');
  }),
  actions: {
    changeKey() {
      this.sendAction('action', this.get('code'));
    }
  }
});
