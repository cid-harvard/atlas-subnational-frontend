import Ember from 'ember';
import numeral from 'numeral';
const {computed} = Ember;

export default Ember.Component.extend({
    mapService: Ember.inject.service(),
    firstLegend: null,
    firstStartDate: null,
    firstEndDate: null,
    activeLegend: null,
    staticLegend: computed('legend', 'endDate', 'startDate', function(){
      let legend = this.get('legend');
      const endDate = this.get('endDate');
      const startDate = this.get('startDate');
      if (!this.get('firstLegend') || endDate !== this.get('firstEndDate') || startDate !== this.get('firstStartDate')){
        this.set('firstLegend', legend);
        this.set('firstStartDate', startDate);
        this.set('firstEndDate', endDate);
        return legend;
      } else {
        return this.get('firstLegend');
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
      resetFilterByKey(){
          this.set('activeLegend', null);
          this.set("mapService.range", null);
      }
    }
});
