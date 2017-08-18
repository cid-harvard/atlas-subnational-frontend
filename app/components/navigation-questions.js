import Ember from 'ember';

const {computed} = Ember;

export default Ember.Component.extend({
  i18n: Ember.inject.service(),
  featureToggle: Ember.inject.service(),

  questionsPartial: computed('entityType', function() {
    return this.get('entityType') + '/questions';
  }),

  allPanels: computed('entityType', function(){
    var entityType = this.get('entityType');
    switch(entityType){
      case 'industry':
        return ['employment', 'wages', 'num_vacancies', 'occupation'];
      case 'product':
        return ['exports', 'imports'];
      case 'agproduct':
        return ['land_sown', 'land_harvested', 'production'];
      case 'landUse':
        return ['area'];
      case 'location':
        return ['industries', 'exports', 'imports'];
    }
  }),
  openPanels: computed('allPanels', 'entityType', function(){

    // If not a profile page, we start with all panels collapsed.
    var isProfilePage = this.container.lookup("controller:application").get("isProfileRoute");
    if (!isProfilePage){
      return [];
    }

    // For profiles that are mostly empty, we expand all panels
    var entityType = this.get('entityType');
    switch(entityType){
      case 'agproduct':
        return this.get('allPanels');
      case 'product':
        return this.get('allPanels');
      case 'landUse':
        return this.get('allPanels');
      default:
        return [];
    }
  }),

  isIndustryClass: computed('model.level', function(){
    let entityType = this.get('entityType');
    let level = this.get('model.level');
    return (entityType === "industry") && (level === "class");
  }),

  actions: {
    togglePanel(name) {
      if(_.includes(this.get('allPanels'), name)){
        if(_.includes(this.get('openPanels'), name)){
          this.set('openPanels', _.reject(this.get('openPanels'), (x)=>x===name));
        } else {
          this.set('openPanels', _.union(this.get('openPanels'), [name]));
        }
      } else {
        console.log("Invalid panel " + name + ", we have " + this.get('allPanels'));
      }
    }
  },

});
