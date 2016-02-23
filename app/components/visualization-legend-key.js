import Ember from 'ember';
const { computed, get } = Ember;

export default Ember.Component.extend({
  color: computed.alias('key.color'),
  name: computed('key', 'i18n.locale', function(){
    let locale = get(this, 'i18n.display');
    return get(this, `key.name_${locale}`);
  }),
  myStyle: computed('color', function() {
    var color = this.get('color');
    return new Ember.Handlebars.SafeString("color: " + color);
  })
});
