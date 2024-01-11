import Ember from 'ember';
const { RSVP } = Ember;

export default Ember.Route.extend({
  renderTemplate() {
    this.render({ outlet: 'homepage' });
  },
  model() {
    let hash = {
     locations: this.store.find('location'),
     products: this.store.find('product', { level: '4digit' }),
     industries: this.store.find('industry', { level: 'division', level: 'class' }),
     agproducts: this.store.find('agproduct', { level: 'level3' }),
     nonags: this.store.find('nonag', { level: 'level3' }),
     livestock: this.store.find('livestock', { level: 'level1' }),
     landuses: this.store.find('land-use', { level: 'level2' })
    };

    return RSVP.hash(hash).then((hash) => {
      let {industries, products, locations, agproducts, nonags, livestock, landuses} = hash;
      
      return Object.create({
        industries: industries,
        products: products,
        locations: locations,
        agproducts: agproducts,
        nonags: nonags,
        livestock: livestock,
        landuses: landuses
      });
    });
  },
  deactivate() {
    this._super.apply(this,arguments);
    window.scrollTo(0,0);
  }
});

