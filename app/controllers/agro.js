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
        window.open('https://datlas-colombia-downloads-test.s3.amazonaws.com/Agro/GUIA+AGUACATE+VF.pdf', '_blank');
      }

      if(guia === 2){
        window.open('https://datlas-colombia-downloads-test.s3.amazonaws.com/Agro/GUIA+CACAO+VF.pdf', '_blank');
      }

      if(guia === 3){
        window.open('https://datlas-colombia-downloads-test.s3.amazonaws.com/Agro/GUIA+PI%C3%91A+VF.pdf', '_blank');
      }

    }
  }
});

