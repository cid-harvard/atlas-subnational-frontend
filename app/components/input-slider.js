import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['settings__input'],
  slider: {},
  sliderOptions: Ember.computed('type', function(){
    return {
      start: [this.get('startDate'), this.get('endDate')],
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
    };
  }),
  initSlider: function() {
    // this.setSliderConfig();
    this.createSlider();
    this.bindListeners();
  },
  setSliderConfig: function() {
    // let type = this.get('type');

    // if(type === 'time') {
    //   this.set('sliderOptions', {
    //     start: [this.get('startDate'), this.get('endDate')],
    //     step: 1,
    //     margin: 1,
    //     connect: true,
    //     behaviour: 'tap-drag',
    //     range: {
    //       'min': 2006,
    //       'max': 2014
    //     },
    //     pips: {
    //       mode: 'count',
    //       values: 9
    //     }
    //   });
    // } else if(type === 'rca' || type === 'similarity') {
    //   this.set('sliderOptions', {
    //     start: [1],
    //     step: 1,
    //     behaviour: 'tap',
    //     range: {
    //       'min': 0,
    //       'max': 10
    //     },
    //     pips: {
    //       mode: 'count',
    //       values: 11
    //     }
    //   });
    // }
  },
  createSlider: function() {
    this.slider = document.getElementById(this.elementId);
    let opt = this.get('sliderOptions');

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
  },
  setSliderRange: function() {
    // Get array with range of all years
  },
  bindListeners: function() {
    this.slider.noUiSlider.on('update', (values)=> {
      if(this.get('type') === 'time') {
        this.set('startDate', values[0]);
        this.set('endDate', values[1]);
      } else if(this.get('type') === 'rca') {
        this.set('rca', values[0]);
      } else if(this.get('type') === 'similarity') {
        this.set('rca', values[0]);
      }
    });
  },
  didInsertElement: function() {
    this.initSlider();
  }
});
