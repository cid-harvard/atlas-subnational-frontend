import Ember from "ember";

export function arrayContains([array, item]) {
  return array.indexOf(item) > -1;
}

export default Ember.HTMLBars.makeBoundHelper(arrayContains);
