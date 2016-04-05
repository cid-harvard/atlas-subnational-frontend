import Ember from 'ember';

export default Ember.Component.extend({
  activeKey: null,
  actions: {
    changeKey(key) {
      let code = [];

      if(this.get('activeKey') === key) {
        this.set('activeKey', null);
      } else {
        this.set('activeKey', key);
        code = [key];
      }

      // Retrieve the scatterplot's configuration object
      let elScatter = this.get('parentView').get('childViews').filter(function(d) {
        return typeof d['scatter'] !== 'undefined';
      })[0];

      // Update the scatterplot's configuration object
      elScatter.get('scatter').params({
        filter: code
      });

      // Force graph refresh with new configuration
      elScatter.get('scatter').params().refresh = true;

      // Re-draw
      d3.select(elScatter.get('id')).call(elScatter.get('scatter'));

    }
  }
});
