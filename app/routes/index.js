import Ember from 'ember';
const { RSVP } = Ember;

export default Ember.Route.extend({
  renderTemplate() {
    this.render({ outlet: 'homepage' });
  },
  model() {
    let hash = {
     cities: this.store.find('location', { level: 'msa' }),
     products: this.store.find('product', { level: '4digit' }),
     industries: this.store.find('industry', { level: 'division' })
    };

    return RSVP.hash(hash).then((hash) => {
      let {industries, products, cities} = hash;
      return Object.create({
        industries: industries,
        products: products,
        cities: cities
      });
    });
  },
  deactivate() {
    this._super.apply(this,arguments);
    window.scrollTo(0,0);
  }
});

