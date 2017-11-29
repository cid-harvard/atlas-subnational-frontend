import Ember from 'ember';
const {computed, get} = Ember;

export default Ember.Component.extend({
  i18n: Ember.inject.service(),
  transitionProduct: 'transitionProduct',
  transitionLocation: 'transitionLocation',
  transitionIndustry: 'transitionIndustry',
  transitionLocationProducts: 'transitionLocationProducts',
  transitionAgproduct: 'transitionAgproduct',
  locale: computed.alias('i18n.locale'),
  didInsertElement() {
    let locale = get(this, 'i18n.locale');
    Ember.run.scheduleOnce('afterRender', this , () => {
      this.$('select').selectmenu({
        select: (event, ui) => {
         let id = get(ui, 'item.value');
         let type = get(this, 'type');
         if(type === 'location') {
           this.sendAction('transitionLocation', id);
         } else if (type === 'product') {
           this.sendAction('transitionProduct', id);
         } else if (type === 'industry') {
           this.sendAction('transitionIndustry', id);
         } else if (type === 'location-product') {
           this.sendAction('transitionLocationProducts', id);
         } else if (type === 'agproduct') {
           this.sendAction('transitionAgproduct', id);
         }
       }
      })
      .addClass(locale)
      .addClass("overflow");
      let width = this.$().width();
      this.$('select').selectmenu('instance')._resizeMenu = function() {
        this.menu.outerWidth(width);
      };

      this.addObserver('locale', () => {
        Ember.run.next(this, function() {
          let width = this.$().width();
          this.$('select').selectmenu('refresh', true);
          this.$('select').selectmenu('instance')._resizeMenu = function() {
            this.menu.outerWidth(width);
          };
        });
      });
    });
  },
  willDestroyElement() {
    this.$('select').selectmenu('destroy');
  }
});

