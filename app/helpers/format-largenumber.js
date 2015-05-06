import Ember from 'ember';

export function formatLargenumber(params) {
  var prefix = d3.formatPrefix(params);
  return prefix.scale(params).toFixed(1) + prefix.symbol.replace(/G/, 'B');
}

export default Ember.HTMLBars.makeBoundHelper(formatLargenumber);
