import Ember from 'ember';

export default Ember.Component.extend({
  attributeBindings: ['width','height'],
  didInsertElement: function() {
    var slider = document.getElementById(this.elementId);

    // debugger;

    noUiSlider.create(slider, {
      start: [ 2013, 2014 ], // Handle start position
      step: 1, // Slider moves in increments of '10'
      margin: 1, // Handles must be more than '1' apart
      connect: true, // Display a colored bar between the handles
      behaviour: 'tap-drag', // Move handle on tap, bar is draggable
      range: { // Slider can select '0' to '100'
        'min': 2006,
        'max': 2014
      },
      pips: { // Show a scale with the slider
        mode: 'steps',
        density: 9
      }
    });

  }
});
