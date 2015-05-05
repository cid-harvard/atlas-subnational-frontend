import Ember from 'ember';

export function formatPercent(params/*, hash*/) {
  debugger;
  return params + 's';
}

export default Ember.HTMLBars.makeBoundHelper(formatPercent);
