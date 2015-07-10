import Ember from 'ember';
const {computed} = Ember;

export default Ember.Component.extend({
  classNames: ['settings__input'],
  minDate: computed('dateRange', function() {
    return this.get('dateRange')[0];
  }),
  maxDate: computed('dateRange', function() {
    return this.get('dateRange')[1] + 1;
  }),
  sliderOptions: computed('type','dateRange', function() {
    return {
      start: [this.get('startDate'), this.get('endDate')],
      step: 1,
      margin: 1,
      connect: true,
      behaviour: 'tap-drag',
      range: {
        'min': this.get('minDate'),
        'max': this.get('maxDate')
      },
      pips: {
        mode: 'count',
        values: 1 + (this.get('maxDate') - this.get('minDate'))
      },
      format: {
        to: function(value) { return value; },
        from: function(value) {  return value; }
      }
    };
  }),
  sliderSetterFunction: computed('type', function() {
    let type = this.get('type');
    if(type === 'time') {
      return (values) => {
        let startYear = parseInt(values[0]);
        let endYear = parseInt(values[1]);
        this.set('newStartDate', startYear);
        this.set('newEndDate', endYear);
        this.set('years', `01/01/${startYear}- 01/01/${endYear}`)
      };
    } else  { //rca, similarity
      return (values) => {
        this.set('rca', parseInt(values[0]));
      };
    }
  }),
  didInsertElement: function() {
    Ember.run.scheduleOnce('afterRender', this , function() {
      noUiSlider.create(this.element, this.get('sliderOptions'));
      this.element.noUiSlider
        .on('set', this.get('sliderSetterFunction'));
    });
  }
});
