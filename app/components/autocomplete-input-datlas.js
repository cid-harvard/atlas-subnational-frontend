import Ember from 'ember';
const {computed, get, observer} = Ember;

export default Ember.Component.extend({
  i18n: Ember.inject.service(),
  search: null,
  placeHolder: null,
  transitionProduct: 'transitionProduct',
  transitionLocation: 'transitionLocation',
  transitionIndustry: 'transitionIndustry',
  transitionLocationProducts: 'transitionLocationProducts',
  transitionAgproduct: 'transitionAgproduct',
  runSelect: computed('idSelect', 'type', 'data_search', 'placeHolder', 'search', 'i18n', function(){
    let id_select = this.get('idSelect');
    var $eventSelect = $(`#${id_select}`);
    let type = this.get('type');
    let self = this
    var data = this.get('data_search')
    var placeholder = this.get("placeHolder")

    if(placeholder === null){
      placeholder = this.get('i18n').t(`pageheader.search_placeholder.${type}`).string
    }
    
    data.unshift({ id: "", text: ""})

    $eventSelect.select2({
      placeholder: placeholder,
      allowClear: true,
      theme: 'bootstrap4',
      language: this.get('i18n').display,
      width: 'auto',
      dropdownAutoWidth : true,
      data: data,
      containerCssClass: "flex-fill"
    });

    $eventSelect.on("select2:select", function (e) {

      let id = $eventSelect.val();
      let text= $(`#${id_select} option:selected`).text();

      if(id !== ""){
        if(type === 'location') {
          self.sendAction('transitionLocation', id);
        } else if (type === 'product') {
          self.sendAction('transitionProduct', id);
        } else if (type === 'industry') {
          self.sendAction('transitionIndustry', id);
        } else if (type === 'location-product') {
          self.sendAction('transitionLocationProducts', id);
        } else if (type === 'rural') {
          self.sendAction('transitionAgproduct', id);
        } else if (type === 'search') {
          self.set('search', text);
        }
      }
      
    });
  }),
  didInsertElement: function() {
    Ember.run.scheduleOnce('afterRender', this , function() {

      this.get("runSelect");

    });
  },
  update: observer('i18n.display', function() {
    let id_select = this.get('idSelect');
    var $eventSelect = $(`#${id_select}`);
    var placeholder = this.get("placeHolder")
    let type = this.get('type');

    if(placeholder === null){
      placeholder = this.get('i18n').t(`pageheader.search_placeholder.${type}`).string
    }

    $eventSelect.select2({
      placeholder: placeholder,
      allowClear: true,
      theme: 'bootstrap4',
      language: this.get('i18n').display,
      width: 'auto',
      dropdownAutoWidth : true,
    });

  }),
  actions: {
    reset: function() {
      this.set('search', null);

      let id_select = this.get('idSelect');
      var $eventSelect = $(`#${id_select}`);
      $eventSelect.val('');
      $eventSelect.trigger('change');
    }
  }
});
