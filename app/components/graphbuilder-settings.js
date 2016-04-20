import Ember from 'ember';
const {computed} = Ember;

export default Ember.Component.extend({
  featureToggle: Ember.inject.service(),

  attributeBindings: ['data-dateIndex'],
  tagName: 'form',
  isGreater: computed.equal('rcaFilter', 'greater'),
  isLess: computed.equal('rcaFilter', 'less'),
  isAll: computed.equal('rcaFilter', 'all'),
  year: computed('startDate', function() {
    return parseInt(this.get('startDate'));
  }),
  lastYear: computed('featureToggle.last_year', function() {
    return parseInt(this.get('featureToggle.last_year'));
  }),
  firstYear: computed('featureToggle.first_year', function() {
    return parseInt(this.get('featureToggle.first_year'));
  }),
  disableIncreaseYear: computed('year', 'lastYear', function() {
    return this.get('year') >= parseInt(this.get('lastYear'));
  }),
  disableDecreaseYear: computed('year','firstYear', function() {
    return this.get('year') <= parseInt(this.get('firstYear'));
  }),
  actions: {
    increaseYear() {
      if(this.get('disableIncreaseYear')) { return false; }
      this.incrementProperty('startDate');
      this.incrementProperty('endDate');
    },
    decreaseYear() {
      if(this.get('disableDecreaseYear')) { return false; }
      this.decrementProperty('startDate');
      this.decrementProperty('endDate');
    },
    rcaGreater() {
      this.set('rcaFilter', 'greater');
      this.set('isOpen', false);
    },
    rcaLess() {
      this.set('rcaFilter', 'less');
      this.set('isOpen', false);
    },
    rcaAll() {
      this.set('rcaFilter', 'all');
      this.set('isOpen', false);
    }
  }
});

