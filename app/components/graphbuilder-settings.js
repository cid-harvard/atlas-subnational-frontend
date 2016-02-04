import Ember from 'ember';
const {computed} = Ember;

export default Ember.Component.extend({
  i18n: Ember.inject.service(),
  attributeBindings: ['data-dateIndex'],
  isGreater: computed.equal('rcaFilter', 'greater'),
  isLess: computed.equal('rcaFilter', 'less'),
  isAll: computed.equal('rcaFilter', 'all'),
  year: computed('startDate', function() {
    return parseInt(this.get('startDate'));
  }),
  lastYear: computed('i18n.lastYear', function() {
    return parseInt(this.get('i18n.lastYear'));
  }),
  firstYear: computed('i18n.firstYear', function() {
    return parseInt(this.get('i18n.firstYear'));
  }),
  disableIncreaseYear: computed('year', 'lastYear', function() {
    return this.get('year') >= parseInt(this.get('lastYear'));
  }),
  disableDecreaseYear: computed('year', function() {
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
    },
  }
});

