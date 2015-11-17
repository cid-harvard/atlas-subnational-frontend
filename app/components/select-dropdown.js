import Ember from 'ember';
const {computed} = Ember;

export default Ember.Component.extend({
  didInsertElement: function() {
    $("#select-location").selectmenu()
      .addClass( "overflow" );
    $("#select-industry").selectmenu()
      .addClass( "overflow" );
    $("#select-product").selectmenu()
      .addClass( "overflow" );
  }
});