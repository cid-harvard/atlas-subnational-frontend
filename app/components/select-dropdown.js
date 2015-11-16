import Ember from 'ember';
const {computed} = Ember;

export default Ember.Component.extend({
  didInsertElement: function() {
    $("#select-location").selectmenu();
    $("#select-industry").selectmenu();
    $("#select-product").selectmenu();
  }
});

