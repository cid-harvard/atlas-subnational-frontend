import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['settings__input'],
  slider: {},
  sliderOptions: {},
  setSliderConfig: function() {
    let type = this.get('type');

    if(type === 'time') {
      this.set('sliderOptions', {
        start: [ 2013, 2014 ],
        step: 1,
        margin: 1,
        connect: true,
        behaviour: 'tap-drag',
        range: {
          'min': 2006,
          'max': 2014
        },
        pips: {
          mode: 'count',
          values: 9
        }
      });
    } else if(type === 'rca' || type === 'similarity') {
      this.set('sliderOptions', {
        start: 1,
        step: 1,
        behaviour: 'tap',
        range: {
          'min': 0,
          'max': 10
        },
        pips: {
          mode: 'count',
          values: 11
        }
      });
    }
  },
  setSliderRange: function() {
    // Get array with range of all years
  },
  initSlider: function() {
    this.setSliderConfig();
    this.createSlider();
  },
  createSlider: function() {
    this.slider = document.getElementById(this.elementId);
    let opt = this.sliderOptions;

    noUiSlider.create(this.slider, {
      start: opt.start , // Handle start position
      step: opt.step, // Slider moves in increments of '10'
      margin: opt.margin, // Handles must be more than one step apart
      connect: opt.connect, // Display a colored bar between the handles
      behaviour: opt.behaviour, // Move handle on tap, bar is draggable
      range: { // Slider can select '0' to '100'
        'min': opt.range.min,
        'max': opt.range.max
      },
      pips: { // Show a scale with the slider
        mode: opt.pips.mode,
        values: opt.pips.values
      }
    });
    // debugger;
  },
  didInsertElement: function() {
    this.initSlider();
  }
});
