import Ember from 'ember';

export default Ember.Route.extend({
  renderTemplate() {
    this.render({ outlet: 'homepage' });
  },
  deactivate() {
    this._super.apply(this,arguments);
    window.scrollTo(0,0);
  }
});

