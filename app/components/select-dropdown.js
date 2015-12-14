import Ember from 'ember';
const {computed, get} = Ember;

export default Ember.Component.extend({
  i18n: Ember.inject.service(),
  transitionProduct: 'transitionProduct',
  transitionLocation: 'transitionLocation',
  transitionIndustry: 'transitionIndustry',
  locale: computed.alias('i18n.locale'),
  didInsertElement() {
    let locale = get(this, 'i18n.locale');
    this.$('select').selectmenu({
     select: (event, ui) =>{
       let id = get(ui, 'item.value');
       let type = get(this, 'type');
       if(type === 'location') {
         this.sendAction('transitionLocation', id);
       } else if (type === 'product') {
         this.sendAction('transitionProduct', id);
       } else if (type === 'industry') {
         this.sendAction('transitionIndustry', id);
       }
     }
    }).addClass(`${locale} overflow`);

    this.addObserver('locale', () => {
      Ember.run.next(this, function() {
        this.$('select').selectmenu('refresh', true);
      });
    });
  }
});
