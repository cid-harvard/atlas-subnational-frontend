import Ember from 'ember';
import numeral from 'numeral';
const {computed} = Ember;

export default Ember.Component.extend({
    mapService: Ember.inject.service(),
    firstLegend: null,
    activeLegend: null,
    staticLegend: computed('legend', function(){
      let legend = this.get('legend')
      if (!this.get('firstLegend')) {
        this.set('firstLegend', legend)
        return legend
      } else {
        return this.get('firstLegend')
      }

    }),
    actions: {
        filterByKey(start, end, active, range) {

          if(this.get('activeLegend') === active.string){
            this.set('activeLegend', null);
            this.set("mapService.range", null);
          }else{
            this.set('activeLegend', active.string);
            this.set("mapService.range", [start, end, range]);
          }
        },
    }
});
