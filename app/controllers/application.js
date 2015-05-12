import Ember from 'ember';
const {observer, on, set:set} = Ember;

export default Ember.Controller.extend({
  language: Ember.$.cookie('lang') === 'es',
  initLanguage: on('init', function(){
    var application = this.container.lookup('application:main');
    if(Ember.$.cookie('lang') === 'es'){
      set(this, 'isEnglish', false);
      set(application, 'locale', 'es');
    }else{
      set(this, 'isEnglish', true);
      set(application, 'locale', 'en');
    }
  }),
  setLanguage: observer('language',function() {
    var application = this.container.lookup('application:main');
    if(this.get('isEnglish')){
      set(application, 'locale', 'es');
      Ember.$.cookie('lang', 'es');
      set(this, 'isEnglish', false);
    }else{
      set(application, 'locale', 'en');
      Ember.$.cookie('lang', 'en');
      set(this, 'isEnglish', true);
    }
    this.send('rerender');
  })
});
