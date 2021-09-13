import Ember from 'ember';
const {computed, get, observer} = Ember;

export default Ember.Component.extend({
  i18n: Ember.inject.service(),
  buildermodSearchService: Ember.inject.service(),
  treemapService: Ember.inject.service(),
  search: null,
  placeHolder: null,
  transitionProduct: 'transitionProduct',
  transitionLocation: 'transitionLocation',
  transitionLocationRoute: 'transitionLocationRoute',
  transitionIndustry: 'transitionIndustry',
  transitionLocationProducts: 'transitionLocationProducts',
  transitionProductsRoute: 'transitionProductsRoute',
  transitionAgproduct: 'transitionAgproduct',
  transitionLivestock: 'transitionLivestock',
  transitionNonag: 'transitionNonag',
  transitionLanduse: 'transitionLanduse',
  runSelect: computed('idSelect', 'data_search', 'placeHolder', 'search', 'i18n', function(){

    let id_select = this.get('idSelect');
    var $eventSelect = $(`#${id_select}`);
    let type = this.get('type');
    let self = this;
    var data = this.get('data_search')
    var placeholder = this.get("placeHolder")



    if(placeholder === null){
      placeholder = this.get('i18n').t(`pageheader.search_placeholder.${type}`).string
    }

    if(data === undefined){
      data = [];
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
      containerCssClass: "flex-fill",
      templateSelection: function (data, container) {
        $(data.element).attr('data-key', data.key);
        return data.text;
      }
    });

    $eventSelect.on("select2:select", function (e) {

      let id = $eventSelect.val();
      let text= $(`#${id_select} option:selected`).text();
      let type = self.get('type');

      if(id !== ""){
        if(type === 'location') {
          self.sendAction('transitionLocation', id);
        } else if (type === 'product') {
          self.sendAction('transitionProduct', id);
        } else if (type === 'locations_route') {
          self.sendAction('transitionLocationRoute', id);
        } else if (type === 'industry') {
          self.sendAction('transitionIndustry', id);
        } else if (type === 'products_route') {
          self.sendAction('transitionProductsRoute', id);
        } else if (type === 'rural') {

          var key = $(`#${id_select}`).find(':selected').data("key").replace('-', '')
          var action = `transition${key.charAt(0).toUpperCase() + key.slice(1)}`

          self.sendAction(action, id);

        } else if (type === 'search') {
          self.set('search', text);
          self.set("buildermodSearchService.search", text);
        }
      }

    });
  }),
  didInsertElement: function() {
    Ember.run.scheduleOnce('afterRender', this , function() {

      this.get("runSelect");
      this.get("buildermodSearchService.search");

    });
  },
  update: observer('i18n.display', 'data_search', 'buildermodSearchService.search', function() {

    //console.log("autocomplete")

    let id_select = this.get('idSelect');
    var buildermodSearchService = this.get("buildermodSearchService.search");
    var $eventSelect = $(`#${id_select}`);
    var placeholder = this.get("placeHolder");
    let type = this.get('type');
    var data = this.get('data_search');
    var self = this;

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
      data: data,
      containerCssClass: "flex-fill",
      templateSelection: function (data, container) {
        $(data.element).attr('data-key', data.key);
        return data.text;
      }
    });

    let val = $eventSelect.find("option:contains('"+buildermodSearchService+"')").val();

    if(val !== undefined){
      $eventSelect.val(val).trigger('change.select2');
      let text= $(`#${id_select} option:selected`).text();
      if (type === 'search') {
        this.set('search', text);
      }
    }

    $eventSelect.on("select2:select", function (e) {

      let id = $eventSelect.val();
      let text= $(`#${id_select} option:selected`).text();

      if(id !== ""){
        if(type === 'location') {
          self.sendAction('transitionLocation', id);
        } else if (type === 'product') {
          self.sendAction('transitionProduct', id);
        } else if (type === 'locations_route') {
          self.sendAction('transitionLocationRoute', id);
        } else if (type === 'industry') {
          self.sendAction('transitionIndustry', id);
        } else if (type === 'products_route') {
          self.sendAction('transitionProductsRoute', id);
        } else if (type === 'rural') {

          var key = $(`#${id_select}`).find(':selected').data("key").replace('-', '')
          var action = `transition${key.charAt(0).toUpperCase() + key.slice(1)}`

          self.sendAction(action, id);

        } else if (type === 'search') {
          self.set('search', text);
          self.set("buildermodSearchService.search", text);
        }
      }

    });

  }),
  updatebuildermodSearchService: observer('buildermodSearchService.search', function () {
    if(this.get("buildermodSearchService.search") === null){
      let id_select = this.get('idSelect');
      var $eventSelect = $(`#${id_select}`);
      $eventSelect.val('');
      $eventSelect.trigger('change');
    }
  }),
  actions: {
    reset: function() {
      this.set('search', null);
      this.set("buildermodSearchService.search", null);

      let id_select = this.get('idSelect');
      var $eventSelect = $(`#${id_select}`);
      $eventSelect.val('');
      $eventSelect.trigger('change');
    }
  }
});
