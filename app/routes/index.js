import Ember from 'ember';
const { RSVP } = Ember;

export default Ember.Route.extend({
  renderTemplate() {
    this.render({ outlet: 'homepage' });
  },
  model() {
    let hash = {
     locations: this.store.findAll('location'),
     products: this.store.findAll('product', { level: '4digit' }),
     industries: this.store.findAll('industry', { level: 'division' })
    };

    return RSVP.hash(hash).then((hash) => {
      let {industries, products, locations} = hash;
      return Object.create({
        industries: industries,
        products: products,
        locations: locations
      });
    });
  },
  deactivate() {
    this._super.apply(this,arguments);
    window.scrollTo(0,0);
  }
});

