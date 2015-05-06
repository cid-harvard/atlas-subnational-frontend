import Ember from 'ember';

export function formatPercent(params) {
  var format = d3.format('+.1%');;
  return format(params);
}

export default Ember.HTMLBars.makeBoundHelper(formatPercent);
