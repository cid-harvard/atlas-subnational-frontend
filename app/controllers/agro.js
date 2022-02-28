import Ember from 'ember';

const {computed, get:get} = Ember;

export default Ember.Controller.extend({
  i18n: Ember.inject.service(),
  featureToggle: Ember.inject.service(),
  queryParams: ['source'],
  agroUrl: computed.alias('featureToggle.agroUrl'),
  actions: {
    openGuia(){

      var guia = parseInt($("#selectFile").children(":selected").attr("id"));

      if(guia === 1){
        window.open('https://drive.google.com/uc?export=view&id=1Oq_nK43hZj-Mjdx9GkH-2wkBR5giAN2W', '_blank');
      }

      if(guia === 2){
        window.open('https://drive.google.com/uc?export=view&id=1OqwlB08qJA9QLuFLgr16iYUX4panrUrH', '_blank');
      }

      if(guia === 3){
        window.open('https://drive.google.com/uc?export=view&id=1Oqu8sahUfehA8Jbeah44-ZMSR0wH1c8I', '_blank');
      }

    }
  }
});

